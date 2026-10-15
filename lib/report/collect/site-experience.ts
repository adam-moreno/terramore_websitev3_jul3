import type { PageSnapshot } from "@/lib/report/types"
import {
  BOOKING_LABEL,
  BOOKING_PATH,
  CDN_PATH,
  CTA_HINT,
  KEY_PAGE_HINTS,
  SCHEDULING_TEXT,
  STATIC_ASSET,
  TRUST_HINTS,
  absoluteUrl,
  fetchText,
  isSchedulerUrl,
  pickAttr,
  sameOrigin,
  stripToText,
} from "@/lib/report/collect/fetch"
import { BOOKING_PATH_STEP, keyPageRank, readNextStep, type NextStep } from "@/lib/report/collect/next-step"

/**
 * Whether visitors can book a time online, and where that was confirmed.
 * - found: a third-party booking tool is linked or embedded, or a same-site page has a scheduling interaction.
 * - unreachable: a booking link exists but didn't load (or redirected somewhere that isn't allowed).
 * - unconfirmed: a booking link or "Book…" control exists, but no booking flow could be seen behind it.
 * - none: no booking link, control or tool at all.
 */
export type BookingCheck = {
  status: "found" | "unreachable" | "unconfirmed" | "none"
  via: "scheduler" | "same_site" | null
  url: string | null
}

function extractNavLabels(html: string): string[] {
  const navBlocks = Array.from(html.matchAll(/<nav[\s\S]*?<\/nav>/gi)).map((m) => m[0])
  const source = navBlocks.length ? navBlocks.join(" ") : html.slice(0, 80_000)
  const labels = Array.from(source.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi))
    .map((m) => stripToText(m[1]))
    .filter((label) => label.length > 1 && label.length < 40)
  return Array.from(new Set(labels)).slice(0, 24)
}

/** Four or more adjacent buttons are a control group (tabs, filters, steppers, carousels), not calls to action. */
const CONTROL_GROUP = /(?:<button\b[^>]*>[\s\S]*?<\/button>\s*){4,}/gi

/** Controls that switch state in place (tabs, accordions, toggles) rather than ask the visitor to act. */
function isStateToggle(attrs: string): boolean {
  if (/\brole=["'](?:tab|switch|option|menuitemradio|menuitemcheckbox)["']/i.test(attrs)) return true
  if (/\baria-(?:selected|pressed)=/i.test(attrs)) return true
  return /\baria-expanded=/i.test(attrs) && !/\baria-haspopup=/i.test(attrs)
}

function extractCtas(html: string): string[] {
  const source = html.replace(CONTROL_GROUP, " ")
  const candidates = Array.from(source.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi))
    .filter((m) => !isStateToggle(m[2]))
    .map((m) => stripToText(m[3]))
  // "Request A Quote" and "REQUEST A QUOTE!" are one button: dedupe on letters and digits, keep the first label.
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of candidates) {
    if (!t || !CTA_HINT.test(t) || t.length >= 60) continue
    const key = t.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out.slice(0, 12)
}

/**
 * Builders that draw a page's buttons in the browser after it loads: Wix (Thunderbolt and Harmony) and Framer always,
 * Squarespace and Webflow on some blocks and interactions. Their buttons can be missing from the HTML we read.
 */
const BROWSER_DRAWN_ALWAYS = new Set(["Wix", "Framer"])
const BROWSER_DRAWN_SOMETIMES = new Set(["Squarespace", "Webflow"])

/** Links and buttons with visible text, and how much of the page is script, from the HTML as fetched. */
export function htmlShape(html: string): { textControls: number; scriptShare: number } {
  const textControls = Array.from(html.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi)).filter((m) => stripToText(m[2])).length
  const scriptChars = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)).reduce((n, m) => n + m[1].length, 0)
  return { textControls, scriptShare: html.length ? scriptChars / html.length : 0 }
}

/**
 * Whether the page's buttons may be drawn in the browser, so not finding one in the HTML proves nothing. True for a
 * Wix or Framer page; for a Squarespace or Webflow page, or an unknown site, only when the HTML has almost no links
 * with text and is mostly script (an app shell). A normal HTML page with real links is never excused.
 */
