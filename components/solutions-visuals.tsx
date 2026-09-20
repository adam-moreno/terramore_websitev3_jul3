"use client"

/**
 * Client-side visuals for /solutions.
 *
 * Three pieces:
 *  - GrowthSystemFlow: the hero visual. Five connected stages on a dark panel,
 *    revealed sequentially when scrolled into view. CSS-only animation.
 *  - WaysToggle: "Fragmented vs Connected" comparison with a simple state toggle
 *    and CSS transitions. No animation library.
 *  - FootprintCta: website input that opens the EXISTING report popup with the
 *    URL prefilled. No new backend, no new tracking.
 *
 * All motion is decorative and disabled under prefers-reduced-motion
 * (the .solutions-* classes are guarded in globals.css).
 */

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowDown, ArrowRight, BarChart3, Target, Workflow } from "lucide-react"
import { BookingLink } from "@/components/booking-popup"
import { ReportPopup } from "@/components/report-popup"

/* ------------------------------------------------------------------ */
/* Growth system flow                                                  */
/* ------------------------------------------------------------------ */

const STAGES = [
  { label: "Acquisition", note: "Get seen", chips: ["Google", "Meta", "TikTok", "Content", "Search"] },
  { label: "Conversion", note: "Get chosen", chips: ["Website", "Landing pages", "Lead capture", "Offers"] },
  { label: "Follow-up", note: "Stay in it", chips: ["CRM", "Email", "SMS", "Routing", "Automation"] },
  { label: "Intelligence", note: "Know why", chips: ["Analytics", "Attribution", "Terra IQ", "Reporting"] },
  { label: "Revenue", note: "The point", chips: ["Qualified pipeline", "Customers", "Growth"] },
] as const

/** Reveal-on-scroll: adds `data-on` once, so CSS can stagger children in. */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setOn(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setOn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, on }
}

/** One stage tile that reveals itself when it scrolls into view, so on
 *  mobile the 01 → 02 → 03 sequence appears as the user scrolls instead of
 *  all at once. The next tile peeks in dimmed until it crosses the fold. */
