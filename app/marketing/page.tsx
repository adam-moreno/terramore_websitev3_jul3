import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {
  CollaborationSteps,
  CreativeCtaCard,
  CreativeTilesGrid,
  ServiceCarousel,
  StatsCountUp,
} from "@/components/marketing-visuals"
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

function TalkButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/book"
      className={`inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover sm:w-auto ${className}`}
    >
      Book a demo
    </Link>
  )
}

const RELATED_ARTICLES = [
  {
    tag: "Ad creative",
    title: "Why your best-performing ad will stop working (and what to do about it)",
    excerpt: "Creative fatigue is measurable. Here's how to spot the drop-off early and refresh before your cost per lead climbs.",
    readTime: "6 min read",
    href: "/articles/why-your-best-ad-stops-working",
    image: "/marketing/articles/article-ad-fatigue.png",
    alt: "A creative team reviewing printed ad concept variations at a desk",
  },
  {
    tag: "Measurement",
    title: "The three numbers every owner should check before raising ad spend",
    excerpt: "More budget only helps if the system behind it converts. These are the numbers that tell you whether you're ready.",
    readTime: "8 min read",
    href: "/articles/three-numbers-before-raising-ad-spend",
    image: "/marketing/articles/article-metrics.png",
    alt: "A business owner reviewing a marketing analytics dashboard on a laptop",
  },
  {
    tag: "Landing pages",
    title: "Your ads aren't the problem — your landing page is",
    excerpt: "When clicks are cheap but sales are flat, the leak is usually after the click. A practical teardown checklist.",
    readTime: "5 min read",
    href: "/articles/your-landing-page-is-the-problem",
    image: "/marketing/articles/article-landing.png",
    alt: "A designer's workspace with a landing page design on a monitor",
  },
] as const

