/**
 * A returning owner (same email) can ask for a fresh report: they fixed something and want to see the new score.
 * One fresh report per REFRESH_AFTER_HOURS per email; inside that window, or while one is being written, the request
 * is still "already requested". Matches on phone or name (a different email) are never refreshed: that's a new
 * identity claiming an old lead, and stays a 409.
 */

import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"

export const REFRESH_AFTER_HOURS = 24
/** A report still "generating" this long after the request is treated as stuck, so the owner can try again. */
const GENERATING_STUCK_MINUTES = 30

export type RefreshDecision = "refresh" | "too_soon" | "in_progress"

export type RefreshRow = {
  report_status?: string | null
  report_sent_at?: string | null
  signup_date?: string | null
}

/** Pure (exported for scripts/verify-report-dedupe.mjs). */
export function refreshDecision(row: RefreshRow | null, now = Date.now()): RefreshDecision {
  if (!row) return "refresh"
  const sentAt = row.report_sent_at ? Date.parse(row.report_sent_at) : NaN
  if (Number.isFinite(sentAt) && now - sentAt < REFRESH_AFTER_HOURS * 60 * 60 * 1000) return "too_soon"
  if (row.report_status === "generating") {
    const requestedAt = row.signup_date ? Date.parse(row.signup_date) : NaN
    if (!Number.isFinite(sentAt) && Number.isFinite(requestedAt) && now - requestedAt < GENERATING_STUCK_MINUTES * 60 * 1000) {
      return "in_progress"
    }
  }
  return "refresh"
}

/**
 * Reads the lead row for `email` and decides. When refreshing, the row takes the website and business name the owner
 * just typed (they may have moved site), so the dashboard's report-lead emails follow the new report.
 * Fails closed to "too_soon" on a read error, so a database blip never sends a second report.
 */
export async function decideReportRefresh(
  email: string,
  update: { website: string | null; businessName: string | null },
): Promise<RefreshDecision> {
  const supabase = getServerSupabase()
  if (!supabase) return "too_soon"
  const { data, error } = await supabase
    .from("free_courses_signups")
    .select("report_status,report_sent_at,signup_date")
    .eq("email", email)
    .maybeSingle()
  if (error) {
    console.error("[report] refresh lookup failed:", error.message)
    return "too_soon"
  }
  const decision = refreshDecision(data as RefreshRow | null)
  if (decision !== "refresh") return decision
  const patch: Record<string, string> = {}
  if (update.website) patch.website = update.website
  if (update.businessName) patch.business_name = update.businessName
  if (Object.keys(patch).length) {
    const { error: updateError } = await supabase.from("free_courses_signups").update(patch).eq("email", email)
    if (updateError && !isMissingColumnError(updateError)) console.error("[report] refresh row update failed:", updateError.message)
  }
  return decision
}
