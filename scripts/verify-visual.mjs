/**
 * Visual Doctrine guardrails for terramore.io: the objective subset of the dashboard repo's
 * docs/visual/VERIFY_VISUAL_PLAN.md (V-02, V-03, V-10, V-11, V-14, V-15, V-19, V-20) plus the Visual V1 honesty rules
 * and the 2026-09-29 identity release constraints (hero integration marks, Slack example; VD-018, VD-014).
 * Static source checks only. No network, no browser, no dependencies. Nothing here judges whether a page looks good.
 *
 * Every check first proves it fails on a deliberately broken inline sample and passes the approved pattern, then scans
 * the codebase. Known open findings are allowlisted with an exact count tied to an audit id (MV-, MC-): one more is a new
 * violation, one fewer means the finding was fixed and the count must be lowered.
 * Run: node scripts/verify-visual.mjs
 * Scan another checkout (e.g. a pre-fix worktree): VERIFY_VISUAL_ROOT=/path/to/checkout node scripts/verify-visual.mjs
 */

import path from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"

const root = process.env.VERIFY_VISUAL_ROOT
  ? path.resolve(process.env.VERIFY_VISUAL_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

let passed = 0
function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`)
  passed++
}

/* ---------------------------------------------------------------- scope */

const isCode = (file) => /^(app|components|lib|hooks)\//.test(file) && /\.(tsx?|mjs)$/.test(file)
const isPublicAsset = (file) => file.startsWith("public/")
const isCss = (file) => /\.css$/.test(file)

/** Legal-policy pages. Their CCPA wording is legal text, tracked in COMPLIANCE_REVIEW_BACKLOG.md, not marketing copy. */
const LEGAL_PAGES = new Set(["app/privacy/page.tsx", "app/terms/page.tsx", "app/disclosure/page.tsx", "app/dmca/page.tsx"])
const isMarketingCopy = (file) => isCode(file) && !LEGAL_PAGES.has(file)

/** Founder assets of the real founder. Everyone else pictured on the site would be fictional (VR-29, VR-30). */
const REAL_PEOPLE_ASSETS = new Set(["public/founder/adam-moreno-headshot.png", "public/founder/adam-moreno-cartoon.png"])

/** Simulations that must identify themselves inside the component (VR-29, VD Visual V1). */
const SIMULATIONS = [
  "components/hero-analytics.tsx",
  "components/book-visuals.tsx",
  "components/industries/construction-problem-phone.tsx",
  "components/industries/construction-solution-phone.tsx",
  "components/marketing-visuals.tsx",
]

/** Reviewed motion that runs once and ends within 5 s, so VR-47 needs no control. */
const FINITE_MOTION = new Map([
  ["components/hero-analytics.tsx", "typing dots show for 600 ms per message; each channel plays once in 4.3 s"],
])

/** Hero integration marks: desktop orbit and phone field (release constraint, VD-018). */
const HERO_LOGO_FILES = ["components/hero-logo-mobius.tsx", "components/hero-floating-logos.tsx"]
/** Chip opacity reviewed for V1, per surface. Fading the marks further greys the field out. */
const HERO_LOGO_MIN_OPACITY = new Map([
  ["app/globals.css", 0.5],
  ["components/hero-logo-mobius.tsx", 0.5],
  ["components/hero-floating-logos.tsx", 0.28],
])
/** The official brand mark for an INTEGRATION_LOGOS slug. cdn.simpleicons.org serves it in the brand color. */
const BRAND_MARK_SRC = /^https:\/\/(cdn\.jsdelivr\.net\/npm\/simple-icons@v\d+\/icons\/|cdn\.simpleicons\.org\/)\$\{(logo|mark)\.slug\}/
/** The Slack-style example on the home page (release constraint, VD-014). */
const SLACK_EXAMPLE = "components/hero-analytics.tsx"

/* ---------------------------------------------------------------- source helpers */

const blank = (text) => text.replace(/[^\n]/g, "")
const stripComments = (src) =>
  src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:"'`\w\\])\/\/.*$/gm, "$1")
