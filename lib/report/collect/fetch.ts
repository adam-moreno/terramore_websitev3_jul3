/**
 * Shared fetch/parse helpers for deterministic collectors.
 * Keep request volume low: short timeouts, truncated bodies, no auth.
 */

export const FOOTPRINT_UA =
  "Mozilla/5.0 (compatible; TerramoreFootprintBot/1.0; +https://terramore.io/report)"

export async function fetchText(
  url: string,
  timeoutMs = 10000,
): Promise<{ status: number; text: string; finalUrl: string } | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": FOOTPRINT_UA, Accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*" },
      redirect: "follow",
      signal: controller.signal,
    })
    const text = await response.text()
    return { status: response.status, text: text.slice(0, 600_000), finalUrl: response.url || url }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
}

export function stripToText(html: string): string {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim()
}

export function pickAttr(regex: RegExp, html: string): string | null {
  const match = html.match(regex)
  return match ? decodeHtml(match[1]).trim() : null
}

export function absoluteUrl(base: string, href: string): string | null {
  try {
    return new URL(href, base).toString()
  } catch {
    return null
  }
}

export function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin
  } catch {
    return false
  }
}

export const KEY_PAGE_HINTS =
  /\/(about|contact|service|services|shop|store|product|products|collections|menu|locations?|book|appointment|quote|estimate|pricing|team|our-story|work|portfolio|faq)(\/|$|\?)/i

export const STATIC_ASSET = /\.(css|js|mjs|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|pdf|mp4|webm)(\?|$)/i
export const CDN_PATH = /\/cdn\/|\/assets\/|_next\/static|\/static\//i

export const CTA_HINT =
  /book|schedule|call|contact|get\s+(a\s+)?quote|request|buy|shop|order|start|learn more|get started|free consult|message|reserve|claim|try|subscribe|sign up|add to (cart|bag)/i

export const BOOKING_HINT =
  /calendly\.com|squareup\.com\/appointments|acuityscheduling|book(?:ing)?[-_ ]?(?:now|online|an? appointment)|vagaro|mindbody|zocdoc|opentable|resy\.com/i

export const TRUST_HINTS: Array<[string, RegExp]> = [
  ["testimonials", /testimonial|what (?:our )?clients say|customer (?:stories|reviews)/i],
  ["case_studies", /case stud(?:y|ies)|client results|success stor/i],
  ["guarantees", /guarantee|money[- ]back|satisfaction guarante/i],
  ["credentials", /licensed|certified|bonded|insured|accreditation|board[- ]certified/i],
  ["awards", /award[- ]winning|best of|voted best|inc\.?\s*500/i],
  ["policies", /privacy policy|return policy|shipping policy|terms of (?:service|use)/i],
  ["team", /meet the (?:team|founder)|our team|about (?:the )?founder/i],
  ["before_after", /before\s*(?:&|and)\s*after/i],
]
