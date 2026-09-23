import type { Metadata } from "next"
import Image from "next/image"
import { BookingFlow } from "@/components/booking-flow"
import { Logo } from "@/components/logo"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Book a call | Terramore",
  description:
    "The report showed the gaps, this call closes them. Free 30 minutes to discuss how we can work together.",
  alternates: { canonical: "https://www.terramore.io/schedule" },
  openGraph: {
    title: "Book a call | Terramore",
    description: "The report showed the gaps, this call closes them. Free 30 minutes to discuss how we can work together.",
    url: "https://www.terramore.io/schedule",
    siteName: "Terramore.io",
    type: "website",
    images: [
      {
        url: "/share/terramore-share-schedule-og.png?v=3",
        width: 1200,
        height: 630,
        alt: "Book a call — you're one step away from changing your business.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a call | Terramore",
    description: "The report showed the gaps, this call closes them. Free 30 minutes to discuss how we can work together.",
    images: ["/share/terramore-share-schedule-og.png?v=3"],
  },
  robots: { index: false, follow: true },
}

/**
 * Calendar-first booking for outbound emails and sales follow-ups.
 * Skips qualifier steps (same startAtSchedule pattern as /solutions).
 * Share: https://www.terramore.io/schedule
 */
export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden pb-10 pt-10 md:pb-14 md:pt-14">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-cream via-brand/[0.05] to-cream" />
        <div className="page-shell relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Logo size="sm" animate={false} on="light" />
            </div>
            <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">Free 30 minutes</p>
            <h1 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              Pick a time. We&apos;ll look at what&apos;s holding growth back.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-slate-600">
              You talk directly with Adam — not a sales handoff. You leave with a clear sense of what we&apos;d fix
              first. Times show in your time zone.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <div className="hidden overflow-hidden rounded-[1.75rem] shadow-[0_16px_50px_rgba(15,30,46,0.12)] lg:block">
              <Image
                src="/founder/adam-moreno-headshot.png"
                alt="Adam Moreno, founder of Terramore"
                width={800}
                height={960}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="border-t border-black/[0.06] bg-white px-5 py-4">
                <p className="text-[15px] font-semibold text-ink">Adam Moreno</p>
                <p className="text-[13px] text-slate-500">Founder, Terramore</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_16px_50px_rgba(15,30,46,0.08)] md:p-8">
              <BookingFlow source="schedule" startAtSchedule />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter showDualCtas={false} />
    </div>
  )
}
