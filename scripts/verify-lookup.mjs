/**
 * Free business lookup (POST /api/lookup, lib/lookup/*): an anonymous request chooses the URL our server fetches,
 * so the guard, the honesty of its findings and its analytics are checked here.
 * Stubs fetch with public IP literals, so nothing resolves DNS or calls a website, Google or Supabase.
 * Run: node scripts/verify-lookup.mjs
 */

import fs from "node:fs"
import path from "node:path"
import { register } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
register(pathToFileURL(path.join(root, "scripts/resolve-ts-alias.mjs")).href)

let checks = 0
function assert(cond, msg) {
  checks++
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

const load = (file) => import(pathToFileURL(path.join(root, file)).href)
const { assertPublicUrl, isPrivateAddress } = await load("lib/report/collect/public-url.ts")
const { fetchText } = await load("lib/report/collect/fetch.ts")
const { normalizeLookupWebsite, runLookup } = await load("lib/lookup/run.ts")
const taxonomy = await load("lib/funnel-taxonomy.ts")

// 1. Address guard.
for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:10.0.0.1"]) {
  assert(isPrivateAddress(ip), `${ip} is private`)
}
for (const ip of ["93.184.216.34", "8.8.8.8", "2606:4700::1111", "192.0.78.12", "192.0.78.13"]) assert(!isPrivateAddress(ip), `${ip} is public`)
// WordPress.com sites (192.0.78.x) are public; only 192.0.0.0/24 and the TEST-NETs are reserved.
for (const ip of ["192.0.0.8", "192.0.2.1", "198.51.100.7", "203.0.113.9"]) assert(isPrivateAddress(ip), `${ip} is reserved`)

const blocked = [
  "http://127.0.0.1/",
  "http://169.254.169.254/latest/meta-data/",
  "http://[::1]/",
  "http://10.0.0.5/",
  "ftp://93.184.216.34/",
  "http://user:pw@93.184.216.34/",
  "http://93.184.216.34:8080/",
  "http://localhost/",
  "http://printer.local/",
  "file:///etc/passwd",
]
for (const url of blocked) {
  let threw = false
  try {
    await assertPublicUrl(url)
  } catch {
    threw = true
  }
  assert(threw, `${url} is blocked`)
}
assert((await assertPublicUrl("http://93.184.216.34/")).hostname === "93.184.216.34", "public IP literal allowed")

// 2. Redirects are re-checked on every hop; a redirect to a private address is never fetched.
const requested = []
globalThis.fetch = async (url) => {
  requested.push(String(url))
  return new Response("", { status: 302, headers: { location: "http://169.254.169.254/latest/meta-data/" } })
}
assert((await fetchText("http://93.184.216.34/")) === null, "redirect to metadata address returns null")
assert(!requested.some((u) => u.includes("169.254")), "private redirect target never requested")

// 3. Input normalization.
const ok = { "blueprintswithbob.com": "https://blueprintswithbob.com/", "https://www.example.com/pricing?x=1": "https://www.example.com/", "Example.COM": "https://example.com/", "https://adamrafamoreno.wixsite.com/buynest/about?x=1": "https://adamrafamoreno.wixsite.com/buynest", "sites.google.com/view/acme-roofing/home": "https://sites.google.com/view/acme-roofing", "name.github.io/site": "https://name.github.io/site", "name.wixsite.com": "https://name.wixsite.com/" }
for (const [raw, want] of Object.entries(ok)) assert(normalizeLookupWebsite(raw) === want, `normalize ${raw}`)
for (const raw of ["", "not a site", "localhost", "http://", "a b.com", 42, null, "x".repeat(300)]) {
  assert(normalizeLookupWebsite(raw) === null, `reject ${String(raw).slice(0, 20)}`)
}

