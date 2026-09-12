"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ReportPopup } from "@/components/report-popup"
import { ReportScanVisual } from "@/components/report-scan-visual"

const CHAPTERS = [
  {
    n: "01",
    title: "Where you already show up",
    body: "Your site, ads, Maps, email, and the listings people already use. We write what a stranger can see today.",
    sample: "Northline: Shopify is live. Maps hours are a season behind.",
  },
  {
    n: "02",
    title: "Who already looks and buys",
    body: "Who visits, who pays, and who paid still talks to. So ads and email go to the right people.",
    sample: "Northline: women 32–46. Soft Knit Set. 61% leave at shipping.",
  },
  {
    n: "03",
    title: "What already pays",
    body: "The path that already makes money. We keep it. We do not rip out what works.",
    sample: "Northline: mobile checkout and the first-time buyer note.",
  },
  {
    n: "04",
    title: "Where cash is leaking",
    body: "The broken step, and the first moves we would take in 90 days. In order.",
    sample: "Northline: paid still talks to the city. No second email.",
  },
] as const

export function ReportBand() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % CHAPTERS.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [])

  const chapter = CHAPTERS[active]

  return (
    <section id="report" className="scroll-mt-28 py-20 md:py-24">
      <div className="page-shell">
        <p className="text-center text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">
          Free Digital Footprint report
        </p>
        <h2 className="mx-auto mt-3 max-w-[720px] text-center text-[2.15rem] font-semibold tracking-[-0.03em] text-ink md:text-[3rem]">
          See the business the way a new customer already can.
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-center text-[1.05rem] leading-relaxed text-ink/70">
          We read what a stranger can already see: your site, ads, Maps, and listings. A person writes what is working,
          where you are losing sales, and what we would fix first. It lands in your inbox in two to three business days.
        </p>

        <div className="mx-auto mt-12 grid max-w-[980px] overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="relative flex min-h-[26rem] flex-col bg-ink p-6 text-cream md:p-7">
            <div className="min-h-0 flex-1">
              <ReportScanVisual />
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">What you get</p>
              <p className="mt-1.5 text-[1.35rem] font-semibold tracking-tight">A file about your business.</p>
              <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-cream/75">
                No login. No call. A written read of what is already public, by a person.
              </p>
            </div>
          </div>

          <div className="flex flex-col p-6 md:p-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/40">Inside the report</p>
            <div className="mt-4 space-y-2">
              {CHAPTERS.map((item, index) => {
                const on = index === active
                return (
                  <button
                    key={item.n}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                      on ? "bg-[#eef3fb] ring-1 ring-brand/15" : "hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className={`text-[12px] font-semibold ${on ? "text-brand" : "text-ink/35"}`}>{item.n}</span>
                      <span className="text-[15px] font-semibold text-ink">{item.title}</span>
                    </div>
                    {on ? (
                      <>
                        <p className="mt-1.5 pl-8 text-[13px] leading-relaxed text-ink/70">{item.body}</p>
                        <p className="mt-1 pl-8 text-[12px] text-slate-500">{item.sample}</p>
                      </>
                    ) : null}
                  </button>
                )
              })}
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-slate-500">
              {chapter.n} is open. The grey lines are from a real report for a small apparel brand, with the name changed to
              Northline Atelier. Yours names your site and your first fix.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
          >
            Send me the free report
          </button>
          <Link href="/report/example" className="text-[15px] font-medium text-ink/55 underline-offset-4 hover:text-ink hover:underline">
            See the Northline sample
          </Link>
        </div>
      </div>

      <ReportPopup open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
