/**
 * Cancel / reschedule withdraws the booking's scheduled emails. No network, no database: fakes stand in for both.
 * - provider ids are recorded at booking time (prep + reminders)
 * - cancel calls the provider's cancel for each still-future email, and keeps going when one fails
 * - reschedule withdraws the old ones first, then schedules and records reminders for the new time
 * - older bookings with nothing recorded: no crash, new reminders still scheduled on reschedule
 * Run: node scripts/verify-booking-emails.mjs
 */

import fs from "node:fs"
import path from "node:path"
import { register } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
register(pathToFileURL(path.join(root, "scripts/resolve-ts-alias.mjs")).href)
// No real provider or database is ever reached.
for (const key of ["RESEND_API_KEY", "SENDGRID_API_KEY", "POSTMARK_SERVER_TOKEN", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) delete process.env[key]

let checks = 0
function assert(cond, msg) {
  checks++
  if (!cond) throw new Error(`FAIL: ${msg}`)
}
const read = (file) => fs.readFileSync(path.join(root, file), "utf8")
const se = await import(pathToFileURL(path.join(root, "lib/booking/scheduled-emails.ts")).href)

const NOW = Date.UTC(2026, 9, 14, 12)
const H = 3_600_000

function fakeDeps({ rows = [], failCancelFor = [], throwCancelFor = [], listReturnsNull = false } = {}) {
  const log = []
  const store = rows.map((r) => ({ status: "scheduled", ...r }))
  return {
    log,
    store,
    deps: {
      async list(bookingId) {
        log.push(["list", bookingId])
        return listReturnsNull ? null : store.filter((r) => r.status === "scheduled")
      },
      async mark(id, status, error) {
        log.push(["mark", id, status])
        const row = store.find((r) => r.id === id)
        if (row) Object.assign(row, { status, error })
      },
      async insert(newRows) {
        log.push(["insert", newRows.length])
        newRows.forEach((r, i) => store.push({ id: `new-${i}`, status: "scheduled", ...r }))
      },
      async cancelMessage(provider, messageId) {
        log.push(["cancel", provider, messageId])
        if (throwCancelFor.includes(messageId)) throw new Error("network down")
        return failCancelFor.includes(messageId) ? { ok: false, error: "409 already sent" } : { ok: true }
      },
      async schedule(notice, opts) {
        log.push(["schedule", notice.startIso, notice.tz, notice.phone, opts.hasReport])
        const messages = [
          { kind: "24h", provider: "resend", messageId: "r-24", sendAt: new Date(Date.parse(notice.startIso) - 24 * H).toISOString() },
          { kind: "2h", provider: "resend", messageId: "r-2", sendAt: new Date(Date.parse(notice.startIso) - 2 * H).toISOString() },
          { kind: "30m", provider: "resend", messageId: "r-30", sendAt: new Date(Date.parse(notice.startIso) - 0.5 * H).toISOString() },
        ]
        return { scheduled: messages.map((m) => m.kind), skipped: [], results: [], messages }
      },
      async hasReport() {
        return true
      },
      now: () => NOW,
    },
  }
}

const future = (h) => new Date(NOW + h * H).toISOString()
const row = (id, kind, messageId, sendAt, extra = {}) => ({ id, kind, provider: "resend", message_id: messageId, send_at: sendAt, visitor_tz: "America/Chicago", has_phone: true, ...extra })

// 1. Ids recorded at booking time.
{
  const { deps, store } = fakeDeps()
  await se.recordScheduledEmails(
    "bk-1",
    [
      { kind: "prep", provider: "resend", messageId: "p-1", sendAt: future(0.1) },
      { kind: "24h", provider: "sendgrid", messageId: "batch-1", sendAt: future(30) },
      { kind: "2h", provider: "resend", messageId: null, sendAt: future(52) },
    ],
    { tz: "America/Chicago", hasPhone: false },
    deps,
  )
  assert(store.length === 3, "every scheduled email recorded")
  assert(store.every((r) => r.booking_id === "bk-1" && r.visitor_tz === "America/Chicago" && r.has_phone === false), "booking id and context kept")
  assert(store[0].message_id === "p-1" && store[1].provider === "sendgrid", "provider and id kept")
  assert(store[2].status === "not_cancelable", "email without an id marked not cancelable")
  assert(!JSON.stringify(store).includes("@"), "no email address stored")
}
assert(se.prepMessage({ ok: true, channel: "email:resend", messageId: "p-9", scheduledAt: future(0.1) })?.messageId === "p-9", "prep result becomes a record")
assert(se.prepMessage({ ok: true, channel: "email", skipped: true, scheduledAt: future(0.1) }) === null, "skipped prep isn't recorded")
assert(se.prepMessage({ ok: false, channel: "email:resend", scheduledAt: future(0.1) }) === null, "failed prep isn't recorded")

// 2. Cancel: each future email withdrawn; past and id-less ones not; one failure doesn't stop the rest.
{
  const { deps, log, store } = fakeDeps({
    rows: [
      row("a", "prep", "p-1", future(-1)),
      row("b", "24h", "r-24", future(20)),
      row("c", "2h", "r-2", future(42), { provider: "sendgrid" }),
      row("d", "30m", "r-30", future(43.5)),
      row("e", "30m", null, future(43.5)),
    ],
    failCancelFor: ["r-24"],
  })
  const result = await se.withdrawBookingEmails("bk-1", deps)
  const cancels = log.filter((l) => l[0] === "cancel")
  assert(cancels.length === 3, "provider cancel called for each future email with an id")
  assert(cancels.some((c) => c[1] === "sendgrid" && c[2] === "r-2"), "sendgrid batch cancel called")
  assert(!cancels.some((c) => c[2] === "p-1"), "already-sent prep not canceled")
  assert(result.canceled === 2 && result.failed === 1, "counts: 2 canceled, 1 failed")
  assert(store.find((r) => r.id === "b").status === "cancel_failed", "failure kept on the row")
  assert(store.find((r) => r.id === "d").status === "canceled", "later email still canceled after a failure")
  assert(store.find((r) => r.id === "e").status === "not_cancelable", "id-less row marked")
}
{
  const { deps, store } = fakeDeps({ rows: [row("x", "2h", "boom", future(3)), row("y", "30m", "fine", future(4))], throwCancelFor: ["boom"] })
  let threw = false
  let result
  try {
    result = await se.withdrawBookingEmails("bk-2", deps)
  } catch {
    threw = true
  }
  assert(!threw, "a throwing provider call doesn't throw out of withdraw")
  assert(result.failed === 1 && result.canceled === 1 && store.find((r) => r.id === "y").status === "canceled", "the next email is still withdrawn after a throw")
}
{
  const { deps, log } = fakeDeps({ listReturnsNull: true })
  const result = await se.withdrawBookingEmails("old-booking", deps)
  assert(result.rows === null && !log.some((l) => l[0] === "cancel"), "older booking / missing table: nothing to cancel, no crash")
}

// 3. Reschedule: withdraw first, then schedule for the new time with the visitor's zone, then record.
{
  const { deps, log, store } = fakeDeps({ rows: [row("b", "24h", "old-24", future(20)), row("c", "2h", "old-2", future(42))] })
  const booking = { id: "bk-1", startIso: future(72), endIso: future(72.5), meetUrl: null, meetProvider: null, name: "Dana Reyes", email: "dana@examplereno.test", ownerTz: "America/Los_Angeles" }
  const out = await se.rescheduleBookingEmails(booking, "https://www.terramore.io/book/manage/tok", deps)
  const order = log.map((l) => l[0])
  const lastCancel = order.lastIndexOf("cancel")
  const scheduleAt = order.indexOf("schedule")
  assert(lastCancel >= 0 && scheduleAt > lastCancel, "old emails canceled before new ones are scheduled")
  assert(log.filter((l) => l[0] === "cancel").map((l) => l[2]).join() === "old-24,old-2", "both old reminders withdrawn")
  const sched = log.find((l) => l[0] === "schedule")
  assert(sched[1] === booking.startIso, "new reminders for the new time")
  assert(sched[2] === "America/Chicago", "visitor's zone from the old rows")
  assert(sched[3] === "on file" && sched[4] === true, "phone flag and report state passed through")
  assert(out.scheduled.length === 3 && store.filter((r) => r.status === "scheduled" && r.booking_id === "bk-1").length === 3, "new reminders recorded")
}
{
  const { deps, log } = fakeDeps({ listReturnsNull: true })
  await se.rescheduleBookingEmails(
    { id: "old", startIso: future(72), endIso: future(72.5), meetUrl: null, meetProvider: null, email: "a@b.test", ownerTz: "America/Denver" },
    "https://www.terramore.io/book/manage/t",
    deps,
  )
  const sched = log.find((l) => l[0] === "schedule")
  assert(sched && sched[2] === "America/Denver" && sched[3] === null, "older booking: new reminders still scheduled, owner zone, no phone")
}
{
  const { deps, log } = fakeDeps()
  await se.rescheduleBookingEmails({ id: "x", startIso: future(5), endIso: future(6), meetUrl: null, meetProvider: null }, "u", deps)
  assert(!log.some((l) => l[0] === "schedule"), "no email on the booking: nothing scheduled, no crash")
}

// 4. Provider cancel endpoints (fake fetch).
{
  const calls = []
  const fakeFetch = async (url, init) => {
    calls.push([url, init])
    return new Response("", { status: url.includes("bad") ? 404 : 200 })
  }
  process.env.RESEND_API_KEY = "test"
  process.env.SENDGRID_API_KEY = "test"
  assert((await se.cancelProviderMessage("resend", "abc", fakeFetch)).ok, "resend cancel ok")
  assert(calls[0][0] === "https://api.resend.com/emails/abc/cancel" && calls[0][1].method === "POST", "resend cancel endpoint")
  assert((await se.cancelProviderMessage("sendgrid", "batch-9", fakeFetch)).ok, "sendgrid cancel ok")
  assert(calls[1][0] === "https://api.sendgrid.com/v3/user/scheduled_sends" && JSON.parse(calls[1][1].body).status === "cancel" && JSON.parse(calls[1][1].body).batch_id === "batch-9", "sendgrid batch cancel body")
  assert(!(await se.cancelProviderMessage("resend", "bad", fakeFetch)).ok, "provider error is a failure, not a throw")
  assert(!(await se.cancelProviderMessage("postmark", "x", fakeFetch)).ok, "postmark: can't withdraw, logged as failure")
  const thrower = async () => {
    throw new Error("offline")
  }
  assert((await se.cancelProviderMessage("resend", "x", thrower)).error === "offline", "network error fail-soft")
  delete process.env.RESEND_API_KEY
  delete process.env.SENDGRID_API_KEY
}

// 5. Wiring (source checks).
const route = read("app/api/booking/route.ts")
assert(/recordScheduledEmails\(\s*String\(booking\.id\)/.test(route), "booking records the scheduled ids")
assert(/prepMessage\(prep\)/.test(route) && /reminders\.messages/.test(route), "prep and reminders both recorded")
const manage = read("app/api/booking/manage/route.ts")
const cancelBlock = manage.slice(manage.indexOf('action === "cancel"'), manage.indexOf('action === "reschedule"'))
assert(/after\(async \(\) => \{\s*const withdrawn = await withdrawBookingEmails\(String\(b\.id\)\)/.test(cancelBlock), "cancel withdraws after the response")
assert(/rescheduleBookingEmails\(b, manageUrl\(/.test(manage), "reschedule withdraws and re-schedules")
const notify = read("lib/notify.ts")
assert(/messageId: data\.id/.test(notify), "Resend id captured")
assert(/batch_id: sendgridBatchId/.test(notify) && /v3\/mail\/batch/.test(notify), "SendGrid scheduled sends carry a batch id")
assert(fs.existsSync(path.join(root, "supabase/migrations/20261014_booking_scheduled_emails.sql")), "migration file present")
const sql = read("supabase/migrations/20261014_booking_scheduled_emails.sql")
assert(/website\.booking_scheduled_emails/.test(sql) && /ENABLE ROW LEVEL SECURITY/.test(sql) && !/\bemail TEXT|\bphone TEXT/i.test(sql), "table in website schema, RLS on, no email/phone columns")

console.log(`verify-booking-emails: ${checks} checks passed`)
