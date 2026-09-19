import type { Metadata } from "next"
import { BookingFlow } from "@/components/booking-flow"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Book a call | Terramore",
  description:
    "Bring the growth problem. We look at where you are, name the biggest openings, and say what we would do next. Free 30 minutes.",
  alternates: { canonical: "https://www.terramore.io/book" },
  openGraph: {
    title: "Book a call | Terramore",
    description: "A short call to find what is holding growth back, and what we would change first.",
    url: "https://www.terramore.io/book",
  },
}

const STEPS = [
  { n: "01", title: "Where you are", body: "Your business, marketing, and what is already working." },
  { n: "02", title: "What is in the way", body: "The gap, the bottleneck, or the missed sale." },
  { n: "03", title: "What we would change", body: "Practical next steps. No long pitch." },
  { n: "04", title: "What is next", body: "If it is a fit, we say how Terramore can help." },
] as const

export default function BookPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-shell pb-8 pt-8 md:pb-10 md:pt-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Book a call</p>
        <h1 className="mt-3 max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.2rem]">
          Let&apos;s find what is holding growth back.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
          Bring the current growth problem. We look at where you are, name the biggest openings, and outline what we would do next.
        </p>
      </section>

      <section className="page-shell pb-10 md:pb-14">
        <h2 className="text-[1.25rem] font-semibold tracking-tight text-ink">What the call covers</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-[1.25rem] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">{step.n}</p>
              <h3 className="mt-2 text-[16px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-shell pb-8">
        <div className="rounded-[1.25rem] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:px-7">
          <h2 className="text-[1.15rem] font-semibold text-ink">Who should book</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600">
            Owners and teams who want more demand, a clearer path to a sale, and systems that can keep up. Free 30 minutes. Times show in your time zone.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 md:pb-24">
        <h2 className="mb-4 text-[1.25rem] font-semibold tracking-tight text-ink">Pick a time</h2>
        <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9">
          <BookingFlow source="book" />
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
