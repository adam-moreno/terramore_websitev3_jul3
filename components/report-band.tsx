"use client"

import { useState } from "react"
import Link from "next/link"
import { ReportPopup } from "@/components/report-popup"
import { ReportScanVisual } from "@/components/report-scan-visual"
import { CHAPTERS } from "@/lib/report/chapters"

export function ReportBand() {
  const [open, setOpen] = useState(false)

  return (
    <section id="report" className="section-y scroll-mt-28 md:py-24">
      <div className="page-shell">
        <p className="section-eyebrow text-center">Free Digital Footprint report</p>
        <h2 className="section-title mx-auto mt-3 max-w-[720px] text-center text-ink md:text-[3rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
          See the business the way a new customer already can.
        </h2>
        <p className="section-lede mx-auto mt-4 max-w-[560px] text-center text-ink/70 md:mt-5 md:text-[1.05rem] md:leading-relaxed">
          We read what a stranger can already see: your site, ads, Maps, and listings. You get a written report of what
          is working, where you are losing sales, and what we would fix first. In your inbox in minutes.
        </p>

        <div className="card-radius mx-auto mt-12 grid max-w-[980px] overflow-hidden border border-black/[0.06] bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] md:rounded-[1.75rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="card-pad relative flex min-h-[26rem] flex-col bg-ink text-cream md:p-7">
            <div className="min-h-0 flex-1">
              <ReportScanVisual />
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">What you get</p>
              <p className="mt-1.5 text-[1.35rem] font-semibold tracking-tight">A file about your business.</p>
              <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-cream/75">
                No login. No call. A written read of what is already public.
              </p>
            </div>
          </div>

          <div className="card-pad hidden flex-col md:p-8 lg:flex">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/40">Inside the report</p>
            <div className="mt-4 space-y-2">
              {CHAPTERS.map((item) => (
                <div key={item.n} className="rounded-2xl px-4 py-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] font-semibold text-ink/35">{item.n}</span>
                    <span className="text-[15px] font-semibold text-ink">{item.title}</span>
                  </div>
                  <p className="mt-1.5 pl-8 text-[13px] leading-relaxed text-ink/70">{item.body}</p>
                  <p className="mt-1 pl-8 text-[12px] text-slate-500">{item.sample}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 md:mt-10">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-[16px] font-medium text-white hover:bg-brand-hover md:h-11 md:text-[15px]"
          >
            Send me the free report
          </button>
          <Link href="/report/example" className="text-[15px] font-medium text-ink/55 underline-offset-4 hover:text-ink hover:underline">
            See sample reports
          </Link>
        </div>
      </div>

      <ReportPopup open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
