/**
 * Append-only stage history for a Digital Footprint report row.
 * Missing table is a no-op so report submit still succeeds before the migration runs.
 */

import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"

function isMissingRelation(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /could not find the table|relation .* does not exist|schema cache/i.test(error.message || "")
  )
}

/** Record report_submitted. Does not throw. Does not change the signup row. */
export async function recordReportSubmitted(signupId: string, occurredAt: string): Promise<void> {
  if (!signupId) return
  try {
    const supabase = getServerSupabase()
    if (!supabase) return
    const { error } = await supabase.from("report_stage_events").insert({
      signup_id: signupId,
      event_type: "report_submitted",
      occurred_at: occurredAt,
      source: "report_submit",
    })
    if (!error) return
    if (isMissingRelation(error) || isMissingColumnError(error)) {
      console.info("[report] report_stage_events is not available yet. Run the stage-events migration.")
      return
    }
    console.error("[report] could not record report_submitted:", error.message)
  } catch (error) {
    console.error("[report] could not record report_submitted:", error)
  }
}