/** Quoted strings emptied, so what is left of the text outside tags is JSX text. */
const stripStrings = (src) => src.replace(/(["'`])(?:\\.|(?!\1)[^\\\n])*\1/g, (m) => m[0] + blank(m.slice(1, -1)) + m[0])
const lineOf = (src, index) => src.slice(0, index).split("\n").length

function matches(src, pattern, detail) {
  const out = []
  for (const m of src.matchAll(pattern)) out.push({ line: lineOf(src, m.index), detail: detail(m) })
  return out
}

/** CSS classes whose animation repeats forever, and classes neutralized inside a reduced-motion block. */
function cssMotion(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "")
  const infinite = new Set()
  const reduced = new Set()
  const rule = /([^{}@]+)\{([^{}]*)\}/g
  for (const m of css.matchAll(rule)) {
    if (/animation(-iteration-count)?\s*:[^;]*\binfinite\b/.test(m[2])) {
      for (const cls of m[1].matchAll(/\.([\w-]+)/g)) infinite.add(cls[1])
    }
  }
  const media = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/g
  for (const m of css.matchAll(media)) {
    let depth = 1
    let i = m.index + m[0].length
    const start = i
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === "{") depth++
      else if (css[i] === "}") depth--
    }
    for (const r of css.slice(start, i - 1).matchAll(rule)) {
      if (/animation\s*:\s*none|display\s*:\s*none/.test(r[2])) {
        for (const cls of r[1].matchAll(/\.([\w-]+)/g)) reduced.add(cls[1])
      }
    }
  }
  return { infinite, reduced }
}

const DESATURATE = /grayscale|saturate\(\s*(0|0?\.\d+|\d{1,2}%)\s*\)|brightness\(\s*0(\.0+)?\s*\)|contrast\(\s*0(\.0+)?\s*\)|invert|sepia|hue-rotate/

/** CSS rules that reach the hero marks (their classes, or any bare img/svg selector) and grey, tint or fade them. */
function heroLogoCss(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, blank)
  const floor = HERO_LOGO_MIN_OPACITY.get("app/globals.css")
  const out = []
  for (const m of css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim()
    const hero = /\.hero-(mobius-logo|mobius-track|logo-mask|logo-topfade)\b/.test(selector)
    const bare = selector.split(",").some((part) => /(^|[\s>+~])(img|svg)$/.test(part.trim()))
    if (!hero && !bare) continue
    const say = (detail) => out.push({ line: lineOf(css, m.index + m[1].length - m[1].trimStart().length), detail: `${selector}: ${detail}` })
    const decls = m[2]
    for (const f of decls.matchAll(/(?:^|[;\s])(?:-webkit-)?(?:backdrop-)?filter\s*:([^;]*)/g)) if (DESATURATE.test(f[1])) say(`filter ${f[1].trim()}`)
    if (/blend-mode\s*:/.test(decls)) say("blend mode")
    if (/(?:^|[;\s])fill\s*:/.test(decls)) say("fill recolor")
    // The two layer masks are alpha fades around the headline and header, not a recolor.
    if (/mask(-image)?\s*:/.test(decls) && !/^\.hero-logo-(mask|topfade)$/.test(selector)) say("mask on the marks")
    const opacity = decls.match(/(?:^|[;\s])opacity\s*:\s*([\d.]+)/)
    if (opacity && (/\b(img|svg)\b/.test(selector) || Number(opacity[1]) < floor)) say(`opacity ${opacity[1]}`)
  }
  return out
}

const usesClass = (src, cls) => new RegExp(`(^|[\\s"'\`{])${cls.replace(/[-]/g, "\\-")}(?=[\\s"'\`}])`).test(src)

/* ---------------------------------------------------------------- checks */