// 3b. "Fix this" (2026-10-13): each mapped gap is a real finding id, maps to a fixable report action, and the
// browser's value is never trusted.
{
  const fs = await import("node:fs")
  const { FIX_FOR_FINDING, parseStartFix } = await load("lib/report/start-fix.ts")
  const runSrc = fs.readFileSync(path.join(root, "lib/lookup/run.ts"), "utf8")
  const recSrc = fs.readFileSync(path.join(root, "lib/report/recommend.ts"), "utf8")
  const fixable = new Set([...(recSrc.match(/const FIXABLE = new Set\(\[([^\]]+)\]\)/)?.[1] ?? "").matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]))
  for (const [findingId, fix] of Object.entries(FIX_FOR_FINDING)) {
    const [source, id] = findingId.split(".")
    assert(new RegExp(`finding\\(\\s*"${source}",\\s*"${id}"`).test(runSrc), `Fix this: ${findingId} is a finding the check makes`)
    assert(fixable.has(fix), `Fix this: ${fix} is fixable in the report`)
  }
  assert(parseStartFix("missing_meta") === "missing_meta" && parseStartFix("placeholder_page") === null && parseStartFix({}) === null && parseStartFix("__proto__") === null, "Fix this: only known fixes are accepted")
  const ui = fs.readFileSync(path.join(root, "components/business-lookup.tsx"), "utf8")
  assert(ui.indexOf("{next}</div>") > -1 && ui.indexOf("{next}</div>") < ui.indexOf("LOOKUP_SOURCES.map"), "the next step sits above the findings")
  const pipe = fs.readFileSync(path.join(root, "lib/report/pipeline.ts"), "utf8")
  assert(/r\.id === request\.startFix && r\.fixable/.test(pipe), "the start fix is kept only when the report lists it as fixable")
}

// 4. A stubbed lookup: findings are observed facts; the first look is the booking gap; Places stays out.
const HOME = `<html><head><title>Example Remodeling | Kitchens</title><meta name="viewport" content="width=device-width">
<script src="https://connect.facebook.net/en_US/fbevents.js"></script></head>
<body><h1>Kitchen remodels, done right</h1><a href="/contact">Get a quote</a><a href="tel:+12135550142">(213) 555-0142</a></body></html>`
globalThis.fetch = async (url) => {
  const u = String(url)
  if (u.endsWith("/robots.txt") || u.endsWith("/sitemap.xml")) return new Response("not found", { status: 404 })
  if (u === "http://93.184.216.34/") return new Response(HOME, { status: 200 })
  return new Response("<html><body><p>Contact page</p></body></html>", { status: 200 })
}
delete process.env.GOOGLE_PLACES_API_KEY
const events = []
await runLookup("http://93.184.216.34/", "a".repeat(32), (e) => events.push(e), Date.now() + 30_000)
const types = events.map((e) => e.type)
assert(types[0] === "start" && types.at(-1) === "done", `start…done order (${types.join(",")})`)
const sources = Object.fromEntries(events.filter((e) => e.type === "source").map((e) => [e.source, e]))
for (const id of ["website", "contact", "measurement", "search_basics", "social", "google_maps"]) assert(sources[id], `source ${id} reported`)
assert(sources.google_maps.status === "unavailable", "Google Maps unconfigured is 'unavailable', not a gap")
const ids = events.filter((e) => e.type === "source").flatMap((e) => e.findings.map((f) => f.id))
// A remodeler that asks for quotes is not told to book online (owner decision 2026-10-12, lib/report/collect/next-step.ts).
assert(ids.includes("contact.quote") && ids.includes("contact.phone") && !ids.includes("contact.no_booking"), "quote business: quote path, no booking gap")
assert(ids.includes("measurement.meta") && !ids.includes("measurement.none"), "Meta Pixel detected, not 'none'")
assert(ids.includes("search_basics.no_sitemap"), "missing sitemap reported")
assert(events.at(-1).firstLook?.id === "contact.no_message", `first look is the missing form or email (${events.at(-1).firstLook?.id})`)

