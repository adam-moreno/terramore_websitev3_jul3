/**
 * V2A funnel measurement guardrails. No network, no browser, no leads, no bookings, no GA4 hits.
 * Executes lib/funnel-taxonomy.ts and lib/analytics.ts against a mocked window, and reads call sites with small anchors.
 *
 * Every rule runs against the real tree first, then proves it catches a deliberate mutation (source edited in memory,
 * or a mutated module copy in a temp dir). The working tree is never modified.
 * Run: node scripts/verify-funnel.mjs
 */

import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { register } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"
import vm from "node:vm"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
register(pathToFileURL(path.join(root, "scripts/resolve-ts-alias.mjs")).href)

let passed = 0
function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`)
  passed++
}

/* ---------------------------------------------------------------- sources and modules */

const TAXONOMY = "lib/funnel-taxonomy.ts"
const ANALYTICS = "lib/analytics.ts"
const BOOKING_FLOW = "components/booking-flow.tsx"
const REPORT_FORM = "components/report-form.tsx"
const REPORT_POPUP = "components/report-popup.tsx"
const GOOGLE_TAG = "lib/google-tag.ts"
const LAYOUT = "app/layout.tsx"

function walk(dir) {
  const full = path.join(root, dir)
  if (!existsSync(full)) return []
  return readdirSync(full).flatMap((name) => {
    if (name === "node_modules" || name.startsWith(".")) return []
    const child = path.join(dir, name)
    return statSync(path.join(root, child)).isDirectory() ? walk(child) : [child]
  })
}

const realFiles = new Map(
  ["app", "components", "lib", "hooks"]
    .flatMap(walk)
    .map((file) => file.split(path.sep).join("/"))
    .filter((file) => /\.(tsx?|mjs)$/.test(file))
    .map((file) => [file, readFileSync(path.join(root, file), "utf8")])
)

const tmpDirs = []
/** Imports the taxonomy and analytics modules, optionally with one of them rewritten, from a private temp copy. */
async function loadModules(mutation) {
  const dir = mkdtempSync(path.join(os.tmpdir(), "verify-funnel-"))
  tmpDirs.push(dir)
  for (const file of [TAXONOMY, ANALYTICS, GOOGLE_TAG]) {
    let src = realFiles.get(file)
    if (mutation?.module === file) {
      assert(src.includes(mutation.from), `mutation anchor still exists in ${file}: ${mutation.from.slice(0, 60)}`)
      src = src.replace(mutation.from, mutation.to)
    }
    writeFileSync(path.join(dir, path.basename(file)), src)
  }
  const taxonomy = await import(pathToFileURL(path.join(dir, "funnel-taxonomy.ts")).href)
  const analytics = await import(pathToFileURL(path.join(dir, "analytics.ts")).href)
  const googleTag = await import(pathToFileURL(path.join(dir, "google-tag.ts")).href)
  return { taxonomy, analytics, googleTag }
}

/** Runs the layout's inline Google tag bootstrap in a sandbox for one hostname; returns what it loaded and queued. */
function runGoogleTagBootstrap(source, hostname) {
  const appended = []
  const sandbox = {
    location: { hostname },
    document: { createElement: () => ({}), head: { appendChild: (node) => appended.push(node) } },
  }
  sandbox.window = sandbox
  vm.runInNewContext(source, sandbox)
  const commands = (sandbox.dataLayer ?? []).map((args) => Array.from(args).map((v) => (Object.prototype.toString.call(v) === "[object Date]" ? "DATE" : v)))
  return { appended, commands, gtag: sandbox.gtag, dataLayer: sandbox.dataLayer }
}

/** A fresh mocked browser: gtag records calls; console.debug is silenced. */
function installWindow(hostname, pathname = "/") {
  const calls = []
  globalThis.window = { location: { hostname, pathname }, gtag: (...args) => calls.push(args) }
  return calls
}
const events = (calls, name) => calls.filter((c) => c[0] === "event" && (!name || c[1] === name))

/* ---------------------------------------------------------------- small source helpers */

const blankStrings = (src) => src.replace(/(["'`])(?:\\.|(?!\1)[^\\\n])*\1/g, (m) => m[0] + " ".repeat(m.length - 2) + m[0])
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\w\\])\/\/.*$/gm, "$1")

