import type { Metadata } from "next"
import Link from "next/link"
import { ReportPopupLink } from "@/components/report-popup"
import { SiteFooter } from "@/components/site-footer"
import { TalkForm } from "@/components/talk-form"

export const metadata: Metadata = {
  title: "Talk with us | Terramore",
  description:
    "A free 30-minute call. Tell us where the business is stuck. We map the work, the tools, and whether we are the right team.",
}

const EXPECT = [
  { title: "Before the call", body: "We read your site, ads, Maps, and listings. You do not explain the basics." },
  { title: "On the call", body: "Thirty minutes. You say what is stuck. We say what we would look at first and what it would take." },
  { title: "After the call", body: "A short note with the first fix and a price. No fee until you say yes." },
]

export default function TalkPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="pb-8 pt-8 md:pt-12">
        <div className="page-shell text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.1] tracking-[-0.04em] text-ink sm:text-5xl md:text-[3.4rem]">
              Talk with us. <span className="text-gold">It is free.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-ink/80 sm:text-lg">
              Tell us where the business is stuck. We map the work, the tools, and whether we are the right team.
              Three short steps, then pick a time.
            </p>
            <p className="mx-auto mt-7 text-[14px] text-ink/50">
              Not ready for a call?{" "}
              <ReportPopupLink
                label="Ask for the free Digital Footprint report"
                className="font-medium text-brand hover:text-brand-hover"
              />
              . No meeting needed.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <TalkForm />
          <div className="rounded-[1.75rem] border border-ink/[0.06] bg-white p-7 md:p-9">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">What to expect</p>
            <ol className="mt-5 space-y-5">
              {EXPECT.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-600">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 border-t border-ink/[0.06] pt-6">
              <p className="text-[15px] font-semibold text-ink">Already know you want the call?</p>
              <p className="mt-1 text-[14px] text-slate-600">Skip the form and pick a time.</p>
              <a
                href="https://calendly.com/terramore/30min"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-[15px] font-medium text-ink hover:border-ink/40"
              >
                Open the calendar
              </a>
            </div>
            <p className="mt-6 text-[13px] text-slate-500">
              What it costs after the call is on the{" "}
              <Link href="/pricing" className="font-medium text-brand hover:text-brand-hover">
                pricing page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