// 4b. An appointment-style business (no quote, store or order path) still leads with the booking gap.
const SALON = `<html><head><title>Example Hair Studio</title><meta name="viewport" content="width=device-width">
<script src="https://connect.facebook.net/en_US/fbevents.js"></script></head>
<body><h1>Cuts and color in Silver Lake</h1><a href="tel:+12135550142">Call us</a><a href="mailto:hi@example.com">Email</a></body></html>`
globalThis.fetch = async (url) => {
  const u = String(url)
  if (u.endsWith("/robots.txt") || u.endsWith("/sitemap.xml")) return new Response("not found", { status: 404 })
  if (u === "http://93.184.216.34/") return new Response(SALON, { status: 200 })
  return new Response("<html><body><p>Page</p></body></html>", { status: 200 })
}
const salonEvents = []
await runLookup("http://93.184.216.34/", "b".repeat(32), (e) => salonEvents.push(e), Date.now() + 30_000)
assert(salonEvents.at(-1).firstLook?.id === "contact.no_booking", `appointment business: first look is the booking gap (${salonEvents.at(-1).firstLook?.id})`)
assert(events.every((e) => !e.findings || e.findings.every((f) => f.text && f.evidence)), "every finding names its evidence")
assert(!JSON.stringify(events).match(/rating|review count|\d+(\.\d)? stars?/i), "no ratings or review counts in events")

// 5. Places values never reach the lookup (types.ts PlacesLookup rule).
const runSource = fs.readFileSync(path.join(root, "lib/lookup/run.ts"), "utf8")
assert(!/\.rating\b|\.reviewCount\b/.test(runSource), "run.ts never reads Places rating or reviewCount")

// 6. Analytics: lookup events carry ids and outcomes only; never the domain.
const safe = taxonomy.sanitizeFunnelParams("lookup_result", {
  cta_id: "marketing_hero_report",
  outcome: "complete",
  lookup_id: "0123456789abcdef0123456789abcdef",
  website: "blueprintswithbob.com",
  domain: "blueprintswithbob.com",
})
assert(safe && safe.lookup_id && safe.outcome === "complete" && !("website" in safe) && !("domain" in safe), "lookup_result keeps ids, drops the domain")
assert(!taxonomy.sanitizeFunnelParams("lookup_result", { lookup_id: "blueprintswithbob.com" }).lookup_id, "a domain is not a lookup_id")
assert(taxonomy.REPORT_ENTRIES.includes("popup_lookup"), "popup_lookup report entry exists")
for (const id of ["marketing_lookup_report", "marketing_lookup_book"]) assert(taxonomy.isCtaId(id), `${id} approved`)

// 7. The endpoint: bad input is a 400, the seventh lookup from one IP in the window is a 429.
const { POST } = await load("app/api/lookup/route.ts")
const req = (website, ip = "203.0.113.9") =>
  new Request("http://localhost/api/lookup", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify({ website }) })
assert((await POST(req("not a website"))).status === 400, "invalid website → 400")
const statuses = []
for (let i = 0; i < 7; i++) statuses.push((await POST(req(`site${i}.invalid-tld-for-test.com`, "198.51.100.7"))).status)
assert(statuses.slice(0, 6).every((s) => s === 200) && statuses[6] === 429, `rate limit after 6 (${statuses.join(",")})`)

// 8. Detection regressions (2026-10-08): booking, calls to action, prices and contact are judged by general rules,
//    never by site-specific exceptions. Every stub uses public IP literals; anything else requested is recorded.
const { collectSiteExperience } = await load("lib/report/collect/site-experience.ts")
const ORIGIN = "http://93.184.216.34"
async function crawl(routes) {
  const hits = []
  globalThis.fetch = async (url) => {
    const u = String(url)
    hits.push(u)
    const route = routes[u.replace(/\/$/, "") || u] ?? routes[u]
    if (typeof route === "function") return route()
    if (typeof route === "string") return new Response(route, { status: 200 })
    return new Response("not found", { status: 404 })
  }
  const site = await collectSiteExperience(`${ORIGIN}/`, { maxExtraPages: 2 })
  return { site, hits }
}
const page = (body) => `<html><head><title>Example</title></head><body>${body}</body></html>`
const BOOKING_FLOW = page(`<h2>Pick a time</h2><p>Times show in your time zone.</p><button type="button">Tue 10:00</button>`)

