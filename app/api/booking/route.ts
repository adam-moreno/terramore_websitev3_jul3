/**
 * POST /api/booking
 * Body: { name, email, phone?, business?, website?, note?, startIso, tz, source?, attribution? }
 * Books through Terra IQ, then tells Adam (Slack) and the lead (email, SMS with a phone).
 * `source` and whitelisted `attribution` keys (gclid/UTMs) are folded into the Terra IQ note; no schema change.
 * With a website, the free website check (Digital Footprint report) runs after the response, once per email
 * (lib/booking/claim-report.ts). A Facebook/Instagram page or Google listing is kept as socials; the check reads websites.
 */

import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { analyticsRef } from "@/lib/analytics-ref"
import { bookingApi, manageUrl, type BookingRecord } from "@/lib/booking-api"
import { claimBookingReport } from "@/lib/booking/claim-report"
import { classifyBookingLink } from "@/lib/booking/report-check"
import { prepMessage, recordScheduledEmails } from "@/lib/booking/scheduled-emails"
import { leadHasDigitalFootprintReport } from "@/lib/leads/has-digital-footprint"
import { runReportPipeline } from "@/lib/report/pipeline"
import { scheduleBookingReminders } from "@/lib/booking-reminders"
import { confirmBookingToUser, notifyAdminOfBooking, sendBookingPrepEmail } from "@/lib/notify"
import { enrollLead } from "@/lib/nurture/enroll"

export const dynamic = "force-dynamic"
// The report pipeline runs in after() and needs the same time budget as /api/report.
export const maxDuration = 60

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
  const websiteRaw = clean(body.website, 300)
  const link = classifyBookingLink(websiteRaw)
  const noteBase = link.kind === "social" ? [visitorNote, `Link: ${link.url}`].filter(Boolean).join("\n") : visitorNote
  const lead = {
    name,
    email,
    phone: clean(body.phone, 40),
    business: clean(body.business, 160),
    website: websiteRaw,
    // Terra IQ + Slack admin notice see Source/Attribution. Nurture (below) keeps the plain visitor note.
    note: noteWithContext(noteBase, source, attribution),
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

  // One quick row lookup decides whether the free check runs, so the confirmation page can say so truthfully.
  // The check itself runs after the response.
  const claim = await claimBookingReport({ name, email, phone: lead.phone, business: lead.business }, link)
  const reportComing = claim.run && link.kind === "site"

  // Messages go out after the response so the visitor sees the confirmation right away.
  // Confirm immediate; prep ~5 min (provider schedule); reminders 24h/2h/30m queued for our cron. Nurture enroll future-only.
  after(async () => {
    const messages = async () => {
      await Promise.all([notifyAdminOfBooking(notice), confirmBookingToUser(notice)])
      const hasReport = reportComing ? true : claim.hasReport ?? (await leadHasDigitalFootprintReport(email))
      const prep = await sendBookingPrepEmail(notice, { hasReport, reportComing })
      const reminders = await scheduleBookingReminders(notice, { hasReport })
      // Record the prep id and the queued reminders, so /book/manage can withdraw them on cancel or reschedule.
      const prepScheduled = prepMessage(prep)
      await recordScheduledEmails(
        String(booking.id),
        [...(prepScheduled ? [prepScheduled] : []), ...reminders.messages],
        { tz, hasPhone: Boolean(lead.phone), manageToken: booking.manageToken, startIso: booking.startIso },
      )
      await enrollLead({
        email,
        name,
        source: "book",
        businessName: lead.business,
        website: link.kind === "site" ? link.website : lead.website,
        job: visitorNote,
      })
    }
    // The report runs alongside the messages (both inside maxDuration). Owner gets the report email; Adam gets a copy
    // (the pipeline BCCs ADMIN_EMAIL) as call prep. runReportPipeline never throws.
    const report = async () => {
      if (!reportComing || link.kind !== "site") return
      await runReportPipeline({
        name,
        email,
        phone: lead.phone,
        businessName: lead.business || "",
        website: link.website,
      })
    }
    await Promise.all([messages(), report()])
  })

  // `id` stays for the confirmation UI (calendar file uid); analytics only ever gets the one-way `bookingRef`.
  return NextResponse.json({
    id: booking.id,
    ...(typeof booking.id === "string" && booking.id ? { bookingRef: analyticsRef("terramore-booking", booking.id) } : {}),
    startIso: booking.startIso,
    endIso: booking.endIso,
    meetUrl: booking.meetUrl,
    meetProvider: booking.meetProvider,
    manageToken: booking.manageToken,
    manageUrl: manage,
    reportComing,
  })
}
