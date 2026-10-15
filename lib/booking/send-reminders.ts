/**
 * Sends due pre-call reminders (24h / 2h / 30m) from website.booking_scheduled_emails, every 5 minutes from
 * /api/cron/booking-reminders. Each row is claimed (scheduled → sending) so overlapping runs can't send it twice. Then
 * the booking is read from Terra IQ with its manage token, and the reminder only goes out if the call is still on, at
 * the time the row was queued for. Canceled or moved calls get nothing: that's the point of sending it ourselves
 * (the website's Resend key can only send, so a provider-scheduled email couldn't be withdrawn).
 *
 * The owner's name and email aren't stored on the row; they come from the booking at send time.
 * Never throws; every outcome is kept on the row (sent, send_failed, canceled with the reason, skipped).
 */

import { bookingApi, manageUrl, type BookingRecord } from "@/lib/booking-api"
import { buildBookingReminder, OWN_SENDER, type ReminderKind } from "@/lib/booking-reminders"
import { leadHasDigitalFootprintReport } from "@/lib/leads/has-digital-footprint"
import { type BookingNotice, type SendResult, sendEmail } from "@/lib/notify"
import { getServerSupabase } from "@/lib/supabase-server"

const TABLE = "booking_scheduled_emails"
/** A reminder more than this late is dropped, not sent ("in 2 hours" an hour late helps nobody). */
export const LATE_LIMIT_MS = 30 * 60 * 1000
/** A booking whose start moved by more than this is a different call: its old reminders are dropped. */
const MOVED_MS = 60 * 1000
const BATCH = 25

export type DueRow = {
  id: string
  booking_id: string
  kind: string
  send_at: string
  visitor_tz: string | null
  has_phone: boolean | null
  manage_token: string | null
  start_iso: string | null
}

export type RowOutcome = "sent" | "send_failed" | "canceled" | "skipped" | "retry"

export type BookingLookup = { ok: true; booking: BookingRecord } | { ok: false; status: number; error: string }

export type SenderDeps = {
  /** Flips due rows from scheduled to sending and returns the ones this run now owns. */
  claimDue(nowIso: string, limit: number): Promise<DueRow[]>
  booking(token: string): Promise<BookingLookup>
  hasReport(email: string): Promise<boolean | null>
  send(input: { to: string; subject: string; text: string; html: string }): Promise<SendResult>
  /** Final status, or back to "scheduled" for a retry next run. */
  mark(id: string, status: "sent" | "send_failed" | "canceled" | "skipped" | "scheduled", error?: string): Promise<void>
  now(): number
}

const KINDS = new Set<string>(["24h", "10h", "2h", "30m", "2m"])

/** What to do with one claimed row. Pure, exported for scripts/verify-booking-emails.mjs. */
export function decideReminder(
  row: DueRow,
  lookup: BookingLookup | null,
  nowMs: number,
): { outcome: "send"; booking: BookingRecord } | { outcome: Exclude<RowOutcome, "sent" | "send_failed">; reason: string } {
  if (!KINDS.has(row.kind)) return { outcome: "skipped", reason: `not a reminder (${row.kind})` }
  if (!row.manage_token) return { outcome: "skipped", reason: "no manage token" }
  if (nowMs - Date.parse(row.send_at) > LATE_LIMIT_MS) return { outcome: "skipped", reason: "too late" }
  if (!lookup) return { outcome: "retry", reason: "booking not read" }
  // `in` checks: this project isn't in strict mode, so `!lookup.ok` doesn't narrow the union.
  if (!("booking" in lookup)) {
    // Unknown token: the booking is gone. Anything else (Terra IQ down) is retried next run, until it's too late.
    if (lookup.status === 401 || lookup.status === 404) return { outcome: "canceled", reason: "booking not found" }
    return { outcome: "retry", reason: `booking not read (${lookup.status} ${lookup.error})` }
  }
  const b = lookup.booking
  if (b.status && b.status !== "scheduled") return { outcome: "canceled", reason: `booking ${b.status}` }
  const start = Date.parse(b.startIso)
  if (!Number.isFinite(start) || start <= nowMs) return { outcome: "skipped", reason: "call already started" }
  if (row.start_iso && Math.abs(start - Date.parse(row.start_iso)) > MOVED_MS) return { outcome: "canceled", reason: "booking moved" }
  if (!b.email?.trim()) return { outcome: "skipped", reason: "no email on the booking" }
  return { outcome: "send", booking: b }
}

