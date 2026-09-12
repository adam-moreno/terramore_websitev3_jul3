"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { BookingLink } from "@/components/booking-popup"

const JOBS = [
  "Carts start but do not finish",
  "The appointment book has gaps",
  "Calls and messages go unanswered",
  "I want to launch something new",
  "Customers do not come back",
  "People cannot find us online",
  "Ads reach the wrong people",
  "Something else",
]

const BUSINESS_TYPES = ["Online store", "Local shop", "Service business", "Clinic or practice", "Creator or brand", "Other"]

const REVENUE = ["Prefer not to say", "Under $100K a year", "$100K to $500K", "$500K to $1M", "$1M to $5M", "Over $5M"]

const STEPS = ["What is stuck", "The business", "How to reach you"]

export function TalkForm() {
  const [step, setStep] = useState(0)
  const [job, setJob] = useState("")
  const [note, setNote] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [website, setWebsite] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [revenue, setRevenue] = useState(REVENUE[0])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const next = () => {
    setError("")
    if (step === 0 && !job) {
      setError("Pick the one that is closest. You can add detail on the call.")
      return
    }
    setStep((value) => Math.min(value + 1, STEPS.length - 1))
  }

  const back = () => {
    setError("")
    setStep((value) => Math.max(value - 1, 0))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (!name.trim() || !email.trim()) {
      setError("We need a name and an email to reply.")
      return
    }
    setBusy(true)
    try {
      const response = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: job,
          message:
            [
              note.trim(),
              businessName.trim() ? `Business: ${businessName.trim()}` : "",
              website.trim() ? `Site: ${website.trim()}` : "",
            ]
              .filter(Boolean)
              .join("\n") || null,
          businessType: businessType || "Not shared",
          revenue: revenue === REVENUE[0] ? "Not shared" : revenue,
          location: "Not asked",
          teamSize: "Not asked",
          timeline: "Not asked",
          budget: "Not asked",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
        }),
      })
      if (!response.ok && response.status !== 409) {
        throw new Error("Could not send")
      }
      setSent(true)
    } catch {
      setError("We could not send that just now. Try again, or book a call at terramore.io/book.")
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    "mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"

  if (sent) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-10">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">Sent</p>
        <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Got it, {name.split(" ")[0]}.</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          We read the site before we reply, so the first note already says what we would look at. Expect it within one
          business day.
        </p>
        <BookingLink
          label="Pick a time for the call"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
        />
        <p className="mt-6 text-[14px] text-slate-500">
          While you wait,{" "}
          <Link href="/report/example" className="font-medium text-brand hover:text-brand-hover">
            see what a report looks like
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9"
    >
      <ol className="flex items-center gap-2 text-[12px] font-medium">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                index <= step ? "bg-ink text-white" : "bg-ink/[0.06] text-ink/50"
              }`}
            >
              {index + 1}
            </span>
            <span className={index === step ? "text-ink" : "text-ink/50"}>{label}</span>
            {index < STEPS.length - 1 ? <span className="mx-1 h-px w-5 bg-ink/10" /> : null}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="mt-6">
          <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">What is stuck right now?</h2>
          <p className="mt-1 text-[14px] text-slate-600">Pick the closest one. This is the first thing we look at.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {JOBS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setJob(item)}
                className={`rounded-2xl border px-4 py-3 text-left text-[14px] font-medium transition ${
                  job === item
                    ? "border-brand bg-brand/[0.06] text-ink"
                    : "border-ink/10 bg-white text-ink/80 hover:border-ink/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-ink">Anything else we should know? (optional)</span>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-[15px] text-ink outline-none focus:border-brand"
            />
          </label>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6">
          <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">Tell us about the business.</h2>
          <p className="mt-1 text-[14px] text-slate-600">The site lets us read it before we talk. Everything else is optional.</p>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-ink">Business name</span>
            <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className={inputClass} autoComplete="organization" />
          </label>
          <label className="mt-3 block">
            <span className="text-[13px] font-medium text-ink">Website</span>
            <input value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://" className={inputClass} autoComplete="url" />
          </label>
          <div className="mt-4">
            <span className="text-[13px] font-medium text-ink">What kind of business? (optional)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUSINESS_TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBusinessType(item === businessType ? "" : item)}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                    businessType === item ? "border-ink bg-ink text-white" : "border-ink/10 text-ink/80 hover:border-ink/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-ink">Yearly revenue (optional)</span>
            <select value={revenue} onChange={(event) => setRevenue(event.target.value)} className={inputClass}>
              {REVENUE.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6">
          <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">How do we reach you?</h2>
          <p className="mt-1 text-[14px] text-slate-600">We reply by email within one business day.</p>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-ink">Name</span>
            <input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} autoComplete="name" />
          </label>
          <label className="mt-3 block">
            <span className="text-[13px] font-medium text-ink">Email</span>
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} autoComplete="email" />
          </label>
          <label className="mt-3 block">
            <span className="text-[13px] font-medium text-ink">Phone (optional)</span>
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} autoComplete="tel" />
          </label>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-[14px] text-red-600">{error}</p> : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={back} className="text-[14px] font-medium text-slate-500 hover:text-ink">
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-white hover:bg-ink/90"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send it"}
          </button>
        )}
      </div>
    </form>
  )
}