function StageItem({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  const { ref, on } = useRevealOnce<HTMLLIElement>()

  return (
    <li ref={ref} className="flex flex-col lg:flex-1 lg:flex-row">
      <div
        className={`solutions-node-tease flex-1 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 ${on ? "solutions-node-on" : ""}`}
        style={{ transitionDelay: `${(index % 3) * 120}ms` }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{`0${index + 1}`}</p>
        <p className="mt-1 text-[17px] font-semibold tracking-tight text-cream">{stage.label}</p>
        <p className="text-[12px] text-cream/55">{stage.note}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {stage.chips.map((chip) => (
            <li key={chip} className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-cream/80">
              {chip}
            </li>
          ))}
        </ul>
      </div>
      {index < STAGES.length - 1 ? (
        <div
          aria-hidden
          className={`solutions-connector flex items-center justify-center py-1.5 text-brand lg:px-1 lg:py-0 ${on ? "solutions-node-on" : ""}`}
          style={{ transitionDelay: `${(index % 3) * 120 + 90}ms` }}
        >
          <ArrowDown className="h-4 w-4 lg:hidden" strokeWidth={2.25} />
          <ArrowRight className="hidden h-4 w-4 lg:block" strokeWidth={2.25} />
        </div>
      ) : null}
    </li>
  )
}

export function GrowthSystemFlow() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-ink px-5 py-7 text-cream shadow-[0_20px_50px_-28px_rgba(15,23,42,0.4)] md:px-9 md:py-9">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">The Terramore growth system</p>
        <p className="text-[13px] text-cream/60">Every stage feeds the next.</p>
      </div>

      <ol className="mt-6 flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0">
        {STAGES.map((stage, index) => (
          <StageItem key={stage.label} stage={stage} index={index} />
        ))}
      </ol>

      {/* Flowing pulse line under the stages, desktop only. Pure decoration. */}
      <div aria-hidden className="mt-6 hidden h-px overflow-hidden rounded-full bg-white/10 lg:block">
        <div className="solutions-pulse h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Split funnel: cracked/gray on the left, connected/colored on the    */
/* right, with a feedback loop. The visual carries the comparison.     */
/* ------------------------------------------------------------------ */

const FUNNEL_LAYERS = [
  // Trapezoid geometry: top/bottom y and half-widths, centered on x=260.
  // `grad` = 3D-ish vertical gradient for the connected side; `old` = the
  // disconnected tactic on the gray side.
  { y0: 50, y1: 104, topHalf: 180, botHalf: 150, grad: ["#4d7fff", "#1e4ecc"], left: "#c7d0da", label: "Brand visibility", old: "One-off ads" },
  { y0: 112, y1: 166, topHalf: 144, botHalf: 116, grad: ["#87a2ff", "#5272e0"], left: "#b4bfcc", label: "Website traffic", old: "Brochure website" },
  { y0: 174, y1: 228, topHalf: 110, botHalf: 84, grad: ["#f9c463", "#d69518"], left: "#a1adbd", label: "Qualified leads", old: "Spreadsheet leads" },
  { y0: 236, y1: 290, topHalf: 78, botHalf: 55, grad: ["#22375a", "#0a1624"], left: "#8d9aab", label: "Sales", old: "Manual follow-up" },
] as const

/* Where the gray side loses data: the gaps between layers. */
const FUNNEL_BREAKS = [
  { x: 238, y: 108 },
  { x: 266, y: 170 },
  { x: 294, y: 232 },
] as const

/* Funnel center x in the 700-unit viewBox — exactly half, so the divider is
   centered under the section header and the captions split evenly. */
const FCX = 350

export function FunnelStory() {
  const { ref, on } = useRevealOnce<HTMLDivElement>()

  return (
    <div ref={ref} className="rounded-[1.75rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-10">
      <div className="mx-auto max-w-2xl">
        <svg viewBox="0 0 700 320" className="w-full" role="img" aria-label="A marketing funnel split in two: disconnected channels leak on the left, while the connected Terramore funnel on the right moves visibility to traffic, leads, and sales with a feedback loop">
          <defs>
            {FUNNEL_LAYERS.map((layer, index) => (
              <linearGradient key={layer.label} id={`funnel-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={layer.grad[0]} />
                <stop offset="100%" stopColor={layer.grad[1]} />
              </linearGradient>
            ))}
            <filter id="funnel-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f1e2e" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Decorative dashed wave behind the funnel. */}
          <path
            d="M 0 250 C 100 200 160 290 270 240 S 510 160 700 110"
            fill="none"
            stroke="var(--brand)"
            strokeOpacity="0.15"
            strokeWidth="1.5"
            strokeDasharray="5 7"
          />

          {FUNNEL_LAYERS.map((layer, index) => (
            <g
              key={layer.label}
              className={`solutions-node ${on ? "solutions-node-on" : ""}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Left half: gray, disconnected. */}
              <path
                d={`M ${FCX - layer.topHalf} ${layer.y0} L ${FCX - 2} ${layer.y0} L ${FCX - 2} ${layer.y1} L ${FCX - layer.botHalf} ${layer.y1} Z`}
                fill={layer.left}
              />
              {/* Crack running through the gray half. */}
              <polyline
                points={`${FCX - layer.topHalf * 0.62},${layer.y0} ${FCX - layer.topHalf * 0.5},${(layer.y0 + layer.y1) / 2} ${FCX - layer.botHalf * 0.66},${layer.y1}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
              />
              {/* Old-tactic label on the gray side. */}
              <line
                x1={FCX - (layer.topHalf + layer.botHalf) / 2 - 16}
                y1={(layer.y0 + layer.y1) / 2}
                x2={FCX - (layer.topHalf + layer.botHalf) / 2 - 4}
                y2={(layer.y0 + layer.y1) / 2}
                stroke="var(--ink)"
                strokeOpacity="0.25"
                strokeWidth="1.5"
              />
              <text
                x={FCX - (layer.topHalf + layer.botHalf) / 2 - 21}
                y={(layer.y0 + layer.y1) / 2}
                dominantBaseline="central"
                textAnchor="end"
                fontWeight="500"
                fill="#7d8b9d"
                className="solutions-funnel-old"
              >
                {layer.old}
              </text>
              {/* Right half: connected, with a vertical gradient for depth. */}
              <path
                d={`M ${FCX + 2} ${layer.y0} L ${FCX + layer.topHalf} ${layer.y0} L ${FCX + layer.botHalf} ${layer.y1} L ${FCX + 2} ${layer.y1} Z`}
                fill={`url(#funnel-grad-${index})`}
                filter="url(#funnel-shadow)"
              />
              {/* Thin highlight along the top edge sells the 3D bevel. */}
              <line
                x1={FCX + 2}
                y1={layer.y0 + 1}
                x2={FCX + layer.topHalf - 2}
                y2={layer.y0 + 1}
                stroke="#ffffff"
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />
              {/* Leader tick + label hugging the funnel's right edge. */}
              <line
                x1={FCX + (layer.topHalf + layer.botHalf) / 2 + 4}
                y1={(layer.y0 + layer.y1) / 2}
                x2={FCX + (layer.topHalf + layer.botHalf) / 2 + 16}
                y2={(layer.y0 + layer.y1) / 2}
                stroke="var(--ink)"
                strokeOpacity="0.3"
                strokeWidth="1.5"
              />
              <text
                x={FCX + (layer.topHalf + layer.botHalf) / 2 + 21}
                y={(layer.y0 + layer.y1) / 2}
                dominantBaseline="central"
                fontWeight="600"
                fill="var(--ink)"
                className="solutions-funnel-label"
              >
                {layer.label}
              </text>
            </g>
          ))}

          {/* Breakage markers on the gray side: data escapes at every hand-off. */}
          {FUNNEL_BREAKS.map((brk) => (
            <g key={`${brk.x}-${brk.y}`} className={`solutions-node ${on ? "solutions-node-on" : ""}`} style={{ transitionDelay: "620ms" }}>
              {/* Leaking-data trail drifting down-left out of the funnel. */}
              <path
                d={`M ${brk.x - 8} ${brk.y} L ${brk.x - 34} ${brk.y + 14}`}
                stroke="#c25454"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray="3 4"
                fill="none"
              />
              <circle cx={brk.x - 38} cy={brk.y + 16} r="2" fill="#c25454" fillOpacity="0.55" />
              <circle cx={brk.x} cy={brk.y} r="8" fill="#ffffff" stroke="#c25454" strokeWidth="1.5" />
              <path d={`M ${brk.x - 3} ${brk.y - 3} L ${brk.x + 3} ${brk.y + 3} M ${brk.x + 3} ${brk.y - 3} L ${brk.x - 3} ${brk.y + 3}`} stroke="#c25454" strokeWidth="1.5" />
            </g>
          ))}

          {/* Center divider — at the exact middle of the viewBox. */}
          <line x1={FCX} y1="36" x2={FCX} y2="304" stroke="var(--ink)" strokeOpacity="0.3" strokeWidth="1.5" />

          {/* Connected side: data flows continuously down through every stage. */}
          <g className="solutions-flow-dot">
            {/* Connector stems in the gaps between layers. */}
            {[108, 170, 232].map((y) => (
              <path key={y} d={`M 390 ${y - 6} L 390 ${y + 6}`} stroke="var(--brand)" strokeWidth="2" strokeOpacity="0.6" />
            ))}
            {[0, 1, 2].map((dot) => (
              <circle key={dot} r="4" fill="#ffffff" stroke="var(--brand)" strokeWidth="1.5">
                <animateMotion dur="3.6s" begin={`${dot * 1.2}s`} repeatCount="indefinite" path="M 390 54 L 390 296" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.6s" begin={`${dot * 1.2}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>

          {/* Feedback loop: sales data flows back to the top of the funnel, swinging wide of the labels. */}
          <g className={`solutions-node ${on ? "solutions-node-on" : ""}`} style={{ transitionDelay: "520ms" }}>
            <path
              d="M 430 304 C 610 322 690 220 660 100 C 648 62 590 40 490 34"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="solutions-dash-flow"
            />
            <polygon points="490,34 505,29 500,42" fill="var(--brand)" />
            <text x="690" y="190" fontWeight="600" fill="var(--brand)" transform="rotate(90 690 190)" textAnchor="middle" className="solutions-funnel-loop-label">
              Terra IQ feedback loop
            </text>
          </g>
        </svg>

        {/* Captions under each half. The divider sits at the viewBox center,
            so an even split keeps the line exactly between the captions and
            centered under the section header. */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="text-center">
            <p className="text-[15px] font-semibold text-slate-500">Disconnected marketing</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500">
              Each channel optimized on its own. The funnel cracks, and nobody sees where it leaks.
            </p>
          </div>
          <div className="text-center">
            <p className="text-[15px] font-semibold text-ink">The Terramore way</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
              Every stage connected and measured, with what we learn feeding back into the next.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pillars showcase: three connected circles + progressive-disclosure  */
/* detail card, in the style of connected-node diagrams.               */
/* ------------------------------------------------------------------ */

const PILLARS_DATA = [
  {
    key: "intelligence",
    icon: BarChart3,
    ring: "border-brand/25 text-brand",
    dot: "bg-brand",
    title: "Terra IQ intelligence",
    heading: "Decisions backed by your own data.",
    body: "Attribution, dashboards, and reporting read what is actually happening across your site, ads, and follow-up, so the next move is based on evidence instead of feel.",
    chips: ["Analytics", "Attribution", "Dashboards", "Reporting"],
  },
  {
    key: "platform",
    icon: Workflow,
    ring: "border-[#6b8cff]/30 text-[#6b8cff]",
    dot: "bg-[#6b8cff]",
    title: "Automation platform",
    heading: "Follow-up that runs itself.",
    body: "CRM, email, SMS, and lead routing are wired together inside the tools you already pay for, so a new lead never sits still and nothing depends on someone remembering.",
    chips: ["CRM workflows", "Email", "SMS", "Lead routing"],
  },
  {
    key: "execution",
    icon: Target,
    ring: "border-[color:var(--gold-to)]/30 text-[color:var(--gold-to)]",
    dot: "bg-[color:var(--gold-to)]",
    title: "Strategic execution",
    heading: "People who do the work, inside your accounts.",
    body: "Positioning, offers, campaigns, and pages are planned and built hands-on, in your own accounts, so everything stays yours and keeps working.",
    chips: ["Positioning", "Offer strategy", "Campaigns", "Landing pages"],
  },
] as const

export function PillarsShowcase() {
  const [active, setActive] = useState(0)
  const current = PILLARS_DATA[active]

  return (
    <div className="mx-auto max-w-3xl">
      {/* Connected nodes: two up top, one centered below, dashed connectors. */}
      <div className="relative">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M 22 12 L 50 30 L 78 12" fill="none" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="1.4 1.4" />
          <path d="M 22 12 L 78 12" fill="none" stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="1.4 1.4" />
        </svg>
        <div className="relative grid grid-cols-3 items-start">
          {[0, 1, 2].map((index) => {
            const pillar = PILLARS_DATA[index]
            const selected = active === index
            return (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={`flex flex-col items-center gap-2 justify-self-center text-center ${index === 1 ? "mt-14 md:mt-20" : ""}`}
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white shadow-[0_10px_28px_-14px_rgba(15,30,46,0.35)] transition md:h-[4.5rem] md:w-[4.5rem] ${pillar.ring} ${
                    selected ? "scale-105 ring-2 ring-brand/30" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <pillar.icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <span className={`max-w-[8.5rem] text-[13px] font-semibold leading-tight md:text-[14px] ${selected ? "text-ink" : "text-ink/60"}`}>
                  {pillar.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail card for the selected pillar. */}
      <div key={current.key} className="mt-8 animate-fade-in rounded-[1.5rem] border border-brand/[0.12] bg-brand/[0.04] p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span aria-hidden className={`h-2 w-2 rounded-full ${current.dot}`} />
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/50">{current.title}</p>
        </div>
        <h3 className="mt-2 text-[1.25rem] font-bold tracking-tight text-ink md:text-[1.45rem]">{current.heading}</h3>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">{current.body}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {current.chips.map((chip) => (
            <li key={chip} className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-ink/70 ring-1 ring-ink/[0.06]">
              {chip}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex gap-1.5" role="tablist" aria-label="Pillar selector">
          {PILLARS_DATA.map((pillar, index) => (
            <button
              key={pillar.key}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={pillar.title}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${active === index ? "w-6 bg-brand" : "w-2 bg-ink/15 hover:bg-ink/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero website input (WebFX-style input + button, Terramore styling)  */
/* ------------------------------------------------------------------ */

export function HeroWebsiteInput() {
  const [website, setWebsite] = useState("")
  const [open, setOpen] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!website.trim()) return
    setOpen(true)
  }

  return (
    <div>
      <form onSubmit={submit} className="flex max-w-xl flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Enter your website</span>
          <input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="Enter your website"
            autoComplete="url"
            inputMode="url"
            className="h-12 w-full rounded-full border border-ink/10 bg-white px-5 text-[15px] text-ink placeholder:text-ink/40 shadow-[0_8px_30px_rgba(15,30,46,0.04)] outline-none focus:border-brand"
          />
        </label>
        <button
          type="submit"
          disabled={!website.trim()}
          title={!website.trim() ? "Enter your business website first" : undefined}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--gold-from)] to-[var(--gold-to)] px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(198,136,9,0.6)] transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          See my Digital Footprint
        </button>
      </form>
      <p className="mt-3 text-[14px] text-ink/50">
        Free written report, in your inbox in minutes. Or{" "}
        <BookingLink source="solutions" className="font-medium text-brand underline-offset-4 hover:text-brand-hover hover:underline">
          let&apos;s talk
        </BookingLink>
        .
      </p>
      <ReportPopup open={open} onClose={() => setOpen(false)} website={website.trim() || undefined} direct />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mid-page engine band: mini ring + website input, one measurable     */
/* system. Reuses the same popup infrastructure as the hero input.     */
/* ------------------------------------------------------------------ */

export function EngineBand() {
  return (
    <div className="grid items-center gap-8 rounded-[1.75rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-10 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="mx-auto w-full max-w-[15rem]">
        <HeroEngine compact />
      </div>
      <div>
        <h2 className="text-[1.5rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[1.9rem]">
          Turn your marketing into one measurable system.
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
          See how Terramore connects your site, ads, follow-up, and data into a system built to grow the business you already built.
        </p>
        <div className="mt-6">
          <HeroWebsiteInput />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero engine ring (structure inspired by segmented-ring diagrams;    */
/* Terramore colors, labels, and copy only)                            */
/* ------------------------------------------------------------------ */

const RING = [
  // 78-degree flat-cut donut arcs with 12-degree gaps, radius 140, center 200/200.
  // Segments are centered on the cardinal points so the label pills can sit on them.
  { id: "ring-acquisition", d: "M 111.9 91.2 A 140 140 0 0 1 288.1 91.2", color: "var(--brand)" },
  { id: "ring-conversion", d: "M 308.8 111.9 A 140 140 0 0 1 308.8 288.1", color: "var(--gold-to)" },
  { id: "ring-followup", d: "M 288.1 308.8 A 140 140 0 0 1 111.9 308.8", color: "#6b8cff" },
  { id: "ring-intelligence", d: "M 91.2 288.1 A 140 140 0 0 1 91.2 111.9", color: "var(--ink)" },
] as const

/* Junction nodes where one stage hands off to the next (45/135/225/315 degrees). */
const NODES = [
  { cx: 299, cy: 101 },
  { cx: 299, cy: 299 },
  { cx: 101, cy: 299 },
  { cx: 101, cy: 101 },
] as const

const PILLS = [
  { label: "Acquisition", dot: "bg-brand", position: "left-1/2 top-[8%] -translate-x-1/2" },
  { label: "Conversion", dot: "bg-[color:var(--gold-to)]", position: "right-[-3%] top-1/2 -translate-y-1/2" },
  { label: "Follow-up", dot: "bg-[#6b8cff]", position: "left-1/2 bottom-[8%] -translate-x-1/2" },
  { label: "Intelligence", dot: "bg-ink", position: "left-[-3%] top-1/2 -translate-y-1/2" },
] as const

export function HeroEngine({ compact = false }: { compact?: boolean }) {
  // Real-time clock hands. Angles are computed once on mount (client only, so
  // no hydration mismatch); from there CSS animations with negative delays
  // keep every hand moving continuously — the second hand sweeps like an
  // automatic watch instead of ticking.
  const [clock, setClock] = useState<{ s: number; m: number; h: number } | null>(null)

  useEffect(() => {
    const now = new Date()
    const s = now.getSeconds() + now.getMilliseconds() / 1000
    const m = now.getMinutes() * 60 + s
    const h = (now.getHours() % 12) * 3600 + m
    setClock({ s, m, h })
  }, [])

  return (
    <div
      className={`relative mx-auto aspect-square w-full ${compact ? "max-w-[15rem]" : "max-w-[26rem]"}`}
      role="img"
      aria-label="The Terramore growth system: acquisition, conversion, follow-up, and intelligence working as one connected engine"
    >
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden focusable="false">
        {/* Outer orbit ring with precise tick marks — instrument-panel feel. */}
        <circle cx="200" cy="200" r="172" fill="none" stroke="var(--ink)" strokeOpacity="0.1" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.14"
          strokeWidth="5"
          strokeDasharray="1 20"
        />

        {/* Working clock, drawn behind the stage segments. Hands emerge from
            under the center hub; the second hand's tip reaches past the ring. */}
        {clock && (
          <g aria-hidden>
            {/* Hour hand: 12h period = 43200s. */}
            <g
              className="solutions-clock-hand"
              style={{
                animationDuration: "43200s",
                animationDelay: `${-clock.h}s`,
                transform: `rotate(${(clock.h / 43200) * 360}deg)`,
              }}
            >
              <line x1="200" y1="200" x2="200" y2="90" stroke="var(--ink)" strokeOpacity="0.28" strokeWidth="5" strokeLinecap="round" />
            </g>
            {/* Minute hand: 60min period = 3600s. */}
            <g
              className="solutions-clock-hand"
              style={{
                animationDuration: "3600s",
                animationDelay: `${-clock.m}s`,
                transform: `rotate(${(clock.m / 3600) * 360}deg)`,
              }}
            >
              <line x1="200" y1="200" x2="200" y2="66" stroke="var(--ink)" strokeOpacity="0.32" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Second hand: continuous 60s sweep, with a counterweight tail. */}
            <g
              className="solutions-clock-hand"
              style={{
                animationDuration: "60s",
                animationDelay: `${-clock.s}s`,
                transform: `rotate(${(clock.s / 60) * 360}deg)`,
              }}
            >
              <line x1="200" y1="226" x2="200" y2="38" stroke="var(--gold-to)" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="200" cy="44" r="3" fill="var(--gold-to)" fillOpacity="0.75" />
            </g>
          </g>
        )}

        {/* Flat-cut donut segments. Butt caps keep the geometry crisp. */}
        {RING.map((segment) => (
          <path key={segment.id} d={segment.d} fill="none" stroke={segment.color} strokeWidth="24" strokeLinecap="butt" />
        ))}

        {/* Handoff nodes between stages. */}
        {NODES.map((node) => (
          <g key={`${node.cx}-${node.cy}`}>
            <circle cx={node.cx} cy={node.cy} r="8" fill="#ffffff" stroke="var(--brand)" strokeWidth="1.5" />
            <circle className="solutions-node-pulse" cx={node.cx} cy={node.cy} r="3" fill="var(--brand)" />
          </g>
        ))}

        {/* Inner dashed track around the hub. */}
        <circle
          cx="200"
          cy="200"
          r="106"
          fill="none"
          stroke="var(--brand)"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Orbiting data dots on the outer track — signal moving through the system. */}
        <g className="solutions-orbit">
          <circle cx="200" cy="28" r="5" fill="var(--brand)" />
          <circle cx="200" cy="24" r="9" fill="var(--brand)" fillOpacity="0.15" />
          <circle cx="200" cy="372" r="4" fill="var(--gold-to)" />
        </g>
      </svg>

      {/* Static center hub. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-[46%] w-[46%] flex-col items-center justify-center rounded-full border border-ink/[0.08] bg-white text-center shadow-[0_16px_40px_-18px_rgba(15,30,46,0.3)]">
          <p className={`font-bold leading-tight tracking-tight text-ink ${compact ? "text-[11px]" : "text-[15px]"}`}>Terramore</p>
          <p className={`font-semibold text-brand ${compact ? "text-[9px]" : "text-[12px]"}`}>Growth System</p>
          {compact ? null : <p className="mt-1 px-4 text-[10px] leading-snug text-ink/50">Strategize. Automate. Succeed.</p>}
        </div>
      </div>

      {/* Horizontal UI label pills, fixed at the cardinal points. */}
      {compact ? null : PILLS.map((pill) => (
        <div
          key={pill.label}
          className={`absolute ${pill.position} flex items-center gap-1.5 rounded-full border border-ink/[0.08] bg-white px-3 py-1.5 shadow-[0_6px_18px_-8px_rgba(15,30,46,0.25)]`}
        >
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${pill.dot}`} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">{pill.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* EngineExplorer: WebFX-style 3D funnel where each stage of the       */
/* growth engine reveals the work inside it. Left: copy + website      */
/* input. Right: stacked-cone funnel + detail panel for the active     */
/* stage. Keyboard users get the stage buttons; the funnel mirrors.    */

const ENGINE_STAGES = [
  {
    id: "strategy",
    title: "Strategy",
    line: "Know what to fix before spending more to drive traffic.",
    items: ["Positioning", "Offer strategy", "Audience", "Growth roadmap", "Acquisition planning"],
    grad: ["#4d7fff", "#1e4ecc"],
  },
  {
    id: "acquisition",
    title: "Acquisition",
    line: "Put the right message in front of the right people.",
    items: ["Google Ads", "Meta Ads", "TikTok", "Content", "Search", "Demand generation"],
    grad: ["#87a2ff", "#5272e0"],
  },
  {
    id: "conversion",
    title: "Conversion",
    line: "Turn attention into conversations and opportunities.",
    items: ["Websites", "Landing pages", "Lead capture", "Qualification", "Routing", "Booking"],
    grad: ["#f9c463", "#d69518"],
  },
  {
    id: "automation",
    title: "Automation",
    line: "Make follow-up happen without your team doing everything by hand.",
    items: ["CRM workflows", "Email", "SMS", "Lead nurture", "Routing", "AI-assisted workflows"],
    grad: ["#22375a", "#0a1624"],
  },
  {
    id: "intelligence",
    title: "Intelligence",
    line: "Know what's working, where you lose opportunities, and what to do next.",
    items: ["Analytics", "Attribution", "Reporting", "Terra IQ", "Customer journey data"],
    grad: ["#2a66ff", "#173a8f"],
  },
] as const

export function EngineExplorer() {
  const [active, setActive] = useState(0)
  const stage = ENGINE_STAGES[active]

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      {/* Left: copy + website input, mirroring the hero infrastructure. */}
      <div>
        <p className="section-eyebrow">How Terramore connects growth</p>
        <h2 className="mt-3 max-w-lg text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          See how each piece of the engine <span className="text-gold">grows your business.</span>
        </h2>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-slate-600">
          Connected strategies work together to drive revenue, and Terra IQ makes it all attributable. Pick a stage to
          see the work inside it.
        </p>
        <div className="mt-7">
          <HeroWebsiteInput />
        </div>
      </div>

      {/* Right: stage bubbles + active-stage detail (funnel removed). */}
      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Growth engine stages">
            {ENGINE_STAGES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                  active === index
                    ? "bg-brand text-white"
                    : "bg-white text-ink/70 shadow-[0_2px_10px_rgba(15,30,46,0.06)] ring-1 ring-ink/[0.08] hover:text-ink"
                }`}
              >
                {item.title}
              </button>
            ))}
        </div>
        <div key={stage.id} className="mt-5 animate-fade-in rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-7">
          <h3 className="text-[1.25rem] font-semibold tracking-tight text-ink">{stage.title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{stage.line}</p>
          <ul className="mt-4 space-y-2">
            {stage.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[14px] font-medium text-ink/80">
                <ArrowRight className="h-3.5 w-3.5 text-brand" strokeWidth={2} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
