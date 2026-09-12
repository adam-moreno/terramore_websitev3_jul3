"use client"

import { useEffect } from "react"

interface CalendlyWidgetProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Small booking card. Calendly owns the rules: 30 minutes, 7am to 8pm Pacific, two hours notice.
 * Those are set on the event type in the Calendly account, so nothing here picks days or times.
 */
export const CALENDLY_URL = "https://calendly.com/terramore/30min"

const EMBED_URL = `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=0f1e2e&primary_color=2a66ff`

export function CalendlyWidget({ isOpen, onClose }: CalendlyWidgetProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-end p-4">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="relative flex h-[min(640px,calc(100vh-2rem))] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 pb-3 pt-4">
          <div className="h-11 w-11 overflow-hidden rounded-full border border-black/[0.06] bg-[#f4efe4]">
            <img
              src="/founder/adam-moreno-cartoon.png?v=2"
              alt="Adam Moreno"
              className="h-full w-full object-cover object-top"
              loading="eager"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">Talk with Adam</p>
            <p className="text-[12px] text-slate-500">30 minutes. 7am to 8pm Pacific. Pick a time below.</p>
          </div>
        </div>

        <iframe
          src={EMBED_URL}
          className="min-h-0 w-full flex-1 border-0"
          title="Pick a time with Terramore"
          loading="eager"
        />

        <div className="border-t border-black/[0.06] px-4 py-2 text-center">
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="text-[12px] text-slate-500 hover:text-ink">
            Open the calendar in a new tab
          </a>
        </div>
      </div>
    </div>
  )
}