/** Text between the parentheses of each `name(` call. */
function callArgs(src, name) {
  const out = []
  const re = new RegExp(`(?<![\\w.])${name}\\s*\\(`, "g")
  const masked = blankStrings(src)
  for (const m of masked.matchAll(re)) {
    let depth = 1
    let i = m.index + m[0].length
    const start = i
    for (; i < masked.length && depth > 0; i++) {
      if ("([{".includes(masked[i])) depth++
      else if (")]}".includes(masked[i])) depth--
    }
    out.push({ index: m.index, text: src.slice(start, i - 1) })
  }
  return out
}

function splitTopLevel(text) {
  const parts = []
  const masked = blankStrings(text)
  let depth = 0
  let start = 0
  for (let i = 0; i < masked.length; i++) {
    if ("([{".includes(masked[i])) depth++
    else if (")]}".includes(masked[i])) depth--
    else if (masked[i] === "," && depth === 0) {
      parts.push(text.slice(start, i).trim())
      start = i + 1
    }
  }
  if (text.slice(start).trim()) parts.push(text.slice(start).trim())
  return parts
}

/** Keys of every top-level object literal in an argument (handles `a ? { x } : { y }`). */
function objectKeys(arg) {
  const keys = []
  const masked = blankStrings(arg)
  let depth = 0
  let open = -1
  for (let i = 0; i < masked.length; i++) {
    if (masked[i] === "{") {
      if (depth === 0) open = i
      depth++
    } else if (masked[i] === "}") {
      depth--
      if (depth === 0 && open >= 0) {
        for (const part of splitTopLevel(arg.slice(open + 1, i))) {
          const key = part.match(/^([A-Za-z_$][\w$]*)\s*(:|$)/)
          keys.push(key ? key[1] : `<${part.slice(0, 20)}>`)
        }
      }
    }
  }
  return keys
}

/** Literal keys given to a params variable in the same file: `const params ... = { ... }` and `params.key =`. */
function variableKeys(src, name) {
  const decl = src.match(new RegExp(`(?:const|let)\\s+${name}\\b[^=]*=\\s*(\\{[^;\\n]*\\})`))
  const assigned = [...src.matchAll(new RegExp(`\\b${name}\\.([A-Za-z_]\\w*)\\s*=`, "g"))].map((m) => m[1])
  return decl ? [...objectKeys(decl[1]), ...assigned] : null
}

const PII_IDENTIFIERS = /\b(email|phone|firstName|lastName|name|website|businessName|business|socials|note|answers|value|attribution|manageToken|manageUrl|meetUrl)\b/

/* ---------------------------------------------------------------- rules */

const REQUIRED_EVENTS = [
  "primary_cta_view",
  "primary_cta_click",
  "report_view",
  "report_progress",
  "report_validation_error",
  "booking_start",
  "booking_progress",
  "booking_error",
]

