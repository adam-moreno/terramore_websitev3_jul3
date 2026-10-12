import type { Metadata } from "next"
import { BookingLink } from "@/components/booking-popup"
import { CheckMyBusinessLink } from "@/components/business-lookup"
import { LindyPage } from "@/components/lindy-page"
import { ReportPopupLink } from "@/components/report-popup"

export const metadata: Metadata = {
  title: "Pricing | Terramore",
  description:
    "The first call is free. Month to month, priced by the work, agreed up front. Financing up to $10,000 through PayPal, subject to approval. You own the data and assets.",
}

const plans = [
  {
    name: "Talk",
    price: "Free",
    note: "A 30-minute call",
    points: [
      "You tell us where the business is stuck",
      "We tell you what we would fix first",
      "You find out if we are the right team",
    ],
    featured: false,
  },
  {
    name: "Work with us",
    price: "Monthly or yearly",
    note: "Scope and price agreed up front",
    points: [
      "Priced by the work you need, not a menu",
      "Month to month, no long contract required",
      "Or commit to a year and pay up front",
      "Financing up to $10,000 through PayPal, subject to approval",
    ],
    featured: true,
  },
  {
    name: "Software only",
    price: "Free to start",
    note: "Run it yourself",
    points: [
      "Check your business, then connect 2 tools free",
      "Get a plan from your own numbers",
      "More tools and history on a monthly plan, no contract",
    ],
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <LindyPage
      primary="book"
      title="Talk first."
      accent="Then monthly or yearly."
      subtitle="The call is free. We agree the scope and price before any work starts. Pay month to month, or for the year up front. You never pay to find out what is broken."
      ctaLabel="Book a free call"
    >
      <section className="pb-20">
        <div className="page-shell grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-3xl border bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
                plan.featured ? "border-brand" : "border-black/[0.06]"
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
{plan.name === "Software only" ? (
                <CheckMyBusinessLink
                  ctaId="pricing_software_report"
                  className="mt-6 rounded-full bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-slate-200"
                >
                  Start free
                </CheckMyBusinessLink>
              ) : (
                              <BookingLink
                  label="Book a free call"
                  className={`mt-6 rounded-full px-4 py-2.5 text-center text-sm font-semibold ${
                    plan.featured
                      ? "bg-brand text-white hover:bg-brand-hover"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="page-shell mt-10 text-center text-[15px] text-ink/70">
          Not ready for a call?{" "}
          <ReportPopupLink
            label="Check my business"
            className="font-medium text-brand hover:text-brand-hover"
          />
          . Your free Digital Footprint report shows the first thing we would fix, with no meeting.
        </p>
      </section>
    </LindyPage>
  )
}
