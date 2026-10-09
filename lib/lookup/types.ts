/**
 * Free business lookup: the streamed events POST /api/lookup sends and the BusinessLookup component reads.
 * Pure types and labels (no server imports), so the browser bundle can use them.
 *
 * A source reports what it actually did: `done` with findings, `not_found` (checked, nothing there), `unavailable`
 * (this check isn't configured here) or `failed`. A finding always names what was observed on the business's own
 * public pages or listing; nothing is inferred beyond that.
 */

export type LookupSourceId = "website" | "contact" | "measurement" | "search_basics" | "social" | "google_maps"

export type LookupSourceStatus = "checking" | "done" | "not_found" | "unavailable" | "failed"

export type LookupFinding = {
  id: string
  source: LookupSourceId
  /** working: something in place. gap: something missing that costs customers. note: context, no judgment. */
  tone: "working" | "gap" | "note"
  text: string
  /** Where it was observed, in plain words ("Homepage", "robots.txt and sitemap.xml"). */
  evidence: string
}

/** `network` is client-side only: the request never reached Terramore (offline, dropped connection). */
export type LookupErrorCode = "invalid_website" | "blocked" | "unreachable" | "rate_limited" | "server" | "network"

/**
 * The full report's Digital Presence Score (lib/report/score/digital-presence.ts), computed from the lookup's pages.
 * 0 to 100 per factor; null when a factor couldn't be scored. No evidence text or Places values.
 */
export type LookupScore = {
  overall: number | null
  pagesRead: number
  mapsChecked: boolean
  factors: Array<{ id: string; label: string; score: number | null }>
}

/** Score scale shared by the score rings and their legend. */
export const SCORE_BANDS = [
  { min: 0, max: 49, label: "0–49" },
  { min: 50, max: 89, label: "50–89" },
  { min: 90, max: 100, label: "90–100" },
] as const

export type LookupEvent =
  | { type: "start"; lookupId: string; domain: string; website: string }
  | { type: "identity"; name: string | null }
  | { type: "source"; source: LookupSourceId; status: LookupSourceStatus; findings: LookupFinding[] }
  | { type: "done"; firstLook: LookupFinding | null; checked: number; score: LookupScore | null }
  | { type: "error"; code: LookupErrorCode; message: string }

/** Display order and owner-language labels. */
export const LOOKUP_SOURCES: ReadonlyArray<{ id: LookupSourceId; label: string }> = [
  { id: "website", label: "Website" },
  { id: "contact", label: "How customers reach you" },
  { id: "measurement", label: "Analytics and ad tags" },
  { id: "search_basics", label: "Search basics" },
  { id: "social", label: "Social profiles" },
  { id: "google_maps", label: "Google Maps listing" },
]

export const LOOKUP_ERROR_COPY: Record<LookupErrorCode, string> = {
  invalid_website: "That doesn't look like a website address. Try something like yourbusiness.com.",
  blocked: "We can only check public websites. Try your business's public web address.",
  unreachable: "We couldn't reach that website. Check the address, or try again in a minute.",
  rate_limited: "You've run a few checks in a row. Wait a few minutes, then try again.",
  server: "Something went wrong on our side. Try again in a minute.",
  network: "We couldn't connect. Check your internet connection, then try again.",
}
