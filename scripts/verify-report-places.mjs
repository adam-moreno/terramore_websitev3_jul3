/**
 * Digital Footprint report: Google Places values must stay transient.
 * Stubs fetch, so nothing calls Google, the model provider, the website, or Supabase.
 * Run: node scripts/verify-report-places.mjs
 */

import path from "node:path"
import { register } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
register(pathToFileURL(path.join(root, "scripts/resolve-ts-alias.mjs")).href)

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

const load = (file) => import(pathToFileURL(path.join(root, file)).href)

const LEAD = { businessName: "Zephyr Quill", website: "https://www.zephyrquill.test" }
const GOOGLE_MATCH = {
  id: "ChIJ_match_zephyr",
  displayName: { text: "Zephyr Quill Plumbing & Drain LLC" },
  rating: 4.7,
  userRatingCount: 1379,
  formattedAddress: "742 Evergreen Terrace, Springfield, OR 97477",
  googleMapsUri: "https://maps.google.com/?cid=424242",
  websiteUri: "https://zephyrquill.test/contact",
  nationalPhoneNumber: "(541) 555-0199",
}
const GOOGLE_DECOYS = [
  {
    id: "ChIJ_decoy_substring",
    displayName: { text: "Evil Zephyr Quill Knockoff" },
    rating: 3.2,
    userRatingCount: 8642,
    formattedAddress: "9 Decoy Road, Faketown",
    websiteUri: "https://evilzephyrquill.test",
  },
  {
    id: "ChIJ_decoy_facebook",
    displayName: { text: "Quill Facebook Page Diner" },
    rating: 4.1,
    userRatingCount: 5310,
    formattedAddress: "1 Shared Host Way",
    websiteUri: "https://facebook.com/zephyrquill",
  },
]
const GOOGLE_VALUE_PATTERNS = [
  /Plumbing & Drain LLC/i,
  /Evergreen Terrace/i,
  /Springfield/i,
  /97477/,
  /\b4\.7\b/,
  /\b1379\b/,
  /cid=424242/,
  /maps\.google\.com/i,
  /555-0199/,
  /Knockoff/i,
  /Faketown/i,
  /\b8642\b/,
  /\b5310\b/,
  /Facebook Page Diner/i,
  /ChIJ_decoy/,
  /★/,
]
const FORBIDDEN_KEYS = ["rating", "reviewCount", "mapsUrl", "hasHours", "formattedAddress", "userRatingCount", "googleMapsUri", "displayName"]
const PROXY_PATTERNS = [/places listing/i, /google (?:maps |business )?(?:listing|profile|rating|reviews?)/i, /\brating\b/i, /review count/i, /\breviews?:/i]

const HOME_HTML = `<!doctype html><html><head><title>Zephyr Quill | Home repairs</title>
<meta name="description" content="Home repairs in Oregon."><meta name="viewport" content="width=device-width"></head>
<body><nav><a href="/">Home</a><a href="/services">Services</a></nav>
<h1>Fast home repairs</h1><p>Licensed and insured. Call (541) 555-0100.</p>
<form><input name="email"></form><a href="/book">Book a call</a></body></html>`

const MODEL_REPLY = JSON.stringify({
  headline: "Your homepage states the offer clearly.",
  whatCustomersSee: "A visitor can see what you do and how to call.",
  working: ["Clear headline"],
  opportunities: ["Add proof near the call button"],
  chapters: [
    { items: [{ label: "Headline", value: "Clear", note: "" }], summary: "Clear first impression." },
    { items: [{ label: "Proof", value: "Licensed", note: "" }], summary: "Some proof." },
    { items: [{ label: "Sitemap", value: "Not found in sources checked", note: "" }], summary: "Basics missing." },
    { items: [{ label: "Next step", value: "Book a call", note: "" }], summary: "One next step." },
  ],
  recommendationCopy: [],
  moves: [],
})

