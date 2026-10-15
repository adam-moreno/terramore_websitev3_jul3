/**
 * Booking → free website check (Digital Footprint report).
 * Pure helpers: which link the booker gave, and whether the report should run for it.
 * The route (app/api/booking/route.ts) does the database work; scripts/verify-booking-report.mjs checks these.
 */

import { normalizeWebsite } from "@/lib/report/footprint"

export type BookingLink =
  | { kind: "site"; website: string }
  /** A social page or a Google listing. The report reads a website, so these are kept as socials, not checked. */
  | { kind: "social"; url: string }
  | { kind: "none" }

/** Hosts that are a profile or listing, not the owner's own website. */
const SOCIAL_HOSTS = [
  /(^|\.)facebook\.com$/i,
  /(^|\.)fb\.com$/i,
  /(^|\.)fb\.me$/i,
  /(^|\.)instagram\.com$/i,
  /(^|\.)instagr\.am$/i,
  /(^|\.)tiktok\.com$/i,
  /(^|\.)linkedin\.com$/i,
  /(^|\.)x\.com$/i,
  /(^|\.)twitter\.com$/i,
  /(^|\.)yelp\.com$/i,
  /(^|\.)nextdoor\.com$/i,
  /(^|\.)youtube\.com$/i,
  /(^|\.)threads\.net$/i,
  /(^|\.)pinterest\.com$/i,
  /^maps\.app\.goo\.gl$/i,
  /^g\.page$/i,
  /^g\.co$/i,
  /^share\.google$/i,
  /^maps\.google\.[a-z.]+$/i,
  /^business\.google\.com$/i,
  /^goo\.gl$/i,
]

/** google.com/maps/…, google.com/search?…&kgmid (a Business Profile link), and similar. */
function isGoogleListing(url: URL): boolean {
  if (!/(^|\.)google\.[a-z.]+$/i.test(url.hostname)) return false
  return /^\/(maps|search|place|localservices)\b/i.test(url.pathname) || url.searchParams.has("cid") || url.searchParams.has("kgmid")
}

/**
 * Classifies the booking form's "Website, Facebook or Google listing" field.
 * Never throws. Anything unreadable is "none" (the booking still goes through).
 */
export function classifyBookingLink(raw: unknown): BookingLink {
  if (typeof raw !== "string") return { kind: "none" }
  const trimmed = raw.trim()
  if (!trimmed || trimmed.length > 300 || /\s/.test(trimmed)) return { kind: "none" }
  const normalized = normalizeWebsite(trimmed)
  if (!normalized) return { kind: "none" }
  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    return { kind: "none" }
  }
  if (!/^https?:$/i.test(url.protocol)) return { kind: "none" }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)) return { kind: "none" }
  const host = url.hostname.replace(/^www\./i, "")
  if (SOCIAL_HOSTS.some((re) => re.test(host)) || isGoogleListing(url)) return { kind: "social", url: url.toString() }
  return { kind: "site", website: url.toString() }
}

/** Report states that mean "already sent or being written": never start another. */
export const REPORT_BUSY_STATUSES = ["sent", "generating"] as const

export function reportAlreadyUnderway(status: string | null | undefined): boolean {
  return typeof status === "string" && (REPORT_BUSY_STATUSES as readonly string[]).includes(status)
}

/** The report runs only for a real website and only when this email has none sent or in progress. */
export function shouldRunBookingReport(link: BookingLink, existingStatus: string | null | undefined): boolean {
  return link.kind === "site" && !reportAlreadyUnderway(existingStatus)
}

/** What the prep note says about the report. */
export type PrepReportState = "coming" | "has_report" | "none"

export function prepReportState(opts: { reportComing: boolean; hasReport: boolean | null }): PrepReportState {
  if (opts.reportComing) return "coming"
  if (opts.hasReport === true) return "has_report"
  return "none"
}

export const PREP_REPORT_COMING = "Your free website check is on its way by email; we'll walk through it on the call."
export const PREP_HAS_REPORT = "If you already have your Digital Footprint report, skim it once before we talk. It gives us a shared starting point."
export const PREP_BRING_LINKS = "Bring your website or social links to the call and we'll look at them together."

export function prepReportLine(state: PrepReportState): string {
  if (state === "coming") return PREP_REPORT_COMING
  if (state === "has_report") return PREP_HAS_REPORT
  return PREP_BRING_LINKS
}

/** Confirmation page line; shown only when the check is actually running. */
export const CONFIRM_REPORT_COMING = "We're preparing your free website check now. It usually lands in your inbox within a few minutes."
