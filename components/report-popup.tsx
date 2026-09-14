"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { ReportForm, type ReportAnswers } from "@/components/report-form"

const QUESTIONS = [
  {
    key: "site",
    prompt: "Do you have a website or online store today?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "not_yet", label: "Not yet" },
    ],
    reassure: "Good. That tells us where to look first.",
  },
  {
    key: "type",
    prompt: "Which is closest to your business?",
    options: [
      { value: "online_store", label: "Online store" },
      { value: "local", label: "Local shop or service" },
      { value: "clinic", label: "Clinic or practice" },
      { value: "other", label: "Something else" },
    ],
    reassure: "Got it. We read the footprint the way your customers find it.",
  },
  {
    key: "marketing",
    prompt: "Are you running any ads or sending emails right now?",
    options: [
      { value: "both", label: "Yes, both" },
      { value: "one", label: "One of them" },
      { value: "not_yet", label: "Not yet" },
    ],
    reassure: "Thanks. Now we know where the first fix likely is.",
  },
] as const

const REASSURE_MS = 750

export function ReportPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<ReportAnswers>({})
  const [picked, setPicked] = useState<string | null>(null)

  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    setStep(0)
    setAnswers({})
    setPicked(null)
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

  useEffect(() => {
    if (picked === null) return
    const id = window.setTimeout(() => {
      setPicked(null)
      setStep((current) => current + 1)
    }, REASSURE_MS)
    return () => window.clearTimeout(id)
  }, [picked])

  if (!open || typeof document === "undefined") return null

  const question = step < QUESTIONS.length ? QUESTIONS[step] : null

  const choose = (key: string, value: string) => {
    if (picked !== null) return
    setAnswers((current) => ({ ...current, [key]: value }))
    setPicked(value)
  }

  // Portal to body so the modal is never nested inside a <p> or a parent stacking context.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Free Digital Footprint report"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
    >
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,30,46,0.45)]">
        <div className="flex items-start justify-between gap-3 px-7 pt-7 md:px-9 md:pt-9">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/40">Free Digital Footprint report</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
              Three quick questions, then we read your business and send the file in two to three business days.
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-[13px] font-medium text-slate-400 hover:text-ink">
            Close
          </button>
        </div>

        {question ? (
          <div className="px-7 pb-7 pt-6 md:px-9 md:pb-9" key={question.key}>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold text-brand">
                {step + 1} of {QUESTIONS.length}
              </span>
              <div className="flex flex-1 gap-1.5">
                {QUESTIONS.map((item, index) => (
                  <span
                    key={item.key}
                    className={`h-1 flex-1 rounded-full ${index <= step ? "bg-brand" : "bg-ink/10"}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-4 text-[1.2rem] font-semibold tracking-tight text-ink">{question.prompt}</p>
            <div className="mt-5 grid gap-2">
              {question.options.map((option) => {
                const on = picked === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => choose(question.key, option.value)}
                    disabled={picked !== null}
                    className={`h-12 rounded-full border px-5 text-left text-[15px] font-medium transition ${
                      on
                        ? "border-brand bg-brand text-white"
                        : "border-ink/10 bg-cream text-ink hover:border-brand/40 hover:bg-white disabled:opacity-50"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <p className={`mt-4 min-h-[1.5rem] text-[14px] text-slate-500 transition-opacity ${picked ? "opacity-100" : "opacity-0"}`}>
              {question.reassure}
            </p>
          </div>
        ) : (
          <div className="px-7 pb-7 pt-6 md:px-9 md:pb-9">
            <p className="text-[12px] font-semibold text-brand">Last step</p>
            <p className="mt-2 text-[1.2rem] font-semibold tracking-tight text-ink">Where should the file go?</p>
            <ReportForm plain className="mt-4" answers={answers} />
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export function ReportPopupLink({
  label = "Or get a free Digital Footprint report",
  children,
  className = "text-[14px] font-medium text-ink/50 underline-offset-4 hover:text-ink hover:underline",
}: {
  label?: string
  children?: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children ?? label}
      </button>
      <ReportPopup open={open} onClose={() => setOpen(false)} />
    </>
  )
}
