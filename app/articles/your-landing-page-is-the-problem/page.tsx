import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BookingLink } from "@/components/booking-popup"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Your ads aren't the problem — your landing page is | Terramore",
  description:
    "When clicks are cheap but sales are flat, the leak is usually after the click. A practical teardown checklist.",
  alternates: { canonical: "https://www.terramore.io/articles/your-landing-page-is-the-problem" },
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-cream">
      <article className="page-shell pb-16 pt-8 md:pt-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">Landing pages · 5 min read</p>
          <h1 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.6rem]">
            Your ads aren&apos;t the problem — your landing page is
          </h1>
          <div className="mt-8 overflow-hidden rounded-[1.5rem] shadow-[0_16px_50px_rgba(15,30,46,0.12)]">
            <Image
              src="/marketing/articles/article-landing.png"
              alt="A designer's workspace with a landing page design on a monitor and wireframe sketches"
              width={1024}
              height={768}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="mt-10 space-y-5 text-[16.5px] leading-relaxed text-slate-700">
            <p>
              Here&apos;s a pattern we see constantly: the ad account looks healthy — decent click-through rates,
              reasonable cost per click, plenty of traffic — but the revenue line is flat. The owner concludes
              &quot;ads don&apos;t work for my business&quot; and shuts the campaign down.
            </p>
            <p>
              Nine times out of ten, the ads were doing their job. The click was sold. The page it landed on
              wasn&apos;t ready to close.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">How to know where the leak is</h2>
            <p>
              The diagnosis is one division: conversions ÷ landing page visitors. If your page converts under roughly
              2% of paid traffic (for lead gen, under ~5–10% depending on the offer), the page is the constraint — and
              every dollar of ad spend is being taxed by it.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">The five-minute teardown</h2>
            <p>Pull up your landing page on your phone — because that&apos;s where most of your traffic is — and check:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-ink">Message match.</strong> Does the headline repeat the promise the ad made?
                If the ad says &quot;20% off spring cleanings&quot; and the page says &quot;Welcome to Smith
                Plumbing,&quot; you lose people in the first second.
              </li>
              <li>
                <strong className="text-ink">One job per page.</strong> A landing page with a full navigation bar,
                three offers, and a newsletter signup is a brochure. One offer, one form, one button.
              </li>
              <li>
                <strong className="text-ink">The ask is visible without scrolling.</strong> Headline, one line of
                support, and the call-to-action should fit on the first screen.
              </li>
              <li>
                <strong className="text-ink">Proof close to the ask.</strong> A review, a rating, a before/after —
                something that answers &quot;can I trust these people?&quot; right where the decision happens.
              </li>
              <li>
                <strong className="text-ink">Speed.</strong> If the page takes more than ~3 seconds to load on mobile
                data, a meaningful share of paid visitors never see it at all. You paid for those clicks.
              </li>
            </ul>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">Why this beats a new campaign</h2>
            <p>
              Improving page conversion compounds across every channel at once. Take a page from 1.5% to 3% and you
              have doubled the output of your Google budget, your Meta budget, your email clicks, and your organic
              traffic — in one project, with no increase in spend. There is almost never a cheaper lever in the whole
              system.
            </p>
            <p>
              So before you kill the campaign or double the budget, spend a week on the page. The ads were probably
              fine. They just deserved a better place to land.
            </p>
          </div>
          <div className="mt-12 rounded-[1.5rem] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.05)] sm:p-8">
            <p className="text-[15px] leading-relaxed text-slate-600">
              Terramore builds and tests landing pages as part of every campaign — so the click and the close belong
              to the same system.
            </p>
            <BookingLink
              source="article"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
            >
              Book a demo
            </BookingLink>
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
