"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { trackMeetingBooked } from "@/lib/analytics"
import { mergedAttribution } from "@/lib/attribution"
import { browserTimeZone, formatLongDay, formatTime, formatWhen, groupSlotsByDay, tzLabel } from "@/lib/booking-format"
import { buildIcs, googleCalendarUrl, outlookCalendarUrl } from "@/lib/ics"

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

/** Book mode: 3 qualifier steps → schedule (day+time) → contact. Pick mode (reschedule): schedule only. */
const BOOK_STEPS = ["Owner", "Business", "Stage", "Schedule", "Your details"]
const PICK_STEPS = ["Schedule"]
const QUALIFIER_COUNT = 3

const OWNER_OPTIONS = ["Yes", "No", "Exploring for one"]

const BUSINESS_TYPES = [
  "Online store",
  "Local shop",
  "Service business",
  "Clinic or practice",
  "Creator or brand",
  "Other",
]

const DIGITAL_STAGES = [
  "Just getting started",
  "I post a bit of content",
  "I've done ads",
  "SEO / organic focus",
  "I have a monthly budget",
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const choiceOff = "border-ink/10 bg-white text-ink/80 hover:border-ink/30"
const choiceOn = "border-brand bg-brand/[0.06] text-ink"
/** Amazon-style contact chrome: bold label → tight gap → rectangular input. Details step only. */
const detailsLabel = "block text-[14px] font-bold text-ink"
const detailsInput =
  "mt-1 h-10 w-full rounded-md border border-ink/25 bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink/35 outline-none focus:border-brand"
const stepPane = "mt-4 animate-fade-in"

/** Fallback for `source` when the caller did not tag the entry point. */
function sourceFromPath(pathname: string): string {
  if (pathname === "/") return "homepage"
  if (pathname === "/book") return "book"
  if (pathname === "/report" || pathname.startsWith("/report/")) return "report"
  return pathname
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

/** Same acceptance rules as `normalizePhone` in lib/notify (kept local so the client does not import notify). */
function isUsablePhone(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return false
  const digits = trimmed.replace(/[^\d]/g, "")
  if (trimmed.startsWith("+")) return digits.length >= 8
  if (digits.length === 10) return true
  if (digits.length === 11 && digits.startsWith("1")) return true
  return false
}

/** Local calendar YYYY-MM-DD — matches dayKey() for the browser zone. */
function localDayKey(year: number, monthIndex: number, day: number) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

function parseDayKey(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  return { year: y, monthIndex: m - 1, day: d }
}

function monthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, monthIndex, 1))
}

function shiftMonth(year: number, monthIndex: number, delta: number) {
  const d = new Date(year, monthIndex + delta, 1)
  return { year: d.getFullYear(), monthIndex: d.getMonth() }
}

function monthCells(year: number, monthIndex: number) {
  const firstDow = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: ({ key: string; day: number } | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: localDayKey(year, monthIndex, day), day })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** Calendly-style month grid. Only days with API slots are selectable. */
