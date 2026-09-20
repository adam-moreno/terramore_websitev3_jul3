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

type DeckPop = {
  label: string
  value: string
  delta?: string
  deltaTone?: "up" | "gold" | "muted"
  chips?: string[]
  position: string
}

type DeckStage = {
  id: string
  label: string
  title: string
  pops: DeckPop[]
}

/* Pop tiles hang off the card: the first at the top-right edge, the second
   at the bottom-left, so neither sits on the card's title or key data. On
   mobile the bottom tile hangs lower so it clears the last table row. */
const POP_TOP = "right-3 -top-8 sm:-right-6 sm:-top-5"
const POP_BOTTOM = "left-3 -bottom-9 sm:-left-7 sm:-bottom-7"

const DECK_STAGES: DeckStage[] = [
  {
    id: "strategy",
    label: "Strategy",
    title: "Growth roadmap",
    pops: [
      { label: "Roadmap cost", value: "$0", delta: "Yours to keep", deltaTone: "gold", position: POP_TOP },
      { label: "Priorities found", value: "3", chips: ["Follow-up", "Landing page", "Retargeting"], position: POP_BOTTOM },
    ],
  },
  {
    id: "acquisition",
    label: "Acquisition",
    title: "Campaign performance",
    pops: [
      { label: "Leads · 30 days", value: "86", delta: "+31%", deltaTone: "up", position: POP_TOP },
      { label: "Channels live", value: "3", chips: ["Google", "Meta", "TikTok"], position: POP_BOTTOM },
    ],
  },
  {
    id: "conversion",
    label: "Conversion",
    title: "Landing page performance",
    pops: [
      { label: "Conversion rate", value: "7.2%", delta: "+2.9 pts", deltaTone: "up", position: POP_TOP },
      { label: "New lead", value: "Inquiry · 2:14 PM", chips: ["Brand search", "Mobile"], position: POP_BOTTOM },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    title: "Follow-up log",
    pops: [
      { label: "First reply", value: "2 min", delta: "median", deltaTone: "muted", position: POP_TOP },
      { label: "Handled automatically", value: "100%", chips: ["Qualify", "Route", "Follow up"], position: POP_BOTTOM },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    title: "Terra IQ · revenue by source",
    pops: [
      { label: "Revenue attributed", value: "$12,480", delta: "+18%", deltaTone: "up", position: POP_TOP },
      { label: "Best return", value: "Brand search", delta: "3.1×", deltaTone: "gold", position: POP_BOTTOM },
    ],
  },
  {
    id: "revenue",
    label: "Revenue",
    title: "Booked calls & revenue",
    pops: [
      { label: "Booked calls", value: "24", delta: "+15 vs last month", deltaTone: "up", position: POP_TOP },
      { label: "Cost per booked call", value: "$214", delta: "−22%", deltaTone: "up", position: POP_BOTTOM },
    ],
  },
]

/* ---- Report-surface primitives (shared by the six card faces) ---- */

/** Small monospace section label, as on a reporting screen. */
function ReportLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink/45 ${className}`}>{children}</p>
}

/** Column header row for the mini tables. */
type HeadCol = string | { label: string; smOnly?: boolean }

function TableHead({ cols, grid }: { cols: HeadCol[]; grid: string }) {
  return (
    <div className={`grid ${grid} gap-x-3 border-b border-ink/[0.06] bg-cream px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/40`}>
      {cols.map((c, i) => {
        const col = typeof c === "string" ? { label: c } : c
        return (
          <span key={col.label} className={`${i > 0 ? "text-right" : ""} ${col.smOnly ? "hidden sm:block" : ""}`}>
            {col.label}
          </span>
        )
      })}
    </div>
  )
}

/** Card-in-card panel used for secondary columns on sm+. */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-ink/[0.07] bg-white p-3.5 ${className}`}>{children}</div>
}

function Status({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "gold" | "muted" }) {
  const tones = {
    brand: "bg-brand/10 text-brand",
    gold: "bg-gold-from/20 text-gold",
    muted: "bg-ink/[0.06] text-ink/55",
  } as const
  return <span className={`inline-block rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold ${tones[tone]}`}>{children}</span>
}

