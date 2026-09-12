"use client"

import Link from "next/link"
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { browserTimeZone, formatLongDay, formatTime, formatWhen, groupSlotsByDay, tzLabel } from "@/lib/booking-format"
import { buildIcs } from "@/lib/ics"

export type BookingResult = {
  id: string
  startIso: string
  endIso: string
  meetUrl: string | null
  meetProvider: "google_meet" | "teams" | null
  manageToken: string
  manageUrl: string
}

const DAYS_AHEAD = 14
const STEPS = ["Pick a day", "Pick a time", "Your details"]

const pill = "h-11 rounded-full border px-4 text-[14px] font-medium transition"
const pillOff = "border-ink/10 bg-cream text-ink hover:border-brand/40 hover:bg-white"
const pillOn = "border-brand bg-brand text-white"
const inputClass = "mt-1.5 h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-[15px] text-ink outline-none focus:border-brand"

/** Shown whenever Terra IQ is not reachable or not configured. Never a blank state. */
export function BookingFallback({ reason }: { reason?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-cream px-5 py-5">
      <p className="text-[15px] font-semibold text-ink">{reason || "Booking is warming up."}</p>
      <p className="mt-1 text-[14px] text-slate-600">
        Send us a note instead and we reply within one business day.
      </p>
      <Link
        href="/partner"
        className="mt-4 inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
      >
        Send a note
      </Link>
    </div>
  )
}

/**
 * Day, time, details, confirm. Used by the popup, the /book page, and (in "pick" mode) the
 * reschedule screen, where the caller takes the chosen slot instead of the details form.
 */
