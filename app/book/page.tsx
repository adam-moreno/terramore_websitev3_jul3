import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ConnectedChain, HeroSystemDeck, Reveal, StagedShowcase, TerraIQTile } from "@/components/book-visuals"
import { BookingLink } from "@/components/booking-popup"
import { ReportPopupLink } from "@/components/report-popup"
import { BookingFlow } from "@/components/booking-flow"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Book a call | Terramore",
  description:
    "A 30-minute working session to look at your business, your current marketing system, and where we see the biggest opportunities to grow.",
  alternates: { canonical: "https://www.terramore.io/book" },
  openGraph: {
    title: "Book a call | Terramore",
    description: "A short call to find what is holding growth back, and what we would change first.",
    url: "https://www.terramore.io/book",
  },
}

/* Real, verifiable credibility only — no fabricated counts or results. */
const TRUST_FACTS = [
  { value: "10+ years", label: "In marketing, data, and measurement — including work behind Fortune 500 advertisers" },
  { value: "$0", label: "Your growth roadmap is built before you sign anything, and it's yours to keep" },
  { value: "Founder-led", label: "You talk to the person responsible for the work, not a sales team" },
] as const

/* Compact capability rows — editorial rhythm, not a service grid. */
const CAPABILITIES = [
  {
    id: "strategy",
    label: "Strategy",
    body: "Growth strategy, positioning, and channel planning built around the business you already have.",
    href: "/solutions",
  },
  {
    id: "acquisition",
    label: "Acquisition",
    body: "Paid advertising, content, search, and creative that put you in front of the right people.",
    href: "/marketing",
  },
  {
    id: "conversion",
    label: "Conversion",
    body: "Websites, landing pages, lead capture, and booking flows that turn attention into opportunities.",
    href: "/solutions",
  },
  {
    id: "automation",
    label: "Automation",
    body: "CRM, email, SMS, lead routing, and workflows that keep the system moving without you.",
    href: "/solutions",
  },
  {
    id: "intelligence",
    label: "Intelligence",
    body: "Analytics, attribution, and reporting through Terra IQ — so you can see what pays.",
    href: "/solutions",
  },
] as const

/* Opens the booking popup (qualifying questionnaire + calendar) in place —
   CTAs never jump the visitor around the page. */
