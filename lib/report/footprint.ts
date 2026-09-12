/**
 * Reads the public footprint of a business. No paid APIs are required.
 * Everything here is a fact we observed, or "not found". The model is told to use only this.
 *
 * Optional: GOOGLE_PLACES_API_KEY adds one Places Text Search call (rating, review count, hours).
 */

export type Footprint = {
  input: { businessName: string; website: string | null }
  site: {
    url: string | null
    reachable: boolean
    status: number | null
    finalUrl: string | null
    title: string | null
    description: string | null
    h1: string[]
    platform: string | null
    https: boolean
    hasRobots: boolean
    hasSitemap: boolean
    pixels: string[]
    emailTools: string[]
    socialLinks: Record<string, string>
    contact: { emails: string[]; phones: string[] }
    hasCheckout: boolean
    hasBooking: boolean
    prices: string[]
    excerpt: string
    fetchedAt: string
  }
  maps: {
    checked: boolean
    found: boolean
    name: string | null
    rating: number | null
    reviewCount: number | null
    address: string | null
    openNow: boolean | null
    hasHours: boolean
    mapsUrl: string | null
  }
  adLibraries: {
    metaAdLibraryUrl: string | null
    googleAdsTransparencyUrl: string | null
    note: string
  }
}

const UA = "Mozilla/5.0 (compatible; TerramoreFootprintBot/1.0; +https://terramore.io/report)"

