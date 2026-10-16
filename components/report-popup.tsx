"use client"

import { TextUsButton } from "@/components/text-us-button"
import { textBody } from "@/lib/sms/text-link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { ReportForm, type ReportAnswers } from "@/components/report-form"
import { useCtaView } from "@/hooks/use-cta-view"
import { takeReportCta, trackCtaClick, trackFunnelEvent } from "@/lib/analytics"
import type { CtaId, ReportEntry } from "@/lib/funnel-taxonomy"
import { GROWTH_WORKSPACE_URL } from "@/lib/growth-workspace"

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

/**
 * Readiness (owner decision 2026-10-11): how soon, and how they'd like to get there. Asked on every entry, so the team
 * can call people who want results now first. Visitors from the instant check skip the two business questions above
 * (the check already knows the business), so they answer three taps; everyone else answers five.
 */
const READINESS = [
  {
    key: "when",
    prompt: "How soon do you want results?",
    options: [
      { value: "month", label: "This month" },
      { value: "quarter", label: "In the next few months" },
      { value: "exploring", label: "Just exploring" },
    ],
    reassure: "Good to know. We'll pace your plan to match.",
  },
  {
    key: "how",
    prompt: "How would you like to get there?",
    options: [
      { value: "self", label: "Do it myself" },
      { value: "help", label: "With some help" },
      { value: "done", label: "Have it done for me" },
    ],
    reassure: "Thanks. Your plan will fit how you like to work.",
  },
  {
    // Owner decision 2026-10-12: the report's effort and "who does it" depend on who can change the website.
    key: "site",
    prompt: "Who updates your website?",
    options: [
      { value: "self", label: "I do" },
      { value: "someone", label: "Someone else does" },
      { value: "unsure", label: "Not sure" },
    ],
    reassure: "Got it. Every fix in your report will say who can do it and how long it takes.",
  },
] as const

const REASSURE_MS = 750

