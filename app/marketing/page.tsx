import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { BookingLink } from "@/components/booking-popup"
import { GrowthJourney } from "@/components/marketing/growth-journey"
import { SystemLeaks } from "@/components/marketing/system-leaks"
import { SystemMap } from "@/components/marketing/system-map"
import { AttractVisual, ConvertVisual, FollowUpVisual, MeasureVisual } from "@/components/marketing/stage-visuals"
import { NextMoveLoop } from "@/components/marketing/next-move-loop"
import { MarketingPrimaryAction, MarketingSecondaryAction } from "@/components/marketing/primary-action"
import { SiteFooter } from "@/components/site-footer"
import { STAGES, type StageId } from "@/lib/marketing-system"

const TITLE = "Marketing, built as one growth system | Terramore"
const DESCRIPTION =
  "Terramore builds and runs the whole path from ad to customer: campaigns, landing pages, instant follow-up, and TerraIQ reporting that shows which marketing turns into revenue."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.terramore.io/marketing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.terramore.io/marketing",
    siteName: "Terramore.io",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/share/terramore-share-v2-og.png",
        width: 1200,
        height: 630,
        alt: "Terramore",
      },
    ],
  },
}

const SECONDARY =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-ink/60 bg-white px-6 text-[16px] font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"

const stage = (id: StageId) => STAGES.find((s) => s.id === id)!

/** Chapter heading for one stage: index, the job as the H2, two sentences, and what we watch. */
function ChapterCopy({ id, split = false, children }: { id: StageId; split?: boolean; children: React.ReactNode }) {
  const s = stage(id)
  return (
    <div className={split ? "lg:grid lg:grid-cols-2 lg:items-end lg:gap-16" : ""}>
      <div>
        <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink/70">
          <span className="tabular-nums text-gold-ink">{s.index}</span>
          <span aria-hidden className="h-px w-8 bg-ink/20" />
          {s.name}
        </p>
        <h2 className="mt-4 max-w-xl text-[1.9rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.4rem]">
          {s.job}
        </h2>
      </div>
      <div>
        <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-slate-700">{children}</p>
        <p className="mt-5 text-[15px] text-slate-600">
          We watch: <span className="font-semibold text-ink">{s.watch}</span>
        </p>
      </div>
    </div>
  )
}

const RELATED_ARTICLES = [
  {
    tag: "Ad creative",
    title: "Why your best-performing ad will stop working (and what to do about it)",
    readTime: "6 min read",
    href: "/articles/why-your-best-ad-stops-working",
    image: "/marketing/articles/article-ad-fatigue.png",
    alt: "A creative team reviewing printed ad concept variations at a desk",
  },
  {
    tag: "Measurement",
    title: "The three numbers every owner should check before raising ad spend",
    readTime: "8 min read",
    href: "/articles/three-numbers-before-raising-ad-spend",
    image: "/marketing/articles/article-metrics.png",
    alt: "A business owner reviewing a marketing analytics dashboard on a laptop",
  },
  {
    tag: "Landing pages",
    title: "Your ads aren't the problem — your landing page is",
    readTime: "5 min read",
    href: "/articles/your-landing-page-is-the-problem",
    image: "/marketing/articles/article-landing.png",
    alt: "A designer's workspace with a landing page design on a monitor",
  },
] as const

