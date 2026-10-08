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
for (const ip of ["93.184.216.34", "8.8.8.8", "2606:4700::1111"]) assert(!isPrivateAddress(ip), `${ip} is public`)

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
const ok = { "blueprintswithbob.com": "https://blueprintswithbob.com/", "https://www.example.com/pricing?x=1": "https://www.example.com/", "Example.COM": "https://example.com/" }
for (const [raw, want] of Object.entries(ok)) assert(normalizeLookupWebsite(raw) === want, `normalize ${raw}`)
for (const raw of ["", "not a site", "localhost", "http://", "a b.com", 42, null, "x".repeat(300)]) {
  assert(normalizeLookupWebsite(raw) === null, `reject ${String(raw).slice(0, 20)}`)
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
assert(ids.includes("contact.no_booking") && ids.includes("contact.phone"), "contact findings observed")
assert(ids.includes("measurement.meta") && !ids.includes("measurement.none"), "Meta Pixel detected, not 'none'")
assert(ids.includes("search_basics.no_sitemap"), "missing sitemap reported")
assert(events.at(-1).firstLook?.id === "contact.no_booking", "first look is the booking gap")
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
  events = await run({ [ORIGIN]: page(`<a href="/book">Book a call</a>`), [`${ORIGIN}/book`]: () => new Response("x", { status: 503 }) })
  contact = events.find((e) => e.type === "source" && e.source === "contact").findings
  assert(contact[0].id === "contact.booking_unreachable", `lookup: broken booking link reported (${contact[0].id})`)
  assert(events.at(-1).firstLook?.id === "contact.booking_unreachable", "lookup: broken booking link can be the first look")
}

console.log(`lookup: ok (${checks} checks)`)
