"use client"

import { createContext, useContext, useEffect, useId, useRef, useState } from "react"
import {
  AlertCircle,
  Check,
  CircleDashed,
  Info,
  LayoutTemplate,
  Loader2,
  Minus,
  MousePointerClick,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import { BookingLink } from "@/components/booking-popup"
import { ReportPopup } from "@/components/report-popup"
import { useCtaView } from "@/hooks/use-cta-view"
import { trackCtaClick, trackFunnelEvent } from "@/lib/analytics"
import type { CtaId, LookupOutcome } from "@/lib/funnel-taxonomy"
import {
  LOOKUP_ERROR_COPY,
  LOOKUP_SOURCES,
  type LookupErrorCode,
  type LookupEvent,
  type LookupFinding,
  type LookupSourceId,
  type LookupSourceStatus,
  SCORE_BANDS,
  type LookupScore,
} from "@/lib/lookup/types"
import { useIsMobile } from "@/components/ui/use-mobile"

/**
 * Free business lookup: a described website field, then [Check my business]. The one canonical lookup for every public page
 * (search-first: docs/acquisition/SEARCH_FIRST_ROUTE_AUDIT.md). `variant` and `align` change layout and spacing only;
 * validation, the endpoint, analytics and the report hand-off are the same everywhere. It streams POST /api/lookup and shows each source as
 * it finishes, then offers next steps passed in by the host page (`next`, e.g. LookupReportButton and
 * LookupBookButton with their own CTA ids). No email is asked for until the visitor chooses the full report, which
 * opens the existing report popup with the website prefilled, so attribution and the report conversion are unchanged.
 *
 * Analytics: primary_cta_view when the field is seen, lookup_input_focus on first focus, the submit as the host CTA's
 * click (primary_cta_click with `ctaId`), then lookup_start and one lookup_result. The domain is never sent.
 */

/** The page's canonical lookup anchor. "Check my business" links (CheckMyBusinessLink) scroll to it and focus it. */
export const LOOKUP_ANCHOR = "check-my-business"

const PRIMARY =
  "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[16px] font-medium text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-90"

type Phase = "idle" | "checking" | "done" | "error"

type LookupState = {
  phase: Phase
  lookupId: string | null
  domain: string | null
  website: string | null
  name: string | null
  sources: Partial<Record<LookupSourceId, { status: LookupSourceStatus; findings: LookupFinding[] }>>
  firstLook: LookupFinding | null
  score: LookupScore | null
  error: LookupErrorCode | null
}

const EMPTY: LookupState = {
  phase: "idle",
  lookupId: null,
  domain: null,
  website: null,
  name: null,
  sources: {},
  firstLook: null,
  score: null,
  error: null,
}

type LookupContextValue = { website: string | null; lookupId: string | null; source: string; openReport: () => void }
const LookupContext = createContext<LookupContextValue | null>(null)

/** Rough client-side check so obvious typos get an inline error before any request. The server validates again. */
function looksLikeWebsite(value: string): boolean {
  const v = value.trim().replace(/^https?:\/\//i, "")
  return v.length >= 4 && !/\s/.test(v) && /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(v)
}

function reduce(state: LookupState, event: LookupEvent): LookupState {
  switch (event.type) {
    case "start":
      return { ...state, lookupId: event.lookupId, domain: event.domain, website: event.website }
    case "identity":
      return { ...state, name: event.name }
    case "source":
      return {
        ...state,
        sources: { ...state.sources, [event.source]: { status: event.status, findings: event.findings } },
      }
    case "done":
      return { ...state, phase: "done", firstLook: event.firstLook, score: event.score ?? null }
    case "error":
      return { ...state, phase: "error", error: event.code }
    default:
      return state
  }
}

export function BusinessLookup({
  ctaId,
  source,
  helper,
  secondary,
  next,
  variant = "full",
  align = "start",
  anchor = false,
  onSubmitted,
}: {
  /** The host CTA (report destination), e.g. "marketing_hero_report". The submit counts as its click. */
  ctaId: CtaId
  /** Booking `source` tag for next-step booking links, e.g. "marketing". */
  source: string
  /** One reassurance line under the field. */
  helper?: string
  /** The page's secondary action (e.g. "Or book a 30-minute call"), shown until results replace it with `next`. */
  secondary?: React.ReactNode
  /** Next steps shown once the lookup has results (LookupReportButton, LookupBookButton). */
  next?: React.ReactNode
  /**
   * "full" in a page's first viewport; "compact" on service pages (smaller label and helper, narrower). "hero" is "full"
   * below md; from md up the label reads as the hero's one supporting line, the description moves into a "what we
   * check" card under the field, and the results fill that same card.
   */
  variant?: "full" | "compact" | "hero"
  /** Center the label and secondary line for a centered hero. Results stay left-aligned for reading. */
  align?: "start" | "center"
  /** This is the page's canonical lookup: it carries the #check-my-business anchor. One per page. */
  anchor?: boolean
  /** Called once per valid submit, after the CTA click is recorded (e.g. a page's legacy click events). */
  onSubmitted?: () => void
}) {
  const inputId = useId()
  const errorId = useId()
  const descId = useId()
  const isMobile = useIsMobile()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)
  const [state, setState] = useState<LookupState>(EMPTY)
  const [reportOpen, setReportOpen] = useState(false)
  const runRef = useRef(0)
  const viewRef = useCtaView<HTMLButtonElement>(ctaId)

  const pending = state.phase === "checking"

  // Arriving on /#check-my-business (a "Check my business" link from another page) focuses the field.
  useEffect(() => {
    if (!anchor) return
    const focusIfTargeted = () => {
      if (window.location.hash === `#${LOOKUP_ANCHOR}`) inputRef.current?.focus({ preventScroll: true })
    }
    focusIfTargeted()
    window.addEventListener("hashchange", focusIfTargeted)
    return () => window.removeEventListener("hashchange", focusIfTargeted)
  }, [anchor])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (pending) return
    if (!looksLikeWebsite(value)) {
      setInputError(LOOKUP_ERROR_COPY.invalid_website)
      inputRef.current?.focus()
      return
    }
    setInputError(null)
    const run = ++runRef.current
    trackCtaClick(ctaId)
    onSubmitted?.()
    trackFunnelEvent("lookup_start", { cta_id: ctaId })
    let current: LookupState = { ...EMPTY, phase: "checking" }
    setState(current)

    const apply = (e: LookupEvent) => {
      current = reduce(current, e)
      if (run === runRef.current) setState(current)
    }

    try {
      const response = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: value.trim() }),
      })
      const reader = response.body?.getReader()
      if (!reader) throw new Error("no body")
      const decoder = new TextDecoder()
      let buffer = ""
      for (;;) {
        const { done, value: chunk } = await reader.read()
        if (done) break
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const l of lines) if (l.trim()) apply(JSON.parse(l) as LookupEvent)
      }
      if (buffer.trim()) apply(JSON.parse(buffer) as LookupEvent)
      if (current.phase === "checking") apply({ type: "error", code: "server", message: "" })
    } catch (error) {
      // A TypeError from fetch or the stream means the connection failed, not the lookup.
      apply({ type: "error", code: error instanceof TypeError ? "network" : "server", message: "" })
    }

    if (run !== runRef.current) return
    const failed = Object.values(current.sources).some((s) => s?.status === "failed")
    const outcome: LookupOutcome =
      current.phase === "done"
        ? failed
          ? "partial"
          : "complete"
        : current.error === "server"
          ? "error"
          : (current.error ?? "error")
    trackFunnelEvent(
      "lookup_result",
      current.lookupId ? { cta_id: ctaId, outcome, lookup_id: current.lookupId } : { cta_id: ctaId, outcome },
    )
    if (current.phase === "error" && current.error === "invalid_website") {
      setInputError(LOOKUP_ERROR_COPY.invalid_website)
      inputRef.current?.focus()
    }
  }

  function reset() {
    runRef.current++
    setState(EMPTY)
    setValue("")
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const showResults = state.phase !== "idle" && !(state.phase === "error" && state.error === "invalid_website")

  return (
    <LookupContext.Provider
      value={{ website: state.website, lookupId: state.lookupId, source, openReport: () => setReportOpen(true) }}
    >
      <div
        id={anchor ? LOOKUP_ANCHOR : undefined}
        data-lookup-variant={variant}
        className={`w-full scroll-mt-28 ${variant === "compact" ? "max-w-lg" : variant === "hero" ? "max-w-xl md:max-w-4xl" : "max-w-xl"} ${align === "center" ? "mx-auto" : ""}`}
      >
        <form noValidate onSubmit={submit} className={variant === "hero" ? "md:mx-auto md:max-w-xl" : undefined}>
          <label
            htmlFor={inputId}
            className={`block font-semibold text-ink ${variant === "compact" ? "text-[14px]" : "text-[15px]"} ${variant === "hero" ? "md:mx-auto md:max-w-[34rem] md:text-balance md:text-[20px] md:font-medium md:leading-[30px]" : ""} ${align === "center" ? "text-center" : ""}`}
          >
            Enter your website to check how customers find and reach your business.
          </label>
          <p
            id={descId}
            className={`mt-1 text-slate-600 ${variant === "compact" ? "text-[13px]" : "text-[14px]"} ${variant === "hero" ? "md:sr-only" : ""} ${align === "center" ? "text-center" : ""}`}
          >
            See what's working and what's missing across search basics, contact and booking, analytics and ad tags,
            social profiles, and your Google Maps listing.
          </p>
          <div className={`mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap ${variant === "hero" ? "md:mt-6" : ""}`}>
            <input
              ref={inputRef}
              id={inputId}
              name="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={isMobile ? "Your business's website" : "Enter your business's website here"}
              value={value}
              onFocus={() => trackFunnelEvent("lookup_input_focus", { cta_id: ctaId }, { once: ctaId })}
              onChange={(e) => {
                setValue(e.target.value)
                if (inputError && looksLikeWebsite(e.target.value)) setInputError(null)
              }}
              aria-invalid={inputError ? true : undefined}
              aria-describedby={inputError ? `${descId} ${errorId}` : descId}
              className="min-h-12 w-full min-w-0 sm:w-auto sm:min-w-[15rem] sm:flex-1 rounded-full border border-ink/55 bg-white px-5 text-[16px] text-ink placeholder:text-slate-500 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            />
            <button ref={viewRef} type="submit" className={PRIMARY} disabled={pending}>
              {pending ? (
                <>
                  <Loader2 aria-hidden className="h-4 w-4 motion-safe:animate-spin" />
                  Checking…
                </>
              ) : (
                "Check my business"
              )}
            </button>
          </div>
          {inputError ? (
            <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-[15px] text-red-700">
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              {inputError}
            </p>
          ) : null}
        </form>
        {helper && state.phase === "idle" ? (
          <p className={`mt-3 text-slate-600 ${variant === "compact" ? "text-[13px]" : "text-[14px]"} ${variant === "hero" ? "md:hidden" : ""} ${align === "center" ? "text-center" : ""}`}>
            {helper}
          </p>
        ) : null}
        {secondary && state.phase !== "done" ? (
          <div className={`mt-1 flex ${align === "center" ? "justify-center" : "justify-start"}`}>{secondary}</div>
        ) : null}
        {variant === "hero" && !(state.phase === "error") ? (
          <>
            <ScoreCard state={state} next={next} />
            {state.phase === "done" ? (
              <>
                <ScoreFactors score={state.score} />
                <LookupResults state={state} onReset={reset} detail />
              </>
            ) : null}
          </>
        ) : showResults ? (
          <LookupResults state={state} next={next} onReset={reset} />
        ) : null}
      </div>
      <ReportPopup
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        direct
        entry="popup_lookup"
        website={state.website ?? undefined}
        description={
          state.domain ? `We'll finish the review of ${state.domain} and email you the full report.` : undefined
        }
      />
    </LookupContext.Provider>
  )
}