export function BookingFlow({
  mode = "book",
  onPick,
  compact = false,
}: {
  mode?: "book" | "pick"
  /** "pick" mode: called with the chosen start; the caller reschedules. */
  onPick?: (startIso: string) => Promise<string | null>
  compact?: boolean
}) {
  const [tz, setTz] = useState("UTC")
  const [slots, setSlots] = useState<string[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [business, setBusiness] = useState("")
  const [website, setWebsite] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<BookingResult | null>(null)

  useEffect(() => {
    setTz(browserTimeZone())
  }, [])

  const load = useCallback(async () => {
    setSlots(null)
    setLoadError(null)
    const from = new Date()
    const to = new Date(from.getTime() + DAYS_AHEAD * 86_400_000)
    try {
      const response = await fetch(
        `/api/booking/availability?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}&tz=${encodeURIComponent(browserTimeZone())}`,
        { cache: "no-store" }
      )
      if (!response.ok) throw new Error(String(response.status))
      const data = (await response.json()) as { slots?: string[] }
      setSlots(Array.isArray(data.slots) ? data.slots : [])
    } catch {
      setLoadError("Booking is warming up.")
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const days = useMemo(() => (slots ? groupSlotsByDay(slots, tz) : []), [slots, tz])
  const day = days.find((d) => d.key === dayKey) || null
  const zone = tzLabel(tz, slot || undefined)

  const chooseDay = (key: string) => {
    setDayKey(key)
    setSlot(null)
    setError("")
    setStep(1)
  }

  const chooseSlot = async (iso: string) => {
    setSlot(iso)
    setError("")
    if (mode === "pick" && onPick) {
      setBusy(true)
      const problem = await onPick(iso)
      setBusy(false)
      if (problem) {
        setError(problem)
        await load()
        setStep(1)
      }
      return
    }
    setStep(2)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (!slot) {
      setStep(1)
      return
    }
    if (!name.trim() || !email.trim()) {
      setError("We need a name and an email to send the invite.")
      return
    }
    setBusy(true)
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          business: business.trim() || null,
          website: website.trim() || null,
          startIso: slot,
          tz,
        }),
      })
      const data = (await response.json().catch(() => ({}))) as Partial<BookingResult> & { error?: string }
      if (response.status === 409) {
        setError("That time was just taken. Pick another.")
        await load()
        setStep(1)
        return
      }
      if (!response.ok || !data.startIso || !data.manageUrl) {
        setLoadError("Booking is warming up.")
        return
      }
      setDone(data as BookingResult)
    } catch {
      setLoadError("Booking is warming up.")
    } finally {
      setBusy(false)
    }
  }

  if (loadError) return <BookingFallback reason={loadError} />

  if (done) return <BookingSuccess booking={done} tz={tz} name={name} />

  if (slots === null) {
    return (
      <div className="py-6">
        <p className="text-[14px] text-slate-500">Checking the calendar…</p>
      </div>
    )
  }

  if (days.length === 0) {
    return <BookingFallback reason="No open times in the next two weeks." />
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-brand">
          {Math.min(step, STEPS.length - 1) + 1} of {mode === "pick" ? 2 : STEPS.length}
        </span>
        <div className="flex flex-1 gap-1.5">
          {(mode === "pick" ? STEPS.slice(0, 2) : STEPS).map((label, index) => (
            <span key={label} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-brand" : "bg-ink/10"}`} />
          ))}
        </div>
      </div>

      {step === 0 ? (
        <div className="mt-4">
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">{STEPS[0]}</p>
          <p className="mt-1 text-[14px] text-slate-500">30 minutes with Adam. Times shown in {zone}.</p>
          <div className={`mt-4 grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
            {days.map((d) => (
              <button key={d.key} type="button" onClick={() => chooseDay(d.key)} className={`${pill} ${d.key === dayKey ? pillOn : pillOff}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 1 && day ? (
        <div className="mt-4">
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">{formatLongDay(day.slots[0], tz)}</p>
          <p className="mt-1 text-[14px] text-slate-500">Pick a time. Shown in {zone}.</p>
          <div className={`mt-4 grid max-h-[40vh] gap-2 overflow-y-auto pr-1 ${compact ? "grid-cols-2" : "grid-cols-3 sm:grid-cols-4"}`}>
            {day.slots.map((iso) => (
              <button
                key={iso}
                type="button"
                disabled={busy}
                onClick={() => void chooseSlot(iso)}
                className={`${pill} ${iso === slot ? pillOn : pillOff} disabled:opacity-60`}
              >
                {formatTime(iso, tz)}
              </button>
            ))}
          </div>
          {error ? <p className="mt-3 text-[14px] text-red-600">{error}</p> : null}
          <button type="button" onClick={() => setStep(0)} className="mt-4 text-[14px] font-medium text-slate-500 hover:text-ink">
            Back to days
          </button>
        </div>
      ) : null}

      {step === 2 && slot ? (
        <form onSubmit={submit} className="mt-4">
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">{STEPS[2]}</p>
          <p className="mt-1 text-[14px] text-slate-500">{formatWhen(slot, tz)}. The invite goes to this email.</p>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-ink">Name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
          </label>
          <label className="mt-3 block">
            <span className="text-[13px] font-medium text-ink">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
          </label>
          <label className="mt-3 block">
            <span className="text-[13px] font-medium text-ink">Phone (optional, for a text reminder)</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} autoComplete="tel" />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[13px] font-medium text-ink">Business</span>
              <input value={business} onChange={(e) => setBusiness(e.target.value)} className={inputClass} autoComplete="organization" />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-ink">Website</span>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={inputClass} autoComplete="url" />
            </label>
          </div>
          {error ? <p className="mt-4 text-[14px] text-red-600">{error}</p> : null}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setStep(1)} className="text-[14px] font-medium text-slate-500 hover:text-ink">
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
            >
              {busy ? "Booking…" : "Confirm the call"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

export function downloadIcs(booking: { id: string; startIso: string; endIso: string; meetUrl: string | null }) {
  const ics = buildIcs({
    uid: booking.id,
    startIso: booking.startIso,
    endIso: booking.endIso,
    title: "Call with Adam Moreno, Terramore",
    description: booking.meetUrl ? `Join on Google Meet: ${booking.meetUrl}` : "Join link is on the calendar invite from adam.moreno@terramore.io.",
    url: booking.meetUrl,
  })
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "terramore-call.ics"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function BookingSuccess({ booking, tz, name }: { booking: BookingResult; tz: string; name?: string }) {
  const first = name?.split(/\s+/)[0]
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">Booked</p>
      <p className="mt-2 text-[1.3rem] font-semibold tracking-tight text-ink">{first ? `See you then, ${first}.` : "See you then."}</p>
      <p className="mt-2 text-[15px] text-slate-600">
        {formatWhen(booking.startIso, tz)} <span className="text-slate-400">({tz})</span>
      </p>
      <p className="mt-3 text-[14px] text-slate-600">
        {booking.meetUrl ? (
          <>
            Join on Google Meet:{" "}
            <a href={booking.meetUrl} target="_blank" rel="noreferrer" className="break-all font-medium text-brand hover:text-brand-hover">
              {booking.meetUrl}
            </a>
          </>
        ) : (
          "The calendar invite from adam.moreno@terramore.io has the join link."
        )}
      </p>
      <p className="mt-2 text-[14px] text-slate-600">A calendar invite and a confirmation email are on the way.</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => downloadIcs(booking)}
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-white hover:bg-ink/90"
        >
          Add to calendar
        </button>
        <a href={booking.manageUrl} className="text-[14px] font-medium text-slate-500 underline-offset-4 hover:text-ink hover:underline">
          Move or cancel
        </a>
      </div>
    </div>
  )
}
