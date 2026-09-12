"use client"

import { useEffect, useState } from "react"

// What we read, in the order a stranger would find it.
const SOURCES = ["Site", "Ads", "Maps", "Listings", "Email"] as const

// What comes back, one line at a time. Sample values are Northline Atelier, the sample report.
const FINDINGS = [
  { label: "Discoverability", value: "Live in 3 of 6 places", meter: { kind: "dots", on: 3, of: 6 } },
  { label: "Number of stores", value: "2 stores. Prices match in 1.", meter: { kind: "dots", on: 1, of: 2 } },
  { label: "Current highlights", value: "Mobile checkout finishes. First-buy email lands.", meter: { kind: "bar", pct: 78 } },
  { label: "Ad wins", value: "Meta return ads pay 3.1x", meter: { kind: "bar", pct: 62 } },
  { label: "Who buys", value: "Women 32 to 46. Soft Knit Set.", meter: { kind: "bar", pct: 54 } },
  { label: "Where cash leaks", value: "61% leave at shipping on mobile", meter: { kind: "bar", pct: 61, warn: true } },
] as const

const STEP_MS = 950
const HOLD_STEPS = 4
const TOTAL_STEPS = FINDINGS.length + HOLD_STEPS

export function ReportScanVisual() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % TOTAL_STEPS)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [])

  const reading = step < FINDINGS.length
  const shown = Math.min(step + 1, FINDINGS.length)
  const sourceOn = reading ? step % SOURCES.length : -1

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">What we read</p>
        <p className="flex items-center gap-1.5 text-[11px] text-cream/55">
          <span className={`h-1.5 w-1.5 rounded-full ${reading ? "software-pulse-dot bg-gold" : "bg-[#3ddc97]"}`} />
          {reading ? "Reading…" : "Written by a person"}
        </p>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {SOURCES.map((source, index) => (
          <span
            key={source}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-300 ${
              index === sourceOn
                ? "bg-cream text-ink"
                : reading && index < sourceOn
                  ? "bg-cream/20 text-cream"
                  : !reading
                    ? "bg-cream/20 text-cream"
                    : "bg-cream/[0.08] text-cream/50"
            }`}
          >
            {source}
          </span>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-1.5">
        {FINDINGS.slice(0, shown).map((item) => {
          const meter = item.meter
          const warn = "warn" in meter && meter.warn
          return (
            <div
              key={item.label}
              className="software-track-row-in rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/[0.06]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-cream/50">{item.label}</p>
                {meter.kind === "dots" ? (
                  <span className="flex items-center gap-1">
                    {Array.from({ length: meter.of }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full ${index < meter.on ? "bg-gold" : "bg-white/15"}`}
                      />
                    ))}
                  </span>
                ) : (
                  <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-white/15">
                    <span
                      className={`report-meter-fill absolute inset-y-0 left-0 rounded-full ${warn ? "bg-[#ff7a59]" : "bg-gold"}`}
                      style={{ width: `${meter.pct}%` }}
                    />
                  </span>
                )}
              </div>
              <p className={`mt-0.5 text-[13px] font-semibold leading-snug ${warn ? "text-[#ffb59e]" : "text-cream"}`}>
                {item.value}
              </p>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[11px] text-cream/45">Sample lines from the Northline Atelier report. Yours reads your business.</p>
    </div>
  )
}