// A. Homepage links to a same-site /book page with a real booking flow → found, through that page.
{
  const { site } = await crawl({ [ORIGIN]: page(`<a href="/book">How we work</a>`), [`${ORIGIN}/book`]: BOOKING_FLOW })
  assert(site.booking.status === "found" && site.booking.via === "same_site", "A: same-site booking flow found")
  assert(site.booking.url === `${ORIGIN}/book`, "A: booking confirmed on /book")
  assert(site.pages[0].hasBookingLink, "A: homepage counts as offering booking")
}
// A2. The booking link isn't among the pages read (it's past the two linked pages) → one extra request confirms it.
{
  const { site, hits } = await crawl({
    [ORIGIN]: page(`<a href="/about">About</a><a href="/services">Services</a><a href="/schedule">Schedule a visit</a>`),
    [`${ORIGIN}/about`]: page("<p>About us</p>"),
    [`${ORIGIN}/services`]: page("<p>Services</p>"),
    [`${ORIGIN}/schedule`]: page(`<label>Date <input type="date" name="day"></label><button>Request</button>`),
  })
  assert(site.booking.status === "found" && site.booking.url === `${ORIGIN}/schedule`, "A2: unread booking page followed")
  assert(hits.filter((u) => u.includes("/schedule")).length === 1, "A2: exactly one extra request")
}
// B. "Book" in ordinary text, with no booking link, control or tool → not booking.
{
  const { site } = await crawl({
    [ORIGIN]: page(`<article><p>We book out weeks ahead, so plan early. Our schedule fills in spring. Book online soon.</p></article>`),
  })
  assert(site.booking.status === "none", `B: ordinary text isn't booking (${site.booking.status})`)
}
// B2. A same-site /book page without any way to choose a time → not counted as found.
{
  const { site } = await crawl({ [ORIGIN]: page(`<a href="/book">Our book</a>`), [`${ORIGIN}/book`]: page("<p>Our new cookbook is out.</p>") })
  assert(site.booking.status === "unconfirmed", `B2: booking page with no booking step is unconfirmed (${site.booking.status})`)
}
// C. Homepage links to a third-party scheduler → found, without fetching the third party.
{
  const { site, hits } = await crawl({ [ORIGIN]: page(`<a href="https://calendly.com/example/30min">Talk to us</a>`) })
  assert(site.booking.status === "found" && site.booking.via === "scheduler", "C: scheduler link found")
  assert(!hits.some((u) => u.includes("calendly")), "C: the scheduler isn't fetched")
}
// C2. Lookalike addresses aren't schedulers (an icon CDN, a host that merely contains the name).
{
  const { site } = await crawl({
    [ORIGIN]: page(`<img src="https://cdn.simpleicons.org/calendly"><a href="https://notcalendly.com.example.net/x">x</a>`),
  })
  assert(site.booking.status === "none", "C2: lookalike scheduler addresses aren't booking")
}
// D. The booking link is broken → unreachable, never "found".
{
  const { site } = await crawl({
    [ORIGIN]: page(`<a href="/about">About</a><a href="/services">Services</a><a href="/book">Book a call</a>`),
    [`${ORIGIN}/about`]: page("<p>About</p>"),
    [`${ORIGIN}/services`]: page("<p>Services</p>"),
    [`${ORIGIN}/book`]: () => new Response("gone", { status: 500 }),
  })
  assert(site.booking.status === "unreachable", `D: broken booking link is unreachable (${site.booking.status})`)
}
// E. A same-site booking page that redirects: valid only after every hop passes the guard.
{
  const { site, hits } = await crawl({
    [ORIGIN]: page(`<a href="/about">About</a><a href="/services">Services</a><a href="/book">Book</a>`),
    [`${ORIGIN}/about`]: page("<p>About</p>"),
    [`${ORIGIN}/services`]: page("<p>Services</p>"),
    [`${ORIGIN}/book`]: () => new Response("", { status: 301, headers: { location: "/booking/start" } }),
    [`${ORIGIN}/booking/start`]: BOOKING_FLOW,
  })
  assert(site.booking.status === "found" && site.booking.url === `${ORIGIN}/booking/start`, "E: safe same-site redirect confirmed")
  assert(hits.includes(`${ORIGIN}/booking/start`), "E: redirect target fetched after its own check")
}
{
  const { site, hits } = await crawl({
    [ORIGIN]: page(`<a href="/about">About</a><a href="/services">Services</a><a href="/book">Book</a>`),
    [`${ORIGIN}/about`]: page("<p>About</p>"),
    [`${ORIGIN}/services`]: page("<p>Services</p>"),
    [`${ORIGIN}/book`]: () => new Response("", { status: 302, headers: { location: "http://169.254.169.254/latest/" } }),
  })
  assert(site.booking.status === "unreachable", `E: redirect to a private address isn't booking (${site.booking.status})`)
  assert(!hits.some((u) => u.includes("169.254")), "E: private redirect target never requested")
}
// F. Booking links to private or other-origin targets are never followed.
{
  const { site, hits } = await crawl({
    [ORIGIN]: page(`<a href="http://10.0.0.5/book">Book now</a><a href="http://127.0.0.1/schedule">Schedule</a>`),
  })
  assert(!hits.some((u) => /10\.0\.0\.5|127\.0\.0\.1/.test(u)), "F: private booking targets never requested")
  assert(site.booking.status !== "found", "F: private booking targets aren't booking")
}

