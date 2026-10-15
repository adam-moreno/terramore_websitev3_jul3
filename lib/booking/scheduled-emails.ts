/**
 * Withdraw a booking's scheduled emails (prep note + 24h/2h/30m reminders) when the call is canceled or moved.
 *
 * At booking time the provider handle of each scheduled email is stored in website.booking_scheduled_emails
 * (supabase/migrations/20261014_booking_scheduled_emails.sql). On cancel each one still in the future is withdrawn
 * (Resend: POST /emails/{id}/cancel; SendGrid: cancel its batch_id). On reschedule the old ones are withdrawn, then
 * reminders are scheduled for the new time (same 24h/2h/30m rules) and recorded. The prep note isn't sent again.
 *
 * Fail-soft: nothing here throws or blocks the cancel/reschedule; every failure is logged and kept on the row.
 * Limits: bookings made before this shipped (or before the migration ran) have no stored ids, so their reminders
 * can't be withdrawn and may still arrive for the old time. Provider scheduling has no "check the booking first" hook.
 * Postmark can't schedule at all (it sends immediately), so there is nothing to withdraw there.
 */

import { getServerSupabase } from "@/lib/supabase-server"
import { leadHasDigitalFootprintReport } from "@/lib/leads/has-digital-footprint"
import type { BookingNotice, SendResult } from "@/lib/notify"
import { providerOf, scheduleBookingReminders, type ScheduledMessage, type ScheduleRemindersResult } from "@/lib/booking-reminders"

const TABLE = "booking_scheduled_emails"

export type ScheduledRow = {
  id: string
  kind: string
  provider: string
  message_id: string | null
  send_at: string
  visitor_tz: string | null
  has_phone: boolean | null
}

export type CancelOutcome = { ok: boolean; error?: string }

export type ScheduledEmailDeps = {
  list(bookingId: string): Promise<ScheduledRow[] | null>
  mark(id: string, status: "canceled" | "cancel_failed" | "not_cancelable", error?: string): Promise<void>
  insert(rows: Array<Omit<ScheduledRow, "id"> & { booking_id: string }>): Promise<void>
  cancelMessage(provider: string, messageId: string): Promise<CancelOutcome>
  schedule(notice: BookingNotice, opts: { hasReport: boolean | null }): Promise<ScheduleRemindersResult>
  hasReport(email: string): Promise<boolean | null>
  now(): number
}

/** Calls the provider's cancel endpoint. Never throws. `fetchImpl` is for tests. */
export async function cancelProviderMessage(provider: string, messageId: string, fetchImpl: typeof fetch = fetch): Promise<CancelOutcome> {
  try {
    if (provider === "resend") {
      const key = process.env.RESEND_API_KEY
      if (!key) return { ok: false, error: "no RESEND_API_KEY" }
      const response = await fetchImpl(`https://api.resend.com/emails/${encodeURIComponent(messageId)}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}` },
      })
      if (response.ok) return { ok: true }
      return { ok: false, error: `${response.status} ${(await response.text().catch(() => "")).slice(0, 200)}` }
    }
    if (provider === "sendgrid") {
      const key = process.env.SENDGRID_API_KEY
      if (!key) return { ok: false, error: "no SENDGRID_API_KEY" }
      const response = await fetchImpl("https://api.sendgrid.com/v3/user/scheduled_sends", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: messageId, status: "cancel" }),
      })
      if (response.ok) return { ok: true }
      return { ok: false, error: `${response.status} ${(await response.text().catch(() => "")).slice(0, 200)}` }
    }
    return { ok: false, error: `${provider} can't withdraw a scheduled email` }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

function defaultDeps(): ScheduledEmailDeps {
  return {
    async list(bookingId) {
      const supabase = getServerSupabase()
      if (!supabase) return null
      const { data, error } = await supabase
        .from(TABLE)
        .select("id, kind, provider, message_id, send_at, visitor_tz, has_phone")
        .eq("booking_id", bookingId)
        .eq("status", "scheduled")
      if (error) {
        console.warn(`[booking-emails] can't read scheduled emails (table missing? run 20261014_booking_scheduled_emails.sql): ${error.message}`)
        return null
      }
      return (data ?? []) as ScheduledRow[]
    },
    async mark(id, status, error) {
      const supabase = getServerSupabase()
      if (!supabase) return
      const { error: updateError } = await supabase
        .from(TABLE)
        .update({ status, error: error ? error.slice(0, 500) : null, updated_at: new Date().toISOString() })
        .eq("id", id)
      if (updateError) console.warn(`[booking-emails] status not saved: ${updateError.message}`)
    },
    async insert(rows) {
      if (rows.length === 0) return
      const supabase = getServerSupabase()
      if (!supabase) return
      const { error } = await supabase.from(TABLE).insert(rows)
      if (error) console.warn(`[booking-emails] ids not saved, these can't be withdrawn later (run 20261014_booking_scheduled_emails.sql?): ${error.message}`)
    },
    cancelMessage: (provider, messageId) => cancelProviderMessage(provider, messageId),
    schedule: (notice, opts) => scheduleBookingReminders(notice, opts),
    hasReport: (email) => leadHasDigitalFootprintReport(email),
    now: () => Date.now(),
  }
}

