/**
 * Central client analytics helpers (GA4 via gtag/dataLayer + optional Ads/Meta/TikTok).
 *
 * Conversion events (fire only after server-confirmed success):
 * - Report: `generate_lead` + `report_submission_success` (+ Ads `conversion` send_to report label only)
 * - Booking: `meeting_booked` (GA4 only — no Google Ads conversion path)
 *
 * No PII in event params. Helpers never throw if gtag is unavailable.
 */

/** Current GA4 property (Realtime / reporting). */
export const GA4_MEASUREMENT_ID = "G-ZC5DY0ES7N"

/** Legacy GA4 stream still linked in Google tag — keep config so history is not orphaned. */
export const GA4_MEASUREMENT_ID_LEGACY = "G-BQN6VCY579"

/** Documented defaults for Ads conversion AW-11353847408 / XnBzCIeStfgcEPDs96Uq ("Digital Footprint Report Submitted"). */
export const GOOGLE_ADS_ID_DEFAULT = "AW-11353847408"
export const GOOGLE_ADS_CONVERSION_LABEL_DEFAULT = "XnBzCIeStfgcEPDs96Uq"

declare global {
  interface Window {
    dataLayer: unknown[]
    fbq?: (...args: unknown[]) => void
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void; page: () => void; load: (id: string) => void }
    /** Dev-only verification surface — never populated in production builds. */
    __tmAnalytics?: {
      last: { event: string; params?: Record<string, string | number | boolean>; at: number } | null
      events: Array<{ event: string; params?: Record<string, string | number | boolean>; at: number }>
    }
  }
}

const PII_PARAM_RE =
  /^(email|e[_-]?mail|phone|tel|mobile|name|first[_-]?name|last[_-]?name|full[_-]?name|company|business|website|socials?|meet[_-]?url|manage[_-]?url|manage[_-]?token|password|token|address)$/i

/** Same-action dedupe for conversion-style fires (key = event:onceId). */
const firedOnce = new Set<string>()

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return
  const fn = (window as Window & { gtag?: (...a: unknown[]) => void }).gtag
  if (typeof fn === "function") fn(...args)
}

function scrubParams(
  params?: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (PII_PARAM_RE.test(key)) continue
    out[key] = value
  }
  return out
}

function recordDevDiagnostic(event: string, params?: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return
  const entry = { event, params, at: Date.now() }
  console.info(`[analytics] event fired: ${event}`, params ?? {})
  const bag = window.__tmAnalytics ?? { last: null, events: [] }
  bag.last = entry
  bag.events = [...bag.events.slice(-49), entry]
  window.__tmAnalytics = bag
}

/** Prefers NEXT_PUBLIC_GOOGLE_ADS_ID; also accepts NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID. */
export function googleAdsId(): string {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
    GOOGLE_ADS_ID_DEFAULT
  ).trim()
}

export function googleAdsConversionLabel(): string {
  return (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || GOOGLE_ADS_CONVERSION_LABEL_DEFAULT).trim()
}

export function googleAdsSendTo(): string {
  return `${googleAdsId()}/${googleAdsConversionLabel()}`
}

/**
 * Fire a GA4 (or custom) event via existing gtag/dataLayer.
 * Params must not include email/phone/name. Accidental PII keys are stripped.
 * Pass `once` to skip a second fire for the same event+key in this page session.
 */
export function trackEvent(
  event: string,
  params?: Record<string, string | number | boolean>,
  options?: { once?: string },
) {
  try {
    if (options?.once) {
      const key = `${event}:${options.once}`
      if (firedOnce.has(key)) return
      firedOnce.add(key)
    }
    const safe = scrubParams(params)
    gtag("event", event, safe)
    recordDevDiagnostic(event, safe)
  } catch {
    // Never break the product path if analytics fails.
  }
}

/**
 * Google Ads conversion — ONLY for Digital Footprint Report Submitted.
 * Call only after server-confirmed report success (2xx). Do not use for bookings.
 * Does not include PII. Do not add a second Ads conversion for meeting_booked.
 */
export function trackGoogleAdsReportConversion(options?: { once?: string }) {
  try {
    if (options?.once) {
      const key = `ads_conversion:${options.once}`
      if (firedOnce.has(key)) return
      firedOnce.add(key)
    }
    const payload = { send_to: googleAdsSendTo() }
    gtag("event", "conversion", payload)
    recordDevDiagnostic("conversion", { send_to: googleAdsSendTo() })
  } catch {
    // ignore
  }
}

/** Meta Lead — only if pixel script loaded (NEXT_PUBLIC_META_PIXEL_ID). */
export function trackMetaLead() {
  try {
    if (typeof window === "undefined") return
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead")
    }
  } catch {
    // ignore
  }
}

/** TikTok Lead — only if pixel script loaded (NEXT_PUBLIC_TIKTOK_PIXEL_ID). */
export function trackTikTokLead() {
  try {
    if (typeof window === "undefined") return
    if (window.ttq && typeof window.ttq.track === "function") {
      window.ttq.track("Lead")
    }
  } catch {
    // ignore
  }
}

/**
 * Report success funnel — server-confirmed submit only (response.ok, not 409).
 * Exact GA4 names (kept; do not invent a third report-success name):
 *   - generate_lead
 *   - report_submission_success
 * Plus Ads conversion send_to report label only. No booking Ads conversion.
 */
export function trackReportSubmissionSuccess(method = "report_form") {
  const once = `report:${method}`
  const pagePath = typeof window !== "undefined" ? window.location.pathname : ""
  // Safe metadata only — form_id / method / page_path. No name/email/phone/website.
  trackEvent(
    "generate_lead",
    { form_id: "digital_footprint_report", method, page_path: pagePath },
    { once: `${once}:generate_lead` },
  )
  trackEvent(
    "report_submission_success",
    { form_id: "digital_footprint_report", method, page_path: pagePath },
    { once: `${once}:report_submission_success` },
  )
  trackGoogleAdsReportConversion({ once })
  trackMetaLead()
  trackTikTokLead()
}

export function trackReportSubmissionError(reason: string) {
  trackEvent("report_submission_error", { form_id: "digital_footprint_report", reason })
}

/**
 * Booking success — GA4 only. Exact name: meeting_booked.
 * Call only after POST /api/booking returns ok + non-empty string booking id.
 * Never fire on 409 / validation / network failure. No Ads conversion. No PII.
 */
export function trackMeetingBooked(params: {
  booking_id: string
  business_type: string
  stage: string
  source: string
  page_path: string
}) {
  const bookingId = params.booking_id.trim()
  if (!bookingId) return
  trackEvent(
    "meeting_booked",
    {
      booking_id: bookingId,
      business_type: params.business_type,
      stage: params.stage,
      source: params.source,
      page_path: params.page_path,
    },
    { once: bookingId },
  )
}
