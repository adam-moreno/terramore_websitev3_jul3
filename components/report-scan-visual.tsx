"use client"

import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import Link from "next/link"
import { CHAPTERS } from "@/lib/report/chapters"

const ADVANCE_MS = 3800

// Copied from software-visuals so the scan can stop moving for anyone who asks
// the system for reduced motion.
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduce(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return reduce
}

export function ReportScanVisual({
  active,
  setActive,
}: {
  active: number
  setActive: Dispatch<SetStateAction<number>>
}) {
  const reduce = usePrefersReducedMotion()
  const [hovering, setHovering] = useState(false)
  const [stopped, setStopped] = useState(false)
  const paused = hovering || stopped

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % CHAPTERS.length)
    }, ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused, setActive])

  const chapter = CHAPTERS[active]
  const warn = chapter.tone === "warn"

  return (
    <div
      className="flex h-full flex-col"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">What we found</p>

      <div className="mt-4 flex-1">
        <div key={active} className={reduce ? "" : "report-finding-in"}>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-cream/45">{chapter.kicker}</p>
          <p
            className={`mt-2 text-[3rem] font-semibold leading-none tracking-tight ${
              warn ? "text-[#ffb59e]" : "text-gold"
            }`}
          >
            {chapter.stat}
          </p>
          <p className="mt-3 max-w-[22rem] text-[14px] leading-relaxed text-cream/75">{chapter.caption}</p>
          <Link
            href={`/report/example#chapter-${chapter.n}`}
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-cream/60 underline-offset-4 hover:text-cream hover:underline"
          >
            Chapter {chapter.n} · {chapter.title}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {CHAPTERS.map((item, index) => {
          const on = index === active
          return (
            <button
              key={item.n}
              type="button"
              aria-pressed={on}
              aria-label={`Show finding ${index + 1} of ${CHAPTERS.length}`}
              onClick={() => {
                setActive(index)
                setStopped(true)
              }}
              className={`h-1.5 rounded-full transition-all ${
                on ? "w-6 bg-cream" : "w-1.5 bg-cream/30 hover:bg-cream/50"
              }`}
            />
          )
        })}
      </div>

      <p className="mt-3 text-[11px] text-cream/45">
        Sample findings from the Northline Atelier report. Yours reads your business.
      </p>
    </div>
  )
}
