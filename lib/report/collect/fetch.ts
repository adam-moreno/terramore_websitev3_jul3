/**
 * Shared fetch/parse helpers for deterministic collectors.
 * Keep request volume low: short timeouts, truncated bodies, no auth.
 */

import { assertPublicUrl } from "@/lib/report/collect/public-url"

export const FOOTPRINT_UA =
  "Mozilla/5.0 (compatible; TerramoreFootprintBot/1.0; +https://terramore.io/report)"

/**
 * GET with a short timeout. Every URL and every redirect hop must be a public http(s) address (assertPublicUrl):
 * the free lookup fetches visitor-supplied sites, so redirects are followed by hand, at most 5 hops.
 * Returns null on any failure, including a blocked address.
 */
export async function fetchText(
  url: string,
  timeoutMs = 10000,
): Promise<{ status: number; text: string; finalUrl: string } | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let current = url
    for (let hop = 0; hop <= 5; hop++) {
      await assertPublicUrl(current)
      const response = await fetch(current, {
        headers: {
          "User-Agent": FOOTPRINT_UA,
          Accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*",
        },
        redirect: "manual",
        signal: controller.signal,
      })
      const location = response.headers.get("location")
      if (response.status >= 300 && response.status < 400 && location) {
        current = new URL(location, current).toString()
        continue
      }
      const text = await response.text()
      return { status: response.status, text: text.slice(0, 600_000), finalUrl: current }
    }
    return null
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

/**
 * A call to action asks the visitor to do something, so its label starts with the action ("Book a call", "Get a
 * quote"). Matching anywhere in the label counted headings such as "Fill the appointment book" or "Reach people
 * ready to buy" as requests.
 */
export const CTA_HINT =
  /^(?:book|schedule|call|contact|get|request|buy|shop|order|start|learn more|free (?:consult|quote|estimate|trial)|message|reserve|claim|try|subscribe|sign up|add to (?:cart|bag)|let['’]?s talk|talk (?:to|with)|send me|join|apply|enroll|register)\b/i

/** Hosts (and, for Square and Google, paths) of third-party booking and reservation tools. */
export function isSchedulerUrl(url: string): boolean {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return false
  }
  const host = u.hostname.toLowerCase()
  const on = (domain: string) => host === domain || host.endsWith(`.${domain}`)
  if (
    [
      "calendly.com",
      "acuityscheduling.com",
      "as.me",
      "cal.com",
      "savvycal.com",
      "youcanbook.me",
      "setmore.com",
      "simplybook.me",
      "tidycal.com",
      "booksy.com",
      "vagaro.com",
      "mindbodyonline.com",
      "zocdoc.com",
      "opentable.com",
      "resy.com",
      "fresha.com",
      "schedulicity.com",
      "calendar.app.google",
    ].some(on)
  )
    return true
  if (host === "meetings.hubspot.com") return true
  if (on("squareup.com") || on("square.site")) return /\/(appointments|book)(\/|$)/i.test(u.pathname)
  if (host === "calendar.google.com") return /\/calendar\/appointments\//i.test(u.pathname)
  return false
}

/** Same-site paths that conventionally hold a booking flow. A candidate only: the page itself is then checked. */
export const BOOKING_PATH = /^\/(?:book|booking|bookings|schedule|scheduling|appointments?|reserve|reservations?|consult|consultation)(?:\/|$)/i

/** Link or button labels that offer booking. Also only a candidate. */
export const BOOKING_LABEL = /^(?:book|schedule|reserve)\b/i

/**
 * Text that only appears where a visitor can actually choose a time. Ordinary copy that mentions booking or
 * scheduling ("we book out weeks ahead") doesn't match.
 */
export const SCHEDULING_TEXT =
  /\b(?:pick|choose|select|find) (?:a|your) (?:time|date|day|time ?slot|slot)\b|\bavailable (?:times|time ?slots|slots|appointments)\b|\btimes (?:are )?shown? in your (?:local )?time ?zone\b/i

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
