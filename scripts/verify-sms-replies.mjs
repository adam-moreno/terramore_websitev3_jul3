/**
 * Text replies and STOP (2026-10-15): keywords, webhook auth, and the wiring that keeps opted-out numbers from
 * getting texts. Pure checks and source checks; nothing calls Sendblue or Supabase.
 * Run: node scripts/verify-sms-replies.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { register } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
register(pathToFileURL(path.join(root, "scripts/resolve-ts-alias.mjs")).href)
let checks = 0
const assert = (c, m) => { checks++; if (!c) throw new Error(`FAIL: ${m}`) }
const load = (f) => import(pathToFileURL(path.join(root, f)).href)
const read = (f) => fs.readFileSync(path.join(root, f), "utf8")

const { smsKeyword, SMS_REPLIES } = await load("lib/sms/keywords.ts")
for (const w of ["STOP", "stop", " Stop. ", "STOPALL", "Unsubscribe", "cancel", "END", "quit", "stop!"]) assert(smsKeyword(w) === "stop", `opt-out: ${w}`)
for (const w of ["START", "unstop"]) assert(smsKeyword(w) === "start", `opt-in: ${w}`)
for (const w of ["HELP", "info"]) assert(smsKeyword(w) === "help", `help: ${w}`)
for (const w of ["stop by tomorrow?", "Yes", "can we cancel the call friday", "", null, "Thanks!", "STOP STOP STOP STOP"]) assert(smsKeyword(w) === null, `normal reply: ${w}`)
assert(/Reply START/.test(SMS_REPLIES.stop) && /Reply STOP/.test(SMS_REPLIES.help) && /\(818\) 699-9217/.test(SMS_REPLIES.help), "confirmation and help texts say how to opt in/out and how to reach us")
assert(Object.values(SMS_REPLIES).every((t) => t.length <= 160 && t.startsWith("Terramore:")), "each reply fits one text and names Terramore")

const { authorised } = await load("lib/sms/webhook-auth.ts")
const secret = "s3cr3t-value-that-is-long-enough-123"
const req = (url, headers = {}) => ({ url, headers: new Headers(headers) })
assert(authorised(req(`https://x.test/api/sms/sendblue?key=${secret}`), secret), "secret in ?key=")
assert(authorised(req("https://x.test/api/sms/sendblue", { "sb-signing-secret": secret }), secret), "secret in a header")
assert(authorised(req("https://x.test/api/sms/sendblue", { authorization: `Bearer ${secret}` }), secret), "secret as a bearer token")
assert(!authorised(req("https://x.test/api/sms/sendblue?key=wrong"), secret), "wrong key refused")
assert(!authorised(req("https://x.test/api/sms/sendblue"), secret), "no key refused")
assert(!authorised(req(`https://x.test/api/sms/sendblue?key=short`), "short"), "a short secret refuses everything")
assert(!authorised(req("https://x.test/api/sms/sendblue?key="), undefined), "no secret configured refuses everything")

const notify = read("lib/notify.ts")
assert(/if \(!opts\.force && \(await isOptedOut\(phone\)\)\) return skip\("sms", "opted out \(texted STOP\)"\)/.test(notify), "sendSms skips opted-out numbers")
assert(notify.indexOf("isOptedOut(phone)") < notify.indexOf("const provider = smsProvider()"), "the opt-out check comes before either provider (Sendblue or Twilio)")
assert(/logText\(\{ direction: "outbound"/.test(notify), "website texts are logged to the Comms page")
const route = read("app/api/sms/sendblue/route.ts")
assert(/if \(!authorised\(request, process\.env\.SENDBLUE_WEBHOOK_SECRET\)\) return NextResponse\.json\(\{ error: "unauthorized" \}, \{ status: 401 \}\)/.test(route), "the webhook needs the secret")
assert(route.indexOf('if (logged === "duplicate")') < route.indexOf("const keyword = smsKeyword"), "a retried webhook does nothing twice")
assert(route.indexOf("await recordOptOut(from") < route.indexOf("SMS_REPLIES.stop"), "STOP is saved before the confirmation goes out")
assert(/SMS_REPLIES\.stop, \{ typing: false, force: true/.test(route) && /SMS_REPLIES\.help, \{ typing: false, force: true/.test(route), "the STOP and HELP replies reach opted-out numbers")
assert(!/SMS_REPLIES\.start, \{[^}]*force: true/.test(route), "nothing else is forced")
assert(/if \(await isOptedOut\(from\)\) \{\s*await clearOptOut\(from\)/.test(route), "START only replies to someone who had opted out")
assert(/postSlack\(/.test(route) && /sendEmail\(\{\s*to: ADMIN_EMAIL/.test(route), "every inbound text alerts Adam")
assert(!/export (async )?function (?!POST)/.test(route), "the route file exports only its handler")
const sb = read("lib/sendblue.ts")
assert(/if \(process\.env\.SENDBLUE_FREE_LINE\?\.trim\(\) !== "1"\) return created/.test(sb), "no free-plan verification text on the paid line")
const sql = read("supabase/migrations/20261015_sms_opt_outs.sql")
assert(/website\.sms_opt_outs/.test(sql) && /ENABLE ROW LEVEL SECURITY/.test(sql) && /REVOKE ALL/.test(sql) && !/email TEXT|name TEXT|content/i.test(sql), "opt-out table: website schema, RLS, phone only")
// First texts follow Sendblue's pre-reply rules (no links, media, phones or emails; 300 characters).
const bs = await load("lib/booking-sms.ts")
const ctx = { name: "Dana Reyes", startIso: "2026-10-27T16:00:00Z", tz: "America/Los_Angeles", meetUrl: "https://meet.google.com/abc-defg-hij", meetProvider: "google_meet", manageUrl: "https://www.terramore.io/book/manage?token=x" }
const confirm = bs.buildBookingSms("confirm", ctx)
assert(bs.fitsFirstMessageRules(confirm.body), `booking confirmation fits the first-message rules: ${confirm.body}`)
assert(!confirm.mediaUrl, "no media on the first text")
assert(/Reply STOP to opt out\.$/.test(confirm.body), "booking confirmation says how to opt out")
assert(!bs.fitsFirstMessageRules("Join: https://meet.google.com/x") && !bs.fitsFirstMessageRules("Email hello@terramore.io") && !bs.fitsFirstMessageRules("Call (818) 699-9217") && !bs.fitsFirstMessageRules("x".repeat(301)), "the rule check catches links, emails, phones and length")
const rs = await load("lib/report/sms.ts")
assert(bs.fitsFirstMessageRules(rs.REPORT_SMS.m1("Dana")), "report text 1 fits the first-message rules")
assert(bs.fitsFirstMessageRules(rs.REPORT_SMS.m2("Dana")), "report text 2 fits the first-message rules")

// --- Tap to text us (2026-10-16)
const tl = await load("lib/sms/text-link.ts")
const rb = tl.textBody("report", { firstName: "Dana", business: "Buynest", code: "K7Q2M" })
assert(rb === "Hi Terramore, it's Dana from Buynest. Text me about my report. (Ref K7Q2M)", `report message: ${rb}`)
assert(tl.textBody("booking", { firstName: "Dana", code: "B4Q9X" }) === "Hi Terramore, it's Dana. Text me reminders for my call. (Ref B4Q9X)", "booking message")
assert(tl.textBody("site") === "Hi Terramore, I'd like a free check of my business. (Ref WEB)", "footer message")
assert(tl.textBody("report", { firstName: "Dana (owner)\n" }).includes("it's Dana owner") && !/[()\n]{2}/.test(tl.textBody("report", { firstName: "((x))" })), "names can't break the ref")
assert(tl.textBody("report").includes("it's me") && !tl.textBody("report").includes("Ref"), "no name or code: still a sensible message")
assert(tl.smsHref("Hi there", "ios") === "sms:+16123568558&body=Hi%20there" && tl.smsHref("Hi there", "mac").includes("&body="), "iPhone and Mac use &body=")
assert(tl.smsHref("Hi there", "android") === "sms:+16123568558?body=Hi%20there", "Android uses ?body=")
assert(tl.qrPayload("Hi") === "SMSTO:+16123568558:Hi", "QR uses SMSTO, which phone cameras open as a text")
assert(tl.textPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)") === "ios" && tl.textPlatform("Mozilla/5.0 (Linux; Android 14)") === "android" && tl.textPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)") === "mac" && tl.textPlatform("Mozilla/5.0 (Windows NT 10.0)") === "desktop", "platform detection")
assert(tl.inAppBrowser("Mozilla/5.0 (iPhone) Instagram 300.0") && tl.inAppBrowser("FBAN/FBIOS") && !tl.inAppBrowser("Mozilla/5.0 (iPhone) Safari/604.1"), "in-app browsers detected")
assert(tl.refFromText(rb) === "K7Q2M" && tl.refFromText("hello (ref k7q2m) thanks") === "K7Q2M" && tl.refFromText(tl.textBody("site")) === "WEB", "refs read back from texts")
assert(tl.refFromText("my code is K7Q2M") === null && tl.refFromText("(Ref 00000)") === null, "only a bracketed valid ref counts")
const card = (await import("node:fs")).readFileSync(path.join(root, "public/terramore.vcf"), "utf8")
assert(card.includes("TEL;TYPE=CELL,IPHONE,pref:" + "+16123568558"), "the contact card carries the text line")

const tf = await load("lib/sms/text-first-replies.ts")
const ref = (over = {}) => ({ code: "K7Q2M", kind: "report", ref_id: "row-1", first_name: "Dana", phone: null, used_at: null, ...over })
const deps = (over = {}) => ({ findTextRef: async () => ref(), claimTextRef: async () => true, firstInbound: async () => true, lookup: async () => ({ reportSent: true }), ...over })
let r = await tf.textFirstReply("K7Q2M", "+15550100", deps())
assert(r && r.text.startsWith("Hi Dana, it's Adam at Terramore.") && /in your inbox/.test(r.text) && /Reply STOP to opt out\.$/.test(r.text), "report reply, report sent")
r = await tf.textFirstReply("K7Q2M", "+15550100", deps({ lookup: async () => ({ reportSent: false }) }))
assert(/on its way/.test(r.text), "report reply, still being written")
r = await tf.textFirstReply("B4Q9X", "+15550100", deps({ findTextRef: async () => ref({ kind: "booking", code: "B4Q9X" }), lookup: async () => ({ startIso: "2026-10-27T16:00:00Z", tz: "America/Los_Angeles" }) }))
assert(r && /You're all set for Tuesday, Oct 27 at 9:00 AM PDT\./.test(r.text) && /a day before, 2 hours before and 30 minutes before/.test(r.text), `booking reply: ${r && r.text}`)
assert((await tf.textFirstReply("K7Q2M", "+15550100", deps({ claimTextRef: async () => false }))) === null, "a ref only gets one instant reply")
assert((await tf.textFirstReply("ZZZZZ", "+15550100", deps({ findTextRef: async () => null }))) === null, "an unknown ref gets no auto-reply")
assert((await tf.textFirstReply("WEB", "+15550100", deps()))?.text.includes("/report"), "footer text: first text gets the free-check reply")
assert((await tf.textFirstReply("WEB", "+15550100", deps({ firstInbound: async () => false }))) === null, "footer text: only the first text from a number")
assert((await tf.textFirstReply("K7Q2M", "+1", deps({ findTextRef: async () => { throw new Error("db") } }))) === null, "never throws")
assert(tf.CONTACT_CARD_URL === "https://www.terramore.io/terramore.vcf", "the reply carries the contact card")

// Reminders by text for owners who texted us
const sr = await load("lib/booking/send-reminders.ts")
const sentTexts = []
const NOW2 = Date.UTC(2026, 9, 27, 14, 5)
const dueRow = { id: "d1", booking_id: "bk-7", kind: "2h", send_at: new Date(NOW2 - 60000).toISOString(), visitor_tz: "America/Los_Angeles", has_phone: false, manage_token: "tok", start_iso: new Date(NOW2 + 115 * 60000).toISOString() }
const runText = (phone) => sr.sendDueReminders({
  claimDue: async () => [dueRow],
  booking: async () => ({ ok: true, booking: { id: "bk-7", startIso: dueRow.start_iso, endIso: dueRow.start_iso, meetUrl: "https://meet.google.com/abc", meetProvider: "google_meet", manageToken: "tok", status: "scheduled", name: "Dana Reyes", email: "dana@examplereno.test" } }),
  hasReport: async () => true,
  send: async () => ({ ok: true, channel: "email:resend" }),
  mark: async () => {},
  now: () => NOW2,
  textPhone: async () => phone,
  sendText: async (p, body) => (sentTexts.push([p, body]), { ok: true, channel: "sms:sendblue" }),
})
await runText("+15550111")
assert(sentTexts.length === 1 && sentTexts[0][0] === "+15550111" && /meet\.google\.com\/abc/.test(sentTexts[0][1]), "an owner who texted us gets the 2-hour reminder by text, with the join link")
await runText(null)
assert(sentTexts.length === 1, "no text without a number that texted us")

// Placements and wiring
const popup = read("components/report-popup.tsx")
assert(/placement="report_success"/.test(popup) && /textBody\("report"/.test(popup), "report confirmation shows Tap to text us")
const flow = read("components/booking-flow.tsx")
assert(/placement="booking_success"/.test(flow) && /textBody\("booking"/.test(flow), "booking confirmation shows Tap to text us")
const footer = read("components/site-footer.tsx")
assert((footer.match(/<TextUsButton variant="compact" placement="footer"/g) || []).length === 2, "both footers have the Text link")
assert(/\/text\?ref=/.test(read("lib/notify.ts")) && /Want reminders by text\?/.test(read("lib/notify.ts")), "booking email links to /text with the ref")
assert(/mintTextRef\(\{ kind: "report"/.test(read("app/api/report/route.ts")) && /mintTextRef\(\{ kind: "booking"/.test(read("app/api/booking/route.ts")), "report requests and bookings mint a ref")
const btn = read("components/text-us-button.tsx")
assert(/Reply STOP to\s+opt out/.test(btn) && /\/terms#text-messages/.test(btn), "the button carries the consent line and text terms")
assert(/1500\)/.test(btn) && /clipboard\.writeText/.test(btn), "clipboard fallback after 1.5 s")
assert(/trackFunnelEvent\("text_us_click", \{ placement \}\)/.test(btn), "taps are tracked by placement only")
const tax = read("lib/funnel-taxonomy.ts")
assert(/text_us_click: \{ placement: "text_placement", page_path: "page_path" \}/.test(tax), "text_us_click is in the funnel taxonomy")
const sql3 = read("supabase/migrations/20261016_text_refs.sql")
assert(/website\.text_refs/.test(sql3) && /ENABLE ROW LEVEL SECURITY/.test(sql3) && /REVOKE ALL/.test(sql3), "text_refs: website schema, RLS, no public access")

console.log(`sms replies: ${checks} checks passed`)