const SM_COL = "hidden sm:block"

/* Six report screens — one per stage. They read as Terramore's own product
   surfaces (roadmap doc, campaign dashboard, page analytics, follow-up log,
   Terra IQ, revenue summary). Figures are plausible working data; no client
   is named. */
function DeckCardArt({ id }: { id: string }) {
  switch (id) {
    case "strategy":
      return (
        <div className="flex h-full gap-4 p-4 sm:gap-5 sm:p-6">
          {/* Roadmap document: findings ranked by impact. */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-baseline justify-between">
              <ReportLabel>Findings · ranked by impact</ReportLabel>
              <span className="hidden font-mono text-[9.5px] text-ink/40 sm:inline">Prepared before kickoff</span>
            </div>
            <div className="mt-2 overflow-hidden rounded-xl border border-ink/[0.07] bg-white">
              <TableHead cols={["Priority", "Impact"]} grid="grid-cols-[1fr_auto]" />
              {[
                { n: "01", t: "Follow-up gap", d: "42% of inquiries never get a reply", impact: "High", tone: "gold" as const },
                { n: "02", t: "Brand search lands on homepage", d: "Paid clicks reach a page with no offer", impact: "High", tone: "gold" as const },
                { n: "03", t: "No retargeting", d: "Visitors who leave aren't re-engaged", impact: "Medium", tone: "muted" as const },
              ].map((p) => (
                <div key={p.n} className="grid grid-cols-[1fr_auto] items-center gap-x-3 border-b border-ink/[0.05] px-3 py-2 last:border-b-0">
                  <div className="flex min-w-0 gap-2.5">
                    <span className="font-mono text-[10px] font-semibold tabular-nums text-ink/35">{p.n}</span>
                    <div className="min-w-0">
                      {/* Titles wrap on mobile (no room to truncate); the detail line is sm+ only. */}
                      <p className="text-[11.5px] font-semibold leading-tight text-ink sm:truncate sm:text-[12px] sm:leading-normal">{p.t}</p>
                      <p className="hidden truncate text-[10px] text-ink/55 sm:block">{p.d}</p>
                    </div>
                  </div>
                  <Status tone={p.tone}>{p.impact}</Status>
                </div>
              ))}
            </div>
          </div>
          {/* Channel audit. */}
          <Panel className="hidden w-[38%] flex-col sm:flex">
            <ReportLabel>Channel audit</ReportLabel>
            <ul className="mt-2 divide-y divide-ink/[0.06]">
              {[
                ["Website", "Live", "brand"],
                ["Google Business", "Claimed", "brand"],
                ["Instagram", "18.2K", "muted"],
                ["Email list", "3,840", "muted"],
                ["Paid ads", "Not running", "gold"],
              ].map(([k, v, tone]) => (
                <li key={k} className="flex items-center justify-between py-1.5 text-[11px]">
                  <span className="text-ink/70">{k}</span>
                  <Status tone={tone as "brand" | "gold" | "muted"}>{v}</Status>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )
    case "acquisition":
      return (
        <div className="flex h-full flex-col p-4 sm:p-6">
          <div className="flex items-baseline justify-between">
            <ReportLabel>Campaigns · last 30 days</ReportLabel>
            <span className="hidden font-mono text-[9.5px] text-ink/40 sm:inline">Google · Meta · TikTok</span>
          </div>
          <div className="mt-2 overflow-hidden rounded-xl border border-ink/[0.07] bg-white">
            <TableHead
              cols={["Campaign", { label: "Channel", smOnly: true }, { label: "Spend", smOnly: true }, "Leads", "CPL"]}
              grid="grid-cols-[1.6fr_0.5fr_0.5fr] sm:grid-cols-[1.6fr_0.7fr_0.6fr_0.5fr_0.5fr]"
            />
            {[
              { name: "Brand search", ch: "Google", spend: "$1,240", leads: 27, w: 66, cpl: "$46" },
              { name: "Prospecting — video", ch: "Meta", spend: "$2,860", leads: 41, w: 100, cpl: "$70" },
              { name: "Retargeting", ch: "Meta", spend: "$640", leads: 12, w: 29, cpl: "$53" },
              { name: "Short-form test", ch: "TikTok", spend: "$400", leads: 6, w: 15, cpl: "$67" },
            ].map((c) => (
              <div key={c.name} className="grid grid-cols-[1.6fr_0.5fr_0.5fr] items-center gap-x-3 border-b border-ink/[0.05] px-3 py-1.5 text-[11px] last:border-b-0 sm:grid-cols-[1.6fr_0.7fr_0.6fr_0.5fr_0.5fr] sm:text-[11.5px]">
                <div className="min-w-0">
                  <p className="font-semibold leading-tight text-ink sm:truncate sm:leading-normal">{c.name}</p>
                  <span className="mt-1 block h-1 w-full max-w-[8rem] overflow-hidden rounded-full bg-ink/[0.07]">
                    <span className="block h-full rounded-full bg-brand/70" style={{ width: `${c.w}%` }} />
                  </span>
                </div>
                <span className={`${SM_COL} text-right text-ink/60`}>{c.ch}</span>
                <span className={`${SM_COL} text-right tabular-nums text-ink/70`}>{c.spend}</span>
                <span className="text-right font-semibold tabular-nums text-ink">{c.leads}</span>
                <span className="text-right tabular-nums text-ink/70">{c.cpl}</span>
              </div>
            ))}
            <div className="hidden grid-cols-[1.6fr_0.5fr_0.5fr] gap-x-3 border-t border-ink/[0.1] bg-cream/60 px-3 py-1.5 text-[11px] sm:grid sm:grid-cols-[1.6fr_0.7fr_0.6fr_0.5fr_0.5fr]">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/45">Total</span>
              <span className={SM_COL} />
              <span className={`${SM_COL} text-right font-semibold tabular-nums text-ink`}>$5,140</span>
              <span className="text-right font-bold tabular-nums text-ink">86</span>
              <span className="text-right font-semibold tabular-nums text-ink">$60</span>
            </div>
          </div>
        </div>
      )
    case "conversion":
      return (
        <div className="flex h-full items-stretch gap-4 p-4 sm:gap-5 sm:p-6">
          {/* The page Terramore built for the click. */}
          <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-ink/[0.08] bg-white p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
              <span className="ml-2 truncate font-mono text-[9px] text-ink/35">/brand-search — landing page v2</span>
            </div>
            <p className="mt-3 text-[13px] font-bold leading-tight tracking-[-0.01em] text-ink sm:text-[15px]">
              Book a free estimate this week.
            </p>
            <p className="mt-1 text-[10.5px] text-ink/55">One page, one offer, one next step.</p>
            {/* Two feature tiles fit on mobile; the third joins on sm+. */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {["Same week", "Clear pricing", "Local team"].map((t, i) => (
                <div key={t} className={`rounded-lg bg-cream p-2 ${i === 2 ? "hidden sm:block" : ""}`}>
                  <span className={`block h-6 rounded-md ${i === 1 ? "bg-gold-from/25" : "bg-ink/[0.06]"}`} />
                  <p className="mt-1.5 truncate text-[9.5px] font-medium text-ink/60">{t}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-3">
              <span className="flex-1 truncate rounded-lg border border-ink/[0.1] px-2.5 py-1.5 text-[10px] text-ink/40">
                Phone<span className="hidden sm:inline"> or email</span>
              </span>
              <span className="rounded-lg bg-brand px-3 py-1.5 text-[10px] font-semibold text-white">Get my estimate</span>
            </div>
          </div>
          {/* Page analytics. */}
          <Panel className="hidden w-[40%] flex-col sm:flex">
            <ReportLabel>Page conversion · 30 days</ReportLabel>
            <ul className="mt-2.5 space-y-2.5">
              {[
                { k: "Visitors", v: "1,284", w: 100 },
                { k: "Started form", v: "211", w: 16 },
                { k: "Leads", v: "92", w: 7 },
              ].map((s) => (
                <li key={s.k}>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-ink/70">{s.k}</span>
                    <span className="font-semibold tabular-nums text-ink">{s.v}</span>
                  </div>
                  <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.07]">
                    <span className="block h-full rounded-full bg-brand/70" style={{ width: `${Math.max(s.w, 4)}%` }} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-baseline justify-between border-t border-ink/[0.1] pt-2">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/45">Conv. rate</span>
              <span className="text-[15px] font-bold tabular-nums text-ink">7.2%</span>
            </div>
          </Panel>
        </div>
      )
    case "automation":
      return (
        <div className="flex h-full gap-4 p-4 sm:gap-5 sm:p-6">
          {/* Follow-up log for one inquiry. */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-baseline justify-between">
              <ReportLabel>Inquiry #1042 · web form</ReportLabel>
              <span className="hidden font-mono text-[9.5px] text-ink/40 sm:inline">No manual steps</span>
            </div>
            <div className="mt-2 overflow-hidden rounded-xl border border-ink/[0.07] bg-white">
              {/* Time column is sm+ only so event names stay whole on mobile. */}
              <TableHead cols={["Event", { label: "Time", smOnly: true }, "Status"]} grid="grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto]" />
              {[
                { t: "2:14 PM", s: "Inquiry received", d: "Lead created in CRM", st: "Logged", tone: "muted" as const },
                { t: "2:14 PM", s: "Qualified", d: "Budget · timeline · service area", st: "Passed", tone: "brand" as const },
                { t: "2:16 PM", s: "First reply sent", d: "SMS + email with two times", st: "Delivered", tone: "brand" as const },
                { t: "2:31 PM", s: "Call booked", d: "Thu 10:30 AM · calendar invite", st: "Confirmed", tone: "gold" as const },
              ].map((e) => (
                <div key={e.s} className="grid grid-cols-[1fr_auto] items-center gap-x-3 border-b border-ink/[0.05] px-3 py-2 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:py-1.5">
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-semibold text-ink sm:text-[12px]">{e.s}</p>
                    <p className="hidden truncate text-[10px] text-ink/50 sm:block">{e.d}</p>
                  </div>
                  <span className={`${SM_COL} font-mono text-[10px] tabular-nums text-ink/50`}>{e.t}</span>
                  <Status tone={e.tone}>{e.st}</Status>
                </div>
              ))}
            </div>
          </div>
          {/* Response-time distribution. */}
          <Panel className="hidden w-[38%] flex-col sm:flex">
            <ReportLabel>First reply · all inquiries</ReportLabel>
            <ul className="mt-2.5 space-y-2.5">
              {[
                { k: "Under 5 min", v: "94%", w: 94, gold: true },
                { k: "5 – 60 min", v: "5%", w: 5 },
                { k: "Over 1 hour", v: "1%", w: 1 },
              ].map((s) => (
                <li key={s.k}>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-ink/70">{s.k}</span>
                    <span className="font-semibold tabular-nums text-ink">{s.v}</span>
                  </div>
                  <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.07]">
                    <span className={`block h-full rounded-full ${s.gold ? "bg-gold-from" : "bg-brand/60"}`} style={{ width: `${Math.max(s.w, 3)}%` }} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-baseline justify-between border-t border-ink/[0.1] pt-2">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/45">Median</span>
              <span className="text-[15px] font-bold tabular-nums text-ink">2 min</span>
            </div>
          </Panel>
        </div>
      )
    case "intelligence":
      return (
        <div className="flex h-full gap-4 p-4 sm:gap-5 sm:p-6">
          {/* Revenue trend. */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-baseline justify-between">
              <ReportLabel>Revenue trend · attributed</ReportLabel>
              <span className="hidden font-mono text-[9.5px] text-ink/40 sm:inline">Monthly</span>
            </div>
            <div className="mt-3 flex min-h-0 flex-1 items-stretch gap-1.5 sm:gap-2">
              {[
                ["Mar", 4.1], ["Apr", 5.6], ["May", 4.9], ["Jun", 7.2], ["Jul", 6.8], ["Aug", 9.4], ["Sep", 8.9], ["Oct", 12.5],
              ].map(([m, v], i) => (
                /* Six bars fit on mobile; Mar and Apr join on sm+. */
                <div key={m as string} className={`flex-1 flex-col items-center justify-end gap-1 ${i < 2 ? "hidden sm:flex" : "flex"}`}>
                  <span className="font-mono text-[8.5px] font-semibold tabular-nums text-ink/55">{(v as number).toFixed(1)}k</span>
                  <span
                    className={`w-full rounded-t-md ${i === 7 ? "bg-gold-from" : "bg-brand/60"}`}
                    style={{ height: `${((v as number) / 12.5) * 100}%`, maxHeight: "70%" }}
                  />
                  <span className="font-mono text-[8.5px] text-ink/40">{m}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Source → revenue table. */}
          <Panel className="hidden w-[44%] flex-col sm:flex">
            <ReportLabel>Revenue by source · Oct</ReportLabel>
            <ul className="mt-2 divide-y divide-ink/[0.06]">
              {[
                ["Brand search", "$4,120", "3.1×"],
                ["Meta prospecting", "$5,200", "2.4×"],
                ["Retargeting", "$1,600", "3.0×"],
                ["Organic · referrals", "$1,560", "—"],
              ].map(([k, v, r]) => (
                <li key={k} className="flex items-center justify-between gap-2 py-1.5 text-[11px]">
                  <span className="truncate text-ink/70">{k}</span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-semibold text-ink">{v}</span>
                    <span className="ml-1.5 font-mono text-[9.5px] text-brand">{r}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-baseline justify-between border-t border-ink/[0.1] pt-2">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/45">Total</span>
              <span className="text-[15px] font-bold tabular-nums text-ink">$12,480</span>
            </div>
          </Panel>
        </div>
      )
    default: // revenue
      return (
        <div className="flex h-full gap-4 p-4 sm:gap-5 sm:p-6">
          {/* Month-over-month table. */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-baseline justify-between">
              <ReportLabel>Monthly performance</ReportLabel>
              <span className="hidden font-mono text-[9.5px] text-ink/40 sm:inline">Updated daily</span>
            </div>
            <div className="mt-2 overflow-hidden rounded-xl border border-ink/[0.07] bg-white">
              <TableHead
                cols={["Month", "Calls", "Revenue", { label: "Cost / call", smOnly: true }]}
                grid="grid-cols-[1fr_0.6fr_0.9fr] sm:grid-cols-[1fr_0.6fr_0.9fr_0.9fr]"
              />
              {[
                { m: "Jul", calls: 14, rev: "$7,100", cpc: "$310" },
                { m: "Aug", calls: 19, rev: "$9,400", cpc: "$268" },
                { m: "Sep", calls: 21, rev: "$8,900", cpc: "$251" },
                { m: "Oct", calls: 24, rev: "$12,480", cpc: "$214", now: true },
              ].map((r) => (
                <div
                  key={r.m}
                  className={`grid grid-cols-[1fr_0.6fr_0.9fr] items-center gap-x-3 border-b border-ink/[0.05] px-3 py-2 text-[11.5px] last:border-b-0 sm:grid-cols-[1fr_0.6fr_0.9fr_0.9fr] ${r.now ? "bg-gold-from/10" : ""}`}
                >
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    {r.m}
                    {r.now ? <Status tone="gold">Current</Status> : null}
                  </span>
                  <span className="text-right font-semibold tabular-nums text-ink">{r.calls}</span>
                  <span className="text-right tabular-nums text-ink/80">{r.rev}</span>
                  <span className={`${SM_COL} text-right tabular-nums text-ink/70`}>{r.cpc}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Booked calls by week, current month. */}
          <Panel className="hidden w-[38%] flex-col sm:flex">
            <ReportLabel>Booked calls · by week</ReportLabel>
            <svg viewBox="0 0 200 72" className="mt-2 h-auto w-full flex-1" aria-hidden preserveAspectRatio="none">
              <path d="M0,64 C30,60 50,48 80,44 C110,40 130,26 200,8" fill="none" stroke="var(--gold-from)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0,64 C30,60 50,48 80,44 C110,40 130,26 200,8 L200,72 L0,72 Z" fill="var(--gold-from)" opacity="0.12" />
              <circle cx="200" cy="8" r="4" fill="var(--gold-from)" />
            </svg>
            <div className="mt-1 flex justify-between font-mono text-[8.5px] text-ink/40">
              {["W1", "W2", "W3", "W4"].map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-ink/[0.1] pt-2">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/45">October</span>
              <span className="text-[15px] font-bold tabular-nums text-ink">24 calls</span>
            </div>
          </Panel>
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

      {/* The deck. The front card slides straight down and off, revealing the
          next card already waiting behind it. */}
      {/* Mobile: taller container and a deeper bottom inset so the face has
          room for full rows and the bottom pop tile has room to hang. */}
      <div className="relative mx-auto mt-8 h-[22rem] max-w-2xl px-4 pb-14 sm:mt-6 sm:h-[21rem] sm:px-0 sm:pb-10 md:h-[23rem]">
        {DECK_STAGES.map((s, i) => {
          const isActive = i === stage
          const isLeaving = i === prev
          const isNext = i === (stage + 1) % DECK_STAGES.length && !isLeaving
          return (
            <div
              key={s.id}
              aria-hidden={!isActive}
              className={`absolute inset-x-4 top-0 bottom-14 transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:inset-x-0 sm:bottom-10 ${
                isActive
                  ? "z-20 translate-y-0 rotate-0 scale-100 opacity-100"
                  : isLeaving
                    ? "z-30 translate-y-[70%] rotate-[1.5deg] scale-[0.98] opacity-0"
                    : isNext
                      ? "z-10 -translate-y-3 scale-[0.95] opacity-100" /* peeks out behind the front card */
                      : "z-0 -translate-y-3 scale-[0.95] opacity-0"
              }`}
            >
              <div className="relative h-full rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-[0_16px_50px_rgba(15,30,46,0.14)]">
                {/* Single-line title; smaller on mobile so the longest one fits at 320px. */}
                <p className="absolute left-5 right-5 top-5 z-10 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/35 sm:left-7 sm:right-7 sm:top-4 sm:text-[11px] sm:tracking-[0.16em]">
                  {s.title}
                </p>
                <div className="h-full pt-9 sm:pt-8">
                  <DeckCardArt id={s.id} />
                </div>

                {/* Popup metric tiles: small white cards (eyebrow, value, optional
                    delta chip or tag chips). Re-mounted per activation so they stagger in. */}
                {isActive
                  ? s.pops.map((pop, pi) => (
                      <div
                        key={`${stage}-${pi}`}
                        className={`deck-pop absolute z-20 ${pop.position}`}
                        style={{ animationDelay: `${450 + pi * 350}ms` }}
                      >
                        <div className="w-max max-w-[11.5rem] rounded-xl bg-white px-3 py-2 shadow-[0_14px_36px_rgba(15,30,46,0.16)] ring-1 ring-ink/[0.06] sm:max-w-[16rem]">
                          <p className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-ink/45 sm:text-[9px]">{pop.label}</p>
                          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <p className="text-[13.5px] font-bold leading-none tracking-[-0.01em] text-ink sm:text-[15px]">{pop.value}</p>
                            {pop.delta ? (
                              <span
                                className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold ${
                                  pop.deltaTone === "gold"
                                    ? "bg-gold-from/20 text-gold"
                                    : pop.deltaTone === "muted"
                                      ? "bg-ink/[0.06] text-ink/55"
                                      : "bg-brand/10 text-brand"
                                }`}
                              >
                                {pop.delta}
                              </span>
                            ) : null}
                          </div>
                          {pop.chips ? (
                            <div className="mt-1.5 hidden flex-wrap gap-1 sm:flex">
                              {pop.chips.map((c) => (
                                <span key={c} className="rounded-md bg-cream px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-ink/70 ring-1 ring-ink/[0.06]">
                                  {c}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
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
