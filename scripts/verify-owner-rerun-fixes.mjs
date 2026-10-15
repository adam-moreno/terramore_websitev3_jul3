/**
 * Fixes from the 2026-10-15 three-owner rerun (Buynest on Wix, Aztec, Halcyon on WordPress.com). Pure checks, no network.
 * - Template social links (facebook.com/wix) and share buttons aren't the owner's profiles.
 * - The sitemap is looked for where the site publishes it: robots.txt, the site's folder, then the root.
 * - Fixes that need a paid plan on a free builder address aren't recommended.
 * - A returning owner (same email) gets a fresh report once a day.
 * - The report email's top fixes are in owner words.
 * Run: node scripts/verify-owner-rerun-fixes.mjs
 */

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

// --- Placeholder socials
const { isPlaceholderSocial, firstRealSocial } = await load("lib/report/collect/placeholder-social.ts")
for (const url of [
  "https://www.facebook.com/wix",
  "https://www.Instagram.com/wix",
  "https://www.twitter.com/wix",
  "https://twitter.com/wordpressdotcom",
  "https://www.facebook.com/sharer/sharer.php?u=x",
  "https://www.facebook.com/sharer.php",
  "https://twitter.com/intent/tweet",
  "https://www.instagram.com/explore",
  "https://www.facebook.com/",
  "https://www.linkedin.com/company/squarespace",
]) assert(isPlaceholderSocial(url), `placeholder: ${url}`)
for (const url of [
  "https://www.facebook.com/AztecPavingInc/",
  "https://www.instagram.com/aztec_paving_inc/",
  "https://www.linkedin.com/company/aztec-paving-inc/about/",
  "https://www.youtube.com/channel/UCIOWC2a1ARZXry40duyCAwg/videos",
  "https://www.yelp.com/biz/some-business",
  "https://maps.app.goo.gl/abc",
]) assert(!isPlaceholderSocial(url), `real profile: ${url}`)
const FB = /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?/i
assert(firstRealSocial('<a href="https://www.facebook.com/wix">f</a>', FB) === null, "Wix template footer only → no Facebook")
assert(
  firstRealSocial('<a href="https://www.facebook.com/wix"></a><a href="https://www.facebook.com/BuynestShop">', FB) === "https://www.facebook.com/BuynestShop",
  "skips the template link and finds the real one after it",
)

const { collectDirectories } = await load("lib/report/collect/directories.ts")
const dirs = collectDirectories([{ url: "https://x.wixsite.com/buynest", html: '<a href="https://www.facebook.com/wix"></a><a href="https://www.Instagram.com/wix"></a>' }])
assert(!dirs.find((d) => d.platform === "facebook").found, "directories: facebook.com/wix not found as a profile")
assert(!dirs.find((d) => d.platform === "instagram").found, "directories: instagram.com/wix not found as a profile")

// --- Sitemap location
const { sitemapCandidates, hasSitemapAt } = await load("lib/report/collect/sitemap.ts")
const wix = sitemapCandidates("https://adamrafamoreno.wixsite.com/buynest", "User-agent: *\nAllow: /")
assert(wix[0] === "https://adamrafamoreno.wixsite.com/buynest/sitemap.xml", "Wix free: the site folder first")
assert(wix.includes("https://adamrafamoreno.wixsite.com/sitemap.xml"), "root still tried")
const robots = sitemapCandidates("https://example.test/", "Sitemap: https://example.test/wp-sitemap.xml\nSitemap: https://evil.test/s.xml")
assert(robots[0] === "https://example.test/wp-sitemap.xml", "robots.txt Sitemap: line first")
assert(!robots.some((u) => u.includes("evil.test")), "other hosts from robots.txt ignored")
assert(!sitemapCandidates("https://example.test/index.html", null).some((u) => u.includes("index.html/")), "a file isn't a folder")
const fake = (ok) => async (url) => (url === ok ? { status: 200, text: '<?xml version="1.0"?><sitemapindex>' } : { status: 404, text: "not found" })
assert(await hasSitemapAt("https://adamrafamoreno.wixsite.com/buynest", null, fake("https://adamrafamoreno.wixsite.com/buynest/sitemap.xml")), "Buynest's folder sitemap counts")
assert(!(await hasSitemapAt("https://example.test/", null, fake("https://nowhere.test/sitemap.xml"))), "no sitemap anywhere → false")

