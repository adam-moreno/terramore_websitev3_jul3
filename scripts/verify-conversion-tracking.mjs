/**
 * Local-only conversion tracking verification (plain Node).
 * Does NOT hit /api/report or /api/booking. Does NOT create leads or bookings.
 * Run: node --experimental-strip-types scripts/verify-conversion-tracking.mjs
 *   or: node scripts/verify-conversion-tracking.mjs  (if analytics is loaded via strip-types import)
 *
 * Strategy: mock window.gtag, import lib/analytics.ts with Node type stripping,
 * assert event counts / Ads send_to / PII scrub / gating matrices.
 */

import { pathToFileURL } from "node:url"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

function createWindowMock() {
  const calls = []
  const dataLayer = []
  const gtag = (...args) => {
    calls.push({ args })
    dataLayer.push(args)
  }
  globalThis.window = {
    dataLayer,
    gtag,
    location: { pathname: "/report" },
  }
  return { calls, dataLayer }
}

function eventNames(calls) {
  return calls.filter((c) => c.args[0] === "event").map((c) => String(c.args[1]))
}

function eventPayloads(calls, name) {
  return calls
    .filter((c) => c.args[0] === "event" && c.args[1] === name)
    .map((c) => (c.args[2] && typeof c.args[2] === "object" ? c.args[2] : {}))
}

function count(calls, name) {
  return eventNames(calls).filter((n) => n === name).length
}

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

function bookingWouldTrack(response) {
  if (response.status === 409) return false
  const bookingId = typeof response.data.id === "string" ? response.data.id.trim() : ""
  if (!response.ok || !bookingId || !response.data.startIso || !response.data.manageUrl) return false
  return true
}

function reportWouldTrack(response) {
  if (response.status === 409) return false
  if (!response.ok) return false
  return true
}

const PII_KEYS = ["email", "phone", "name", "first_name", "last_name", "meet_url", "manage_url", "manage_token"]

async function loadAnalytics() {
  const analyticsPath = path.join(root, "lib/analytics.ts")
  // Node 22+: --experimental-strip-types allows importing .ts
  try {
    return await import(pathToFileURL(analyticsPath).href)
  } catch (first) {
    try {
      const require = createRequire(import.meta.url)
      const jiti = require("jiti")(import.meta.url)
      return jiti(analyticsPath)
    } catch {
      throw first
    }
  }
}