const FAQ_ITEMS = [
  {
    q: "What exactly does Terramore do?",
    a: "We build and run the system that turns attention into customers: campaigns on Google, Meta and TikTok, content, landing pages, instant text and email follow-up, CRM and automation, and reporting in TerraIQ that ties revenue back to its source. One team owns the whole path, so nothing falls between vendors.",
  },
  {
    q: "How is this different from hiring an agency?",
    a: "Most agencies own one slice, usually the ads, and stop at the click. We own what happens after it too: the page, the reply, the booking and the measurement. That's where most of the money leaks, and it's where we look first.",
  },
  {
    q: "Do I need a big ad budget?",
    a: "No. We size campaigns to your business. What matters is that the math works: what a customer is worth to you and what it costs to win one. We'll tell you honestly if paid ads aren't the right first move, and often the first fix is follow-up, not spend.",
  },
  {
    q: "Who owns the ad accounts, data and creative?",
    a: "You do. Everything runs in accounts you own: your ad accounts, your domain, your CRM and your creative files. If we ever part ways, everything stays with you.",
  },
  {
    q: "How do you measure results?",
    a: "TerraIQ, our Growth Workspace, ties traffic, inquiries, booked calls and revenue together so you can see what each channel returns, not just clicks and impressions. You also get plain-language notes on what we changed and why.",
  },
  {
    q: "What happens on the 30-minute call?",
    a: "We look at how customers find and contact you today, where they drop, and what we'd build first. No pressure and no obligation; you'll leave with specific observations either way.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on scope: which channels, how much creative and how much automation you need. Pricing is agreed up front. Book a call and we'll scope it with you.",
  },
] as const

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* 1 HERO: the outcome in words, the system in motion (one inquiry traced through it). */}
      <section className="relative" aria-labelledby="marketing-hero-title">
        <div className="page-shell grid gap-10 pb-16 pt-6 sm:pt-10 md:pb-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-10 lg:pt-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-14">
          <div className="max-w-xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gold-ink">
              Marketing, built as one system
            </p>
            <h1
              id="marketing-hero-title"
              className="mt-4 text-[2.5rem] font-bold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3.25rem] lg:text-[2.9rem] xl:text-[clamp(3rem,4.6vw,4rem)]"
            >
              Turn attention into customers.
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-slate-700 md:text-[18px]">
              Most marketing stops at the click. Terramore builds and runs what happens next: the page, the instant
              reply, the booked call, and the numbers that show what paid off.
            </p>
            <div className="mt-8">
              <MarketingPrimaryAction
                ctaId="marketing_hero_report"
                helper="Free · No email needed to see the first results"
              >
                <MarketingSecondaryAction ctaId="marketing_hero_book" />
              </MarketingPrimaryAction>
            </div>
          </div>
          <div className="w-full max-w-[46rem] lg:max-w-none">
            <GrowthJourney />
          </div>
        </div>
      </section>

      {/* 2 THE PROBLEM: the same path, disconnected. */}
      <section className="border-t border-ink/[0.07] py-16 md:py-24" aria-labelledby="leaks-title">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Where growth leaks</p>
            <h2
              id="leaks-title"
              className="mt-3 text-[1.9rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.6rem]"
            >
              Most marketing breaks between the tools.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-slate-700">
              Ads, the website, the phone, the inbox and the reports usually get set up by different people at different
              times. Nobody owns the handoffs, so interested customers slip through.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <SystemLeaks />
          </div>
          <p className="mt-10 text-[18px] font-semibold text-ink md:mt-12 md:text-[20px]">
            More ad spend just pushes more people through the same gaps.
          </p>
        </div>
      </section>

      {/* 3 THE SYSTEM: the connected stack, on the page's one ink band. */}
      <section className="bg-ink py-16 md:py-24" aria-labelledby="system-title">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-from">The Terramore system</p>
            <h2
              id="system-title"
              className="mt-3 text-[1.9rem] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[2.6rem]"
            >
              One connected system, built and run by one team.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/80">
              We build every stage, wire them together so nothing drops between them, and keep running it with you after
              launch.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <SystemMap />
          </div>
        </div>
      </section>

      {/* 4–7 THE STAGES: one chapter each, one visual each, alternating rhythm. */}
      <section id="attract" className="scroll-mt-24 py-16 md:py-24" aria-label="Attract">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <ChapterCopy id="attract">
            We run search, maps, social and short video around the offers that actually make you money, and tag every
            placement so we can tell later which one produced the customer.
          </ChapterCopy>
          <div className="pb-6">
            <AttractVisual />
          </div>
        </div>
      </section>

      <section id="convert" className="scroll-mt-24 border-t border-ink/[0.07] py-16 md:py-24" aria-label="Convert">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <ConvertVisual />
          </div>
          <div className="order-1 lg:order-2">
            <ChapterCopy id="convert">
              Each campaign lands on a page built for it, with one clear next step: book, call or ask. Every call and
              form carries its source into your CRM.
            </ChapterCopy>
          </div>
        </div>
      </section>

      <section id="follow-up" className="scroll-mt-24 bg-white py-16 md:py-24" aria-label="Follow up">
        <div className="page-shell">
          <ChapterCopy id="follow-up" split>
            People who don&apos;t hear back keep shopping. The system replies the moment an inquiry arrives, tells your
            team, and sends reminders so the visit actually happens.
          </ChapterCopy>
          <div className="mt-10 md:mt-14">
            <FollowUpVisual />
          </div>
          <p className="mt-6 text-[13px] text-slate-600">Sample business · example timeline</p>
        </div>
      </section>

      <section id="measure" className="scroll-mt-24 py-16 md:py-24" aria-label="Measure">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <ChapterCopy id="measure">
            TerraIQ, our Growth Workspace, follows each customer from the first click to the booked job, so budget goes
            where it returns, not where the clicks are cheapest.
          </ChapterCopy>
          <MeasureVisual />
        </div>
      </section>

      {/* 8 AFTER LAUNCH: the Next Move story (VD-029), intelligence then action, for the same sample business. */}
      <section className="border-t border-ink/[0.07] py-16 md:py-24" aria-labelledby="loop-title">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="section-eyebrow">After launch</p>
            <h2
              id="loop-title"
              className="mt-3 text-[1.9rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.6rem]"
            >
              Not just a report. The next move, decided and done.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-slate-700">
              TerraIQ reads what Terramore knows about the business, finds the constraint costing the most and
              recommends the smallest useful fix. Terramore builds it, and the result feeds the next decision. Here is
              month one for the sample business above: how it got its booking page.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <NextMoveLoop />
          </div>
        </div>
      </section>

      {/* 9 CTA: two equivalent ways in (VR-36 exception); the report is the filled one. */}
      <section className="pb-16 md:pb-24" aria-labelledby="start-title">
        <div className="page-shell">
          <div className="sm:rounded-[1.75rem] sm:border sm:border-ink/10 sm:bg-white sm:p-10 lg:p-14">
            <div className="max-w-2xl">
              <h2
                id="start-title"
                className="text-[1.9rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.6rem]"
              >
                Find out where your system leaks.
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-slate-700">
                Start free, or talk it through. Either way you get specific observations about your business.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5 sm:bg-cream sm:p-6">
                <h3 className="text-[18px] font-semibold text-ink">Check your business, free</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
                  Enter your website to see what&apos;s in place, what&apos;s missing and where we&apos;d look first.
                  Want it in writing? We&apos;ll email you the full report.
                </p>
                <div className="mt-6 pt-1 sm:mt-auto">
                  <MarketingPrimaryAction ctaId="marketing_closing_report" helper="No email needed to start." />
                </div>
              </div>
              <div className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5 sm:bg-cream sm:p-6">
                <h3 className="text-[18px] font-semibold text-ink">Talk it through</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
                  A 30-minute call on how customers find you today, where they drop, and what we&apos;d build first.
                </p>
                <div className="mt-6 flex flex-col gap-2 pt-1 sm:mt-auto sm:items-start">
                  <BookingLink source="marketing" ctaId="marketing_closing_book" className={SECONDARY}>
                    Book a 30-minute call
                  </BookingLink>
                  <p className="text-[14px] text-slate-600">Pick a time that suits you.</p>
                </div>
              </div>
            </div>
            <p className="mt-8 text-[15px] text-slate-600">
              Everything we build runs in accounts you own: ad accounts, domain, CRM and creative.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-shell pb-16 md:pb-24" id="faq" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-title" className="text-[1.6rem] font-bold tracking-[-0.02em] text-ink md:text-[2rem]">
            Questions, answered
          </h2>
          <div className="mt-8 divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md text-[16px] font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-cream [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-[16px] font-medium text-ink/70 motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-700">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      <section className="page-shell pb-16 md:pb-24" aria-labelledby="articles-title">
        <h2 id="articles-title" className="text-[1.6rem] font-bold tracking-[-0.02em] text-ink md:text-[2rem]">
          From the notebook
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {RELATED_ARTICLES.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <div className="relative hidden aspect-[16/9] overflow-hidden md:block">
                <Image
                  src={article.image}
                  alt={article.alt}
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                  sizes="33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/70">{article.tag}</p>
                <h3 className="mt-2 text-[16px] font-semibold leading-snug tracking-tight text-ink group-hover:underline group-hover:underline-offset-4">
                  {article.title}
                </h3>
                <p className="mt-auto pt-4 text-[13px] font-medium text-slate-600">{article.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter showDualCtas={false} />
    </div>
  )
}
