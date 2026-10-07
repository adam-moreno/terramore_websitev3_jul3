/**
 * V2A funnel measurement vocabulary: event names, allowed parameters and values, CTA ids, and the send gate.
 * Pure module (no imports, no DOM at import time) so scripts/verify-funnel.mjs can execute it.
 *
 * The existing conversion events (generate_lead, report_submission_success, the Ads report conversion,
 * meeting_booked, report_submission_error, form_start, report_cta_click, cta_click, select_content) are not
 * defined here and keep their original helpers, names, parameters and firing conditions.
 */

/** Hostnames whose funnel events reach GA4. Everything else (localhost, *.vercel.app previews, tests) is debug only. */
export const PRODUCTION_HOSTS: readonly string[] = ["www.terramore.io", "terramore.io"]

export type FunnelSendMode = "send" | "debug"

export function funnelSendMode(hostname: string | null | undefined): FunnelSendMode {
  return typeof hostname === "string" && PRODUCTION_HOSTS.includes(hostname.toLowerCase()) ? "send" : "debug"
}

/** A CTA counts as seen once at least half of it is on screen for a full second in a visible tab. */
export const CTA_VIEW_THRESHOLD = 0.5
export const CTA_VIEW_MIN_MS = 1000

export type CtaDestination = "report" | "booking"
export type CtaPlacement = "hero" | "header" | "floating" | "inline" | "closing" | "confirmation" | "error"
type CtaSpec = { destination: CtaDestination; placement: CtaPlacement; view: boolean }

/**
 * Approved CTA ids: `<surface>_<placement>_<destination>`, destination `report` or `book`. Ids name the spot, not the
 * button text, so copy can change without breaking reports. `view: true` tracks impressions (primary_cta_view);
 * always-visible chrome (header, floating button) and error-state links do not.
 */
export const CTA_IDS = {
  home_hero_book: { destination: "booking", placement: "hero", view: true },
  home_hero_report: { destination: "report", placement: "hero", view: true },
  home_band_report: { destination: "report", placement: "inline", view: true },
  header_book: { destination: "booking", placement: "header", view: false },
  report_header_book: { destination: "booking", placement: "header", view: false },
  floating_book: { destination: "booking", placement: "floating", view: false },
  report_hero_report: { destination: "report", placement: "hero", view: true },
  report_mid_report: { destination: "report", placement: "inline", view: true },
  report_closing_report: { destination: "report", placement: "closing", view: true },
  report_closing_book: { destination: "booking", placement: "closing", view: true },
  report_sent_book: { destination: "booking", placement: "confirmation", view: true },
  report_duplicate_book: { destination: "booking", placement: "error", view: false },
  solutions_hero_report: { destination: "report", placement: "hero", view: true },
  solutions_hero_book: { destination: "booking", placement: "hero", view: true },
  construction_hero_report: { destination: "report", placement: "hero", view: true },
  construction_hero_book: { destination: "booking", placement: "hero", view: true },
  book_hero_book: { destination: "booking", placement: "hero", view: true },
  book_hero_report: { destination: "report", placement: "hero", view: true },
  marketing_hero_book: { destination: "booking", placement: "hero", view: true },
  marketing_hero_report: { destination: "report", placement: "hero", view: true },
  marketing_closing_report: { destination: "report", placement: "closing", view: true },
  marketing_closing_book: { destination: "booking", placement: "closing", view: true },
  infopage_hero_book: { destination: "booking", placement: "hero", view: true },
  infopage_hero_report: { destination: "report", placement: "hero", view: true },
} as const satisfies Record<string, CtaSpec>

export type CtaId = keyof typeof CTA_IDS

export function isCtaId(value: unknown): value is CtaId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(CTA_IDS, value)
}

/** Field identifiers for validation events. Never the value. */
export const REPORT_FIELDS = ["website", "first_name", "last_name", "email", "email_format", "consent"] as const
export const BOOKING_FIELDS = ["name", "email", "email_format", "phone", "phone_invalid"] as const

export const REPORT_ENTRIES = ["popup_questions", "popup_direct"] as const
export const BOOKING_ENTRIES = ["popup", "inline"] as const
export const REPORT_STEPS = ["started", "details_shown", "required_complete", "submit_attempt"] as const
export const BOOKING_STEPS = ["owner", "business", "stage", "schedule", "details"] as const
export const BOOKING_ERRORS = ["validation", "slot_taken", "backend", "network", "availability", "no_slots"] as const

