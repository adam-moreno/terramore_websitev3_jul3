"use client"

import { Calendar } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { BookingLink } from "@/components/booking-popup"

/**
 * Sitewide floating Schedule control.
 * In the first viewport (hero): calendar + "Schedule".
 * After scrolling past the hero: calendar icon only.
 */
export function ScheduleFab() {
  const pathname = usePathname()
  const [inHero, setInHero] = useState(true)

  useEffect(() => {
    const sync = () => {
      setInHero(window.scrollY < window.innerHeight * 0.65)
    }
    sync()
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [pathname])

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 z-[70] sm:right-4">
      <BookingLink
        source="floating_cta"
        aria-label="Schedule"
        className={`inline-flex items-center justify-center rounded-full bg-brand text-white shadow-lg transition-all duration-300 hover:bg-brand-hover hover:shadow-xl ${
          inHero ? "h-9 gap-1.5 px-3.5" : "h-9 w-9"
        }`}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={2.25} />
        {inHero ? <span className="text-[12px] font-medium">Schedule</span> : null}
      </BookingLink>
    </div>
  )
}
