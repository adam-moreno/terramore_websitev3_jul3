"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { CALL_CONSENT_TEXT } from "@/lib/consent/call-consent"
import { BookingLink } from "@/components/booking-popup"
import {
  trackEvent,
  trackFunnelEvent,
  trackReportSubmissionError,
  trackReportSubmissionSuccess,
} from "@/lib/analytics"
import { captureAttributionFromUrl, mergedAttribution } from "@/lib/attribution"
import { fieldList, type ReportEntry, type ReportField } from "@/lib/funnel-taxonomy"

export type ReportAnswers = Record<string, string>

/** The fields checked on submit, in the order they appear, so focus goes to the first problem. */
type CheckedField = "website" | "first_name" | "last_name" | "email" | "consent"
const FIELD_ORDER: CheckedField[] = ["website", "first_name", "last_name", "email", "consent"]
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** One plain message per field, or nothing when it's fine. "email_format" is tracked apart from a missing email. */
function fieldProblem(field: CheckedField, v: { website: string; firstName: string; lastName: string; email: string; consent: boolean }): { message: string; tracked: ReportField } | null {
  if (field === "website" && !v.website.trim()) return { message: "Enter your business website.", tracked: "website" }
  if (field === "first_name" && !v.firstName.trim()) return { message: "Enter your first name.", tracked: "first_name" }
  if (field === "last_name" && !v.lastName.trim()) return { message: "Enter your last name.", tracked: "last_name" }
  if (field === "email" && !v.email.trim()) return { message: "Enter your email so the report reaches you.", tracked: "email" }
  if (field === "email" && !EMAIL_FORMAT.test(v.email.trim())) return { message: "Enter an email like name@example.com.", tracked: "email_format" }
  if (field === "consent" && !v.consent) return { message: "Tick the box so we can email your report.", tracked: "consent" }
  return null
}

/** Merge URL params onto stored attribution, then return the merged set. Never replaces the whole object. */
function readAttribution(): Record<string, string> {
  captureAttributionFromUrl()
  return mergedAttribution()
}

