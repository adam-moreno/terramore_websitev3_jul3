/**
 * Visual Doctrine guardrails for terramore.io: the objective subset of the dashboard repo's
 * docs/visual/VERIFY_VISUAL_PLAN.md (V-02, V-03, V-10, V-11, V-14, V-15, V-19, V-20) plus the Visual V1 honesty rules
 * and the 2026-09-29 identity release constraints (hero integration marks and their visible-arc placement, Slack example;
 * VD-018, VD-014), as amended by the visual restoration (moving orbit, disclosed example people).
 * scripts/verify-v1-release.mjs pins which of these rules the V1 release depends on.
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
const FINITE_MOTION = new Map()

/** Hero integration marks: desktop orbit and phone field (release constraint, VD-018). */
const HERO_LOGO_FILES = ["components/hero-logo-mobius.tsx", "components/hero-floating-logos.tsx"]
/** Chip opacity reviewed for V1, per surface. Fading the marks further greys the field out. */
const HERO_LOGO_MIN_OPACITY = new Map([
  ["app/globals.css", 0.5],
  ["components/hero-logo-mobius.tsx", 0.5],
  ["components/hero-floating-logos.tsx", 0.28],
])
/**
 * The official brand mark for an INTEGRATION_LOGOS slug, in its brand color (cdn.simpleicons.org default).
 * jsDelivr's simple-icons files have no fill and render black. No per-slug fallbacks: all 36 slugs served
 * 200 image/svg+xml from cdn.simpleicons.org on 2026-09-29.
 */
const BRAND_MARK_SRC = /^https:\/\/cdn\.simpleicons\.org\/\$\{(logo|mark)\.slug\}$/
/** The "Work inside your tools" logo field (home toolkit, step 1): the same brand-colored marks as the hero (owner, 2026-09-30). */
const TOOLS_LOGO_FILE = "components/software-visuals.tsx"
const TOOLS_LOGO_FIELD = /export function IntegrationTilesVisual\b[\s\S]*?(?=\n(?:export )?(?:function|const) |$)/
/** The Slack-style example on the home page (release constraint, VD-014 as amended by the visual restoration). */
const SLACK_EXAMPLE = "components/hero-analytics.tsx"
/**
 * Example portraits the Slack example may show, each with recorded provenance (visual-restoration provenance table):
 * the cartoons and Nia's headshot are C2PA-signed generated images of no real person (7eabb56); the unsplash-* crops are
 * Unsplash License stock photos given fictional names. A new file needs a provenance entry first.
 */