function BookCta({ className = "" }: { className?: string }) {
  return (
    <BookingLink
      source="book"
      className={`inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-7 text-[16px] font-medium text-white transition hover:bg-brand-hover sm:w-auto ${className}`}
    >
      Book a 30-minute conversation
    </BookingLink>
  )
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* HERO — centered editorial headline over the animated system deck.
          One gradient band wraps the headline AND the deck so the carousel
          reads as part of the hero rather than a separate strip. */}
      <section className="relative overflow-hidden pb-14 pt-10 md:pb-20 md:pt-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-cream via-brand/[0.05] to-cream"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/3 h-2/3 bg-[radial-gradient(60%_80%_at_50%_60%,var(--gold-from)_0%,transparent_70%)] opacity-25"
        />
        <div className="page-shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Let&apos;s talk</p>
          <h1 className="mt-4 text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.2rem]">
            Let&apos;s figure out what&apos;s actually holding <span className="text-gold">your growth back.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
            A 30-minute working session to look at your business, your current marketing system, and where we see the
            biggest opportunities to grow.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <BookCta />
            <ReportPopupLink
              direct
              className="text-center text-[15px] font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline"
            >
              See your digital footprint
            </ReportPopupLink>
          </div>
        </div>

        {/* The deck: the same methodology we'd instill in your business. */}
        <div className="mx-auto mt-12 max-w-5xl md:mt-16">
          <HeroSystemDeck />
          <p className="mt-5 text-center text-[14px] text-slate-500">
            This is the system we&apos;d build around your business — walk through it live on the call.
          </p>
        </div>
        </div>
      </section>

      {/* TRUST TILES — mixed tile band with the free report callout */}
      <section className="page-shell py-12 md:py-16">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/40">
          Built for business owners who are ready to grow
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-3">
          {/* Large tile: free Digital Footprint report */}
          <Reveal className="lg:col-span-2">
            <div className="grid h-full items-center gap-6 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-ink to-[#1c3350] p-7 sm:grid-cols-[1.2fr_0.8fr] md:p-9">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-from">Free — before we even talk</p>
                <h2 className="mt-2 text-[1.35rem] font-bold leading-[1.15] tracking-[-0.01em] text-white md:text-[1.6rem]">
                  See how your business shows up online.
                </h2>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/70">
                  Search, maps, reviews, and social — your digital footprint in one report, on us.
                </p>
                <ReportPopupLink
                  direct
                  className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-white/90"
                >
                  Get your free digital report →
                </ReportPopupLink>
              </div>
              <div className="mx-auto w-36 rotate-3 overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:w-44">
                <Image
                  src="/report/pdf-cover.png"
                  alt="The cover of a Terramore Digital Footprint report"
                  width={640}
                  height={828}
                  sizes="11rem"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Stacked credential tiles — real facts only */}
          <div className="grid gap-4">
            {TRUST_FACTS.map((fact, i) => (
              <Reveal key={fact.value} delay={120 + i * 100}>
                <div className="h-full rounded-[1.5rem] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.05)]">
                  <p className="text-[1.4rem] font-bold tracking-[-0.02em] text-ink">{fact.value}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{fact.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME CHAPTER — large centered editorial heading */}
      <section className="page-shell pb-14 md:pb-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.6rem]">
            Build a growth system around <span className="text-gold">the business you&apos;ve already built.</span>
          </h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-slate-600 md:text-[17.5px]">
            Growth gets harder when every channel, campaign, and follow-up lives in a separate box. Terramore connects
            the pieces into one system built around how your business actually grows.
          </p>
        </Reveal>
      </section>

      {/* STAGED SHOWCASE — sticky stage rail + sliding persona left, scrolling tiles right.
          Subtle white band separates it from the cream page. */}
      <section className="bg-gradient-to-b from-white via-white to-transparent py-16 md:py-20">
        <div className="page-shell">
          <StagedShowcase />
        </div>
      </section>

      {/* TERRA IQ — dark product-artifact tile (Chargebee invoice-card pattern) */}
      <section className="page-shell pb-16 md:pb-24">
        <TerraIQTile />
      </section>

      {/* THE PIECES WORK BETTER TOGETHER — simple editorial chain */}
      <section id="revenue" className="page-shell scroll-mt-24 pb-16 md:pb-24">
        <div className="rounded-[2rem] bg-white px-6 py-12 shadow-[0_16px_50px_rgba(15,30,46,0.06)] md:px-12 md:py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.2rem]">
              Marketing shouldn&apos;t live in separate boxes.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
              Your ads should connect to your website. Your website should connect to your CRM. Your CRM should connect
              to follow-up. And your reporting should connect everything back to revenue.
            </p>
          </Reveal>
          <div className="mt-10">
            <ConnectedChain />
          </div>
        </div>
      </section>

      {/* WHAT WE ACTUALLY WORK ON — compact capability rows */}
      <section className="page-shell pb-16 md:pb-24">
        <Reveal>
          <p className="section-eyebrow">What we actually work on</p>
          <h2 className="mt-3 max-w-2xl text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.2rem]">
            Every part of the system, one team.
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.id} delay={i * 80}>
              <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-8">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink">{cap.label}</p>
                <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">{cap.body}</p>
                <Link
                  href={cap.href}
                  className="text-[13px] font-semibold text-brand underline-offset-4 hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOUNDER — value-add CTA panel: talk to the founder, leave with a roadmap */}
      <section className="page-shell pb-16 md:pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand/[0.07] via-white to-gold-from/[0.14] shadow-[0_16px_50px_rgba(15,30,46,0.07)] ring-1 ring-black/[0.04]">
          <div className="grid items-center gap-8 p-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 md:p-10">
            <Reveal>
              <div className="relative mx-auto max-w-xs overflow-hidden rounded-[1.75rem] shadow-[0_16px_50px_rgba(15,30,46,0.15)]">
                <Image
                  src="/founder/adam-moreno-headshot.png"
                  alt="Adam Moreno, founder of Terramore"
                  width={800}
                  height={960}
                  sizes="(max-width: 1024px) 80vw, 32vw"
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">Who you&apos;ll talk to</p>
              <h2 className="mt-3 text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.2rem]">
                You won&apos;t get handed off to a sales team.
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-slate-600 md:text-[17px]">
                You&apos;ll talk directly with Terramore about your business, where you&apos;re trying to go, and what
                needs to change to get there. Terramore is built on more than a decade of marketing measurement work
                behind large advertisers at Kantar and Samba TV.
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
                And whatever happens, you leave with a growth roadmap for your business —{" "}
                <span className="font-semibold text-ink">built before you sign anything, yours to keep.</span>
              </p>
              <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <BookCta />
                <div>
                  <p className="text-[15px] font-semibold text-ink">Adam Moreno</p>
                  <p className="text-[13px] text-slate-500">Founder, Terramore</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BOOKING — the primary conversion section */}
      <section id="calendar" className="page-shell scroll-mt-20 pb-16 md:pb-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Pick a time</p>
          <h2 className="mt-3 text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.4rem]">
            Let&apos;s talk about your business.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
            Bring us the business you&apos;re trying to grow. We&apos;ll bring the questions, the analysis, and a clear
            conversation about what we&apos;d do next. Free 30 minutes — times show in your time zone.
          </p>
        </Reveal>
        <div className="mt-10 rounded-[1.75rem] bg-white p-5 shadow-[0_16px_50px_rgba(15,30,46,0.08)] md:p-9">
          <BookingFlow source="book" />
        </div>
      </section>

      {/* FINAL CTA — Chargebee-style glow band in Terramore colors, flowing into the footer */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-cream via-brand/[0.06] to-gold-from/40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(70%_100%_at_50%_100%,var(--gold-from)_0%,transparent_70%)] opacity-50"
        />
        <div className="page-shell relative py-20 md:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.5rem]">
              Ready to build a stronger <span className="text-gold">growth system?</span>
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-slate-700">
              Let&apos;s talk about where your business is today and where you want to take it.
            </p>
            <div className="mt-8 flex justify-center">
              <BookingLink
                source="book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-9 text-[16px] font-semibold text-white shadow-[0_16px_40px_rgba(15,30,46,0.3)] transition hover:bg-ink/90"
              >
                Let&apos;s talk →
              </BookingLink>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
