import type { Metadata } from "next"
import Link from "next/link"
import { LindyPage } from "@/components/lindy-page"
import { ReportPopupLink } from "@/components/report-popup"

export const metadata: Metadata = {
  title: "Pricing | Terramore",
  description:
    "The first call is free. A deposit starts the 90-day plan. A monthly fee keeps the team in your tools. No fee until you see what is broken.",
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
    href: "/partner",
    cta: "Book the call",
    featured: false,
  },
  {
    name: "Start",
    price: "Deposit",
    note: "The first 90 days",
    points: [
      "We show you the step where you lose sales before we charge to fix it",
      "The first fix is scoped with a date",
      "You get a 90-day plan with owners and dates",
      "Invoiced after we agree on the scope",
    ],
    href: "/partner",
    cta: "Start with a call",
    featured: true,
  },
  {
    name: "Stay",
    price: "Monthly",
    note: "After the first 90 days",
    points: [
      "We keep working inside your ads, site, and email",
      "You get an invite to the client dashboard",
      "Same people, not a new tool",
    ],
    href: "/partner",
    cta: "Ask about monthly",
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <LindyPage
      title="Talk first."
      accent="Pay when we start."
      subtitle="The call is free. The deposit and the monthly fee depend on how many channels we run, and we quote both on the call. You never pay to find out what is broken."
      ctaHref="/partner"
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
              <Link
                href={plan.href}
                className={`mt-6 rounded-full px-4 py-2.5 text-center text-sm font-semibold ${
                  plan.featured
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
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
