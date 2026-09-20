import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { Check } from "lucide-react"
import { BookingFlow } from "@/components/booking-flow"
import { EngineExplorer, FunnelStory, GrowthSystemFlow, HeroEngine, HeroWebsiteInput, PillarsShowcase } from "@/components/solutions-visuals"

export const metadata: Metadata = {
  title: "Solutions | Terramore",
  description:
    "Growth doesn't happen in one channel. Terramore connects strategy, acquisition, conversion, automation, and intelligence into one system.",
  alternates: { canonical: "https://www.terramore.io/solutions" },
  openGraph: {
    title: "Solutions | Terramore",
    description:
      "One growth system. Every part connected: strategy, acquisition, conversion, automation, and intelligence.",
    url: "https://www.terramore.io/solutions",
  },
}

/* Proof mosaic. Every card is factual: Adam's background and how Terramore
   works. No invented client statistics. */
const PROOF_CARDS = [
  {
    kind: "stat" as const,
    tint: "from-brand/[0.1] to-brand/[0.02]",
    accent: "text-brand",
    stat: "10+ years",
    label: "Reading what people watch and buy, for large advertisers",
  },
  {
    kind: "quote" as const,
    eyebrow: "Market research",
    eyebrowColor: "text-brand",
    body: "At Kantar, the job was reading who people are, what they watch, and what they actually buy, across digital and social platforms, for large brands.",
    source: "Kantar",
  },
  {
    kind: "stat" as const,
    tint: "from-gold-from/[0.14] to-gold-from/[0.03]",
    accent: "text-gold",
    stat: "Fortune 500",
    label: "Advertisers whose TV and streaming campaigns were measured at Samba TV",
  },
  {
    kind: "quote" as const,
    eyebrow: "Built to leave you stronger",
    eyebrowColor: "text-gold",
    body: "Every engagement starts with a written read of the business and ends with a roadmap you keep — whether we stay on or not. Specialists in ads, email, and build join when the scope needs them.",
    source: "How Terramore runs",
  },
  {
    kind: "quote" as const,
    eyebrow: "Your tools, your data",
    eyebrowColor: "text-brand",
    body: "We work inside Shopify, Google, Meta, Mailchimp, Stripe, and Calendly. You keep every login, the data, and the assets.",
    source: "What you keep",
  },
  {
    kind: "report" as const,
  },
] as const