// Calls to action: tabs, accordions, toggles and button groups aren't requests; the action has to lead the label.
{
  const { site } = await crawl({
    [ORIGIN]: page(`
      <div role="tablist"><button role="tab" aria-selected="true">Fill the appointment book</button><button role="tab" aria-selected="false">Answer every call and message</button></div>
      <button aria-expanded="false">How do we start?</button>
      <div><button type="button">Home</button><button type="button">Product</button><button type="button">Checkout</button><button type="button">Buy</button></div>
      <p>Reach people ready to buy</p><a href="/x">Reach people ready to buy</a>
      <a href="/contact">Get a free quote</a><button type="button">Let's talk</button><button type="button" aria-haspopup="dialog" aria-expanded="false">Book a consultation</button>`),
  })
  const ctas = site.pages[0].ctaTexts
  for (const not of ["Fill the appointment book", "Answer every call and message", "How do we start?", "Buy", "Reach people ready to buy"]) {
    assert(!ctas.includes(not), `CTA: "${not}" is not a call to action`)
  }
  for (const yes of ["Get a free quote", "Let's talk", "Book a consultation"]) assert(ctas.includes(yes), `CTA: "${yes}" is a call to action`)
}

// Prices: amounts offered as prices count; stats, savings and sample dashboards don't. Thousands parse whole.
{
  const { site } = await crawl({
    [ORIGIN]: page(`<p>CPC $1.14</p><p>Ads $ 2,180</p><p>A new $2,400 website lead</p><p>We saved owners $10,000</p>`),
  })
  assert(site.prices.length === 0, `prices: stats and samples aren't prices (${site.prices.join(",")})`)
}
{
  const { site } = await crawl({ [ORIGIN]: page(`<p>Haircuts from $45</p><p>Coaching $1,200/month</p><p>Classes $30 per class</p>`) })
  assert(["$45", "$1,200", "$30"].every((p) => site.prices.includes(p)), `prices: offered prices found (${site.prices.join(",")})`)
}
{
  const { site } = await crawl({ [ORIGIN]: `<html><head><script type="application/ld+json">{"@type":"Product","offers":{"price":"129.00","priceCurrency":"USD"}}</script></head><body><p>Sculpt bodysuit $129</p></body></html>` })
  assert(site.prices.length > 0, "prices: product offer markup counts")
}

// Contact: a mailto link is a way to get in touch, so the "no phone or form" gap doesn't fire.
{
  const events = []
  globalThis.fetch = async (url) => {
    const u = String(url)
    if (u === `${ORIGIN}/`) return new Response(page(`<h1>Studio</h1><a href="mailto:hello@example.com">Email us</a>`), { status: 200 })
    return new Response("not found", { status: 404 })
  }
  await runLookup(`${ORIGIN}/`, "b".repeat(32), (e) => events.push(e), Date.now() + 30_000)
  const contact = events.find((e) => e.type === "source" && e.source === "contact")
  const ids = contact.findings.map((f) => f.id)
  assert(ids.includes("contact.email") && !ids.includes("contact.no_contact"), `contact: mailto counts (${ids.join(",")})`)
}

