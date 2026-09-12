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
    headline: "Show up where people look.",
    copy: "A second store. Maps. Your own search. The listing sites people already use. The facts stay the same.",
    visual: <DiscoverabilityVisual />,
    quote: "We only show up if someone types our name.",
    reply: "Maps is live. Search is on. You are on the stores people open first.",
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
    <section id="use-cases" className="scroll-mt-28 bg-cream py-16 md:py-24">
      <div className="page-shell">
        {showIntro ? (
          <>
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.18em] text-ink/40">Use cases</p>
        <h2 className="mx-auto mt-3 max-w-[640px] text-center text-[1.85rem] font-bold tracking-[-0.04em] text-ink md:text-[2.5rem]">
          Pick a job. <span className="text-gold">We have done it before.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[15px] leading-relaxed text-ink/70">
          These are the first things founders ask us to take.
        </p>
          </>
        ) : null}

        {/* Phones: one row that scrolls sideways, bleeding to the screen edge with a fade so it reads as scrollable. Desktop: wrapped and centered. */}
        <div className="relative -mx-5 mt-8 sm:-mx-6 md:mx-0">
          <div
            ref={pillRow}
            role="tablist"
            aria-label="Jobs"
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-5 px-5 py-1 scrollbar-hide sm:scroll-px-6 sm:px-6 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:py-0"
          >
            {JOBS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === active}
                onClick={() => setActive(item.id)}
                className={`shrink-0 snap-start whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium ${
                  item.id === active ? "bg-brand text-white" : "bg-white text-ink shadow-sm hover:bg-white/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-cream to-transparent md:hidden" />
        </div>

        <div className="mx-auto mt-8 grid max-w-[920px] overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] md:mt-10 md:grid-cols-2">
          <div className="relative min-h-[240px] bg-[#eef3fb] md:min-h-[360px]">{job.visual}</div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{job.label}</p>
            <h3 className="mt-2 text-[1.45rem] font-semibold tracking-tight text-ink">{job.headline}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{job.copy}</p>
            <div className="mt-6 rounded-2xl bg-[#f7f7f5] px-4 py-3">
              <p className="text-[13px] text-slate-700">
                <span className="slack-mention">@Terramore</span> {job.quote}
              </p>
              <p className="mt-2 text-[13px] text-slate-500">{job.reply}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
