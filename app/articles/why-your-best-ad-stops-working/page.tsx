import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Why your best-performing ad will stop working | Terramore",
  description:
    "Creative fatigue is measurable. Here's how to spot the drop-off early and refresh before your cost per lead climbs.",
  alternates: { canonical: "https://www.terramore.io/articles/why-your-best-ad-stops-working" },
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-cream">
      <article className="page-shell pb-16 pt-8 md:pt-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">Ad creative · 6 min read</p>
          <h1 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.6rem]">
            Why your best-performing ad will stop working (and what to do about it)
          </h1>
          <div className="mt-8 overflow-hidden rounded-[1.5rem] shadow-[0_16px_50px_rgba(15,30,46,0.12)]">
            <Image
              src="/marketing/articles/article-ad-fatigue.png"
              alt="A creative team reviewing printed ad concept variations at a desk"
              width={1024}
              height={768}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="prose-terramore mt-10 space-y-5 text-[16.5px] leading-relaxed text-slate-700">
            <p>
              Every business owner who runs ads eventually lives the same story. You launch a campaign, one ad pulls
              ahead of the rest, leads get cheaper, and for a few glorious weeks it feels like you found the cheat
              code. Then, without you touching anything, the numbers slide. Cost per lead creeps up. Click-through
              rate sags. The ad that carried your month quietly stops carrying it.
            </p>
            <p>
              Nothing broke. What you&apos;re seeing is <strong className="text-ink">creative fatigue</strong>, and it
              happens to every winning ad — the only question is when.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">Why winners wear out</h2>
            <p>
              Two forces work against your best ad. The first is your audience: the people most likely to respond see
              it early, and everyone left has already scrolled past it a dozen times. Familiarity kills curiosity. The
              second is the algorithm: platforms like Meta and Google reward fresh engagement signals, and as your
              ad&apos;s engagement decays, the auction quietly charges you more for the same placement.
            </p>
            <p>
              Industry benchmarks vary, but most retail and service advertisers see meaningful fatigue somewhere
              between two and eight weeks per creative — faster the smaller your audience is.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">The early warning signs</h2>
            <p>Fatigue is measurable well before your revenue feels it. Watch three signals:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-ink">Frequency climbing past ~3.</strong> When the average person has seen your
                ad three or more times, response rates typically fall off a cliff.
              </li>
              <li>
                <strong className="text-ink">CTR down while impressions hold.</strong> The platform is still showing
                the ad — people have just stopped caring.
              </li>
              <li>
                <strong className="text-ink">Cost per result rising week over week</strong> with no change in your
                offer, budget, or landing page. That trend almost never reverses on its own.
              </li>
            </ul>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">Refresh, don&apos;t restart</h2>
            <p>
              The instinct is to scrap the ad and brainstorm something brand new. Usually that&apos;s wasteful. Your
              fatigued winner is full of information: the hook that worked, the offer that converted, the audience
              that responded. The fastest fix is a <strong className="text-ink">refresh</strong> — keep the message,
              change the wrapper. New visual, new opening line, new format (static to video, video to carousel), same
              underlying promise.
            </p>
            <p>
              A practical cadence: for every winning concept, have two or three variations ready before fatigue sets
              in. Rotate on a schedule instead of reacting to a bad week. Teams that refresh proactively pay
              noticeably less per lead over a quarter than teams that ride each ad into the ground.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">The takeaway</h2>
            <p>
              Ad fatigue isn&apos;t a failure — it&apos;s a maintenance schedule. Measure frequency and CTR weekly,
              keep a bench of variations, and treat creative refreshes as a routine cost of performance rather than an
              emergency. Your best ad will still stop working someday. You just won&apos;t be surprised when it does.
            </p>
          </div>
          <div className="mt-12 rounded-[1.5rem] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.05)] sm:p-8">
            <p className="text-[15px] leading-relaxed text-slate-600">
              Terramore keeps client campaigns fresh with scheduled creative rotation, so cost per lead stays flat
              while everyone else&apos;s climbs.
            </p>
            <Link
              href="/book"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
            >
              Book a demo
            </Link>
          </div>
          <p className="mt-8 text-[14px]">
            <Link href="/marketing" className="font-medium text-brand underline-offset-4 hover:underline">
              ← Back to Marketing
            </Link>
          </p>
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
