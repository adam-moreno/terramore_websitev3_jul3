"use client"

import { useEffect, useRef, useState } from "react"

/**
 * "What Terramore does for your business": four stages on one path, from finding the broken step to the 90-day plan.
 * Copy is the site's own approved wording (the /marketing line from VD-029 and the How-we-work items in
 * components/terramore-toolkit.tsx), shortened, so this section makes no new claims.
 *
 * Motion (motion library D3, "glowing path with a tip"): purpose is sequence. The path draws once, left to right, when
 * the section first scrolls into view (1.4 s), and each stage settles in as the line reaches it. It never loops, so no
 * pause control is needed. Under reduced motion, and before the section is reached, everything is fully drawn: the
 * page reads correctly at rest.
 */

const STAGES = [
  {
    label: "Find",
    title: "See the broken step",
    body: "We look at how customers find you, what they click, and where they leave. You see the broken step before we charge you to fix it.",
  },
  {
    label: "Connect",
    title: "Work inside your tools",
    body: "Google, Meta, Shopify, HubSpot, Mailchimp. We join the accounts you already pay for. You don't start over.",
  },
  {
    label: "Act",
    title: "Follow up the same day",
    body: "A new lead reaches you and your team the same minute, then keeps moving: a time on the calendar, an invoice, the welcome files.",
  },
  {
    label: "Measure",
    title: "Leave with a 90-day plan",
    body: "Within a week at most, a written plan for the quarter with owners and dates: what to fix, what to turn on, what comes next.",
  },
] as const

export function WhatTerramoreDoes() {
  const ref = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<"rest" | "ready" | "play">("rest")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!("IntersectionObserver" in window)) return
    // Only sections that start below the fold animate; one already on screen stays drawn.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return
    setPhase("ready")
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("play")
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="what-terramore-does-heading"
      data-phase={phase}
      className="what-terramore bg-cream pb-6 pt-16 md:pb-10 md:pt-24"
    >
      <div className="page-shell">
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gold-ink">How we work with businesses</p>
          <h2
            id="what-terramore-does-heading"
            className="mt-3 text-balance text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[44px]"
          >
            What Terramore does for your business
          </h2>
          <p className="mx-auto mt-4 max-w-[38rem] text-[17px] leading-relaxed text-slate-700 md:text-[18px]">
            Terramore combines software, strategy, and hands-on execution to find the next growth opportunity, act on it,
            and measure what happens.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-[64rem] md:mt-16">
          {/* The path: horizontal from md up, vertical on phones. Decorative; the stages carry the meaning. */}
          <svg
            aria-hidden
            className="wt-path pointer-events-none absolute left-0 top-[14px] hidden h-[40px] w-full md:block"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
          >
            <path
              className="wt-line"
              d="M 125 20 C 250 20 250 4 375 4 S 500 36 625 36 S 750 20 875 20"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span aria-hidden className="wt-vline absolute bottom-8 left-[15px] top-4 w-[3px] rounded-full md:hidden" />

          <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
            {STAGES.map((stage, i) => (
              <li
                key={stage.label}
                className="wt-stage relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
                style={{ ["--wt-i" as string]: i }}
              >
                <span
                  aria-hidden
                  className="wt-node relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-[14px] font-bold text-ink md:mt-0 md:h-10 md:w-10"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 md:mt-5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-ink">{stage.label}</p>
                  <h3 className="mt-1 text-[19px] font-bold leading-snug text-ink">{stage.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-700 md:mx-auto md:max-w-[15rem]">
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center">
            <a
              href="#how-we-work"
              className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink underline underline-offset-4 hover:text-brand"
            >
              See each step in detail
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
