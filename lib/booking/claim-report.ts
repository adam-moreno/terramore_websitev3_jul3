/**
 * Booking → free website check: the database side.
 * Claims the report for this email on website.free_courses_signups (report_status = "generating") so it never runs
 * twice, creating the lead row the same way /api/report does when there is none. Never throws.
 */

import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"
import { reportAlreadyUnderway, type BookingLink } from "@/lib/booking/report-check"
import { recordReportSubmitted } from "@/lib/report/stage-events"

export type BookingReportLead = {
  name: string
  email: string
  phone: string | null
  business: string | null
}

export type BookingReportClaim = {
  /** True only when this call claimed the report: the caller must run the pipeline. */
  run: boolean
  /** The email already has a report sent or being written (prep note says "skim it"). null = unknown. */
  hasReport: boolean | null
}

function isUniqueViolation(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false
  return error.code === "23505" || /duplicate key|unique constraint/i.test(error.message || "")
}

function splitName(name: string): { first: string; last: string } {
  const [first, ...rest] = name.trim().split(/\s+/)
  return { first: first || name, last: rest.join(" ") || "-" }
}

/**
 * For a website: claim the report (insert the lead row, or flip an existing row to "generating" only when it has no
 * report sent or underway). For a social or Google link: save it on the row's socials when a row exists; no report.
 */
export async function claimBookingReport(lead: BookingReportLead, link: BookingLink): Promise<BookingReportClaim> {
  try {
    const supabase = getServerSupabase()
    // Without the database there is no way to keep it to one report per email, so don't start one.
    if (!supabase || link.kind === "none") return { run: false, hasReport: null }

    const existing = await supabase.from("free_courses_signups").select("id, report_status, socials").eq("email", lead.email).maybeSingle()
    if (existing.error) {
      console.warn(`[booking-report] lookup failed, no report started: ${existing.error.message}`)
      return { run: false, hasReport: null }
    }
    const row = existing.data as { id?: string; report_status?: string | null; socials?: string | null } | null
    const busy = reportAlreadyUnderway(row?.report_status)

    if (link.kind === "social") {
      if (row?.id && !row.socials) {
        const { error } = await supabase.from("free_courses_signups").update({ socials: link.url }).eq("id", row.id)
        if (error && !isMissingColumnError(error)) console.warn(`[booking-report] socials not saved: ${error.message}`)
      }
      return { run: false, hasReport: busy ? true : null }
    }

    if (busy) return { run: false, hasReport: true }

    if (row?.id) {
      const details: Record<string, unknown> = { report_status: "generating", website: link.website }
      if (lead.business) details.business_name = lead.business
      if (lead.phone) details.phone = lead.phone
      // Conditional on the status so two bookings at once can't both start a report.
      const { data, error } = await supabase
        .from("free_courses_signups")
        .update(details)
        .eq("id", row.id)
        .or("report_status.is.null,report_status.not.in.(sent,generating)")
        .select("id")
      if (error) {
        console.warn(`[booking-report] could not claim the report, none started: ${error.message}`)
        return { run: false, hasReport: null }
      }
      return Array.isArray(data) && data.length > 0 ? { run: true, hasReport: false } : { run: false, hasReport: true }
    }

    const { first, last } = splitName(lead.name)
    const submittedAt = new Date().toISOString()
    const company = [lead.business, link.website, lead.phone ? `phone:${lead.phone}` : ""].filter(Boolean).join(" · ") || null
    // Same row shape and source as /api/report, so the report's dedupe and the dashboard see it as a report lead.
    // email_consent stays false: the booker didn't tick the report form's email box.
    const { data, error } = await supabase
      .from("free_courses_signups")
      .insert([
        {
          first_name: first,
          last_name: last,
          email: lead.email,
          company,
          phone: lead.phone,
          business_name: lead.business,
          website: link.website,
          email_consent: false,
          signup_source: "digital_footprint_report",
          course_type: "src=book",
          signup_date: submittedAt,
          status: "active",
          report_status: "generating",
        },
      ])
      .select("id")
      .maybeSingle()
    // Another request created the row a moment ago; it owns the report.
    if (error && isUniqueViolation(error)) return { run: false, hasReport: null }
    if (error) {
      console.warn(`[booking-report] lead row not created, no report started: ${error.message}`)
      return { run: false, hasReport: null }
    }
    if (data?.id) await recordReportSubmitted(String(data.id), submittedAt)
    return { run: true, hasReport: false }
  } catch (error) {
    console.warn(`[booking-report] skipped: ${error instanceof Error ? error.message : String(error)}`)
    return { run: false, hasReport: null }
  }
}
