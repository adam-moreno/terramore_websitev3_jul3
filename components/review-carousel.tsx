"use client"

import { useRef, useState } from "react"
import { CheckMyBusinessLink } from "@/components/business-lookup"
import { MotionToggle } from "@/components/motion-toggle"
import { useOnScreenAndVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay"

/**
 * The kinds of businesses we help. Each card opens the three problems we usually find for that kind of business and
 * how we fix them. These are typical patterns, not client results, so there are no names, places or numbers.
 */
const JOBS = [
  {
    industry: "Pilates studio",
    line: "Checkout leaking on the way to pay.",
    fixes: [
      ["Booking drops off at the payment step.", "We cut booking to one page and test it on a phone, start to finish."],
      ["Trial-class visitors never hear back.", "A text and an email go out within the hour, with a link to book the next class."],
      ["Class packs run out without a nudge.", "Reminders go out before credits expire, each with a rebook link."],
    ],
  },
  {
    industry: "Plumbing company",
    line: "Missed calls after 6 that never book.",
    fixes: [
      ["Calls after hours go unanswered.", "Missed calls get a text back right away with a link to book a time."],
      ["The Google Business Profile is out of date.", "We fix hours, services and photos, and ask for a review after each job."],
      ["Ads send people to the home page.", "Each ad goes to the matching service page with one clear call button."],
    ],
  },
  {
    industry: "Apparel brand",
    line: "First-time buyer emails that ignore what they viewed.",
    fixes: [
      ["Welcome emails ignore what people looked at.", "Emails are built from the products each shopper viewed."],
      ["Carts are left with no reminder.", "An abandoned-cart sequence runs across email and Meta."],
      ["Paid social spend is spread thin.", "Budget moves to the products and audiences that actually sell."],
    ],
  },
  {
    industry: "Home goods store",
    line: "Shopify, Mailchimp, and Meta telling different stories.",
    fixes: [
      ["Shopify, Mailchimp and Meta report different numbers.", "We connect them into one view of sales by channel."],
      ["Repeat buyers get the same emails as strangers.", "Win-back and reorder emails go to people who already bought."],
      ["Product pages load slowly on phones.", "We trim images and scripts, then check the speed again."],
    ],
  },
  {
    industry: "Dental clinic",
    line: "The book link lives on the site, but not in the ad or the text.",
    fixes: [
      ["The booking link isn't in the ads or texts.", "One booking link goes everywhere a patient might see you."],
      ["New-patient calls aren't tracked.", "Call tracking ties each new-patient call to the ad that brought it."],
      ["Recall reminders are done by hand.", "Six-month recall texts and emails go out on their own."],
    ],
  },
  {
    industry: "Skincare brand",
    line: "Paid traffic hitting a page that cannot finish.",
    fixes: [
      ["Ad traffic lands on a page that can't check out.", "We rebuild the landing page for the ad and test checkout end to end."],
      ["Customers never get a reorder prompt.", "Reorder emails are timed to when the product runs out."],
      ["Reviews are buried at the bottom of the page.", "Reviews and customer photos move up next to Add to cart."],
    ],
  },
  {
    industry: "Supplement brand",
    line: "Spend talking to people who already looked, then stopping.",
    fixes: [
      ["Retargeting stops after one look.", "Retargeting runs in a planned sequence over 30 days."],
      ["Subscriptions cancel quietly.", "Subscribers see a pause option and an offer before they cancel."],
      ["Ads get flagged and paused.", "Copy is checked against each platform's rules before launch."],
    ],
  },
  {
    industry: "Landscaping company",
    line: "No written plan the team can run on Monday.",
    fixes: [
      ["There's no written plan the team can run.", "A 90-day plan with owners and dates, written within seven days."],
      ["Spring and fall demand catches the team off guard.", "Campaigns are scheduled ahead of each busy season."],
      ["Quotes go out and nobody follows up.", "Follow-up texts go out 2 and 7 days after each quote."],
    ],
  },
] as const

type Job = (typeof JOBS)[number]

function JobCard({ job, selected, onSelect, hidden = false }: { job: Job; selected: boolean; onSelect: () => void; hidden?: boolean }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      tabIndex={hidden ? -1 : undefined}
      aria-expanded={hidden ? undefined : selected}
      aria-controls={hidden ? undefined : "job-detail"}
      className={`w-[22rem] shrink-0 rounded-2xl border bg-white px-5 py-4 text-left shadow-[0_10px_32px_-18px_rgba(15,30,46,0.28)] transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        selected ? "border-brand ring-1 ring-brand" : "border-black/[0.05]"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[15px] font-semibold leading-tight text-ink">{job.industry}</span>
        <span className="shrink-0 text-[12px] font-medium text-brand">{selected ? "Showing" : "See the fixes"}</span>
      </span>
      <span className="mt-3 block text-[15px] leading-snug text-ink/85">{job.line}</span>
    </button>
  )
}

export function ReviewCarousel() {
  const rowRef = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()
  const onScreen = useOnScreenAndVisible(rowRef)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const running = onScreen && !paused
  const job = selected === null ? null : JOBS[selected]

  // Choosing a business stops the row, so the chosen card stays put while its fixes are read.
  const select = (index: number) => {
    setSelected((current) => (current === index ? null : index))
    setPaused(true)
  }

  return (
    <section className="overflow-hidden py-20 md:py-24">
      <div className="page-shell text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/70">Jobs we already know</p>
        <h2 className="mt-3 text-[2.15rem] font-semibold tracking-[-0.03em] text-ink md:text-[3rem]">
          The kinds of businesses we help.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/70">
          Tap a business to see the three problems we usually find, and how we fix them.
        </p>
      </div>
      <div ref={rowRef} className="mt-10 overflow-hidden py-1">
        {/* Orientation: a slow scroll through the industries; pausable, paused off screen, still under reduced motion. */}
        <div className="review-marquee flex w-max gap-4 px-1" style={running ? undefined : { animationPlayState: "paused" }}>
          {JOBS.map((j, index) => (
            <JobCard key={j.industry} job={j} selected={selected === index} onSelect={() => select(index)} />
          ))}
          {JOBS.map((j, index) => (
            <div key={`dup-${j.industry}`} aria-hidden>
              <JobCard job={j} selected={selected === index} onSelect={() => select(index)} hidden />
            </div>
          ))}
        </div>
      </div>
      {reduce ? null : (
        <div className="page-shell mt-6 flex justify-center">
          <MotionToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="industry list" />
        </div>
      )}
      <div id="job-detail" aria-live="polite" className="page-shell">
        {job ? (
          <div className="mx-auto mt-8 max-w-[52rem] rounded-[24px] border border-black/[0.06] bg-white p-6 text-left shadow-[0_24px_50px_-30px_rgba(15,30,46,0.35)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-ink">Top 3 problems we find</p>
                <h3 className="mt-1 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">{job.industry}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-ink/20 px-4 text-[14px] font-medium text-ink hover:border-ink/40"
              >
                Close
              </button>
            </div>
            <ol className="mt-5 grid gap-4">
              {job.fixes.map(([problem, fix], k) => (
                <li key={problem} className="grid gap-2 rounded-2xl bg-cream p-4 md:grid-cols-[2rem_1fr_1fr] md:items-start md:gap-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[14px] font-bold text-white">{k + 1}</span>
                  <p className="text-[15px] leading-snug text-ink">
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600">The problem</span>
                    {problem}
                  </p>
                  <p className="text-[15px] leading-snug text-ink">
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-green-700">How we fix it</span>
                    {fix}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <CheckMyBusinessLink
                ctaId="home_band_report"
                className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
              />
              <span className="text-[14px] text-slate-600">See which of these your business has. Free.</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
