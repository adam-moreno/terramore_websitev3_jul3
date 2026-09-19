import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "The three numbers to check before raising ad spend | Terramore",
  description:
    "More budget only helps if the system behind it converts. These are the numbers that tell you whether you're ready.",
  alternates: { canonical: "https://www.terramore.io/articles/three-numbers-before-raising-ad-spend" },
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-cream">
      <article className="page-shell pb-16 pt-8 md:pt-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">Measurement · 8 min read</p>
          <h1 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[2.6rem]">
            The three numbers every owner should check before raising ad spend
          </h1>
          <div className="mt-8 overflow-hidden rounded-[1.5rem] shadow-[0_16px_50px_rgba(15,30,46,0.12)]">
            <Image
              src="/marketing/articles/article-metrics.png"
              alt="A business owner reviewing a marketing analytics dashboard on a laptop"
              width={1024}
              height={768}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="mt-10 space-y-5 text-[16.5px] leading-relaxed text-slate-700">
            <p>
              &quot;Should I put more money into ads?&quot; is one of the most common questions a growing business
              faces — and one of the easiest to answer badly. More budget amplifies whatever system it flows into. If
              the system converts, more spend means more revenue. If it leaks, more spend means bigger leaks.
            </p>
            <p>Before you raise the budget, three numbers should have your sign-off.</p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">1. Customer lifetime value (LTV)</h2>
            <p>
              Not what a customer pays you today — what they&apos;re worth over the whole relationship. A $150 first
              purchase looks expensive to acquire at $80 per customer, until you notice the average customer comes
              back four times. Most owners undervalue their customers, which makes them under-spend on acquisition
              and lose ground to competitors who did the math.
            </p>
            <p>
              Quick version: average order value × purchases per year × years a customer stays. If you don&apos;t know
              those inputs, that&apos;s the first project — not a bigger ad budget.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">2. True cost per acquisition (CPA)</h2>
            <p>
              Platforms report cost per click and cost per lead in flattering ways. The number that matters is what a
              <em> paying customer</em> actually costs across the whole funnel: ad spend ÷ new customers from ads. If
              leads are cheap but customers are expensive, your problem is after the click — qualification, follow-up
              speed, or the sales conversation — and more spend will just manufacture more expensive disappointment.
            </p>
            <p>
              The ratio to watch is LTV:CPA. Below 3:1, fix the funnel before feeding it. Above 3:1 with room to
              spare, you&apos;re likely under-spending.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">3. Speed to follow-up</h2>
            <p>
              The least glamorous number and often the most profitable one. Research consistently shows lead contact
              rates collapse within minutes, not days — a lead answered in five minutes converts dramatically better
              than one answered in five hours. If your average response time is measured in hours, an automation fix
              will usually return more than any budget increase, and it costs a fraction as much.
            </p>
            <h2 className="pt-4 text-[1.35rem] font-bold tracking-tight text-ink">The order of operations</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Know your LTV, so you know what you can afford to pay.</li>
              <li>Verify your true CPA, so you know what you&apos;re actually paying.</li>
              <li>Tighten follow-up, so paid traffic doesn&apos;t leak between click and close.</li>
              <li>
                <em>Then</em> raise the budget — into a system you trust, watching CPA as you scale, because it will
                move.
              </li>
            </ul>
            <p>
              Owners who follow that order scale calmly. Owners who skip to the budget slider fund their own
              frustration.
            </p>
          </div>
          <div className="mt-12 rounded-[1.5rem] bg-white p-6 shadow-[0_8px_30px_rgba(15,30,46,0.05)] sm:p-8">
            <p className="text-[15px] leading-relaxed text-slate-600">
              Terra IQ ties spend, leads, and revenue together so these three numbers are on one screen — not spread
              across five logins.
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