function defaultDeps(): SenderDeps {
  return {
    async claimDue(nowIso, limit) {
      const supabase = getServerSupabase()
      if (!supabase) return []
      const { data, error } = await supabase
        .from(TABLE)
        .select("id")
        .eq("provider", OWN_SENDER)
        .eq("status", "scheduled")
        .lte("send_at", nowIso)
        .order("send_at", { ascending: true })
        .limit(limit)
      if (error) {
        console.warn(`[booking-reminders] due rows not read (run 20261015_booking_reminders_own_sender.sql?): ${error.message}`)
        return []
      }
      const claimed: DueRow[] = []
      for (const { id } of (data ?? []) as Array<{ id: string }>) {
        // Only the run that flips scheduled → sending sends it.
        const { data: row, error: claimError } = await supabase
          .from(TABLE)
          .update({ status: "sending", updated_at: new Date().toISOString() })
          .eq("id", id)
          .eq("status", "scheduled")
          .select("id, booking_id, kind, send_at, visitor_tz, has_phone, manage_token, start_iso")
          .maybeSingle()
        if (claimError) console.warn(`[booking-reminders] claim failed: ${claimError.message}`)
        else if (row) claimed.push(row as DueRow)
      }
      return claimed
    },
    async booking(token) {
      const result = await bookingApi<{ ok: boolean; booking: BookingRecord }>(`/api/public/booking/manage?token=${encodeURIComponent(token)}`)
      if ("data" in result) return { ok: true, booking: result.data.booking }
      return { ok: false, status: result.status, error: "error" in result ? result.error : "unknown" }
    },
    hasReport: (email) => leadHasDigitalFootprintReport(email),
    send: (input) => sendEmail(input),
    async mark(id, status, error) {
      const supabase = getServerSupabase()
      if (!supabase) return
      const { error: updateError } = await supabase
        .from(TABLE)
        .update({ status, error: error ? error.slice(0, 500) : null, updated_at: new Date().toISOString() })
        .eq("id", id)
      if (updateError) console.warn(`[booking-reminders] status not saved: ${updateError.message}`)
    },
    now: () => Date.now(),
  }
}

export type SendRunResult = { claimed: number; sent: number; failed: number; canceled: number; skipped: number; retry: number }

/** One cron run. Never throws. */
export async function sendDueReminders(deps: SenderDeps = defaultDeps()): Promise<SendRunResult> {
  const out: SendRunResult = { claimed: 0, sent: 0, failed: 0, canceled: 0, skipped: 0, retry: 0 }
  let rows: DueRow[] = []
  try {
    rows = await deps.claimDue(new Date(deps.now()).toISOString(), BATCH)
  } catch (error) {
    console.warn(`[booking-reminders] claim failed: ${error instanceof Error ? error.message : String(error)}`)
    return out
  }
  out.claimed = rows.length
  for (const row of rows) {
    try {
      const lookup = row.manage_token ? await deps.booking(row.manage_token).catch(() => null) : null
      const decision = decideReminder(row, lookup, deps.now())
      if (decision.outcome !== "send") {
        out[decision.outcome]++
        await deps.mark(row.id, decision.outcome === "retry" ? "scheduled" : decision.outcome, decision.reason)
        continue
      }
      const b = decision.booking
      const email = b.email!.trim()
      const notice: BookingNotice = {
        name: b.name?.trim() || "",
        email,
        // Reminder copy only checks whether a phone was given.
        phone: row.has_phone ? "on file" : null,
        startIso: b.startIso,
        endIso: b.endIso,
        tz: row.visitor_tz || b.ownerTz || "America/Los_Angeles",
        meetUrl: b.meetUrl,
        meetProvider: b.meetProvider,
        manageUrl: manageUrl(row.manage_token!),
      }
      const built = buildBookingReminder(row.kind as ReminderKind, notice, { hasReport: await deps.hasReport(email).catch(() => null) })
      const result = await deps.send({ to: email, subject: built.subject, text: built.text, html: built.html })
      if (result.ok && !result.skipped) {
        out.sent++
        await deps.mark(row.id, "sent")
      } else {
        out.failed++
        await deps.mark(row.id, "send_failed", result.error || (result.skipped ? "no email provider" : "unknown"))
      }
    } catch (error) {
      out.failed++
      await deps.mark(row.id, "send_failed", error instanceof Error ? error.message : String(error)).catch(() => undefined)
    }
  }
  return out
}
