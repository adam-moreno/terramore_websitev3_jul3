"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { ReportForm, type ReportAnswers } from "@/components/report-form"

const QUESTIONS = [
  {
    key: "type",
    prompt: "Which is closest to your business?",
    options: [
      { value: "service", label: "Service business" },
      { value: "ecommerce", label: "Ecommerce" },
      { value: "professional", label: "Professional services" },
      { value: "local", label: "Local business" },
      { value: "other", label: "Other" },
    ],
    reassure: "Got it. We read the footprint the way your customers find it.",
  },
  {
    key: "challenge",
    prompt: "What is the biggest growth challenge right now?",
    options: [
      { value: "leads", label: "Getting more leads" },
      { value: "converting", label: "Converting more leads" },
      { value: "follow_up", label: "Following up with leads" },
      { value: "visibility", label: "Marketing / visibility" },
      { value: "sales", label: "Sales process" },
      { value: "ops", label: "Operations / automation" },
      { value: "unsure", label: "Not sure" },
    ],
    reassure: "Thanks. That tells us what to look for first.",
  },
] as const

const REASSURE_MS = 750
const SUCCESS_REDIRECT_MS = 3000

export function ReportPopup({
  open,
  onClose,
  website,
}: {
  open: boolean
  onClose: () => void
  /** Optional website prefill passed through to the report form. */
  website?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<ReportAnswers>({})
  const [picked, setPicked] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const successRef = useRef(success)
  successRef.current = success

  const goHome = () => {
    closeRef.current()
    router.push("/")
  }

  useEffect(() => {
    if (!open) return
    setStep(0)
    setAnswers({})
    setPicked(null)
    setSuccess(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (successRef.current) {
        closeRef.current()
        router.push("/")
        return
      }
      closeRef.current()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, router])

  useEffect(() => {
    if (!success) return
    const id = window.setTimeout(() => {
      closeRef.current()
      router.push("/")
    }, SUCCESS_REDIRECT_MS)
    return () => window.clearTimeout(id)
  }, [success, router])

  useEffect(() => {
    if (picked === null) return
    const id = window.setTimeout(() => {
      setPicked(null)
      setStep((current) => current + 1)
    }, REASSURE_MS)
    return () => window.clearTimeout(id)
  }, [picked])

  if (!open || typeof document === "undefined") return null

  const question = !success && step < QUESTIONS.length ? QUESTIONS[step] : null

  const choose = (key: string, value: string) => {
    if (picked !== null) return
    setAnswers((current) => ({ ...current, [key]: value }))
    setPicked(value)
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={success ? "Report requested" : "Free Digital Footprint report"}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={success ? goHome : onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,30,46,0.45)]">
        {success ? (
          <div className="px-7 py-8 text-center md:px-9 md:py-10">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/40">Digital Footprint report</p>
            <p className="mt-3 text-[1.35rem] font-semibold tracking-tight text-ink">Your report is on the way.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              We&apos;re preparing it now. In your inbox in minutes.
            </p>
            <button
              type="button"
              onClick={goHome}
              className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white hover:bg-brand-hover"
            >
              Done
            </button>
            <p className="mt-3 text-[13px] text-slate-400">Taking you home in a moment…</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 px-7 pt-7 md:px-9 md:pt-9">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/40">Free Digital Footprint report</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                  Two quick questions, then your details. In your inbox in minutes.
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
                        className={`min-h-12 rounded-full border px-5 py-3 text-left text-[15px] font-medium transition ${
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
                <p className="mt-2 text-[1.2rem] font-semibold tracking-tight text-ink">Where should the report go?</p>
                <ReportForm plain className="mt-4" answers={answers} initialWebsite={website} onSuccess={() => setSuccess(true)} />
              </div>
            )}
          </>
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
