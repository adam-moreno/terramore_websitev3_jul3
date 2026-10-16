/**
 * "Tap to text us" (2026-10-16). The Terramore line is on Sendblue's inbound-first AI Agent plan, so owners text us
 * first and we reply. Pure and client-safe: the number, the pre-filled messages, the link for each platform, the QR
 * payload, and reading a ref back out of a reply. Pattern from Sendblue's iMessage link button guide
 * (docs.sendblue.com/guides/imessage-link-button).
 */

export const TEXT_NUMBER = "+16123568558"
export const TEXT_NUMBER_DISPLAY = "(612) 356-8558"

/** Unambiguous code alphabet: no 0/O, 1/I, L. */
export const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
const REF_RE = /\(\s*ref\s*[:#]?\s*([A-HJ-NP-Z2-9]{5}|WEB)\s*\)/i

export type TextKind = "report" | "booking" | "site"

function clean(value: string | null | undefined, max = 40): string {
  return String(value ?? "").replace(/[()\n\r]/g, " ").replace(/\s+/g, " ").trim().slice(0, max)
}

/** The message the owner's phone opens with. Short on purpose: long encoded links can fail. */
export function textBody(kind: TextKind, input: { firstName?: string | null; business?: string | null; code?: string | null } = {}): string {
  const first = clean(input.firstName, 30)
  const business = clean(input.business, 40)
  const who = first ? `it's ${first}${business ? ` from ${business}` : ""}` : business ? `it's ${business}` : "it's me"
  if (kind === "site") return "Hi Terramore, I'd like a free check of my business. (Ref WEB)"
  const ref = input.code ? ` (Ref ${input.code})` : ""
  if (kind === "booking") return `Hi Terramore, ${who}. Text me reminders for my call.${ref}`
  return `Hi Terramore, ${who}. Text me about my report.${ref}`
}

export type TextPlatform = "ios" | "mac" | "android" | "desktop"

export function textPlatform(userAgent: string): TextPlatform {
  const ua = userAgent || ""
  if (/android/i.test(ua)) return "android"
  if (/iphone|ipad|ipod/i.test(ua)) return "ios"
  // iPadOS reports as a Mac; both can open Messages.
  if (/macintosh|mac os x/i.test(ua)) return "mac"
  return "desktop"
}

/** In-app browsers (Instagram, Facebook, TikTok, LinkedIn…) often won't open Messages. */
export function inAppBrowser(userAgent: string): boolean {
  return /FBAN|FBAV|Instagram|Line\/|LinkedInApp|TikTok|musical_ly|Bytedance|Twitter|Snapchat|Pinterest|WhatsApp|Messenger/i.test(userAgent || "")
}

/** sms: link: iPhone and Mac use "&body=", Android "?body=" (RFC 5724). Desktop has no handler. */
export function smsHref(body: string, platform: TextPlatform): string {
  const sep = platform === "android" ? "?body=" : "&body="
  return `sms:${TEXT_NUMBER}${sep}${encodeURIComponent(body)}`
}

/** QR content phone cameras understand on both iPhone and Android: opens Messages with the text filled in. */
export function qrPayload(body: string): string {
  return `SMSTO:${TEXT_NUMBER}:${body}`
}

/** The ref in an owner's text, if they kept the pre-filled message: a 5-character code, or "WEB" for the footer. */
export function refFromText(content: string | null | undefined): string | null {
  const m = REF_RE.exec(String(content ?? ""))
  return m ? m[1].toUpperCase() : null
}

export function isRefCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-HJ-NP-Z2-9]{5}$/.test(value)
}
