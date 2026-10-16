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
console.log(`sms replies: ${checks} checks passed`)
