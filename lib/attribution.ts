/**
 * Client-side ad attribution kept in sessionStorage for the current tab.
 * Same key and shape as report-form.tsx (`tm_report_attribution`) so the report form keeps working unchanged.
 * Click IDs and UTMs only. No PII.
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
  return { ...readStoredAttribution(), ...readUrlAttribution() }
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
    sessionStorage.setItem(ATTR_STORAGE_KEY, JSON.stringify({ ...readStoredAttribution(), ...fromUrl }))
  } catch {
    /* quota / private mode: ignore */
  }
}