async function main() {
  process.env.NODE_ENV = "development"
  const results = []
  const win = createWindowMock()
  const analytics = await loadAnalytics()

  win.calls.length = 0
  analytics.trackReportSubmissionSuccess("report_form")
  assert(count(win.calls, "generate_lead") === 1, `generate_lead once, got ${count(win.calls, "generate_lead")}`)
  assert(
    count(win.calls, "report_submission_success") === 1,
    `report_submission_success once, got ${count(win.calls, "report_submission_success")}`,
  )
  assert(count(win.calls, "conversion") === 1, `Ads conversion once, got ${count(win.calls, "conversion")}`)
  const sendTo = eventPayloads(win.calls, "conversion")[0]?.send_to
  assert(sendTo === "AW-11353847408/XnBzCIeStfgcEPDs96Uq", `Ads send_to exact report label, got ${String(sendTo)}`)
  assert(count(win.calls, "meeting_booked") === 0, "report success must not fire meeting_booked")
  results.push(`Report success events: ${eventNames(win.calls).join(", ")}`)

  analytics.trackReportSubmissionSuccess("report_form")
  assert(count(win.calls, "generate_lead") === 1, "generate_lead still once after duplicate call")
  assert(count(win.calls, "report_submission_success") === 1, "report_submission_success still once")
  assert(count(win.calls, "conversion") === 1, "Ads conversion still once")
  results.push("Report dedupe: OK")

  win.calls.length = 0
  analytics.trackEvent("probe_pii", {
    email: "secret@example.com",
    phone: "555-0100",
    name: "Ada",
    page_path: "/report",
    form_id: "digital_footprint_report",
  })
  const probe = eventPayloads(win.calls, "probe_pii")[0] || {}
  for (const k of ["email", "phone", "name"]) {
    assert(!(k in probe), `PII key ${k} must be scrubbed`)
  }
  assert(probe.page_path === "/report", "safe page_path kept")
  results.push("PII scrub: OK")

  win.calls.length = 0
  analytics.trackReportSubmissionError("already_requested")
  assert(count(win.calls, "report_submission_error") === 1, "error event fires")
  assert(count(win.calls, "generate_lead") === 0, "409 path: no generate_lead")
  assert(count(win.calls, "report_submission_success") === 0, "409 path: no report_submission_success")
  assert(count(win.calls, "conversion") === 0, "409 path: no Ads conversion")
  results.push("Report error path: OK")

  assert(reportWouldTrack({ status: 201, ok: true }) === true, "201 tracks")
  assert(reportWouldTrack({ status: 409, ok: false }) === false, "409 no track")
  assert(reportWouldTrack({ status: 500, ok: false }) === false, "500 no track")
  results.push("Report gating matrix: OK")

  win.calls.length = 0
  globalThis.window.location.pathname = "/book"
  analytics.trackMeetingBooked({
    booking_id: "d7dfcae5-9a5c-4ae7-972f-44153255deba",
    business_type: "Service business",
    stage: "I've done ads",
    source: "book",
    page_path: "/book",
  })
  assert(count(win.calls, "meeting_booked") === 1, "meeting_booked once")
  assert(count(win.calls, "conversion") === 0, "booking must NOT fire Ads conversion")
  assert(count(win.calls, "generate_lead") === 0, "booking must not fire generate_lead")
  const mb = eventPayloads(win.calls, "meeting_booked")[0] || {}
  assert(mb.booking_id === "d7dfcae5-9a5c-4ae7-972f-44153255deba", "booking_id present")
  assert(mb.source === "book", "source present")
  assert(mb.page_path === "/book", "page_path present")
  for (const k of PII_KEYS) {
    assert(!(k in mb), `meeting_booked must not include ${k}`)
  }
  results.push("Booking success: OK")

  analytics.trackMeetingBooked({
    booking_id: "d7dfcae5-9a5c-4ae7-972f-44153255deba",
    business_type: "Service business",
    stage: "I've done ads",
    source: "book",
    page_path: "/book",
  })
  assert(count(win.calls, "meeting_booked") === 1, "meeting_booked still once after duplicate")
  results.push("Booking dedupe: OK")

  const beforeEmpty = count(win.calls, "meeting_booked")
  analytics.trackMeetingBooked({
    booking_id: "   ",
    business_type: "x",
    stage: "y",
    source: "book",
    page_path: "/book",
  })
  assert(count(win.calls, "meeting_booked") === beforeEmpty, "blank booking_id fires nothing")
  results.push("Blank booking_id: OK")

  const okBody = {
    id: "abc-123",
    startIso: "2026-09-17T14:00:00.000Z",
    manageUrl: "https://www.terramore.io/book/manage?token=x",
  }
  assert(bookingWouldTrack({ status: 200, ok: true, data: okBody }) === true, "200+id tracks")
  assert(bookingWouldTrack({ status: 409, ok: false, data: {} }) === false, "409 no track")
  assert(bookingWouldTrack({ status: 500, ok: false, data: {} }) === false, "500 no track")
  assert(bookingWouldTrack({ status: 200, ok: true, data: { ...okBody, id: 123 } }) === false, "numeric id no track")
  assert(bookingWouldTrack({ status: 200, ok: true, data: { ...okBody, id: "" } }) === false, "empty id no track")
  assert(bookingWouldTrack({ status: 200, ok: true, data: { id: "abc", startIso: "t" } }) === false, "missing manageUrl no track")
  assert(bookingWouldTrack({ status: 400, ok: false, data: {} }) === false, "validation 400 no track")
  results.push("Booking gating matrix: OK")

  assert(analytics.GA4_MEASUREMENT_ID === "G-ZC5DY0ES7N", "current GA4 id")
  assert(analytics.GA4_MEASUREMENT_ID_LEGACY === "G-BQN6VCY579", "legacy GA4 id")
  assert(analytics.GOOGLE_ADS_ID_DEFAULT === "AW-11353847408", "Ads id")
  assert(analytics.googleAdsSendTo() === "AW-11353847408/XnBzCIeStfgcEPDs96Uq", "report send_to")
  results.push("Destination IDs: OK")

  const diag = globalThis.window.__tmAnalytics
  assert(!!diag && Array.isArray(diag.events) && diag.events.length > 0, "__tmAnalytics populated in development")
  results.push("window.__tmAnalytics (dev): OK")

  console.log("\n=== Conversion tracking verification (local mock, no CRM/booking) ===\n")
  for (const line of results) console.log("✓", line)
  console.log("\nReal leads created: NO")
  console.log("Real bookings created: NO")
  console.log("Google Ads account modified: NO")
  console.log("\nALL CHECKS PASSED\n")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
