import type { Metadata } from "next"
import { BookingFlow } from "@/components/booking-flow"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Book a call | Terramore",
  description: "Pick a time for a free 30-minute call with Adam Moreno. Times show in your time zone and the invite lands in your inbox.",
  alternates: { canonical: "https://terramore.io/book" },
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-shell pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.2fr] md:gap-14">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Book a call</p>
            <h1 className="mt-3 text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink md:text-[3rem]">
              Let&apos;s talk about the business.
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
              Free 30 minutes. We look at where the business loses sales and say what we would fix first. A few questions up front so the call is useful.
            </p>
            <ul className="mt-6 space-y-2 text-[15px] text-slate-600">
              <li>Qualify in about a minute, then pick a time.</li>
              <li>Google Meet link in the invite.</li>
              <li>Times shown in your time zone. Move or cancel from the confirmation email.</li>
            </ul>
          </div>
          <div className="rounded-[1.75rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9">
            <BookingFlow />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