export function ReportPopup({
  open,
  onClose,
  website,
  direct = false,
  description,
  entry: entryOverride,
  startFix,
}: {
  open: boolean
  onClose: () => void
  /** Optional website prefill passed through to the report form. */
  website?: string
  /** Skip the qualifying questions and go straight to the details form
      (used on the /book ads landing page). Also stays on the page after
      success instead of redirecting home. */
  direct?: boolean
  /** Optional header copy override (display only). */
  description?: string
  /** Funnel entry when it isn't implied by `direct`, e.g. "popup_lookup" after a business lookup. */
  entry?: ReportEntry
  /** The gap the visitor tapped "Fix this" on; sent with the request so the report opens on it. */
  startFix?: string | null
}) {
  const router = useRouter()
  /** Every report entry, direct ones included, hands off to the Growth Workspace when it's configured. */
  const workspaceUrl = GROWTH_WORKSPACE_URL
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<ReportAnswers>({})
  const [picked, setPicked] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [textInfo, setTextInfo] = useState<{ textRef: string | null; firstName: string; businessName: string } | null>(null)

  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const successRef = useRef(success)
  successRef.current = success
  const entry: ReportEntry = entryOverride ?? (direct ? "popup_direct" : "popup_questions")
  const questions = direct ? READINESS : [...QUESTIONS, ...READINESS]
  /** The success state's main action. Focus moves here when the report is requested, so keyboard and screen-reader users land on the next step. */
  const successActionRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const detailsShownRef = useRef(false)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!open) return
    detailsShownRef.current = false
    const ctaId = takeReportCta()
    trackFunnelEvent("report_view", ctaId ? { entry, cta_id: ctaId } : { entry })
  }, [open, entry])

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current
    wasOpenRef.current = open
    if (!open || success || detailsShownRef.current) return
    // On reopen the first render still holds the previous step until the reset effect below lands.
    if (justOpened || step < questions.length) return
    detailsShownRef.current = true
    trackFunnelEvent("report_progress", { step: "details_shown", entry })
  }, [open, success, step, entry, questions.length])

  const goHome = () => {
    closeRef.current()
    if (!direct) router.push("/")
  }

  useEffect(() => {
    if (!open) return
    setStep(0)
    setAnswers({})
    setPicked(null)
    setSuccess(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (successRef.current && !direct) {
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
    if (success) successActionRef.current?.focus()
  }, [success])


  useEffect(() => {
    if (picked === null) return
    const id = window.setTimeout(() => {
      setPicked(null)
      setStep((current) => current + 1)
    }, REASSURE_MS)
    return () => window.clearTimeout(id)
  }, [picked])

  if (!open || typeof document === "undefined") return null

  const question = !success && step < questions.length ? questions[step] : null

  const choose = (key: string, value: string) => {
    if (picked !== null) return
    if (step === 0) trackFunnelEvent("report_progress", { step: "started", entry })
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
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/70">Digital Footprint report</p>
            <p className="mt-3 text-[1.35rem] font-semibold tracking-tight text-ink">Your report is on the way.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              We&apos;re preparing it now. In your inbox in minutes.
            </p>
            {/* Inbound-first texting: the owner texts us, then we can text them (lib/sms/text-link.ts). */}
            <div className="mt-5 rounded-2xl border border-ink/10 px-5 py-4">
              <TextUsButton
                placement="report_success"
                intro="Want updates by text too?"
                label="Tap to text us"
                body={textBody("report", { firstName: textInfo?.firstName, business: textInfo?.businessName, code: textInfo?.textRef })}
              />
            </div>
            {workspaceUrl ? (
              <>
                <div className="mt-6 rounded-2xl bg-cream px-5 py-5 text-left">
                  <p className="text-[15px] leading-relaxed text-ink/80">
                    We&apos;ve mapped what customers can see. Add a few business numbers to see what happens after they contact you.
                  </p>
                  <a
                    ref={successActionRef}
                    href={workspaceUrl}
                    onClick={() => trackFunnelEvent("workspace_cta_click", { entry })}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-4 py-2 text-center text-[15px] font-medium leading-snug text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Open My Growth Workspace
                  </a>
                </div>
                <a
                  href="/book"
                  onClick={() => trackFunnelEvent("report_success_book_click", { entry })}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink/15 px-4 text-[15px] font-medium text-ink hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Or book a free call to walk through it
                </a>
                <button
                  type="button"
                  onClick={goHome}
                  className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-full text-[15px] font-medium text-ink/70 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  ref={successActionRef}
                  type="button"
                  onClick={goHome}
                  className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Done
                </button>
                <a
                  href="/book"
                  onClick={() => trackFunnelEvent("report_success_book_click", { entry })}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-[15px] font-medium text-ink underline underline-offset-4"
                >
                  Or book a free call to walk through it
                </a>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 px-7 pt-7 md:px-9 md:pt-9">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/70">Free Digital Footprint report</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                  {description ??
                    (direct
                      ? "Three quick taps, then your details. In your inbox in minutes."
                      : "Five quick taps, then your details. In your inbox in minutes.")}
                </p>
              </div>
              <button type="button" onClick={onClose} className="shrink-0 text-[13px] font-medium text-ink/70 hover:text-ink">
                Close
              </button>
            </div>

            {question ? (
              <div className="px-7 pb-7 pt-6 md:px-9 md:pb-9" key={question.key}>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-brand">
                    {step + 1} of {questions.length}
                  </span>
                  <div className="flex flex-1 gap-1.5">
                    {questions.map((item, index) => (
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
                {(
                  <>
                    <p className="text-[12px] font-semibold text-brand">Last step</p>
                    <p className="mt-2 text-[1.2rem] font-semibold tracking-tight text-ink">Where should the report go?</p>
                  </>
                )}
                <ReportForm plain className={direct ? "" : "mt-4"} answers={answers} initialWebsite={website} entry={entry} startFix={startFix} onSuccess={(result) => {
                    setTextInfo(result ?? null)
                    setSuccess(true)
                  }} />
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
  direct = false,
  description,
  ctaId,
}: {
  label?: string
  children?: ReactNode
  className?: string
  /** Skip the qualifying questions — straight to the details form. */
  direct?: boolean
  /** Optional popup header copy override (display only). */
  description?: string
  /** Approved CTA id (lib/funnel-taxonomy.ts) for primary_cta_click / primary_cta_view. Optional. */
  ctaId?: CtaId
}) {
  const [open, setOpen] = useState(false)
  const viewRef = useCtaView<HTMLButtonElement>(ctaId)

  return (
    <>
      <button
        ref={viewRef}
        type="button"
        onClick={() => {
          if (ctaId) trackCtaClick(ctaId)
          setOpen(true)
        }}
        className={className}
      >
        {children ?? label}
      </button>
      <ReportPopup open={open} onClose={() => setOpen(false)} direct={direct} description={description} />
    </>
  )
}
