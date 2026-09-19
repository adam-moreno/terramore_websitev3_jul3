"use client"

/**
 * Marketing page hero visual: lifestyle photo of an owner on their phone,
 * with a phone-screen dashboard mock in front showing live campaign
 * performance (site visits, sales today, Stripe payments). The dashboard
 * content auto-scrolls slowly — like the user is scrolling through their
 * own analytics — and holds still under prefers-reduced-motion.
 *
 * All numbers are illustrative UI, not client claims.
 */

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Bell, CreditCard, TrendingUp } from "lucide-react"

const PAYMENTS = [
  { name: "Stripe payment", detail: "Order #2148", amount: "$182.00", time: "2m ago" },
  { name: "Stripe payment", detail: "Order #2147", amount: "$96.50", time: "18m ago" },
  { name: "Stripe payment", detail: "Booking deposit", amount: "$250.00", time: "44m ago" },
  { name: "Stripe payment", detail: "Order #2146", amount: "$64.00", time: "1h ago" },
] as const

const BARS = [34, 52, 41, 66, 58, 78, 71, 90, 82, 96] as const

export function MarketingHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
      {/* Photo */}
      <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(15,30,46,0.35)]">
        <Image
          src="/marketing/hero-phone.png"
          alt="A business owner checking campaign performance on their phone"
          width={768}
          height={1024}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Phone dashboard, overlapping the photo */}
      <div
        aria-hidden
        className="absolute -bottom-6 -left-3 w-[11.5rem] rounded-[1.9rem] border border-black/[0.08] bg-ink p-1.5 shadow-[0_24px_50px_-16px_rgba(15,30,46,0.45)] sm:-left-6 sm:w-[13rem]"
      >
        <div className="overflow-hidden rounded-[1.55rem] bg-white">
          {/* Status area */}
          <div className="flex items-center justify-between bg-ink px-4 pb-2.5 pt-2">
            <p className="text-[10px] font-semibold text-cream">Terra IQ</p>
            <Bell className="h-3 w-3 text-cream/60" strokeWidth={2.5} />
          </div>

          {/* Scrolling analytics feed */}
          <div className="marketing-phone-viewport h-[15.5rem] overflow-hidden sm:h-[17rem]">
            <div className="marketing-phone-feed px-3.5 pt-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/40">Today</p>

              {/* Site visits */}
              <div className="mt-2 rounded-xl bg-cream p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium text-ink/60">Site visits</p>
                  <span className="flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600">
                    <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={3} />
                    18%
                  </span>
                </div>
                <p className="mt-0.5 text-[17px] font-bold tracking-tight text-ink">1,284</p>
                <div className="mt-1.5 flex h-6 items-end gap-[3px]">
                  {BARS.map((height, index) => (
                    <span
                      key={index}
                      className={`w-full rounded-sm ${index >= 7 ? "bg-brand" : "bg-brand/25"}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Sales today */}
              <div className="mt-2 rounded-xl bg-cream p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium text-ink/60">Sales today</p>
                  <TrendingUp className="h-3 w-3 text-gold" strokeWidth={2.5} />
                </div>
                <p className="mt-0.5 text-[17px] font-bold tracking-tight text-ink">$3,420</p>
                <p className="text-[9px] text-ink/45">12 orders · avg $285</p>
              </div>

              {/* Stripe payments */}
              <p className="mt-3 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                <CreditCard className="h-2.5 w-2.5" strokeWidth={2.5} />
                Payments
              </p>
              <ul className="mt-1.5 space-y-1.5 pb-4">
                {PAYMENTS.map((payment, index) => (
                  <li key={index} className="flex items-center justify-between rounded-lg border border-black/[0.05] px-2.5 py-2">
                    <div>
                      <p className="text-[10px] font-semibold text-ink">{payment.amount}</p>
                      <p className="text-[8.5px] text-ink/45">{payment.detail}</p>
                    </div>
                    <p className="text-[8.5px] text-ink/40">{payment.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating proof chip, Superside-style */}
      <div className="absolute -right-2 top-6 flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 shadow-[0_10px_30px_-10px_rgba(15,30,46,0.3)] sm:-right-4">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[11px] font-semibold text-ink">Campaigns live</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ServiceCarousel: infinite marquee of service tiles with a small     */
/* visual example each. Auto-scrolls, eases to a crawl on hover, and   */
/* becomes a plain swipeable rail under prefers-reduced-motion.        */
/* ------------------------------------------------------------------ */

const SERVICES = [
  { id: "strategy", label: "Marketing strategy", note: "Roadmap, offer, audience" },
  { id: "creative", label: "Ad creative", note: "Statics that stop the scroll" },
  { id: "paid", label: "Paid campaigns", note: "Google, Meta, TikTok" },
  { id: "landing", label: "Landing pages", note: "Built to convert traffic" },
  { id: "email", label: "Email & SMS", note: "Follow-up that runs itself" },
  { id: "video", label: "Short-form content", note: "Video cut for social" },
  { id: "automation", label: "Automation", note: "CRM, routing, nurture" },
  { id: "analytics", label: "Analytics & attribution", note: "Terra IQ shows what pays" },
] as const

/** Real photo example for each service (generated stills in the brand palette). */
function ServiceThumb({ id, label }: { id: (typeof SERVICES)[number]["id"]; label: string }) {
  return (
    <Image
      src={`/marketing/services/${id}.png`}
      alt={label}
      width={512}
      height={384}
      className="h-full w-full object-cover"
    />
  )
}

export function ServiceCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const hovering = useRef(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
      return
    }
    const track = trackRef.current
    if (!track) return

    let offset = 0
    let speed = 0.55 // px per frame at 60fps
    let frame = 0
    let last = performance.now()

    const step = (now: number) => {
      const delta = Math.min(48, now - last)
      last = now
      // Ease toward crawl on hover, back to cruise off it.
      const target = hovering.current ? 0.08 : 0.55
      speed += (target - speed) * 0.06
      offset += speed * (delta / 16.7)
      const half = track.scrollWidth / 2
      if (half > 0 && offset >= half) offset -= half
      track.style.transform = `translateX(${-offset}px)`
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [])

  /* Horizontal tiles: text leads, photo is a small square accent on the right. */
  const tiles = (keyPrefix: string, hidden: boolean) =>
    SERVICES.map((service) => (
      <li
        key={`${keyPrefix}-${service.id}`}
        aria-hidden={hidden}
        className="flex w-[16rem] shrink-0 items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-2.5 pl-4 shadow-[0_8px_30px_rgba(15,30,46,0.05)] sm:w-[17.5rem]"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold tracking-tight text-ink">{service.label}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-ink/50">{service.note}</p>
        </div>
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16">
          <ServiceThumb id={service.id} label={service.label} />
        </div>
      </li>
    ))

  if (reducedMotion) {
    return (
      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-3 px-1">{tiles("static", false)}</ul>
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => {
        hovering.current = true
      }}
      onMouseLeave={() => {
        hovering.current = false
      }}
    >
      <div ref={trackRef} className="w-max will-change-transform">
        <ul className="flex gap-3 pr-3">
          {tiles("a", false)}
          {tiles("b", true)}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* StatsCountUp: numbers rise from 0 when the section scrolls into     */
/* view. All stats are factual Terramore claims.                       */
/* ------------------------------------------------------------------ */

/* PLACEHOLDER numbers (user-approved fakes for now) — replace with real
   client results before these can ship as claims. */
const STATS = [
  { value: 3.4, decimals: 1, prefix: "", suffix: "x", label: "Average return on ad spend across managed campaigns" },
  { value: 7, decimals: 0, prefix: "", suffix: " days", label: "From kickoff to your first campaign live" },
  { value: 38, decimals: 0, prefix: "+", suffix: "%", label: "Average lift in booked calls within the first 90 days" },
] as const

/* ------------------------------------------------------------------ */
/* CreativeTilesGrid: non-clickable creative-service tiles with        */
/* motion where the medium calls for it. Same rules as the carousel    */
/* (each tile = a different kind of work), all animation is CSS and    */
/* stops under prefers-reduced-motion.                                 */
/* ------------------------------------------------------------------ */

/* 8 tiles. `span` controls the desktop bento layout (4-col grid):
   two 2x2 squares, two 1x2 talls, four 1x1 squares = a perfectly
   filled 4x4 grid. On mobile every tile is the same size, stacked. */
const CREATIVE_TILES = [
  { id: "video", label: "Video production", note: "Filming, editing, and cutdowns for ads, launches, and social.", span: "lg:col-span-2 lg:row-span-2" },
  { id: "motion", label: "Motion graphics", note: "Animated content for web, social, and mobile.", span: "" },
  { id: "illustration", label: "Illustration", note: "Original, on-brand artwork.", span: "" },
  { id: "translation", label: "Transcreation & translation", note: "Creative adapted for local markets.", span: "" },
  { id: "copywriting", label: "Copywriting", note: "Headlines, hooks, and scripts that sell.", span: "" },
  { id: "social", label: "Social content", note: "Vertical-first posts and stories.", span: "lg:row-span-2" },
  { id: "landing", label: "Landing pages", note: "Pages built to convert the click.", span: "lg:row-span-2" },
  { id: "ads", label: "Static ad design", note: "Scroll-stopping concepts, ready for every placement.", span: "lg:col-span-2 lg:row-span-2" },
] as const

function CreativeVisual({ id }: { id: (typeof CREATIVE_TILES)[number]["id"] }) {
  switch (id) {
    case "video":
      // Editing timeline with a playhead sweeping across the clips.
      return (
        <div className="relative flex h-full w-full flex-col justify-end gap-1.5 overflow-hidden bg-gradient-to-br from-ink to-[#1c3350] p-5">
          <div className="absolute inset-x-5 top-5 bottom-16 rounded-lg bg-white/[0.07] ring-1 ring-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <span aria-hidden className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="flex gap-1">
              {[14, 22, 10, 18, 12, 24].map((w, i) => (
                <span key={i} className="h-3 rounded-sm bg-brand/70" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-1 flex gap-1">
              {[20, 12, 26, 16, 14].map((w, i) => (
                <span key={i} className="h-3 rounded-sm bg-gold-from/60" style={{ width: `${w}%` }} />
              ))}
            </div>
            {/* Playhead */}
            <span aria-hidden className="marketing-playhead absolute -top-1 bottom-0 w-[2px] rounded-full bg-white/90" />
          </div>
        </div>
      )
    case "motion":
      // Shapes in motion: orbiting dot, bouncing square, pulsing ring.
      return (
        <div className="relative flex h-full w-full items-center justify-center gap-5 overflow-hidden bg-gradient-to-br from-brand/[0.12] to-gold-from/[0.1] p-5">
          <span aria-hidden className="marketing-motion-spin relative h-12 w-12 rounded-full border-2 border-dashed border-brand/50">
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand" />
          </span>
          <span aria-hidden className="marketing-motion-bounce h-9 w-9 rounded-lg bg-gold-from shadow-md" />
          <span aria-hidden className="marketing-motion-pulse h-11 w-11 rounded-full border-[6px] border-ink/70" />
        </div>
      )
    case "illustration":
      // A line drawing that draws itself, looping.
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-from/[0.18] to-brand/[0.06] p-5">
          <svg viewBox="0 0 120 80" className="h-full w-auto" aria-hidden>
            {/* Simple mountain-and-sun sketch */}
            <circle cx="92" cy="20" r="10" fill="none" stroke="var(--gold-to)" strokeWidth="2.5" className="marketing-draw" style={{ animationDelay: "0.6s" }} />
            <path
              d="M 8 66 L 38 28 L 56 50 L 70 34 L 112 66 Z"
              fill="none"
              stroke="var(--ink, #16283c)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="marketing-draw"
            />
            <path d="M 20 66 Q 60 58 100 66" fill="none" stroke="var(--brand)" strokeWidth="2" className="marketing-draw" style={{ animationDelay: "1.2s" }} />
          </svg>
        </div>
      )
    case "translation":
      // Two speech bubbles trading places — one message, two languages.
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink/[0.05] to-brand/[0.1] p-5">
          <div className="marketing-lang-a absolute flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 shadow-md ring-1 ring-black/[0.05]">
            <span className="text-[15px] font-bold text-ink">Aa</span>
            <span className="h-1.5 w-14 rounded-full bg-ink/15" />
          </div>
          <div className="marketing-lang-b absolute flex items-center gap-2 rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 shadow-md">
            <span className="text-[15px] font-bold text-white">文A</span>
            <span className="h-1.5 w-14 rounded-full bg-white/40" />
          </div>
        </div>
      )
    case "copywriting":
      // Copy lines typing themselves out, with a blinking caret.
      return (
        <div className="flex h-full w-full flex-col justify-center gap-2.5 bg-gradient-to-br from-ink/[0.04] to-gold-from/[0.12] px-6">
          <span className="marketing-type h-2 rounded-full bg-ink/70" style={{ maxWidth: "72%" }} />
          <span className="marketing-type h-2 rounded-full bg-ink/40" style={{ maxWidth: "88%", animationDelay: "0.5s" }} />
          <span className="flex items-center gap-1">
            <span className="marketing-type h-2 rounded-full bg-ink/40" style={{ maxWidth: "55%", animationDelay: "1s" }} />
            <span aria-hidden className="marketing-caret h-3.5 w-[2px] bg-brand" />
          </span>
        </div>
      )
    case "social":
      // Vertical phone playing a story, hearts popping up.
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-brand/[0.14] to-ink/[0.06] p-4">
          <div className="relative flex h-[85%] w-auto min-w-[52%] max-w-[70%] flex-col overflow-hidden rounded-2xl bg-ink shadow-lg ring-4 ring-ink/80" style={{ aspectRatio: "9/16" }}>
            <div className="mx-3 mt-2 flex gap-1">
              <span className="h-0.5 flex-1 rounded-full bg-white/80" />
              <span className="h-0.5 flex-1 rounded-full bg-white/25" />
              <span className="h-0.5 flex-1 rounded-full bg-white/25" />
            </div>
            <div className="mx-3 mt-2 flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-gradient-to-br from-gold-from to-gold-to" />
              <span className="h-1 w-10 rounded-full bg-white/50" />
            </div>
            <div className="mt-auto mb-3 px-3">
              <span className="block h-1.5 w-3/4 rounded-full bg-white/70" />
              <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-white/35" />
            </div>
            {/* Hearts floating up */}
            <span aria-hidden className="marketing-heart absolute bottom-8 right-2 text-[14px]">❤️</span>
            <span aria-hidden className="marketing-heart absolute bottom-8 right-5 text-[11px]" style={{ animationDelay: "1.1s" }}>❤️</span>
            <span aria-hidden className="marketing-heart absolute bottom-8 right-3 text-[9px]" style={{ animationDelay: "2.2s" }}>❤️</span>
          </div>
        </div>
      )
    case "landing":
      // Browser page skeleton with a shimmer passing over it.
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-ink/[0.05] to-brand/[0.08] p-4">
          <div className="relative flex h-[85%] w-[88%] flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/[0.06]">
            <div className="flex items-center gap-1 border-b border-black/[0.06] px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f87171]" />
              <span className="h-1.5 w-1.5 rounded-full bg-gold-from" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
              <span className="ml-2 h-1.5 flex-1 rounded-full bg-ink/[0.07]" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <span className="h-2.5 w-3/4 rounded bg-ink/80" />
              <span className="h-1.5 w-1/2 rounded bg-ink/25" />
              <span className="mt-1 h-4 w-16 rounded-md bg-brand" />
              <div className="mt-auto grid grid-cols-3 gap-1.5">
                <span className="h-8 rounded bg-ink/[0.08]" />
                <span className="h-8 rounded bg-ink/[0.08]" />
                <span className="h-8 rounded bg-ink/[0.08]" />
              </div>
            </div>
            <span aria-hidden className="marketing-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-brand/[0.08] to-transparent" />
          </div>
        </div>
      )
    case "ads":
      // A fan of static ad concepts, gently swaying.
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c3350] to-ink p-6">
          <div className="marketing-fan relative h-[70%] w-[38%] max-w-[10rem]">
            <div className="absolute inset-0 -rotate-[10deg] rounded-xl bg-gradient-to-br from-gold-from to-gold-to opacity-70 shadow-xl" style={{ transformOrigin: "bottom center" }} />
            <div className="absolute inset-0 rotate-[9deg] rounded-xl bg-gradient-to-br from-brand to-[#7aa2ff] opacity-80 shadow-xl" style={{ transformOrigin: "bottom center" }} />
            <div className="absolute inset-0 flex flex-col justify-between rounded-xl bg-white p-3 shadow-2xl">
              <div>
                <span className="block h-2 w-3/4 rounded bg-ink/85" />
                <span className="mt-1 block h-2 w-1/2 rounded bg-ink/30" />
              </div>
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-gold-from to-gold-to" />
              <span className="mx-auto block h-4 w-16 rounded-full bg-ink" />
            </div>
          </div>
        </div>
      )
  }
}

export function CreativeTilesGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense lg:auto-rows-[11rem]">
      {CREATIVE_TILES.map((tile) => {
        const big = tile.span.includes("col-span-2")
        return (
          <div
            key={tile.id}
            className={`relative h-52 overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(15,30,46,0.05)] lg:h-auto ${tile.span}`}
          >
            <div className="absolute inset-0">
              <CreativeVisual id={tile.id} />
            </div>
            {/* Label overlays the visual so every tile size works. */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="inline-block max-w-full rounded-xl bg-white/90 px-3.5 py-2 shadow-sm ring-1 ring-black/[0.05] backdrop-blur">
                <p className="text-[13px] font-semibold leading-tight tracking-tight text-ink">{tile.label}</p>
                {big ? <p className="mt-0.5 text-[12px] leading-snug text-ink/55">{tile.note}</p> : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CollaborationSteps: sticky headline left, steps right. Each step    */
/* lights up as it crosses the middle of the viewport while scrolling. */
/* ------------------------------------------------------------------ */

const COLLAB_STEPS = [
  {
    title: "Brainstorm",
    body: "We start with your goals, your customers, and what's already working. Together we map the campaigns, content, and pages worth building first.",
  },
  {
    title: "Creative back-and-forth",
    body: "Concepts come to you fast. You react, we refine — tight feedback loops instead of big reveals, so nothing drifts off-brand.",
  },
  {
    title: "Fast deliverables",
    body: "Ads, landing pages, emails, and content ship in days, not months. One connected team means no hand-off delays between strategy and production.",
  },
  {
    title: "Implementation",
    body: "We launch it for you — campaigns configured, pages published, tracking wired in. Nothing sits in a folder waiting for 'someone technical.'",
  },
  {
    title: "Testing while live",
    body: "Once it's running, we watch what the data says and keep optimizing — creative refreshes, budget shifts, and page tweaks based on real results.",
  },
] as const

export function CollaborationSteps() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // A step becomes active when it crosses the middle band of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLLIElement)
            if (idx !== -1) setActive(idx)
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      {/* Left: sticky headline */}
      <div>
        <div className="lg:sticky lg:top-28">
          <p className="section-eyebrow">How we work together</p>
          <h2 className="mt-3 text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.4rem]">
            A partner in the work, <span className="text-gold">start to finish.</span>
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-slate-600">
            Content, advertising, campaigns, web design — every engagement follows the same tight loop, so you always
            know what's happening and what's next.
          </p>
        </div>
      </div>

      {/* Right: steps that highlight on scroll */}
      <ol className="relative flex flex-col gap-3">
        {/* Progress rail */}
        <span aria-hidden className="absolute bottom-6 left-[1.55rem] top-6 w-px bg-black/[0.08]" />
        {COLLAB_STEPS.map((step, i) => {
          const isActive = i === active
          const isDone = i < active
          return (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={`relative flex gap-5 rounded-2xl border p-5 transition-all duration-500 sm:p-6 ${
                isActive
                  ? "border-black/[0.08] bg-white shadow-[0_12px_40px_rgba(15,30,46,0.08)]"
                  : "border-transparent bg-transparent"
              }`}
            >
              <span
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-500 ${
                  isActive
                    ? "bg-brand text-white"
                    : isDone
                      ? "bg-brand/15 text-brand"
                      : "bg-white text-ink/40 ring-1 ring-black/[0.08]"
                }`}
              >
                {i + 1}
              </span>
              <div className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-45"}`}>
                <h3 className="text-[16px] font-semibold tracking-tight text-ink sm:text-[17px]">{step.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{step.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CreativeCtaCard: full-width booking CTA over the jean-pocket photo. */
/* ------------------------------------------------------------------ */

export function CreativeCtaCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_20px_60px_rgba(15,30,46,0.18)]">
      <Image
        src="/marketing/cta-pocket.png"
        alt="Phone in a jean back pocket showing a mobile ad"
        width={1600}
        height={900}
        className="absolute inset-0 h-full w-full object-cover"
        sizes="(max-width: 896px) 100vw, 896px"
      />
      {/* Legibility scrim, heavier on the text side. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" aria-hidden />
      <div className="relative px-7 py-12 sm:px-12 sm:py-16 md:max-w-[34rem] md:py-20">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-from">Ready when you are</p>
        <h3 className="mt-3 text-[1.7rem] font-bold leading-[1.12] tracking-[-0.02em] text-white md:text-[2.2rem]">
          Get ads people actually stop for.
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
          Strategy, creative, and campaigns from one team — book a demo and see what that looks like for your business.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-ink transition hover:bg-white/90"
          >
            Book a demo
          </Link>
          <Link href="/solutions" className="text-[14px] font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline">
            See all services
          </Link>
        </div>
      </div>
    </div>
  )
}

export function StatsCountUp() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1)
      return
    }
    if (typeof IntersectionObserver === "undefined") {
      setProgress(1)
      return
    }
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1600
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setProgress(1 - Math.pow(1 - t, 3)) // ease-out cubic
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="grid gap-8 sm:grid-cols-3 sm:gap-6">
      {STATS.map((stat) => (
        <div key={stat.label} className="border-t border-black/[0.1] pt-5">
          <p className="text-[2.6rem] font-bold leading-none tracking-tight text-ink md:text-[3.2rem]">
            {stat.prefix}
            {(stat.value * progress).toFixed(stat.decimals)}
            {stat.suffix}
          </p>
          <p className="mt-3 max-w-[16rem] text-[14px] leading-relaxed text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
