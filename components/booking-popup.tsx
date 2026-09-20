"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BookingFlow } from "@/components/booking-flow"

/** Modal booking flow. Same shell as ReportPopup: portal, z-[100], Escape and backdrop close, scroll lock. */
export function BookingPopup({
  open,
  onClose,
  source,
}: {
  open: boolean
  onClose: () => void
  /** Entry point tag passed to BookingFlow (analytics + Terra IQ note). Optional. */
  source?: string
}) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a call"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
    >
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,30,46,0.45)]">
        <div className="flex items-start justify-between gap-3 px-7 pt-7 md:px-9 md:pt-9">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/40">Book a call</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
              Free 30 minutes. A few questions, then a time that works — invite in your inbox.
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-[13px] font-medium text-slate-400 hover:text-ink">
            Close
          </button>
        </div>
        <div className="px-7 pb-7 pt-5 md:px-9 md:pb-9">
          <BookingFlow compact source={source} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export function BookingLink({
  label = "Pick a time",
  className = "inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover",
  children,
  onClick,
  source,
  "aria-label": ariaLabel,
}: {
  label?: string
  className?: string
  children?: React.ReactNode
  /** Fires when the button is clicked, before the popup opens (e.g. analytics). */
  onClick?: () => void
  /** Entry point tag: report | homepage | header | floating_cta | book. Optional. */
  source?: string
  "aria-label"?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => {
          onClick?.()
          setOpen(true)
        }}
        className={className}
      >
        {children ?? label}
      </button>
      <BookingPopup open={open} onClose={() => setOpen(false)} source={source} />
    </>
  )
}
