import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"
import { SITE_URL } from "@/lib/booking-api"
import { emailButton, emailP, emailShell, emailSignoff } from "@/lib/email-template"
import { ADMIN_EMAIL, REPLY_TO, emailProvider, postSlack, sendEmail } from "@/lib/notify"
import { collectDiagnostic } from "@/lib/report/diagnostic"
import { renderReportPdf } from "@/lib/report/pdf"
import { sendReportDeliveredSms } from "@/lib/report/sms"
import { modelProvider, reportToText, writeReportFromDiagnostic } from "@/lib/report/write"

export type ReportRequest = {
  name: string
  email: string
  businessName: string
  website: string | null
  phone?: string | null
  answers?: string | null
}

export type ReportStatus = "needs_keys" | "generating" | "sent" | "failed"

/** Canonical host is www (apex 308s to it), so the button never bounces through a redirect. */
const BOOK_URL = `${SITE_URL}/book`

export type PipelineResult = {
  ok: boolean
  status: ReportStatus
  error?: string
  model?: string
  missing?: string[]
}

/** Keys the pipeline cannot run without. Places, Slack, and SMS are optional. */
export function missingReportKeys(): string[] {
  const missing: string[] = []
  if (!modelProvider()) missing.push("OPENAI_API_KEY or ANTHROPIC_API_KEY")
  if (!emailProvider()) missing.push("RESEND_API_KEY or SENDGRID_API_KEY or POSTMARK_SERVER_TOKEN")
  return missing
}

/**
 * Persists progress on the lead row. Uses report_status / report_text / report_sent_at when the
 * migration in supabase/migrations has run. Without it, falls back to the legacy status column for
 * needs_keys and failed so the row still says something went wrong.
 */
async function saveReportState(
  email: string,
  status: ReportStatus,
  extra: { text?: string; error?: string; reportJson?: unknown } = {},
) {
  const supabase = getServerSupabase()
  if (!supabase) return

  const full: Record<string, unknown> = { report_status: status }
  if (extra.text) full.report_text = extra.text
  if (extra.reportJson) full.report_json = extra.reportJson
  if (status === "sent") full.report_sent_at = new Date().toISOString()
  if (extra.error) full.report_error = extra.error.slice(0, 500)

  const { error } = await supabase.from("free_courses_signups").update(full).eq("email", email)
  if (!error) return

  if (isMissingColumnError(error)) {
    // Retry without optional MVP columns if migration not applied yet.
    if (extra.reportJson) {
      const withoutJson: Record<string, unknown> = { report_status: status }
      if (extra.text) withoutJson.report_text = extra.text
      if (status === "sent") withoutJson.report_sent_at = new Date().toISOString()
      if (extra.error) withoutJson.report_error = extra.error.slice(0, 500)
      const retry = await supabase.from("free_courses_signups").update(withoutJson).eq("email", email)
      if (!retry.error) {
        console.warn("[report] report_json column missing. Run supabase/migrations/20260916_report_diagnostic.sql.")
        return
      }
      if (!isMissingColumnError(retry.error)) {
        console.error("[report] could not save report state:", retry.error.message)
        return
      }
    }
    console.warn("[report] report_* columns missing. Run supabase/migrations/20260911_report_pipeline.sql.")
    if (status === "needs_keys" || status === "failed") {
      const fallback = await supabase.from("free_courses_signups").update({ status }).eq("email", email)
      if (fallback.error) console.error("[report] status fallback failed:", fallback.error.message)
    }
    return
  }
  console.error("[report] could not save report state:", error.message)
}

function safeFilename(value: string): string {
  const base = value.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "report"
  return `Terramore-Digital-Footprint-${base}.pdf`
}

/**
 * Collects public evidence, scores deterministically, writes consulting prose, renders PDF, emails it.
 * Never throws. Every exit path is logged and stored on the row. Lead 201 path is unchanged.
 */
