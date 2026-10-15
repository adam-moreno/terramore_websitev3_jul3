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
assert(
  /For scale: your site lists "Spray-finished cabinets starting at \$3,800 for a standard kitchen"\. This takes an afternoon; even one more job like that is \$3,800\./.test(top.impact),
  `price set against the effort, in the owner's words (${top.impact})`,
)
const { effortPhrase } = await import("../lib/report/recommend.ts")
assert(effortPhrase("Step 1: about 10 minutes, and you can start today. Step 2: an afternoon, or we can set it up for you.") === "an afternoon", "two-step effort: the main step")
assert(effortPhrase("About 15 minutes; often a setting in your site builder.") === "about 15 minutes", "one-step effort")
assert(effortPhrase("A decision, not a task.") === null, "no time, no 'This takes' clause")
assert(value.recommendations.some((r) => r.id === "placeholder_page" && /phone camera/.test(r.effort)), "placeholder action with effort")
assert(value.recommendations.every((r) => r.effort), "every action has an effort")
const bakerRecs = buildRecommendations({ ...recInput, pages: [bakerHome], pixels: [], nextStep: baker })
const bakerMeasure = bakerRecs.findings.find((f) => f.id === "no_measurement")
assert(bakerMeasure && /order form/.test(bakerMeasure.action) && !/Google Analytics/.test(bakerMeasure.action), "order business: order-form steps, not Google Analytics")

// 8. "Who updates your website?" sets who does each fix, how long it takes, and the note to forward.
const { siteManagerFrom } = await import("../lib/report/recommend.ts")
assert(siteManagerFrom("when=month; how=self; site=someone") === "someone" && siteManagerFrom("site=self") === "self", "site answer read")
assert(siteManagerFrom("type=x") === "unsure" && siteManagerFrom(null) === "unsure", "no answer → not sure")
const mine = buildRecommendations({ ...recInput, pages: [home], pixels: [], nextStep: quote, siteManager: "self", platform: "Wix" })
const mineM = mine.findings.find((f) => f.id === "no_measurement")
assert(/Step 2: about 15 minutes in your Wix settings/.test(mineM.effort) && !mineM.handoff && mineM.fixable, `owner on Wix: builder time, no note (${mineM.effort})`)
const theirs = buildRecommendations({ ...recInput, pages: [home], pixels: [], nextStep: quote, siteManager: "someone", platform: "WordPress" })
const theirsM = theirs.findings.find((f) => f.id === "no_measurement")
assert(/your web person, usually a day or two/.test(theirsM.effort) && /Google Analytics 4/.test(theirsM.handoff), "web person: honest time and a note to forward")
assert(theirs.findings.filter((f) => f.id !== "no_measurement" && f.handoff).every((f) => /^Your web person/.test(f.effort)), "every website change says who does it")
const unsure = buildRecommendations({ ...recInput, pages: [home], pixels: [], nextStep: quote, platform: "Shopify" })
assert(unsure.findings.find((f) => f.id === "no_measurement").handoff && /Shopify/.test(unsure.findings.find((f) => f.id === "no_measurement").effort), "not sure: builder time and the note")
const bakerTheirs = buildRecommendations({ ...recInput, pages: [bakerHome], pixels: [], nextStep: baker, siteManager: "someone" }).findings.find((f) => f.id === "no_measurement")
assert(bakerTheirs && !bakerTheirs.handoff && !bakerTheirs.fixable && /5 minutes/.test(bakerTheirs.effort), "order form stays with the owner")
assert(effortPhrase("Step 1: about 10 minutes. Step 2: your web person, usually a day or two to fit it in.") === "a day or two", "web-person effort phrase")
const { FIX_IT_LINE } = await import("../lib/report/write.ts")
assert(typeof FIX_IT_LINE === "string" && /Fix it for me/.test(FIX_IT_LINE), "Fix it for me line")
const popupSrc = fs.readFileSync(path.join(root, "components/report-popup.tsx"), "utf8")
assert(/key: "site"/.test(popupSrc) && /Who updates your website\?/.test(popupSrc), "report form asks who updates the website")

