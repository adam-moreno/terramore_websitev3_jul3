import type { PageSnapshot } from "@/lib/report/types"
import {
  BOOKING_HINT,
  CDN_PATH,
  CTA_HINT,
  KEY_PAGE_HINTS,
  STATIC_ASSET,
  TRUST_HINTS,
  absoluteUrl,
  fetchText,
  pickAttr,
  sameOrigin,
  stripToText,
} from "@/lib/report/collect/fetch"

function extractNavLabels(html: string): string[] {
  const navBlocks = Array.from(html.matchAll(/<nav[\s\S]*?<\/nav>/gi)).map((m) => m[0])
  const source = navBlocks.length ? navBlocks.join(" ") : html.slice(0, 80_000)
  const labels = Array.from(source.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi))
    .map((m) => stripToText(m[1]))
    .filter((label) => label.length > 1 && label.length < 40)
  return Array.from(new Set(labels)).slice(0, 24)
}

function extractCtas(html: string): string[] {
  const candidates = [
    ...Array.from(html.matchAll(/<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)).map((m) => stripToText(m[1])),
  ]
  return Array.from(new Set(candidates.filter((t) => t && CTA_HINT.test(t) && t.length < 60))).slice(0, 12)
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
  return Array.from(new Set(urls)).slice(0, 8)
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
    hasEmail: emails.length > 0,
    hasBookingLink: BOOKING_HINT.test(html),
    trustSignals,
    excerpt: text.slice(0, 1800),
  }
}

/**
 * Homepage + up to 5 key linked pages discovered from the homepage.
 * Deterministic counts only; no LLM.
 */
export async function collectSiteExperience(website: string | null): Promise<{
  pages: PageSnapshot[]
  platform: string | null
  pixels: string[]
  emailTools: string[]
  hasCheckout: boolean
  prices: string[]
  homeHtml: string | null
  homeFinalUrl: string | null
  pageHtml: Array<{ url: string; html: string }>
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
    }
  }

  const homePage = parsePage(home.finalUrl, home.status, home.text)
  const pageHtml: Array<{ url: string; html: string }> = [{ url: home.finalUrl, html: home.text }]
  const linked = extractInternalLinks(home.text, home.finalUrl).filter((u) => u !== home.finalUrl.replace(/\/$/, ""))
  const extraPages: PageSnapshot[] = []
  for (const url of linked.slice(0, 5)) {
    const page = await fetchText(url, 8000)
    if (!page) continue
    extraPages.push(parsePage(page.finalUrl, page.status, page.text))
    pageHtml.push({ url: page.finalUrl, html: page.text })
  }

  const platforms: Array<[string, RegExp]> = [
    ["Shopify", /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i],
    ["WooCommerce", /woocommerce/i],
    ["Squarespace", /squarespace\.com/i],
    ["Wix", /wix\.com|wixstatic\.com/i],
    ["Webflow", /webflow\.com|data-wf-page/i],
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
  return {
    pages: [homePage, ...extraPages],
    platform: platforms.find(([, re]) => re.test(home.text))?.[0] || null,
    pixels: pixelsList.filter(([, re]) => re.test(home.text)).map(([n]) => n),
    emailTools: emailList.filter(([, re]) => re.test(home.text)).map(([n]) => n),
    hasCheckout: /\/cart|\/checkout|add[-_ ]to[-_ ]cart|Add to bag/i.test(home.text),
    prices: Array.from(new Set(text.match(/\$\s?\d{1,4}(?:[.,]\d{2})?/g) || [])).slice(0, 8),
    homeHtml: home.text,
    homeFinalUrl: home.finalUrl,
    pageHtml,
  }
}