export type ReportField = (typeof REPORT_FIELDS)[number]
export type BookingField = (typeof BOOKING_FIELDS)[number]
export type ReportEntry = (typeof REPORT_ENTRIES)[number]
export type BookingEntry = (typeof BOOKING_ENTRIES)[number]

/** Stable, de-duplicated field list for a validation event: "email,first_name". */
export function fieldList<T extends string>(fields: readonly T[]): string {
  return [...new Set(fields)].sort().join(",")
}

const oneOf = (values: readonly string[]) => (value: unknown) => typeof value === "string" && values.includes(value)
const listOf = (values: readonly string[]) => (value: unknown) =>
  typeof value === "string" && value.length > 0 && value.split(",").every((part) => values.includes(part))

/** Pathname only: no query string, no fragment, nothing that could hold an email or a token. */
const PAGE_PATH = /^\/[A-Za-z0-9/_.-]{0,119}$/
const isPagePath = (value: unknown) => typeof value === "string" && PAGE_PATH.test(value) && !/\d{6,}/.test(value)
/** Existing booking `source` tags (homepage, header, floating_cta, report, …) or their pathname fallback. */
const isBookingSource = (value: unknown) => typeof value === "string" && (/^[a-z_]{1,24}$/.test(value) || isPagePath(value))

const VALIDATORS = {
  cta_id: isCtaId,
  destination: oneOf(["report", "booking"]),
  placement: oneOf(["hero", "header", "floating", "inline", "closing", "confirmation", "error"]),
  page_path: isPagePath,
  report_entry: oneOf(REPORT_ENTRIES),
  booking_entry: oneOf(BOOKING_ENTRIES),
  report_step: oneOf(REPORT_STEPS),
  booking_step: oneOf(BOOKING_STEPS),
  step_index: (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 9,
  report_fields: listOf(REPORT_FIELDS),
  booking_fields: listOf(BOOKING_FIELDS),
  booking_reason: oneOf(BOOKING_ERRORS),
  source: isBookingSource,
  flow: oneOf(["qualify", "schedule_first"]),
} as const

type Validator = keyof typeof VALIDATORS

/** Every V2A event and, per parameter, the validator its value must pass. Anything else is dropped. */
export const FUNNEL_EVENTS = {
  primary_cta_view: { cta_id: "cta_id", destination: "destination", placement: "placement", page_path: "page_path" },
  primary_cta_click: { cta_id: "cta_id", destination: "destination", placement: "placement", page_path: "page_path" },
  report_view: { entry: "report_entry", cta_id: "cta_id", page_path: "page_path" },
  report_progress: { step: "report_step", entry: "report_entry", page_path: "page_path" },
  report_validation_error: { fields: "report_fields", entry: "report_entry", page_path: "page_path" },
  /** "Open My Growth Workspace" on the report success screen: the hand-off from terramore.io to TerraIQ. */
  workspace_cta_click: { entry: "report_entry", page_path: "page_path" },
  booking_start: { source: "source", entry: "booking_entry", flow: "flow", page_path: "page_path" },
  booking_progress: {
    step: "booking_step",
    step_index: "step_index",
    source: "source",
    entry: "booking_entry",
    page_path: "page_path",
  },
  booking_error: {
    reason: "booking_reason",
    fields: "booking_fields",
    step: "booking_step",
    source: "source",
    entry: "booking_entry",
    page_path: "page_path",
  },
} as const satisfies Record<string, Record<string, Validator>>

export type FunnelEventName = keyof typeof FUNNEL_EVENTS
export type FunnelParams = Record<string, string | number>

export function isFunnelEvent(value: unknown): value is FunnelEventName {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(FUNNEL_EVENTS, value)
}

/**
 * Keeps only the parameters allowed for this event whose values pass their validator. Unknown events return null.
 * This is the PII barrier: no free text, names, emails, phones, websites, ids or query strings can pass.
 */
export function sanitizeFunnelParams(event: string, params: Record<string, unknown> | null | undefined): FunnelParams | null {
  if (!isFunnelEvent(event)) return null
  const allowed: Record<string, Validator> = FUNNEL_EVENTS[event]
  const out: FunnelParams = {}
  for (const [key, value] of Object.entries(params ?? {})) {
    const validator = allowed[key]
    if (!validator || !VALIDATORS[validator](value)) continue
    out[key] = value as string | number
  }
  return out
}
