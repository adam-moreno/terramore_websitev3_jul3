/**
 * POST /api/booking
 * Body: { name, email, phone?, business?, website?, note?, startIso, tz, source?, attribution? }
 * Books through Terra IQ, then tells Adam (Slack) and the lead (email, SMS with a phone).
 * `source` and whitelisted `attribution` keys (gclid/UTMs) are folded into the Terra IQ note; no schema change.
 */

import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { bookingApi, manageUrl, type BookingRecord } from "@/lib/booking-api"
import { leadHasDigitalFootprintReport } from "@/lib/leads/has-digital-footprint"
import { scheduleBookingReminders } from "@/lib/booking-reminders"
import { confirmBookingToUser, notifyAdminOfBooking, sendBookingPrepEmail } from "@/lib/notify"
import { enrollLead } from "@/lib/nurture/enroll"

export const dynamic = "force-dynamic"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const t = value.trim()
  return t ? t.slice(0, max) : null
}

/** Non-PII click IDs / UTMs only. Same keys report-form stores under tm_report_attribution. */
const ATTRIBUTION_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ttclid",
] as const
const SOURCE_RE = /^[a-z0-9_\-/]+$/i

/** Whitelist + trim + cap. Anything else in the object is dropped. */
function cleanAttribution(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const raw = value as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const key of ATTRIBUTION_KEYS) {
    const v = clean(raw[key], 200)
    if (v) out[key] = v.replace(/[\r\n;]+/g, " ")
  }
  return out
}

/** Appends `Source: …` and `Attribution: k=v; …` lines to the visitor note so Terra IQ keeps them with the booking. */
function noteWithContext(note: string | null, source: string | null, attribution: Record<string, string>): string | null {
  const lines = note ? [note] : []
  if (source) lines.push(`Source: ${source}`)
  const pairs = Object.entries(attribution).map(([k, v]) => `${k}=${v}`)
  if (pairs.length > 0) lines.push(`Attribution: ${pairs.join("; ")}`)
  return lines.length > 0 ? lines.join("\n") : null
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
  const sourceRaw = clean(body.source, 80)
  const source = sourceRaw && SOURCE_RE.test(sourceRaw) ? sourceRaw : null
  const attribution = cleanAttribution(body.attribution)
  const visitorNote = clean(body.note, 1000)
  const lead = {
    name,
    email,
    phone: clean(body.phone, 40),
    business: clean(body.business, 160),
    website: clean(body.website, 300),
    // Terra IQ + Slack admin notice see Source/Attribution. Nurture (below) keeps the plain visitor note.
    note: noteWithContext(visitorNote, source, attribution),
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
  // Confirm immediate; prep ~5 min; reminders 24h/10h/2h/30m/2m via provider schedule. Nurture enroll future-only.
  after(async () => {
    await Promise.all([notifyAdminOfBooking(notice), confirmBookingToUser(notice)])
    const hasReport = await leadHasDigitalFootprintReport(email)
    await sendBookingPrepEmail(notice, { hasReport })
    await scheduleBookingReminders(notice, { hasReport })
    await enrollLead({
      email,
      name,
      source: "book",
      businessName: lead.business,
      website: lead.website,
      job: visitorNote,
    })
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
