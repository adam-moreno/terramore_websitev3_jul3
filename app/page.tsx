"use client"

import { Calendar } from "lucide-react"
import { BookingLink } from "@/components/booking-popup"
import Link from "next/link"
import { ReportPopupLink } from "@/components/report-popup"
import { useEffect, useState } from "react"
import { HomeFaq } from "@/components/home-faq"
import { ReportBand } from "@/components/report-band"
import { ReviewCarousel } from "@/components/review-carousel"
import { SecurityBand } from "@/components/security-band"
import { SiteFooter } from "@/components/site-footer"
import { G2Rating } from "@/components/g2-rating"
import { HeroAnalytics } from "@/components/hero-analytics"
import { HeroFloatingLogos } from "@/components/hero-floating-logos"
import { HeroLogoMobius } from "@/components/hero-logo-mobius"
import { TerramoreToolkit } from "@/components/terramore-toolkit"
import { TerramoreUseCases } from "@/components/terramore-use-cases"

function ScheduleFab() {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const sync = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches
      if (!mobile) {
        setPastHero(true)
        return
      }
      setPastHero(window.scrollY > window.innerHeight * 0.7)
    }
    sync()
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[70] transition duration-300 ease-out ${
        pastHero
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100"
      }`}
    >
      <BookingLink className="inline-flex h-11 items-center rounded-2xl bg-brand px-4 text-[14px] font-medium text-white shadow-lg transition-shadow hover:bg-brand-hover hover:shadow-xl">
        <Calendar className="mr-2 h-4 w-4" aria-hidden />
        Schedule
      </BookingLink>
    </div>
  )
}

export default function TerramoreHomepage() {
  return (
    <div className="min-h-screen bg-cream">
      <ScheduleFab />

      <section className="relative isolate overflow-hidden bg-cream pt-36 pb-5 md:pt-32 md:pb-24">
        {/* The orbit only runs from md up. On phones it floated over the headline, so the marks move to a slim row under the CTA. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[100svh] overflow-hidden md:block">
          <HeroLogoMobius />
        </div>

        {/* Phones: floating integration marks scattered around the hero edges, behind the copy. */}
        <HeroFloatingLogos className="md:hidden" />

        {/*
          Mobile (Lindy rhythm): generous header→headline air (pt-36), tight message stack,
          then a top-aligned min-height so Slack only peeks (~7rem) into the first viewport.
          Do not justify-center on mobile. Desktop tall centered column unchanged.
        */}
        <div className="relative z-20 flex min-h-[calc(100svh-18rem)] flex-col justify-start md:-mt-28 md:min-h-[calc(100svh-10.75rem)] md:justify-center md:pt-28">
          <div className="page-shell relative z-20 text-center">
            <div
              className="mx-auto flex w-full max-w-[22.5rem] flex-col items-center sm:max-w-[28rem] md:max-w-none md:inline-flex"
              data-hero-copy
            >
              <h1 className="mx-auto text-center text-[2.35rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[72px] md:leading-[75.6px]">
                Unlock{" "}
                <span className="text-gold tracking-[-0.01em]">more</span> from the{" "}
                <br className="hidden md:block" />
                <span className="text-gold">business you already built.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[20.5rem] text-center text-[16px] font-medium leading-[1.4] text-ink sm:max-w-[26rem] md:mt-8 md:max-w-[626px] md:text-[20px] md:leading-[30px]">
                We find where the business already wins, then add marketing and sales to get more customers and grow your revenue.
              </p>
              <div className="mt-6 flex flex-col items-center md:mt-8">
                <Link
                  href="/partner"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover md:h-10 md:px-4"
                >
                  Let&apos;s talk
                </Link>
                <div className="mt-2.5 flex flex-col items-center gap-1 text-center text-[13px] font-medium text-ink/45">
                  <p>Free 30-minute call.</p>
                  <ReportPopupLink className="text-[13px] font-medium text-ink/45 underline-offset-4 hover:text-ink">
                    <span className="md:hidden">Or tap for a free Digital Footprint report</span>
                    <span className="hidden md:inline">Or click here for a Digital Footprint report</span>
                  </ReportPopupLink>
                </div>
                <div className="mt-2.5">
                  <G2Rating rating="4.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Lindy-like air before the Slack peek; desktop gap unchanged. */}
        <div className="page-shell relative z-20 mt-8 md:mt-0">
          <div className="mx-auto w-full max-w-[972px]">
            <HeroAnalytics />
          </div>
        </div>
      </section>

      <TerramoreToolkit />
      <ReviewCarousel />
      <SecurityBand />
      <TerramoreUseCases />
      <ReportBand />
      <HomeFaq />
      <SiteFooter />
    </div>
  )
}
