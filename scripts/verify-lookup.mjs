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

console.log(`lookup: ok (${checks} checks)`)