// 7. Phone clicks: placement and page only, never the number or the visitor (lib/funnel-taxonomy.ts).
const { sanitizeFunnelParams } = await import("../lib/funnel-taxonomy.ts")
const clean = sanitizeFunnelParams("phone_click", { placement: "header", page_path: "/book", phone: "+18186999217", email: "a@b.co" })
assert(clean && clean.placement === "header" && clean.page_path === "/book" && !("phone" in clean) && !("email" in clean), "phone_click keeps placement and page, drops personal data")
assert(sanitizeFunnelParams("phone_click", { placement: "billboard" })?.placement === undefined, "unknown placement dropped")
const linkSrc = fs.readFileSync(path.join(root, "components/phone-link.tsx"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")
assert(/trackFunnelEvent\("phone_click", \{ placement \}\)/.test(linkSrc) && !/conversion|AW-/.test(linkSrc), "phone link fires phone_click, no Ads conversion")
for (const f of ["components/site-header.tsx", "components/site-footer.tsx", "app/book/page.tsx"]) {
  assert(!/href=\{PHONE_HREF\}|tel:\+1/.test(fs.readFileSync(path.join(root, f), "utf8")), `${f}: every phone link is tracked`)
}

// 9. A builder that draws its buttons in the browser (Wix): no button in the HTML is a low-priority check, never the
//    confirmed no_cta problem, and it doesn't hold back paid ads. A normal HTML page with no button keeps no_cta.
const noCtaHome = { ...home, ctaTexts: [] }
const plainRecs = buildRecommendations({ ...recInput, pages: [noCtaHome], pixels: [] })
assert(plainRecs.findings.some((f) => f.id === "no_cta" && f.priority === "high"), "normal HTML, no button → no_cta")
const wixRecs = buildRecommendations({ ...recInput, pages: [{ ...noCtaHome, ctaUnconfirmed: true }], pixels: [], platform: "Wix" })
const check = wixRecs.findings.find((f) => f.id === "check_cta")
assert(!wixRecs.findings.some((f) => f.id === "no_cta"), "Wix, no button in HTML → no confirmed no_cta")
assert(check && check.priority === "low" && check.confidence === "low" && !check.fixable, "Wix: a low-confidence check, not a fix")
assert(/couldn't confirm/.test(check.finding) && /Wix draws some buttons in the browser/.test(check.evidence) && /check there's one clear button/.test(check.action), "Wix: phrased as a check")
assert(!wixRecs.findings.some((f) => f.id === "hold_paid"), "an unconfirmed button doesn't hold back paid ads")

// 10. The email box on the report form (2026-10-14): its job is said in the label, it stays unticked and required, and a
//     missing field gets its own message under it, linked to the field, announced, with focus on the first problem.
assert(/Email me my report and occasional tips\. You can unsubscribe any time\./.test(form), "consent label says what the emails are")
assert(!/occasional notes about the work/.test(form) && !/consent are required/.test(form), "old label and lumped error are gone")
assert(/const \[consent, setConsent\] = useState\(false\)/.test(form), "email box starts unticked")
assert(/"consent" && !v\.consent\) return \{ message: "Tick the box so we can email your report\."/.test(form), "missing box has its own message")
for (const f of ["website", "first_name", "last_name", "email", "consent"]) {
  assert(new RegExp(`data-field="${f}"\\s+aria-invalid=\\{fieldErrors\\.${f} \\? true : undefined\\}\\s+aria-describedby=\\{fieldErrors\\.${f} \\? "report-${f}-error"`).test(form), `${f}: aria-invalid and aria-describedby only after a failed check`)
  assert(form.includes(`<FieldError id="report-${f}-error" message={fieldErrors.${f}} />`), `${f}: message under the field`)
}
assert(/<span id=\{id\} role="alert"/.test(form), "field messages are announced")
assert(/inputs\.find\(\(input\) => input\.dataset\.field === problems\[0\]\.field\)\?\.focus\(\)/.test(form), "focus moves to the first problem")
assert(/noValidate/.test(form) && /trackFunnelEvent\("report_validation_error"/.test(form), "own validation, still one tracked event per attempt")

// 11. The report email shows the value without opening the PDF (2026-10-14): the score and the top two fixes by rank,
//     each with one short action and "Fix this" to the Growth Workspace; nothing the PDF doesn't show.
{
  const { reportEmailSummary, shortAction } = await import("../lib/report/email-summary.ts")
  const recs = [
    { id: "missing_meta", rank: 2, finding: "Search results show no description of the business.", action: "Add a one-sentence meta description. Keep it under 160 characters.", evidence: "meta description: none", impact: "x", priority: "medium", confidence: "high", fixable: true },
    { id: "no_measurement", rank: 1, finding: "No analytics are installed.", action: "Step 1: list where customers come from today. Step 2: install Google Analytics 4.", evidence: "Homepage code", impact: "x", priority: "high", confidence: "high", fixable: true },
    { id: "thin_trust", rank: 3, finding: "Few trust signals.", action: "Add reviews.", evidence: "x", impact: "x", priority: "low", confidence: "medium" },
  ]
  const ws = "https://app.example/workspace?source=report_email"
  const sum = reportEmailSummary({ businessName: "Buynest", overallScore: 44, recommendations: recs, workspaceUrl: ws })
  const text = sum.text.join("\n")
  assert(text.startsWith("Buynest scored 44 out of 100"), `email: score line (${sum.text[0]})`)
  assert(text.indexOf("No analytics are installed.") < text.indexOf("Search results show no description"), "email: fixes in rank order")
  assert(!text.includes("Few trust signals"), "email: only the top two fixes")
  assert(text.includes("   list where customers come from today.") && !text.includes("Step 2"), "email: one short action (step 1 only)")
  assert(text.includes("   Add a one-sentence meta description.") && !text.includes("160 characters"), "email: first sentence of the action")
  assert(sum.text.filter((l) => l === `   Fix this: ${ws}`).length === 2 && (sum.html.match(/>Fix this<\/a>/g) || []).length === 2, "email: Fix this on each, text and HTML")
  assert(sum.html.includes(`href="${ws.replace(/&/g, "&amp;")}"`), "email: Fix this opens the Growth Workspace with source=report_email")
  for (const hidden of ["missing_meta", "no_measurement", "Homepage code", "high", "medium", "confidence"]) {
    assert(!text.includes(hidden) && !sum.html.includes(hidden), `email: no internal value (${hidden})`)
  }
  assert(sum.preview === "Buynest scored 44 out of 100. The two fixes to start with are inside.", `email: preview (${sum.preview})`)
  const noWs = reportEmailSummary({ businessName: "Buynest", overallScore: null, recommendations: recs, workspaceUrl: null })
  assert(!noWs.text.join(" ").includes("Fix this") && !noWs.html.includes("Fix this") && noWs.preview === null && !noWs.text.join(" ").includes("scored"), "email: no workspace link or score → neither shown")
  const xss = reportEmailSummary({ businessName: "<b>A</b>", overallScore: 50, recommendations: [{ ...recs[1], finding: "<script>x</script>" }], workspaceUrl: ws })
  assert(!xss.html.includes("<script>") && !xss.html.includes("<b>A</b>"), "email: values escaped in HTML")
  assert(shortAction("Do this now. Then that.") === "Do this now.", "short action: first sentence")
  const pipe = fs.readFileSync(path.join(root, "lib/report/pipeline.ts"), "utf8")
  const t = pipe.indexOf("...summary.text"), tPdf = pipe.indexOf("is attached as a PDF.`", t)
  const h = pipe.indexOf("summary.html,"), hPdf = pipe.indexOf("is attached as a PDF.`)", h)
  assert(t > 0 && tPdf > t && h > 0 && hPdf > h, "email: summary sits above the PDF line in text and HTML")
  assert(pipe.includes('emailButton("Open my Growth Workspace", workspaceUrl)') && pipe.includes('emailTextLink("Or book a free call", BOOK_URL)'), "email: workspace and booking buttons kept")
}

console.log(`report accuracy: ok (${checks} checks)`)
