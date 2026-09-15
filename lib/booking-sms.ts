/**
 * Booking SMS copy and cadence — edit templates here (parallel to email in
 * `lib/booking-reminders.ts` + `confirmBookingToUser` email body).
 *
 * Live today: immediate `confirm` SMS (via `confirmBookingToUser` → `buildBookingSms`).
 *
 * Timed SMS (24h / 2h / 30m / 2m): Sendblue has no `scheduled_at`. Email uses Resend/
 * SendGrid schedule; SMS needs a cron that loads upcoming bookings and sends with
 * `buildBookingSms` + `sendSms`. See `app/api/cron/booking-sms/route.ts` + DEVELOPMENT_LOG.
 *
 * Media: optional HTTPS CDN URL with a file extension (`.gif`, `.png`, `.jpg`, …).
 * iMessage/RCS may deliver the attachment; plain SMS often falls back to link-in-text
 * or MMS depending on the Sendblue line / carrier. Leave `mediaUrl` undefined until
 * you have a real public asset — do not invent URLs.
 */

const SITE = "https://terramore.io"
const REPORT_URL = `${SITE}/report`

/** Fields needed to render booking SMS (matches BookingNotice). */
export type BookingSmsContext = {
  name: string
  phone?: string | null
  startIso: string
  tz: string
  meetUrl: string | null
}

/** Kinds we actually text. Skip ~5m (email covers prep) and 10h (too chatty). */
export type BookingSmsKind = "confirm" | "24h" | "2h" | "30m" | "2m"

export type BookingSmsSpec = {
  kind: BookingSmsKind
  /** null = send immediately at booking; otherwise ms before startIso (same as email). */
  offsetMs: number | null
  label: string
  /** When false, builders still exist but cron/send helpers should skip. */
  enabled: boolean
}

/**
 * Proposed SMS campaign next to email reminders.
 * Confirm is required; 24h is one soft prep; join nudges at 2h / 30m / 2m.
 */
export const BOOKING_SMS_SPECS: BookingSmsSpec[] = [
  { kind: "confirm", offsetMs: null, label: "Immediate confirm", enabled: true },
  { kind: "24h", offsetMs: 24 * 60 * 60 * 1000, label: "24 hours before", enabled: true },
  { kind: "2h", offsetMs: 2 * 60 * 60 * 1000, label: "2 hours before", enabled: true },
  { kind: "30m", offsetMs: 30 * 60 * 1000, label: "30 minutes before", enabled: true },
  { kind: "2m", offsetMs: 2 * 60 * 1000, label: "2 minutes before", enabled: true },
]

/** Timed kinds only (cron). Confirm is sent at booking time. */
export const BOOKING_SMS_TIMED_SPECS = BOOKING_SMS_SPECS.filter(
  (s): s is BookingSmsSpec & { offsetMs: number } => s.offsetMs != null && s.enabled,
)

export type BuiltSms = {
  body: string
  /** Optional public CDN URL (extension required by Sendblue). */
  mediaUrl?: string
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there"
}

function whenShort(iso: string, tz: string): string {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso))
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso))
  return `${day} ${time}`
}

function joinSnippet(b: BookingSmsContext): string {
  return b.meetUrl ? ` Join: ${b.meetUrl}` : ""
}

/**
 * --- Edit SMS copy below ---
 * Keep under ~320 chars when possible (1–2 SMS segments). Meet links are long; that is fine.
 * Optional mediaUrl: uncomment and set a real HTTPS asset, or leave undefined.
 */
function buildConfirm(b: BookingSmsContext): BuiltSms {
  const first = firstName(b.name)
  const timeLine = whenShort(b.startIso, b.tz)
  return {
    body: `Terramore: you're booked, ${first}. ${timeLine}.${joinSnippet(b)}`,
    // mediaUrl: "https://cdn.example.com/booked.gif",
  }
}

function build24h(b: BookingSmsContext, hasReport: boolean | null): BuiltSms {
  const first = firstName(b.name)
  const timeLine = whenShort(b.startIso, b.tz)
  const reportBit =
    hasReport === true
      ? " Skim your Digital Footprint if you have a minute."
      : ` Free report: ${REPORT_URL}`
  return {
    body: `Terramore: call tomorrow, ${first} — ${timeLine}.${reportBit}`,
  }
}

function build2h(b: BookingSmsContext): BuiltSms {
  return {
    body: `Terramore: call in ~2 hours.${joinSnippet(b) || " Check your calendar invite for the join link."}`,
  }
}

function build30m(b: BookingSmsContext): BuiltSms {
  return {
    body: `Terramore: starting in 30 min.${joinSnippet(b) || " Open your calendar invite to join."}`,
  }
}

function build2m(b: BookingSmsContext): BuiltSms {
  return {
    body: `Terramore: starting now.${joinSnippet(b) || " Open your calendar invite to join."}`,
  }
}

export function buildBookingSms(
  kind: BookingSmsKind,
  b: BookingSmsContext,
  opts: { hasReport: boolean | null } = { hasReport: null },
): BuiltSms {
  if (kind === "confirm") return buildConfirm(b)
  if (kind === "24h") return build24h(b, opts.hasReport)
  if (kind === "2h") return build2h(b)
  if (kind === "30m") return build30m(b)
  return build2m(b)
}

export function bookingSmsEnabled(kind: BookingSmsKind): boolean {
  return BOOKING_SMS_SPECS.find((s) => s.kind === kind)?.enabled === true
}

/**
 * For a booking start time, which timed SMS kinds are due in the cron window?
 * `windowMs` = how often the cron runs (e.g. 5 min). Send once when
 * `now` is within [sendAt, sendAt + windowMs).
 *
 * Idempotency: the cron must record sent kinds (Terra IQ or a local table) so a
 * re-run in the same window does not double-text.
 */
export function dueTimedBookingSmsKinds(
  startIso: string,
  nowMs: number = Date.now(),
  windowMs: number = 5 * 60 * 1000,
): BookingSmsKind[] {
  const startMs = new Date(startIso).getTime()
  if (!Number.isFinite(startMs)) return []
  const due: BookingSmsKind[] = []
  for (const spec of BOOKING_SMS_TIMED_SPECS) {
    const sendMs = startMs - spec.offsetMs
    if (nowMs >= sendMs && nowMs < sendMs + windowMs) due.push(spec.kind)
  }
  return due
}
