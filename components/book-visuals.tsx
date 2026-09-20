"use client"

/**
 * Client-side visuals for the /book page (Chargebee-inspired architecture,
 * Terramore identity). Everything here is presentation only — the booking
 * flow, its API, and its tracking live untouched in booking-flow.tsx.
 *
 * Motion language: scroll-triggered reveals, slow image pushes (classes from
 * globals.css), and a staged workflow progression. All motion respects
 * prefers-reduced-motion.
 */

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { BookingLink } from "@/components/booking-popup"

/* ------------------------------------------------------------------ */
/* Shared: reveal-once-on-scroll wrapper.                              */
/* ------------------------------------------------------------------ */

function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, shown }
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, shown } = useRevealOnce<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* HeroSystemDeck: Chargebee-style hero deck. A stage strip with a     */
/* running timer indicates what's next; each stage is a "card" that    */
/* falls off the deck as the next one rises in, annotated with small   */
/* popup tiles. Auto-advances, pauses on hover, and under              */
/* prefers-reduced-motion becomes a manual, static switcher.           */
/* ------------------------------------------------------------------ */

const DECK_INTERVAL_MS = 5000

type DeckStage = {
  id: string
  label: string
  title: string
  pops: { text: string; tone: "brand" | "gold" | "ink"; position: string }[]
}

