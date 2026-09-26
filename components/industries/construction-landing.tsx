import Image from "next/image"
import type { ReactNode } from "react"
import { BookingLink } from "@/components/booking-popup"
import { ReportPopupLink } from "@/components/report-popup"
import { ConstructionHeroVideo } from "@/components/industries/construction-hero-video"
import { ConstructionInquiryNotifications } from "@/components/industries/construction-inquiry-notifications"
import { ConstructionProblemPhone } from "@/components/industries/construction-problem-phone"
import { ConstructionSolutionPhone } from "@/components/industries/construction-solution-phone"

const CTA_PRIMARY =
  "inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
const CTA_SECONDARY =
  "inline-flex h-11 items-center justify-center rounded-full border border-ink/15 bg-white/80 px-6 text-[15px] font-medium text-ink hover:border-ink/30 hover:bg-white"

/** Equal beats matching the solution phone: publish → devices → rank → book → revenue. */
const FIXES = [
  {
    n: "01",
    cue: "Proof",
    title: "Work leaves the phone.",
    body: "Jobsite photos and video go live on your site, Google, and ads.",
  },
  {
    n: "02",
    cue: "Screens",
    title: "One customer. Every device.",
    body: "Retarget the same homeowner on TV, laptop, phone, and iPad.",
  },
  {
    n: "03",
    cue: "Search",
    title: "You show up when they look.",
    body: "Same local searches — your company at the top, not buried.",
  },
  {
    n: "04",
    cue: "Follow-up",
    title: "Every lead gets answered.",
    body: "Calls, forms, and texts route into a system that books estimates.",
  },
  {
    n: "05",
    cue: "Revenue",
    title: "Pipeline turns into jobs.",
    body: "Tracked opportunities compound — referrals stop being the only channel.",
  },
] as const

/** Equal structure on purpose: short cue · punchy title · one-line body. */
const PROBLEMS = [
  {
    n: "01",
    title: "Stuck on the phone.",
    body: "Job photos and videos never leave the camera roll.",
    cue: "Camera roll",
  },
  {
    n: "02",
    title: "Referrals dry up.",
    body: "Word of mouth works—until you need the next job.",
    cue: "Word of mouth",
  },
  {
    n: "03",
    title: "Proof is scattered.",
    body: "Phone, website, Google—no single place that sells you.",
    cue: "No system",
  },
  {
    n: "04",
    title: "Hoping the phone rings.",
    body: "No plan for bookings—just waiting on the next call.",
    cue: "Follow-up",
  },
  {
    n: "05",
    title: "Competitors buy attention.",
    body: "They're buying attention. You're not.",
    cue: "Paid media",
  },
] as const

const STAGES = [
  {
    id: "foundation",
    label: "For contractors relying primarily on referrals",
    title: "Build the foundation",
    intro: "Build the digital foundation that helps your existing reputation work harder.",
    needs: [
      "Website positioning",
      "Project photography & content",
      "Google Business Profile",
      "Local / search foundation",
      "Review system",
      "Basic lead tracking",
    ],
    emphasize: false,
  },
  {
    id: "pipeline",
    label: "For established contractors ready for more predictable opportunities",
    title: "Build the pipeline",
    intro: "Strengthen the foundation, then add the systems that create a steadier flow of qualified work.",
    needs: [
      "Google Ads",
      "Landing pages",
      "Ongoing content",
      "SEO",
      "Lead qualification",
      "CRM & automated follow-up",
    ],
    emphasize: true,
  },
  {
    id: "expand",
    label: "For companies growing into new services, territories, or project types",
    title: "Expand the market",
    intro: "Scale what's working across more markets, offers, and a clearer sales pipeline.",
    needs: [
      "Multi-market campaigns",
      "Service / location landing pages",
      "Higher-volume content",
      "Paid-media scaling",
      "Advanced CRM workflows",
      "Sales pipeline reporting",
    ],
    emphasize: false,
  },
] as const

