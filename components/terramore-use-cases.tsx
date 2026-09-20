"use client"

import { useRef, useState, type ReactNode } from "react"
import { useScrollRow } from "@/hooks/use-scroll-row"
import {
  AudienceIntelVisual,
  BookingTilesVisual,
  CheckoutFlowVisual,
  DiscoverabilityVisual,
  DropFilesVisual,
  PhoneFlowVisual,
  RefillSequenceVisual,
} from "@/components/software-visuals"

export const JOBS: {
  id: string
  label: string
  headline: string
  copy: string
  visual: ReactNode
  quote: string
  reply: string
}[] = [
  {
    id: "checkout",
    label: "Recover checkout revenue",
    headline: "People leave at shipping.",
    copy: "We find the step that scares them off and fix that page. Same store. More orders finish.",
    visual: <CheckoutFlowVisual />,
    quote: "Can you see why carts are dying?",
    reply: "Yes. People leave when shipping shows on mobile. The new shipping estimate is live.",
  },
  {
    id: "room",
    label: "Fill the appointment book",
    headline: "Paid ads that actually book.",
    copy: "We keep the offer that fills the calendar. We cut the videos people have already seen.",
    visual: <BookingTilesVisual />,
    quote: "Paid feels expensive again.",
    reply: "The pack ads on Meta are the ones that book. We pulled spend off the old three videos.",
  },
  {
    id: "phone",
    label: "Answer every call and message",
    headline: "A missed call is still a lead.",
    copy: "The AI assistant picks up after hours or in site chat. It asks the same questions you would, then books the ones who are ready.",
    visual: <PhoneFlowVisual />,
    quote: "We miss calls after 5.",
    reply: "The assistant texts, qualifies, and puts a hold on the board.",
  },
  {
    id: "drop",
    label: "Launch a campaign",
    headline: "One calendar. Every channel.",
    copy: "Apparel, fitness, a clinic, a home job. Each post has a date, a file, and a place it goes live.",
    visual: <DropFilesVisual />,
    quote: "Where are last week's files?",
    reply: "The calendar is the brief. Same files, dated, ready to post.",
  },
  {
    id: "return",
    label: "Drive repeat purchase",
    headline: "Buy once. Come back.",
    copy: "Welcome, refill day, and an early restock. Simple emails that ask them to return.",
    visual: <RefillSequenceVisual />,
    quote: "People buy once and disappear.",
    reply: "The refill emails are live. Welcome, day 28, and the early restock.",
  },
  {
    id: "discoverability",
    label: "Get found online",
    headline: "Show up in ChatGPT, Google, and Maps.",
    copy: "AI answers, Google Search, and Google Maps are where buyers look first — and Maps is still underused by most local businesses. We get you found there, then keep names, hours, and listings in sync.",
    visual: <DiscoverabilityVisual />,
    quote: "We only show up if someone types our name.",
    reply: "Maps is live. Search is on. You show up when people ask ChatGPT too.",
  },
  {
    id: "audience",
    label: "Reach people ready to buy",
    headline: "Talk to people who will buy.",
    copy: "We watch who notices you, who comes to the site, and who is ready. Then ads and email go to those people.",
    visual: <AudienceIntelVisual />,
    quote: "We are talking to the wrong people.",
    reply: "The ready list is live. Spend now goes to people who already looked.",
  },
]

export function TerramoreUseCases({ showIntro = true }: { showIntro?: boolean }) {
  const [active, setActive] = useState(JOBS[0].id)
  const job = JOBS.find((item) => item.id === active) ?? JOBS[0]
  const activeIndex = JOBS.findIndex((item) => item.id === job.id)
  const pillRow = useRef<HTMLDivElement>(null)
  useScrollRow(pillRow, activeIndex)

  return (
    <section id="use-cases" className="section-y scroll-mt-28 bg-cream md:py-24">
      <div className="page-shell">
        {showIntro ? (
          <>
        <p className="section-eyebrow text-center">Use cases</p>
        <h2 className="section-title mx-auto mt-3 max-w-[640px] text-center text-ink md:text-[2.5rem] md:leading-normal md:tracking-[-0.04em]">
          Pick a job. <span className="text-gold">We have done it before.</span>
        </h2>
        <p className="section-lede mx-auto mt-4 max-w-md text-center text-ink/70 md:text-[15px] md:leading-relaxed">
          These are the first things founders ask us to take.
        </p>
          </>
        ) : null}

        {/* The job chips wrap into centered rows on every width, the way lindy.ai lays out its use-case chips on a phone. Nothing scrolls sideways. */}
        <div className="mt-10 md:mt-8">
          <div
            ref={pillRow}
            role="tablist"
            aria-label="Jobs"
            className="flex flex-wrap justify-center gap-2"
          >
            {JOBS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === active}
                onClick={() => setActive(item.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium md:py-2 ${
                  item.id === active ? "bg-brand text-white" : "bg-white text-ink shadow-sm hover:bg-white/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phones: the visual sits inset inside the card with its own radius, text below with 20px padding. From md up the two-column card is unchanged. */}
        <div className="card-radius mx-auto mt-10 grid max-w-[920px] overflow-hidden border border-black/[0.06] bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] md:mt-10 md:grid-cols-2 md:rounded-[28px]">
          <div className="p-2 md:p-0">
            <div className="relative min-h-[240px] overflow-hidden rounded-[16px] bg-[#eef3fb] md:min-h-[360px] md:rounded-none">{job.visual}</div>
          </div>
          <div className="card-pad flex flex-col justify-center md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{job.label}</p>
            <h3 className="mt-2 text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-ink md:text-[1.45rem] md:leading-normal">{job.headline}</h3>
            <p className="mt-2 text-[16px] leading-[1.5] text-ink/70 md:text-[15px] md:leading-relaxed">{job.copy}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
