"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { BookingFallback, BookingFlow, downloadIcs } from "@/components/booking-flow"
import { browserTimeZone, formatWhen } from "@/lib/booking-format"
import { googleCalendarUrl } from "@/lib/ics"

type Booking = {
  id: string
  startIso: string
  endIso: string
  meetUrl: string | null
  status?: string
  name?: string
  email?: string
}

export function ManageBooking() {
  const token = useSearchParams().get("token") || ""
  const [tz, setTz] = useState("UTC")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "missing" | "down" | "moving" | "canceled" | "moved">("loading")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setTz(browserTimeZone())
  }, [])

  const load = useCallback(async () => {
    if (!token) {
      setState("missing")
      return
    }
    try {
      const response = await fetch(`/api/booking/manage?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      if (response.status === 401 || response.status === 404) {
        setState("missing")
        return
      }
      if (!response.ok) {
        setState("down")
        return
      }
      const data = (await response.json()) as Booking
      setBooking(data)
      setState(data.status && data.status !== "scheduled" ? "canceled" : "ready")
    } catch {
      setState("down")
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  const cancel = async () => {
    if (!window.confirm("Cancel this call?")) return
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/booking/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: "cancel" }),
      })
      if (!response.ok) {
        setError("We could not cancel just now. Reply to the confirmation email and we will handle it.")
        return
      }
      setState("canceled")
    } catch {
      setError("We could not cancel just now. Reply to the confirmation email and we will handle it.")
    } finally {
      setBusy(false)
    }
  }

  const reschedule = async (startIso: string): Promise<string | null> => {
    const response = await fetch("/api/booking/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action: "reschedule", startIso }),
    }).catch(() => null)
    if (!response) return "We could not move the call just now. Try again in a moment."
    if (response.status === 409) return "That time was just taken. Pick another."
    if (!response.ok) return "We could not move the call just now. Try again in a moment."
    const data = (await response.json()) as Booking
    setBooking(data)
    setState("moved")
    return null
  }

  if (state === "loading") return <p className="text-[14px] text-slate-500">Loading your call…</p>

  if (state === "missing") {
    return (
      <div>
        <p className="text-[1.2rem] font-semibold tracking-tight text-ink">We could not find that call.</p>
        <p className="mt-2 text-[14px] text-slate-600">The link may be old. Book again or reply to the confirmation email.</p>
        <Link href="/book" className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover">
          Book a call
        </Link>
      </div>
    )
  }

  if (state === "down" || !booking) return <BookingFallback />

  if (state === "canceled") {
    return (
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">Canceled</p>
        <p className="mt-2 text-[1.2rem] font-semibold tracking-tight text-ink">This call is off the calendar.</p>
        <p className="mt-2 text-[14px] text-slate-600">Change your mind any time.</p>
        <Link href="/book" className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover">
          Book a new time
        </Link>
      </div>
    )
  }

  if (state === "moving") {
    return (
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">Move the call</p>
        <p className="mt-2 mb-4 text-[14px] text-slate-600">Currently {formatWhen(booking.startIso, tz)}.</p>
        <BookingFlow mode="pick" onPick={reschedule} compact />
        <button type="button" onClick={() => setState("ready")} className="mt-4 text-[14px] font-medium text-slate-500 hover:text-ink">
          Keep the current time
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">{state === "moved" ? "Moved" : "Your call"}</p>
      <p className="mt-2 text-[1.2rem] font-semibold tracking-tight text-ink">{formatWhen(booking.startIso, tz)}</p>
      <p className="mt-1 text-[13px] text-slate-400">{tz}</p>
      {booking.meetUrl ? (
        <p className="mt-3 text-[14px] text-slate-600">
          Join on Google Meet:{" "}
          <a href={booking.meetUrl} target="_blank" rel="noreferrer" className="break-all font-medium text-brand hover:text-brand-hover">
            {booking.meetUrl}
          </a>
        </p>
      ) : (
        <p className="mt-3 text-[14px] text-slate-600">The calendar invite from adam.moreno@terramore.io has the join link.</p>
      )}
      {state === "moved" ? <p className="mt-2 text-[14px] text-slate-600">An updated invite is on the way.</p> : null}
      {error ? <p className="mt-4 text-[14px] text-red-600">{error}</p> : null}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={googleCalendarUrl({
            uid: booking.id,
            startIso: booking.startIso,
            endIso: booking.endIso,
            title: "Call with Adam Moreno, Terramore",
            description: booking.meetUrl
              ? `Join on Google Meet: ${booking.meetUrl}`
              : "Join link is on the calendar invite from adam.moreno@terramore.io.",
            url: booking.meetUrl,
          })}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-white hover:bg-ink/90"
        >
          Google Calendar
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(booking)}
          className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-[15px] font-medium text-ink hover:border-ink/40"
        >
          Download .ics
        </button>
        <button
          type="button"
          onClick={() => setState("moving")}
          className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-[15px] font-medium text-ink hover:border-ink/40"
        >
          Move it
        </button>
        <button type="button" onClick={() => void cancel()} disabled={busy} className="text-[14px] font-medium text-slate-500 hover:text-red-600 disabled:opacity-60">
          {busy ? "Canceling…" : "Cancel the call"}
        </button>
      </div>
    </div>
  )
}
