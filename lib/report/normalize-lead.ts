/**
 * Normalize report-lead fields for duplicate matching and storage.
 * Keep rules conservative and deterministic — same input always same key.
 * Client-safe: do not import lib/notify (server SMS / email).
 */

import { normalizeWebsite } from "@/lib/report/footprint"

/** Accepts "(555) 123-4567", "555.123.4567", "+44 20 ..." and returns E.164 or null. US numbers get +1. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  const digits = trimmed.replace(/[^\d]/g, "")
  if (trimmed.startsWith("+")) return digits.length >= 8 ? `+${digits}` : null
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return null
}

export { normalizeWebsite }

export function normalizeEmail(raw: string | null | undefined): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
}

/** Collapse whitespace + lowercase for first/last and business name compares. */
export function normalizePersonName(raw: string | null | undefined): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

export function normalizeBusinessName(raw: string | null | undefined): string {
  return normalizePersonName(raw)
}

/** Hostname without leading www, lowercase. Empty if unusable. */
export function normalizeWebsiteHost(raw: string | null | undefined): string {
  const full = normalizeWebsite(raw)
  if (!full) return ""
  try {
    const host = new URL(full).hostname.toLowerCase().replace(/^www\./, "")
    return host.includes(".") ? host : ""
  } catch {
    return ""
  }
}

/**
 * Socials: lowercase, strip trailing slash, collapse spaces.
 * Treats handles and URLs as opaque strings after light cleanup.
 */
export function normalizeSocials(raw: string | null | undefined): string {
  let value = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
  if (!value) return ""
  value = value.replace(/\/+$/, "")
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      const path = url.pathname.replace(/\/+$/, "")
      return `${url.hostname.replace(/^www\./, "")}${path}`.toLowerCase()
    } catch {
      return value
    }
  }
  return value.replace(/^@/, "")
}

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

export type AttributionKey = (typeof ATTR_KEYS)[number]

export type Attribution = Partial<Record<AttributionKey, string>>

export function pickAttribution(raw: Record<string, unknown>): Attribution {
  const out: Attribution = {}
  for (const key of ATTR_KEYS) {
    const value = raw[key]
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, 255)
    }
  }
  return out
}