function MonthDayPicker({
  availableKeys,
  selectedKey,
  onSelect,
}: {
  availableKeys: Set<string>
  selectedKey: string | null
  onSelect: (key: string) => void
}) {
  const bounds = useMemo(() => {
    const keys = Array.from(availableKeys).sort()
    if (keys.length === 0) return null
    const first = parseDayKey(keys[0])
    const last = parseDayKey(keys[keys.length - 1])
    return {
      min: { year: first.year, monthIndex: first.monthIndex },
      max: { year: last.year, monthIndex: last.monthIndex },
      start: { year: first.year, monthIndex: first.monthIndex },
    }
  }, [availableKeys])

  const [view, setView] = useState(() => bounds?.start || { year: new Date().getFullYear(), monthIndex: new Date().getMonth() })

  useEffect(() => {
    if (!bounds) return
    setView((current) => {
      const beforeMin =
        current.year < bounds.min.year || (current.year === bounds.min.year && current.monthIndex < bounds.min.monthIndex)
      const afterMax =
        current.year > bounds.max.year || (current.year === bounds.max.year && current.monthIndex > bounds.max.monthIndex)
      return beforeMin || afterMax ? bounds.start : current
    })
  }, [bounds])

  if (!bounds) return null

  const canPrev =
    view.year > bounds.min.year || (view.year === bounds.min.year && view.monthIndex > bounds.min.monthIndex)
  const canNext =
    view.year < bounds.max.year || (view.year === bounds.max.year && view.monthIndex < bounds.max.monthIndex)
  const cells = monthCells(view.year, view.monthIndex)
  const todayKey = (() => {
    const n = new Date()
    return localDayKey(n.getFullYear(), n.getMonth(), n.getDate())
  })()

  return (
    <div className="mx-auto w-full max-w-[20rem] @[24rem]:mx-0">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canPrev}
          onClick={() => setView((v) => shiftMonth(v.year, v.monthIndex, -1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-cream hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-[15px] font-semibold tracking-tight text-ink">{monthLabel(view.year, view.monthIndex)}</p>
        <button
          type="button"
          aria-label="Next month"
          disabled={!canNext}
          onClick={() => setView((v) => shiftMonth(v.year, v.monthIndex, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-cream hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {d}
          </span>
        ))}
        {cells.map((cell, index) => {
          if (!cell) return <span key={`e-${index}`} className="h-9 sm:h-10" />
          const open = availableKeys.has(cell.key)
          const selected = selectedKey === cell.key
          const isToday = cell.key === todayKey
          return (
            <button
              key={cell.key}
              type="button"
              disabled={!open}
              onClick={() => onSelect(cell.key)}
              aria-label={cell.key}
              aria-pressed={selected}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium transition sm:h-10 sm:w-10 sm:text-[14px] ${
                selected
                  ? "bg-brand text-white"
                  : open
                    ? `text-ink hover:bg-brand/10 ${isToday ? "ring-1 ring-ink/20" : ""}`
                    : "cursor-default text-ink/25"
              }`}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Shown whenever Terra IQ is not reachable or not configured. Never a blank state. No email shortcut. */
export function BookingFallback({ reason, onRetry }: { reason?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-cream px-5 py-5">
      <p className="text-[15px] font-semibold text-ink">{reason || "Booking is warming up."}</p>
      <p className="mt-1 text-[14px] text-slate-600">
        Try again in a moment. The calendar usually comes back quickly.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

function loadErrorMessage(status: number, error?: string): string {
  if (error === "not_configured" || status === 503) {
    return "Calendar isn’t connected in this environment yet."
  }
  return "Booking is warming up."
}

/**
 * Qualify → schedule (day + time) → details → confirm. Used by the popup, the /book page, and (in "pick"
 * mode) the reschedule screen, where the caller takes the chosen slot instead of the details form.
 */
export function BookingFlow({
  mode = "book",
  onPick,
  compact = false,
  source,
}: {
  mode?: "book" | "pick"
  /** "pick" mode: called with the chosen start; the caller reschedules. */
  onPick?: (startIso: string) => Promise<string | null>
  compact?: boolean
  /** Entry point for analytics/attribution: report | homepage | header | floating_cta | book. Falls back to the pathname. */
  source?: string
}) {
  const isPick = mode === "pick"
  const steps = isPick ? PICK_STEPS : BOOK_STEPS
  const scheduleStep = isPick ? 0 : QUALIFIER_COUNT
  const detailsStep = scheduleStep + 1

  const [tz, setTz] = useState("UTC")
  const [slots, setSlots] = useState<string[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)

  const [isOwner, setIsOwner] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [digitalStage, setDigitalStage] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [business, setBusiness] = useState("")
  const [website, setWebsite] = useState("")
  const [socials, setSocials] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<BookingResult | null>(null)
  const [advancing, setAdvancing] = useState(false)

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
      const data = (await response.json().catch(() => ({}))) as { slots?: string[]; error?: string }
      if (!response.ok) {
        setLoadError(loadErrorMessage(response.status, data.error))
        return
      }
      setSlots(Array.isArray(data.slots) ? data.slots : [])
    } catch {
      setLoadError("Booking is warming up.")
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const days = useMemo(() => (slots ? groupSlotsByDay(slots, tz) : []), [slots, tz])
  const availableKeys = useMemo(() => new Set(days.map((d) => d.key)), [days])
  const day = days.find((d) => d.key === dayKey) || null
  const zone = tzLabel(tz, slot || undefined)

  const answerAndAdvance = (nextStep: number, apply: () => void) => {
    if (advancing) return
    setError("")
    apply()
    setAdvancing(true)
    window.setTimeout(() => {
      setStep(nextStep)
      setAdvancing(false)
    }, 180)
  }

  /** Stay on the schedule step; times appear beside the calendar. */
  const chooseDay = (key: string) => {
    setDayKey(key)
    setSlot(null)
    setError("")
  }

  const chooseSlot = async (iso: string) => {
    setSlot(iso)
    setError("")
    if (isPick && onPick) {
      setBusy(true)
      const problem = await onPick(iso)
      setBusy(false)
      if (problem) {
        setError(problem)
        await load()
        setStep(scheduleStep)
      }
      return
    }
    setStep(detailsStep)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (!slot) {
      setStep(scheduleStep)
      return
    }
    if (!name.trim() || !email.trim()) {
      setError("We need a name and an email to send the invite.")
      return
    }
    if (!isUsablePhone(phone)) {
      setError("We need a phone number in case you miss the video call.")
      return
    }
    setBusy(true)
    // API has no socials field — fold into note like report form packs extras.
    const noteLines = [`Owner: ${isOwner}`, `Type: ${businessType}`, `Stage: ${digitalStage}`]
    if (socials.trim()) noteLines.push(`Socials: ${socials.trim()}`)
    const note = noteLines.join("\n")
    const pagePath = typeof window !== "undefined" ? window.location.pathname : ""
    const bookingSource = source || sourceFromPath(pagePath)
    // Stored (tab session, written on any landing with params) first, current URL on top. Never throws.
    const attribution = mergedAttribution()
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          business: business.trim() || null,
          website: website.trim() || null,
          note,
          startIso: slot,
          tz,
          source: bookingSource,
          attribution: Object.keys(attribution).length > 0 ? attribution : undefined,
        }),
      })
      const data = (await response.json().catch(() => ({}))) as Partial<BookingResult> & { error?: string }
      if (response.status === 409) {
        setError("That time was just taken. Pick another.")
        await load()
        setStep(scheduleStep)
        return
      }
      const bookingId = typeof data.id === "string" ? data.id.trim() : ""
      if (!response.ok || !bookingId || !data.startIso || !data.manageUrl) {
        setLoadError(loadErrorMessage(response.status, data.error))
        return
      }
      // Safe conversion point: server confirmed booking (ok + string id + startIso + manageUrl).
      // 409 / !ok / missing id never reach here. trackMeetingBooked dedupes on booking_id; GA4 only (no Ads conversion).
      trackMeetingBooked({
        booking_id: bookingId,
        business_type: businessType,
        stage: digitalStage,
        source: bookingSource,
        page_path: pagePath,
      })
      setDone(data as BookingResult)
    } catch {
      setLoadError("Booking is warming up.")
    } finally {
      setBusy(false)
    }
  }

  if (done) return <BookingSuccess booking={done} tz={tz} name={name} />

  // After qualifiers (or immediately in pick mode), calendar must be ready.
  const needsCalendar = isPick || step >= QUALIFIER_COUNT
  if (needsCalendar && loadError) {
    return <BookingFallback reason={loadError} onRetry={() => void load()} />
  }
  if (needsCalendar && slots === null) {
    return (
      <div className="py-6">
        <p className="text-[14px] text-slate-500">Checking the calendar…</p>
      </div>
    )
  }
  if (needsCalendar && days.length === 0) {
    return <BookingFallback reason="No open times in the next two weeks." onRetry={() => void load()} />
  }

  const choiceGrid = compact ? "grid-cols-1" : "sm:grid-cols-2"

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-brand">
          {Math.min(step, steps.length - 1) + 1} of {steps.length}
        </span>
        <div className="flex flex-1 gap-1.5">
          {steps.map((label, index) => (
            <span key={label} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-brand" : "bg-ink/10"}`} />
          ))}
        </div>
      </div>

      {!isPick && step === 0 ? (
        <div key="q-owner" className={stepPane}>
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">Are you a business owner?</p>
          <p className="mt-1 text-[14px] text-slate-500">So we know who we are talking with.</p>
          <div className={`mt-4 grid gap-2 ${choiceGrid}`}>
            {OWNER_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                disabled={advancing}
                onClick={() => answerAndAdvance(1, () => setIsOwner(item))}
                className={`rounded-2xl border px-4 py-3 text-left text-[14px] font-medium transition ${
                  isOwner === item ? choiceOn : choiceOff
                } disabled:opacity-60`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!isPick && step === 1 ? (
        <div key="q-type" className={stepPane}>
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">What kind of business?</p>
          <p className="mt-1 text-[14px] text-slate-500">Pick the closest fit.</p>
          <div className={`mt-4 grid gap-2 ${choiceGrid}`}>
            {BUSINESS_TYPES.map((item) => (
              <button
                key={item}
                type="button"
                disabled={advancing}
                onClick={() => answerAndAdvance(2, () => setBusinessType(item))}
                className={`rounded-2xl border px-4 py-3 text-left text-[14px] font-medium transition ${
                  businessType === item ? choiceOn : choiceOff
                } disabled:opacity-60`}
              >
                {item}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(0)} className="mt-4 text-[14px] font-medium text-slate-500 hover:text-ink">
            Back
          </button>
        </div>
      ) : null}

      {!isPick && step === 2 ? (
        <div key="q-stage" className={stepPane}>
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">What stage are you on in your digital journey?</p>
          <p className="mt-1 text-[14px] text-slate-500">Where things stand today.</p>
          <div className={`mt-4 grid gap-2 ${choiceGrid}`}>
            {DIGITAL_STAGES.map((item) => (
              <button
                key={item}
                type="button"
                disabled={advancing}
                onClick={() => answerAndAdvance(3, () => setDigitalStage(item))}
                className={`rounded-2xl border px-4 py-3 text-left text-[14px] font-medium transition ${
                  digitalStage === item ? choiceOn : choiceOff
                } disabled:opacity-60`}
              >
                {item}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(1)} className="mt-4 text-[14px] font-medium text-slate-500 hover:text-ink">
            Back
          </button>
        </div>
      ) : null}

      {step === scheduleStep && days.length > 0 ? (
        <div key="schedule" className={stepPane}>
          <p className="text-[1.2rem] font-semibold tracking-tight text-ink">{dayKey ? "Pick a time" : "Pick a day"}</p>
          <p className="mt-1 text-[14px] text-slate-500">
            {day ? `${formatLongDay(day.slots[0], tz)}. Shown in ${zone}.` : `30 minutes. Times shown in ${zone}.`}
          </p>
          {/* Side-by-side when Schedule pane ≥24rem (container), not viewport md */}
          <div className="@container mt-4">
            <div className="flex flex-col gap-5 @[24rem]:flex-row @[24rem]:items-start @[24rem]:gap-5">
              <div className="min-w-0 @[24rem]:w-[20rem] @[24rem]:shrink-0">
                <MonthDayPicker availableKeys={availableKeys} selectedKey={dayKey} onSelect={chooseDay} />
              </div>
              <div className="flex w-full min-w-0 flex-col @[24rem]:flex-1">
                {day ? (
                  <div className="flex max-h-[min(36vh,16.5rem)] flex-col gap-2 overflow-y-auto overscroll-contain scroll-pb-8 pb-6 pr-1 @[24rem]:max-h-[17.5rem] @[24rem]:pb-8">
                    {day.slots.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        disabled={busy}
                        onClick={() => void chooseSlot(iso)}
                        className={`h-11 w-full shrink-0 rounded-lg border text-[14px] font-medium transition disabled:opacity-60 ${
                          iso === slot
                            ? "border-brand bg-brand text-white"
                            : "border-ink/15 bg-white text-ink hover:border-brand/50 hover:bg-cream"
                        }`}
                      >
                        {formatTime(iso, tz)}
                      </button>
                    ))}
                    {/* Spacer so the last slot clears the scroll edge / modal safe area */}
                    <div className="h-5 shrink-0" aria-hidden />
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-ink/15 bg-cream/60 px-3 py-10 text-center text-[13px] text-slate-500 @[24rem]:min-h-[12rem] @[24rem]:py-14">
                    Select a day
                  </p>
                )}
              </div>
            </div>
          </div>
          {error ? <p className="mt-3 text-[14px] text-red-600">{error}</p> : null}
          {!isPick ? (
            <button type="button" onClick={() => setStep(2)} className="mt-4 text-[14px] font-medium text-slate-500 hover:text-ink">
              Back
            </button>
          ) : null}
        </div>
      ) : null}

      {!isPick && step === detailsStep && slot ? (
        <form key="details" onSubmit={submit} className={stepPane} aria-busy={busy}>
          <p className="text-[1.35rem] font-bold tracking-tight text-ink">Your details</p>
          <p className="mt-1 text-[14px] text-slate-500">{formatWhen(slot, tz)}. The invite goes to this email.</p>

          <fieldset disabled={busy} className="mt-5 flex min-w-0 flex-col gap-4 border-0 p-0">
            <label className="block">
              <span className={detailsLabel}>Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
                className={detailsInput}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className={detailsLabel}>Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={detailsInput}
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className={detailsLabel}>Phone</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className={detailsInput}
                autoComplete="tel"
              />
              <span className="mt-1 block text-[12px] text-slate-500">We’ll text if you miss the call.</span>
            </label>
            <label className="block">
              <span className={detailsLabel}>Business name</span>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Your company"
                className={detailsInput}
                autoComplete="organization"
              />
            </label>
            <label className="block">
              <span className={detailsLabel}>Website</span>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className={detailsInput}
                autoComplete="url"
              />
            </label>
            <label className="block">
              <span className={detailsLabel}>
                Social usernames <span className="font-normal text-ink/40">(optional)</span>
              </span>
              <input
                value={socials}
                onChange={(e) => setSocials(e.target.value)}
                placeholder="Instagram / LinkedIn / TikTok handles"
                className={detailsInput}
              />
            </label>
          </fieldset>

          {error ? <p className="mt-4 text-[14px] text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Booking…" : "Confirm the call"}
          </button>
          {busy ? (
            <p className="mt-2 text-center text-[13px] text-slate-500" role="status">
              Holding your time on the calendar — usually a few seconds.
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setStep(scheduleStep)}
            disabled={busy}
            className="mt-3 text-[14px] font-medium text-slate-500 hover:text-ink disabled:opacity-50"
          >
            Back
          </button>
        </form>
      ) : null}
    </div>
  )
}

function calendarEventFromBooking(booking: { id: string; startIso: string; endIso: string; meetUrl: string | null }) {
  return {
    uid: booking.id,
    startIso: booking.startIso,
    endIso: booking.endIso,
    title: "Call with Adam Moreno, Terramore",
    description: booking.meetUrl
      ? `Join on Google Meet: ${booking.meetUrl}`
      : "Join link is on the calendar invite from adam.moreno@terramore.io.",
    url: booking.meetUrl,
  }
}

export function downloadIcs(booking: { id: string; startIso: string; endIso: string; meetUrl: string | null }) {
  const ics = buildIcs(calendarEventFromBooking(booking))
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

type CalendarBooking = { id: string; startIso: string; endIso: string; meetUrl: string | null }

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px] fill-ink">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

function OutlookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]">
      <rect x="2" y="3" width="20" height="18" rx="3.5" fill="#0F6CBD" />
      <ellipse cx="12" cy="12" rx="4.4" ry="5.2" fill="none" stroke="#fff" strokeWidth="2.3" />
    </svg>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-[22px] w-[22px]">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

const calendarButtonClass =
  "flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-ink/15 bg-cream text-[12px] font-medium text-ink hover:border-ink/40 hover:bg-white"

/** “Add to Calendar” kicker + Apple / Outlook / Google logo buttons. Shared by booking success and manage. */
export function AddToCalendar({ booking, className = "" }: { booking: CalendarBooking; className?: string }) {
  const event = calendarEventFromBooking(booking)
  return (
    <div className={className}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">Add to Calendar</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => downloadIcs(booking)} className={calendarButtonClass}>
          <AppleMark />
          Apple Calendar
        </button>
        <a href={outlookCalendarUrl(event)} target="_blank" rel="noreferrer" className={calendarButtonClass}>
          <OutlookMark />
          Outlook
        </a>
        <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" className={calendarButtonClass}>
          <GoogleMark />
          Google Calendar
        </a>
      </div>
    </div>
  )
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
      <p className="mt-2 text-[14px] text-slate-600">Confirmation email on the way. A short prep note follows in a few minutes.</p>
      <AddToCalendar booking={booking} className="mt-6" />
    </div>
  )
}
