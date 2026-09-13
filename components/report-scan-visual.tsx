"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CHAPTERS } from "@/lib/report/chapters"

export function ReportScanVisual() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = scroller.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-report-card]"))
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = cards.indexOf(visible.target as HTMLElement)
        if (index >= 0) setActive(index)
      },
      { root, threshold: [0.55, 0.7] }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (index: number) => {
    const root = scroller.current
    if (!root) return
    const card = root.querySelectorAll<HTMLElement>("[data-report-card]")[index]
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
    setActive(index)
  }

  return (
    <div className="flex h-full flex-col">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">
        What is in your free report
      </p>
      <p className="mt-1.5 text-[15px] font-medium leading-snug text-cream/70">
        Four pages. Swipe through the sample from Northline Atelier.
      </p>

      <div
        ref={scroller}
        className="mt-4 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide"
        aria-label="Report chapters"
      >
        {CHAPTERS.map((chapter) => {
          const warn = chapter.tone === "warn"
          return (
            <article
              key={chapter.n}
              data-report-card
              className="flex w-[min(100%,18.5rem)] shrink-0 snap-start flex-col rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cream/45">
                Chapter {chapter.n}
              </p>
              <h3 className="mt-3 text-[1.65rem] font-semibold leading-tight tracking-tight text-cream">
                {chapter.kicker}
              </h3>
              <p
                className={`mt-3 text-[1.35rem] font-semibold tabular-nums leading-none ${
                  warn ? "text-[#ffb59e]/80" : "text-gold/85"
                }`}
              >
                {chapter.stat}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-cream/70">{chapter.caption}</p>
              <Link
                href={`/report/example#chapter-${chapter.n}`}
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-cream/55 underline-offset-4 hover:text-cream hover:underline"
              >
                {chapter.title}
                <span aria-hidden>→</span>
              </Link>
            </article>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {CHAPTERS.map((item, index) => {
          const on = index === active
          return (
            <button
              key={item.n}
              type="button"
              aria-pressed={on}
              aria-label={`Show chapter ${item.n}`}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                on ? "w-6 bg-cream" : "w-1.5 bg-cream/30 hover:bg-cream/50"
              }`}
            />
          )
        })}
      </div>

      <p className="mt-3 text-[11px] text-cream/45">
        Sample pages from the Northline Atelier report. Yours reads your business.
      </p>
    </div>
  )
}
