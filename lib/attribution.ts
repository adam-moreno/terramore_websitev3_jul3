/**
 * Client-side ad attribution kept in sessionStorage for the current tab.
 * Key: `tm_report_attribution`. Click IDs and UTMs only. No PII.
 *
 * Merge rules: a new URL value replaces only the same field. A partial URL
 * (utm_source without gclid) must not erase click IDs already stored.
 * Storage stays sessionStorage for this tab. Not cookies. Not localStorage.
 */

export const ATTR_STORAGE_KEY = "tm_report_attribution"

export const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
] as const

function pickKeys(get: (key: string) => unknown): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of ATTR_KEYS) {
    const value = get(key)
    if (typeof value === "string" && value.trim()) out[key] = value.trim()
  }
  return out
}

/**
 * Existing fields stay. Incoming non-empty values replace the same field only.
 * Empty or missing incoming fields do not erase what was already stored.
 */
export function mergeAttributionRecords(
  stored: Record<string, unknown> | null | undefined,
  incoming: Record<string, unknown> | null | undefined,
): Record<string, string> {
  const base = pickKeys((key) => stored?.[key])
  const next = pickKeys((key) => incoming?.[key])
  return { ...base, ...next }
}

/** Whatever this tab stored earlier. `{}` when nothing stored, storage blocked, or JSON is bad. */
export function readStoredAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(ATTR_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return pickKeys((key) => parsed[key])
  } catch {
    return {}
  }
}

/** Attribution keys present on the current URL. */
export function readUrlAttribution(search: string = typeof window !== "undefined" ? window.location.search : ""): Record<string, string> {
  try {
    const params = new URLSearchParams(search)
    return pickKeys((key) => params.get(key))
  } catch {
    return {}
  }
}

/**
 * Stored values first, current URL values on top. A fresh ad click wins per key; keys the URL does not carry
 * (an earlier gclid, say) survive. Empty URL values never overwrite stored ones.
 */
export function mergedAttribution(): Record<string, string> {
  return mergeAttributionRecords(readStoredAttribution(), readUrlAttribution())
}

/**
 * Call on every page load / client route change. Writes the merged set back only when the URL carried at least
 * one attribution key, so a later clean-URL navigation never clears what was stored. Never throws.
 */
export function captureAttributionFromUrl(): void {
  if (typeof window === "undefined") return
  try {
    const fromUrl = readUrlAttribution()
    if (Object.keys(fromUrl).length === 0) return
    const merged = mergeAttributionRecords(readStoredAttribution(), fromUrl)
    sessionStorage.setItem(ATTR_STORAGE_KEY, JSON.stringify(merged))
  } catch {
    /* quota / private mode: ignore */
  }
}
