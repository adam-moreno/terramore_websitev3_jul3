import type { LookupFinding, LookupSourceId, LookupSourceStatus } from "@/lib/lookup/types"

/**
 * The lookup's score: how many of a fixed list of basics were found in place on the business's public website.
 * It is a count, not a rating. Each basic is read straight from the lookup's own findings, so the score never says
 * more than the findings under it. A basic the check couldn't see (a source that failed or isn't available, a booking
 * link we couldn't confirm) is left out of the count rather than scored as missing.
 */

export type BasicResult = "pass" | "fail" | "unknown"

type SourceResult = { status: LookupSourceStatus; findings: LookupFinding[] } | undefined

type Basic = { key: string; label: string; read: (ids: Set<string>) => BasicResult }

const has = (ids: Set<string>, ...wanted: string[]) => wanted.some((id) => ids.has(id))

/** Fixed per source, so the total is the same for every business. */
export const LOOKUP_BASICS: Record<LookupSourceId, ReadonlyArray<Basic>> = {
  website: [
    {
      key: "next_step",
      label: "A clear next step for visitors",
      read: (ids) => (has(ids, "website.ctas") ? "pass" : has(ids, "website.no_cta") ? "fail" : "unknown"),
    },
  ],
  contact: [
    {
      key: "booking",
      label: "Online booking",
      read: (ids) =>
        has(ids, "contact.booking")
          ? "pass"
          : has(ids, "contact.no_booking", "contact.booking_unreachable")
            ? "fail"
            : "unknown",
    },
    { key: "phone", label: "A phone number", read: (ids) => (has(ids, "contact.phone") ? "pass" : "fail") },
    {
      key: "message",
      label: "A form or email address",
      read: (ids) => (has(ids, "contact.form", "contact.email") ? "pass" : "fail"),
    },
  ],
  measurement: [
    {
      key: "tracking",
      label: "Analytics or ad tracking",
      read: (ids) =>
        has(ids, "measurement.ga", "measurement.meta", "measurement.tiktok", "measurement.gtm")
          ? "pass"
          : has(ids, "measurement.none")
            ? "fail"
            : "unknown",
    },
  ],
  search_basics: [
    { key: "title", label: "A page title", read: (ids) => (has(ids, "search_basics.no_title") ? "fail" : "pass") },
    {
      key: "description",
      label: "A search description",
      read: (ids) => (has(ids, "search_basics.no_description") ? "fail" : "pass"),
    },
    {
      key: "sitemap",
      label: "A sitemap",
      read: (ids) => (has(ids, "search_basics.sitemap") ? "pass" : has(ids, "search_basics.no_sitemap") ? "fail" : "unknown"),
    },
    { key: "https", label: "A secure connection", read: (ids) => (has(ids, "search_basics.no_https") ? "fail" : "pass") },
    { key: "phone_ready", label: "Set up for phones", read: (ids) => (has(ids, "search_basics.no_viewport") ? "fail" : "pass") },
  ],
  social: [
    {
      key: "linked",
      label: "Social profiles linked",
      read: (ids) => (has(ids, "social.linked") ? "pass" : has(ids, "social.none") ? "fail" : "unknown"),
    },
  ],
  google_maps: [
    {
      key: "listing",
      label: "A Google Maps listing",
      read: (ids) =>
        has(ids, "google_maps.confirmed") ? "pass" : has(ids, "google_maps.unconfirmed") ? "fail" : "unknown",
    },
  ],
}

export const LOOKUP_BASICS_TOTAL = Object.values(LOOKUP_BASICS).reduce((n, list) => n + list.length, 0)

export type SourceScore = {
  /** Basics found in place. */
  passed: number
  /** Basics the check could read for this source (pass or fail). */
  counted: number
  /** Basics this source can have. */
  total: number
  /** false while the source is still being checked (or the check hasn't run). */
  read: boolean
}

/** A finished source ("done" or "not_found") is read; "failed", "unavailable" and "checking" aren't. */
function isRead(result: SourceResult): result is NonNullable<SourceResult> {
  return result?.status === "done" || result?.status === "not_found"
}

export function scoreSource(id: LookupSourceId, result: SourceResult): SourceScore {
  const basics = LOOKUP_BASICS[id]
  if (!isRead(result)) return { passed: 0, counted: 0, total: basics.length, read: false }
  const ids = new Set(result.findings.map((f) => f.id))
  const results = basics.map((b) => b.read(ids))
  return {
    passed: results.filter((r) => r === "pass").length,
    counted: results.filter((r) => r !== "unknown").length,
    total: basics.length,
    read: true,
  }
}

export function scoreLookup(sources: Partial<Record<LookupSourceId, SourceResult>>) {
  const perSource = Object.fromEntries(
    (Object.keys(LOOKUP_BASICS) as LookupSourceId[]).map((id) => [id, scoreSource(id, sources[id])]),
  ) as Record<LookupSourceId, SourceScore>
  const all = Object.values(perSource)
  return {
    perSource,
    passed: all.reduce((n, s) => n + s.passed, 0),
    counted: all.reduce((n, s) => n + s.counted, 0),
    total: LOOKUP_BASICS_TOTAL,
  }
}