const calls = { places: [], model: [] }
let placesPayload = { places: [] }

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url)
  if (url.hostname === "places.googleapis.com") {
    calls.places.push({ headers: init.headers || {}, body: init.body })
    return new Response(JSON.stringify(placesPayload), { status: 200, headers: { "content-type": "application/json" } })
  }
  if (url.hostname === "api.openai.com") {
    calls.model.push(JSON.parse(init.body))
    return new Response(JSON.stringify({ choices: [{ message: { content: MODEL_REPLY } }] }), { status: 200 })
  }
  if (url.hostname.endsWith("zephyrquill.test") && (url.pathname === "/" || url.pathname === "")) {
    return new Response(HOME_HTML, { status: 200, headers: { "content-type": "text/html" } })
  }
  return new Response("not found", { status: 404 })
}

process.env.OPENAI_API_KEY = "stub-openai"
delete process.env.ANTHROPIC_API_KEY
delete process.env.REPORT_MODEL

const { collectDiagnostic } = await load("lib/report/diagnostic.ts")
const { writeReportFromDiagnostic, buildReportJson, reportToText } = await load("lib/report/write.ts")
const { renderReportHtml } = await load("lib/report/render/html-report.ts")
const { renderReportPdf } = await load("lib/report/pdf.ts")
const { hostsMatch } = await load("lib/report/collect/locations.ts")

async function run({ placesKey, payload }) {
  if (placesKey) process.env.GOOGLE_PLACES_API_KEY = "stub-places"
  else delete process.env.GOOGLE_PLACES_API_KEY
  placesPayload = payload
  calls.places = []
  calls.model = []
  const diagnostic = await collectDiagnostic(LEAD.businessName, LEAD.website)
  const report = await writeReportFromDiagnostic(diagnostic)
  const reportJson = buildReportJson(report)
  const text = reportToText(report)
  const html = renderReportHtml(report)
  const pdf = await renderReportPdf(report)
  const modelMessages = calls.model.map((body) => body.messages)
  return { diagnostic, report, reportJson, text, html, pdf, placesCalls: calls.places, modelMessages }
}

function withoutTimestamps(value) {
  return value.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g, "<ts>")
}

function collectKeys(value, keys = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => collectKeys(item, keys))
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      keys.add(key)
      collectKeys(child, keys)
    }
  }
  return keys
}

function assertNoGoogleValues(label, value) {
  const clean = withoutTimestamps(value)
  for (const pattern of GOOGLE_VALUE_PATTERNS) assert(!pattern.test(clean), `${label} contains Google value ${pattern}`)
}

function assertPersistedClean(label, result) {
  const json = JSON.stringify(result.reportJson)
  assertNoGoogleValues(`${label} report_json`, json)
  assertNoGoogleValues(`${label} report_text`, result.text)
  assertNoGoogleValues(`${label} html`, result.html)
  const keys = collectKeys(result.reportJson)
  for (const key of FORBIDDEN_KEYS) assert(!keys.has(key), `${label} report_json has key "${key}"`)
  assert(!result.diagnostic.facts.some((f) => f.provenance.sourceType === "places"), `${label} persists a places fact`)
  assert(!result.reportJson.recommendations.some((r) => r.id === "no_places" || r.id === "few_reviews"), `${label} keeps a Places finding`)
}

function assertPromptClean(label, result) {
  assert(result.modelMessages.length === 1, `${label} should call the model once`)
  const all = JSON.stringify(result.modelMessages)
  assertNoGoogleValues(`${label} model prompt`, all)
  assert(!/ChIJ_/.test(all), `${label} model prompt contains a place ID`)
  const user = result.modelMessages[0].filter((m) => m.role === "user").map((m) => m.content).join("\n")
  for (const pattern of PROXY_PATTERNS) assert(!pattern.test(user), `${label} model prompt has proxy wording ${pattern}`)
}

// Host matching: exact host, subdomains, no substring or shared-host confirmation.
assert(hostsMatch("zephyrquill.test", "zephyrquill.test"), "exact host matches")
assert(hostsMatch("zephyrquill.test", "book.zephyrquill.test"), "listing subdomain matches")
assert(!hostsMatch("zephyrquill.test", "evilzephyrquill.test"), "substring host must not match")
assert(!hostsMatch("facebook.com", "facebook.com"), "shared host must not confirm")
assert(!hostsMatch(null, "zephyrquill.test"), "missing lead host must not match")

