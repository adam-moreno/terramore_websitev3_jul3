/**
 * GET or POST /api/cron/booking-sms
 *
 * Intended job: every ~5 minutes, load upcoming bookings and send due timed SMS
 * (24h / 2h / 30m / 2m) via Sendblue. Templates: `lib/booking-sms.ts`.
 *
 * Auth (same as nurture cron):
 * - Authorization: Bearer ${CRON_SECRET}
 * - or ?secret=${CRON_SECRET}
 *
 * BLOCKED until Terra IQ exposes a list of upcoming bookings this site can poll.
 * Email reminders do not need this — they use Resend/SendGrid `scheduled_at` /
 * `send_at` at booking time. Sendblue has no schedule API.
 *
 * When unblocked:
 * 1. Call Terra IQ (path TBD, e.g. GET /api/public/booking/upcoming) with
 *    BOOKING_API_SECRET.
 * 2. For each active booking with a phone, `dueTimedBookingSmsKinds(startIso)`.
 * 3. Skip kinds already sent (store on Terra IQ or a small Supabase table).
 * 4. `buildBookingSms` + `sendSms` (fail soft).
 * 5. Add to vercel.json every 5 minutes (match windowMs in dueTimedBookingSmsKinds).
 *    Not registered yet — would only return 503.
 */

import { NextRequest, NextResponse } from "next/server"
import { BOOKING_SMS_TIMED_SPECS } from "@/lib/booking-sms"

export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false

  const header = request.headers.get("authorization") || ""
  if (header === `Bearer ${secret}`) return true

  const query = request.nextUrl.searchParams.get("secret")
  if (query && query === secret) return true

  return false
}

async function handle(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "CRON_SECRET unset" }, { status: 503 })
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  return NextResponse.json(
    {
      ok: false,
      error: "not_ready",
      message:
        "Timed booking SMS templates are ready in lib/booking-sms.ts, but this cron cannot list upcoming bookings yet. Need a Terra IQ upcoming-bookings endpoint (phone, startIso, meetUrl, name, tz) plus send-idempotency. Immediate confirm SMS is already live at booking time.",
      timedKinds: BOOKING_SMS_TIMED_SPECS.map((s) => s.kind),
      nextSteps: [
        "Add Terra IQ GET upcoming bookings (secret header)",
        "Persist which SMS kinds were sent per booking",
        "Wire send loop with buildBookingSms + sendSms",
        "Register every-5m cron in vercel.json",
      ],
    },
    { status: 503 },
  )
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