const CHECKS = [
  {
    id: "no-ip-geolocation",
    rule: "V-20: no IP or geolocation lookups to personalize or manufacture proof (MV-07)",
    scope: isCode,
    run: (file, src) =>
      matches(
        stripComments(src),
        /ipapi\.co|ip-api\.com|ipinfo\.io|ipgeolocation|geoip|freegeoip|navigator\.geolocation/gi,
        (m) => `"${m[0]}"`
      ),
    bad: `const r = await fetch("https://ipapi.co/json/")`,
    good: `const r = await fetch("/api/report")`,
  },
  {
    id: "no-fake-live-activity",
    rule: "VR-40: no fabricated real-time activity, inquiry notifications or visitor-city personalization (MV-07)",
    scope: isMarketingCopy,
    run: (file, src) =>
      matches(
        stripComments(src),
        /construction-inquiry-notifications|construction-locality|InquiryNotification|New Inquiry|just (booked|signed up|requested|bought)\b|\bspots? left\b|(someone|people|owners|customers)[\w\s]{0,24}\b(is|are) (looking|viewing|searching|booking)[^."'<]{0,30}right now/gi,
        (m) => `"${m[0]}"`
      ),
    bad: `<p>Someone nearby is looking right now.</p><Toast title="New Inquiry" />`,
    good: `<p>Homeowners nearby search for this.</p>`,
  },
  {
    id: "no-unsourced-rating",
    rule: "V-14 / VR-27: no rating, stars or review-site mark without a live, linked source (MV-02)",
    scope: isMarketingCopy,
    run: (file, src) =>
      matches(
        stripComments(src),
        /G2Rating|g2-rating|[★☆]|\brated\s+\d(\.\d)?\b|\b[0-5]\.\d\s*(\/|out of)\s*5\b|(["'>\s])G2(?=["'<\s])/g,
        (m) => `"${m[0].trim()}"`
      ),
    bad: `<G2Rating rating="4.5" /><span aria-label="G2 rating 4.5 out of 5">★★★★☆</span>`,
    good: `<p>Free 30-minute call.</p>`,
  },
  {
    id: "no-unsourced-counts",
    rule: "V-14 / VR-34: no unsourced customer counts or vague popularity proof (MC-01)",
    scope: isMarketingCopy,
    run: (file, src) =>
      matches(
        stripComments(src),
        /requested by thousands|\b(thousands|hundreds|millions) of (business|owners|customers|clients|companies|brands)|trusted by|\bmany businesses\b|\bgrowing fast\b/gi,
        (m) => `"${m[0]}"`
      ),
    bad: `<p>Requested by thousands of business owners</p>`,
    good: `<p>About a minute to request. In your inbox in minutes.</p>`,
  },
  {
    id: "no-compliance-marketing",
    rule: "V-14: no HIPAA, CCPA, SOC 2 or certification claims in marketing copy without substantiation (MC-02)",
    scope: isMarketingCopy,
    run: (file, src) =>
      matches(stripComments(src), /\bHIPAA\b|\bCCPA\b|\bSOC ?2\b|\bGDPR[- ]compliant\b|\bISO ?27001\b/g, (m) => `"${m[0]}"`),
    bad: `<LindyCard title="CCPA and HIPAA" body="We handle data to HIPAA standards." />`,
    good: `<LindyCard title="Private" body="We do not sell personal information." />`,
  },
  {
    id: "no-gradient-text",
    rule: "V-02 / VR-06: no gradient or clipped-background text (MV-03)",
    scope: (file) => isCode(file) || isCss(file),
    run: (file, src) =>
      matches(stripComments(src), /bg-clip-text|background-clip\s*:\s*text|(^|[\s"'`])text-gold(?=[\s"'`])/g, (m) => `"${m[0].trim()}"`),
    bad: `<span className="bg-gradient-to-r from-gold-from to-gold-to bg-clip-text text-transparent">more</span>`,
    good: `<span className="text-ink">more</span>`,
  },
  {
    id: "no-white-on-gold",
    rule: "V-03 / VR-07: white text on gold measures 1.8-3.0:1; gold fills carry ink text (MV-04)",
    scope: isCode,
    run: (file, src) => {
      const out = []
      for (const m of stripComments(src).matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
        const cls = m[1] ?? m[2]
        const gold = /(^|\s)(bg-gold-(from|to)|from-gold-(from|to)|from-\[var\(--gold-(from|to)\)\]|bg-\[#(f7b844|c68809)\]|bg-amber-[1-5]00)(\s|$)/.test(cls)
        if (gold && /(^|\s)text-white(\s|$)/.test(cls)) out.push({ line: lineOf(src, m.index), detail: "white text on a gold fill" })
      }
      return out
    },
    bad: `<a className="rounded-full bg-gradient-to-b from-[var(--gold-from)] to-[var(--gold-to)] text-white">Get report</a>`,
    good: `<a className="rounded-full bg-brand text-white">Get report</a><span className="bg-gold-from/20 text-ink">Now</span>`,
  },
  {
    id: "looping-motion-reduced",
    rule: "V-10 / VR-45: every infinite CSS animation used by a component stops under prefers-reduced-motion (MV-12)",
    scope: isCode,
    run: (file, src, { motion, reachable }) => {
      if (!reachable.has(file)) return []
      const out = []
      const code = stripComments(src)
      for (const cls of motion.infinite) {
        if (usesClass(code, cls) && !motion.reduced.has(cls)) out.push({ line: 1, detail: `.${cls} loops forever with no reduced-motion override` })
      }
      for (const m of code.matchAll(/(^|[\s"'`])(animate-(spin|pulse|ping|bounce))(?=[\s"'`])/g)) {
        out.push({ line: lineOf(code, m.index), detail: `${m[2]} runs forever; use motion-safe:${m[2]} or remove it` })
      }
      return out
    },
    bad: [
      ["app/globals.css", `.spin { animation: spin 1s linear infinite; }`],
      ["components/__fixture__.tsx", `<div className="spin" /><div className="animate-pulse" />`],
    ],
    good: [
      ["app/globals.css", `.spin { animation: spin 1s linear infinite; }\n@media (prefers-reduced-motion: reduce) { .spin { animation: none; } }`],
      ["components/__fixture__.tsx", `<div className="spin" /><div className="motion-safe:animate-pulse" />`],
    ],
  },
  {
    id: "autoplay-has-control",
    rule: "V-11 / VR-47: auto-advancing or looping motion has a visible Pause/Play control and a reduced-motion path (MV-06)",
    scope: isCode,
    run: (file, src, { motion, reachable }) => {
      if (!reachable.has(file) || FINITE_MOTION.has(file)) return []
      const code = stripComments(src)
      const reasons = []
      if (/\bsetInterval\s*\(/.test(code)) reasons.push("setInterval loop")
      if (/<video\b[^>]*\b(loop|autoPlay)\b/.test(code)) reasons.push("looping or autoplay video")
      for (const cls of motion.infinite) if (usesClass(code, cls)) reasons.push(`infinite .${cls}`)
      if (reasons.length === 0) return []
      const control = /<MotionToggle\b|aria-label=\{?[`"'](Pause|Play)\b/.test(code)
      const reduced = /usePrefersReducedMotion\(|prefers-reduced-motion/.test(code)
      if (control && reduced) return []
      return [{ line: 1, detail: `${reasons.join(", ")} without ${control ? "" : "a Pause/Play control"}${!control && !reduced ? " and " : ""}${reduced ? "" : "a reduced-motion path"}` }]
    },
    bad: `export function Loop() { useEffect(() => { const t = setInterval(tick, 3000); return () => clearInterval(t) }, []) }`,
    good: `const reduce = usePrefersReducedMotion(); useEffect(() => { const t = setInterval(tick, 3000) }, []); return <MotionToggle paused={p} onToggle={t} label="pages" />`,
  },
  {
    id: "simulation-labelled",
    rule: "V-15 / VR-29: example workflows and mock people say so inside the component (MV-01)",
    scope: (file) => SIMULATIONS.includes(file),
    run: (file, src) => (/Illustrative example|Example workflow/.test(stripComments(src)) ? [] : [{ line: 1, detail: "simulation without an in-component label" }]),
    bad: [["components/hero-analytics.tsx", `<div>#e-commerce · 14 members</div>`]],
    good: [["components/hero-analytics.tsx", `<p className="rounded-full bg-slate-100 text-slate-700">Illustrative example</p>`]],
  },
  {
    id: "no-fictional-people-assets",
    rule: "V-19 / VR-30: no shipped faces or names of people who do not exist (MV-01, MV-18)",
    scope: (file) => isPublicAsset(file) || isCode(file),
    run: (file, src) => {
      if (isPublicAsset(file)) {
        if (file.startsWith("public/reviews/")) return [{ line: 1, detail: "fictional reviewer asset" }]
        if (file.startsWith("public/founder/") && !REAL_PEOPLE_ASSETS.has(file)) return [{ line: 1, detail: "person asset that is not the founder" }]
        return []
      }
      return matches(stripComments(src), /\/(?:founder|reviews)\/(?!adam-moreno-(?:headshot|cartoon)\.png)[\w.-]+\.(?:png|jpe?g|webp)/g, (m) => `"${m[0]}"`)
    },
    bad: [
      ["public/reviews/review-maya.png", ""],
      ["components/__fixture__.tsx", `const NIA = { name: "Nia Brooks", photo: "/founder/nia-brooks-headshot.png" }`],
    ],
    good: [
      ["public/founder/adam-moreno-headshot.png", ""],
      ["components/__fixture__.tsx", `<Image src="/founder/adam-moreno-headshot.png" alt="Adam Moreno" />`],
    ],
  },
  {
    id: "edge-safe-email",
    rule: "MV-15: plain-text email in server-rendered JSX is rewritten by Cloudflare and breaks hydration; use <PlainEmail>",
    scope: (file) => isCode(file) && /\.tsx$/.test(file),
    run: (file, src) =>
      matches(stripStrings(stripComments(src)), /[\w.+-]+@[\w-]+\.(?:io|com)\b/g, (m) => `"${m[0]}" in JSX text`),
    bad: `<p className="text-gray-700">Email: admin@terramore.io</p>`,
    good: `<p className="text-gray-700">Email: <PlainEmail address="admin@terramore.io" /></p><a href="mailto:admin@terramore.io">Email us</a>`,
  },
  {
    id: "hero-logos-not-desaturated",
    rule: "Release constraint 2026-09-29 (VD-018): hero integration marks are brand identity; no grayscale, monochrome, tint, blend, mask recolor or extra fading",
    scope: (file) => HERO_LOGO_FILES.includes(file) || isCss(file),
    run: (file, src) => {
      if (isCss(file)) return heroLogoCss(src)
      const code = stripComments(src)
      const floor = HERO_LOGO_MIN_OPACITY.get(file)
      const out = [
        ...matches(
          code,
          /(^|[\s"'`:])(grayscale|invert|sepia|saturate-(?:0|50|\[[^\]]*\])|brightness-(?:0|50|75|\[[^\]]*\])|contrast-(?:0|50|\[[^\]]*\])|hue-rotate-[\w.[\]-]+|mix-blend-[\w-]+|bg-blend-[\w-]+|(?:text|fill|stroke|bg)-gold[\w/-]*|fill-current)(?=[\s"'`]|$)/gm,
          (m) => `"${m[2]}" on the hero marks`
        ),
        ...matches(code, /\b(?:filter|maskImage|WebkitMaskImage|mixBlendMode)\s*:|mask-image|blend-mode|currentColor/g, (m) => `"${m[0]}" on the hero marks`),
        ...matches(code, /<img\b[^>]*?\bopacity/g, () => "opacity on the mark itself"),
      ]
      for (const m of code.matchAll(/opacity-\[(0?\.\d+)\]|opacity-(\d{1,3})(?=[\s"'`])|opacity:\s*(0?\.\d+)/g)) {
        const value = m[1] ? Number(m[1]) : m[2] ? Number(m[2]) / 100 : Number(m[3])
        if (value < floor) out.push({ line: lineOf(code, m.index), detail: `"${m[0]}" fades the marks below the reviewed ${floor}` })
      }
      return out
    },
    bad: [
      ["components/hero-floating-logos.tsx", `<span className="absolute opacity-[0.12]"><img src={src} alt="" className="object-contain grayscale" /></span>`],
      ["app/globals.css", `.hero-mobius-logo img { filter: saturate(0) brightness(0.9); mix-blend-mode: multiply; }\nimg { filter: grayscale(1); }`],
    ],
    good: [
      ["components/hero-floating-logos.tsx", `<span className="absolute rounded-2xl bg-white/70 opacity-[0.28] ring-black/[0.04]"><img src={src} alt="" className="object-contain" /></span>`],
      [
        "app/globals.css",
        `.hero-mobius-logo { background: rgba(255, 255, 255, 0.72); opacity: 0.5; }\n.hero-mobius-logo img { width: 22px; }\n.hero-logo-mask { mask-image: radial-gradient(ellipse at center, transparent 84%, #000 100%); }\n.software-record-press { filter: brightness(0.88); }`,
      ],
    ],
  },
  {
    id: "hero-logos-brand-assets",
    rule: "Release constraint 2026-09-29 (VD-018): every hero mark is the official Simple Icons brand mark of an INTEGRATION_LOGOS entry; no placeholders or generic icon sets",
    scope: (file) => HERO_LOGO_FILES.includes(file),
    run: (file, src) => {
      const code = stripComments(src)
      const out = []
      if (!/import\s*\{[^}]*\bINTEGRATION_LOGOS\b[^}]*\}\s*from\s*["']@\/lib\/integrations["']/.test(code)) {
        out.push({ line: 1, detail: "marks no longer come from INTEGRATION_LOGOS" })
      }
      const imgs = [...code.matchAll(/<img\b[^>]*?\bsrc=\{?[`"']([^`"']*)/g)]
      if (imgs.length === 0) out.push({ line: 1, detail: "no brand mark <img>" })
      for (const m of imgs) {
        if (!BRAND_MARK_SRC.test(m[1])) out.push({ line: lineOf(code, m.index), detail: `"${m[1]}" is not a Simple Icons brand mark for the slug` })
      }
      out.push(...matches(code, /from\s+["'](lucide-react|@heroicons\/[\w/-]+|react-icons\/\w+|@radix-ui\/react-icons)["']/g, (m) => `generic icon set "${m[1]}" among the hero marks`))
      return out
    },
    bad: [
      ["components/hero-logo-mobius.tsx", `import { Globe } from "lucide-react"\n<span className="hero-mobius-logo"><img src={\`/placeholder/\${logo.slug}.png\`} alt="" /></span>`],
    ],
    good: [
      [
        "components/hero-logo-mobius.tsx",
        `import { INTEGRATION_LOGOS } from "@/lib/integrations"\n<img src={\`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/\${logo.slug}.svg\`} alt="" />`,
      ],
      ["components/hero-floating-logos.tsx", `import { INTEGRATION_LOGOS } from "@/lib/integrations"\n<img\n  src={\`https://cdn.simpleicons.org/\${mark.slug}\`}\n  alt=""\n/>`],
    ],
  },
  {
    id: "slack-example-identity",
    rule: "Release constraint 2026-09-29 (VD-014): the Slack example keeps role initials avatars and its visible Illustrative example label, and shows no person photos",
    scope: (file) => file === SLACK_EXAMPLE,
    run: (file, src) => {
      const code = stripComments(src)
      const out = []
      if (!/<SlackAvatar\b/.test(code) || !/\{initials\}/.test(code)) out.push({ line: 1, detail: "senders no longer show the initials avatar (SlackAvatar)" })
      if (!/>\s*Illustrative example\s*</.test(code)) out.push({ line: 1, detail: 'no visible "Illustrative example" label' })
      out.push(...matches(code, /<img\b|<Image\b|\bphoto\s*[:=]|unsplash|\/founder\/|\.(?:png|jpe?g|webp|avif)\b/g, (m) => `"${m[0]}": no person photos in the Slack example`))
      return out
    },
    bad: [[SLACK_EXAMPLE, `const NIA = { name: "Nia Brooks", photo: "https://images.unsplash.com/photo-1" }\n<img src={message.from.photo} alt={message.from.name} />`]],
    good: [
      [
        SLACK_EXAMPLE,
        `function SlackAvatar({ person }) { const initials = person.name.slice(0, 2); return <span aria-hidden>{initials}</span> }\n<SlackAvatar person={message.from} />\n<p className="rounded-full bg-slate-100 text-slate-700">\n  Illustrative example\n</p>`,
      ],
    ],
  },
]

/* ---------------------------------------------------------------- known open findings */

/** Exact counts of open findings, each tied to an audit id. */
const KNOWN_OPEN = [
  // Rendered only after the booking lookup succeeds on the client, so it is not in the served HTML (live: no rewrite).
  { check: "edge-safe-email", file: "components/manage-booking.tsx", count: 1, finding: "MV-15" },
]

/* ---------------------------------------------------------------- module graph (reachability from routes) */

function reachableFrom(files) {
  const entries = [...files.keys()].filter((f) => /^app\/.*\b(page|layout|template|error|not-found|loading|global-error|default)\.tsx$/.test(f))
  const resolve = (from, spec) => {
    const base = spec.startsWith("@/") ? spec.slice(2) : path.posix.join(path.posix.dirname(from), spec)
    for (const ext of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) if (files.has(base + ext)) return base + ext
    return null
  }
  const seen = new Set(entries)
  const queue = [...entries]
  while (queue.length) {
    const file = queue.pop()
    const src = files.get(file) ?? ""
    for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*)["'](@\/[^"']+|\.{1,2}\/[^"']+)["']/g)) {
      const target = resolve(file, m[1])
      if (target && !seen.has(target)) {
        seen.add(target)
        queue.push(target)
      }
    }
  }
  return seen
}

/* ---------------------------------------------------------------- self-test: every check catches its broken sample */

const FIXTURE = "components/__fixture__.tsx"
const asFiles = (sample) => new Map(Array.isArray(sample) ? sample : [[FIXTURE, sample]])
const contextFor = (files) => {
  const css = [...files].filter(([f]) => isCss(f)).map(([, s]) => s).join("\n")
  return { motion: cssMotion(css), reachable: files.has(FIXTURE) ? new Set(files.keys()) : reachableFrom(files) }
}
const runCheck = (check, files) => {
  const ctx = contextFor(files)
  return [...files].filter(([file]) => check.scope(file)).flatMap(([file, src]) => check.run(file, src, ctx).map((v) => ({ ...v, file })))
}

assert(CHECKS.length === new Set(CHECKS.map((check) => check.id)).size, "check ids are unique")
for (const check of CHECKS) {
  assert(runCheck(check, asFiles(check.bad)).length > 0, `${check.id}: fails on its deliberately broken sample`)
  const falsePositives = runCheck(check, asFiles(check.good))
  assert(falsePositives.length === 0, `${check.id}: passes the approved pattern (${falsePositives.map((v) => v.detail).join("; ")})`)
}
for (const entry of KNOWN_OPEN) {
  assert(CHECKS.some((check) => check.id === entry.check), `allowlist entry names a real check (${entry.check})`)
  assert(/^(MV|MC|MK)-\d{2}$/.test(entry.finding), `allowlist entry ${entry.check} ${entry.file} is tied to an audit finding id`)
}

/* ---------------------------------------------------------------- codebase scan */

function walk(dir) {
  const full = path.join(root, dir)
  if (!existsSync(full)) return []
  return readdirSync(full).flatMap((name) => {
    if (name === "node_modules" || name.startsWith(".")) return []
    const child = path.join(dir, name)
    return statSync(path.join(root, child)).isDirectory() ? walk(child) : [child]
  })
}

const files = new Map(
  ["app", "components", "lib", "hooks", "styles", "public"]
    .flatMap(walk)
    .map((file) => file.split(path.sep).join("/"))
    .filter((file) => isCode(file) || isCss(file) || isPublicAsset(file))
    .map((file) => [file, isPublicAsset(file) ? "" : readFileSync(path.join(root, file), "utf8")])
)
assert([...files.keys()].filter((f) => /^app\/.*page\.tsx$/.test(f)).length >= 20, `marketing routes found under ${root}`)
assert(files.has("app/globals.css"), "app/globals.css found")
for (const file of [...SIMULATIONS, ...FINITE_MOTION.keys(), ...HERO_LOGO_FILES]) assert(files.has(file), `${file} still exists (update the list if it moved)`)

const failures = []
for (const check of CHECKS) {
  const byFile = new Map()
  for (const violation of runCheck(check, files)) {
    byFile.set(violation.file, [...(byFile.get(violation.file) ?? []), violation])
  }
  for (const entry of KNOWN_OPEN.filter((known) => known.check === check.id)) {
    if (!byFile.has(entry.file)) byFile.set(entry.file, [])
  }
  for (const [file, violations] of byFile) {
    const known = KNOWN_OPEN.find((entry) => entry.check === check.id && entry.file === file)
    const allowed = known?.count ?? 0
    if (violations.length > allowed) {
      failures.push(
        `${check.id} (${check.rule})\n    ${violations.map((v) => `${file}:${v.line} ${v.detail}`).join("\n    ")}` +
          (known ? `\n    ${allowed} known (${known.finding}); this is a new violation.` : "")
      )
    } else if (violations.length < allowed) {
      failures.push(`${check.id}: ${file} now has ${violations.length}, allowlisted ${allowed} (${known.finding}). Lower the KNOWN_OPEN count.`)
    } else {
      passed++
    }
  }
  passed++
}
assert(failures.length === 0, `Visual Doctrine violations:\n  ${failures.join("\n  ")}`)

console.log(`visual: ok (${passed} checks, ${CHECKS.length} rules, ${KNOWN_OPEN.length} known open findings allowlisted)`)
