import type { Metadata } from "next"
import { BookingLink } from "@/components/booking-popup"
import { LindyPage } from "@/components/lindy-page"
import { ReportPopupLink } from "@/components/report-popup"

export const metadata: Metadata = {
  title: "Pricing | Terramore",
  description:
    "The first call is free. Scope and payment are set after we agree on the work. Jobs are priced by the job. Monthly is optional. You own the data and assets.",
}

const plans = [
  {
    name: "Talk",
    price: "Free",
    note: "A 30-minute call",
    points: [
      "You tell us where the business is stuck",
      "We tell you what we would look at first",
      "You find out if we are the right team",
    ],
    cta: "Book the call",
    featured: false,
  },
  {
    name: "Start",
    price: "Deposit",
    note: "After we agree on scope",
    points: [
      "Not every job is the same, so the price is not the same",
      "The deposit is invoiced after we agree on the work",
      "The first stretch can be 90 days, or we keep going",
      "Financing is available",
    ],
    cta: "Start with a call",
    featured: true,
  },
  {
    name: "Stay",
    price: "Monthly",
    note: "Optional. Not required.",
    points: [
      "Monthly is an option if you want us to stay in the tools",
      "You own the data, ads, lists, and assets",
      "We can stay as long as the work is useful",
    ],
    cta: "Ask about monthly",
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <LindyPage
      title="Talk first."
      accent="Pay when we start."
      subtitle="The call is free. Scope and payment are set after that call. Jobs are priced by the work, not a menu. You never pay to find out what is broken."
      ctaLabel="Book the free call"
    >
      <section className="pb-20">
        <div className="page-shell grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-3xl border bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
                plan.featured ? "border-blue-600" : "border-black/[0.06]"
              }`}
            >
              <p className="text-sm font-medium text-slate-500">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{plan.price}</p>
              <p className="mt-1 text-sm text-slate-500">{plan.note}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <BookingLink
                label={plan.cta}
                className={`mt-6 rounded-full px-4 py-2.5 text-center text-sm font-semibold ${
                  plan.featured
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="page-shell mt-10 text-center text-[15px] text-ink/70">
          Not ready for a call?{" "}
          <ReportPopupLink
            label="Ask for the free Digital Footprint report"
            className="font-medium text-brand hover:text-brand-hover"
          />
          . It shows the first thing we would fix, with no meeting.
        </p>
      </section>
    </LindyPage>
  )
}