const DECK_STAGES: DeckStage[] = [
  {
    id: "strategy",
    label: "Strategy",
    title: "Your growth roadmap",
    pops: [
      { text: "Built before you sign anything", tone: "gold", position: "right-3 top-6 sm:-right-4" },
      { text: "Priorities, not guesses", tone: "ink", position: "left-3 bottom-10 sm:-left-4" },
    ],
  },
  {
    id: "acquisition",
    label: "Acquisition",
    title: "Campaigns in flight",
    pops: [
      { text: "Google · Meta · TikTok", tone: "brand", position: "left-3 top-8 sm:-left-4" },
      { text: "First campaign live in ~7 days", tone: "gold", position: "right-3 bottom-12 sm:-right-4" },
    ],
  },
  {
    id: "conversion",
    label: "Conversion",
    title: "The click has somewhere to go",
    pops: [
      { text: "New lead captured", tone: "brand", position: "right-3 top-10 sm:-right-4" },
      { text: "Pages built to convert", tone: "ink", position: "left-3 bottom-8 sm:-left-4" },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    title: "Follow-up that runs itself",
    pops: [
      { text: "Reply sent in 2 minutes", tone: "gold", position: "left-3 top-8 sm:-left-4" },
      { text: "Nothing depends on memory", tone: "ink", position: "right-3 bottom-10 sm:-right-4" },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    title: "Terra IQ — what pays",
    pops: [
      { text: "Every dollar traced to source", tone: "brand", position: "right-3 top-8 sm:-right-4" },
      { text: "Sample data shown", tone: "ink", position: "left-3 bottom-12 sm:-left-4" },
    ],
  },
  {
    id: "revenue",
    label: "Revenue",
    title: "The system pays for itself",
    pops: [
      { text: "Booked calls, not vanity clicks", tone: "gold", position: "left-3 top-10 sm:-left-4" },
      { text: "This is what we'd build for you", tone: "brand", position: "right-3 bottom-8 sm:-right-4" },
    ],
  },
]

/* Skeleton bar helper for the card mock-ups. */
function Bar({ w, tone = "ink", h = "h-2" }: { w: string; tone?: "ink" | "brand" | "gold" | "faint"; h?: string }) {
  const tones = {
    ink: "bg-ink/60",
    brand: "bg-brand/70",
    gold: "bg-gold-from/80",
    faint: "bg-ink/15",
  } as const
  return <span className={`block ${h} rounded-full ${tones[tone]}`} style={{ width: w }} />
}

/* Six believable, brand-colored interface vignettes — one per stage. */
function DeckCardArt({ id }: { id: string }) {
  switch (id) {
    case "strategy":
      return (
        <div className="flex h-full gap-4 p-5 sm:p-7">
          <div className="flex-1 space-y-3">
            <Bar w="55%" tone="ink" h="h-2.5" />
            <Bar w="80%" tone="faint" />
            <Bar w="70%" tone="faint" />
            <div className="mt-4 space-y-2.5 rounded-xl bg-cream p-3.5">
              {["70%", "55%", "62%"].map((w, i) => (
                <div key={w} className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${i === 0 ? "bg-gold-from text-ink" : "bg-ink/10 text-ink/50"}`}>{i + 1}</span>
                  <Bar w={w} tone={i === 0 ? "ink" : "faint"} />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden w-2/5 flex-col justify-center gap-2 sm:flex">
            {["Aware", "Consider", "Buy", "Return"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${i <= 1 ? "bg-brand" : "bg-ink/20"}`} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">{s}</span>
                {i < 3 ? null : <span className="ml-1 text-[10px] text-gold-from">★</span>}
              </div>
            ))}
          </div>
        </div>
      )
    case "acquisition":
      return (
        <div className="flex h-full flex-col justify-center gap-2.5 p-5 sm:p-7">
          {[
            { name: "Summer launch", w: "78%", on: true },
            { name: "Search — brand", w: "64%", on: true },
            { name: "Retargeting", w: "45%", on: true },
            { name: "Holiday preview", w: "30%", on: false },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-3 rounded-xl bg-cream px-3.5 py-2.5">
              <span className={`h-2 w-2 shrink-0 rounded-full ${c.on ? "bg-brand" : "bg-ink/20"}`} />
              <span className="w-24 shrink-0 text-[11px] font-semibold text-ink/70 sm:w-28 sm:text-[12px]">{c.name}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.08]">
                <span className={`block h-full rounded-full ${c.on ? "bg-brand/70" : "bg-ink/15"}`} style={{ width: c.w }} />
              </span>
            </div>
          ))}
        </div>
      )
    case "conversion":
      return (
        <div className="flex h-full items-center justify-center gap-5 p-5 sm:p-7">
          <div className="h-full max-h-40 flex-1 space-y-2.5 rounded-xl border border-ink/[0.08] bg-white p-4">
            <div className="flex gap-1"><span className="h-1.5 w-1.5 rounded-full bg-ink/20" /><span className="h-1.5 w-1.5 rounded-full bg-ink/20" /><span className="h-1.5 w-1.5 rounded-full bg-ink/20" /></div>
            <Bar w="60%" tone="ink" h="h-2.5" />
            <Bar w="85%" tone="faint" />
            <span className="mt-2 inline-block rounded-full bg-brand px-4 py-1.5 text-[10px] font-semibold text-white">Book now</span>
            <Bar w="45%" tone="faint" />
          </div>
          <div className="hidden h-full max-h-44 w-24 flex-col justify-between rounded-[1.1rem] border border-ink/[0.1] bg-white p-2.5 sm:flex">
            <span className="mx-auto h-1 w-8 rounded-full bg-ink/15" />
            <div className="space-y-1.5">
              <Bar w="80%" tone="faint" h="h-1.5" />
              <Bar w="60%" tone="faint" h="h-1.5" />
            </div>
            <span className="rounded-full bg-brand py-1 text-center text-[8px] font-semibold text-white">Book now</span>
          </div>
        </div>
      )
    case "automation":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 p-5">
          {["New lead", "Qualified", "Follow-up sent", "Booked"].map((s, i) => (
            <div key={s} className="flex flex-col items-center">
              {i > 0 ? <span className="h-3 w-px bg-brand/40" /> : null}
              <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${i === 3 ? "bg-gold-from/20 text-ink" : "bg-cream text-ink/70"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${i === 3 ? "bg-gold-from" : "bg-brand"}`} />
                <span className="text-[11px] font-semibold sm:text-[12px]">{s}</span>
              </div>
            </div>
          ))}
        </div>
      )
    case "intelligence":
      return (
        <div className="flex h-full items-end justify-center gap-2 p-6 sm:gap-3 sm:p-8">
          {[35, 48, 42, 60, 55, 74, 68, 88].map((h, i) => (
            <div key={i} className="flex w-6 flex-col items-center gap-1.5 sm:w-8">
              <span
                className={`w-full rounded-t-md ${i === 7 ? "bg-gold-from" : "bg-brand/60"}`}
                style={{ height: `${h * 1.4}px` }}
              />
              <span className="h-1 w-4 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
      )
    default: // revenue
      return (
        <div className="flex h-full items-center justify-center gap-5 p-5 sm:gap-8 sm:p-7">
          <div className="space-y-1.5 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">Booked calls</p>
            <p className="text-[1.9rem] font-bold tracking-[-0.02em] text-ink sm:text-[2.4rem]">↑</p>
            <Bar w="70px" tone="gold" h="h-1.5" />
          </div>
          <svg viewBox="0 0 200 80" className="h-20 w-40 sm:h-24 sm:w-52" aria-hidden>
            <path d="M0,70 C40,65 60,50 90,45 C120,40 140,25 200,8" fill="none" stroke="var(--gold-from)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="200" cy="8" r="5" fill="var(--gold-from)" />
          </svg>
        </div>
      )
  }
}

export function HeroSystemDeck() {
  const [stage, setStage] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (paused || reduced) return
    const timer = window.setInterval(() => {
      setStage((s) => {
        setPrev(s)
        return (s + 1) % DECK_STAGES.length
      })
    }, DECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [paused, reduced])

  const goTo = (i: number) => {
    if (i === stage) return
    setPrev(stage)
    setStage(i)
  }

  return (
    <div
      className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-white via-cream to-gold-from/25 shadow-[0_24px_70px_rgba(15,30,46,0.12)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stage strip: the "timer" that says what's coming next. */}
      <div className="scrollbar-none overflow-x-auto px-4 pt-6 sm:px-8">
        <ol className="mx-auto flex w-max items-center gap-1 sm:gap-2">
          {DECK_STAGES.map((s, i) => (
            <li key={s.id} className="flex items-center">
              {i > 0 ? <span aria-hidden className="mx-1 h-px w-4 bg-ink/15 sm:w-7" /> : null}
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === stage ? "step" : undefined}
                className={`relative rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors sm:px-3 sm:text-[11px] ${
                  i === stage ? "text-brand" : i < stage ? "text-ink/55" : "text-ink/30 hover:text-ink/55"
                }`}
              >
                {s.label}
                {/* Per-stage progress underline = the timer. */}
                <span aria-hidden className="absolute inset-x-2.5 -bottom-0.5 h-[2px] overflow-hidden rounded-full bg-ink/[0.08]">
                  {i === stage && !reduced ? (
                    <span
                      key={stage}
                      className="deck-progress block h-full rounded-full bg-brand"
                      style={{ animationDuration: `${DECK_INTERVAL_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                    />
                  ) : i === stage ? (
                    <span className="block h-full rounded-full bg-brand" />
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* The deck. Cards fall off the front as the next rises from behind. */}
      <div className="relative mx-auto mt-6 h-64 max-w-2xl px-4 pb-10 sm:h-72 sm:px-0 md:h-80">
        {DECK_STAGES.map((s, i) => {
          const isActive = i === stage
          const isLeaving = i === prev
          return (
            <div
              key={s.id}
              aria-hidden={!isActive}
              className={`absolute inset-x-4 top-0 bottom-10 transition-all duration-700 ease-out sm:inset-x-0 ${
                isActive
                  ? "z-20 translate-y-0 rotate-0 scale-100 opacity-100"
                  : isLeaving
                    ? "z-30 translate-y-16 rotate-2 scale-[0.98] opacity-0"
                    : "z-10 -translate-y-3 scale-[0.94] opacity-0"
              }`}
            >
              <div className="relative h-full rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-[0_16px_50px_rgba(15,30,46,0.14)]">
                <p className="absolute left-5 top-4 z-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/35 sm:left-7">
                  {s.title}
                </p>
                <div className="h-full pt-8">
                  <DeckCardArt id={s.id} />
                </div>

                {/* Popup annotation tiles. Re-mounted per activation so they stagger in. */}
                {isActive
                  ? s.pops.map((pop, pi) => (
                      <div
                        key={`${stage}-${pi}`}
                        className={`deck-pop absolute z-20 ${pop.position}`}
                        style={{ animationDelay: `${450 + pi * 350}ms` }}
                      >
                        <span
                          className={`inline-block rounded-xl px-3.5 py-2 text-[11px] font-semibold shadow-[0_10px_30px_rgba(15,30,46,0.18)] sm:text-[12px] ${
                            pop.tone === "brand"
                              ? "bg-brand text-white"
                              : pop.tone === "gold"
                                ? "bg-gold-from text-ink"
                                : "bg-ink text-white"
                          }`}
                        >
                          {pop.text}
                        </span>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* SystemNav: horizontal growth-system navigation (Chargebee category  */
/* strip → Terramore growth system). Anchors scroll to sections;       */
/* the section currently in view is highlighted. Swipes on mobile.     */
/* ------------------------------------------------------------------ */

const SYSTEM_SECTIONS = [
  { id: "strategy", label: "Strategy" },
  { id: "acquisition", label: "Acquisition" },
  { id: "conversion", label: "Conversion" },
  { id: "automation", label: "Automation" },
  { id: "intelligence", label: "Intelligence" },
  { id: "revenue", label: "Revenue" },
] as const

export function SystemNav() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const targets = SYSTEM_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!targets.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="The Terramore growth system" className="border-y border-black/[0.06] bg-white/70 backdrop-blur">
      <div className="page-shell">
        <ul className="scrollbar-none -mx-1 flex items-center gap-1 overflow-x-auto py-1">
          {SYSTEM_SECTIONS.map((section, i) => (
            <li key={section.id} className="flex shrink-0 items-center">
              {i > 0 ? <span aria-hidden className="mx-1 hidden text-[11px] text-ink/20 sm:inline">→</span> : null}
              <a
                href={`#${section.id}`}
                className={`inline-flex items-center rounded-full px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition ${
                  active === section.id ? "bg-ink text-white" : "text-ink/55 hover:text-ink"
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* AutomationFlow: one lead travels the workflow; nodes activate in    */
/* sequence when the section scrolls into view, then the loop repeats. */
/* ------------------------------------------------------------------ */

const FLOW_NODES = ["New lead", "Qualify", "Route", "Follow up", "Booked", "Client"] as const
const STEP_MS = 900

export function AutomationFlow() {
  const { ref, shown } = useRevealOnce<HTMLDivElement>()
  const [step, setStep] = useState(-1)

  useEffect(() => {
    if (!shown) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(FLOW_NODES.length - 1)
      return
    }
    let current = -1
    const timer = window.setInterval(() => {
      current += 1
      if (current > FLOW_NODES.length + 1) current = 0 // brief pause, then loop
      setStep(current)
    }, STEP_MS)
    return () => window.clearInterval(timer)
  }, [shown])

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-[#1c3350] p-6 sm:p-10">
      <ol className="flex w-full max-w-xs flex-col gap-0" aria-label="A lead moving through the automated workflow">
        {FLOW_NODES.map((label, i) => {
          const isActive = step >= i
          const isCurrent = step === i
          return (
            <li key={label} className="flex flex-col">
              <div
                className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-500 ${
                  isActive ? "border-gold-from/60 bg-white/10" : "border-white/10 bg-white/[0.03]"
                } ${isCurrent ? "scale-[1.03]" : ""}`}
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-500 ${isActive ? "bg-gold-from" : "bg-white/25"}`}
                />
                <span className={`text-[13px] font-semibold tracking-tight transition-colors duration-500 ${isActive ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
                {isCurrent && i === FLOW_NODES.length - 1 ? (
                  <span className="ml-auto rounded-full bg-gold-from/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-from">
                    Done
                  </span>
                ) : null}
              </div>
              {i < FLOW_NODES.length - 1 ? (
                <span
                  aria-hidden
                  className={`ml-[1.35rem] h-4 w-px transition-colors duration-500 ${step > i ? "bg-gold-from/60" : "bg-white/15"}`}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* StagedShowcase: Chargebee "Automate your revenue" pattern.          */
/* Left rail is sticky: stage pills highlight as the right column      */
/* scrolls through each stage's tile group, and the persona (photo +   */
/* role + quote) crossfades to match. Mobile collapses the rail into   */
/* per-group headers with a persona chip.                              */
/* ------------------------------------------------------------------ */

type ShowcaseTile = {
  kind: "text" | "dark" | "photo" | "gold" | "flow"
  title: string
  body?: string
  cta?: { label: string; href: string }
  image?: string
  alt?: string
  art?: "campaigns" | "chart"
}

type ShowcaseStage = {
  id: string
  label: string
  persona: { image: string; name: string; role: string; quote: string }
  tiles: ShowcaseTile[]
}

const SHOWCASE_STAGES: ShowcaseStage[] = [
  {
    id: "stage-discover",
    label: "Get discovered",
    persona: {
      image: "/founder/adam-moreno-headshot.png",
      name: "Adam Moreno",
      role: "Founder, Terramore",
      quote:
        "We built Terramore so owners could see their marketing the way the biggest advertisers do — and act on it.",
    },
    tiles: [
      {
        kind: "text",
        title: "Start with strategy, not spend",
        body: "We map where growth is stuck, what's already working, and which channels deserve budget — before a single dollar goes to ads.",
        cta: { label: "Marketing strategy →", href: "/marketing" },
      },
      {
        kind: "dark",
        art: "campaigns",
        title: "Campaigns across Google, Meta, and TikTok",
        body: "Built, launched, and operated by one team — creative, budgets, and audiences working together.",
        cta: { label: "Ad campaigns →", href: "/marketing" },
      },
      {
        kind: "photo",
        image: "/marketing/services/creative.png",
        alt: "A wall of colorful ad concept variations in a bright studio",
        title: "Creative that stays fresh",
        body: "Scheduled refreshes keep your ads working while everyone else's fatigue.",
        cta: { label: "Ad creative →", href: "/marketing" },
      },
    ],
  },
  {
    id: "stage-convert",
    label: "Turn attention into booked work",
    persona: {
      image: "/founder/team-sales.png",
      name: "Client growth",
      role: "Head of Sales, Terramore",
      quote: "Speed wins deals. When a lead comes in, the follow-up is already moving — before your competitor calls back.",
    },
    tiles: [
      {
        kind: "photo",
        image: "/marketing/services/landing.png",
        alt: "A landing page shown on desktop and mobile, built around one clear call to action",
        title: "Landing pages built to convert",
        body: "The click gets a page with one job: turn attention into a lead.",
        cta: { label: "Conversion →", href: "/solutions" },
      },
      {
        kind: "flow",
        title: "Follow-up in minutes, not days",
        body: "Lead capture, qualification, routing, and follow-up run automatically.",
        cta: { label: "Automation →", href: "/solutions" },
      },
      {
        kind: "gold",
        title: "Booking built in",
        body: "A visitor can go from your ad to a confirmed time on your calendar without anyone touching it. You just show up to the call.",
        cta: { label: "Book a demo →", href: "#calendar" },
      },
    ],
  },
  {
    id: "stage-measure",
    label: "Know what's actually working",
    persona: {
      image: "/founder/team-product.png",
      name: "Terra IQ",
      role: "Head of Product, Terramore",
      quote: "If you can't trace a sale back to its source, you're guessing. Terra IQ takes the guessing out.",
    },
    tiles: [
      {
        kind: "dark",
        art: "chart",
        title: "Terra IQ ties revenue to its source",
        body: "Campaigns, leads, and sales in one picture — so budget moves toward what pays.",
        cta: { label: "Analytics & attribution →", href: "/marketing" },
      },
      {
        kind: "text",
        title: "Reporting in plain language",
        body: "You'll know what we changed, why, and what it returned. No 40-page PDFs, no vanity metrics.",
      },
      {
        kind: "gold",
        title: "Your roadmap costs $0",
        body: "We build your growth roadmap before you sign anything — and it's yours to keep either way.",
        cta: { label: "Get your roadmap →", href: "#calendar" },
      },
    ],
  },
]

/* Mini CSS visuals for the dark tiles. */
function ShowcaseArt({ art }: { art: "campaigns" | "chart" }) {
  if (art === "campaigns") {
    return (
      <div className="space-y-2" aria-hidden>
        {[
          { w: "76%", on: true },
          { w: "58%", on: true },
          { w: "34%", on: false },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white/[0.07] px-3 py-2">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.on ? "bg-gold-from" : "bg-white/25"}`} />
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <span className={`block h-full rounded-full ${c.on ? "bg-white/60" : "bg-white/20"}`} style={{ width: c.w }} />
            </span>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex items-end gap-1.5" aria-hidden>
      {[30, 44, 38, 56, 50, 68, 84].map((h, i) => (
        <span
          key={i}
          className={`w-5 rounded-t ${i === 6 ? "bg-gold-from" : "bg-white/30"}`}
          style={{ height: `${h * 0.8}px` }}
        />
      ))}
    </div>
  )
}

function ShowcaseTileCard({ tile }: { tile: ShowcaseTile }) {
  /* CTAs that used to anchor to the calendar now open the booking popup
     (same qualifying questionnaire) in place — no jumping around the page. */
  const cta = tile.cta ? (
    <span className="mt-4 inline-block">
      {tile.cta.href.startsWith("#") ? (
        <BookingLink
          source="book"
          className="inline-flex rounded-full border border-current px-3.5 py-1.5 text-[12px] font-semibold"
        >
          {tile.cta.label}
        </BookingLink>
      ) : (
        <Link
          href={tile.cta.href}
          className="inline-flex rounded-full border border-current px-3.5 py-1.5 text-[12px] font-semibold"
        >
          {tile.cta.label}
        </Link>
      )}
    </span>
  ) : null

  switch (tile.kind) {
    case "dark":
      return (
        <div className="flex h-full flex-col rounded-[1.5rem] bg-gradient-to-br from-ink to-[#1c3350] p-6 text-white shadow-[0_12px_40px_rgba(15,30,46,0.18)]">
          {tile.art ? (
            <div className="mb-5">
              <ShowcaseArt art={tile.art} />
            </div>
          ) : null}
          <h4 className="text-[16px] font-bold leading-snug tracking-tight">{tile.title}</h4>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{tile.body}</p>
          <div className="mt-auto text-white/90">{cta}</div>
        </div>
      )
    case "photo":
      return (
        <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_40px_rgba(15,30,46,0.08)]">
          <div className="relative h-36 overflow-hidden sm:h-40">
            <Image
              src={tile.image!}
              alt={tile.alt || ""}
              width={1024}
              height={768}
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="marketing-showcase-push absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-6 pt-5">
            <h4 className="text-[16px] font-bold leading-snug tracking-tight text-ink">{tile.title}</h4>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{tile.body}</p>
            <div className="mt-auto text-brand">{cta}</div>
          </div>
        </div>
      )
    case "gold":
      return (
        <div className="flex h-full flex-col rounded-[1.5rem] bg-gradient-to-br from-gold-from/25 to-gold-from/10 p-6 shadow-[0_12px_40px_rgba(15,30,46,0.06)] ring-1 ring-gold-from/30">
          <h4 className="text-[16px] font-bold leading-snug tracking-tight text-ink">{tile.title}</h4>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-700">{tile.body}</p>
          <div className="mt-auto text-ink">{cta}</div>
        </div>
      )
    case "flow":
      return (
        <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-ink to-[#1c3350] p-6 text-white shadow-[0_12px_40px_rgba(15,30,46,0.18)]">
          <div className="mb-5 space-y-1.5" aria-hidden>
            {["New lead", "Follow-up sent", "Booked"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 ? <span className="ml-[3px] h-2 w-px bg-gold-from/50" /> : null}
                <span className={`h-1.5 w-1.5 rounded-full ${i === 2 ? "bg-gold-from" : "bg-white/50"}`} />
                <span className="text-[11px] font-semibold text-white/75">{s}</span>
              </div>
            ))}
          </div>
          <h4 className="text-[16px] font-bold leading-snug tracking-tight">{tile.title}</h4>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{tile.body}</p>
          <div className="mt-auto text-white/90">{cta}</div>
        </div>
      )
    default:
      return (
        <div className="flex h-full flex-col rounded-[1.5rem] bg-white p-6 shadow-[0_12px_40px_rgba(15,30,46,0.08)]">
          <h4 className="text-[16px] font-bold leading-snug tracking-tight text-ink">{tile.title}</h4>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{tile.body}</p>
          <div className="mt-auto text-brand">{cta}</div>
        </div>
      )
  }
}

function PersonaCard({ persona, compact = false }: { persona: ShowcaseStage["persona"]; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image src={persona.image} alt={persona.name} width={96} height={96} className="h-full w-full object-cover object-top" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-ink">{persona.name}</p>
          <p className="text-[12px] text-slate-500">{persona.role}</p>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="h-20 w-20 overflow-hidden rounded-full shadow-[0_8px_24px_rgba(15,30,46,0.15)]">
        <Image src={persona.image} alt={persona.name} width={160} height={160} className="h-full w-full object-cover object-top" />
      </div>
      <p className="mt-4 text-[15px] font-semibold text-ink">{persona.name}</p>
      <p className="text-[13px] text-slate-500">{persona.role}</p>
      <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-slate-600">&ldquo;{persona.quote}&rdquo;</p>
    </div>
  )
}

export function StagedShowcase() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const targets = SHOWCASE_STAGES.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!targets.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SHOWCASE_STAGES.findIndex((s) => s.id === entry.target.id)
            if (idx !== -1) setActive(idx)
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  const activePersona = SHOWCASE_STAGES[active].persona

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
      {/* Left rail: sticky stage pills + crossfading persona (desktop only) */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <ol className="space-y-2">
            {SHOWCASE_STAGES.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={i === active ? "true" : undefined}
                  className={`inline-flex rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-300 ${
                    i === active
                      ? "bg-brand text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
                      : "text-ink/45 hover:text-ink"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ol>

          {/* Persona: crossfades AND slides top → middle → bottom with the
              active stage, echoing the scroll position of the right column. */}
          <div
            className="relative mt-10 min-h-[16rem] transition-transform duration-700 ease-out"
            style={{ transform: `translateY(${active * 88}px)` }}
          >
            {SHOWCASE_STAGES.map((s, i) => (
              <div
                key={s.id}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition-opacity duration-500 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <PersonaCard persona={s.persona} />
              </div>
            ))}
          </div>
          {/* Spacer so the sticky block reserves room for the slide. */}
          <div aria-hidden className="h-44" />
        </div>
      </div>

      {/* Right: scrolling tile groups per stage */}
      <div className="space-y-16 md:space-y-20">
        {SHOWCASE_STAGES.map((s) => (
          <div key={s.id} id={s.id} className="scroll-mt-32">
            {/* Mobile-only stage header with persona chip */}
            <div className="mb-5 lg:hidden">
              <p className="inline-flex rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white">{s.label}</p>
              <div className="mt-4">
                <PersonaCard persona={s.persona} compact />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {s.tiles.map((tile, i) => (
                <Reveal key={tile.title} delay={i * 100} className={i === 0 ? "sm:col-span-2" : ""}>
                  <ShowcaseTileCard tile={tile} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TerraIQTile: dark product-artifact tile modeled on Chargebee's      */
/* invoice card — a "monthly snapshot" that ties channels to revenue.  */
/* Sample data is clearly illustrative.                                */
/* ------------------------------------------------------------------ */

const IQ_ROWS = [
  { channel: "Paid search", leads: 46, revenue: "$4,740" },
  { channel: "Meta ads", leads: 38, revenue: "$3,910" },
  { channel: "Email & SMS", leads: 24, revenue: "$2,780" },
  { channel: "Organic & maps", leads: 12, revenue: "$1,050" },
] as const

export function TerraIQTile() {
  return (
    <Reveal>
      <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink to-[#1c3350] p-7 shadow-[0_24px_70px_rgba(15,30,46,0.25)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
        {/* Copy side */}
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-from">Terra IQ</p>
          <h2 className="mt-3 text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-[2rem]">
            One report that ties every channel back to revenue.
          </h2>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/70">
            Every month you see what each channel produced — leads, sales, and dollars — so budget decisions stop being
            arguments and start being arithmetic.
          </p>
          <BookingLink
            source="book"
            className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-ink transition hover:bg-white/90"
          >
            See it on your numbers →
          </BookingLink>
        </div>

        {/* Artifact side: the monthly snapshot "invoice" */}
        <div className="relative rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/80">Sample Business Co.</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">Monthly snapshot · illustrative</p>
            </div>
            <div className="rounded-lg border border-gold-from/60 px-3 py-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-from">Revenue attributed</p>
              <p className="text-[15px] font-bold text-white">$12,480</p>
            </div>
          </div>

          <div className="mt-5 border-t border-white/10">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
              <span>Channel</span>
              <span className="text-right">Leads</span>
              <span className="text-right">Revenue</span>
            </div>
            {IQ_ROWS.map((row, i) => (
              <div
                key={row.channel}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-6 rounded-lg px-2 py-2.5 text-[12.5px] sm:text-[13px] ${
                  i === 0 ? "bg-white/[0.07]" : ""
                }`}
              >
                <span className="font-semibold text-white/85">{row.channel}</span>
                <span className="text-right tabular-nums text-white/60">{row.leads}</span>
                <span className={`text-right font-semibold tabular-nums ${i === 0 ? "text-gold-from" : "text-white/85"}`}>
                  {row.revenue}
                </span>
              </div>
            ))}
            <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-x-6 border-t border-white/15 px-2 pt-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Total</span>
              <span className="text-[15px] font-bold tabular-nums text-white">$12,480</span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* ConnectedChain: the "pieces work better together" editorial visual. */
/* A simple chain that lights up left-to-right on reveal — not a       */
/* duplicate of the /solutions system diagram.                         */
/* ------------------------------------------------------------------ */

export function ConnectedChain() {
  const { ref, shown } = useRevealOnce<HTMLDivElement>()

  return (
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-y-3">
      {SYSTEM_SECTIONS.map((section, i) => (
        <div key={section.id} className="flex items-center">
          {i > 0 ? (
            <span
              aria-hidden
              className={`mx-2 h-px w-5 origin-left bg-gold-from transition-transform duration-500 sm:w-8 ${shown ? "scale-x-100" : "scale-x-0"}`}
              style={{ transitionDelay: `${i * 180}ms` }}
            />
          ) : null}
          <span
            className={`rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-500 sm:px-4 sm:text-[12px] ${
              shown ? "border-ink/15 bg-white text-ink opacity-100" : "border-transparent bg-white/50 text-ink/30 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 180 + 90}ms` }}
          >
            {section.label}
          </span>
        </div>
      ))}
    </div>
  )
}
