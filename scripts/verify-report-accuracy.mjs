/**
 * Report accuracy fixes (2026-10-12, docs: DEVELOPMENT_LOG.md "Report accuracy"). Pure functions only: no network.
 *   1. Long pages keep their footer (boundedText)
 *   2. Contact and service pages with suffixes or file extensions are read (KEY_PAGE_HINTS, keyPageRank)
 *   3. The next step is read per business (readNextStep): quote, order, store, booking; off-site forms count as contact
 *   4. No analytics or ad tags is a Top 5 action (buildRecommendations no_measurement)
 * Run: node scripts/verify-report-accuracy.mjs
 */

import path from "node:path"
import { register } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
register(pathToFileURL(path.join(root, "scripts/resolve-ts-alias.mjs")).href)

const { boundedText, HEAD_CHARS, TAIL_CHARS, KEY_PAGE_HINTS } = await import("../lib/report/collect/fetch.ts")
const { readNextStep, offSiteForms, keyPageRank } = await import("../lib/report/collect/next-step.ts")
const { buildRecommendations } = await import("../lib/report/recommend.ts")
const { scoreDigitalPresence } = await import("../lib/report/score/digital-presence.ts")

let checks = 0
function assert(cond, msg) {
  checks++
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

// 1. A footer past 600,000 characters survives; short pages are untouched.
const longPage = `<html><body>${"x".repeat(1_200_000)}<footer>Call 619-465-9813</footer></body></html>`
const kept = boundedText(longPage)
assert(kept.includes("619-465-9813"), "footer phone kept on a long page")
assert(kept.length <= HEAD_CHARS + TAIL_CHARS + 40, "long page still bounded")
assert(boundedText("<p>short</p>") === "<p>short</p>", "short page unchanged")

// 2. Page names with suffixes and extensions are read; unrelated pages are not.
for (const p of ["/contact", "/contact-us/", "/contact.html", "/our-services.php", "/free-estimate/", "/request-a-quote/", "/about-us", "/gallery.html"]) {
  assert(KEY_PAGE_HINTS.test(p), `reads ${p}`)
}
for (const p of ["/shopping-guide", "/blog/post-1", "/careers", "/workshop"]) assert(!KEY_PAGE_HINTS.test(p), `skips ${p}`)
assert(keyPageRank("https://x.com/contact.html") < keyPageRank("https://x.com/gallery.html"), "contact read before gallery")
assert(keyPageRank("https://x.com/get-a-quote/") < keyPageRank("https://x.com/services/"), "quote read before services")

// 3. Next step per business.
const page = (html, url = "https://example.com/") => ({ url, html })
const quote = readNextStep({ hasCheckout: false, ctaTexts: ["Request A Quote"], pageUrls: ["https://aztec.example/"], pageHtml: [page("<p>Paving</p>")] })
assert(quote.path === "quote" && quote.quoteRequest, "quote CTA → quote path")
const quoteCopy = readNextStep({ hasCheckout: false, ctaTexts: ["Get started"], pageUrls: [], pageHtml: [page("<p>Call for a <b>free estimate</b> today</p>")] })
assert(quoteCopy.path === "quote", "'free estimate' wording → quote path")
const baker = readNextStep({
  hasCheckout: false,
  ctaTexts: [],
  pageUrls: [],
  pageHtml: [page('<a href="https://forms.gle/abc">order form (2 weeks notice)</a><a href="https://venmo.com/u/fern">venmo deposit</a>')],
})
assert(baker.path === "order" && baker.orderForm, "order form and Venmo → order path")
const hvac = offSiteForms('<link rel="dns-prefetch" href="https://secure.wufoo.com"><a href="https://shop.wufoo.com/forms/x">online form</a>', "https://example.com/")
assert(hvac.externalForm && !hvac.orderForm, "a Wufoo contact form is a contact form, not an order path")
assert(offSiteForms('<link rel="dns-prefetch" href="https://secure.wufoo.com">', "https://example.com/").externalForm === null, "dns-prefetch is not a form link")
const store = readNextStep({ hasCheckout: true, ctaTexts: ["Request a quote"], pageUrls: [], pageHtml: [page("<p>Shop</p>")] })
assert(store.path === "store", "checkout wins over quote wording")
const salon = readNextStep({ hasCheckout: false, ctaTexts: ["Call us"], pageUrls: [], pageHtml: [page("<p>Cuts and color</p>")] })
assert(salon.path === "booking", "appointment business → booking path")

// 3b. A quote path scores like a booking path in Conversion Readiness.
const home = {
  url: "https://example.com/",
  status: 200,
  title: "Example",
  h1: ["Paving"],
  navLabels: [],
  ctaTexts: ["Request A Quote"],
  formCount: 1,
  hasPhone: true,
  hasEmail: false,
  hasBookingLink: false,
  trustSignals: [],
  excerpt: "",
}
const base = {
  pages: [home],
  technical: { https: true, title: "Example", description: null, canonical: null, hasRobots: false, hasSitemap: false, viewport: true, status: 200, note: "" },
  directories: [],
  places: { checked: false, found: false, placeId: null, rating: null, reviewCount: null, hasAddress: false },
  catalog: { available: false, kind: "unknown", productCount: null, variantHeavy: false, note: "" },
  hasCheckout: false,
}
const conv = (s) => s.factors.find((f) => f.id === "conversion")
const without = conv(scoreDigitalPresence(base))
const withQuote = conv(scoreDigitalPresence({ ...base, nextStep: quote }))
assert(withQuote.score - without.score === 15 && withQuote.evidence.includes("Quote request path found"), "quote path adds the booking-path points")

// 4. No measurement is a Top 5 action; any tag (or not checked) is not.
const recInput = { pages: [home], technical: base.technical, directories: [], catalog: base.catalog, hasCheckout: false, competitiveAvailable: false }
const none = buildRecommendations({ ...recInput, pixels: [] })
assert(none.recommendations.some((r) => r.id === "no_measurement"), "no tags → no_measurement in Top 5")
assert(!buildRecommendations({ ...recInput, pixels: ["Google Analytics"] }).findings.some((f) => f.id === "no_measurement"), "GA present → no measurement finding")
assert(!buildRecommendations(recInput).findings.some((f) => f.id === "no_measurement"), "tags not checked → no claim")
const bakerHome = { ...home, ctaTexts: [], formCount: 0, hasPhone: false }
assert(
  !buildRecommendations({ ...recInput, pages: [bakerHome], pixels: [], nextStep: baker }).findings.some((f) => f.id === "weak_contact"),
  "an order form counts as a way to reach the business",
)

// 5. Call consent (lib/consent/call-consent.ts): the form shows the shared wording, the API records its version.
const fs = await import("node:fs")
const { CALL_CONSENT_TEXT, CALL_CONSENT_VERSION, callConsentRecord } = await import("../lib/consent/call-consent.ts")
const form = fs.readFileSync(path.join(root, "components/report-form.tsx"), "utf8")
const api = fs.readFileSync(path.join(root, "app/api/report/route.ts"), "utf8")
assert(/\bAI or prerecorded voice\b/.test(CALL_CONSENT_TEXT) && /isn't required to buy/.test(CALL_CONSENT_TEXT) && /stop calling/.test(CALL_CONSENT_TEXT), "consent names AI voice, not a condition of purchase, how to opt out")
assert(/useState\(false\)[^\n]*\n?[\s\S]{0,40}/.test(form) && /const \[callConsent, setCallConsent\] = useState\(false\)/.test(form), "call box unchecked by default")
assert(/\{CALL_CONSENT_TEXT\}/.test(form), "form shows the shared wording")
assert(/body\.callConsent === true && Boolean\(phone\)/.test(api), "API needs the box and a phone")
const rec = callConsentRecord({ at: "2026-10-12T20:00:00.000Z", page: "https://www.terramore.io/report", ip: "203.0.113.5", userAgent: "x".repeat(500) })
assert(rec.call_consent === "yes" && rec.call_consent_version === CALL_CONSENT_VERSION && rec.call_consent_ua.length === 200, "record carries version, time, page, IP, trimmed browser")

// 6. Value fixes: price for scale, unfinished pages, effort on every action, measurement by business.
const { priceAnchor, placeholderPages } = await import("../lib/report/collect/site-experience.ts")
const anchor = priceAnchor([
  { url: "https://p.example/services.html", html: "<h2>Cabinet refinishing</h2><p>Spray-finished cabinets starting at $3,800 for a standard kitchen.</p><p>Interior rooms from $450.</p><p>Since 2019 we've saved homeowners $2,000,000.</p>" },
])
assert(anchor?.amount === "$3,800" && anchor.context.startsWith("Spray-finished cabinets"), "highest listed price, its own sentence, no heading run-in")
assert(priceAnchor([{ url: "x", html: "<p>Over $5,000 saved by clients</p>" }]) === null, "amounts that aren't prices are ignored")
const gallery = { ...home, url: "https://p.example/gallery.html", title: "Gallery", h1: ["Recent Projects"], excerpt: "Gallery Recent Projects Photos coming soon!" }
const ph = placeholderPages([home, gallery])
assert(ph.length === 1 && ph[0].phrase === "Photos coming soon!" && ph[0].isWorkPage, "unfinished work page found, phrase without title run-in")
const value = buildRecommendations({ ...recInput, pages: [home, gallery], pixels: [], nextStep: quote, priceAnchor: anchor })
const top = value.recommendations[0]
assert(top.id === "no_measurement" && top.action.startsWith("Step 1:") && /an afternoon, or we can set it up/.test(top.effort), "measurement: benefit, two steps, effort")
assert(/For scale: your site lists "Spray-finished cabinets starting at \$3,800 for a standard kitchen"\. One more job like that is \$3,800\./.test(top.impact), "price for scale on the top action, in the owner's words")
assert(value.recommendations.some((r) => r.id === "placeholder_page" && /phone camera/.test(r.effort)), "placeholder action with effort")
assert(value.recommendations.every((r) => r.effort), "every action has an effort")
const bakerRecs = buildRecommendations({ ...recInput, pages: [bakerHome], pixels: [], nextStep: baker })
const bakerMeasure = bakerRecs.findings.find((f) => f.id === "no_measurement")
assert(bakerMeasure && /order form/.test(bakerMeasure.action) && !/Google Analytics/.test(bakerMeasure.action), "order business: order-form steps, not Google Analytics")

console.log(`report accuracy: ok (${checks} checks)`)
