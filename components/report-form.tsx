"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export type ReportAnswers = Record<string, string>

export function ReportForm({
  className = "",
  onCancel,
  answers,
  plain = false,
}: {
  className?: string
  onCancel?: () => void
  answers?: ReportAnswers
  plain?: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (!name.trim() || !email.trim() || !consent) {
      setError("Name, email, and consent are required.")
      return
    }

    setBusy(true)
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, businessName, answers }),
      })

      if (!response.ok && response.status !== 409) {
        throw new Error("Could not save the request")
      }

      router.push("/report/example?sent=1")
    } catch {
      setError("We could not send that just now. Try again, or talk with us.")
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${
        plain ? "" : "rounded-[1.75rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9"
      } ${className}`}
    >
      {plain ? null : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-semibold text-ink">Send the report to my inbox</p>
          {onCancel ? (
            <button type="button" onClick={onCancel} className="text-[13px] font-medium text-slate-400 hover:text-ink">
              Close
            </button>
          ) : null}
        </div>
      )}
      <p className="text-[14px] leading-relaxed text-slate-600">
        We need a name, an email, and the site. That is how we read the footprint and how the file gets to you.
      </p>
      <label className="block">
        <span className="text-[13px] font-medium text-ink">Name</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="name"
        />
      </label>
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
        <span className="text-[13px] font-medium text-ink">Business name</span>
        <input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="organization"
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-medium text-ink">Website</span>
        <input
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://"
          className="mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"
          autoComplete="url"
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
      {error ? <p className="text-[14px] text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send me the free report"}
      </button>
      <p className="text-center text-[14px] text-slate-500">
        Want to see the shape first?{" "}
        <Link href="/report/example" className="font-medium text-brand hover:text-brand-hover">
          Open the sample
        </Link>
        .
      </p>
    </form>
  )
}
