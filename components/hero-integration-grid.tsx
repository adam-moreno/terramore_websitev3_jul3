"use client"

import { useEffect, useRef, useState } from "react"
import { INTEGRATION_LOGOS } from "@/lib/integrations"

// Mobile-only, calm social-proof treatment inspired by lindy.ai, which presents its integrations on
// phones as a tidy grid of logo chips inside one soft card with a short label, not a moving row.
// A curated 4x3 set of the real integration marks reads clearly at phone widths; the desktop hero
// keeps its Mobius orbit untouched. This block sits in flow below the CTA with generous clear space,
// so it never overlaps the hero headline or subline.
const CURATED = [
  "google",
  "meta",
  "shopify",
  "stripe",
  "mailchimp",
  "hubspot",
  "instagram",
  "tiktok",
  "youtube",
  "googleads",
  "whatsapp",
  "notion",
] as const

const MARKS = CURATED.map((slug) => INTEGRATION_LOGOS.find((logo) => logo.slug === slug)!).filter(Boolean)

export function HeroIntegrationGrid({ className = "" }: { className?: string }) {
  const [shown, setShown] = useState(false)
  const [reduce, setReduce] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduce(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Reduced motion shows the finished state at once, with no transform or stagger.
  const on = shown || reduce

  return (
    <div ref={ref} className={`mx-auto w-full max-w-[340px] ${className}`}>
      <p className="text-center text-[13px] font-medium leading-[1.5] text-ink/55">
        Works with the tools you already use
      </p>
      <div className="mt-4 grid grid-cols-4 gap-4 rounded-[24px] border border-black/[0.06] bg-white/70 p-5">
        {MARKS.map((logo, index) => (
          <span
            key={logo.slug}
            className="flex aspect-square items-center justify-center rounded-[16px] bg-white ring-1 ring-black/[0.05]"
            style={{
              opacity: on ? 1 : 0,
              transform: on ? "scale(1)" : "scale(0.9)",
              transition: reduce ? undefined : "opacity 500ms ease, transform 500ms ease",
              transitionDelay: reduce || !shown ? "0ms" : `${index * 40}ms`,
            }}
          >
            <img
              src={`https://cdn.simpleicons.org/${logo.slug}`}
              alt=""
              title={logo.name}
              className="h-6 w-6 object-contain"
            />
          </span>
        ))}
      </div>
    </div>
  )
}
