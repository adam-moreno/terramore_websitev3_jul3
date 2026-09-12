"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { CalendlyWidget } from "@/components/calendly-widget"
import Link from "next/link"
import { HomeFaq } from "@/components/home-faq"
import { ReportBand } from "@/components/report-band"
import { ReviewCarousel } from "@/components/review-carousel"
import { SecurityBand } from "@/components/security-band"
import { SiteFooter } from "@/components/site-footer"
import { HeroAnalytics } from "@/components/hero-analytics"
import { HeroLogoMobius } from "@/components/hero-logo-mobius"
import { TerramoreToolkit } from "@/components/terramore-toolkit"
import { TerramoreUseCases } from "@/components/terramore-use-cases"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"

export default function TerramoreHomepage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()

  return (
    <div className="min-h-screen bg-cream">
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          onClick={() => setIsPopupOpen(true)}
          className="rounded-full bg-brand shadow-lg transition-shadow hover:bg-brand-hover hover:shadow-xl"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      <section className="relative isolate overflow-hidden bg-cream pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden">
          <HeroLogoMobius />
        </div>

        <div className="-mt-28 flex min-h-[calc(100svh-10.75rem)] flex-col justify-center pt-28">
          <div className="page-shell relative z-20 text-center">
            <div className="mx-auto inline-flex flex-col items-center" data-hero-copy>
              <h1 className="mx-auto text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl md:text-[72px] md:leading-[75.6px]">
                Unlock more from the
                <br />
                <span className="text-gold">business you already built.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-[626px] text-[18px] font-medium leading-[1.5] text-ink md:text-[20px] md:leading-[30px]">
                A growth team for owners. We find where you lose sales and fix it.
              </p>
              <div className="mt-8 flex flex-col items-center">
                <Link
                  href="/partner"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-4 text-[16px] font-medium text-white hover:bg-brand-hover"
                >
                  Let&apos;s talk
                </Link>
              </div>
            </div>
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

      <CalendlyWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