const REPORT_SECTIONS = [
  { title: "Search & AI visibility", detail: "How you show up in Google and in AI answers" },
  { title: "Website & conversion read", detail: "What buyers see, and where they stall" },
  { title: "Follow-up gaps", detail: "Where leads go quiet after they reach out" },
  { title: "Priority fixes", detail: "What we would change first, in writing" },
] as const

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* HERO — copy + website input left, growth engine right */}
      <section className="page-shell pb-14 pt-8 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Revenue Growth System</p>
            <h1 className="mt-4 max-w-2xl text-[2.35rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.4rem]">
              Growth doesn&apos;t happen <span className="text-gold">in one channel.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
              Your strategy, marketing, follow-up, and data should work as one system. Terramore connects them.
            </p>
            <div className="mt-8">
              <HeroWebsiteInput />
            </div>
          </div>
          {/* Decorative clock ring is desktop-only. */}
          <div className="hidden lg:block">
            <HeroEngine />
          </div>
        </div>
      </section>

      {/* GROWTH SYSTEM VISUAL */}
      <section className="page-shell pb-14 md:pb-20" aria-label="The Terramore growth system">
        <GrowthSystemFlow />
      </section>

      {/* OLD WAY VS CONNECTED WAY */}
      <section className="page-shell pb-14 md:pb-20">
        <p className="section-eyebrow text-center">Two ways to run marketing</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          Marketing shouldn&apos;t live in separate boxes.
        </h2>
        <div className="mt-8">
          <FunnelStory />
        </div>
      </section>

      {/* THREE CONNECTED PILLARS */}
      <section className="page-shell pb-14 md:pb-20">
        <p className="section-eyebrow text-center">Why it works</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          Built on <span className="text-gold">three connected pillars.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[16px] leading-relaxed text-slate-600">
          Every engagement combines hands-on execution, an automation platform, and intelligence that informs better decisions.
        </p>
        <div className="mt-10">
          <PillarsShowcase />
        </div>
      </section>

      {/* PROOF MOSAIC — mixed cards, all factual. */}
      <section className="page-shell pb-14 md:pb-20">
        <p className="section-eyebrow text-center">Proof, not promises</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          The experience behind <span className="text-gold">the system.</span>
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROOF_CARDS.map((card, index) => {
            if (card.kind === "stat") {
              return (
                <div
                  key={index}
                  className={`rounded-[1.5rem] border border-black/[0.06] bg-gradient-to-br ${card.tint} bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)]`}
                >
                  <p className={`text-[2.1rem] font-bold tracking-tight ${card.accent}`}>{card.stat}</p>
                  <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink/60">{card.label}</p>
                </div>
              )
            }
            if (card.kind === "quote") {
              return (
                <div
                  key={index}
                  className="rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)]"
                >
                  <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${card.eyebrowColor}`}>{card.eyebrow}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{card.body}</p>
                  <p className="mt-4 text-[13px] font-medium text-slate-500">{card.source}</p>
                </div>
              )
            }
            return (
              <div
                key={index}
                className="flex flex-col justify-between rounded-[1.5rem] border border-black/[0.06] bg-gradient-to-br from-ink to-[#1c3350] p-6 shadow-[0_8px_30px_rgba(15,30,46,0.12)]"
              >
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">The deliverable</p>
                  <p className="mt-3 text-[17px] font-semibold leading-snug text-white">
                    Every engagement starts with a written read of your business.
                  </p>
                </div>
                <p className="mt-5 text-[14px] font-medium text-white/80">
                  Free Digital Footprint report — in your inbox in minutes.
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* FEATURED NARRATIVE — search has changed. */}
      <section className="page-shell pb-14 md:pb-20">
        <div className="rounded-[1.75rem] border border-black/[0.06] bg-gradient-to-b from-brand/[0.05] to-transparent px-6 py-10 md:px-10 md:py-14">
          <h2 className="mx-auto max-w-2xl text-center text-[1.8rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.5rem]">
            Search has changed. Buyers check everywhere before they call.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[16px] leading-relaxed text-slate-600">
            People now ask Google, maps, reviews, and AI assistants about your business before they ever reach your
            website. Most owners have no idea what those answers say. The Digital Footprint report reads it all, in
            writing, before you spend anything.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.06)] md:grid-cols-2 md:p-9">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">Featured: the Digital Footprint report</p>
              <h3 className="mt-3 text-[1.4rem] font-bold leading-[1.15] tracking-[-0.01em] text-ink">
                See your business the way buyers see it.
              </h3>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-slate-600">
                <li className="flex gap-2.5">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  How you show up in search, maps, reviews, and AI answers
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  Where leads leak between your marketing, website, and follow-up
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  What we would fix first, and why, in plain language
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/report"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
                >
                  Get my free report
                </Link>
              </div>
            </div>
            <div className="grid content-center gap-4 border-t border-dashed border-black/[0.1] pt-6 md:border-l md:border-t-0 md:pl-9 md:pt-0">
              {REPORT_SECTIONS.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{item.title}</p>
                    <p className="text-[13px] leading-relaxed text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENGINE EXPLORER — interactive funnel with the work inside each stage. */}
      <section className="page-shell pb-14 md:pb-20">
        <EngineExplorer />
      </section>

      {/* BOOK DIRECT — calendar first, no qualifier steps. Same booking system
          (/api/booking + meeting_booked tracking) as /book. */}
      <section className="page-shell pb-16 md:pb-24">
        <p className="section-eyebrow text-center">Pick a time</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          Grab 30 minutes <span className="text-gold">this week.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[16px] leading-relaxed text-slate-600">
          Free call. Bring the growth problem; we&apos;ll say what we would do first.
        </p>
        <div className="mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9">
          <BookingFlow source="solutions" startAtSchedule />
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
