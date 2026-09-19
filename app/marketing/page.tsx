import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Marketing | Terramore",
  description:
    "Terramore builds a growth system around your business: strategy, demand, conversion, automation, and measurement. Talk first.",
  alternates: { canonical: "https://www.terramore.io/marketing" },
  openGraph: {
    title: "Marketing | Terramore",
    description:
      "Strategy, ads, content, follow-up, and numbers in one growth system built around your business.",
    url: "https://www.terramore.io/marketing",
  },
}

const SYSTEM = ["Strategy", "Acquisition", "Conversion", "Automation", "Intelligence"] as const

const CAPABILITIES = [
  {
    title: "Growth strategy",
    body: "Positioning, offer, acquisition plan, and a roadmap your team can run.",
  },
  {
    title: "Demand",
    body: "Google, Meta, TikTok, and other paid channels that send people who can buy.",
  },
  {
    title: "Content",
    body: "Short-form, creative, and distribution so the offer is easy to see.",
  },
  {
    title: "Conversion",
    body: "Landing pages, lead capture, qualification, and a clear next step.",
  },
  {
    title: "Automation",
    body: "CRM, email, SMS, and follow-up so a lead does not sit still.",
  },
  {
    title: "Analytics",
    body: "Attribution, dashboards, reporting, and Terra IQ so you see what pays.",
  },
] as const

function TalkButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/book"
      className={`inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover ${className}`}
    >
      Let&apos;s talk
    </Link>
  )
}

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-shell pb-10 pt-8 md:pb-16 md:pt-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Marketing</p>
        <h1 className="mt-3 max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.4rem]">
          Marketing that works as a growth system.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
          Terramore puts strategy, ads, content, follow-up, and numbers into one system built around your business.
        </p>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <TalkButton />
          <Link href="/report" className="text-[15px] font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline">
            Or get a free Digital Footprint report
          </Link>
        </div>
      </section>

      <section className="page-shell pb-12 md:pb-16">
        <h2 className="text-[1.4rem] font-semibold tracking-tight text-ink md:text-[1.7rem]">How the system runs</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SYSTEM.map((step, index) => (
            <li key={step} className="rounded-[1.25rem] bg-white px-4 py-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">0{index + 1}</p>
              <p className="mt-2 text-[17px] font-semibold text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-shell pb-12 md:pb-16">
        <h2 className="text-[1.4rem] font-semibold tracking-tight text-ink md:text-[1.7rem]">What we work on</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <article key={item.title} className="rounded-[1.25rem] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
              <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell pb-12 md:pb-16">
        <div className="rounded-[1.75rem] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:px-10 md:py-10">
          <h2 className="text-[1.4rem] font-semibold tracking-tight text-ink md:text-[1.7rem]">Who it is for</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Business owners who already have a shop, a service, or a list, and want that to grow. We start with what is already working, then fix the step that loses sales.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 text-center md:pb-24">
        <h2 className="text-[1.6rem] font-bold tracking-tight text-ink md:text-[2rem]">Ready to see the next step?</h2>
        <div className="mt-6">
          <TalkButton />
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
