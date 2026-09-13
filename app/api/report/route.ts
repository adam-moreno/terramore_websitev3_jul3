import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { getServerSupabase, isMissingColumnError, supabaseTableUrl } from "@/lib/supabase-server"
import { confirmLeadToUser, notifyAdminOfLead } from "@/lib/notify"
import { enrollLead } from "@/lib/nurture/enroll"
import { businessTypeFromReportAnswers } from "@/lib/nurture/map-links"
import { runReportPipeline } from "@/lib/report/pipeline"

// The pipeline fetches the site, calls a model, renders a PDF, and sends an email.
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const website = String(body.website || "").trim()
    const businessName = String(body.businessName || "").trim()

    // Optional qualifying answers from the popup, e.g. { site: "yes", type: "local", marketing: "one" }.
    // Stored in the unused course_type column as "site=yes; type=local; marketing=one" (max 100 chars).
    const rawAnswers = body.answers && typeof body.answers === "object" ? body.answers : {}
    const answerSummary = Object.entries(rawAnswers as Record<string, unknown>)
      .filter(([, value]) => typeof value === "string" && value)
      .map(([key, value]) => `${key}=${String(value)}`.replace(/[^a-z0-9_=]/gi, ""))
      .join("; ")
      .slice(0, 100)

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const [firstName, ...rest] = name.split(/\s+/)
    const lastName = rest.join(" ") || "-"
    const company = [businessName, website].filter(Boolean).join(" · ") || null

    let rowId: string | null = null
    const supabase = getServerSupabase()
    if (supabase) {
      const { data: existing } = await supabase.from("free_courses_signups").select("id").eq("email", email).maybeSingle()

      if (existing?.id) {
        rowId = String(existing.id)
      } else {
        const { data, error } = await supabase
          .from("free_courses_signups")
          .insert([
            {
              first_name: firstName,
              last_name: lastName,
              email,
              company,
              email_consent: true,
              signup_source: "digital_footprint_report",
              course_type: answerSummary || null,
              signup_date: new Date().toISOString(),
              status: "active",
            },
          ])
          .select("id")
          .maybeSingle()

        if (error) {
          console.error("Report signup insert failed:", error)
        } else if (data?.id) {
          rowId = String(data.id)
        }
      }

      // Dedicated columns exist once supabase/migrations/20260911_report_pipeline.sql has run.
      if (businessName || website) {
        const { error } = await supabase
          .from("free_courses_signups")
          .update({ business_name: businessName || null, website: website || null })
          .eq("email", email)
        if (error && !isMissingColumnError(error)) console.error("Report signup detail update failed:", error)
      }
    } else {
      console.info("Report lead (no Supabase):", { name, email, website, businessName, answers: answerSummary })
    }

    // Everything below runs after the response is sent. Failures are logged and never reach the form.
    after(async () => {
      const lead = {
        kind: "report" as const,
        name,
        email,
        business: businessName || null,
        website: website || null,
        details: { Answers: answerSummary || "none" },
        rowId,
        tableUrl: supabaseTableUrl("free_courses_signups"),
      }
      await Promise.all([notifyAdminOfLead(lead), confirmLeadToUser(lead)])
      await enrollLead({
        email,
        name,
        source: "report",
        businessType: businessTypeFromReportAnswers(answerSummary),
        businessName: businessName || null,
        website: website || null,
      })
      await runReportPipeline({ name, email, businessName, website: website || null, answers: answerSummary || null })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Report API error:", error)
    return NextResponse.json({ success: true }, { status: 201 })
  }
}
