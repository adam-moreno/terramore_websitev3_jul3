"use client"

import { useEffect, useState } from "react"

// Mobile-only floating hero marks, in the spirit of lindy.ai: small, semi-transparent integration
// marks scattered around the edges and corners of the hero, behind the copy. They sit well away from
// the centered text column so the headline, subline, and CTA stay fully readable, and they float only
// subtly (and not at all when the visitor prefers reduced motion). The desktop Mobius orbit is separate.
const MARKS = [
  { slug: "google", name: "Google", top: "14%", left: "6%", size: 40, delay: "0s", dur: "6s" },
  { slug: "meta", name: "Meta", top: "10%", left: "84%", size: 36, delay: "0.6s", dur: "7s" },
  { slug: "mailchimp", name: "Mailchimp", top: "34%", left: "3%", size: 34, delay: "1.1s", dur: "6.5s" },
  { slug: "googleads", name: "Google Ads", top: "30%", left: "88%", size: 42, delay: "0.3s", dur: "7.5s" },
  { slug: "shopify", name: "Shopify", top: "56%", left: "5%", size: 38, delay: "0.9s", dur: "6.2s" },
  { slug: "instagram", name: "Instagram", top: "52%", left: "86%", size: 36, delay: "1.4s", dur: "7.2s" },
  { slug: "stripe", name: "Stripe", top: "76%", left: "8%", size: 34, delay: "0.2s", dur: "6.8s" },
  { slug: "tiktok", name: "TikTok", top: "72%", left: "89%", size: 38, delay: "1s", dur: "7s" },
] as const

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
      {MARKS.map((mark) => (
        <span
          key={mark.slug}
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
