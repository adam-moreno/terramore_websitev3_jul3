"use client"

import { INTEGRATION_LOGOS } from "@/lib/integrations"

// One slim row of the same marks the desktop orbit uses. Shown under the hero CTA on phones,
// where the orbit would float over the headline.
function LogoRow() {
  return (
    <div className="flex items-center gap-3 pr-3">
      {INTEGRATION_LOGOS.map((logo) => (
        <span
          key={logo.slug}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1 ring-black/[0.04]"
        >
          <img src={`https://cdn.simpleicons.org/${logo.slug}`} alt="" title={logo.name} className="h-[18px] w-[18px] object-contain" />
        </span>
      ))}
    </div>
  )
}

export function HeroLogoMarquee({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-hidden>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex w-max animate-hero-marquee">
        <LogoRow />
        <LogoRow />
      </div>
    </div>
  )
}