export async function runReportPipeline(request: ReportRequest): Promise<PipelineResult> {
  const missing = missingReportKeys()
  if (missing.length) {
    console.warn(`[report] needs keys for ${request.email}: ${missing.join("; ")}`)
    await saveReportState(request.email, "needs_keys", { error: `Missing ${missing.join("; ")}` })
    await postSlack(`Report for ${request.name} <${request.email}> not generated. Missing env: ${missing.join("; ")}. Send it by hand.`)
    return { ok: false, status: "needs_keys", missing, error: `Missing ${missing.join("; ")}` }
  }

  await saveReportState(request.email, "generating")
  const started = Date.now()

  try {
    const diagnostic = await collectDiagnostic(request.businessName, request.website)
    const report = await writeReportFromDiagnostic(diagnostic)
    const text = reportToText(report)
    const pdf = await renderReportPdf(report)

    const first = request.name.split(/\s+/)[0] || "there"
    const subjectName = report.businessName
    const scopeLine = "It only says what we could see on the public web. If a chapter is thin, reply with a link and we read it."
    // The PDF is the deliverable; the report text stays on the Supabase row, not in the email body.
    const emailResult = await sendEmail({
      to: request.email,
      bcc: ADMIN_EMAIL,
      // Replies to the report land with Adam (EMAIL_REPLY_TO), not the no-reply sender.
      replyTo: REPLY_TO,
      subject: `Your Digital Footprint report: ${subjectName}`,
      text: [
        `Hi ${first},`,
        "",
        `Your Digital Footprint report for ${subjectName} is attached as a PDF.`,
        "",
        scopeLine,
        "",
        `Talk through my report: ${BOOK_URL}`,
        "",
        "Adam Moreno",
        "Terramore",
      ].join("\n"),
      html: emailShell({
        heading: "Your Digital Footprint report",
        previewText: `${subjectName}: the PDF is attached.`,
        bodyHtml: [
          emailP(`Hi ${first},`),
          emailP(`Your Digital Footprint report for ${subjectName} is attached as a PDF.`),
          emailP(scopeLine),
          emailButton("Talk through my report", BOOK_URL),
          emailSignoff("Adam Moreno", "Terramore"),
        ].join(""),
      }),
      attachments: [{ filename: safeFilename(subjectName), content: pdf, contentType: "application/pdf" }],
    })

    const reportJson = {
      version: 2,
      overallScore: report.overallScore,
      evidenceCoverage: report.evidenceCoverage,
      scoreFactors: report.scoreFactors,
      recommendations: report.recommendations,
      evidenceAppendix: report.evidenceAppendix,
      competitiveNote: report.competitiveNote,
      disclaimers: report.disclaimers,
      diagnostic,
      model: report.model,
      readAt: diagnostic.readAt,
    }

    if (!emailResult.ok) {
      await saveReportState(request.email, "failed", {
        text,
        error: `Email failed: ${emailResult.error || "unknown"}`,
        reportJson,
      })
      await postSlack(`Report for ${request.name} <${request.email}> was written (${report.model}) but the email failed: ${emailResult.error}. Text is on the row.`)
      return { ok: false, status: "failed", model: report.model, error: emailResult.error }
    }

    await saveReportState(request.email, "sent", { text, reportJson })
    console.info(
      `[report] sent to ${request.email} via ${emailResult.channel} using ${report.model} score=${report.overallScore} coverage=${report.evidenceCoverage}% in ${Date.now() - started}ms`,
    )
    await postSlack(
      `Report sent to ${request.name} <${request.email}> for ${subjectName} (score ${report.overallScore ?? "n/a"}, coverage ${report.evidenceCoverage}%, ${report.model}, ${Math.round((Date.now() - started) / 1000)}s). Copy is in your inbox.`,
    )

    // Message 2 — fail soft; never blocks delivery success.
    let phone = request.phone || null
    if (!phone) {
      const supabase = getServerSupabase()
      if (supabase) {
        const { data } = await supabase.from("free_courses_signups").select("phone,company").eq("email", request.email).maybeSingle()
        phone = (data?.phone as string | null) || null
        if (!phone && data?.company) {
          const match = String(data.company).match(/phone:([+\d().\-\s]+)/i)
          if (match) phone = match[1]
        }
      }
    }
    await sendReportDeliveredSms({ email: request.email, name: request.name, phone })

    return { ok: true, status: "sent", model: report.model }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[report] failed for ${request.email}:`, message)
    await saveReportState(request.email, "failed", { error: message })
    await postSlack(`Report for ${request.name} <${request.email}> failed: ${message.slice(0, 300)}. Send it by hand.`)
    return { ok: false, status: "failed", error: message }
  }
}
