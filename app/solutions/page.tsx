import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Solutions | Terramore",
  description:
    "Growth problems do not sit alone. Terramore connects strategy, marketing, automation, and data to the problem that is stuck.",
  alternates: { canonical: "https://www.terramore.io/solutions" },
  openGraph: {
    title: "Solutions | Terramore",
    description:
      "More leads, better conversion, less manual work, and a clear view of what is working.",
    url: "https://www.terramore.io/solutions",
  },
}

const PROBLEMS = [
  {
    title: "I need more qualified leads.",
    points: ["Paid ads", "Lead pages", "Qualification", "Routing"],
    href: "/solutions/marketing-and-sales",
  },
  {
    title: "My marketing is not converting.",
    points: ["Positioning", "Offer", "Site", "Funnel"],
    href: "/solutions/marketing-and-sales/digital-marketing",
  },
  {
    title: "We waste time on manual work.",
    points: ["CRM", "Email and SMS", "Lead routing", "AI workflows"],
    href: "/solutions/operations",
  },
  {
    title: "I do not know what is working.",
    points: ["Analytics", "Attribution", "Dashboards", "Terra IQ"],
    href: "/integrations/analytics",
  },
  {
    title: "We are growing, but the systems are not.",
    points: ["Growth plan", "CRM", "Automation", "Reporting"],
    href: "/solutions/business-transformation",
  },
] as const

const SYSTEM = ["Strategy", "Marketing", "Automation", "Data"] as const

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-shell pb-10 pt-8 md:pb-14 md:pt-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Solutions</p>
        <h1 className="mt-3 max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.2rem]">
          Growth problems do not sit alone.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
          Terramore connects strategy, marketing, technology, and automation around the problem that is keeping the business from growing.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover"
        >
          Let&apos;s talk
        </Link>
      </section>

      <section className="page-shell pb-12 md:pb-16">
        <h2 className="text-[1.4rem] font-semibold tracking-tight text-ink md:text-[1.7rem]">Start with the problem</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {PROBLEMS.map((problem) => (
            <article key={problem.title} className="rounded-[1.25rem] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
              <h3 className="text-[18px] font-semibold leading-snug text-ink">{problem.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {problem.points.map((point) => (
                  <li key={point} className="rounded-full bg-cream px-3 py-1 text-[13px] font-medium text-slate-600">
                    {point}
                  </li>
                ))}
              </ul>
              <Link href={problem.href} className="mt-4 inline-flex text-[14px] font-medium text-brand hover:text-brand-hover">
                Learn more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell pb-12 md:pb-16">
        <h2 className="text-[1.4rem] font-semibold tracking-tight text-ink md:text-[1.7rem]">They work together</h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
          These are not separate jobs. Strategy, marketing, automation, and data sit in one path so a visit can become a sale.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SYSTEM.map((item) => (
            <div key={item} className="rounded-[1.25rem] bg-white px-4 py-6 text-center shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
              <p className="text-[18px] font-semibold text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell pb-16 text-center md:pb-24">
        <h2 className="text-[1.6rem] font-bold tracking-tight text-ink md:text-[2rem]">Tell us what is stuck.</h2>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/book"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover"
          >
            Let&apos;s talk
          </Link>
          <Link href="/report" className="text-[15px] font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline">
            Or get a free Digital Footprint report
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
