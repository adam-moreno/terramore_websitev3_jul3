/**
 * Human-readable Digital Footprint Slack lines.
 * Labels only what the stored attribution actually contains.
 * A click id does not imply a campaign, keyword, or search term.
 */

const PACIFIC = "America/Los_Angeles"

const CLICK_IDS = [
  ["gclid", "GCLID"],
  ["gbraid", "GBRAID"],
  ["wbraid", "WBRAID"],
  ["fbclid", "FBCLID"],
  ["ttclid", "TTCLID"],
] as const

const PAID_MEDIUMS = new Set(["cpc", "ppc", "paid", "paidsearch", "paid_search", "paid_social", "paidsocial"])

export type AttributionMap = Record<string, string | null | undefined>

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : ""
}

function orDash(value: string | null | undefined): string {
  const text = clean(value)
  return text || "—"
}

/** Google click ids win, then Meta, then TikTok. UTMs set a channel only with a known paid medium. */
export function channelFromAttribution(attribution: AttributionMap | null | undefined): string | null {
  const a = attribution ?? {}
  if (clean(a.gclid) || clean(a.gbraid) || clean(a.wbraid)) return "Google Ads"
  if (clean(a.fbclid)) return "Meta"
  if (clean(a.ttclid)) return "TikTok"

  const source = clean(a.utm_source).toLowerCase()
  const medium = clean(a.utm_medium).toLowerCase()
  if (!source || !PAID_MEDIUMS.has(medium)) return null
  if (source === "google" || source === "adwords" || source === "google_ads") return "Google Ads"
  if (source === "facebook" || source === "meta" || source === "instagram" || source === "fb" || source === "ig") {
    return "Meta"
  }
  if (source === "tiktok" || source === "tt") return "TikTok"
  return null
}

export function clickIdEntries(attribution: AttributionMap | null | undefined): Array<{ label: string; value: string }> {
  const a = attribution ?? {}
  const out: Array<{ label: string; value: string }> = []
  for (const [key, label] of CLICK_IDS) {
    const value = clean(a[key])
    if (value) out.push({ label, value })
  }
  return out
}

/** Pacific clock for internal Slack. Stored timestamps stay UTC timestamptz. */
export function formatPacificTimestamp(iso: string | null | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const datePart = new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
  const timePart = new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
  return `${datePart} · ${timePart} PT`
}

export function formatDigitalFootprintSlack(input: {
  business?: string | null
  website?: string | null
  submittedAt?: string | null
  name: string
  email: string
  phone?: string | null
  answers?: string | null
  socials?: string | null
  attribution?: AttributionMap | null
}): string[] {
  const attribution = input.attribution ?? {}
  const clicks = clickIdEntries(attribution)
  const clickLine =
    clicks.length > 0 ? clicks.map((entry) => `${entry.label} · ${entry.value}`).join("; ") : "—"

  const lines = [
    `Business: ${orDash(input.business)}`,
    `Website: ${orDash(input.website)}`,
    `Submitted: ${formatPacificTimestamp(input.submittedAt) ?? "—"}`,
    "",
    "CONTACT",
    `Name: ${orDash(input.name)}`,
    `Email: ${orDash(input.email)}`,
    `Phone: ${orDash(input.phone)}`,
    "",
    "ATTRIBUTION",
    `Channel: ${channelFromAttribution(attribution) ?? "—"}`,
    `Source: ${orDash(attribution.utm_source)}`,
    `Campaign: ${orDash(attribution.utm_campaign)}`,
    `Term: ${orDash(attribution.utm_term)}`,
    `Click ID: ${clickLine}`,
    "",
    "REPORT",
    "Status: New",
  ]

  if (clean(input.answers)) lines.push(`Answers: ${clean(input.answers)}`)
  if (clean(input.socials)) lines.push(`Socials: ${clean(input.socials)}`)
  return lines
}
