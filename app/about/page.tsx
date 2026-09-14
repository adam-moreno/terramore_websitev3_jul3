import type { Metadata } from "next"
import Image from "next/image"
import { DualCtas } from "@/components/dual-ctas"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "About | Terramore",
  description:
    "Adam Moreno spent a decade reading what people watch and buy for large advertisers. Terramore points that work at owners with a shop, a service, or a list.",
}

const FOR_OWNERS = [
  {
    title: "We work inside your tools",
    body: "Shopify, Mailchimp, Google, Meta, Stripe, Calendly. We join the accounts you already pay for. You do not start over and you keep every login.",
  },
  {
    title: "You see the problem before you pay to fix it",
    body: "The first call is free. The deposit comes after we agree on scope. The price follows the job, not a menu.",
  },
  {
    title: "You keep the work",
    body: "You own the data and the assets. Work can be 90 days or continue. Monthly is optional. Specialists join when the scope needs them.",
  },
]

const CHAPTERS = [
  {
    title: "Kantar",
    body: "Years in market research. The job was reading who people are, what they watch, and what they actually buy, across digital and social platforms, for large brands.",
  },
  {
    title: "Samba TV",
    body: "Measuring whether TV and streaming ads moved sales for Fortune 500 advertisers, and building the audience targeting behind those campaigns.",
  },
  {
    title: "Building and selling the software",
    body: "He built the audience and analytics dashboards, then sold and set them up for the teams who had to use them on Monday. Data, product, and the person at the desk, in one job.",
  },
  {
    title: "Terramore",
    body: "The same craft, pointed at owners who already have a shop, a service, or a customer list. Software, data, and the work of connecting them, without an enterprise price tag.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-shell pb-8 pt-8 md:pt-12">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">About Terramore</p>
        <h1 className="mt-3 max-w-4xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-[4.4rem]">
          Big brands pay a team to find out why people do not buy. Now you can have one.
        </h1>
        <p className="mt-6 max-w-2xl text-[1.125rem] leading-[1.7] text-ink/75">
          Adam Moreno spent a decade doing that work for large advertisers at Kantar and Samba TV. Terramore is the
          same work, done inside the tools a shop, a service, or a brand already uses.
        </p>
        <DualCtas className="mt-8" />
      </section>

      <section className="page-shell py-10 md:py-14">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">What that means for you</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {FOR_OWNERS.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
              <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell py-10 md:py-14">
        <div className="grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-16">
          <Image
            src="/founder/adam-moreno-headshot.png"
            alt="Adam Moreno, founder of Terramore"
            width={864}
            height={1152}
            sizes="(min-width: 768px) 224px, 176px"
            priority
            className="h-52 w-44 rounded-[1.75rem] object-cover object-top shadow-[0_8px_30px_rgba(15,30,46,0.08)] md:h-64 md:w-56"
          />
          <div className="max-w-2xl space-y-5 text-[1.05rem] leading-relaxed text-ink/75">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">Adam Moreno, founder</p>
            <p>
              Adam spent more than ten years in market research and advertising technology. First reading what people
              watch and buy. Then building the software that targets ads and measures whether they worked, and setting
              it up for the teams who used it every day.
            </p>
            <p>
              He also builds sites, apps, and the systems behind them. That mix is why Terramore can read your numbers
              and fix the page in the same week.
            </p>
            <p>
              Adam leads every engagement. Specialists in ads, email, and build join when the job needs them.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-5 pb-20 md:grid-cols-2">
        {CHAPTERS.map((item) => (
          <div key={item.title} className="rounded-[1.5rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-8">
            <h2 className="text-[1.25rem] font-semibold tracking-tight text-ink">{item.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="page-shell pb-24">
        <div className="max-w-2xl border-t border-black/[0.06] pt-12">
          <h2 className="text-[2rem] font-semibold tracking-[-0.02em] text-ink md:text-[2.4rem]">
            Tell us where the business is stuck.
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/70">
            A free call maps the work. A free report reads your site and lands in your email.
          </p>
          <DualCtas className="mt-7" />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
