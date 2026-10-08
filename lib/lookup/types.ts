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

export type LookupEvent =
  | { type: "start"; lookupId: string; domain: string; website: string }
  | { type: "identity"; name: string | null }
  | { type: "source"; source: LookupSourceId; status: LookupSourceStatus; findings: LookupFinding[] }
  | { type: "done"; firstLook: LookupFinding | null; checked: number }
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