// --- Paid-plan fixes on free builder addresses
const { buildRecommendations, freeHostPlan } = await load("lib/report/recommend.ts")
assert(freeHostPlan("https://halcyonridgepainting.wordpress.com/")?.builder === "WordPress.com", "WP.com free detected")
assert(freeHostPlan("https://adamrafamoreno.wixsite.com/buynest")?.builder === "Wix", "Wix free detected")
assert(freeHostPlan("https://aztecpaving.com/") === null, "own domain: no free plan")
const page = (url) => ({
  url, status: 200, title: "T", h1: ["Painting in Sacramento"], navLabels: ["Home", "Contact"], ctaTexts: ["Get a quote"], ctaUnconfirmed: false,
  formCount: 1, hasPhone: true, hasEmail: true, hasBookingLink: false, trustSignals: ["review", "licensed", "insured"],
  excerpt: "House painting in Sacramento. Licensed and insured. Get a quote.",
})
const run = (url) =>
  buildRecommendations({
    pages: [page(url)],
    technical: { https: true, title: "T", description: null, canonical: null, hasRobots: true, hasSitemap: true, viewport: true, status: 200, note: "" },
    directories: [], catalog: { kind: "services", available: false, productCount: null }, hasCheckout: false, competitiveAvailable: false, pixels: [],
  })
let wp
try {
  wp = run("https://halcyonridgepainting.wordpress.com/")
} catch (e) {
  throw new Error(`buildRecommendations fixture needs updating: ${e.message}`)
}
assert(!wp.findings.some((f) => f.id === "missing_meta"), "WP.com free: no search-description fix")
const m = wp.findings.find((f) => f.id === "no_measurement")
assert(m && /Step 1: ask every new customer/i.test(m.action), "WP.com free: measurement keeps the free tally step")
assert(m && /paid WordPress\.com plan/.test(m.action) && m.fixable === false, "WP.com free: analytics marked paid, not Fix it for me")
const own = run("https://halcyonridgepainting.com/")
assert(own.findings.some((f) => f.id === "missing_meta"), "own domain: search-description fix stays")
assert(own.findings.find((f) => f.id === "no_measurement")?.fixable === true, "own domain: analytics is Fix it for me")

// --- Returning owner refresh
const { refreshDecision } = await load("lib/report/refresh.ts")
const now = Date.parse("2026-10-15T12:00:00Z")
const ago = (h) => new Date(now - h * 3600e3).toISOString()
assert(refreshDecision({ report_status: "sent", report_sent_at: ago(30), signup_date: ago(40) }, now) === "refresh", "sent 30h ago → fresh report")
assert(refreshDecision({ report_status: "sent", report_sent_at: ago(3), signup_date: ago(4) }, now) === "too_soon", "sent 3h ago → too soon")
assert(refreshDecision({ report_status: "generating", report_sent_at: null, signup_date: ago(0.1) }, now) === "in_progress", "being written → in progress")
assert(refreshDecision({ report_status: "generating", report_sent_at: null, signup_date: ago(2) }, now) === "refresh", "stuck generating → can retry")
assert(refreshDecision({ report_status: "failed", report_sent_at: null, signup_date: ago(1) }, now) === "refresh", "failed → can retry")
assert(refreshDecision(null, now) === "refresh", "no row → refresh")

// --- Owner words in the report email
const { reportEmailSummary } = await load("lib/report/email-summary.ts")
const email = reportEmailSummary({
  businessName: "Aztec Paving",
  overallScore: 70,
  workspaceUrl: null,
  recommendations: [
    { id: "no_measurement", rank: 1, finding: "You can't see where your customers come from.", action: "Step 1: ask every new customer how they heard about you and keep a simple tally. Step 2: add Google Analytics." },
    { id: "missing_meta", rank: 2, finding: "A meta description was not found on the homepage.", action: "Add a concise meta description that states the offer and location or specialty." },
  ],
}).text.join("\n")
assert(/the two lines Google can show under your name/.test(email), "meta finding in owner words")
assert(!/meta description|offer and location or specialty/i.test(email), "no meta jargon left")
assert(/Ask every new customer/.test(email), "step starts with a capital")
const trust = reportEmailSummary({
  businessName: "Halcyon", overallScore: 58, workspaceUrl: null,
  recommendations: [{ id: "thin_trust", rank: 1, finding: "On-site trust signals were thin across pages checked.", action: "Add verifiable proof (reviews, named testimonials, credentials, or policies) near primary button." }],
}).text.join("\n")
assert(!/trust signals|primary button|verifiable proof/i.test(trust), "trust finding in owner words")
assert(/reviews/.test(trust), "trust step names reviews")

console.log(`owner-rerun fixes: ${checks} checks passed`)