export function drawsButtonsInBrowser(html: string, platform: string | null): boolean {
  if (platform && BROWSER_DRAWN_ALWAYS.has(platform)) return true
  const { textControls, scriptShare } = htmlShape(html)
  if (platform && BROWSER_DRAWN_SOMETIMES.has(platform)) return textControls < 8 && scriptShare >= 0.3
  return textControls <= 2 && scriptShare >= 0.6
}

function attributeUrls(html: string, baseUrl: string): string[] {
  return Array.from(html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi))
    .map((m) => absoluteUrl(baseUrl, m[1]))
    .filter((u): u is string => Boolean(u))
}

/** A third-party booking tool linked or embedded on the page (link, iframe or widget script). */
function schedulerOn(html: string, baseUrl: string): string | null {
  return attributeUrls(html, baseUrl).find(isSchedulerUrl) ?? null
}

/**
 * A visitor can choose a time on this page: a date or time input, or scheduling text ("Pick a time", "Available
 * times") together with a control to act on it.
 */
function hasSchedulingInteraction(html: string): boolean {
  if (/<input\b[^>]*\btype=["'](?:date|time|datetime-local)["']/i.test(html)) return true
  return SCHEDULING_TEXT.test(stripToText(html)) && /<(?:button|form|input|select|iframe)\b/i.test(html)
}

function normalizedUrl(url: string): string {
  return url.split("#")[0].replace(/\/$/, "") || url
}

/** Same-site links offered as booking: a booking path (/book, /appointments…) or a label starting with Book/Schedule. */
function bookingCandidates(html: string, baseUrl: string): string[] {
  const urls: string[] = []
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = m[1].match(/\bhref=["']([^"'#]+)["']/i)?.[1]
    if (!href || /^(?:mailto|tel|javascript):/i.test(href)) continue
    const abs = absoluteUrl(baseUrl, href)
    if (!abs || !sameOrigin(baseUrl, abs)) continue
    let path = ""
    try {
      path = new URL(abs).pathname
    } catch {
      continue
    }
    if (BOOKING_PATH.test(path) || BOOKING_LABEL.test(stripToText(m[2]))) urls.push(normalizedUrl(abs))
  }
  return Array.from(new Set(urls))
}

/** A "Book…" or "Schedule…" button or link the visitor can see, even when its destination can't be followed. */
function hasBookingControl(html: string): boolean {
  return Array.from(html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi)).some(
    (m) => !isStateToggle(m[2]) && BOOKING_LABEL.test(stripToText(m[3])),
  )
}

const PRICE_AMOUNT = /\$\s?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})?/g
const PRICE_BEFORE =
  /(?:\bprice[sd]?|\bpricing|\bfrom|\bstarting at|\bstarts at|\bonly|\bjust|\bcosts?|\bfees?|\brates?)\s*:?\s*$/i
const PRICE_AFTER =
  /^\s*(?:\/\s?(?:mo|month|hr|hour|yr|year|wk|week|day|night|visit|session|person|class)\b|(?:per|a|an) (?:month|hour|year|week|day|night|visit|session|person|class)\b|each\b)/i
