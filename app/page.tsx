"use client"

import { WhatTerramoreDoes } from "@/components/what-terramore-does"
import { BookingLink } from "@/components/booking-popup"
import { League_Spartan } from "next/font/google"
import { BusinessLookup, LookupBookButton, LookupReportButton } from "@/components/business-lookup"
import { HomeFaq } from "@/components/home-faq"
import { ReportBand } from "@/components/report-band"
import { ReviewCarousel } from "@/components/review-carousel"
import { SiteFooter } from "@/components/site-footer"
import { HeroFloatingLogos } from "@/components/hero-floating-logos"
import { HeroLogoOrbit } from "@/components/hero-logo-mobius"
import { TerramoreToolkit } from "@/components/terramore-toolkit"
import { TerramoreUseCases } from "@/components/terramore-use-cases"

/* Terramore.io header wordmark typeface. */
const brandMore = League_Spartan({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
})

export default function TerramoreHomepage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative isolate overflow-hidden bg-cream pt-36 pb-0 md:pt-32 md:pb-8">
        {/* The orbit only runs from md up. On phones it floated over the headline, so the marks move to a slim row under the CTA. */}
        <HeroLogoOrbit />

        {/* Phones: floating integration marks scattered around the hero edges, behind the copy. */}
        <HeroFloatingLogos className="md:hidden" />

        {/*
          Mobile (Lindy rhythm): generous header→headline air (pt-36), tight message stack,
          then a top-aligned min-height that shortens the cream column (100svh-15rem) so
          Slack peeks into the first viewport — one step above 14rem, still below 18rem.
          Do not justify-center on mobile. Desktop tall centered column unchanged.
        */}
        <div className="relative z-20 flex min-h-[calc(100svh-18rem)] flex-col justify-start md:-mt-28 md:min-h-0 md:pt-24 [@media(min-width:768px)_and_(max-height:820px)]:md:pt-[5.5rem]">
          <div className="page-shell relative z-20 text-center">
            <div
              className="mx-auto flex w-full max-w-none flex-col items-center sm:max-w-[28rem] md:max-w-none md:inline-flex"
            >
              {/* Search-first: the business lookup is the primary action; booking is the secondary line under it. */}
              <div className="w-full text-left md:w-[min(56rem,calc(100vw-4rem))]">
                <BusinessLookup
                  ctaId="home_hero_report"
                  source="homepage"
                  variant="hero"
                  align="center"
                  header={
                    <>
                    <h1 className="mx-auto text-center text-[2.35rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[64px] md:leading-[68px] [@media(min-width:768px)_and_(max-height:820px)]:text-[54px] [@media(min-width:768px)_and_(max-height:820px)]:leading-[58px]">
                    Unlock{" "}
                    <span className={`${brandMore.className} text-[1.28em] font-bold leading-none tracking-[-0.08em] text-ink`}>
                      more
                    </span>
                    <br />
                    from <span className="text-gold-display">the business</span>
                    <br />
                    <span className="text-gold-display">you already built.</span>
                  </h1>
                  <p className="mx-auto mt-4 max-w-xl text-center text-[16px] leading-relaxed text-ink/70 md:text-[18px]">
                    We find where you&apos;re losing customers, fix it, and run the marketing that brings them back.
                  </p>
                    </>
                  }
                  anchor
                  secondary={
                    <BookingLink
                      label="Or book a free call"
                      source="homepage"
                      ctaId="home_hero_book"
                      className="inline-flex min-h-11 items-center justify-center text-[14px] font-medium text-ink/70 underline underline-offset-4 hover:text-ink"
                    />
                  }
                  next={
                    <>
                      <LookupReportButton ctaId="marketing_lookup_report" />
                      <LookupBookButton ctaId="marketing_lookup_book" />
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatTerramoreDoes />

      <TerramoreToolkit />
      <ReviewCarousel />
      <TerramoreUseCases />
      <ReportBand />
      <HomeFaq />
      {/* The FAQ already closes with Check my business / Talk with us, so the footer does not repeat them here. */}
      <SiteFooter showDualCtas={false} />
    </div>
  )
}
