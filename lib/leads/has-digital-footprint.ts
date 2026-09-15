import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"

/**
 * Whether this email already submitted (or received) a Digital Footprint report.
 * Lookup is email-primary on `free_courses_signups` (unique on email).
 * Returns null when Supabase is unavailable or the query fails — callers should soft-CTA.
 */
export async function leadHasDigitalFootprintReport(email: string): Promise<boolean | null> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null

  const supabase = getServerSupabase()
  if (!supabase) return null

  const full = await supabase
    .from("free_courses_signups")
    .select("signup_source, report_status, report_sent_at")
    .eq("email", normalized)
    .maybeSingle()

  if (full.error && isMissingColumnError(full.error)) {
    const basic = await supabase
      .from("free_courses_signups")
      .select("signup_source")
      .eq("email", normalized)
      .maybeSingle()
    if (basic.error) {
      console.warn(`[leads] DFR lookup failed: ${basic.error.message}`)
      return null
    }
    if (!basic.data) return false
    return basic.data.signup_source === "digital_footprint_report"
  }

  if (full.error) {
    console.warn(`[leads] DFR lookup failed: ${full.error.message}`)
    return null
  }
  if (!full.data) return false

  const row = full.data as {
    signup_source?: string | null
    report_status?: string | null
    report_sent_at?: string | null
  }
  if (row.signup_source === "digital_footprint_report") return true
  if (row.report_status === "sent" || row.report_sent_at) return true
  return false
}
