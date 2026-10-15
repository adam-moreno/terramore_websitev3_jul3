/**
 * Booking → free website check. Pure and source checks; no network, no database, no email.
 * - the report runs only for a usable website, never for a social page / Google listing / nothing
 * - never when the email already has a report sent or being written
 * - the booking response doesn't wait on the report (it runs inside after())
 * - the prep note and the confirmation page branch on whether a report is coming
 * Run: node scripts/verify-booking-report.mjs
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
const read = (file) => fs.readFileSync(path.join(root, file), "utf8")
const load = (file) => import(pathToFileURL(path.join(root, file)).href)

const rc = await load("lib/booking/report-check.ts")

// 1. Link classification. Websites with or without https; social and Google links never crash and aren't sites.
const sites = ["buynest.com", "https://www.buynest.com/", "http://joesplumbing.net/contact", "shop.example.co.uk", "mysite.wixsite.com/shop"]
for (const s of sites) {
  const link = rc.classifyBookingLink(s)
  assert(link.kind === "site" && /^https?:\/\//.test(link.website), `site: ${s}`)
}
const socials = [
  "facebook.com/joesplumbing",
  "https://www.facebook.com/profile.php?id=123",
  "m.facebook.com/joes",
  "instagram.com/buynest",
  "https://maps.app.goo.gl/AbC123",
  "https://www.google.com/maps/place/Joe's+Plumbing/@38.5,-121.4,15z",
  "https://g.page/joesplumbing",
  "https://share.google/xyz",
  "https://www.google.com/search?q=joes&kgmid=/g/11abc",
  "maps.google.com/?cid=123456",
  "yelp.com/biz/joes-plumbing",
  "tiktok.com/@buynest",
]
for (const s of socials) {
  let link
  try {
    link = rc.classifyBookingLink(s)
  } catch (error) {
    assert(false, `social link threw: ${s} (${error})`)
  }
  assert(link.kind === "social", `social, not a site: ${s} → ${link.kind}`)
  assert(!rc.shouldRunBookingReport(link, null), `no report for social: ${s}`)
}
for (const s of ["", "   ", null, undefined, 42, "not a url", "hello world.com", "localhost", "javascript:alert(1)", "x".repeat(400)]) {
  const link = rc.classifyBookingLink(s)
  assert(link.kind === "none", `nothing usable: ${JSON.stringify(s)?.slice(0, 30)} → ${link.kind}`)
  assert(!rc.shouldRunBookingReport(link, null), `no report without a link: ${JSON.stringify(s)?.slice(0, 30)}`)
}

// 2. Idempotent: never for an email with a report sent or underway.
const site = rc.classifyBookingLink("buynest.com")
assert(rc.shouldRunBookingReport(site, null), "site + no row runs")
assert(rc.shouldRunBookingReport(site, "failed"), "site + failed earlier runs again")
assert(rc.shouldRunBookingReport(site, "needs_keys"), "site + needs_keys runs")
assert(!rc.shouldRunBookingReport(site, "sent"), "site + sent does not run")
assert(!rc.shouldRunBookingReport(site, "generating"), "site + generating does not run")

// 3. Prep note copy branches.
assert(rc.prepReportState({ reportComing: true, hasReport: true }) === "coming", "coming wins")
assert(rc.prepReportState({ reportComing: false, hasReport: true }) === "has_report", "already has one")
assert(rc.prepReportState({ reportComing: false, hasReport: null }) === "none", "unknown → none")
assert(rc.prepReportState({ reportComing: false, hasReport: false }) === "none", "none")
assert(rc.prepReportLine("coming") === "Your free website check is on its way by email; we'll walk through it on the call.", "coming copy")
assert(rc.prepReportLine("none") === "Bring your website or social links to the call and we'll look at them together.", "bring links copy")
assert(!/bring your website/i.test(rc.prepReportLine("coming")), "no 'bring links' when the report is coming")
assert(!/on its way/i.test(rc.prepReportLine("none")), "no 'on its way' when nothing is coming")
for (const line of ["coming", "has_report", "none"].map(rc.prepReportLine)) {
  assert(!/\b(hurry|limited|only \d|act now|today only|spots? left)\b/i.test(line), `no fake urgency: ${line}`)
}

const notify = read("lib/notify.ts")
const prepFn = notify.slice(notify.indexOf("export async function sendBookingPrepEmail"), notify.indexOf("export async function sendBookingPrepEmail") + 4000)
assert(/prepReportLine\(prepReportState\(\{ reportComing: opts\.reportComing === true/.test(prepFn), "prep note uses the branching line")
assert(!/Get a free Digital Footprint report/.test(prepFn), "prep note no longer pushes the report form")

// 4. Route: classify, claim before responding, pipeline only inside after(), never awaited by the response.
const route = read("app/api/booking/route.ts")
assert(/export const maxDuration = 60/.test(route), "booking route has the report's time budget")
assert(/classifyBookingLink\(websiteRaw\)/.test(route), "route classifies the link")
const afterAt = route.indexOf("after(async () => {")
const pipelineAt = route.indexOf("runReportPipeline({")
const responseAt = route.indexOf("return NextResponse.json({\n    id: booking.id")
assert(afterAt > 0 && pipelineAt > afterAt && pipelineAt < responseAt, "runReportPipeline is called only inside after()")
assert(route.slice(0, afterAt).split("runReportPipeline(").length === 1, "pipeline is not called before after()")
assert(/if \(!reportComing \|\| link\.kind !== "site"\) return/.test(route), "pipeline guarded by the claim and a website")
assert(/const reportComing = claim\.run && link\.kind === "site"/.test(route), "reportComing needs a successful claim")
assert(/reportComing,\n  \}\)/.test(route), "response tells the page whether the check is running")
assert(/sendBookingPrepEmail\(notice, \{ hasReport, reportComing \}\)/.test(route), "prep note told about the report")
assert(/Link: \$\{link\.url\}/.test(route), "social link kept in the booking note")

// 5. Claim: one report per email, same lead row source as /api/report.
const claim = read("lib/booking/claim-report.ts")
assert(/reportAlreadyUnderway\(row\?\.report_status\)/.test(claim), "claim checks the existing status")
assert(/\.or\("report_status\.is\.null,report_status\.not\.in\.\(sent,generating\)"\)/.test(claim), "conditional update can't double-start")
assert(/signup_source: "digital_footprint_report"/.test(claim), "same signup_source as the report form")
assert(/report_status: "generating"/.test(claim), "new row is claimed as generating")
assert(/if \(!supabase \|\| link\.kind === "none"\) return \{ run: false/.test(claim), "no database or no link: no report")
assert(/link\.kind === "social"[\s\S]{0,400}return \{ run: false/.test(claim), "social link never runs the report")
assert(/socials: link\.url/.test(claim), "social link saved on the lead's socials")

// Pipeline BCCs Adam, so his copy is the call prep.
assert(/bcc: ADMIN_EMAIL/.test(read("lib/report/pipeline.ts")), "report email BCCs admin")

// 6. Form and confirmation page.
const form = read("components/booking-flow.tsx")
assert(form.includes("Website, Facebook or Google listing <span"), "field label renamed")
assert(form.includes('placeholder="yourbusiness.com or facebook.com/yourbusiness"'), "placeholder shows examples")
assert(/\(optional\)<\/span>\s*<\/span>\s*<input\s+value=\{website\}/.test(form), "field marked optional")
assert(/booking\.reportComing === true \? \(/.test(form), "confirmation line only when the check is running")
assert(form.includes("We&apos;re preparing your free website check now."), "confirmation copy")

// 7. /book?ref= pre-fill token (lib/booking/prefill-token.ts). No env needed: the secret is passed in.
const pt = await load("lib/booking/prefill-token.ts")
const SECRET = "test-secret-not-real"
const owner = "Dana.Reyes@ExampleReno.test"
const tok = pt.signPrefillToken(owner, { secret: SECRET })
assert(typeof tok === "string" && tok.startsWith("v1."), "token minted with v1 prefix")
assert(pt.verifyPrefillToken(tok, { secret: SECRET }) === "dana.reyes@examplereno.test", "round trip gives the lowercased email")
assert(pt.verifyPrefillToken(tok, { secret: "other-secret" }) === null, "wrong secret rejected")
const body = tok.slice(3)
const flipped = body.slice(0, 20) + (body[20] === "A" ? "B" : "A") + body.slice(21)
assert(pt.verifyPrefillToken(`v1.${flipped}`, { secret: SECRET }) === null, "tampered token rejected")
assert(pt.verifyPrefillToken(tok.slice(0, -2), { secret: SECRET }) === null, "truncated token rejected")
for (const bad of [null, undefined, "", "v1.", "v2." + body, "garbage", "v1.!!!!", 42, "v1." + "A".repeat(800)]) {
  assert(pt.verifyPrefillToken(bad, { secret: SECRET }) === null, `bad token rejected: ${String(bad).slice(0, 12)}`)
}
const now = Date.UTC(2026, 9, 14)
const short = pt.signPrefillToken(owner, { secret: SECRET, ttlSeconds: 60, now })
assert(pt.verifyPrefillToken(short, { secret: SECRET, now: now + 30_000 }) !== null, "valid before expiry")
assert(pt.verifyPrefillToken(short, { secret: SECRET, now: now + 120_000 }) === null, "expired token rejected")
const month = pt.signPrefillToken(owner, { secret: SECRET, now })
assert(pt.verifyPrefillToken(month, { secret: SECRET, now: now + 29 * 86_400_000 }) !== null, "default lasts 29 days")
assert(pt.verifyPrefillToken(month, { secret: SECRET, now: now + 31 * 86_400_000 }) === null, "default expires by day 31")
assert(pt.verifyPrefillToken(tok, { secret: null }) === null, "no secret: nothing verifies")
assert(pt.signPrefillToken("not-an-email", { secret: SECRET }) === null, "no token without an email")

const link = pt.bookingRefUrl(owner, { source: "report_email", medium: "email" }, { secret: SECRET })
const u = new URL(link)
assert(u.origin === "https://www.terramore.io" && u.pathname === "/book", "link goes to www /book")
assert(pt.verifyPrefillToken(u.searchParams.get("ref"), { secret: SECRET }) === "dana.reyes@examplereno.test", "link ref verifies")
assert(u.searchParams.get("utm_source") === "report_email" && u.searchParams.get("utm_medium") === "email", "utms added")
const lower = decodeURIComponent(link).toLowerCase()
for (const piece of ["dana", "reyes", "examplereno", "@", "%40"]) assert(!lower.includes(piece), `no PII in the URL: ${piece}`)
const decoded = Buffer.from(u.searchParams.get("ref").slice(3).replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("latin1").toLowerCase()
assert(!decoded.includes("dana") && !decoded.includes("examplereno"), "email not readable after base64 decoding either")
assert(pt.bookingRefUrl(owner, {}, { secret: null }) === "https://www.terramore.io/book", "unset secret: plain /book")
assert(pt.bookingRefUrl(null, { source: "x" }, { secret: SECRET }) === "https://www.terramore.io/book?utm_source=x", "no email: no ref")
const prevSecret = process.env.BOOKING_PREFILL_SECRET
delete process.env.BOOKING_PREFILL_SECRET
assert(pt.bookingRefUrl(owner) === "https://www.terramore.io/book", "env unset: plain /book")
if (prevSecret !== undefined) process.env.BOOKING_PREFILL_SECRET = prevSecret

// Emails use it; the prefill endpoint never returns the phone; the form fills only empty fields and drops the ref.
assert(/bookingRefUrl\(request\.email/.test(read("lib/report/pipeline.ts")), "report email /book link uses bookingRefUrl")
assert(/bookingRefUrl\(lead\.email/.test(read("lib/notify.ts")), "lead confirmation /book link uses bookingRefUrl")
assert(/bookingRefUrl\(row\.email/.test(read("lib/nurture/templates.ts")), "nurture /book links use bookingRefUrl")
const prefillRoute = read("app/api/booking/prefill/route.ts")
assert(/verifyPrefillToken\(request\.nextUrl\.searchParams\.get\("ref"\)\)/.test(prefillRoute), "endpoint verifies the token")
assert(!/phone/.test(prefillRoute.replace(/^\s*(\/\/|\*|\/\*\*).*$/gm, "")), "endpoint never selects or returns the phone")
assert(/return NextResponse\.json\(\{ prefill: null \}/.test(prefillRoute) && !/status: 4\d\d/.test(prefillRoute), "bad token: empty prefill, no error status")
assert(/Cache-Control": "no-store"/.test(prefillRoute), "prefill not cached")
assert(/setter\(\(current\) => current \|\| value\.trim\(\)\)/.test(form), "form fills only empty fields")
assert(/params\.delete\("ref"\)[\s\S]{0,200}replaceState/.test(form), "ref removed from the address bar")
assert(!/fill\(setPhone/.test(form), "phone never pre-filled")

console.log(`verify-booking-report: ${checks} checks passed`)