const FAQ_ITEMS = [
  {
    q: "What exactly does Terramore do?",
    a: "We run the full growth system for your business: marketing strategy, ad creative, paid campaigns on Google, Meta, and TikTok, landing pages, email and SMS follow-up, short-form content, automation, and analytics. One team, one connected system — instead of juggling separate freelancers and agencies.",
  },
  {
    q: "How is this different from hiring an agency or a freelancer?",
    a: "Most agencies own one slice — ads, or creative, or a website — and hand you the rest. We own the whole path from strategy to measurement, so nothing falls between vendors. And unlike a freelancer, you get a system with process, tooling, and reporting behind it, not a single person's availability.",
  },
  {
    q: "What does a demo look like?",
    a: "It's a 30-minute call. We look at your current marketing together, show you how the Terramore system would map onto your business, and walk through Terra IQ — the dashboard where you'd see visits, leads, and revenue in one place. No pressure and no obligation; you'll leave with useful observations either way.",
  },
  {
    q: "How fast can we launch?",
    a: "Strategy and setup typically take the first week. Most clients have their first campaign live within about 7 days of kickoff, with landing pages and follow-up automation in place shortly after.",
  },
  {
    q: "Do I need a big ad budget to work with you?",
    a: "No. We size campaigns to your business. What matters is that the math works: what a customer is worth to you, what it costs to acquire one, and how quickly we can close that gap. We'll tell you honestly if paid ads aren't the right first move.",
  },
  {
    q: "Who owns the ad accounts, data, and creative?",
    a: "You do — 100%. Everything runs in accounts you own: your ad accounts, your domain, your CRM, your creative files. If we ever part ways, everything stays with you.",
  },
  {
    q: "How do you measure results?",
    a: "Terra IQ ties your traffic, leads, and revenue together so you can see what each channel returns — not just clicks and impressions. You get a live dashboard plus plain-language reporting on what we changed and why.",
  },
  {
    q: "Do you replace my existing marketing team?",
    a: "Usually we extend it. If you have someone in-house, we plug in around them — they keep the parts they're great at, and we cover strategy, production, and measurement. If you have no one, we can be the whole engine.",
  },
  {
    q: "What industries do you work with?",
    a: "Mostly established local and regional businesses: services, trades, clinics, restaurants, e-commerce, and professional practices. If you already have customers and want more of them, the system applies.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No long lock-ins. Engagements are month to month after the initial setup period. We keep clients by performing, not by contract.",
  },
  {
    q: "What do you need from me to get started?",
    a: "Access to what already exists (website, ad accounts, CRM), about an hour for the kickoff conversation, and fast feedback during the first creative round. We handle the rest.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on scope — which channels, how much creative, and how much automation you need. Pricing is flat and agreed up front; see the pricing page or book a demo and we'll scope it live with you.",
  },
] as const

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* HERO — cinematic image-led composition, copy over the calm left side */}
      <section className="relative overflow-hidden">
        <Image
          src="/marketing/hero-cinematic.png"
          alt="A campaign being produced at a creative studio desk — ad concepts, color swatches, and a vertical video edit in progress"
          width={1600}
          height={900}
          priority
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          sizes="100vw"
        />
        {/* Restrained scrim: heavier over the text side only. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent md:from-ink/70 md:via-ink/25" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
        <div className="page-shell relative flex min-h-[34rem] items-center py-20 md:min-h-[40rem] md:py-28">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gold-from">
              Marketing &amp; advertising for growing businesses
            </p>
            <h1 className="mt-4 text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-[3.4rem]">
              On-brand, on-time marketing designed to perform.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80 md:text-[18px]">
              Whether it&apos;s Google, Meta, TikTok, email, or your website, get the campaigns you need fast — planned,
              built, launched, and measured by one connected system.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <TalkButton />
              <Link
                href="/report"
                className="text-center text-[15px] font-medium text-white/70 underline-offset-4 hover:text-white hover:underline sm:text-left"
              >
                Or get a free Digital Footprint report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CAROUSEL — infinite marquee, right under the hero. Full-bleed. */}
      <section className="overflow-hidden pb-14 md:pb-20" aria-label="What Terramore builds">
        <ServiceCarousel />
      </section>

      {/* AD FATIGUE — copy left, lifestyle photo right */}
      <section className="page-shell pb-14 md:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="border-b border-ink/15 pb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/60">
              Fresh campaigns fuel performance
            </p>
            <h2 className="mt-6 max-w-xl text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.6rem]">
              <span className="font-serif italic">Tired of ad fatigue?</span> It&apos;s time to refresh your marketing.
            </h2>
            <p className="mt-5 max-w-lg text-[18px] font-medium leading-relaxed text-ink/80 md:text-[20px]">
              Ads lose effectiveness quickly. If it&apos;s not your audience getting bored, it&apos;s the algorithm.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
              You know it has a direct impact on your revenue, but tight deadlines, limited resources, and gaps in the
              system make it hard to keep up with the demand for compelling campaigns. That&apos;s what Terramore is
              for.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(15,30,46,0.35)]">
            <Image
              src="/marketing/fatigue-couch.png"
              alt="A relaxed business owner scrolling on his phone at home"
              width={1024}
              height={1024}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA TILE */}
      <section className="page-shell pb-14 md:pb-20">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-ink to-[#1c3350] px-7 py-10 text-center shadow-[0_20px_60px_rgba(15,30,46,0.2)] sm:px-12 md:py-14">
          {/* Soft brand glow accents */}
          <span aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gold-from/20 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-[2.1rem]">
              Never let a campaign go stale again.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-[16px]">
              See how Terramore keeps creative, campaigns, and follow-up fresh — live, on your own numbers.
            </p>
            <Link
              href="/book"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-ink transition hover:bg-white/90"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* THE DATA IS CLEAR — count-up stats */}
      <section className="page-shell pb-14 md:pb-20">
        <p className="section-eyebrow text-center">The data is clear</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          Terramore is <span className="font-serif italic text-gold">your shortcut</span> to revenue.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[16px] leading-relaxed text-slate-600">
          As an extension of your team, we run every stage of the growth system — strategy through revenue — and
          measure what it returns.
        </p>
        <div className="mx-auto mt-12 max-w-4xl">
          <StatsCountUp />
        </div>
      </section>

      {/* CREATIVE SERVICES — animated, non-clickable tiles */}
      <section className="page-shell pb-14 md:pb-20">
        <p className="section-eyebrow text-center">Creative that keeps up</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.5rem]">
          From big concepts <span className="text-gold">to finished assets.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[16px] leading-relaxed text-slate-600">
          The creative muscle to keep your campaigns fresh and on-brand, across every channel.
        </p>
        <div className="mx-auto mt-10 max-w-5xl">
          <CreativeTilesGrid />
        </div>
      </section>

      {/* HOW WE COLLABORATE — steps highlight as you scroll */}
      <section className="page-shell pb-14 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <CollaborationSteps />
        </div>
        <div className="mx-auto mt-14 max-w-5xl md:mt-20">
          <CreativeCtaCard />
        </div>
      </section>

      {/* RELATED ARTICLES */}
      <section className="page-shell pb-14 md:pb-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="section-eyebrow">From the notebook</p>
            <h2 className="mt-3 text-[1.6rem] font-bold tracking-[-0.02em] text-ink md:text-[2rem]">Related articles</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {RELATED_ARTICLES.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(15,30,46,0.05)] transition-shadow hover:shadow-[0_16px_50px_rgba(15,30,46,0.12)]"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.alt}
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
                  {article.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-ink">{article.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{article.excerpt}</p>
                <p className="mt-auto pt-4 text-[12px] font-medium text-ink/40">{article.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="page-shell pb-16 md:pb-24" id="faq">
        <div className="mx-auto max-w-3xl">
          <p className="section-eyebrow text-center">Questions, answered</p>
          <h2 className="mt-3 text-center text-[1.6rem] font-bold tracking-[-0.02em] text-ink md:text-[2rem]">
            Frequently asked questions
          </h2>
          <div className="mt-9 divide-y divide-black/[0.07] rounded-[1.5rem] border border-black/[0.06] bg-white px-6 shadow-[0_8px_30px_rgba(15,30,46,0.05)] sm:px-8">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-[16px] font-medium text-ink/60 transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-[14px] text-slate-500">
            Still have a question?{" "}
            <Link href="/book" className="font-semibold text-brand underline-offset-4 hover:underline">
              Book a demo
            </Link>{" "}
            and ask us live.
          </p>
        </div>
      </section>

      <SiteFooter
        tagline="Your next campaign is an adventure away."
        backgroundImage="/marketing/footer-cartoon.png"
      />
    </div>
  )
}
