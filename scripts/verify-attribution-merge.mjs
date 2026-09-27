/**
 * Attribution merge + Slack labeling. Does not call Google, Slack, or the report API.
 * Run: node scripts/verify-attribution-merge.mjs
 */

import { pathToFileURL } from "node:url"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  }
}

const attribution = await import(pathToFileURL(path.join(root, "lib/attribution.ts")).href)
const slack = await import(pathToFileURL(path.join(root, "lib/report/slack-report.ts")).href)

const merged = attribution.mergeAttributionRecords({ gclid: "AAA" }, { utm_source: "google" })
assert(merged.gclid === "AAA", "gclid must survive a later utm_source")
assert(merged.utm_source === "google", "utm_source must be stored beside gclid")

const gbraid = attribution.mergeAttributionRecords({ gbraid: "BBB" }, { utm_source: "google" })
assert(gbraid.gbraid === "BBB" && gbraid.utm_source === "google", "gbraid must survive a later utm_source")

const replaced = attribution.mergeAttributionRecords(
  { gclid: "AAA", utm_source: "newsletter" },
  { gclid: "CCC" },
)
assert(replaced.gclid === "CCC", "a newer value replaces the same field")
assert(replaced.utm_source === "newsletter", "unrelated fields stay")

const emptyDoesNotErase = attribution.mergeAttributionRecords({ gclid: "AAA" }, { gclid: "  ", utm_campaign: "" })
assert(emptyDoesNotErase.gclid === "AAA", "blank incoming values must not erase gclid")
assert(!emptyDoesNotErase.utm_campaign, "empty campaign is not stored")

globalThis.sessionStorage = memoryStorage({
  tm_report_attribution: JSON.stringify({ gclid: "AAA" }),
})
globalThis.window = { location: { search: "?utm_source=google" } }
attribution.captureAttributionFromUrl()
const stored = JSON.parse(globalThis.sessionStorage.getItem("tm_report_attribution"))
assert(stored.gclid === "AAA" && stored.utm_source === "google", "session capture must merge, not replace")

const lines = slack.formatDigitalFootprintSlack({
  business: "Example Co",
  website: "https://example.com",
  submittedAt: "2026-09-22T18:26:00.000Z",
  name: "Test Person",
  email: "test@example.com",
  phone: null,
  attribution: { gbraid: "CLICK123" },
})
const text = lines.join("\n")
assert(text.includes("Channel: Google Ads"), "gbraid labels Google Ads")
assert(text.includes("Campaign: —"), "campaign stays blank without utm_campaign")
assert(text.includes("Term: —"), "term stays blank without utm_term")
assert(text.includes("Click ID: GBRAID · CLICK123"), "click id type is shown, not decoded")
assert(text.includes("Submitted: Sep 22, 2026 · 11:26 AM PT"), "server time renders in Pacific")
assert(!/keyword|search term/i.test(text), "slack must not invent a keyword")

const sourceOnly = slack.channelFromAttribution({ utm_source: "google" })
assert(sourceOnly == null, "utm_source alone is not a channel")

const paid = slack.channelFromAttribution({ utm_source: "google", utm_medium: "cpc" })
assert(paid === "Google Ads", "paid google UTMs can name the channel")

const meta = slack.channelFromAttribution({ fbclid: "FB1", gclid: "G1" })
assert(meta === "Google Ads", "a Google click id wins over fbclid")

console.log("attribution merge + slack labeling: ok")