// 1. Domain-confirmed match: only the place ID is persisted.
const confirmed = await run({ placesKey: true, payload: { places: [...GOOGLE_DECOYS, GOOGLE_MATCH] } })
assert(confirmed.placesCalls.length === 1, "confirmed run calls Places once")
const mask = confirmed.placesCalls[0].headers["X-Goog-FieldMask"]
assert(mask.split(",").includes("places.id"), "field mask includes places.id")
for (const dropped of ["displayName", "regularOpeningHours", "googleMapsUri", "nationalPhoneNumber", "types", "currentOpeningHours"]) {
  assert(!mask.includes(dropped), `field mask drops ${dropped}`)
}
assert(
  JSON.stringify(confirmed.reportJson.diagnostic.location) ===
    JSON.stringify({ checked: true, placeId: "ChIJ_match_zephyr", note: confirmed.diagnostic.location.note }),
  "confirmed location stores place ID, checked, and a static note only",
)
assert(confirmed.reportJson.version === 3, "report_json version is 3")
assertPersistedClean("confirmed", confirmed)
assertPromptClean("confirmed", confirmed)
assert(confirmed.pdf.length > 1000, "PDF still renders")

// 2. No domain match: unconfirmed, nothing from Google attached or stored.
const unconfirmed = await run({ placesKey: true, payload: { places: GOOGLE_DECOYS } })
assert(unconfirmed.placesCalls.length === 1, "unconfirmed run calls Places once")
assert(unconfirmed.reportJson.diagnostic.location.checked === true, "unconfirmed is marked checked")
assert(unconfirmed.reportJson.diagnostic.location.placeId === null, "unconfirmed stores no place ID")
assert(!JSON.stringify(unconfirmed.reportJson).includes("ChIJ"), "unconfirmed report_json has no place ID anywhere")
assertPersistedClean("unconfirmed", unconfirmed)
assertPromptClean("unconfirmed", unconfirmed)

// 3. No Places key: report works without Google.
const noPlaces = await run({ placesKey: false, payload: { places: [GOOGLE_MATCH] } })
assert(noPlaces.placesCalls.length === 0, "no key means no Places call")
assert(noPlaces.reportJson.diagnostic.location.checked === false, "no key means not checked")
assertPersistedClean("no-key", noPlaces)
assertPromptClean("no-key", noPlaces)

// 4. Non-Google report behavior is intact.
const factor = (result, id) => result.reportJson.scoreFactors.find((f) => f.id === id)
for (const id of ["digital_experience", "conversion", "technical"]) {
  assert(factor(confirmed, id).score === factor(noPlaces, id).score, `${id} score is unaffected by Places`)
}
assert(
  JSON.stringify(unconfirmed.reportJson.scoreFactors) === JSON.stringify(noPlaces.reportJson.scoreFactors),
  "an unconfirmed listing has no effect on scores",
)
assert(
  JSON.stringify(unconfirmed.diagnostic.facts.map((f) => f.key)) === JSON.stringify(noPlaces.diagnostic.facts.map((f) => f.key)),
  "facts are identical with or without an unconfirmed lookup",
)
assert(factor(confirmed, "discoverability").score === factor(noPlaces, "discoverability").score + 15, "confirmed listing still adds to discoverability in memory")
assert(factor(confirmed, "trust").score > factor(noPlaces, "trust").score, "confirmed listing still adds to trust in memory")
assert(
  JSON.stringify(factor(confirmed, "trust").evidence) === JSON.stringify(factor(noPlaces, "trust").evidence),
  "trust evidence text does not change with Google values",
)
assert(noPlaces.text.includes("Digital Presence Score"), "report text still renders")
assert(noPlaces.reportJson.evidenceAppendix.length > 0, "evidence appendix still built")
assert(noPlaces.report.chapters.length === 4, "chapters still built")
assert(noPlaces.reportJson.recommendations.length > 0, "recommendations still built")

console.log("verify-report-places: ok")
