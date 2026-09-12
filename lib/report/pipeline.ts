import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"
import { ADMIN_EMAIL, REPLY_TO, emailProvider, postSlack, sendEmail } from "@/lib/notify"
import { footprintToFacts, readFootprint } from "@/lib/report/footprint"
import { renderReportPdf } from "@/lib/report/pdf"
import { modelProvider, reportToText, writeReport } from "@/lib/report/write"

export type ReportRequest = {
  name: string
  email: string
  businessName: string
  website: string | null
  answers?: string | null
}

export type ReportStatus = "needs_keys" | "generating" | "sent" | "failed"

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
async function saveReportState(email: string, status: ReportStatus, extra: { text?: string; error?: string } = {}) {
  const supabase = getServerSupabase()
  if (!supabase) return

  const full: Record<string, unknown> = { report_status: status }
  if (extra.text) full.report_text = extra.text
  if (status === "sent") full.report_sent_at = new Date().toISOString()
  if (extra.error) full.report_error = extra.error.slice(0, 500)

  const { error } = await supabase.from("free_courses_signups").update(full).eq("email", email)
  if (!error) return

  if (isMissingColumnError(error)) {
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
 * Reads the public footprint, writes the four chapters, renders the PDF, and emails it to the
 * requester with a copy to Adam. Never throws. Every exit path is logged and stored on the row.
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
    const footprint = await readFootprint(request.businessName, request.website)
    const facts = footprintToFacts(footprint)
    const report = await writeReport({ businessName: request.businessName, website: footprint.input.website, facts })
    const text = reportToText(report)
    const pdf = await renderReportPdf(report)

    const first = request.name.split(/\s+/)[0] || "there"
    const subjectName = report.businessName
    const emailResult = await sendEmail({
      to: request.email,
      bcc: ADMIN_EMAIL,
      // Replies to the report land with Adam (EMAIL_REPLY_TO), not the no-reply sender.
      replyTo: REPLY_TO,
      subject: `Your Digital Footprint report: ${subjectName}`,
      text: [
        `Hi ${first},`,
        "",
        `Here is the Digital Footprint report for ${subjectName}. The PDF is attached.`,
        "",
        "It says only what we could see on the public web. Anything marked Not found was not visible to us. If a chapter is thin, reply with a link and we read it.",
        "",
        "Want it fixed? Pick a time: https://terramore.io/book",
        "",
        "Adam Moreno",
        "Terramore",
        "",
        "----",
        "",
        text,
      ].join("\n"),
      attachments: [{ filename: safeFilename(subjectName), content: pdf, contentType: "application/pdf" }],
    })

    if (!emailResult.ok) {
      await saveReportState(request.email, "failed", { text, error: `Email failed: ${emailResult.error || "unknown"}` })
      await postSlack(`Report for ${request.name} <${request.email}> was written (${report.model}) but the email failed: ${emailResult.error}. Text is on the row.`)
      return { ok: false, status: "failed", model: report.model, error: emailResult.error }
    }

    await saveReportState(request.email, "sent", { text })
    console.info(`[report] sent to ${request.email} via ${emailResult.channel} using ${report.model} in ${Date.now() - started}ms`)
    await postSlack(`Report sent to ${request.name} <${request.email}> for ${subjectName} (${report.model}, ${Math.round((Date.now() - started) / 1000)}s). Copy is in your inbox.`)
    return { ok: true, status: "sent", model: report.model }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[report] failed for ${request.email}:`, message)
    await saveReportState(request.email, "failed", { error: message })
    await postSlack(`Report for ${request.name} <${request.email}> failed: ${message.slice(0, 300)}. Send it by hand.`)
    return { ok: false, status: "failed", error: message }
  }
}