// The lookup reports a confirmed booking page as evidence, and an unreachable one as its own gap.
{
  const run = async (routes) => {
    const events = []
    globalThis.fetch = async (url) => {
      const route = routes[String(url).replace(/\/$/, "")]
      if (typeof route === "function") return route()
      return route ? new Response(route, { status: 200 }) : new Response("not found", { status: 404 })
    }
    await runLookup(`${ORIGIN}/`, "c".repeat(32), (e) => events.push(e), Date.now() + 30_000)
    return events
  }
  let events = await run({ [ORIGIN]: page(`<a href="/book">Book a call</a>`), [`${ORIGIN}/book`]: BOOKING_FLOW })
  let contact = events.find((e) => e.type === "source" && e.source === "contact").findings
  assert(contact[0].id === "contact.booking" && contact[0].evidence === "Booking page /book", "lookup: booking found on /book")
  assert(events.at(-1).firstLook?.id !== "contact.no_booking", "lookup: no false booking gap")
  // The done event carries the full report's Digital Presence Score: five 0-100 factors, numbers and labels only.
  const score = events.at(-1).score
  assert(score && score.factors.length === 5, `lookup: score has the report's five factors (${score?.factors.length})`)
  assert(
    score.factors.every((f) => f.score === null || (Number.isInteger(f.score) && f.score >= 0 && f.score <= 100)),
    "lookup: factor scores are 0-100",
  )
  assert(Number.isInteger(score.overall) && score.overall >= 0 && score.overall <= 100, `lookup: overall 0-100 (${score.overall})`)
  assert(score.mapsChecked === false && score.pagesRead >= 1, "lookup: no Places key means Maps not checked")
  assert(!JSON.stringify(score).includes("evidence"), "lookup: no factor evidence in the score")
  const contactIds = contact.map((f) => f.id)
  assert(
    contactIds.includes("contact.no_phone") && contactIds.includes("contact.no_message") && !contactIds.includes("contact.no_contact"),
    `lookup: each missing contact basic is named (${contactIds.join(",")})`,
  )
  events = await run({ [ORIGIN]: page(`<a href="/book">Book a call</a>`), [`${ORIGIN}/book`]: () => new Response("x", { status: 503 }) })
  contact = events.find((e) => e.type === "source" && e.source === "contact").findings
  assert(contact[0].id === "contact.booking_unreachable", `lookup: broken booking link reported (${contact[0].id})`)
  assert(events.at(-1).firstLook?.id === "contact.booking_unreachable", "lookup: broken booking link can be the first look")
}

// Social handles: "@name", "name" and profile URLs on the right host only; nothing else becomes a link.
{
  const { parseSocial, parseSocials } = await load("lib/lookup/socials.ts")
  assert(parseSocial("instagram", "@bwb_builds")?.url === "https://www.instagram.com/bwb_builds", "socials: @handle")
  assert(parseSocial("instagram", "https://instagram.com/bwb_builds/")?.handle === "bwb_builds", "socials: pasted URL")
  assert(parseSocial("tiktok", "tiktok.com/@bwb")?.url === "https://www.tiktok.com/@bwb", "socials: TikTok URL without scheme")
  assert(parseSocial("facebook", "https://evil.example/bwb") === null, "socials: other host refused")
  assert(parseSocial("instagram", "bad name") === null && parseSocial("instagram", "") === null, "socials: junk refused")
  assert(parseSocial("linkedin", "https://www.linkedin.com/company/terramore")?.handle === "terramore", "socials: LinkedIn company URL")
  const list = parseSocials([{ platform: "tiktok", handle: "a" }, { platform: "tiktok", handle: "b" }, { platform: "myspace", handle: "x" }])
  assert(list.length === 1 && list[0].handle === "a", "socials: one per platform, unknown platforms dropped")
}

// AEO reads: structured data types, AI crawlers blocked only by a whole-site disallow, FAQ.
{
  const { readAeo, blockedAiCrawlers } = await load("lib/lookup/aeo.ts")
  const html = `<script type="application/ld+json">{"@context":"https://schema.org","@type":["LocalBusiness","FAQPage"]}</script><h2>FAQ</h2>`
  const aeo = readAeo(html, "User-agent: *\nAllow: /")
  assert(aeo.structuredDataTypes.includes("LocalBusiness") && aeo.hasFaq && !aeo.blockedCrawlers.length, "aeo: types, FAQ, allowed")
  assert(blockedAiCrawlers("User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nDisallow:").join() === "GPTBot", "aeo: GPTBot blocked only")
  assert(blockedAiCrawlers("User-agent: *\nDisallow: /admin").length === 0, "aeo: a folder disallow doesn't block the site")
  assert(blockedAiCrawlers("User-agent: *\nDisallow: /").length === 5, "aeo: whole-site disallow blocks every AI crawler")
  assert(readAeo("<h1>Hi</h1>", null).robotsRead === false, "aeo: missing robots.txt isn't read as blocking")
}