const EXAMPLE_PEOPLE_DIR = "public/examples/people/"
const EXAMPLE_PEOPLE_ASSETS = new Set(
  [
    "ava-lindstrom-cartoon.png",
    "chris-okonkwo-cartoon.png",
    "elena-voss-cartoon.png",
    "jordan-blake-cartoon.png",
    "marcus-bell-cartoon.png",
    "nia-brooks-headshot.png",
    "noah-patel-cartoon.png",
    "riley-cho-cartoon.png",
    "sofia-ramirez-cartoon.png",
    "unsplash-1492562080023-ab3db95bfbce.jpg",
    "unsplash-1506277886164-e25aa3f4ef7f.jpg",
    "unsplash-1506794778202-cad84cf45f1d.jpg",
    "unsplash-1517841905240-472988babdf9.jpg",
    "unsplash-1524504388940-b1c1722653e1.jpg",
    "unsplash-1544717305-2782549b5136.jpg",
  ].map((name) => EXAMPLE_PEOPLE_DIR + name)
)

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
    run: (file, src) =>
      /Illustrative example|Example workflow|Example conversation/.test(stripComments(src)) ? [] : [{ line: 1, detail: "simulation without an in-component label" }],
    bad: [["components/hero-analytics.tsx", `<div>#e-commerce · 14 members</div>`]],
    good: [["components/hero-analytics.tsx", `<p className="rounded-full bg-slate-100 text-slate-700">Illustrative example</p>`]],
  },
  {
    id: "no-fictional-people-assets",
    rule: "V-19 / VR-30: no shipped faces or names of people who do not exist, except the provenance-recorded portraits inside the disclosed Slack example (MV-01, MV-18, VD-014 amended)",
    scope: (file) => isPublicAsset(file) || isCode(file),
    run: (file, src) => {
      if (isPublicAsset(file)) {
        if (file.startsWith("public/reviews/")) return [{ line: 1, detail: "fictional reviewer asset" }]
        if (file.startsWith("public/founder/") && !REAL_PEOPLE_ASSETS.has(file)) return [{ line: 1, detail: "person asset that is not the founder" }]
        if (file.startsWith(EXAMPLE_PEOPLE_DIR) && !EXAMPLE_PEOPLE_ASSETS.has(file)) return [{ line: 1, detail: "example portrait with no provenance entry" }]
        return []
      }
      const code = stripComments(src)
      const out = matches(code, /\/(?:founder|reviews)\/(?!adam-moreno-(?:headshot|cartoon)\.png)[\w.-]+\.(?:png|jpe?g|webp)/g, (m) => `"${m[0]}"`)
      if (file !== SLACK_EXAMPLE) out.push(...matches(code, /\/examples\/people\b/g, () => "example portraits outside the disclosed Slack example"))
      return out
    },
    bad: [
      ["public/reviews/review-maya.png", ""],
      ["public/examples/people/new-face.png", ""],
      ["components/__fixture__.tsx", `const NIA = { name: "Nia Brooks", photo: "/founder/nia-brooks-headshot.png" }\n<img src="/examples/people/nia-brooks-headshot.png" alt="" />`],
    ],
    good: [
      ["public/founder/adam-moreno-headshot.png", ""],
      ["public/examples/people/nia-brooks-headshot.png", ""],
      ["components/__fixture__.tsx", `<Image src="/founder/adam-moreno-headshot.png" alt="Adam Moreno" />`],
      [SLACK_EXAMPLE, `const PEOPLE = "/examples/people"`],
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
    rule: "Release constraint 2026-09-29 (VD-018): every hero mark is the brand-colored Simple Icons mark (cdn.simpleicons.org) of an INTEGRATION_LOGOS entry; no black jsDelivr files, placeholders or generic icon sets",
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
        if (!BRAND_MARK_SRC.test(m[1])) out.push({ line: lineOf(code, m.index), detail: `"${m[1]}" is not the brand-colored Simple Icons mark for the slug` })
      }
      out.push(...matches(code, /from\s+["'](lucide-react|@heroicons\/[\w/-]+|react-icons\/\w+|@radix-ui\/react-icons)["']/g, (m) => `generic icon set "${m[1]}" among the hero marks`))
      return out
    },
    bad: [
      ["components/hero-logo-mobius.tsx", `import { Globe } from "lucide-react"\n<span className="hero-mobius-logo"><img src={\`/placeholder/\${logo.slug}.png\`} alt="" /></span>`],
      [
        "components/hero-floating-logos.tsx",
        `import { INTEGRATION_LOGOS } from "@/lib/integrations"\n<img src={\`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/\${mark.slug}.svg\`} alt="" />`,
      ],
    ],
    good: [
      ["components/hero-logo-mobius.tsx", `import { INTEGRATION_LOGOS } from "@/lib/integrations"\n<img src={\`https://cdn.simpleicons.org/\${logo.slug}\`} alt="" />`],
      ["components/hero-floating-logos.tsx", `import { INTEGRATION_LOGOS } from "@/lib/integrations"\n<img\n  src={\`https://cdn.simpleicons.org/\${mark.slug}\`}\n  alt=""\n/>`],
    ],
  },
  {
    id: "tools-logos-brand-colored",
    rule: "Owner 2026-09-30 (VD-018): the \"Work inside your tools\" logo field shows every INTEGRATION_LOGOS entry as its brand-colored Simple Icons mark (cdn.simpleicons.org, via BrandLogo colored), not the black jsDelivr files the rest of the toolkit uses; no grayscale, tint, blend or filter on the tiles",
    scope: (file) => file === TOOLS_LOGO_FILE || isCss(file),
    run: (file, src) => {
      if (isCss(file)) {
        const css = src.replace(/\/\*[\s\S]*?\*\//g, blank)
        const out = []
        for (const m of css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
          if (!/\.software-icon-tile\b/.test(m[1])) continue
          const line = lineOf(css, m.index + m[1].length - m[1].trimStart().length)
          for (const f of m[2].matchAll(/(?:^|[;\s])(?:-webkit-)?filter\s*:([^;]*)/g)) if (DESATURATE.test(f[1])) out.push({ line, detail: `${m[1].trim()}: filter ${f[1].trim()}` })
          if (/blend-mode\s*:/.test(m[2])) out.push({ line, detail: `${m[1].trim()}: blend mode` })
        }
        return out
      }
      const code = stripComments(src)
      const field = code.match(TOOLS_LOGO_FIELD)
      if (!field) return [{ line: 1, detail: "IntegrationTilesVisual (the Work inside your tools logo field) not found" }]
      const at = (offset) => lineOf(code, field.index + offset)
      const body = field[0]
      const out = []
      if (!/\bINTEGRATION_LOGOS\.map\(/.test(body)) out.push({ line: at(0), detail: "the logo field no longer maps INTEGRATION_LOGOS" })
      const imgs = [...body.matchAll(/<img\b[^>]*?\bsrc=\{?[`"']([^`"']*)/g)]
      for (const m of imgs) {
        if (!BRAND_MARK_SRC.test(m[1])) out.push({ line: at(m.index), detail: `"${m[1]}" is not the brand-colored Simple Icons mark for the slug` })
      }
      const logos = [...body.matchAll(/<BrandLogo\b[^>]*>/g)]
      if (imgs.length + logos.length === 0) out.push({ line: at(0), detail: "the logo field renders no brand mark" })
      for (const m of logos) {
        if (!/\scolored(?=[\s/>])(?!\s*=\s*\{\s*false\s*\})/.test(m[0])) out.push({ line: at(m.index), detail: "BrandLogo without colored (black jsDelivr mark) in the logo field" })
      }
      if (logos.length && !/function\s+BrandLogo\b[\s\S]*?\bcolored\s*\?\s*`https:\/\/cdn\.simpleicons\.org\/\$\{slug\}`/.test(code)) {
        out.push({ line: 1, detail: "BrandLogo colored no longer renders the cdn.simpleicons.org brand-colored mark" })
      }
      out.push(
        ...matches(body, /(^|[\s"'`:])(grayscale|invert|sepia|saturate-[\w.[\]-]+|brightness-[\w.[\]-]+|hue-rotate-[\w.[\]-]+|mix-blend-[\w-]+|fill-current)(?=[\s"'`]|$)|\b(?:filter|mixBlendMode)\s*:/gm, (m) => `"${m[2] ?? m[0]}" on the tools logos`).map(
          (f) => ({ ...f, line: f.line + at(0) - 1 })
        )
      )
      return out
    },
    bad: [
      [
        "components/software-visuals.tsx",
        `export function IntegrationTilesVisual() {\n  return INTEGRATION_LOGOS.map((logo) => (\n    <BrandLogo slug={logo.slug} name={logo.name} className="h-4 w-4" />\n  ))\n}\n\nconst MONEY_BEATS = []`,
      ],
      [
        "components/software-visuals.tsx",
        `function BrandLogo({ slug, colored }) {\n  return <img src={colored ? \`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/\${slug}.svg\` : ""} alt="" />\n}\n\nexport function IntegrationTilesVisual() {\n  return INTEGRATION_LOGOS.map((logo) => <BrandLogo slug={logo.slug} colored />)\n}`,
      ],
      [
        "components/software-visuals.tsx",
        `export function IntegrationTilesVisual() {\n  return INTEGRATION_LOGOS.map((logo) => (\n    <img src={\`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/\${logo.slug}.svg\`} alt={logo.name} className="grayscale" />\n  ))\n}`,
      ],
      ["app/globals.css", `.software-icon-tile { background: #fff; }\n.software-icon-tile img { filter: grayscale(1); }`],
    ],
    good: [
      [
        "components/software-visuals.tsx",
        `function BrandLogo({ slug, colored = false }) {\n  return (\n    <img\n      src={\n        colored\n          ? \`https://cdn.simpleicons.org/\${slug}\`\n          : \`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/\${slug}.svg\`\n      }\n      alt=""\n    />\n  )\n}\n\nexport function IntegrationTilesVisual() {\n  return INTEGRATION_LOGOS.map((logo) => (\n    <BrandLogo slug={logo.slug} name={logo.name} colored className="h-4 w-4 md:h-[18px] md:w-[18px]" />\n  ))\n}\n\nconst MONEY_BEATS = [<BrandLogo slug="meta" />]`,
      ],
      [
        "components/software-visuals.tsx",
        `export function IntegrationTilesVisual() {\n  return INTEGRATION_LOGOS.map((logo) => <img src={\`https://cdn.simpleicons.org/\${logo.slug}\`} alt={logo.name} />)\n}`,
      ],
      ["app/globals.css", `.software-icon-tile { border-radius: 18px; background: #fff; box-shadow: 0 10px 24px -16px rgba(15, 30, 46, 0.28); }`],
    ],
  },
  {
    id: "hero-logos-visible-arc",
    rule: "Release constraint 2026-09-29 (efad7a4, VD-018), restored motion: still desktop hero marks rest only on the visible outer curve (outside the mask hole, clear of the H1), and marks with no clear spot are hidden. Travelling marks cross behind the headline only in passing: the orbit stops under reduced motion and has a Pause control",
    scope: (file) => file === "components/hero-logo-mobius.tsx",
    run: (file, src) => {
      const code = stripComments(src)
      const out = []
      const need = [
        [/function\s+restingOffsets\s*\(/, "restingOffsets() no longer computes the visible resting spots"],
        [/\binHole\b[^\n]*<\s*CLEAR_OF_HOLE/, "resting spots no longer exclude the mask hole (inHole < CLEAR_OF_HOLE)"],
        [/\bonHeadline\b/, "resting spots no longer exclude the headline box"],
        [/!inHole\s*&&\s*!onHeadline/, "resting spots no longer require both clear of the hole and clear of the headline"],
        [/=\s*restingOffsets\s*\(/, "restingOffsets() is no longer used to place the marks"],
        [/\.style\.display\s*=\s*["']none["']/, "marks without a visible spot are no longer hidden"],
        [/\bmoving\s*=\s*!reduce\b/, "the orbit no longer stops under reduced motion (moving = !reduce)"],
        [/<MotionToggle\b/, "the moving orbit has no Pause control"],
      ]
      for (const [pattern, detail] of need) if (!pattern.test(code)) out.push({ line: 1, detail })
      out.push(...matches(code, /offsetDistance\s*=\s*`\$\{\s*\(\s*index\s*\/[^`]*`/g, () => "marks spread evenly along the whole path (some sit behind the headline)"))
      return out
    },
    bad: [
      [
        "components/hero-logo-mobius.tsx",
        "const moving = true\nlogos.forEach((logo, index) => {\n  logo.style.offsetDistance = `${(index / logos.length) * 100}%`\n})",
      ],
    ],
    good: [
      [
        "components/hero-logo-mobius.tsx",
        `function restingOffsets(d, frame, max) {\n  const inHole = Math.hypot(a, b) < CLEAR_OF_HOLE\n  const onHeadline = x > left\n  if (!inHole && !onHeadline && inFrame) clear.push(at)\n}\nconst offsets = restingOffsets(d, frame, logos.length)\nlogos.forEach((logo, index) => { if (index < offsets.length) logo.style.offsetDistance = \`\${offsets[index]}%\`; else logo.style.display = "none" })\nconst moving = !reduce\n<MotionToggle paused={paused} onToggle={toggle} label="logo orbit" />`,
      ],
    ],
  },
  {
    id: "slack-example-identity",
    rule: "VD-014 as amended by the visual restoration: the Slack example may show named example people with provenance-recorded, self-hosted portraits (initials when there is none), and the card itself says, readably, that it is an example conversation with no real clients or staff. No founder likeness, no hotlinked photos, no sales-handoff role",
    scope: (file) => file === SLACK_EXAMPLE,
    run: (file, src) => {
      const code = stripComments(src)
      const out = []
      if (!/<SlackAvatar\b/.test(code) || !/\{initials\}/.test(code)) out.push({ line: 1, detail: "senders no longer fall back to the initials avatar (SlackAvatar)" })
      const disclosure = code.match(/const EXAMPLE_DISCLOSURE\s*=\s*"([^"]*)"/)
      if (!disclosure || !/^Example conversation\b/.test(disclosure[1]) || !/\bnot real\b/.test(disclosure[1])) {
        out.push({ line: 1, detail: 'the disclosure no longer starts "Example conversation" and says the people are not real' })
      }
      const shown = [...code.matchAll(/<p\b([^>]*)>\s*\{EXAMPLE_DISCLOSURE\}\s*<\/p>/g)]
      const readable = shown.some(([, attrs]) => {
        const cls = attrs.match(/className="([^"]*)"/)?.[1] ?? ""
        return (
          !/aria-hidden/.test(attrs) &&
          /(^|\s)text-slate-(500|600|700|800|900)(\s|$)/.test(cls) &&
          !/(^|\s)(hidden|sr-only|invisible|opacity-[\w[\].]+|text-\[(?:[0-9]|1[01])px\])(\s|$)/.test(cls)
        )
      })
      if (!readable) out.push({ line: 1, detail: "the disclosure is not rendered as visible, readable text (slate-500 or darker, 12px or more, not hidden)" })
      if (/\.(?:png|jpe?g|webp|avif)\b/.test(code) && !/const PEOPLE\s*=\s*"\/examples\/people"/.test(code)) {
        out.push({ line: 1, detail: "portraits no longer come from /examples/people" })
      }
      for (const m of code.matchAll(/["'`]([\w-]+\.(?:png|jpe?g|webp|avif))["'`]/g)) {
        if (!EXAMPLE_PEOPLE_ASSETS.has(EXAMPLE_PEOPLE_DIR + m[1])) out.push({ line: lineOf(code, m.index), detail: `"${m[1]}" has no provenance entry` })
      }
      out.push(
        ...matches(code, /<Image\b|unsplash\.com|https?:\/\/|\/founder\/|adam-moreno|Head of Sales|>\s*Illustrative example\s*</g, (m) => `"${m[0].trim()}" in the Slack example`)
      )
      return out
    },
    bad: [
      [
        SLACK_EXAMPLE,
        `const NIA = { name: "Nia Brooks", photo: "https://images.unsplash.com/photo-1" }\nconst ADAM = { photo: "/founder/adam-moreno-cartoon.png", role: "Head of Sales" }\n<img src={message.from.photo} alt={message.from.name} />\n<p className="rounded-full bg-slate-100 text-slate-700">Illustrative example</p>`,
      ],
    ],
    good: [
      [
        SLACK_EXAMPLE,
        `const PEOPLE = "/examples/people"\nconst NIA = client("Nia Brooks", "Founder, e-commerce brand", "nia-brooks-headshot.png")\nconst EXAMPLE_DISCLOSURE = "Example conversation · not real clients or staff"\nfunction SlackAvatar({ person }) { if (person.photo) return <img src={person.photo} alt="" />; const initials = person.name.slice(0, 2); return <span aria-hidden>{initials}</span> }\n<SlackAvatar person={message.from} />\n<p className="text-[12px] leading-snug text-slate-500">{EXAMPLE_DISCLOSURE}</p>`,
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
