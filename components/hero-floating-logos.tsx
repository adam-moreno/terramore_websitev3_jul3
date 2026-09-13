"use client"

import { useEffect, useState } from "react"
import { INTEGRATION_LOGOS } from "@/lib/integrations"

// Mobile-only floating hero marks, in the spirit of lindy.ai: small, semi-transparent integration
// marks scattered around the edges and corners of the hero, behind the copy. They sit well away from
// the centered text column so the headline, subline, and CTA stay fully readable, and they float only
// subtly (and not at all when the visitor prefers reduced motion). The desktop Mobius orbit is separate.
//
// Placement rule: the copy lives in a narrow centered column, roughly the middle 40% of the width and
// the middle third of the height. So the marks stay in the left and right side rails (any height) plus
// the top and bottom bands (where the horizontal center is empty). Nothing lands over the headline,
// subhead, or CTA. Sizes vary a little so the field does not read like a grid.
const MARK_SPOTS = [
  // Left side rail
  { top: "8%", left: "4%", size: 40 },
  { top: "21%", left: "9%", size: 34 },
  { top: "34%", left: "3%", size: 38 },
  { top: "47%", left: "8%", size: 32 },
  { top: "60%", left: "4%", size: 42 },
  { top: "73%", left: "9%", size: 34 },
  { top: "86%", left: "5%", size: 36 },
  // Right side rail
  { top: "7%", left: "90%", size: 36 },
  { top: "19%", left: "85%", size: 42 },
  { top: "32%", left: "92%", size: 32 },
  { top: "45%", left: "86%", size: 38 },
  { top: "58%", left: "91%", size: 34 },
  { top: "71%", left: "85%", size: 40 },
  { top: "84%", left: "91%", size: 34 },
  // Top band (center is empty above the headline)
  { top: "4%", left: "28%", size: 32 },
  { top: "3%", left: "52%", size: 38 },
  { top: "6%", left: "70%", size: 30 },
  // Bottom band (center is empty below the CTA, above the analytics card)
  { top: "90%", left: "24%", size: 34 },
  { top: "93%", left: "40%", size: 30 },
  { top: "91%", left: "58%", size: 36 },
  { top: "89%", left: "74%", size: 32 },
] as const

const MARKS = MARK_SPOTS.map((spot, index) => {
  const logo = INTEGRATION_LOGOS[index % INTEGRATION_LOGOS.length]
  return {
    slug: logo.slug,
    name: logo.name,
    top: spot.top,
    left: spot.left,
    size: spot.size,
    delay: `${(index % 8) * 0.3}s`,
    dur: `${6 + (index % 5) * 0.4}s`,
  }
})

export function HeroFloatingLogos({ className = "" }: { className?: string }) {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduce(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden>
      {MARKS.map((mark, index) => (
        <span
          key={`${mark.slug}-${index}`}
          className="absolute flex items-center justify-center rounded-2xl bg-white/70 opacity-[0.28] shadow-[0_8px_24px_-14px_rgba(15,30,46,0.35)] ring-1 ring-black/[0.04]"
          style={{
            top: mark.top,
            left: mark.left,
            width: mark.size,
            height: mark.size,
            animation: reduce ? undefined : `hero-float ${mark.dur} ease-in-out ${mark.delay} infinite`,
          }}
        >
          <img
            src={`https://cdn.simpleicons.org/${mark.slug}`}
            alt=""
            className="object-contain"
            style={{ width: mark.size * 0.5, height: mark.size * 0.5 }}
          />
        </span>
      ))}
    </div>
  )
}