// Added profiles re-score from the same inputs: counted as found, said to be added and not linked.
{
  const { socialAndScore, alternateWww } = await load("lib/lookup/run.ts")
  const home = { url: "https://a.test/", status: 200, title: "A", h1: ["A"], navLabels: [], ctaTexts: ["Call"], hasPhone: true, hasEmail: false, formCount: 0, hasBookingLink: false, trustSignals: [], excerpt: "" }
  const inputs = {
    pages: [home],
    technical: { https: true, title: "A", description: null, canonical: null, hasRobots: false, hasSitemap: false, viewport: true, status: 200, note: "" },
    directories: [{ platform: "instagram", url: "https://instagram.com/a", found: true, linkedFromSite: true, note: "" }],
    places: { checked: false, confirmed: false, placeId: null, rating: null, reviewCount: null, hasAddress: false },
    catalog: { kind: "unknown", available: false, productCount: null, sampleNames: [] },
    hasCheckout: false,
    where: "Homepage",
    pagesRead: 1,
  }
  const base = socialAndScore(inputs, [])
  const disc = (r) => r.score.factors.find((f) => f.id === "discoverability").score
  const more = socialAndScore(inputs, [
    { platform: "tiktok", handle: "a", url: "https://www.tiktok.com/@a" },
    { platform: "instagram", handle: "a", url: "https://www.instagram.com/a" },
  ])
  assert(disc(more) === disc(base) + 4, `socials: one new profile adds the report's 4 points (${disc(base)} -> ${disc(more)})`)
  assert(more.score.profilesAdded.join() === "tiktok" && more.score.profilesLinked.join() === "instagram", "socials: linked stays linked")
  assert(more.social.findings.some((f) => f.id === "social.added_tiktok" && f.tone === "gap"), "socials: added profile is a not-linked gap")
  assert(alternateWww("https://terramore.io/") === "https://www.terramore.io/", "www: bare domain gets www")
  assert(alternateWww("https://www.terramore.io/") === "https://terramore.io/", "www: www is dropped")
  assert(alternateWww("https://shop.terramore.io/") === null, "www: subdomains are left alone")
}