const STRUCTURED_PRICE = /"price"\s*:\s*"?\d|\bitemprop=["']price["']|\bproperty=["'](?:product|og):price:amount["']/i

/** A price the business lists, with the sentence it sits in ("Spray-finished cabinets starting at $3,800…"). */
export type PriceAnchor = { amount: string; value: number; context: string; url: string }

/**
 * The highest price stated as an offer across the pages read, for scale in the report ("one more job like that is
 * $3,800"). The owner's own number, never an estimate. Amounts over $1,000,000 are ignored as not a single job.
 */
export function priceAnchor(pageHtml: Array<{ url: string; html: string }>): PriceAnchor | null {
  let best: PriceAnchor | null = null
  for (const page of pageHtml) {
    const html = page.html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    // Each text run between tags, so a heading never runs into the sentence that holds the price.
    for (const node of html.matchAll(/>([^<>]*\$\s?\d[^<>]*)</g)) {
      const text = stripToText(node[1])
      for (const m of text.matchAll(PRICE_AMOUNT)) {
        const at = m.index ?? 0
        const offered =
          PRICE_BEFORE.test(text.slice(Math.max(0, at - 24), at)) || PRICE_AFTER.test(text.slice(at + m[0].length, at + m[0].length + 24))
        if (!offered) continue
        const value = Number(m[0].replace(/[^\d.]/g, ""))
        if (!Number.isFinite(value) || value <= 0 || value > 1_000_000) continue
        if (best && value <= best.value) continue
        let context = text.trim()
        if (context.length > 110) context = `${context.slice(0, 109).trimEnd()}…`
        best = { amount: m[0].replace(/\s/g, ""), value, context, url: page.url }
      }
    }
  }
  return best
}

/** Pages that say they aren't finished ("Photos coming soon!"): the words and the page they're on. */
export type PlaceholderPage = { url: string; name: string; phrase: string; isWorkPage: boolean }

const PLACEHOLDER = /[^.!?]*\b(?:coming soon|under construction|check back soon|page coming)\b[^.!?]*[.!?]?/i

export function placeholderPages(pages: PageSnapshot[]): PlaceholderPage[] {
  return pages
    .filter((p) => p.status !== null && p.status < 400)
    .map((p) => {
      let phrase = p.excerpt.match(PLACEHOLDER)?.[0]?.trim()
      if (!phrase) return null
      // The excerpt runs the title and heading into the first sentence ("Gallery Recent Projects Photos coming soon!").
      for (let pass = 0; pass < 2; pass++) {
        for (const lead of [p.title, ...p.h1]) {
          if (lead && phrase.toLowerCase().startsWith(lead.toLowerCase())) phrase = phrase.slice(lead.length).trim()
        }
      }
      if (!phrase || phrase.length > 120) return null
      const name = p.h1[0] || p.title?.split(/[|–-]/)[0]?.trim() || "A page"
      const isWorkPage = /gallery|portfolio|projects|our-work|\/work\b/i.test(p.url) || /gallery|portfolio|projects|our work/i.test(name)
      return { url: p.url, name, phrase, isWorkPage }
    })
    .filter((p): p is PlaceholderPage => Boolean(p))
}

/**
 * Prices offered to customers: product or offer markup, or a dollar amount stated as a price ("from $49", "$120/hr",
 * "$30 per class"). Amounts in stats, savings claims or sample dashboards aren't prices.
 */
function extractPrices(html: string, text: string): string[] {
  const offered = Array.from(text.matchAll(PRICE_AMOUNT))
    .filter((m) => {
      const at = m.index ?? 0
      return PRICE_BEFORE.test(text.slice(Math.max(0, at - 24), at)) || PRICE_AFTER.test(text.slice(at + m[0].length, at + m[0].length + 24))
    })
    .map((m) => m[0].replace(/\s/g, ""))
  if (offered.length === 0 && STRUCTURED_PRICE.test(html)) offered.push("structured offer price")
  return Array.from(new Set(offered)).slice(0, 8)
}

function extractInternalLinks(html: string, baseUrl: string): string[] {
  const hrefs = Array.from(html.matchAll(/href=["']([^"'#]+)["']/gi)).map((m) => m[1])
  const urls: string[] = []
  for (const href of hrefs) {
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue
    const abs = absoluteUrl(baseUrl, href)
    if (!abs || !sameOrigin(baseUrl, abs)) continue
    if (STATIC_ASSET.test(abs) || CDN_PATH.test(abs)) continue
    let path = ""
    try {
      path = new URL(abs).pathname
    } catch {
      continue
    }
    if (!KEY_PAGE_HINTS.test(path) && !KEY_PAGE_HINTS.test(href)) continue
    const normalized = abs.split("#")[0].replace(/\/$/, "") || abs
    urls.push(normalized)
  }
  // Contact, quote and booking pages first: with only a few extra pages read, those hold the way to reach the business.
  return Array.from(new Set(urls))
    .map((u, i) => ({ u, i, r: keyPageRank(u) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.u)
    .slice(0, 8)
}

function parsePage(url: string, status: number | null, html: string): PageSnapshot {
  const text = stripToText(html)
  const emails = Array.from(new Set(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])).filter(
    (v) => !/\.(png|jpg|svg|webp)$/i.test(v),
  )
  const phones = Array.from(new Set(text.match(/(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g) || []))
  const trustSignals = TRUST_HINTS.filter(([, re]) => re.test(html) || re.test(text)).map(([name]) => name)

  return {
    url,
    status,
    title: pickAttr(/<title[^>]*>([\s\S]*?)<\/title>/i, html),
    h1: Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi))
      .map((m) => stripToText(m[1]))
      .filter(Boolean)
      .slice(0, 3),
    navLabels: extractNavLabels(html),
    ctaTexts: extractCtas(html),
    formCount: (html.match(/<form[\s\S]*?<\/form>/gi) || []).length,
    hasPhone: phones.length > 0,
    hasEmail: emails.length > 0 || /\bhref=["']mailto:[^"'@]+@/i.test(html),
    hasBookingLink: Boolean(schedulerOn(html, url)) || hasSchedulingInteraction(html),
    trustSignals,
    excerpt: text.slice(0, 1800),
  }
}

/**
 * Confirms online booking from what was fetched, following at most one more same-site booking link (through
 * fetchText, so every hop passes the public-address guard). Third-party booking tools are recognized by their
 * address and not fetched.
 */
async function checkBooking(
  homeHtml: string,
  homeUrl: string,
  fetched: Array<{ url: string; html: string }>,
  extraPages: PageSnapshot[],
): Promise<BookingCheck> {
  const okPages = fetched.filter((p, i) => i === 0 || (extraPages[i - 1]?.status ?? 500) < 400)
  for (const page of okPages) {
    const scheduler = schedulerOn(page.html, page.url)
    if (scheduler) return { status: "found", via: "scheduler", url: scheduler }
  }
  for (const page of okPages) {
    if (hasSchedulingInteraction(page.html)) return { status: "found", via: "same_site", url: page.url }
  }

  const candidates = bookingCandidates(homeHtml, homeUrl)
  const seen = new Map(fetched.map((p, i) => [normalizedUrl(p.url), i === 0 ? 200 : (extraPages[i - 1]?.status ?? null)]))
  const unread = candidates.find((u) => !seen.has(u))
  if (unread) {
    const page = await fetchText(unread, 8000)
    if (!page || page.status >= 400) return { status: "unreachable", via: null, url: unread }
    if (isSchedulerUrl(page.finalUrl)) return { status: "found", via: "scheduler", url: page.finalUrl }
    if (sameOrigin(homeUrl, page.finalUrl)) {
      const scheduler = schedulerOn(page.text, page.finalUrl)
      if (scheduler) return { status: "found", via: "scheduler", url: scheduler }
      if (hasSchedulingInteraction(page.text)) return { status: "found", via: "same_site", url: page.finalUrl }
    }
    return { status: "unconfirmed", via: null, url: page.finalUrl }
  }
  const failed = candidates.find((u) => (seen.get(u) ?? 0) >= 400)
  if (failed) return { status: "unreachable", via: null, url: failed }
  if (candidates.length || fetched.some((p) => hasBookingControl(p.html))) {
    return { status: "unconfirmed", via: null, url: candidates[0] ?? null }
  }
  return { status: "none", via: null, url: null }
}

/**
 * Homepage + up to 5 key linked pages discovered from the homepage.
 * Deterministic counts only; no LLM.
 */
export async function collectSiteExperience(
  website: string | null,
  options: { maxExtraPages?: number } = {},
): Promise<{
  pages: PageSnapshot[]
  platform: string | null
  pixels: string[]
  emailTools: string[]
  hasCheckout: boolean
  prices: string[]
  homeHtml: string | null
  homeFinalUrl: string | null
  pageHtml: Array<{ url: string; html: string }>
  booking: BookingCheck
  /** How the business takes its next customer step (store, order form, quote, booking). */
  nextStep: NextStep
  /** The highest listed price across the pages read, with its sentence, or null. */
  priceAnchor: PriceAnchor | null
  /** The homepage may draw its buttons in the browser (drawsButtonsInBrowser), so a missing button is unconfirmed. */
  rendersInBrowser: boolean
}> {
  if (!website) {
    return {
      pages: [],
      platform: null,
      pixels: [],
      emailTools: [],
      hasCheckout: false,
      prices: [],
      homeHtml: null,
      homeFinalUrl: null,
      pageHtml: [],
      booking: { status: "none", via: null, url: null },
      nextStep: BOOKING_PATH_STEP,
      priceAnchor: null,
      rendersInBrowser: false,
    }
  }

  const home = await fetchText(website)
  if (!home || home.status >= 400) {
    return {
      pages: [
        {
          url: website,
          status: home?.status ?? null,
          title: null,
          h1: [],
          navLabels: [],
          ctaTexts: [],
          formCount: 0,
          hasPhone: false,
          hasEmail: false,
          hasBookingLink: false,
          trustSignals: [],
          excerpt: "",
        },
      ],
      platform: null,
      pixels: [],
      emailTools: [],
      hasCheckout: false,
      prices: [],
      homeHtml: home?.text ?? null,
      homeFinalUrl: home?.finalUrl ?? null,
      pageHtml: home?.text ? [{ url: home.finalUrl, html: home.text }] : [],
      booking: { status: "none", via: null, url: null },
      nextStep: BOOKING_PATH_STEP,
      priceAnchor: null,
      rendersInBrowser: false,
    }
  }

  const homePage = parsePage(home.finalUrl, home.status, home.text)
  const pageHtml: Array<{ url: string; html: string }> = [{ url: home.finalUrl, html: home.text }]
  const linked = extractInternalLinks(home.text, home.finalUrl).filter((u) => u !== home.finalUrl.replace(/\/$/, ""))
  const extraPages: PageSnapshot[] = []
  for (const url of linked.slice(0, options.maxExtraPages ?? 5)) {
    const page = await fetchText(url, 8000)
    if (!page) continue
    extraPages.push(parsePage(page.finalUrl, page.status, page.text))
    pageHtml.push({ url: page.finalUrl, html: page.text })
  }

  const booking = await checkBooking(home.text, home.finalUrl, pageHtml, extraPages)
  // The homepage offers booking when it links to a booking flow that was confirmed, not only when it embeds one.
  if (booking.status === "found") homePage.hasBookingLink = true

  const platforms: Array<[string, RegExp]> = [
    ["Shopify", /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i],
    ["WooCommerce", /woocommerce/i],
    ["Squarespace", /squarespace\.com/i],
    ["Wix", /wix\.com|wixstatic\.com/i],
    ["Webflow", /webflow\.com|data-wf-page/i],
    ["Framer", /framerusercontent\.com|<meta[^>]+content=["']Framer\b/i],
    ["WordPress", /wp-content|wp-includes/i],
    ["Next.js", /_next\/static/i],
  ]
  const pixelsList: Array<[string, RegExp]> = [
    ["Meta Pixel", /connect\.facebook\.net|fbq\(/i],
    ["Google Analytics", /googletagmanager\.com\/gtag|google-analytics\.com|gtag\(/i],
    ["Google Tag Manager", /googletagmanager\.com\/gtm\.js/i],
    ["Google Ads", /googleads\.g\.doubleclick\.net|AW-\d{6,}/i],
    ["TikTok Pixel", /analytics\.tiktok\.com|ttq\./i],
  ]
  const emailList: Array<[string, RegExp]> = [
    ["Klaviyo", /klaviyo/i],
    ["Mailchimp", /mailchimp|list-manage\.com/i],
    ["HubSpot", /hs-scripts\.com|hubspot/i],
    ["Omnisend", /omnisend/i],
  ]

  const text = stripToText(home.text)
  const platform = platforms.find(([, re]) => re.test(home.text))?.[0] || null
  const hasCheckout = /\/cart|\/checkout|add[-_ ]to[-_ ]cart|Add to bag/i.test(home.text)
  const rendersInBrowser = drawsButtonsInBrowser(home.text, platform)
  if (rendersInBrowser && homePage.ctaTexts.length === 0) homePage.ctaUnconfirmed = true
  const pages = [homePage, ...extraPages]
  return {
    pages,
    platform,
    pixels: pixelsList.filter(([, re]) => re.test(home.text)).map(([n]) => n),
    emailTools: emailList.filter(([, re]) => re.test(home.text)).map(([n]) => n),
    hasCheckout,
    prices: extractPrices(home.text, text),
    homeHtml: home.text,
    homeFinalUrl: home.finalUrl,
    pageHtml,
    booking,
    nextStep: readNextStep({
      hasCheckout,
      catalogKind: platform === "Shopify" || platform === "WooCommerce" ? "ecommerce" : null,
      ctaTexts: pages.flatMap((p) => p.ctaTexts),
      pageUrls: pages.map((p) => p.url),
      pageHtml,
    }),
    priceAnchor: priceAnchor(pageHtml),
    rendersInBrowser,
  }
}
