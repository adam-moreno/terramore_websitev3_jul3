"use client"

import { Calendar } from "lucide-react"
import { BookingLink } from "@/components/booking-popup"
import Link from "next/link"
import { HomeFaq } from "@/components/home-faq"
import { ReportBand } from "@/components/report-band"
import { ReviewCarousel } from "@/components/review-carousel"
import { SecurityBand } from "@/components/security-band"
import { SiteFooter } from "@/components/site-footer"
import { HeroAnalytics } from "@/components/hero-analytics"
import { HeroIntegrationGrid } from "@/components/hero-integration-grid"
import { HeroLogoMobius } from "@/components/hero-logo-mobius"
import { TerramoreToolkit } from "@/components/terramore-toolkit"
import { TerramoreUseCases } from "@/components/terramore-use-cases"

export default function TerramoreHomepage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="fixed bottom-4 right-4 z-50">
        <BookingLink className="inline-flex h-9 items-center rounded-full bg-brand px-4 text-[14px] font-medium text-white shadow-lg transition-shadow hover:bg-brand-hover hover:shadow-xl">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </BookingLink>
      </div>

      <section className="section-y relative isolate overflow-hidden bg-cream pt-28 md:pt-32 md:pb-24">
        {/* The orbit only runs from md up. On phones it floated over the headline, so the marks move to a slim row under the CTA. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[100svh] overflow-hidden md:block">
          <HeroLogoMobius />
        </div>

        <div className="-mt-28 flex min-h-[calc(100svh-14rem)] flex-col justify-center pt-28 md:min-h-[calc(100svh-10.75rem)]">
          <div className="page-shell relative z-20 text-center">
            <div className="mx-auto inline-flex flex-col items-center" data-hero-copy>
              <h1 className="mx-auto text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl md:text-[72px] md:leading-[75.6px]">
                Unlock more from the{" "}
                <br className="hidden md:block" />
                <span className="text-gold">business you already built.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-[626px] text-[18px] font-medium leading-[1.5] text-ink md:mt-8 md:text-[20px] md:leading-[30px]">
                A growth team for owners. We find where you lose sales and fix it.
              </p>
              <div className="mt-8 flex flex-col items-center">
                <Link
                  href="/partner"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover md:h-10 md:px-4"
                >
                  Let&apos;s talk
                </Link>
              </div>
            </div>
            <HeroIntegrationGrid className="mt-12 md:hidden" />
          </div>
        </div>

        <div className="page-shell relative z-20">
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
