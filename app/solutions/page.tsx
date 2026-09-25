import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { Check } from "lucide-react"
import { BookingFlow } from "@/components/booking-flow"
import { CapabilityGrid, FunnelStory, GrowthSystemFlow, HeroEngine, HeroWebsiteInput } from "@/components/solutions-visuals"

export const metadata: Metadata = {
  title: "Solutions | Terramore",
  description:
    "Terramore helps growing businesses find customers, convert more of them, and automate the follow-up across advertising, content, websites, CRM, email, SMS, automation, and analytics.",
  alternates: { canonical: "https://www.terramore.io/solutions" },
  openGraph: {
    title: "Solutions | Terramore",
    description:
      "Marketing that connects all the way to revenue. Strategy, ads, websites, CRM, automation, and analytics in one system.",
    url: "https://www.terramore.io/solutions",
  },
}

/* Proof. Every card is factual: Adam's background and how Terramore works.
   No invented client statistics. */
const PROOF_STATS = [
  {
    tint: "from-brand/[0.1] to-brand/[0.02]",
    accent: "text-brand",
    stat: "10+ years",
    label: "Reading what people watch and buy, for large advertisers",
  },
  {
    tint: "from-gold-from/[0.14] to-gold-from/[0.03]",
    accent: "text-gold",
    stat: "Fortune 500",
    label: "Advertisers whose TV and streaming campaigns were measured at Samba TV",
  },
] as const

const PROOF_NOTES = [
  {
    eyebrow: "Market research",
    eyebrowColor: "text-brand",
    body: "At Kantar, that meant brand reports across every social channel for large advertisers — who saw the work and whether it moved them. At Samba TV, TV and streaming ads tied to who watched and what they bought.",
    source: "Kantar + Samba TV",
  },
  {
    eyebrow: "Built to leave you stronger",
    eyebrowColor: "text-gold",
    body: "Every engagement starts with a written read of the business and ends with a roadmap you keep — whether we stay on or not. Specialists in ads, email, and build join when the scope needs them.",
    source: "How Terramore runs",
  },
  {
    eyebrow: "Your tools, your data",
    eyebrowColor: "text-brand",
    body: "We work inside Shopify, Google, Meta, Mailchimp, Stripe, and Calendly. You keep every login, the data, and the assets.",
    source: "What you keep",
  },
] as const

const CAPABILITY_SIGNAL = [
  "Strategy",
  "Google & Meta Ads",
  "Content",
  "Websites",
  "CRM",
  "Email & SMS",
  "Automation",
  "Analytics",
] as const

const RECOGNIZABLE_PROBLEMS = [
  "You're getting traffic, but not enough leads.",
  "You're getting leads, but follow-up is inconsistent.",
  "You're running ads, but can't connect spend to customers.",
  "You grew on referrals and now need predictable acquisition.",
  "People are doing marketing, but nobody owns the whole system.",
] as const

/* Mirrors the report's scored categories (lib/report/score). */
const REPORT_SIGNALS = [
  "Discoverability",
  "Digital experience",
  "Trust & credibility",
  "Conversion readiness",
  "Technical health",
] as const

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* HERO — headline, copy, website input left; growth engine right (desktop only) */}
      <section className="page-shell pb-14 pt-8 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Revenue Growth System</p>
            <h1 className="mt-4 max-w-2xl text-[2.15rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.15rem]">
              Marketing that connects all the way to <span className="text-gold">revenue.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
              Terramore helps growing businesses find customers, convert more of them, and automate the follow-up —
              across advertising, content, websites, CRM, email, SMS, automation, and analytics.
            </p>
            <div className="mt-8">
              <HeroWebsiteInput />
            </div>
            <ul aria-label="What Terramore connects" className="mt-6 flex max-w-xl flex-wrap gap-x-2 gap-y-1.5 text-[12.5px] font-medium leading-snug text-ink/50">
              {CAPABILITY_SIGNAL.map((item, index) => (
                <li key={item} className="inline-flex items-center">
                  {item}
                  {index < CAPABILITY_SIGNAL.length - 1 ? (
                    <span aria-hidden className="ml-2 text-ink/25">
                      ·
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
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

      {/* CAPABILITIES — all five groups visible at once. */}
      <section className="page-shell pb-10 md:pb-14">
        <CapabilityGrid />
      </section>

      {/* THIS IS PROBABLY YOU — recognition moment, one compact card. */}
      <section className="page-shell pb-14 md:pb-20">
        <div className="grid gap-6 rounded-[1.75rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-10 md:p-10">
          <h2 className="text-[1.5rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2rem]">
            You probably don&apos;t need more marketing.{" "}
            <span className="text-gold">You need the pieces to work together.</span>
          </h2>
          <ul className="space-y-3">
            {RECOGNIZABLE_PROBLEMS.map((problem) => (
              <li key={problem} className="flex gap-3 text-[15px] leading-snug text-ink/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-from/15 text-[color:var(--gold-to)]">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROOF — two factual stats, then three short notes. */}
      <section className="page-shell pb-14 md:pb-20">
        <p className="section-eyebrow text-center">Proof, not promises</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          The experience behind <span className="text-gold">the system.</span>
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:gap-4">
          {PROOF_STATS.map((card) => (
            <div
              key={card.stat}
              className={`rounded-[1.5rem] border border-black/[0.06] bg-gradient-to-br ${card.tint} bg-white p-4 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-6`}
            >
              <p className={`whitespace-nowrap text-[1.3rem] font-bold tracking-tight md:text-[2.1rem] ${card.accent}`}>{card.stat}</p>
              <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink/60 md:text-[14px]">{card.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-3 md:gap-4">
          {PROOF_NOTES.map((card) => (
            <div
              key={card.eyebrow}
              className="rounded-[1.5rem] border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-6"
            >
              <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${card.eyebrowColor}`}>{card.eyebrow}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{card.body}</p>
              <p className="mt-4 text-[13px] font-medium text-slate-500">{card.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIGITAL FOOTPRINT — the diagnostic entry point, kept short. */}
      <section className="page-shell pb-14 md:pb-20">
        <div className="rounded-[1.75rem] border border-black/[0.06] bg-gradient-to-b from-brand/[0.05] to-transparent px-6 py-10 text-center md:px-10 md:py-14">
          <p className="section-eyebrow">Start with a diagnostic</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-[1.8rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.5rem]">
            See the gaps in how buyers find you.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            The free Digital Footprint report reads your business the way buyers do: whether they can find you, what
            they see when they land, whether they trust it, and where they drop off, plus what to fix first.
          </p>
          <ul aria-label="What the report reads" className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
            {REPORT_SIGNALS.map((signal) => (
              <li
                key={signal}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-ink/75 ring-1 ring-ink/[0.06]"
              >
                <Check className="h-3 w-3 text-brand" strokeWidth={3} aria-hidden />
                {signal}
              </li>
            ))}
          </ul>
          <Link
            href="/report"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
          >
            Get my free report
          </Link>
        </div>
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