const STATUS_COPY: Record<Exclude<LookupSourceStatus, "done">, string> = {
  checking: "Checking…",
  not_found: "Not found",
  unavailable: "Not checked here",
  failed: "Couldn't check",
}

function SourceIcon({ status, pending }: { status: LookupSourceStatus | undefined; pending: boolean }) {
  if (!status) {
    return pending ? (
      <Loader2 aria-hidden className="h-4 w-4 text-slate-500 motion-safe:animate-spin" />
    ) : (
      <Minus aria-hidden className="h-4 w-4 text-slate-500" />
    )
  }
  if (status === "done") return <Check aria-hidden className="h-4 w-4 text-green-700" />
  return <CircleDashed aria-hidden className="h-4 w-4 text-slate-500" />
}

function FindingIcon({ tone }: { tone: LookupFinding["tone"] }) {
  if (tone === "working") return <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
  if (tone === "gap") return <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
  return <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
}

/** Report factor ids (lib/report/score/digital-presence.ts) in display order, with what each one counts. */
const FACTORS: ReadonlyArray<{ id: string; label: string; icon: typeof Search; counts: string }> = [
  {
    id: "digital_experience",
    label: "Digital Experience",
    icon: LayoutTemplate,
    counts: "One clear headline, a page title, focused navigation, and one or two clear next steps for visitors.",
  },
  {
    id: "discoverability",
    label: "Discoverability",
    icon: Search,
    counts:
      "A page title and search description, robots.txt and a sitemap, linked social profiles, and a Google Maps listing that points to your site.",
  },
  {
    id: "trust",
    label: "Trust & Credibility",
    icon: ShieldCheck,
    counts:
      "Testimonials, case studies, guarantees, credentials, awards, policies, team or before-and-after pages, plus your Google listing.",
  },
  {
    id: "conversion",
    label: "Conversion Readiness",
    icon: MousePointerClick,
    counts: "A clear call to action, a phone, email or form on the homepage, online booking, and a checkout or visible services.",
  },
  {
    id: "technical",
    label: "Technical Health",
    icon: Wrench,
    counts: "A secure (https) connection, a page title and description, a canonical tag, robots.txt, a sitemap, and phone-ready pages.",
  },
]

