/**
 * Digital Footprint report dedupe: "already requested" is about the same person, never the same business.
 * Pure check of matchRecentDuplicate (lib/report/duplicates.ts); nothing calls Supabase.
 * Run: node scripts/verify-report-dedupe.mjs
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
const { matchRecentDuplicate } = await load("lib/report/duplicates.ts")
const n = await load("lib/report/normalize-lead.ts")

const row = (over) => ({
  id: "row-1",
  email: "first@examplereno.test",
  phone: "(213) 555-0142",
  first_name: "Dana",
  last_name: "Reyes",
  business_name: "Example Remodeling Co",
  website: "https://www.examplereno.test",
  socials: "instagram.com/examplereno",
  company: null,
  signup_date: new Date().toISOString(),
  ...over,
})

const identity = (over) => ({
  phone: n.normalizePhone(over.phone ?? null),
  first: n.normalizePersonName(over.first ?? ""),
  last: n.normalizePersonName(over.last ?? ""),
  business: n.normalizeBusinessName(over.business ?? null),
  websiteHost: n.normalizeWebsiteHost(over.website ?? null),
})

const rows = [row({})]

// Same person: blocked.
assert(matchRecentDuplicate(identity({ phone: "213-555-0142", first: "Sam", last: "Lee" }), rows)?.matchedOn === "phone", "same phone blocks")
assert(
  matchRecentDuplicate(identity({ first: "dana", last: "REYES", website: "examplereno.test/contact" }), rows)?.matchedOn === "name",
  "same name + same website blocks",
)
assert(
  matchRecentDuplicate(identity({ first: "Dana", last: "Reyes", business: "Example Remodeling Co" }), rows)?.matchedOn === "name",
  "same name + same business blocks",
)
assert(
  matchRecentDuplicate(identity({ first: "Dana", last: "Reyes", website: "examplereno.test" }), [
    row({ website: null, company: "Example Remodeling Co · https://examplereno.test" }),
  ])?.matchedOn === "name",
  "legacy company-packed website still matches the same person",
)

// Same business, different person: allowed (the public lookup makes the website shared input).
assert(matchRecentDuplicate(identity({ first: "Sam", last: "Lee", website: "examplereno.test" }), rows) === null, "same website, different person allowed")
assert(matchRecentDuplicate(identity({ first: "Sam", last: "Lee", business: "Example Remodeling Co" }), rows) === null, "same business, different person allowed")
assert(matchRecentDuplicate(identity({ first: "Sam", last: "Lee" }), [row({ socials: "instagram.com/examplereno" })]) === null, "same socials alone allowed")
// Common name alone isn't one person.
assert(matchRecentDuplicate(identity({ first: "Dana", last: "Reyes", website: "other-business.test" }), rows) === null, "same name, different business allowed")
assert(matchRecentDuplicate(identity({ first: "-", last: "-", website: "examplereno.test" }), [row({ first_name: "-", last_name: "-" })]) === null, "placeholder names never match")
assert(matchRecentDuplicate(identity({}), rows) === null, "empty identity matches nothing")

console.log(`report-dedupe: ok (${checks} checks)`)
