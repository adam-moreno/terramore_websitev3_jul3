"use client"

import Image from "next/image"
import { CalendarDays } from "lucide-react"
import { BookingLink } from "@/components/booking-popup"
import { CheckMyBusinessLink } from "@/components/business-lookup"

/**
 * Closing call to action for the free check: one dark band with the score card as its picture and one primary button.
 * It replaced the chapter carousel (hard to scroll, and the chapter list was desktop-only), which repeated what the
 * hero and the How-we-work section already say. The picture is Terramore's own score card UI, rendered from the brand
 * film (example data), so it carries an "Illustrative example" label (VR-29).
 */
export function ReportBand() {
  return (
    <section id="report" className="section-y scroll-mt-28 md:py-24">
      <div className="page-shell">
        <div className="card-radius mx-auto grid max-w-[1080px] items-center gap-8 overflow-hidden bg-ink px-6 py-10 text-cream shadow-[0_30px_60px_-30px_rgba(15,30,46,0.5)] md:rounded-[28px] md:px-12 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-from">Free business score</p>
            <h2 className="mt-3 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[2.5rem]">
              See your business the way a new customer already can.
            </h2>
            <p className="mx-auto mt-4 max-w-[30rem] text-[16px] leading-relaxed text-cream/75 lg:mx-0">
              Your score in seconds. No email needed.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <CheckMyBusinessLink
                ctaId="home_band_report"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Check my business
              </CheckMyBusinessLink>
              <BookingLink
                source="homepage"
                className="inline-flex h-11 items-center justify-center gap-2 px-2 text-[15px] font-medium text-cream/80 underline-offset-4 hover:text-cream hover:underline"
              >
                <CalendarDays aria-hidden className="h-4 w-4" />
                Or book a free call
              </BookingLink>
            </div>
          </div>
          <figure>
            <div className="overflow-hidden rounded-[18px] ring-1 ring-white/10 lg:rotate-[-1.5deg]">
              <Image
                src="/marketing/score-card-cta.png"
                alt="A Terramore score card: a website box and five scores from 0 to 100 for Digital Experience, Discoverability, Trust & Credibility, Conversion Readiness and Technical Health."
                width={1600}
                height={394}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <figcaption className="mt-3 text-center text-[12px] text-cream/60 lg:text-right">Illustrative example</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