export function ReportForm({
  className = "",
  onCancel,
  onSuccess,
  answers,
  plain = false,
  initialWebsite,
  entry = "popup_questions",
  startFix,
}: {
  className?: string
  onCancel?: () => void
  /** Called after server 201 and conversion tracking. Parent shows confirmation + home redirect. */
  /** textRef: the "Tap to text us" code for this report, when the server minted one. */
  onSuccess?: (result?: { textRef: string | null; firstName: string; businessName: string }) => void
  answers?: ReportAnswers
  plain?: boolean
  /** Optional prefill (e.g. the /solutions website input). Does not change submit or tracking behavior. */
  initialWebsite?: string
  /** How the popup opened, for the V2A report_progress / report_validation_error events. */
  entry?: ReportEntry
  /** The gap the visitor tapped "Fix this" on (lib/report/start-fix.ts); the report opens on it. */
  startFix?: string | null
}) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState(initialWebsite ?? "")
  const [socials, setSocials] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [consent, setConsent] = useState(false)
  /** Separate, optional, unchecked: texts only go to people who tick it (TCPA). */
  const [smsConsent, setSmsConsent] = useState(false)
  /** Separate, optional, unchecked: the only path to an automated or AI call (lib/consent/call-consent.ts). */
  const [callConsent, setCallConsent] = useState(false)
  const [error, setError] = useState("")
  /** Per-field messages, shown after a submit attempt and cleared as soon as that field is fixed. */
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CheckedField, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const [busy, setBusy] = useState(false)
  const [started, setStarted] = useState(false)
  const [alreadyRequested, setAlreadyRequested] = useState(false)

  useEffect(() => {
    readAttribution()
  }, [])

  useEffect(() => {
    if (!started) return
    trackEvent("form_start", { form_id: "digital_footprint_report" })
  }, [started])

  // With the qualifying questions, the first answer was the start; the direct form starts at first focus.
  useEffect(() => {
    if (started && entry !== "popup_questions") trackFunnelEvent("report_progress", { step: "started", entry })
  }, [started, entry])

  const requiredCompleteRef = useRef(false)
  const requiredComplete = Boolean(firstName.trim() && lastName.trim() && email.trim() && website.trim() && consent)
  const values = { website, firstName, lastName, email, consent }

  // Once a message is showing, it goes the moment the field is valid (not on blur, never before a submit attempt).
  useEffect(() => {
    setFieldErrors((current) => {
      const shown = Object.keys(current) as CheckedField[]
      if (!shown.length) return current
      const next: Partial<Record<CheckedField, string>> = {}
      for (const field of shown) {
        const problem = fieldProblem(field, { website, firstName, lastName, email, consent })
        if (problem) next[field] = problem.message
      }
      return Object.keys(next).length === shown.length ? current : next
    })
  }, [website, firstName, lastName, email, consent])
  useEffect(() => {
    if (!requiredComplete || requiredCompleteRef.current) return
    requiredCompleteRef.current = true
    trackFunnelEvent("report_progress", { step: "required_complete", entry })
  }, [requiredComplete, entry])

  const markStarted = () => {
    if (!started) setStarted(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setAlreadyRequested(false)

    // Our own check, not the browser's bubbles: each problem is said under its field, and focus goes to the first.
    const problems = FIELD_ORDER.map((field) => ({ field, problem: fieldProblem(field, values) })).filter(
      (p): p is { field: CheckedField; problem: { message: string; tracked: ReportField } } => p.problem !== null,
    )
    if (problems.length) {
      trackFunnelEvent("report_validation_error", { fields: fieldList(problems.map((p) => p.problem.tracked)), entry })
      setFieldErrors(Object.fromEntries(problems.map((p) => [p.field, p.problem.message])))
      const inputs = Array.from(formRef.current?.querySelectorAll<HTMLInputElement>("input") ?? [])
      inputs.find((input) => input.dataset.field === problems[0].field)?.focus()
      return
    }
    setFieldErrors({})

    trackFunnelEvent("report_progress", { step: "submit_attempt", entry })
    setBusy(true)
    try {
      const attribution = readAttribution()
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email,
          phone: phone.trim() || undefined,
          smsConsent: Boolean(phone.trim()) && smsConsent,
          callConsent: Boolean(phone.trim()) && callConsent,
          page: typeof window !== "undefined" ? window.location.href : undefined,
          website,
          socials: socials.trim() || undefined,
          businessName,
          answers,
          attribution,
          ...(startFix ? { fix: startFix } : {}),
        }),
      })

      if (response.status === 409) {
        const dup = (await response.json().catch(() => ({}))) as { retryTomorrow?: unknown; inProgress?: unknown }
        setAlreadyRequested(true)
        setError(
          dup.inProgress === true
            ? "Your report is being written now. It reaches your inbox within a few minutes."
            : dup.retryTomorrow === true
              ? "We sent your report in the last day. Check your inbox; you can ask for a fresh one tomorrow."
              : "Already requested. Check your inbox for the report, or talk with us if you need another copy.",
        )
        trackReportSubmissionError("already_requested")
        setBusy(false)
        return
      }

      if (!response.ok) {
        trackReportSubmissionError("server_error")
        setError("We could not send that just now. Try again, or talk with us.")
        setBusy(false)
        return
      }

      // Safe conversion point: the server saved the row (saved + reportRef), not just any 2xx. Fires generate_lead +
      // report_submission_success once per reportRef, plus existing Ads "Digital Footprint Report Submitted" only.
      // No PII. Do not fire on button click, failed/duplicate responses, or a 2xx without a saved row.
      const data = (await response.json().catch(() => ({}))) as { saved?: unknown; reportRef?: unknown; refreshed?: unknown; textRef?: unknown }
      const textResult = { textRef: typeof data.textRef === "string" && /^[A-HJ-NP-Z2-9]{5}$/.test(data.textRef) ? data.textRef : null, firstName: firstName.trim(), businessName: businessName.trim() }
      // A returning owner's fresh report: same confirmation, but not a new lead, so no conversion.
      if (data.refreshed === true) {
        onSuccess?.(textResult)
        return
      }
      const reportRef = data.saved === true && typeof data.reportRef === "string" && /^[a-f0-9]{32}$/.test(data.reportRef) ? data.reportRef : ""
      if (reportRef) trackReportSubmissionSuccess("report_form", reportRef)
      else trackReportSubmissionError("not_saved")
      onSuccess?.(textResult)
    } catch {
      setError("We could not send that just now. Try again, or talk with us.")
      trackReportSubmissionError("network_or_client")
      setBusy(false)
    }
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className={`space-y-4 ${
        plain ? "" : "rounded-[1.75rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9"
      } ${className}`}
    >
      {plain ? null : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-semibold text-ink">Get my free Digital Footprint report</p>
          {onCancel ? (
            <button type="button" onClick={onCancel} className="text-[13px] font-medium text-slate-400 hover:text-ink">
              Close
            </button>
          ) : null}
        </div>
      )}
      <p className="text-[14px] leading-relaxed text-slate-600">
        We need your site so we can read the footprint, and an email so the file reaches you. In your inbox in minutes.
      </p>
      <div>
        <label className="block">
          <span className="text-[13px] font-medium text-ink">Business website</span>
          <input
            required
            data-field="website"
            aria-invalid={fieldErrors.website ? true : undefined}
            aria-describedby={fieldErrors.website ? "report-website-error" : undefined}
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://"
            className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
            autoComplete="url"
          />
        </label>
        <FieldError id="report-website-error" message={fieldErrors.website} />
      </div>
      <label className="block">
        <span className="text-[13px] font-medium text-ink">
          Socials <span className="font-normal text-ink/40">(optional)</span>
        </span>
        <input
          value={socials}
          onChange={(event) => setSocials(event.target.value)}
          placeholder="Instagram, Facebook, or LinkedIn URL"
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-medium text-ink">
          Business name <span className="font-normal text-ink/40">(optional)</span>
        </span>
        <input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="organization"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block">
            <span className="text-[13px] font-medium text-ink">First name</span>
            <input
              required
              data-field="first_name"
              aria-invalid={fieldErrors.first_name ? true : undefined}
              aria-describedby={fieldErrors.first_name ? "report-first_name-error" : undefined}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
              autoComplete="given-name"
            />
          </label>
          <FieldError id="report-first_name-error" message={fieldErrors.first_name} />
        </div>
        <div>
          <label className="block">
            <span className="text-[13px] font-medium text-ink">Last name</span>
            <input
              required
              data-field="last_name"
              aria-invalid={fieldErrors.last_name ? true : undefined}
              aria-describedby={fieldErrors.last_name ? "report-last_name-error" : undefined}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
              autoComplete="family-name"
            />
          </label>
          <FieldError id="report-last_name-error" message={fieldErrors.last_name} />
        </div>
      </div>
      <div>
        <label className="block">
          <span className="text-[13px] font-medium text-ink">Email</span>
          <input
            required
            type="email"
            data-field="email"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "report-email-error" : undefined}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
            autoComplete="email"
          />
        </label>
        <FieldError id="report-email-error" message={fieldErrors.email} />
      </div>
      <label className="block">
        <span className="text-[13px] font-medium text-ink">
          Phone <span className="font-normal text-ink/40">(optional)</span>
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="tel"
        />
      </label>
      <div>
        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/70">
          <input
            type="checkbox"
            required
            data-field="consent"
            aria-invalid={fieldErrors.consent ? true : undefined}
            aria-describedby={fieldErrors.consent ? "report-consent-error" : undefined}
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1"
          />
          <span>Email me my report and occasional tips. You can unsubscribe any time.</span>
        </label>
        <FieldError id="report-consent-error" message={fieldErrors.consent} />
      </div>
      {phone.trim() ? (
        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/70">
          <input type="checkbox" checked={smsConsent} onChange={(event) => setSmsConsent(event.target.checked)} className="mt-1" />
          <span>
            Text me about my report and booking. Optional. Message frequency varies; msg &amp; data rates may apply. Reply
            STOP to opt out, HELP for help. Consent isn&apos;t required to buy anything. See our{" "}
            <a href="/terms#text-messages" className="underline underline-offset-2 hover:text-ink">text terms</a> and{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy policy</a>.
          </span>
        </label>
      ) : null}
      {phone.trim() ? (
        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/70">
          <input
            type="checkbox"
            checked={callConsent}
            onChange={(event) => setCallConsent(event.target.checked)}
            className="mt-1"
          />
          <span>
            {CALL_CONSENT_TEXT} See our{" "}
            <a href="/terms#ai-phone-assistant" className="underline underline-offset-2 hover:text-ink">phone terms</a> and{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy policy</a>.
          </span>
        </label>
      ) : null}
      {error ? (
        <p className={`text-[14px] ${alreadyRequested ? "text-ink/80" : "text-red-600"}`} role="alert">
          {error}
          {alreadyRequested ? (
            <>
              {" "}
              <BookingLink source="report" ctaId="report_duplicate_book" className="font-medium text-brand hover:text-brand-hover">
                Book a free call
              </BookingLink>
              .
            </>
          ) : null}
        </p>
      ) : null}
      {/* Disabled until a website is entered — the report can't run without it. */}
      <button
        type="submit"
        disabled={busy || !website.trim()}
        title={!website.trim() ? "Enter your business website first" : undefined}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Sending…" : website.trim() ? "Get my free Digital Footprint report" : "Enter your website to get the report"}
      </button>
    </form>
  )
}

/** A field's message, right under it; announced when it appears and linked to the field by aria-describedby. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <span id={id} role="alert" className="mt-1.5 block text-[14px] text-red-600">
      {message}
    </span>
  )
}