const RULES = [
  {
    id: "taxonomy-covers-funnel",
    rule: "Every V2A funnel question has an event, step or reason in the taxonomy; every event carries page_path",
    run: ({ taxonomy }) => {
      const out = []
      for (const name of REQUIRED_EVENTS) if (!taxonomy.isFunnelEvent(name)) out.push(`missing event ${name}`)
      for (const [name, params] of Object.entries(taxonomy.FUNNEL_EVENTS)) if (!("page_path" in params)) out.push(`${name} has no page_path`)
      for (const step of ["started", "details_shown", "required_complete", "submit_attempt"]) {
        if (!taxonomy.REPORT_STEPS.includes(step)) out.push(`report step ${step} missing`)
      }
      for (const step of ["owner", "business", "stage", "schedule", "details"]) if (!taxonomy.BOOKING_STEPS.includes(step)) out.push(`booking step ${step} missing`)
      for (const reason of ["validation", "slot_taken", "backend", "network", "availability", "no_slots"]) {
        if (!taxonomy.BOOKING_ERRORS.includes(reason)) out.push(`booking error ${reason} missing`)
      }
      for (const legacy of ["generate_lead", "report_submission_success", "meeting_booked", "conversion", "form_start"]) {
        if (taxonomy.isFunnelEvent(legacy)) out.push(`existing event ${legacy} must keep its own helper, not the funnel taxonomy`)
      }
      return out
    },
    mutations: [{ module: TAXONOMY, from: "report_validation_error: {", to: "report_validation_errors: {" }],
  },
  {
    id: "sanitizer-strips-pii",
    rule: "Only allowed parameters with allowed values pass: no email, phone, name, company, website, free text, query strings or ids",
    run: ({ taxonomy }) => {
      const out = []
      const clean = (event, params) => taxonomy.sanitizeFunnelParams(event, params)
      const pii = {
        email: "ada@example.com",
        phone: "5550100123",
        name: "Ada Lovelace",
        first_name: "Ada",
        company: "Zephyr Quill",
        business_name: "Zephyr Quill",
        website: "https://zephyrquill.test",
        note: "call me",
        signup_id: "3f2a",
        lead_id: "9",
        booking_id: "b1",
        gclid: "abc",
      }
      for (const event of Object.keys(taxonomy.FUNNEL_EVENTS)) {
        const got = clean(event, pii)
        if (got === null || Object.keys(got).length > 0) out.push(`${event} kept ${JSON.stringify(got)}`)
      }
      const bad = [
        ["primary_cta_click", { cta_id: "Get my free report" }],
        ["primary_cta_click", { cta_id: "home_hero_booking" }],
        ["primary_cta_click", { destination: "ada@example.com" }],
        ["primary_cta_view", { page_path: "/report?email=ada@example.com" }],
        ["primary_cta_view", { page_path: "https://www.terramore.io/report" }],
        ["primary_cta_view", { page_path: "/book/manage/5550100123" }],
        ["report_validation_error", { fields: "email=ada@example.com" }],
        ["report_validation_error", { fields: "email,phone" }],
        ["report_progress", { step: "typed Ada" }],
        ["booking_progress", { step_index: 12 }],
        ["booking_progress", { step_index: "2" }],
        ["booking_error", { reason: "Zephyr Quill is down" }],
        ["booking_start", { source: "Ada's shop" }],
      ]
      for (const [event, params] of bad) {
        const got = clean(event, params)
        if (!got || Object.keys(got).length > 0) out.push(`${event} kept ${JSON.stringify(params)} -> ${JSON.stringify(got)}`)
      }
      if (clean("free_text_event", { cta_id: "home_hero_book" }) !== null) out.push("unknown event not dropped")
      const good = clean("booking_error", { reason: "validation", fields: "email_format,name", step: "details", source: "/pricing", entry: "popup", page_path: "/pricing" })
      if (Object.keys(good ?? {}).length !== 6) out.push(`valid booking_error params dropped: ${JSON.stringify(good)}`)
      const cta = clean("primary_cta_click", { cta_id: "home_hero_report", destination: "report", placement: "hero", page_path: "/" })
      if (Object.keys(cta ?? {}).length !== 4) out.push(`valid primary_cta_click params dropped: ${JSON.stringify(cta)}`)
      return out
    },
    mutations: [{ module: TAXONOMY, from: "if (!validator || !VALIDATORS[validator](value)) continue", to: "if (!validator) continue" }],
  },
  {
    id: "preview-cannot-send",
    rule: "Funnel events reach gtag only on www.terramore.io / terramore.io; previews, localhost and look-alikes log locally",
    run: ({ taxonomy, analytics }) => {
      const out = []
      for (const host of ["www.terramore.io", "terramore.io", "WWW.TERRAMORE.IO"]) if (taxonomy.funnelSendMode(host) !== "send") out.push(`${host} should send`)
      for (const host of [
        "localhost",
        "127.0.0.1",
        "terramore-website-final-70p50bkwt-terramore-io.vercel.app",
        "terramore-website-final.vercel.app",
        "www.terramore.io.evil.test",
        "staging.terramore.io",
        "",
        undefined,
        null,
      ]) {
        if (taxonomy.funnelSendMode(host) !== "debug") out.push(`${String(host)} must not send`)
      }
      const debug = console.debug
      console.debug = () => {}
      try {
        let calls = installWindow("terramore-website-final-abc-terramore-io.vercel.app", "/report")
        analytics.trackFunnelEvent("report_view", { entry: "popup_direct" })
        if (events(calls).length !== 0) out.push("preview host called gtag")
        const logged = globalThis.window.__tmFunnelDebug ?? []
        if (logged.length !== 1 || logged[0].event !== "report_view" || logged[0].params.page_path !== "/report") out.push(`preview debug log: ${JSON.stringify(logged)}`)
        calls = installWindow("localhost", "/")
        analytics.trackCtaClick("home_hero_report")
        if (events(calls).length !== 0) out.push("localhost called gtag")
        calls = installWindow("www.terramore.io", "/")
        analytics.trackCtaClick("home_hero_report")
        const sent = events(calls, "primary_cta_click")
        if (sent.length !== 1 || JSON.stringify(sent[0][2]) !== JSON.stringify({ page_path: "/", cta_id: "home_hero_report", destination: "report", placement: "hero" })) {
          out.push(`production send: ${JSON.stringify(sent)}`)
        }
        if (globalThis.window.__tmFunnelDebug) out.push("production host wrote the debug log")
      } finally {
        console.debug = debug
      }
      return out
    },
    mutations: [
      { module: TAXONOMY, from: '? "send" : "debug"', to: '? "send" : "send"' },
      { module: ANALYTICS, from: 'if (funnelSendMode(window.location.hostname) === "send") gtag', to: 'if (funnelSendMode(window.location.hostname) !== "never") gtag' },
    ],
  },
  {
    id: "google-tag-production-only",
    rule: "The Google tag loads and configures GA4 + Ads only on www.terramore.io / terramore.io, with the original loader URL and command order; other hosts load nothing",
    run: ({ googleTag, files }) => {
      const out = []
      const source = googleTag.googleTagBootstrap("GT-5TGBVFTR", ["G-ZC5DY0ES7N", "G-BQN6VCY579", "AW-11353847408"])
      const expected = JSON.stringify([["js", "DATE"], ["config", "G-ZC5DY0ES7N"], ["config", "G-BQN6VCY579"], ["config", "AW-11353847408"]])
      for (const host of ["www.terramore.io", "terramore.io", "WWW.TERRAMORE.IO"]) {
        const run = runGoogleTagBootstrap(source, host)
        if (run.appended.length !== 1 || run.appended[0].src !== "https://www.googletagmanager.com/gtag/js?id=GT-5TGBVFTR" || run.appended[0].async !== true) {
          out.push(`${host}: gtag.js not loaded exactly as before (${JSON.stringify(run.appended)})`)
        }
        if (JSON.stringify(run.commands) !== expected) out.push(`${host}: commands differ from the original bootstrap: ${JSON.stringify(run.commands)}`)
      }
      for (const host of ["localhost", "127.0.0.1", "terramore-website-final-f7qd77ffb-terramore-io.vercel.app", "www.terramore.io.evil.test", "staging.terramore.io", ""]) {
        const run = runGoogleTagBootstrap(source, host)
        if (run.appended.length !== 0) out.push(`${host || "(empty)"} loaded gtag.js`)
        if (run.commands.length !== 0) out.push(`${host || "(empty)"} queued ${JSON.stringify(run.commands)}`)
        if (typeof run.gtag !== "function") out.push(`${host || "(empty)"}: gtag() must still exist for the helpers`)
        else {
          run.gtag("event", "probe")
          if (run.dataLayer.length !== 1) out.push(`${host || "(empty)"}: gtag() no longer queues to dataLayer`)
        }
      }
      const layout = files.get(LAYOUT) ?? ""
      if (!layout.includes("__html: googleTagBootstrap(GOOGLE_TAG_ID, [GA4_MEASUREMENT_ID, GA4_MEASUREMENT_ID_LEGACY, googleAdsId])")) out.push(`${LAYOUT} no longer uses googleTagBootstrap`)
      for (const [file, src] of files) {
        if (file !== GOOGLE_TAG && /googletagmanager\.com\/gtag\/js|gtag\(\s*['"]config['"]/.test(stripComments(src))) out.push(`${file} loads or configures the Google tag outside ${GOOGLE_TAG}`)
      }
      return out
    },
    mutations: [
      { module: GOOGLE_TAG, from: ".indexOf(location.hostname.toLowerCase()) !== -1", to: ".indexOf(location.hostname.toLowerCase()) !== -2" },
      { file: LAYOUT, from: "<head>", to: '<head>\n        <script async src="https://www.googletagmanager.com/gtag/js?id=GT-5TGBVFTR"></script>' },
    ],
  },
  {
    id: "call-sites-controlled",
    rule: "Every trackFunnelEvent call names a taxonomy event, passes only its allowed keys and no form or contact values; nothing bypasses it",
    run: ({ taxonomy, files }) => {
      const out = []
      let count = 0
      for (const [file, raw] of files) {
        if (file === ANALYTICS || file === TAXONOMY) continue
        const src = stripComments(raw)
        for (const call of callArgs(src, "trackFunnelEvent")) {
          count++
          const [eventArg, paramsArg = ""] = splitTopLevel(call.text)
          const line = src.slice(0, call.index).split("\n").length
          const event = eventArg?.match(/^["']([\w]+)["']$/)?.[1]
          if (!event || !taxonomy.isFunnelEvent(event)) {
            out.push(`${file}:${line} event ${eventArg} is not a taxonomy literal`)
            continue
          }
          const keys = /^[A-Za-z_]\w*$/.test(paramsArg) ? variableKeys(src, paramsArg) : objectKeys(paramsArg)
          if (!keys) out.push(`${file}:${line} params ${paramsArg} cannot be read`)
          for (const key of keys ?? []) if (!(key in taxonomy.FUNNEL_EVENTS[event])) out.push(`${file}:${line} ${event} passes "${key}"`)
          const valueText = blankStrings(paramsArg).replace(/\b(\w+)\s*:/g, " ")
          const pii = valueText.match(PII_IDENTIFIERS)
          if (pii) out.push(`${file}:${line} ${event} passes a value from "${pii[1]}"`)
        }
        for (const m of src.matchAll(/gtag\(\s*["']event["']\s*,\s*["'](primary_cta_\w+|report_view|report_progress|report_validation_error|booking_\w+)["']/g)) {
          out.push(`${file} sends ${m[1]} with gtag directly, bypassing the gate`)
        }
      }
      if (count < 12) out.push(`only ${count} trackFunnelEvent call sites found; the funnel instrumentation is missing`)
      return out
    },
    mutations: [{ file: REPORT_FORM, from: '{ step: "submit_attempt", entry }', to: '{ step: "submit_attempt", entry, email }' }],
  },
  {
    id: "cta-vocabulary",
    rule: "CTA ids in code are approved (lib/funnel-taxonomy.ts CTA_IDS), follow <surface>_<placement>_<report|book>, and every approved id is used",
    run: ({ taxonomy, files }) => {
      const out = []
      const used = new Set()
      const patterns = [/ctaId=\{?["']([^"']+)["']/g, /useCtaView(?:<[^>]*>)?\(\s*["']([^"']+)["']/g, /trackCtaClick\(\s*["']([^"']+)["']/g, /openForm\(\s*["']([^"']+)["']/g]
      for (const [file, raw] of files) {
        const src = stripComments(raw)
        for (const pattern of patterns) {
          for (const m of src.matchAll(pattern)) {
            used.add(m[1])
            if (!taxonomy.isCtaId(m[1])) out.push(`${file}: "${m[1]}" is not an approved CTA id`)
          }
        }
      }
      for (const [id, spec] of Object.entries(taxonomy.CTA_IDS)) {
        if (!/^[a-z]+(_[a-z]+)*_(report|book)$/.test(id)) out.push(`${id} does not follow <surface>_<placement>_<report|book>`)
        if ((id.endsWith("_report") ? "report" : "booking") !== spec.destination) out.push(`${id} destination ${spec.destination} contradicts its name`)
        if (!used.has(id)) out.push(`${id} is approved but used nowhere`)
      }
      return out
    },
    mutations: [{ file: "app/page.tsx", from: 'ctaId="home_hero_book"', to: 'ctaId="home_hero_booking"' }],
  },
  {
    id: "meeting-booked-success-only",
    rule: "meeting_booked fires only after the 409 and !ok/missing-id guards return, before setDone, outside catch; nowhere else",
    run: ({ files }) => {
      const out = []
      for (const [file, raw] of files) {
        if (file === ANALYTICS) continue
        const src = stripComments(raw)
        if (file !== BOOKING_FLOW && callArgs(src, "trackMeetingBooked").length) out.push(`${file} calls trackMeetingBooked`)
        if (/["']meeting_booked["']/.test(src)) out.push(`${file} names meeting_booked directly`)
      }
      const src = stripComments(files.get(BOOKING_FLOW) ?? "")
      const calls = callArgs(src, "trackMeetingBooked")
      if (calls.length !== 1) return [...out, `${BOOKING_FLOW} has ${calls.length} trackMeetingBooked calls (expected 1)`]
      const at = calls[0].index
      const guard = src.lastIndexOf("if (!response.ok || !bookingId || !data.startIso || !data.manageUrl) {", at)
      const conflict = src.lastIndexOf("if (response.status === 409) {", at)
      const blockReturns = (from) => {
        const end = src.indexOf("\n      }", from)
        return end > from && end < at && /\breturn\b/.test(src.slice(from, end))
      }
      if (guard < 0 || !blockReturns(guard)) out.push("trackMeetingBooked is not behind the ok + id + startIso + manageUrl guard that returns")
      if (conflict < 0 || conflict > guard || !blockReturns(conflict)) out.push("trackMeetingBooked is not behind the 409 guard that returns")
      const tryAt = src.lastIndexOf("try {", at)
      if (tryAt < 0 || /\}\s*catch\b/.test(src.slice(tryAt, at))) out.push("trackMeetingBooked sits in or after a catch block")
      const setDone = src.indexOf("setDone(", at)
      const catchAt = src.indexOf("} catch", at)
      if (setDone < 0 || catchAt < 0 || setDone > catchAt) out.push("trackMeetingBooked is not followed by setDone inside the try")
      if (!/bookingId\s*=\s*typeof data\.id === "string" \? data\.id\.trim\(\) : ""/.test(src)) out.push("booking id is no longer the trimmed server id")
      return out
    },
    mutations: [
      { file: BOOKING_FLOW, from: "if (!response.ok || !bookingId || !data.startIso || !data.manageUrl) {", to: "if (!response.ok && !bookingId) {" },
      { file: "components/booking-popup.tsx", from: 'import { trackCtaClick } from "@/lib/analytics"', to: 'import { trackCtaClick } from "@/lib/analytics"\nconst x = () => trackMeetingBooked({ booking_id: "x" })' },
    ],
  },
  {
    id: "report-no-raw-values",
    rule: "Report and booking progression send field identifiers only: data-field values are approved literals and no input handler sends events",
    run: ({ taxonomy, files }) => {
      const out = []
      const allowed = new Map([
        [REPORT_FORM, taxonomy.REPORT_FIELDS],
        [BOOKING_FLOW, taxonomy.BOOKING_FIELDS],
      ])
      for (const [file, fields] of allowed) {
        const src = stripComments(files.get(file) ?? "")
        const found = [...src.matchAll(/data-field=(\{[^}]*\}|"[^"]*"|'[^']*')/g)].map((m) => m[1])
        if (found.length === 0) out.push(`${file} has no data-field identifiers`)
        for (const value of found) {
          const literal = value.match(/^["']([\w]+)["']$/)?.[1]
          if (!literal || !fields.includes(literal)) out.push(`${file} data-field=${value} is not an approved field identifier`)
        }
      }
      for (const file of [REPORT_FORM, REPORT_POPUP, BOOKING_FLOW]) {
        const src = stripComments(files.get(file) ?? "")
        for (const m of src.matchAll(/on(Change|Input|KeyDown|KeyUp|KeyPress|Blur)=\{([^}]*)\}/g)) {
          if (/track\w*\(/.test(m[2])) out.push(`${file} tracks on${m[1]} (keystroke-level tracking)`)
        }
      }
      return out
    },
    mutations: [{ file: REPORT_FORM, from: 'data-field="first_name"', to: "data-field={firstName}" }],
  },
  {
    id: "dedupe-guards",
    rule: "CTA views fire once per CTA per page view at >=50% for >=1 s; once-keys dedupe; progress and start guards stay in place",
    run: ({ taxonomy, analytics, files }) => {
      const out = []
      if (!(taxonomy.CTA_VIEW_THRESHOLD >= 0.5)) out.push(`view threshold ${taxonomy.CTA_VIEW_THRESHOLD} < 0.5`)
      if (!(taxonomy.CTA_VIEW_MIN_MS >= 1000)) out.push(`view duration ${taxonomy.CTA_VIEW_MIN_MS} < 1000 ms`)
      const calls = installWindow("www.terramore.io", "/")
      analytics.beginFunnelPageView()
      analytics.trackCtaView("home_hero_book")
      analytics.trackCtaView("home_hero_book")
      if (events(calls, "primary_cta_view").length !== 1) out.push(`same page view: ${events(calls, "primary_cta_view").length} views`)
      analytics.beginFunnelPageView()
      analytics.trackCtaView("home_hero_book")
      if (events(calls, "primary_cta_view").length !== 2) out.push("a new page view did not allow a new view")
      if (analytics.trackCtaView("header_book") || events(calls, "primary_cta_view").length !== 2) out.push("always-visible header CTA sent a view")
      const once = `mount-${Math.random()}`
      analytics.trackFunnelEvent("booking_start", { source: "book", entry: "inline", flow: "qualify" }, { once })
      analytics.trackFunnelEvent("booking_start", { source: "book", entry: "inline", flow: "qualify" }, { once })
      if (events(calls, "booking_start").length !== 1) out.push("once-key did not dedupe")
      const anchors = [
        ["hooks/use-cta-view.ts", /trackCtaView\(ctaId\)\s*\n\s*observer\.disconnect\(\)/, "view observer disconnects after its view"],
        ["hooks/use-cta-view.ts", /CTA_VIEW_MIN_MS/, "view waits CTA_VIEW_MIN_MS"],
        ["hooks/use-cta-view.ts", /visibilityState/, "view requires a visible tab"],
        ["components/google-analytics.tsx", /beginFunnelPageView\(\)/, "route changes start a new funnel page view"],
        [BOOKING_FLOW, /if \(!measured \|\| startedRef\.current\) return/, "booking_start once per flow"],
        [BOOKING_FLOW, /reachedRef\.current\.has\(step\)/, "booking_progress once per step"],
        [BOOKING_FLOW, /reportedRef\.current\.has\(calendarProblem\)/, "calendar errors once per problem"],
        [REPORT_POPUP, /detailsShownRef\.current/, "details_shown once per open"],
        [REPORT_FORM, /requiredCompleteRef\.current/, "required_complete once per form"],
      ]
      for (const [file, pattern, what] of anchors) if (!pattern.test(files.get(file) ?? "")) out.push(`${file}: ${what} (guard missing)`)
      return out
    },
    mutations: [
      { module: ANALYTICS, from: "{ once: `${funnelPageView}:${ctaId}` },", to: "undefined," },
      { file: BOOKING_FLOW, from: "if (!measured || startedRef.current) return", to: "if (!measured) return" },
    ],
  },
  {
    id: "existing-events-intact",
    rule: "Existing conversion events keep their names, parameters and server-confirmed firing points",
    run: ({ files }) => {
      const out = []
      const analytics = files.get(ANALYTICS) ?? ""
      for (const literal of ['"generate_lead"', '"report_submission_success"', '"meeting_booked"', '"conversion"', '"report_submission_error"', 'form_id: "digital_footprint_report"']) {
        if (!analytics.includes(literal)) out.push(`${ANALYTICS} lost ${literal}`)
      }
      const form = stripComments(files.get(REPORT_FORM) ?? "")
      const success = form.indexOf('if (reportRef) trackReportSubmissionSuccess("report_form", reportRef)')
      const notOk = form.lastIndexOf("if (!response.ok) {", success)
      const conflict = form.lastIndexOf("if (response.status === 409) {", success)
      const saved = form.lastIndexOf("data.saved === true && typeof data.reportRef === \"string\"", success)
      if (success < 0 || notOk < 0 || conflict < 0 || conflict > notOk) out.push("report success no longer follows the 409 and !ok guards")
      if (saved < notOk) out.push("report success no longer requires the server's saved + reportRef confirmation")
      if (!form.includes('trackEvent("form_start", { form_id: "digital_footprint_report" })')) out.push("form_start changed")
      const landing = files.get("components/digital-footprint-landing.tsx") ?? ""
      for (const literal of ['gtag("event", "report_cta_click", { cta_id: "report_primary" })', 'gtag("event", "cta_click", { cta_id: "report_primary" })', 'cta_id: "report_closing_talk"']) {
        if (!landing.includes(literal)) out.push(`/report landing lost ${literal}`)
      }
      if (!(files.get("components/example-report-shell.tsx") ?? "").includes('cta_id: "report_sent_talk"')) out.push("report_sent_talk select_content changed")
      return out
    },
    mutations: [
      { file: ANALYTICS, from: '"report_submission_success",', to: '"report_success",' },
      { file: REPORT_FORM, from: 'data.saved === true && typeof data.reportRef === "string"', to: 'typeof data.reportRef === "string"' },
    ],
  },
]

/* ---------------------------------------------------------------- real tree */

const realModules = await loadModules()
assert(RULES.length === new Set(RULES.map((rule) => rule.id)).size, "rule ids are unique")
const failures = []
for (const rule of RULES) {
  const problems = rule.run({ ...realModules, files: realFiles })
  if (problems.length) failures.push(`${rule.id} (${rule.rule})\n    ${problems.join("\n    ")}`)
  else passed++
}
if (failures.length) for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true })
assert(failures.length === 0, `Funnel measurement violations:\n  ${failures.join("\n  ")}`)

/* ---------------------------------------------------------------- self-test: every rule catches its mutations */

let mutationsCaught = 0
for (const rule of RULES) {
  assert(rule.mutations.length > 0, `${rule.id} has at least one mutation test`)
  for (const mutation of rule.mutations) {
    let files = realFiles
    if (mutation.file) {
      const src = realFiles.get(mutation.file)
      assert(src?.includes(mutation.from), `${rule.id}: mutation anchor exists in ${mutation.file} (${mutation.from.slice(0, 50)})`)
      files = new Map(realFiles).set(mutation.file, src.replace(mutation.from, mutation.to))
    }
    const modules = mutation.module ? await loadModules(mutation) : realModules
    const problems = rule.run({ ...modules, files })
    assert(problems.length > 0, `${rule.id}: catches mutation in ${mutation.file ?? mutation.module} (${mutation.from.slice(0, 50)})`)
    mutationsCaught++
  }
}

for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true })

const conversion = spawnSync(process.execPath, [path.join(root, "scripts/verify-conversion-tracking.mjs")], { cwd: root, encoding: "utf8" })
assert(conversion.status === 0, `verify-conversion-tracking failed:\n${conversion.stdout}${conversion.stderr}`)

console.log(`funnel: ok (${passed} checks, ${RULES.length} rules, ${mutationsCaught} mutations caught; verify-conversion-tracking passes)`)
