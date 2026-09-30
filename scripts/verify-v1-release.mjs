/**
 * Visual V1 release regression check (production c11083c). Static, no network, no browser.
 * verify-visual.mjs already holds the rules; this pins the ones the V1 release depends on so a later change cannot
 * drop or weaken one quietly, runs verify-visual, and refuses any allowlist entry or count above the V1 baseline.
 * Run: node scripts/verify-v1-release.mjs
 */

import path from "node:path"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

/** V1 guarantee -> verify-visual rule ids that enforce it. */
const V1_GUARANTEES = [
  ["Hero marks are brand-colored cdn.simpleicons.org marks", ["hero-logos-brand-assets", "hero-logos-not-desaturated"]],
  ["Desktop hero marks rest only on the visible curve (efad7a4)", ["hero-logos-visible-arc"]],
  ["Slack example: initials avatars, no photos", ["slack-example-identity"]],
  ['"Illustrative example" label stays on simulations', ["simulation-labelled", "slack-example-identity"]],
  ["No fake G2 / rating proof", ["no-unsourced-rating"]],
  ['No "thousands" / unsourced counts', ["no-unsourced-counts"]],
  ["No live-inquiry or fake activity", ["no-fake-live-activity"]],
  ["No ipapi.co or geolocation", ["no-ip-geolocation"]],
  ["V1 contrast", ["no-white-on-gold", "no-gradient-text"]],
  ["V1 motion", ["looping-motion-reduced", "autoplay-has-control"]],
]

/** V1 baseline allowlist. Counts may go down (fixed findings), never up; no new entries. */
const V1_ALLOWLIST_CEILING = new Map([["edge-safe-email components/manage-booking.tsx", 1]])

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`)
}

function checkVisualSource(src) {
  const problems = []
  const ids = new Set([...src.matchAll(/^\s*id:\s*"([\w-]+)",/gm)].map((m) => m[1]))
  for (const [guarantee, rules] of V1_GUARANTEES) {
    for (const rule of rules) if (!ids.has(rule)) problems.push(`rule "${rule}" missing (${guarantee})`)
  }
  const block = src.match(/const KNOWN_OPEN = \[([\s\S]*?)\n\]/)
  if (!block) problems.push("KNOWN_OPEN allowlist not found")
  for (const m of (block?.[1] ?? "").matchAll(/\{\s*check:\s*"([\w-]+)",\s*file:\s*"([^"]+)",\s*count:\s*(\d+)/g)) {
    const key = `${m[1]} ${m[2]}`
    const ceiling = V1_ALLOWLIST_CEILING.get(key)
    if (ceiling === undefined) problems.push(`new allowlist entry ${key} (V1 allows none)`)
    else if (Number(m[3]) > ceiling) problems.push(`allowlist ${key} raised to ${m[3]} (V1 ceiling ${ceiling})`)
  }
  return problems
}

const visualPath = path.join(root, "scripts/verify-visual.mjs")
const source = readFileSync(visualPath, "utf8")

// Self-test: the source check catches a dropped rule and a raised allowlist count.
assert(checkVisualSource(source.replace('id: "hero-logos-visible-arc",', 'id: "renamed",')).length > 0, "catches a dropped V1 rule")
assert(
  checkVisualSource(source.replace(/(file: "components\/manage-booking\.tsx", count: )1/, "$12")).length > 0,
  "catches a raised allowlist count"
)

const problems = checkVisualSource(source)
assert(problems.length === 0, `V1 release rules:\n  ${problems.join("\n  ")}`)

const run = spawnSync(process.execPath, [visualPath], { cwd: root, encoding: "utf8" })
assert(run.status === 0, `verify-visual failed:\n${run.stdout}${run.stderr}`)

console.log(run.stdout.trim())
for (const [guarantee, rules] of V1_GUARANTEES) console.log(`  ✓ ${guarantee}: ${rules.join(", ")}`)
console.log(`v1-release: ok (${V1_GUARANTEES.length} guarantees, allowlist at or below the V1 baseline)`)