export function normalizeWebsite(raw: string | null | undefined): string | null {
  if (!raw) return null
  let value = raw.trim()
  if (!value) return null
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`
  try {
    const url = new URL(value)
    if (!url.hostname.includes(".")) return null
    return url.toString()
  } catch {
    return null
  }
}

async function fetchText(url: string, timeoutMs = 10000): Promise<{ status: number; text: string; finalUrl: string } | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,text/plain,*/*" },
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

function pick(regex: RegExp, html: string): string | null {
  const match = html.match(regex)
  return match ? decode(match[1]).trim() : null
}

function decode(value: string): string {
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

function stripToText(html: string): string {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim()
}

const PLATFORMS: Array<[string, RegExp]> = [
  ["Shopify", /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i],
  ["WooCommerce", /woocommerce/i],
  ["Squarespace", /squarespace\.com|static1\.squarespace/i],
  ["Wix", /wix\.com|wixstatic\.com/i],
  ["Webflow", /webflow\.com|data-wf-page/i],
  ["BigCommerce", /bigcommerce\.com/i],
  ["WordPress", /wp-content|wp-includes/i],
  ["GoDaddy Website Builder", /godaddy\.com|img1\.wsimg\.com/i],
  ["Framer", /framerusercontent\.com/i],
  ["Next.js", /_next\/static/i],
]

const PIXELS: Array<[string, RegExp]> = [
  ["Meta Pixel", /connect\.facebook\.net|fbq\(/i],
  ["Google Analytics", /googletagmanager\.com\/gtag|google-analytics\.com|gtag\(/i],
  ["Google Tag Manager", /googletagmanager\.com\/gtm\.js/i],
  ["Google Ads", /googleads\.g\.doubleclick\.net|AW-\d{6,}/i],
  ["TikTok Pixel", /analytics\.tiktok\.com|ttq\./i],
  ["Pinterest Tag", /pintrk\(|ct\.pinterest\.com/i],
  ["Hotjar", /static\.hotjar\.com/i],
  ["Microsoft Clarity", /clarity\.ms/i],
]

const EMAIL_TOOLS: Array<[string, RegExp]> = [
  ["Klaviyo", /klaviyo/i],
  ["Mailchimp", /mailchimp|list-manage\.com|chimpstatic/i],
  ["HubSpot", /hs-scripts\.com|hubspot/i],
  ["ConvertKit", /convertkit/i],
  ["Omnisend", /omnisend/i],
  ["ActiveCampaign", /activecampaign/i],
  ["Constant Contact", /constantcontact/i],
]

const SOCIAL: Array<[string, RegExp]> = [
  ["instagram", /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?/i],
  ["facebook", /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?/i],
  ["tiktok", /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9_.-]+\/?/i],
  ["youtube", /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/)[A-Za-z0-9_.-]+\/?/i],
  ["linkedin", /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9_.-]+\/?/i],
  ["x", /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+\/?/i],
  ["yelp", /https?:\/\/(?:www\.)?yelp\.com\/biz\/[A-Za-z0-9_.-]+\/?/i],
  ["googleMaps", /https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.app\.goo\.gl|g\.page)\/[^\s"'<>]+/i],
]

function detect(list: Array<[string, RegExp]>, html: string): string[] {
  return list.filter(([, regex]) => regex.test(html)).map(([name]) => name)
}

async function readSite(website: string | null): Promise<Footprint["site"]> {
  const empty: Footprint["site"] = {
    url: website,
    reachable: false,
    status: null,
    finalUrl: null,
    title: null,
    description: null,
    h1: [],
    platform: null,
    https: website?.startsWith("https://") ?? false,
    hasRobots: false,
    hasSitemap: false,
    pixels: [],
    emailTools: [],
    socialLinks: {},
    contact: { emails: [], phones: [] },
    hasCheckout: false,
    hasBooking: false,
    prices: [],
    excerpt: "",
    fetchedAt: new Date().toISOString(),
  }
  if (!website) return empty

  const page = await fetchText(website)
  if (!page) return empty

  const html = page.text
  const origin = new URL(page.finalUrl).origin
  const [robots, sitemap] = await Promise.all([fetchText(`${origin}/robots.txt`, 6000), fetchText(`${origin}/sitemap.xml`, 6000)])

  const socialLinks: Record<string, string> = {}
  for (const [key, regex] of SOCIAL) {
    const match = html.match(regex)
    if (match) socialLinks[key] = match[0]
  }

  const text = stripToText(html)
  const emails = Array.from(new Set(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])).filter((value) => !/\.(png|jpg|svg|webp)$/i.test(value)).slice(0, 3)
  const phones = Array.from(new Set(text.match(/(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g) || [])).slice(0, 3)
  const prices = Array.from(new Set(text.match(/\$\s?\d{1,4}(?:[.,]\d{2})?/g) || [])).slice(0, 8)
  const h1 = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map((m) => stripToText(m[1])).filter(Boolean).slice(0, 3)

  return {
    url: website,
    reachable: page.status < 400,
    status: page.status,
    finalUrl: page.finalUrl,
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i, html),
    description: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i, html) || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i, html),
    h1,
    platform: detect(PLATFORMS, html)[0] || null,
    https: page.finalUrl.startsWith("https://"),
    hasRobots: Boolean(robots && robots.status < 400 && /user-agent/i.test(robots.text)),
    hasSitemap: Boolean(sitemap && sitemap.status < 400 && /<urlset|<sitemapindex/i.test(sitemap.text)),
    pixels: detect(PIXELS, html),
    emailTools: detect(EMAIL_TOOLS, html),
    socialLinks,
    contact: { emails, phones },
    hasCheckout: /\/cart|\/checkout|add[-_ ]to[-_ ]cart|Add to bag/i.test(html),
    hasBooking: /calendly\.com|squareup\.com\/appointments|acuityscheduling|book(?:ing)?[-_ ]?(?:now|online|an? appointment)|vagaro|mindbody|zocdoc|opentable|resy\.com/i.test(html),
    prices,
    excerpt: text.slice(0, 2500),
    fetchedAt: new Date().toISOString(),
  }
}

async function readMaps(businessName: string, website: string | null): Promise<Footprint["maps"]> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const empty: Footprint["maps"] = {
    checked: false,
    found: false,
    name: null,
    rating: null,
    reviewCount: null,
    address: null,
    openNow: null,
    hasHours: false,
    mapsUrl: null,
  }
  const query = businessName || (website ? new URL(website).hostname.replace(/^www\./, "") : "")
  if (!key || !query) return empty

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.regularOpeningHours,places.currentOpeningHours.openNow,places.googleMapsUri,places.websiteUri",
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 3 }),
    })
    if (!response.ok) {
      console.warn("[footprint] Places lookup failed:", response.status)
      return { ...empty, checked: true }
    }
    const data = (await response.json()) as { places?: Array<Record<string, any>> }
    const places = data.places || []
    const host = website ? new URL(website).hostname.replace(/^www\./, "") : null
    const place = places.find((p) => host && typeof p.websiteUri === "string" && p.websiteUri.includes(host)) || places[0]
    if (!place) return { ...empty, checked: true }
    return {
      checked: true,
      found: true,
      name: place.displayName?.text || null,
      rating: typeof place.rating === "number" ? place.rating : null,
      reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      address: place.formattedAddress || null,
      openNow: typeof place.currentOpeningHours?.openNow === "boolean" ? place.currentOpeningHours.openNow : null,
      hasHours: Boolean(place.regularOpeningHours),
      mapsUrl: place.googleMapsUri || null,
    }
  } catch (error) {
    console.warn("[footprint] Places lookup error:", error)
    return { ...empty, checked: true }
  }
}

export async function readFootprint(businessName: string, rawWebsite: string | null | undefined): Promise<Footprint> {
  const website = normalizeWebsite(rawWebsite)
  const [site, maps] = await Promise.all([readSite(website), readMaps(businessName, website)])

  const host = website ? new URL(website).hostname.replace(/^www\./, "") : null
  const queryName = businessName || host

  return {
    input: { businessName, website },
    site,
    maps,
    adLibraries: {
      metaAdLibraryUrl: queryName
        ? `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(queryName)}`
        : null,
      googleAdsTransparencyUrl: host ? `https://adstransparency.google.com/?region=US&domain=${encodeURIComponent(host)}` : null,
      note: "Ad libraries render in the browser and were not read automatically. Links are included for a manual check.",
    },
  }
}