/** Rows for what a booking just scheduled. Emails without a provider id are still recorded (as not cancelable). */
export function rowsFor(
  bookingId: string,
  messages: ScheduledMessage[],
  context: { tz: string; hasPhone: boolean },
): Array<Omit<ScheduledRow, "id"> & { booking_id: string; status?: string }> {
  return messages.map((m) => ({
    booking_id: bookingId,
    kind: m.kind,
    provider: m.provider,
    message_id: m.messageId,
    send_at: m.sendAt,
    visitor_tz: context.tz,
    has_phone: context.hasPhone,
    ...(m.messageId ? {} : { status: "not_cancelable" }),
  }))
}

/** The prep note as a ScheduledMessage (sendBookingPrepEmail returns its send time). */
export function prepMessage(result: SendResult & { scheduledAt?: string }): ScheduledMessage | null {
  if (!result.ok || result.skipped || !result.scheduledAt) return null
  return { kind: "prep", provider: providerOf(result), messageId: result.messageId ?? null, sendAt: result.scheduledAt }
}

/** At booking time: keep the provider ids of everything scheduled. Never throws. */
export async function recordScheduledEmails(
  bookingId: string,
  messages: ScheduledMessage[],
  context: { tz: string; hasPhone: boolean },
  deps: ScheduledEmailDeps = defaultDeps(),
): Promise<void> {
  try {
    if (!bookingId || messages.length === 0) return
    await deps.insert(rowsFor(bookingId, messages, context))
  } catch (error) {
    console.warn(`[booking-emails] record failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export type WithdrawResult = {
  /** null: no record could be read (older booking or table missing). */
  rows: ScheduledRow[] | null
  canceled: number
  failed: number
}

/** Withdraws every still-future scheduled email of a booking. Never throws. */
export async function withdrawBookingEmails(bookingId: string, deps: ScheduledEmailDeps = defaultDeps()): Promise<WithdrawResult> {
  const out: WithdrawResult = { rows: null, canceled: 0, failed: 0 }
  try {
    const rows = await deps.list(bookingId)
    out.rows = rows
    if (!rows || rows.length === 0) {
      console.info(`[booking-emails] nothing recorded for booking ${bookingId}; older bookings' reminders can't be withdrawn`)
      return out
    }
    const now = deps.now()
    for (const row of rows) {
      if (!row.message_id) {
        await deps.mark(row.id, "not_cancelable", "no provider id")
        continue
      }
      if (new Date(row.send_at).getTime() <= now) {
        await deps.mark(row.id, "not_cancelable", "already sent")
        continue
      }
      const result = await deps
        .cancelMessage(row.provider, row.message_id)
        .catch((error: unknown): CancelOutcome => ({ ok: false, error: error instanceof Error ? error.message : String(error) }))
      if (result.ok) {
        out.canceled++
        await deps.mark(row.id, "canceled")
      } else {
        out.failed++
        console.warn(`[booking-emails] ${row.kind} for booking ${bookingId} not withdrawn: ${result.error || "unknown"}`)
        await deps.mark(row.id, "cancel_failed", result.error)
      }
    }
  } catch (error) {
    console.warn(`[booking-emails] withdraw failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  return out
}

export type RescheduledBooking = {
  id: string
  startIso: string
  endIso: string
  meetUrl: string | null
  meetProvider: "google_meet" | "teams" | null
  name?: string
  email?: string
  ownerTz?: string
}

/**
 * On reschedule: withdraw the old emails first, then schedule reminders for the new time and record them.
 * The visitor's time zone and whether they gave a phone come from the old rows (else the owner's zone). Never throws.
 */
export async function rescheduleBookingEmails(
  booking: RescheduledBooking,
  manageUrl: string,
  deps: ScheduledEmailDeps = defaultDeps(),
): Promise<{ withdrawn: WithdrawResult; scheduled: ScheduledMessage[] }> {
  const withdrawn = await withdrawBookingEmails(booking.id, deps)
  let scheduled: ScheduledMessage[] = []
  try {
    const email = booking.email?.trim()
    if (!email) {
      console.warn(`[booking-emails] reschedule ${booking.id}: no email on the booking, no new reminders`)
      return { withdrawn, scheduled }
    }
    const previous = withdrawn.rows?.[0]
    const tz = previous?.visitor_tz || booking.ownerTz || "America/Los_Angeles"
    const hasPhone = previous?.has_phone === true
    const notice: BookingNotice = {
      name: booking.name?.trim() || "",
      email,
      // Reminder copy only checks whether a phone was given; the number itself isn't stored here.
      phone: hasPhone ? "on file" : null,
      startIso: booking.startIso,
      endIso: booking.endIso,
      tz,
      meetUrl: booking.meetUrl,
      meetProvider: booking.meetProvider,
      manageUrl,
    }
    const result = await deps.schedule(notice, { hasReport: await deps.hasReport(email) })
    scheduled = result.messages
    await recordScheduledEmails(booking.id, scheduled, { tz, hasPhone }, deps)
  } catch (error) {
    console.warn(`[booking-emails] reschedule failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  return { withdrawn, scheduled }
}
