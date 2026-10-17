"use client"

import { League_Spartan } from "next/font/google"
import { MapPin, Phone, Smartphone, Star } from "lucide-react"
import { BookingLink } from "@/components/booking-popup"
import { BusinessLookup, LookupBookButton, LookupReportButton } from "@/components/business-lookup"
import { DualCtas } from "@/components/dual-ctas"
import { HeroFloatingLogos } from "@/components/hero-floating-logos"
import { HeroLogoOrbit } from "@/components/hero-logo-mobius"
import { ReportBand } from "@/components/report-band"
import { ReviewCarousel } from "@/components/review-carousel"
import { SiteFooter } from "@/components/site-footer"
import { TerramoreToolkit } from "@/components/terramore-toolkit"
import { WhatTerramoreDoes } from "@/components/what-terramore-does"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PHONE_DISPLAY } from "@/lib/contact"
import { LA_FAQS } from "@/lib/los-angeles"

/* The homepage, told for Los Angeles: the same hero lookup and sections, plus what LA customers check before they call
   and where we work. Copy rule: only what Terramore does today. No ratings, client counts, or guarantees. */

const brandMore = League_Spartan({ subsets: ["latin"], weight: ["700"], display: "swap" })

const CHECKS = [
  {
    icon: MapPin,
    title: "Your Google Maps listing",
    body: "Whether you show up when someone nearby searches for what you do, and whether your hours, services and website link are right.",
  },
  {
    icon: Star,
    title: "Your reviews",
    body: "Your rating, how many reviews you have, and whether recent ones got a reply. It's often the first thing people compare.",
  },
  {
    icon: Smartphone,
    title: "Your website on a phone",
    body: "Whether it says what you do and where, loads fast, and has one clear way to call or book.",
  },
]

const AREAS = [
  "Los Angeles",
  "San Fernando Valley",
  "Pasadena",
  "Glendale",
  "Burbank",
  "Santa Monica",
  "Long Beach",
  "South Bay",
]


export function LosAngelesLanding() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative isolate overflow-hidden bg-cream pt-36 pb-0 md:pt-32 md:pb-8">
        <HeroLogoOrbit />
        <HeroFloatingLogos className="md:hidden" />
        <div className="relative z-20 flex min-h-[calc(100svh-18rem)] flex-col justify-start md:-mt-28 md:min-h-0 md:pt-24 [@media(min-width:768px)_and_(max-height:820px)]:md:pt-[5.5rem]">
          <div className="page-shell relative z-20 text-center">
            <div className="mx-auto flex w-full max-w-none flex-col items-center sm:max-w-[28rem] md:max-w-none md:inline-flex">
              <div className="w-full text-left md:w-[min(56rem,calc(100vw-4rem))]">
                <BusinessLookup
                  ctaId="city_hero_report"
                  source="los-angeles"
                  variant="hero"
                  align="center"
                  header={
                    <>
                      <div className="mb-3 flex justify-center">
                        <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-[13px] font-medium text-ink/70">
                        <MapPin aria-hidden className="h-3.5 w-3.5" />
                        Based in Los Angeles
                        </p>
                      </div>
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
                        Marketing for Los Angeles small businesses. We find where you&apos;re losing customers, fix it, and run the
                        marketing that brings them back.
                      </p>
                    </>
                  }
                  anchor
                  secondary={
                    <BookingLink
                      label="Or book a free call"
                      source="los-angeles"
                      ctaId="city_hero_book"
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

      <section className="section-y md:py-24" aria-labelledby="la-checks">
        <div className="page-shell">
          <h2 id="la-checks" className="section-title max-w-3xl text-ink md:text-[3rem] md:font-semibold md:leading-[1.1] md:tracking-[-0.03em]">
            In LA, customers compare you in seconds.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink/70">
            Before anyone calls, they check three things. The free check looks at all three and tells you what to fix first.
          </p>
          <div className="stack-gap mt-10 grid md:grid-cols-3">
            {CHECKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card-radius bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[19px] font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatTerramoreDoes />
      <ReportBand />
      <TerramoreToolkit />
      <ReviewCarousel />

      <section className="section-y md:py-24" aria-labelledby="la-areas">
        <div className="page-shell">
          <div className="card-radius bg-ink px-6 py-10 text-white md:px-12 md:py-14">
            <h2 id="la-areas" className="text-[28px] font-semibold leading-tight tracking-[-0.02em] md:text-[40px]">
              Across Los Angeles, without the drive.
            </h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-white/75">
              We work with owners all over the city and the county. Every meeting happens by video call, text or email, so
              nobody sits in traffic.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Areas we work in">
              {AREAS.map((area) => (
                <li key={area} className="rounded-full border border-white/20 px-4 py-2 text-[15px] text-white/90">
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-2 text-[15px] text-white/75">
              <Phone aria-hidden className="h-4 w-4" />
              Prefer to talk now? Call {PHONE_DISPLAY}.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="section-y scroll-mt-28 md:py-24">
        <div className="page-shell">
          <h2 className="section-title max-w-3xl text-ink md:text-[3rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
            Questions LA owners ask first.
          </h2>
          <Accordion type="single" collapsible className="stack-gap mt-12 grid md:mt-10 md:block md:space-y-3">
            {LA_FAQS.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`faq-${index}`}
                className="card-radius border-none bg-white px-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:rounded-[1.25rem] md:px-6"
              >
                <AccordionTrigger className="text-left text-[17px] font-semibold text-ink hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-slate-600">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <DualCtas ctaId="city_closing_report" className="mt-12 md:mt-10" />
        </div>
      </section>

      <SiteFooter showDualCtas={false} />
    </div>
  )
}