/** Compact, human readable facts for the model prompt. Only observed values; misses say "not found". */
export function footprintToFacts(fp: Footprint): string {
  const s = fp.site
  const m = fp.maps
  const nf = "not found"
  const yesNo = (v: boolean) => (v ? "yes" : "no")
  const lines = [
    `Business name given: ${fp.input.businessName || nf}`,
    `Website given: ${fp.input.website || nf}`,
    `Site reachable: ${yesNo(s.reachable)}${s.status ? ` (HTTP ${s.status})` : ""}`,
    `Final URL: ${s.finalUrl || nf}`,
    `HTTPS: ${yesNo(s.https)}`,
    `Page title: ${s.title || nf}`,
    `Meta description: ${s.description || nf}`,
    `H1 headings: ${s.h1.length ? s.h1.join(" | ") : nf}`,
    `Platform detected: ${s.platform || nf}`,
    `robots.txt: ${yesNo(s.hasRobots)}; sitemap.xml: ${yesNo(s.hasSitemap)}`,
    `Tracking on the site: ${s.pixels.length ? s.pixels.join(", ") : nf}`,
    `Email or CRM tool on the site: ${s.emailTools.length ? s.emailTools.join(", ") : nf}`,
    `Social links on the site: ${Object.keys(s.socialLinks).length ? Object.entries(s.socialLinks).map(([k, v]) => `${k} ${v}`).join("; ") : nf}`,
    `Cart or checkout on the site: ${yesNo(s.hasCheckout)}`,
    `Booking or appointments on the site: ${yesNo(s.hasBooking)}`,
    `Prices seen on the home page: ${s.prices.length ? s.prices.join(", ") : nf}`,
    `Contact email on the site: ${s.contact.emails.join(", ") || nf}`,
    `Phone on the site: ${s.contact.phones.join(", ") || nf}`,
    `Google Maps listing: ${!m.checked ? "not checked (no Places key)" : m.found ? `found as "${m.name}"` : nf}`,
    m.found ? `Maps rating: ${m.rating ?? nf} from ${m.reviewCount ?? 0} reviews` : "",
    m.found ? `Maps address: ${m.address || nf}; hours listed: ${yesNo(m.hasHours)}` : "",
    `Ad libraries: not read automatically`,
    "",
    "Home page text (first part):",
    s.excerpt || nf,
  ]
  return lines.filter((line) => line !== "").join("\n")
}
