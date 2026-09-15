/**
 * Client analytics helpers for the Digital Footprint report funnel.
 * No PII in event params. GA4 stays G-BQN6VCY579 (loaded in root layout).
 *
 * Google Ads defaults match the live conversion "Digital Footprint Report Submitted".
 * Override via NEXT_PUBLIC_GOOGLE_ADS_ID / NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL.
 */

export const GA4_MEASUREMENT_ID = "G-BQN6VCY579"

/** Documented defaults for Ads conversion AW-11353847408 / XnBzCIeStfgcEPDs96Uq */
export const GOOGLE_ADS_ID_DEFAULT = "AW-11353847408"
export const GOOGLE_ADS_CONVERSION_LABEL_DEFAULT = "XnBzCIeStfgcEPDs96Uq"

declare global {
  interface Window {
    dataLayer: unknown[]
    fbq?: (...args: unknown[]) => void
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void; page: () => void; load: (id: string) => void }
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return
  const fn = (window as Window & { gtag?: (...a: unknown[]) => void }).gtag
  if (typeof fn === "function") fn(...args)
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

/** Fire GA4 (or custom) event. Params must not include email/phone/name. */
export function trackEvent(event: string, params?: Record<string, string | number | boolean>) {
  gtag("event", event, params)
}

/**
 * Google Ads conversion — call only after server-confirmed report success (201).
 * Does not include PII.
 */
export function trackGoogleAdsReportConversion() {
  gtag("event", "conversion", { send_to: googleAdsSendTo() })
}

/** Meta Lead — only if pixel script loaded (NEXT_PUBLIC_META_PIXEL_ID). */
export function trackMetaLead() {
  if (typeof window === "undefined") return
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead")
  }
}

/** TikTok Lead — only if pixel script loaded (NEXT_PUBLIC_TIKTOK_PIXEL_ID). */
export function trackTikTokLead() {
  if (typeof window === "undefined") return
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("Lead")
  }
}

/**
 * Full success funnel for a confirmed report submit (server 201).
 * Generates: generate_lead, report_submission_success, Ads conversion, optional Meta/TikTok Lead.
 */
export function trackReportSubmissionSuccess(method = "report_form") {
  trackEvent("generate_lead", { form_id: "digital_footprint_report", method })
  trackEvent("report_submission_success", { form_id: "digital_footprint_report" })
  trackGoogleAdsReportConversion()
  trackMetaLead()
  trackTikTokLead()
}

export function trackReportSubmissionError(reason: string) {
  trackEvent("report_submission_error", { form_id: "digital_footprint_report", reason })
}
