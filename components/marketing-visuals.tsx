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
import { useEffect, useRef, useState } from "react"
import { BookingLink } from "@/components/booking-popup"
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

/* Promise/fact-based stats — all verifiable, no invented results claims.
   Roadmap uses from→to so the number counts down from $1,000 to $0. */
const STATS = [
  { value: 10, from: 0, decimals: 0, prefix: "", suffix: "+", label: "Years in marketing, data, and measurement — including work behind Fortune 500 advertisers" },
  { value: 0, from: 1000, decimals: 0, prefix: "$", suffix: "", label: "What your growth roadmap costs — we build it before you ever sign up, and it's yours to keep" },
  { value: 100, from: 0, decimals: 0, prefix: "", suffix: "%", label: "You own every ad account, creative file, and login — always" },
] as const

/* ------------------------------------------------------------------ */
/* CreativeTilesGrid: the creative showcase — photographic service     */
/* tiles, each its own visual world (different environment, palette,   */
/* subject, and motion). Layout: 3-col bento on desktop (two 2x2,      */
/* three 1x2 talls, four 1x1 = a perfectly filled 3x6 grid), uniform   */
/* stacked tiles on mobile. Motion is a small library of editorial     */
/* behaviors (slow push, lateral pan) assigned per service; hover      */
/* shifts the crop slightly and lifts the caption. All motion stops    */
/* under prefers-reduced-motion.                                       */
/* ------------------------------------------------------------------ */

const CREATIVE_TILES = [
  {
    id: "creative",
    label: "Ad creative",
    note: "Concepts, variations, and finished ads people actually stop for.",
    image: "/marketing/services/creative.png",
    alt: "A wall of colorful ad concept variations being pinned up in a bright studio",
    span: "lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-1",
    motion: "marketing-showcase-pan",
    position: "object-center",
  },
  {
    id: "video",
    label: "Short-form content",
    note: "Shot, cut, captioned, shipped.",
    image: "/marketing/services/video.png",
    alt: "A vertical video being recorded and edited in a bright creator studio",
    span: "lg:row-span-2 lg:col-start-3 lg:row-start-1",
    motion: "marketing-showcase-push",
    position: "object-[30%_center]",
  },
  {
    id: "automation",
    label: "Automation",
    note: "The system that works when nobody's touching it.",
    image: "/marketing/services/automation.png",
    alt: "A dark workflow interface routing a lead through qualification and follow-up",
    span: "lg:row-span-2 lg:col-start-1 lg:row-start-3",
    motion: "marketing-showcase-push",
    position: "object-center",
  },
  {
    id: "strategy",
    label: "Marketing strategy",
    note: "Where the business should go, mapped.",
    image: "/marketing/services/strategy.png",
    alt: "A top-down strategic planning workspace with journey diagrams and notes",
    span: "lg:col-start-2 lg:row-start-3",
    motion: "marketing-showcase-push",
    position: "object-center",
  },
  {
    id: "campaigns",
    label: "Ad campaigns",
    note: "Built, launched, and operated.",
    image: "/marketing/services/campaigns.png",
    alt: "A campaign operations console with audiences, ad groups, and statuses",
    span: "lg:col-start-3 lg:row-start-3",
    motion: "marketing-showcase-pan",
    position: "object-[20%_center]",
  },
  {
    id: "analytics",
    label: "Analytics & attribution",
    note: "See what marketing is actually producing — ad to lead to sale.",
    image: "/marketing/services/analytics.png",
    alt: "A dark analytics interface tracing conversion paths from ads to revenue",
    span: "lg:col-span-2 lg:row-span-2 lg:col-start-2 lg:row-start-4",
    motion: "marketing-showcase-push",
    position: "object-center",
  },
  {
    id: "email",
    label: "Email & SMS",
    note: "The conversation after the lead arrives.",
    image: "/marketing/services/email.png",
    alt: "A phone with a text thread beside a laptop showing an email sequence, on a warm desk",
    span: "lg:row-span-2 lg:col-start-1 lg:row-start-5",
    motion: "marketing-showcase-push",
    position: "object-[35%_center]",
  },
  {
    id: "paid",
    label: "Paid campaigns",
    note: "Budget moved toward what works.",
    image: "/marketing/services/paid.png",
    alt: "A media-buying workstation reviewing spend and performance",
    span: "lg:col-start-2 lg:row-start-6",
    motion: "marketing-showcase-push",
    position: "object-[center_30%]",
  },
  {
    id: "landing",
    label: "Landing pages",
    note: "The click has somewhere intelligent to go.",
    image: "/marketing/services/landing.png",
    alt: "A clean landing page shown on desktop and mobile side by side",
    span: "lg:col-start-3 lg:row-start-6",
    motion: "marketing-showcase-pan",
    position: "object-center",
  },
] as const

export function CreativeTilesGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[11.5rem]">
      {CREATIVE_TILES.map((tile) => {
        const big = tile.span.includes("col-span-2")
        return (
          <div
            key={tile.id}
            className={`group relative h-56 overflow-hidden rounded-[1.5rem] shadow-[0_12px_40px_rgba(15,30,46,0.1)] lg:h-auto ${tile.span}`}
          >
            {/* Photograph is the subject; motion is a slow editorial push or pan. */}
            <Image
              src={tile.image}
              alt={tile.alt}
              width={1024}
              height={768}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`absolute inset-0 h-full w-full object-cover ${tile.position} ${tile.motion} transition-transform duration-700 group-hover:scale-[1.05]`}
            />
            {/* Stronger bottom scrim + text shadow so captions stay readable on busy photos. */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 transition-transform duration-500 group-hover:-translate-y-1 [text-shadow:0_1px_12px_rgba(15,30,46,0.65)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">{tile.label}</p>
              {big ? (
                <p className="mt-1 max-w-md text-[15px] font-medium leading-snug text-white">{tile.note}</p>
              ) : (
                <p className="mt-0.5 text-[13px] font-medium leading-snug text-white/95">{tile.note}</p>
              )}
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
          <BookingLink
            source="marketing"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-ink transition hover:bg-white/90"
          >
            Book a demo
          </BookingLink>
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
      {STATS.map((stat) => {
        const display = Math.round(stat.from + (stat.value - stat.from) * progress)
        return (
          <div key={stat.label} className="border-t border-black/[0.1] pt-5">
            <p className="text-[2.6rem] font-bold leading-none tracking-tight text-ink md:text-[3.2rem]">
              {stat.prefix}
              {display.toFixed(stat.decimals)}
              {stat.suffix}
            </p>
            <p className="mt-3 max-w-[16rem] text-[14px] leading-relaxed text-slate-500">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