const PROCESS = [
  {
    n: "01",
    title: "Diagnose",
    body: "We look at your market, competitors, website, search visibility, customer journey, and existing marketing.",
  },
  {
    n: "02",
    title: "Prioritize",
    body: "We identify the few things most likely to move the business instead of selling every available service.",
  },
  {
    n: "03",
    title: "Build",
    body: "Terramore coordinates content, campaigns, pages, tracking, and follow-up.",
  },
  {
    n: "04",
    title: "Improve",
    body: "We watch what generates opportunities and adjust around actual performance.",
  },
] as const

const INSIGHTS = [
  {
    n: "01",
    title: "High-ticket decisions take proof.",
    body: "Customers aren't buying a $40 product. They're trusting someone with a home, property, or substantial project.",
  },
  {
    n: "02",
    title: "Your work is your strongest marketing asset.",
    body: "Jobsite progress, finished work, customer experience, and craftsmanship should feed the marketing system continuously.",
  },
  {
    n: "03",
    title: "Speed still matters.",
    body: "When someone requests an estimate or consultation, professional and timely follow-up matters.",
  },
] as const

function TalkCta({
  children = "Let's Talk",
  className = CTA_PRIMARY,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <BookingLink source="construction" className={className}>
      {children}
    </BookingLink>
  )
}

