"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import {
  trackEvent,
  trackReportSubmissionError,
  trackReportSubmissionSuccess,
} from "@/lib/analytics"

export type ReportAnswers = Record<string, string>

const ATTR_STORAGE_KEY = "tm_report_attribution"
const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
] as const

function readAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const fromUrl: Record<string, string> = {}
  for (const key of ATTR_KEYS) {
    const value = params.get(key)?.trim()
    if (value) fromUrl[key] = value
  }
  if (Object.keys(fromUrl).length > 0) {
    try {
      sessionStorage.setItem(ATTR_STORAGE_KEY, JSON.stringify(fromUrl))
    } catch {
      /* ignore quota / private mode */
    }
    return fromUrl
  }
  try {
    const raw = sessionStorage.getItem(ATTR_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: Record<string, string> = {}
    for (const key of ATTR_KEYS) {
      const value = parsed[key]
      if (typeof value === "string" && value.trim()) out[key] = value.trim()
    }
    return out
  } catch {
    return {}
  }
}

export function ReportForm({
  className = "",
  onCancel,
  onSuccess,
  answers,
  plain = false,
}: {
  className?: string
  onCancel?: () => void
  /** Called after server 201 and conversion tracking. Parent shows confirmation + home redirect. */
  onSuccess?: () => void
  answers?: ReportAnswers
  plain?: boolean
}) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [socials, setSocials] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState("")
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

  const markStarted = () => {
    if (!started) setStarted(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setAlreadyRequested(false)

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !website.trim() || !consent) {
      setError("First name, last name, email, website, and consent are required.")
      return
    }

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
          website,
          socials: socials.trim() || undefined,
          businessName,
          answers,
          attribution,
        }),
      })

      if (response.status === 409) {
        setAlreadyRequested(true)
        setError("Already requested. Check your inbox for the report, or talk with us if you need another copy.")
        trackReportSubmissionError("already_requested")
        setBusy(false)
        return
      }

      if (!response.ok) {
        trackReportSubmissionError("server_error")
        throw new Error("Could not save the request")
      }

      // Safe conversion point: POST /api/report succeeded (not 409). Fires generate_lead +
      // report_submission_success once, plus existing Ads "Digital Footprint Report Submitted" only.
      // No PII. Do not fire on button click or failed/duplicate responses.
      trackReportSubmissionSuccess("report_form")
      onSuccess?.()
    } catch {
      setError("We could not send that just now. Try again, or talk with us.")
      trackReportSubmissionError("network_or_client")
      setBusy(false)
    }
  }

  return (
    <form
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
      <label className="block">
        <span className="text-[13px] font-medium text-ink">Business website</span>
        <input
          required
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://"
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="url"
        />
      </label>
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
        <label className="block">
          <span className="text-[13px] font-medium text-ink">First name</span>
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
            autoComplete="given-name"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-ink">Last name</span>
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
            autoComplete="family-name"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[13px] font-medium text-ink">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="email"
        />
      </label>
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
      <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/70">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1"
        />
        Send the report and occasional notes about the work. You can leave the list any time.
      </label>
      {error ? (
        <p className={`text-[14px] ${alreadyRequested ? "text-ink/80" : "text-red-600"}`} role="alert">
          {error}
          {alreadyRequested ? (
            <>
              {" "}
              <Link href="/book" className="font-medium text-brand hover:text-brand-hover">
                Talk with us
              </Link>
              .
            </>
          ) : null}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
      >
        {busy ? "Sending…" : "Get my free Digital Footprint report"}
      </button>
      <p className="text-center text-[14px] text-slate-500">
        Want to see the shape first?{" "}
        <Link href="/report/example" className="font-medium text-brand hover:text-brand-hover">
          Open a sample
        </Link>
        .
      </p>
    </form>
  )
}
