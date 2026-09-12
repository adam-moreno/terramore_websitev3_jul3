/**
 * POST /api/booking
 * Body: { name, email, phone?, business?, website?, note?, startIso, tz }
 * Books through Terra IQ, then tells Adam (Slack) and the lead (email, SMS with a phone).
 */

import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { bookingApi, manageUrl, type BookingRecord } from "@/lib/booking-api"
import { confirmBookingToUser, notifyAdminOfBooking } from "@/lib/notify"

export const dynamic = "force-dynamic"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const t = value.trim()
  return t ? t.slice(0, max) : null
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)?.toLowerCase() || null
  const startIso = clean(body.startIso, 40)
  const tz = clean(body.tz, 64) || "UTC"
  if (!name || !email || !EMAIL_RE.test(email) || !startIso) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }
  const lead = {
    name,
    email,
    phone: clean(body.phone, 40),
    business: clean(body.business, 160),
    website: clean(body.website, 300),
    note: clean(body.note, 1000),
  }

  const result = await bookingApi<BookingRecord>("/api/public/booking", { method: "POST", body: { ...lead, startIso, tz } })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status >= 500 ? 503 : result.status })
  }

  const booking = result.data
  const manage = manageUrl(booking.manageToken)
  const notice = {
    ...lead,
    startIso: booking.startIso,
    endIso: booking.endIso,
    tz,
    meetUrl: booking.meetUrl,
    meetProvider: booking.meetProvider,
    manageUrl: manage,
  }

  // Messages go out after the response so the visitor sees the confirmation right away.
  after(async () => {
    await Promise.all([notifyAdminOfBooking(notice), confirmBookingToUser(notice)])
  })

  return NextResponse.json({
    id: booking.id,
    startIso: booking.startIso,
    endIso: booking.endIso,
    meetUrl: booking.meetUrl,
    meetProvider: booking.meetProvider,
    manageToken: booking.manageToken,
    manageUrl: manage,
  })
}