export function ConstructionLanding() {
  return (
    <>
      {/* 01 — HERO
          Mobile: full-viewport video; copy + CTAs pinned near bottom + scroll cue.
          Desktop: split — copy left, portrait video in the right frame. */}
      <section className="relative -mt-24 min-h-[100svh] overflow-hidden lg:mt-0 lg:min-h-0 lg:pb-16 lg:pt-6">
        {/* Mobile / tablet background video */}
        <div className="absolute inset-0 lg:hidden" aria-hidden>
          <ConstructionHeroVideo variant="background" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/35" />
        </div>
        {/* Mobile: iMessage (top) + chatbot (lower) over the full-bleed video */}
        <div className="absolute inset-0 z-[15] lg:hidden">
          <ConstructionInquiryNotifications surface="mobile-hero" />
        </div>

        <div className="page-shell relative z-10 flex min-h-[100svh] flex-col justify-end gap-4 pb-6 pt-20 lg:min-h-0 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-0 lg:pt-0">
          <div className="text-cream lg:text-ink">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60 lg:text-ink/50">
              Marketing for construction companies
            </p>
            <h1 className="mt-3 max-w-xl text-[2.05rem] font-bold leading-[1.08] tracking-[-0.02em] sm:mt-4 sm:text-[2.6rem] md:text-[3.1rem]">
              Turn the work you&apos;re already doing into your next job.
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/80 sm:mt-5 sm:text-[16px] md:text-[17px] lg:text-ink/70">
              Terramore helps contractors turn completed projects, referrals, search visibility, content, and paid
              acquisition into a growth system that keeps working between jobs.
            </p>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <TalkCta />
              <ReportPopupLink
                direct
                className={`${CTA_SECONDARY} border-white/25 bg-white/10 text-cream backdrop-blur hover:border-white/40 hover:bg-white/15 lg:border-ink/15 lg:bg-white/80 lg:text-ink lg:hover:border-ink/30 lg:hover:bg-white`}
              >
                See Your Digital Footprint
              </ReportPopupLink>
            </div>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-cream/45 sm:mt-5 sm:text-[12px] lg:text-ink/40">
              Strategy · Content · Search · Paid Media · Follow-Up
            </p>
          </div>

          {/* Desktop: portrait video in rounded media frame */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[3/4] max-h-[36rem] overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(15,30,46,0.35)]">
              <ConstructionHeroVideo variant="panel" />
              {/* v1 iMessage (top) + v2 Slack (bottom) on the video tile */}
              <ConstructionInquiryNotifications surface="desktop-panel" />
            </div>
          </div>

          {/* Mobile scroll cue — no next-section teaser; full viewport hero ends cleanly */}
          <a
            href="#construction-problem"
            className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center text-cream/70 transition-colors hover:text-cream lg:hidden"
            aria-label="Scroll to continue"
          >
            <svg
              className="construction-hero-scroll-hint h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>
      </section>

      {/* 02 — PROBLEM RECOGNITION
          Phone story: scrolling raw jobsite camera roll → ringing → voicemail → Missed Call ×5.
          List beside it stays equal structure (cue · title · one-line body). */}
      <section id="construction-problem" className="page-shell scroll-mt-24 pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
          <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.35rem]">
            The work is done.
            <span className="mt-1 block text-ink/65 md:mt-2">The growth system isn&apos;t.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-[16px]">
            Same pattern we see across contractors: great jobs, weak follow-through from proof to booking.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,19rem)_1fr]">
          <ConstructionProblemPhone />

          <ol className="divide-y divide-ink/10 border-y border-ink/10">
            {PROBLEMS.map((item) => (
              <li key={item.n} className="flex gap-4 py-4 sm:gap-5 sm:py-5">
                <p className="w-7 shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-gold-to">{item.n}</p>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/35">{item.cue}</p>
                  <h3 className="mt-1 text-[16px] font-semibold leading-snug tracking-tight text-ink sm:text-[17px]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-slate-600">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 — HOW TERRAMORE FIXES IT
          Same phone language as the problem section, flipped into revenue. */}
      <section id="growth-system" className="scroll-mt-28 bg-ink py-16 text-cream md:py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-from">
              How Terramore fixes it
            </p>
            <h2 className="mt-4 text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] md:text-[2.5rem]">
              Same phone.
              <span className="mt-1 block text-cream/65 md:mt-2">Different ending.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-cream/70 md:text-[16px]">
              Terramore turns trapped proof, missed searches, and unanswered calls into a system that books
              work — and tracks what turns into revenue.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,19rem)_1fr]">
            <ConstructionSolutionPhone />

            <ol className="divide-y divide-white/10 border-y border-white/10">
              {FIXES.map((item) => (
                <li key={item.n} className="flex gap-4 py-4 sm:gap-5 sm:py-5">
                  <p className="w-7 shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-gold-from">
                    {item.n}
                  </p>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/35">
                      {item.cue}
                    </p>
                    <h3 className="mt-1 text-[16px] font-semibold leading-snug tracking-tight text-cream sm:text-[17px]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-cream/60">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 04 — CAPABILITIES BENTO */}
      <section className="page-shell py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.4rem]">
            Everything between doing great work and getting the next customer.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-[16px]">
            Strategy, execution, and follow-up connected around the same growth objective.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[13.5rem]">
          {/* Large tile */}
          <div className="group relative min-h-[18rem] overflow-hidden rounded-[1.5rem] sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-0">
            <Image
              src="/marketing/services/creative.png"
              alt="Creative wall of project and campaign concepts — illustrative of project media production"
              width={1024}
              height={768}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 [text-shadow:0_1px_12px_rgba(15,30,46,0.65)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                Content &amp; project media
              </p>
              <p className="mt-2 max-w-md text-[15px] font-medium leading-snug text-white md:text-[16px]">
                Turn active jobs and completed projects into photography, video, case studies, ads, and content that
                prove the quality of your work.
              </p>
            </div>
          </div>

          <CapabilityTile
            image="/marketing/services/strategy.png"
            alt="Strategic planning workspace — illustrative of positioning and local visibility planning"
            label="Search & local visibility"
            body="Show up when customers are actively looking for the work you do."
          />
          <CapabilityTile
            image="/marketing/services/paid.png"
            alt="Media-buying workstation reviewing campaign performance — illustrative"
            label="Paid acquisition"
            body="Reach high-intent prospects when organic reach isn't enough."
          />
          <CapabilityTile
            image="/marketing/services/landing.png"
            alt="Landing page shown on desktop and mobile — illustrative"
            label="Website & landing pages"
            body="Give prospects enough proof to understand your work and choose the next step."
          />
          <CapabilityTile
            image="/marketing/services/email.png"
            alt="Phone and laptop showing follow-up messages — illustrative"
            label="CRM & follow-up"
            body="Route opportunities, respond faster, and keep follow-up from living in someone's phone."
          />
          <CapabilityTile
            image="/marketing/services/analytics.png"
            alt="Analytics interface tracing paths from attention to opportunity — illustrative"
            label="Strategy & reporting"
            body="Know what's generating attention, inquiries, and actual opportunities."
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      {/* 05 — GROWTH STAGES */}
      <section className="bg-white py-16 md:py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.4rem]">
              You don&apos;t need every marketing service.
              <br />
              You need the right next move.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className={`flex flex-col rounded-[1.5rem] p-6 md:p-7 ${
                  stage.emphasize
                    ? "bg-ink text-cream shadow-[0_20px_50px_-24px_rgba(15,30,46,0.55)] ring-1 ring-ink"
                    : "border border-black/[0.06] bg-cream"
                }`}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    stage.emphasize ? "text-gold-from" : "text-ink/45"
                  }`}
                >
                  {stage.label}
                </p>
                <h3 className={`mt-3 text-[1.25rem] font-bold tracking-tight ${stage.emphasize ? "text-cream" : "text-ink"}`}>
                  {stage.title}
                </h3>
                <p className={`mt-3 text-[14px] leading-relaxed ${stage.emphasize ? "text-cream/70" : "text-slate-600"}`}>
                  {stage.intro}
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {stage.needs.map((need) => (
                    <li
                      key={need}
                      className={`text-[13.5px] leading-snug ${stage.emphasize ? "text-cream/85" : "text-ink/75"}`}
                    >
                      <span className={stage.emphasize ? "text-gold-from" : "text-brand"}>· </span>
                      {need}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <TalkCta>Build My Growth Plan</TalkCta>
            <p className="max-w-md text-[13px] leading-relaxed text-slate-500">
              We scope around your business, market, and growth stage—not a generic marketing package.
            </p>
          </div>
        </div>
      </section>

      {/* 06 — CASE STUDY (placeholder client identity — no fabricated results) */}
      <section className="page-shell py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.4rem]">
            Built around how construction actually gets sold.
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[16rem] lg:min-h-[22rem]">
            <Image
              src="/industries/construction/case-study.jpg"
              alt="Construction project photography placeholder — replace with approved client project imagery"
              width={1536}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-9">
            <div className="flex flex-wrap items-center gap-2">
              {/* TODO: Replace with verified client name when approved (e.g. SAS Builds). */}
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/40">Featured engagement</p>
              <span className="rounded-full bg-gold-from/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-to">
                In progress
              </span>
            </div>
            <h3 className="mt-3 text-[1.35rem] font-bold tracking-tight text-ink">
              {/* TODO: Client name pending verification */}
              Construction growth system
            </h3>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Challenge</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
                  Referral-driven business with limited digital acquisition infrastructure.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">What Terramore is building</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
                  Content system · Project documentation · Search visibility · Paid acquisition · Conversion path ·
                  Follow-up infrastructure
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Objective</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
                  Turn existing reputation and project quality into a repeatable digital growth engine.
                </p>
              </div>
            </div>
            <p className="mt-6 text-[12px] leading-relaxed text-slate-400">
              No fabricated results. Client identity and project photography pending approval.
            </p>
          </div>
        </div>

        {/* Project strip — illustrative system visuals until approved jobsite gallery exists */}
        <div className="mx-auto mt-4 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { src: "/marketing/services/video.png", alt: "Short-form content production — illustrative placeholder" },
            { src: "/marketing/services/landing.png", alt: "Landing page craft — illustrative placeholder" },
            { src: "/marketing/services/strategy.png", alt: "Growth strategy workspace — illustrative placeholder" },
            { src: "/marketing/services/automation.png", alt: "Follow-up automation — illustrative placeholder" },
          ].map((shot) => (
            <div key={shot.src} className="overflow-hidden rounded-2xl">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={512}
                height={384}
                className="aspect-[4/3] h-auto w-full object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 07 — WORKING WITH TERRAMORE */}
      <section className="bg-cream py-16 md:py-24">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.3rem]">
                You build the projects.
                <br />
                We build the growth system around them.
              </h2>
              <div className="mt-8">
                <TalkCta>Talk Through Your Business</TalkCta>
              </div>
            </div>
          </div>

          <ol className="relative space-y-2">
            <span aria-hidden className="absolute bottom-8 left-[1.55rem] top-8 w-px bg-black/[0.08]" />
            {PROCESS.map((step) => (
              <li key={step.n} className="relative flex gap-5 rounded-2xl border border-transparent p-5 transition hover:border-black/[0.06] hover:bg-white sm:p-6">
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-tight text-ink sm:text-[17px]">{step.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 08 — EXPERTISE */}
      <section className="page-shell py-16 md:py-24">
        <h2 className="mx-auto max-w-2xl text-center text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.35rem]">
          Marketing a contractor isn&apos;t the same as marketing an ecommerce store.
        </h2>
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-black/[0.08]">
          {INSIGHTS.map((item) => (
            <div key={item.n} className="grid gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:gap-8">
              <p className="font-serif text-[2.5rem] leading-none tracking-tight text-gold-to/80">{item.n}</p>
              <div>
                <h3 className="text-[1.2rem] font-semibold tracking-tight text-ink md:text-[1.35rem]">{item.title}</h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600 md:text-[16px]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 09 — QUALIFICATION */}
      <section className="bg-ink py-16 text-cream md:py-20">
        <div className="page-shell mx-auto max-w-3xl">
          <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] md:text-[2.2rem]">
            This is probably for you if…
          </h2>
          <ul className="mt-8 space-y-3">
            {[
              "You already do work worth showing.",
              "Referrals generate business, but you want another acquisition channel.",
              "You're trying to grow a service, territory, or project type.",
              "Marketing currently feels fragmented.",
              "You're willing to invest in building something that compounds.",
            ].map((line) => (
              <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-cream/85 md:text-[16px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-from" aria-hidden />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 sm:px-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cream/45">Probably not if…</p>
            <p className="mt-2 text-[15px] leading-relaxed text-cream/70">
              You&apos;re looking for 100 cheap leads next week.
            </p>
          </div>
        </div>
      </section>

      {/* 10 — FINAL CTA */}
      <section className="page-shell py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-2xl text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] text-ink md:text-[2.6rem]">
          Let&apos;s find the biggest growth opportunity in your construction business.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-slate-600">
          Tell us where the business is today, where you want it to go, and what&apos;s currently getting in the way.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <TalkCta />
          <ReportPopupLink
            direct
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 bg-transparent px-6 text-[15px] font-medium text-ink hover:border-ink/30 hover:bg-white"
          >
            Get Your Digital Footprint Report
          </ReportPopupLink>
        </div>
        <p className="mt-5 text-[13px] text-slate-500">No generic pitch. We&apos;ll look at the business first.</p>

        {/* Page-bottom: same iOS banner cycle */}
        <div className="relative mx-auto mt-12 h-[2.85rem] w-full max-w-[21.5rem]">
          <ConstructionInquiryNotifications surface="page-bottom" />
        </div>
      </section>
    </>
  )
}

function CapabilityTile({
  image,
  alt,
  label,
  body,
  className = "",
}: {
  image: string
  alt: string
  label: string
  body: string
  className?: string
}) {
  return (
    <div className={`group relative h-56 overflow-hidden rounded-[1.5rem] lg:h-auto ${className}`}>
      <Image
        src={image}
        alt={alt}
        width={1024}
        height={768}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      <div className="absolute bottom-4 left-5 right-5 [text-shadow:0_1px_12px_rgba(15,30,46,0.65)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">{label}</p>
        <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">{body}</p>
      </div>
    </div>
  )
}