/** Score scale: 0–49 red, 50–89 orange, 90–100 green (owner decision 2026-10-09; the number always shows too). */
function bandTone(score: number) {
  if (score < 50) return { stroke: "stroke-red-600", fill: "bg-red-600" }
  if (score < 90) return { stroke: "stroke-orange-600", fill: "bg-orange-600" }
  return { stroke: "stroke-green-600", fill: "bg-green-600" }
}

const BAND_DOT = ["bg-red-600", "bg-orange-600", "bg-green-600"] as const

/**
 * The "hero" variant's score card: the full report's Digital Presence Score as a teaser. Idle (md and up only), every
 * ring is at 0 with the scale and the two steps (instant score here, full report by email). Running the check shows
 * progress along the card's bottom edge, then fills each ring. The scores come from the report's own scoring code.
 */
function ScoreCard({ state, next }: { state: LookupState; next?: React.ReactNode }) {
  const idle = state.phase === "idle"
  const pending = state.phase === "checking"
  const done = state.phase === "done"
  const score = done ? state.score : null
  const finished = Object.values(state.sources).filter((r) => r && r.status !== "checking").length
  const factorScore = (id: string) => score?.factors.find((f) => f.id === id)?.score ?? null

  return (
    <section
      aria-label="Your Digital Presence Score"
      className={`relative mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 text-left md:p-8 ${idle ? "hidden md:block" : ""}`}
    >
      <p className="text-[18px] font-semibold text-ink md:text-[20px]">Your Digital Presence Score</p>
      {idle ? (
        <p className="mt-1 text-[15px] leading-snug text-slate-600">
          Scored 0 to 100 with the same method as our full Digital Footprint report. Your scores fill in here when the
          check finishes.
        </p>
      ) : (
        <p role="status" className="mt-1 text-[15px] leading-snug text-slate-600">
          {pending
            ? `Checking ${state.domain ?? "your website"}: ${finished} of ${LOOKUP_SOURCES.length} done`
            : score?.overall != null
              ? `Checked ${state.domain}: read from ${score.pagesRead} ${score.pagesRead === 1 ? "page" : "pages"}${
                  score.mapsChecked ? "" : " (Google Maps wasn't checked)"
                }. Your full report reads more, so its scores can differ.`
              : `We couldn't score ${state.domain ?? "this website"} from its public pages. The findings below still apply.`}
        </p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {FACTORS.map((f) => (
          <li key={f.id} className="flex flex-col items-center">
            <ScoreRing label={f.label} value={factorScore(f.id)} state={state.phase} />
          </li>
        ))}
      </ul>

      {score?.overall != null ? <OverallSummary score={score} firstLook={state.firstLook} /> : null}

      <p className="mt-6 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[13px] text-slate-600">
        <span>Score scale:</span>
        {SCORE_BANDS.map((b, i) => (
          <span key={b.label} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${BAND_DOT[i]}`} />
            {b.label}
          </span>
        ))}
      </p>

      <ol className="mt-6 grid gap-4 border-t border-ink/10 pt-6 md:grid-cols-2">
        <li className="flex gap-3">
          <StepNumber n={1} done={done} />
          <span>
            <span className="block text-[15px] font-semibold text-ink">Instant score</span>
            <span className="block text-[14px] leading-snug text-slate-600">Free, right on this page. No email needed.</span>
          </span>
        </li>
        <li className="flex gap-3">
          <StepNumber n={2} done={false} />
          <span>
            <span className="block text-[15px] font-semibold text-ink">Full report by email</span>
            <span className="block text-[14px] leading-snug text-slate-600">
              The evidence behind every score, how you compare, and the top five things we&apos;d fix first.
            </span>
          </span>
        </li>
      </ol>
      {done && next ? (
        <div className="mt-5 flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">{next}</div>
      ) : null}

      {pending ? (
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-ink/10">
          <div
            className="h-full bg-brand motion-safe:transition-[width] motion-safe:duration-500"
            style={{ width: `${Math.max(4, Math.round((finished / LOOKUP_SOURCES.length) * 100))}%` }}
          />
        </div>
      ) : null}
    </section>
  )
}

/**
 * After the check: the overall score, why it landed there (strongest and weakest area), and where we'd look first.
 * Shown under the rings rather than as a sixth ring.
 */
function OverallSummary({ score, firstLook }: { score: LookupScore; firstLook: LookupFinding | null }) {
  const overall = score.overall as number
  const scored = FACTORS.map((f) => ({ ...f, value: score.factors.find((x) => x.id === f.id)?.score ?? null })).filter(
    (f): f is (typeof FACTORS)[number] & { value: number } => f.value != null,
  )
  const strongest = scored.reduce<(typeof scored)[number] | null>((a, b) => (a && a.value >= b.value ? a : b), null)
  const weakest = scored.reduce<(typeof scored)[number] | null>((a, b) => (a && a.value <= b.value ? a : b), null)
  return (
    <div className="mt-6 rounded-xl bg-cream p-5">
      <p className="flex flex-wrap items-baseline gap-x-2 text-ink">
        <span aria-hidden className={`h-3 w-3 self-center rounded-full ${bandTone(overall).fill}`} />
        <span className="text-[18px] font-semibold">Overall score: {overall} out of 100</span>
        <span className="text-[14px] text-slate-600">
          (all five areas, with Digital Experience and Discoverability counting most)
        </span>
      </p>
      {strongest && weakest && strongest.id !== weakest.id ? (
        <p className="mt-2 text-[15px] leading-snug text-slate-700">
          Your strongest area is {strongest.label} ({strongest.value}). {weakest.label} ({weakest.value}) is pulling your
          score down the most.
        </p>
      ) : null}
      {firstLook ? (
        <p className="mt-2 text-[15px] leading-snug text-slate-700">
          <span className="font-semibold text-ink">Where we&apos;d look first: </span>
          {withStop(firstLook.text)}
        </p>
      ) : null}
    </div>
  )
}

function ScoreRing({ label, value, state }: { label: string; value: number | null; state: Phase }) {
  const r = 42
  const c = 2 * Math.PI * r
  const scored = state === "done" && value != null
  const shown = scored ? value : 0
  const tone = scored ? bandTone(value) : null
  const name =
    state === "done"
      ? value != null
        ? `${label}: ${value} out of 100`
        : `${label}: couldn't be scored`
      : `${label}: not checked yet`
  return (
    <>
      <span
        className="mb-2 flex min-h-[2.5em] items-end justify-center text-center text-[14px] font-medium leading-tight text-ink"
      >
        {label}
      </span>
      <div role="img" aria-label={name} className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-ink/10" />
          {tone ? (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - shown / 100)}
              className={`${tone.stroke} motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700`}
            />
          ) : null}
        </svg>
        <span
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center text-[26px] font-bold ${
            scored ? "text-ink" : "text-slate-500"
          }`}
        >
          {state === "done" && value == null ? "–" : shown}
        </span>
      </div>
    </>
  )
}

/**
 * After the check: what goes into each score, with this site's number beside it, so every score is explained where
 * it's shown (UX Doctrine §3.19).
 */
function ScoreFactors({ score }: { score: LookupScore | null }) {
  if (!score) return null
  return (
    <section aria-labelledby="score-factors-heading" className="mt-12 text-left">
      <h2 id="score-factors-heading" className="text-center text-[26px] font-bold leading-tight text-ink md:text-[32px]">
        What goes into your score
      </h2>
      <p className="mx-auto mt-2 max-w-[40rem] text-center text-[15px] leading-snug text-slate-600">
        Five areas, each scored 0 to 100 from what a customer can see on your public website. The overall score weights
        Digital Experience and Discoverability most.
      </p>
      <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {FACTORS.map(({ id, label, icon: Icon, counts }) => {
          const value = score.factors.find((f) => f.id === id)?.score ?? null
          return (
            <li key={id} className="flex flex-col items-center text-center">
              <Icon aria-hidden className="h-8 w-8 text-ink" strokeWidth={1.75} />
              <h3 className="mt-3 text-[18px] font-semibold text-ink">{label}</h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                {value != null ? (
                  <>
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${bandTone(value).fill}`} />
                    {value} out of 100
                  </>
                ) : (
                  <span className="font-normal text-slate-600">Couldn&apos;t be scored</span>
                )}
              </p>
              <p className="mt-2 max-w-[20rem] text-[14px] leading-snug text-slate-600">
                <span className="font-medium text-ink">What counts: </span>
                {counts}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function StepNumber({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${
        done ? "bg-green-700 text-white" : "bg-ink text-white"
      }`}
    >
      {done ? <Check className="h-4 w-4" /> : n}
    </span>
  )
}

/** Findings are written without a closing stop; add one unless the text already ends in punctuation or a quote. */
function withStop(text: string): string {
  return /[.!?”"’)]$/.test(text) ? text : `${text}.`
}

const TONE_LABEL: Record<LookupFinding["tone"], string> = { working: "In place", gap: "Gap", note: "Note" }

function LookupResults({
  state,
  next,
  onReset,
  detail = false,
}: {
  state: LookupState
  next?: React.ReactNode
  onReset: () => void
  /** Under the hero score card: the card carries the progress status and next steps, so this is the findings only. */
  detail?: boolean
}) {
  const pending = state.phase === "checking"
  const finished = Object.values(state.sources).filter(Boolean).length
  const statusLine =
    state.phase === "error"
      ? LOOKUP_ERROR_COPY[state.error ?? "server"]
      : pending
        ? `Checking ${state.domain ?? "your website"}: ${finished} of ${LOOKUP_SOURCES.length} done`
        : `Checked ${state.domain}`

  return (
    <section aria-label="Business lookup results" className="mt-5 rounded-2xl border border-ink/10 bg-white p-5">
      {detail ? (
        <p className="text-[15px] font-semibold text-ink">What we found</p>
      ) : (
        <p role="status" className={`text-[15px] font-semibold ${state.phase === "error" ? "text-red-700" : "text-ink"}`}>
          {statusLine}
        </p>
      )}
      {state.name && state.phase !== "error" ? <p className="mt-0.5 text-[14px] text-slate-600">{state.name}</p> : null}

      {state.phase !== "error" ? (
        <ul className="mt-4 divide-y divide-ink/[0.07]">
          {LOOKUP_SOURCES.map(({ id, label }) => {
            const result = state.sources[id]
            return (
              <li key={id} className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <SourceIcon status={result?.status} pending={pending} />
                  <span className="text-[15px] font-medium text-ink">{label}</span>
                  {result && result.status !== "done" ? (
                    <span className="ml-auto text-[13px] text-slate-600">{STATUS_COPY[result.status]}</span>
                  ) : !result && !pending ? (
                    <span className="ml-auto text-[13px] text-slate-600">Not checked</span>
                  ) : null}
                </div>
                {result?.findings.length ? (
                  <ul className="mt-1.5 space-y-1 pl-[26px]">
                    {result.findings.map((f) => (
                      <li key={f.id} className="flex gap-2 text-[14px] leading-snug text-slate-700">
                        <FindingIcon tone={f.tone} />
                        <span>
                          <span className="sr-only">{TONE_LABEL[f.tone]}: </span>
                          {withStop(f.text)} <span className="text-slate-500">({f.evidence})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}

      {state.phase === "done" ? (
        <>
          {state.firstLook && !detail ? (
            <div className="mt-4 rounded-xl border border-gold-from bg-gold-from/10 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-ink">
                Where we&apos;d look first
              </p>
              <p className="mt-1 text-[15px] leading-snug text-ink">{withStop(state.firstLook.text)}</p>
            </div>
          ) : null}
          <p className="mt-4 text-[13px] leading-snug text-slate-600">
            This free check reads your public pages and, when we can confirm it, your Google listing. Search rankings and ad activity aren&apos;t part of it.
          </p>
          {next ? (
            <div className="mt-4 flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
              {next}
            </div>
          ) : null}
        </>
      ) : null}

      {state.phase === "done" || state.phase === "error" ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-3 inline-flex min-h-11 items-center text-[15px] font-medium text-ink underline underline-offset-4 hover:text-brand"
        >
          Check another website
        </button>
      ) : null}
    </section>
  )
}

/** "Get the full report": opens the existing report popup with the looked-up website prefilled. */
export function LookupReportButton({ ctaId }: { ctaId: CtaId }) {
  const lookup = useContext(LookupContext)
  const viewRef = useCtaView<HTMLButtonElement>(ctaId)
  if (!lookup?.website) return null
  return (
    <button
      ref={viewRef}
      type="button"
      onClick={() => {
        trackCtaClick(ctaId)
        lookup.openReport()
      }}
      className={PRIMARY}
    >
      Email me the full report
    </button>
  )
}

/** "Or book a 30-minute call" under the lookup results. */
export function LookupBookButton({ ctaId }: { ctaId: CtaId }) {
  const lookup = useContext(LookupContext)
  return (
    <BookingLink
      source={lookup?.source ?? "lookup"}
      ctaId={ctaId}
      className="inline-flex min-h-11 items-center justify-center text-[16px] font-medium text-ink underline underline-offset-4 hover:text-brand"
    >
      Or book a 30-minute call
    </BookingLink>
  )
}

/**
 * "Check my business" anywhere a page has no lookup of its own (header, article and service-page CTAs): scrolls to and
 * focuses this page's canonical lookup when there is one, otherwise opens the homepage lookup (/#check-my-business).
 */
export function CheckMyBusinessLink({
  ctaId,
  className,
  children = "Check my business",
  onClick,
}: {
  ctaId: CtaId
  className?: string
  children?: React.ReactNode
  /** Called on click, after the CTA click is recorded. */
  onClick?: () => void
}) {
  const viewRef = useCtaView<HTMLAnchorElement>(ctaId)
  return (
    <a
      ref={viewRef}
      href={`/#${LOOKUP_ANCHOR}`}
      className={className}
      onClick={(event) => {
        trackCtaClick(ctaId)
        onClick?.()
        const target = document.getElementById(LOOKUP_ANCHOR)
        if (!target) return
        event.preventDefault()
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
        target.querySelector<HTMLInputElement>('input[name="website"]')?.focus({ preventScroll: true })
      }}
    >
      {children}
    </a>
  )
}
