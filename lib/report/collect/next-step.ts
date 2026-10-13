/**
 * How a business takes its next customer step, read from its own pages. Pure.
 *
 *   store   → a cart or checkout on the site
 *   order   → an order or payment link off the site (Venmo, Square ordering, Toast…), or an off-site form labelled for
 *             orders, typical of makers and link-in-bio pages
 *   quote   → visitors ask for a quote, estimate or bid (contractors, commercial and B2B work)
 *   booking → everything else: appointment-style businesses, where booking a time online is the natural step
 *
 * The check and the report use this so a paver isn't told to "book a time online", and a contact form hosted on
 * another service (Wufoo, Google Forms, Jotform) counts as a way to get in touch.
 */

export type NextStepPath = "store" | "order" | "quote" | "booking"

export type NextStep = {
  path: NextStepPath
  /** A quote, estimate or bid request was offered (a call to action, a page named for it, or wording such as "free estimate"). */
  quoteRequest: boolean
  /** The first off-site order or payment link found, if any. */
  orderForm: string | null
  /** The first off-site contact form found (a form service link that isn't for orders), if any. */
  externalForm: string | null
}

const FORM_HOSTS = ["forms.gle", "jotform.com", "typeform.com", "tally.so", "formstack.com", "wufoo.com", "cognitoforms.com", "paperform.co"]
const ORDER_HOSTS = ["venmo.com", "cash.app", "paypal.me", "toasttab.com", "order.online", "hotplate.com", "castiron.me"]
const ORDER_LABEL = /\b(order|orders|buy|purchase|deposit|pay|checkout)\b/i

function hostOf(url: string): { host: string; path: string } | null {
  try {
    const u = new URL(url)
    return { host: u.hostname.toLowerCase(), path: u.pathname }
  } catch {
    return null
  }
}

const onDomain = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

/** A form service link (Google Forms, Jotform, Wufoo…). */
export function isFormServiceUrl(url: string): boolean {
  const h = hostOf(url)
  if (!h) return false
  if (FORM_HOSTS.some((d) => onDomain(h.host, d))) return h.path.length > 1 || h.host === "forms.gle"
  return h.host === "docs.google.com" && /^\/forms\//i.test(h.path)
}

/** An ordering or payment link. Square booking pages are booking, not ordering (isSchedulerUrl). */
export function isOrderUrl(url: string): boolean {
  const h = hostOf(url)
  if (!h) return false
  if (ORDER_HOSTS.some((d) => onDomain(h.host, d))) return true
  if (onDomain(h.host, "square.site") || onDomain(h.host, "squareup.com")) return !/\/(appointments|book)(\/|$)/i.test(h.path)
  return false
}

/** Off-site forms and order links from real <a> links (not <link rel="dns-prefetch"> and the like). */
export function offSiteForms(html: string, baseUrl: string): { orderForm: string | null; externalForm: string | null } {
  let orderForm: string | null = null
  let externalForm: string | null = null
  for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"'#]+)["'][^>]*>([\s\S]{0,300}?)<\/a>/gi)) {
    let abs: string
    try {
      abs = new URL(m[1], baseUrl).toString()
    } catch {
      continue
    }
    const label = m[2].replace(/<[^>]+>/g, " ")
    if (!orderForm && (isOrderUrl(abs) || (isFormServiceUrl(abs) && ORDER_LABEL.test(label)))) orderForm = abs
    else if (!externalForm && isFormServiceUrl(abs)) externalForm = abs
    if (orderForm && externalForm) break
  }
  return { orderForm, externalForm }
}

const QUOTE_WORDS = /\b(quotes?|estimates?|bids?|rfq|rfp|proposals?)\b/i
const QUOTE_PATH = /\/(?:[a-z-]*-)?(quote|estimate|bid|rfq)s?(?:[-_][a-z0-9-]*)?(?:\.(?:html?|php|aspx?))?(?:\/|$|\?|#)/i
const QUOTE_COPY =
  /\b(?:free (?:estimates?|quotes?|bids?|inspections?)|request (?:a|an|your) (?:free )?(?:quote|estimate|bid|proposal)|get (?:a|an|your) (?:free )?(?:quote|estimate|bid))\b/i

export function readNextStep(input: {
  hasCheckout: boolean
  catalogKind?: string | null
  ctaTexts: string[]
  pageUrls: string[]
  pageHtml: Array<{ url: string; html: string }>
}): NextStep {
  let orderForm: string | null = null
  let externalForm: string | null = null
  for (const p of input.pageHtml) {
    const found = offSiteForms(p.html, p.url)
    orderForm ??= found.orderForm
    externalForm ??= found.externalForm
  }
  const quoteRequest =
    input.ctaTexts.some((t) => QUOTE_WORDS.test(t)) ||
    input.pageUrls.some((u) => QUOTE_PATH.test(hostOf(u)?.path ?? u)) ||
    input.pageHtml.some((p) => QUOTE_COPY.test(p.html.replace(/<[^>]+>/g, " ")))
  const path: NextStepPath =
    input.hasCheckout || input.catalogKind === "ecommerce" ? "store" : orderForm ? "order" : quoteRequest ? "quote" : "booking"
  return { path, quoteRequest, orderForm, externalForm }
}

export const BOOKING_PATH_STEP: NextStep = { path: "booking", quoteRequest: false, orderForm: null, externalForm: null }

/** Linked pages to read first: the ones that hold the way to reach the business. */
export function keyPageRank(url: string): number {
  const path = hostOf(url)?.path.toLowerCase() ?? url.toLowerCase()
  if (/contact/.test(path)) return 0
  if (/quote|estimate|bid|rfq/.test(path)) return 1
  if (/book|schedul|appointment|order/.test(path)) return 2
  if (/service|product|shop|store|menu|pricing/.test(path)) return 3
  if (/about|team|our-story/.test(path)) return 4
  return 5
}
