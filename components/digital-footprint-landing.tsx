"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ReportPopup } from "@/components/report-popup"
import { CHAPTERS } from "@/lib/report/chapters"

const PDF_PAGES = [
  { src: "/report/pdf-cover.png", alt: "Sample report page: Where you show up" },
  { src: "/report/pdf-discover.png", alt: "Sample report page: Where you're winning" },
  { src: "/report/pdf-leak.png", alt: "Sample report page: Where you can improve" },
] as const

const ROTATE_MS = 4000

const STEPS = [
  {
    n: "01",
    title: "Answer a few questions",
    body: "Three short questions, then your name and email. About a minute.",
    time: "~60 sec",
  },
  {
    n: "02",
    title: "We read what’s public",
    body: "Your website, socials, ads, and reviews — the same places customers already look.",
    time: "Our work",
  },
  {
    n: "03",
    title: "Report in your inbox",
    body: "A written PDF: what’s working, where you can improve, and what to do next.",
    time: "< 5 min",
  },
] as const

function exampleLine(sample: string) {
  return sample.replace(/^Northline:\s*/i, "Example: ")
}

function PdfStack() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % PDF_PAGES.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [])

  const order = [0, 1, 2].map((i) => (active + i) % PDF_PAGES.length)

  return (
    <div className="relative mx-auto h-[22rem] w-full max-w-[20rem] sm:h-[26rem] sm:max-w-[22rem] md:h-[32rem] md:max-w-[26rem]">
      {order.map((pageIndex, depth) => {
        const page = PDF_PAGES[pageIndex]
        const isFront = depth === 2
        const transforms = [
          "translate(-14%, 8%) rotate(-8deg) scale(0.92)",
          "translate(14%, 10%) rotate(7deg) scale(0.92)",
          "translate(0%, 0%) rotate(-1.5deg) scale(1)",
        ]
        return (
          <div
            key={`${page.src}-${depth}`}
            className={`absolute inset-x-[8%] top-0 aspect-[3/4] overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] transition-all duration-700 ease-out ${
              isFront ? "z-30 opacity-100" : "z-10 opacity-95"
            }`}
            style={{
              transform: transforms[depth],
              zIndex: isFront ? 30 : 10 + depth,
            }}
            aria-hidden={!isFront}
          >
            <Image
              src={page.src}
              alt={isFront ? page.alt : ""}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 80vw, 420px"
              priority={depth === 2}
            />
          </div>
        )
      })}
      <div className="absolute -bottom-1 left-1/2 z-40 flex -translate-x-1/2 gap-1.5">
        {PDF_PAGES.map((page, index) => (
          <button
            key={page.src}
            type="button"
            aria-label={`Show sample page ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === active ? "w-4 bg-brand" : "w-1.5 bg-ink/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export function DigitalFootprintLanding() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hero — tighter under header */}
      <section className="relative isolate overflow-hidden bg-cream pt-20 pb-16 md:pt-24 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(42,102,255,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(198,136,9,0.07),_transparent_50%)]"
        />
        <div className="page-shell relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="text-center lg:text-left">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
                Free Digital Footprint report
              </p>
              <h1 className="mt-3 text-[2.35rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:mt-4 md:text-[3.25rem] md:leading-[1.05]">
                See your business the way a{" "}
                <span className="text-gold">first-time customer</span> already does.
              </h1>
              <p className="mx-auto mt-5 max-w-[22rem] text-[16px] font-medium leading-[1.4] text-ink/75 sm:max-w-md lg:mx-0 md:text-[18px]">
                A free written report on your website, socials, ads, and reviews —
                so you know what’s working and what to fix first.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-[16px] font-medium text-white hover:bg-brand-hover"
                >
                  Get your report
                </button>
                <p className="max-w-sm text-[13px] font-medium text-ink/50 lg:max-w-none">
                  About a minute to request. In your inbox in under 5 minutes.
                </p>
                <p className="text-[13px] font-semibold text-ink/70">
                  Requested by over 5,000 business owners
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink/45 lg:justify-start">
                <span>Free</span>
                <span className="text-ink/20">·</span>
                <span>No login</span>
                <span className="text-ink/20">·</span>
                <span>No call required</span>
              </div>
            </div>

            <div className="pb-6 md:pb-2">
              <PdfStack />
              <p className="mt-8 text-center text-[12px] text-ink/40 lg:text-left">
                Sample pages. Numbers for illustration.
              </p>
              {/* Quiet half-step: stack already proves shape; no dedicated section */}
              <p className="mt-2 text-center text-[12px] lg:text-left">
                <Link
                  href="/report/example"
                  className="font-medium text-ink/45 underline-offset-4 hover:text-ink hover:underline"
                >
                  View a full sample report
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-y border-t border-black/[0.04] bg-white md:py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-[560px] text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">How it works</p>
            <h2 className="section-title mt-3 text-ink md:text-[2.5rem] md:leading-normal md:tracking-[-0.04em]">
              From questions to a written PDF.
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="rounded-[1.5rem] border border-black/[0.06] bg-cream px-6 py-7 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0"
              >
                <p className="text-[13px] font-medium text-gold-to">{step.n}</p>
                <p className="mt-2 inline-flex rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
                  {step.time}
                </p>
                <h3 className="mt-3 text-[1.35rem] font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What’s inside */}
      <section className="section-y bg-cream md:py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-[560px] text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">What’s inside</p>
            <h2 className="section-title mt-3 text-ink md:text-[2.5rem] md:leading-normal md:tracking-[-0.04em]">
              Four chapters about your business.
            </h2>
            <p className="section-lede mx-auto mt-4 max-w-md text-ink/70">
              Grey lines are examples. Yours names your site and your first fix.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-[920px] gap-4 md:mt-14 md:grid-cols-2">
            {CHAPTERS.map((item) => (
              <div
                key={item.n}
                className="rounded-[1.5rem] border border-black/[0.06] bg-white px-6 py-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.2)]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[12px] font-semibold text-ink/35">{item.n}</span>
                  <span className="text-[16px] font-semibold text-ink">{item.title}</span>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{item.body}</p>
                <p className="mt-3 text-[13px] text-slate-500">{exampleLine(item.sample)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-y bg-ink text-cream md:py-24">
        <div className="page-shell flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-[2rem] font-semibold tracking-tight md:text-[2.75rem] md:leading-tight">
            Get your report.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/70">
            About a minute to request. Written PDF on your website, socials, ads, and reviews —
            in your inbox in under 5 minutes.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-[16px] font-medium text-white hover:bg-brand-hover"
          >
            Get your report
          </button>
          <p className="mt-4 text-[13px] font-medium text-cream/50">
            Requested by over 5,000 business owners
          </p>
          <Link
            href="/partner"
            className="mt-6 text-[14px] font-medium text-cream/55 underline-offset-4 hover:text-cream hover:underline"
          >
            Or book a free 30-minute call
          </Link>
        </div>
      </section>

      <ReportPopup open={open} onClose={() => setOpen(false)} />
    </>
  )
}
