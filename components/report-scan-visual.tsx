"use client"

import { useEffect, useRef, useState } from "react"
import { CHAPTERS } from "@/lib/report/chapters"

export function ReportScanVisual() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = scroller.current
    if (!root) return

    const syncActive = () => {
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-report-card]"))
      if (cards.length === 0) return

      // Pick the card whose left edge is closest to the scroller's left edge.
      // IntersectionObserver ratios mis-fire on the last card because of the trailing spacer.
      const left = root.scrollLeft
      let best = 0
      let bestDist = Infinity
      cards.forEach((card, index) => {
        const dist = Math.abs(card.offsetLeft - left)
        if (dist < bestDist) {
          bestDist = dist
          best = index
        }
      })
      setActive((current) => (current === best ? current : best))
    }

    syncActive()
    root.addEventListener("scroll", syncActive, { passive: true })
    window.addEventListener("resize", syncActive)
    return () => {
      root.removeEventListener("scroll", syncActive)
      window.removeEventListener("resize", syncActive)
    }
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
        Four chapters. Swipe through what you&apos;ll get.
      </p>

      <div
        ref={scroller}
        className="mt-4 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 scrollbar-hide"
        aria-label="Report chapters"
      >
        {CHAPTERS.map((chapter) => {
          const warn = chapter.tone === "warn"
          return (
            <article
              key={chapter.n}
              data-report-card
              className="flex w-[15.5rem] shrink-0 snap-start flex-col rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 sm:w-[17rem]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cream/45">
                Chapter {chapter.n}
              </p>
              <h3 className="mt-3 text-[1.5rem] font-semibold leading-tight tracking-tight text-cream sm:text-[1.65rem]">
                {chapter.kicker}
              </h3>
              <p
                className={`mt-3 text-[1.25rem] font-semibold tabular-nums leading-none ${
                  warn ? "text-[#ffb59e]/80" : "text-gold/85"
                }`}
              >
                {chapter.stat}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-cream/70">{chapter.caption}</p>
              <p className="mt-4 text-[12px] font-medium text-cream/55">{chapter.title}</p>
            </article>
          )
        })}
        {/* Trailing spacer so the last card can snap fully into view. */}
        <div aria-hidden className="w-2 shrink-0 sm:w-4" />
      </div>

      <div className="mt-3 flex items-center gap-2">
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
    </div>
  )
}