// Buttons drawn in the browser (2026-10-14, Buynest on Wix): no button in the HTML of a Wix page, or of a builder page
// that is mostly script with almost no links, is a note to check, never a "no clear next step" gap. Normal HTML keeps the gap.
{
  const { drawsButtonsInBrowser, htmlShape } = await load("lib/report/collect/site-experience.ts")
  const bundle = `<script>${"var a=1;".repeat(6000)}</script>`
  // Like the live Buynest page: Wix static assets, a big script payload, a few nav links, no "Shop Now" in the HTML.
  const WIX = `<html><head><title>Buynest | Home</title><link rel="preconnect" href="https://static.wixstatic.com">${bundle}</head><body><div id="SITE_CONTAINER"><a href="/">Home</a><a href="/about">About</a></div></body></html>`
  // An ordinary HTML site with real links and no call to action.
  const PLAIN = page(`<nav><a href="/about">About</a><a href="/services">Services</a><a href="/gallery">Gallery</a></nav><h1>Bay Area Tile</h1><p>Tile work since 1998.</p>`)
  // A Squarespace page with plenty of links is ordinary HTML: not excused.
  const SQUARESPACE_LINKS = page(`<link href="https://static1.squarespace.com/x.css">${Array.from({ length: 12 }, (_, i) => `<a href="/p${i}">Page ${i}</a>`).join("")}`)
  assert(drawsButtonsInBrowser(WIX, "Wix"), "browser-drawn: a Wix page")
  assert(!drawsButtonsInBrowser(PLAIN, null), "browser-drawn: a normal HTML page is not")
  assert(!drawsButtonsInBrowser(SQUARESPACE_LINKS, "Squarespace"), "browser-drawn: a link-rich Squarespace page is not")
  assert(drawsButtonsInBrowser(`<html><body><div id="root"></div>${bundle}</body></html>`, null), "browser-drawn: an app shell with no links")
  assert(htmlShape(WIX).scriptShare > 0.6, "browser-drawn: the Wix fixture is mostly script")

  const { site: wixSite } = await crawl({ [ORIGIN]: WIX })
  assert(wixSite.platform === "Wix" && wixSite.rendersInBrowser, "browser-drawn: Wix detected and flagged")
  assert(wixSite.pages[0].ctaUnconfirmed === true, "browser-drawn: homepage button unconfirmed")
  const { site: plainSite } = await crawl({ [ORIGIN]: PLAIN })
  assert(!plainSite.rendersInBrowser && !plainSite.pages[0].ctaUnconfirmed, "browser-drawn: plain HTML not flagged")
  // A Wix page whose button is in the HTML is read as usual and not marked unconfirmed.
  const { site: wixWithCta } = await crawl({ [ORIGIN]: WIX.replace("</div>", `<a href="/shop">Shop Now</a></div>`) })
  assert(wixWithCta.pages[0].ctaTexts.includes("Shop Now") && !wixWithCta.pages[0].ctaUnconfirmed, "browser-drawn: a found button is confirmed")

  const lookup = async (home) => {
    const events = []
    globalThis.fetch = async (url) =>
      String(url).replace(/\/$/, "") === ORIGIN ? new Response(home, { status: 200 }) : new Response("not found", { status: 404 })
    await runLookup(`${ORIGIN}/`, "d".repeat(32), (e) => events.push(e), Date.now() + 30_000)
    return events
  }
  const wixEvents = await lookup(WIX)
  const wixWebsite = wixEvents.find((e) => e.type === "source" && e.source === "website").findings
  const note = wixWebsite.find((f) => f.id === "website.cta_unconfirmed")
  assert(note && note.tone === "note", "lookup: Wix page with no button in its HTML gets a note")
  assert(/couldn't confirm a main button: Wix draws some buttons in the browser/.test(note.text), `lookup: note names Wix (${note?.text})`)
  assert(!wixWebsite.some((f) => f.id === "website.no_cta"), "lookup: no false 'no clear next step' gap on Wix")
  assert(wixEvents.at(-1).firstLook?.id !== "website.no_cta", "lookup: the first look isn't a false missing button")
  const plainEvents = await lookup(PLAIN)
  const plainWebsite = plainEvents.find((e) => e.type === "source" && e.source === "website").findings
  assert(plainWebsite.some((f) => f.id === "website.no_cta" && f.tone === "gap"), "lookup: plain HTML with no button keeps the gap")

  // Scores: an unconfirmed button isn't counted against Digital Experience or Conversion Readiness.
  const { scoreDigitalPresence } = await load("lib/report/score/digital-presence.ts")
  const base = { url: "https://a.test/", status: 200, title: "A", h1: ["A"], navLabels: ["Home", "Shop", "About"], ctaTexts: [], hasPhone: false, hasEmail: true, formCount: 0, hasBookingLink: false, trustSignals: [], excerpt: "" }
  const scoreWith = (home) =>
    scoreDigitalPresence({
      pages: [home],
      technical: { https: true, title: "A", description: null, canonical: null, hasRobots: true, hasSitemap: true, viewport: true, status: 200, note: "" },
      directories: [],
      places: { checked: false, confirmed: false, placeId: null, rating: null, reviewCount: null, hasAddress: false },
      catalog: { kind: "unknown", available: false, productCount: null, sampleNames: [] },
      hasCheckout: true,
    })
  const f = (r, id) => r.factors.find((x) => x.id === id)
  const missing = scoreWith(base)
  const unknown = scoreWith({ ...base, ctaUnconfirmed: true })
  for (const id of ["digital_experience", "conversion"]) {
    assert(f(unknown, id).score > f(missing, id).score, `score: unconfirmed button not counted against ${id} (${f(missing, id).score} -> ${f(unknown, id).score})`)
  }
  assert(unknown.overall > missing.overall, "score: overall not marked down for an unconfirmed button")
  assert(f(unknown, "digital_experience").subfactors.find((s) => s.id === "decision_friction").score === null, "score: decision friction left unscored")
}

console.log(`lookup: ok (${checks} checks)`)
