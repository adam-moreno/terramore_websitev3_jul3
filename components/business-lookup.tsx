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
import { FIX_FOR_FINDING } from "@/lib/report/start-fix"
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
import { parseSocial, SOCIAL_PLATFORMS, type AddedSocial, type SocialPlatformId } from "@/lib/lookup/socials"

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

type LookupContextValue = { website: string | null; lookupId: string | null; source: string; openReport: (startFix?: string | null) => void }
const LookupContext = createContext<LookupContextValue | null>(null)

/** Rough client-side check so obvious typos get an inline error before any request. The server validates again. */
function looksLikeWebsite(value: string): boolean {
  const v = value.trim().replace(/^https?:\/\//i, "")
  return v.length >= 4 && !/\s/.test(v) && /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(v)
}

/** Posts to /api/lookup and hands each streamed event to `onEvent`. Throws TypeError when the connection fails. */
async function streamLookup(body: object, onEvent: (e: LookupEvent) => void) {
  const response = await fetch("/api/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
    for (const l of lines) if (l.trim()) onEvent(JSON.parse(l) as LookupEvent)
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer) as LookupEvent)
}

/** The hero journey after the first score: add socials, then advertising, then the full report and workspace. */
type Journey = "socials" | "ads" | "report"

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
  header,
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
  /**
   * "hero" only: the page headline, grouped with the field as one centred block above the score card. The block is
   * the logo orbit's centre (`data-hero-copy`).
   */
  header?: React.ReactNode
}) {
  const inputId = useId()
  const errorId = useId()
  const descId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)
  const [state, setState] = useState<LookupState>(EMPTY)
  const [reportOpen, setReportOpen] = useState(false)
  const [startFix, setStartFix] = useState<string | null>(null)
  const runRef = useRef(0)
  const viewRef = useCtaView<HTMLButtonElement>(ctaId)
  const [journey, setJourney] = useState<Journey>("socials")
  const [previousOverall, setPreviousOverall] = useState<number | null>(null)
  const [rescoring, setRescoring] = useState(false)
  const [rescoreError, setRescoreError] = useState<string | null>(null)

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
    setJourney("socials")
    setPreviousOverall(null)
    setRescoreError(null)
    // The hero's score card sits low on the page (it peeks at the fold), so bring it up as the check starts.
    if (variant === "hero") {
      requestAnimationFrame(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        document.getElementById("lookup-score")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
      })
    }

    const apply = (e: LookupEvent) => {
      current = reduce(current, e)
      if (run === runRef.current) setState(current)
    }

    try {
      await streamLookup({ website: value.trim() }, apply)
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

  /**
   * Re-scores with the profiles the visitor added. The first results stay on screen until the new score arrives; the
   * previous overall is kept so the card can say what changed.
   */
  async function addSocials(socials: AddedSocial[]) {
    if (rescoring || !state.website) return
    const before = state.score?.overall ?? null
    const run = ++runRef.current
    setRescoring(true)
    setRescoreError(null)
    let next: LookupState = { ...EMPTY, phase: "checking" }
    try {
      await streamLookup({ website: state.website, socials }, (e) => {
        next = reduce(next, e)
      })
    } catch (error) {
      next = { ...next, phase: "error", error: error instanceof TypeError ? "network" : "server" }
    }
    if (run !== runRef.current) return
    setRescoring(false)
    if (next.phase === "done") {
      setPreviousOverall(before)
      setState(next)
    } else {
      setRescoreError(LOOKUP_ERROR_COPY[next.error ?? "server"])
    }
  }

  function reset() {
    runRef.current++
    setJourney("socials")
    setPreviousOverall(null)
    setRescoring(false)
    setState(EMPTY)
    setValue("")
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const showResults = state.phase !== "idle" && !(state.phase === "error" && state.error === "invalid_website")
  // "Fix this" on a gap opens the same report request, remembering the gap so the report opens on that fix.
  const openReport = (fix?: string | null) => {
    setStartFix(fix ?? null)
    setReportOpen(true)
  }

  return (
    <LookupContext.Provider
      value={{ website: state.website, lookupId: state.lookupId, source, openReport }}
    >
      <div
        id={anchor ? LOOKUP_ANCHOR : undefined}
        data-lookup-variant={variant}
        className={`w-full scroll-mt-28 ${variant === "compact" ? "max-w-lg" : variant === "hero" ? "max-w-xl md:max-w-4xl" : "max-w-xl"} ${align === "center" ? "mx-auto" : ""}`}
      >
        {/*
          Hero: headline and search are one block, centred in the space above the score card. That space grows with
          the window so the idle rings sit on the fold, half showing (owner, 2026-10-09: a cue to scroll).
        */}
        <div
          className={
            variant === "hero"
              ? "md:flex md:min-h-[clamp(0px,calc(100svh-var(--hero-peek)),46rem)] md:flex-col md:justify-center [--hero-peek:470px]"
              : undefined
          }
        >
        <div data-hero-copy={variant === "hero" ? "" : undefined}>
        {header}
        <form
          noValidate
          onSubmit={submit}
          className={variant === "hero" ? `mt-6 md:mx-auto md:mt-8 md:max-w-xl [@media(min-width:768px)_and_(max-height:820px)]:mt-5` : undefined}
        >
          <label
            htmlFor={inputId}
            className={`block font-semibold text-ink ${variant === "compact" ? "text-[14px]" : "text-[15px]"} ${variant === "hero" ? "md:mx-auto md:max-w-[34rem] md:text-balance md:text-[20px] md:font-medium md:leading-[30px]" : ""} ${align === "center" ? "text-center" : ""}`}
          >
            Enter your website to check how customers find and reach your business.
          </label>
          <p
            id={descId}
            className={`mt-1 text-slate-600 ${variant === "compact" ? "text-[13px]" : "text-[14px]"} ${variant === "hero" ? "sr-only" : ""} ${align === "center" ? "text-center" : ""}`}
          >
            See what's working and what's missing across search basics, contact and booking, analytics and ad tags,
            social profiles, and your Google Maps listing.
          </p>
          <div className={`mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap ${variant === "hero" ? "md:mt-6" : ""}`}>
            {/* "https://" is shown, not typed: a pasted http(s):// is dropped, and with or without www both work. */}
            <div
              className={`flex min-h-12 w-full min-w-0 items-center rounded-full border bg-white pl-5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/40 sm:w-auto sm:min-w-[15rem] sm:flex-1 ${
                inputError ? "border-red-700" : "border-ink/55"
              }`}
            >
              <span aria-hidden className="select-none text-[16px] text-slate-600">
                https://
              </span>
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
                placeholder="yourbusiness.com"
                value={value}
                onFocus={() => trackFunnelEvent("lookup_input_focus", { cta_id: ctaId }, { once: ctaId })}
                onChange={(e) => {
                  const next = e.target.value.replace(/^\s*https?:\/\//i, "")
                  setValue(next)
                  if (inputError && looksLikeWebsite(next)) setInputError(null)
                }}
                aria-invalid={inputError ? true : undefined}
                aria-describedby={inputError ? `${descId} ${errorId}` : descId}
                className="min-h-12 w-full min-w-0 flex-1 rounded-r-full bg-transparent pr-5 text-[16px] text-ink placeholder:text-slate-500 focus-visible:outline-none"
              />
            </div>
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
        </div>
        </div>
        {variant === "hero" && !(state.phase === "error") ? (
          <>
            <ScoreCard state={state} journey={journey} previousOverall={previousOverall} />
            {state.phase === "done" ? (
              <>
                <JourneyStep
                  state={state}
                  journey={journey}
                  setJourney={setJourney}
                  rescoring={rescoring}
                  rescoreError={rescoreError}
                  previousOverall={previousOverall}
                  onAddSocials={addSocials}
                  next={next}
                />
                <ScoreFactors score={state.score} />
                <LookupResults state={state} onReset={reset} detail onFix={openReport} />
              </>
            ) : null}
          </>
        ) : showResults ? (
          <LookupResults state={state} next={next} onReset={reset} onFix={openReport} />
        ) : null}
      </div>
      <ReportPopup
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        direct
        entry="popup_lookup"
        startFix={startFix}
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
function ScoreCard({
  state,
  journey,
  previousOverall,
}: {
  state: LookupState
  journey: Journey
  previousOverall: number | null
}) {
  const idle = state.phase === "idle"
  const pending = state.phase === "checking"
  const done = state.phase === "done"
  const score = done ? state.score : null
  const finished = Object.values(state.sources).filter((r) => r && r.status !== "checking").length
  const factorScore = (id: string) => score?.factors.find((f) => f.id === id)?.score ?? null

  return (
    <section
      id="lookup-score"
      aria-label="Your score"
      className={`relative mt-8 scroll-mt-28 [@media(min-width:768px)_and_(max-height:820px)]:mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 text-left md:px-8 md:pb-8 md:pt-6 ${idle ? "hidden md:block" : ""}`}
    >
      <p className="text-[18px] font-semibold text-ink md:text-[20px]">Your score</p>
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

      <p className="mt-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[13px] text-slate-600">
        <span>Score scale:</span>
        {SCORE_BANDS.map((b, i) => (
          <span key={b.label} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${BAND_DOT[i]}`} />
            {b.label}
          </span>
        ))}
      </p>

      <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {FACTORS.map((f) => (
          <li key={f.id} className="flex flex-col items-center">
            <ScoreRing label={f.label} value={factorScore(f.id)} state={state.phase} />
          </li>
        ))}
      </ul>

      {score?.overall != null ? (
        <OverallSummary score={score} firstLook={state.firstLook} previousOverall={previousOverall} />
      ) : null}


      <JourneySteps current={done ? journey : null} />

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
function OverallSummary({
  score,
  firstLook,
  previousOverall,
}: {
  score: LookupScore
  firstLook: LookupFinding | null
  previousOverall: number | null
}) {
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
        {previousOverall != null && previousOverall !== overall ? (
          <span className="text-[15px] font-semibold text-ink">
            ({overall > previousOverall ? "up" : "down"} from {previousOverall})
          </span>
        ) : null}
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
        className="mb-2 flex min-h-[2.5em] items-end justify-center text-center text-[14px] font-medium leading-tight text-ink lg:min-h-0"
      >
        {label}
      </span>
      <div role="img" aria-label={name} className="relative h-24 w-24 shrink-0 lg:h-[5.25rem] lg:w-[5.25rem]">
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
 * The four steps: what each gives the owner, and what they share for it (their "level of investment"), which rises
 * one step at a time. Copy stays true to what's live: nothing here says a connection exists before it does.
 */
const JOURNEY_STEPS: ReadonlyArray<{ id: Journey | "score"; title: string; points: string[]; invest: string }> = [
  {
    id: "score",
    title: "Instant score",
    points: ["How a new customer finds your business, and what they see when they do.", "Free, right on this page. No email."],
    invest: "Your website",
  },
  {
    id: "socials",
    title: "Add your social profiles",
    points: [
      "More of where customers find you, and how your score changes.",
      "Connected later, it shows how your content brings customers in and keeps them.",
    ],
    invest: "+ Your social profiles",
  },
  {
    id: "ads",
    title: "Your advertising",
    points: [
      "Connect the ad accounts you've used, and see where your spend works and where it doesn't.",
      "New to ads? We'll explain what they can do and help you past the first hurdles.",
    ],
    invest: "+ Your ad accounts",
  },
  {
    id: "report",
    title: "Full report & Growth Workspace",
    points: [
      "Your email gets the free, in-depth report.",
      "Free access to your Growth Workspace. Connect 2 tools you already use, like Shopify, Square, Instagram, Facebook, Google Ads, Meta Ads or Google Analytics.",
    ],
    invest: "+ Your email",
  },
]

/**
 * How many steps the visitor's scroll has lit (0 to 4): the first lights as the row comes into view, the fourth by
 * the time it's a little above the middle of the screen. Driven by scroll, so it follows the visitor and never plays
 * on its own; colour changes only, no movement (reduced motion drops the transition).
 */
function useScrollLit(ref: React.RefObject<HTMLElement | null>, enabled: boolean, count: number) {
  const [lit, setLit] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const measure = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight
      const travelled = vh - el.getBoundingClientRect().top - 24
      // Owner, 2026-10-09: slower. About a sixth of the screen of scrolling per step; the fourth lights when the row
      // reaches the top third of the screen.
      const span = (vh * 0.7) / count
      setLit(Math.max(0, Math.min(count, Math.ceil(travelled / span))))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [ref, enabled, count])
  return lit
}

/**
 * The four steps under the score. Before a check, scrolling lights them in gold, 1 to 4, with the rising "level of
 * investment" above them. After a check they show real progress: done (green), current (blue), to come.
 */
function JourneySteps({ current }: { current: Journey | null }) {
  const listRef = useRef<HTMLOListElement>(null)
  const scrollLit = useScrollLit(listRef, current == null, JOURNEY_STEPS.length)
  const at = current ? JOURNEY_STEPS.findIndex((s) => s.id === current) : -1
  return (
    <div className="mt-5 border-t border-ink/10 pt-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600">Your level of investment</p>
      <ol ref={listRef} className="mt-2.5 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY_STEPS.map((step, i) => {
          const done = current != null && i < at
          const active = current != null && i === at
          const gold = current == null && i < scrollLit
          return (
            <li key={step.id} aria-current={active ? "step" : undefined}>
              <div className="flex items-end gap-2">
              <div aria-hidden className="flex h-4 items-end gap-0.5">
                {Array.from({ length: JOURNEY_STEPS.length }, (_, bar) => (
                  <span
                    key={bar}
                    className={`w-1.5 rounded-sm motion-safe:transition-colors motion-safe:duration-700 ${
                      bar <= i ? (gold || done || active ? "bg-gold-from" : "bg-ink/25") : "bg-ink/[0.07]"
                    }`}
                    style={{ height: `${(bar + 1) * 25}%` }}
                  />
                ))}
              </div>
              <p className="text-[13px] font-medium leading-none text-slate-600">{step.invest}</p>
              </div>
              <div className="mt-2.5 flex gap-3">
                <StepNumber n={i + 1} done={done} active={active} gold={gold} />
                <div>
                  <p className="text-[16px] font-semibold leading-snug text-ink">{step.title}</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-2 text-[14px] leading-snug text-slate-700">
                        <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const ADS_OPTIONS = [
  { id: "google", label: "Google Ads" },
  { id: "meta", label: "Facebook & Instagram ads" },
  { id: "tiktok", label: "TikTok ads" },
  { id: "other", label: "Somewhere else" },
] as const

/**
 * The step after the score: one question at a time, each optional. Socials re-score here (no email); advertising
 * points to the Growth Workspace, where ad accounts would be connected; the last step is the full report, which is
 * where an email (and the workspace account) comes in.
 */
function JourneyStep({
  state,
  journey,
  setJourney,
  rescoring,
  rescoreError,
  previousOverall,
  onAddSocials,
  next,
}: {
  state: LookupState
  journey: Journey
  setJourney: (j: Journey) => void
  rescoring: boolean
  rescoreError: string | null
  previousOverall: number | null
  onAddSocials: (socials: AddedSocial[]) => void
  next?: React.ReactNode
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)
  // Moving to the next question moves focus to its heading, so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [journey])

  return (
    <section
      aria-labelledby="journey-heading"
      className="mt-6 rounded-2xl border-2 border-ink bg-white p-5 text-left md:p-8"
    >
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        Step {JOURNEY_STEPS.findIndex((s) => s.id === journey) + 1} of {JOURNEY_STEPS.length}
      </p>
      {journey === "socials" ? (
        <SocialsStep
          headingRef={headingRef}
          score={state.score}
          rescoring={rescoring}
          rescoreError={rescoreError}
          updated={previousOverall != null}
          previousOverall={previousOverall}
          onAdd={onAddSocials}
          onNext={() => setJourney("ads")}
        />
      ) : journey === "ads" ? (
        <AdsStep headingRef={headingRef} onNext={() => setJourney("report")} onBack={() => setJourney("socials")} />
      ) : (
        <>
          <h3 id="journey-heading" ref={headingRef} tabIndex={-1} className="mt-1 text-[22px] font-bold text-ink focus:outline-none">
            Get your full report and free Growth Workspace
          </h3>
          <p className="mt-2 max-w-[44rem] text-[15px] leading-snug text-slate-700">
            We&apos;ll email the full Digital Footprint report for {state.domain}: the evidence behind every score, how you
            compare, and the top five things we&apos;d fix first. It opens your free Growth Workspace, where your accounts
            can be connected.
          </p>
          {next ? (
            <div className="mt-5 flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
              {next}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setJourney("ads")}
            className="mt-3 inline-flex min-h-11 items-center text-[14px] font-medium text-ink/70 underline underline-offset-4 hover:text-ink"
          >
            Back to advertising
          </button>
        </>
      )}
    </section>
  )
}

function SocialsStep({
  headingRef,
  score,
  rescoring,
  rescoreError,
  updated,
  previousOverall,
  onAdd,
  onNext,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>
  score: LookupScore | null
  rescoring: boolean
  rescoreError: string | null
  updated: boolean
  previousOverall: number | null
  onAdd: (socials: AddedSocial[]) => void
  onNext: () => void
}) {
  const linked = new Set(score?.profilesLinked ?? [])
  const added = new Set(score?.profilesAdded ?? [])
  const open = SOCIAL_PLATFORMS.filter((p) => !linked.has(p.id))
  const [values, setValues] = useState<Partial<Record<SocialPlatformId, string>>>({})
  const [errors, setErrors] = useState<Partial<Record<SocialPlatformId, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const fieldRefs = useRef<Partial<Record<SocialPlatformId, HTMLInputElement | null>>>({})
  const formErrorId = useId()

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (rescoring) return
    const nextErrors: Partial<Record<SocialPlatformId, string>> = {}
    const socials: AddedSocial[] = []
    for (const p of open) {
      const raw = values[p.id]?.trim()
      if (!raw) continue
      const parsed = parseSocial(p.id, raw)
      if (parsed) socials.push(parsed)
      else nextErrors[p.id] = `That doesn't look like a ${p.label} account name. Try the name after the @.`
    }
    setErrors(nextErrors)
    const firstBad = open.find((p) => nextErrors[p.id])
    if (firstBad) {
      setFormError(null)
      fieldRefs.current[firstBad.id]?.focus()
      return
    }
    if (!socials.length) {
      setFormError(linked.size ? "Add an account name, or choose \"That's all of them\"." : "Add at least one account name, or choose \"I don't use social media\".")
      return
    }
    setFormError(null)
    onAdd(socials)
  }

  const overall = score?.overall
  return (
    <>
      <h3 id="journey-heading" ref={headingRef} tabIndex={-1} className="mt-1 text-[22px] font-bold text-ink focus:outline-none">
        {linked.size ? "We found your social profiles. Any others?" : "Do you have social media accounts?"}
      </h3>
      <p className="mt-2 max-w-[44rem] text-[15px] leading-snug text-slate-700">
        {linked.size
          ? "These are linked from your website and already count. Add any others you use, or carry on."
          : "Add the ones you use, even if it\u2019s just one. Each profile counts toward Discoverability, so adding them can raise your score."}{" "}
        We don&apos;t post or sign in to anything.
      </p>

      {linked.size || added.size ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {SOCIAL_PLATFORMS.filter((p) => linked.has(p.id) || added.has(p.id)).map((p) => (
            <li key={p.id} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-[14px] text-ink">
              <Check aria-hidden className="h-4 w-4 text-green-700" />
              {p.label}: {linked.has(p.id) ? "found on your site, already counted" : "added by you, counted"}
            </li>
          ))}
        </ul>
      ) : null}

      {updated && overall != null ? (
        <p role="status" className="mt-4 rounded-xl bg-cream p-4 text-[15px] leading-snug text-ink">
          {previousOverall != null && overall !== previousOverall ? (
            <>
              <span className="font-semibold">
                Your score went {overall > previousOverall ? "up" : "down"} from {previousOverall} to {overall}.
              </span>{" "}
            </>
          ) : (
            <>
              <span className="font-semibold">Your score stayed at {overall}.</span>{" "}
            </>
          )}
          {added.size
            ? "Link these profiles from your website too, so visitors and search engines can find them."
            : null}
        </p>
      ) : null}

      {open.length ? (
        <form noValidate onSubmit={submit} className="mt-5" aria-describedby={formError ? formErrorId : undefined}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {open.map((p) => {
              const id = `social-${p.id}`
              const errId = `${id}-error`
              const visible = p.id === "facebook" ? "facebook.com/" : p.id === "linkedin" ? "linkedin.com/company/" : "@"
              return (
                <div key={p.id}>
                  <label htmlFor={id} className="block text-[15px] font-medium text-ink">
                    {p.label} <span className="font-normal text-slate-600">(optional)</span>
                  </label>
                  <div
                    className={`mt-1.5 flex min-h-12 items-center rounded-xl border bg-white pl-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/40 ${
                      errors[p.id] ? "border-red-700" : "border-ink/55"
                    }`}
                  >
                    <span aria-hidden className="select-none text-[16px] text-slate-600">
                      {visible}
                    </span>
                    <input
                      ref={(el) => {
                        fieldRefs.current[p.id] = el
                      }}
                      id={id}
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      autoComplete="off"
                      placeholder="accountname"
                      value={values[p.id] ?? ""}
                      onChange={(e) => {
                        // The prefix is shown, not typed: a leading "@" is dropped, and a pasted profile link becomes
                        // its account name.
                        const raw = e.target.value
                        const parsed = /[/.]com\b|^https?:/i.test(raw) ? parseSocial(p.id, raw) : null
                        const next = parsed ? parsed.handle : raw.replace(/^\s*@/, "")
                        setValues((v) => ({ ...v, [p.id]: next }))
                        if (errors[p.id] && parseSocial(p.id, next)) setErrors((x) => ({ ...x, [p.id]: undefined }))
                      }}
                      aria-invalid={errors[p.id] ? true : undefined}
                      aria-describedby={errors[p.id] ? errId : undefined}
                      className="min-h-12 w-full min-w-0 flex-1 bg-transparent pr-3 text-[16px] text-ink placeholder:text-slate-500 focus-visible:outline-none"
                    />
                  </div>
                  {errors[p.id] ? (
                    <p id={errId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[14px] text-red-700">
                      <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                      {errors[p.id]}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
          {formError || rescoreError ? (
            <p id={formErrorId} role="alert" className="mt-3 flex items-start gap-1.5 text-[15px] text-red-700">
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              {formError ?? rescoreError}
            </p>
          ) : null}
          <div className="mt-5 flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:items-center">
            {updated ? (
              <>
                <button type="button" onClick={onNext} className={PRIMARY}>
                  Next: your advertising
                </button>
                <button
                  type="submit"
                  disabled={rescoring}
                  className="inline-flex min-h-11 items-center justify-center text-[16px] font-medium text-ink underline underline-offset-4 hover:text-brand"
                >
                  {rescoring ? "Updating…" : "Update my score again"}
                </button>
              </>
            ) : (
              <>
                <button type="submit" disabled={rescoring} className={PRIMARY}>
                  {rescoring ? (
                    <>
                      <Loader2 aria-hidden className="h-4 w-4 motion-safe:animate-spin" />
                      Updating your score…
                    </>
                  ) : (
                    "Update my score"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex min-h-11 items-center justify-center text-[16px] font-medium text-ink underline underline-offset-4 hover:text-brand"
                >
                  {linked.size ? "That\u2019s all of them" : "I don\u2019t use social media"}
                </button>
              </>
            )}
          </div>
        </form>
      ) : (
        <div className="mt-5">
          <p className="text-[15px] text-slate-700">Every profile we look for is already linked from your site.</p>
          <button type="button" onClick={onNext} className={`mt-4 ${PRIMARY}`}>
            Next: your advertising
          </button>
        </div>
      )}
    </>
  )
}

function AdsStep({
  headingRef,
  onNext,
  onBack,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onNext: () => void
  onBack: () => void
}) {
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [notYet, setNotYet] = useState(false)
  const answered = notYet || picked.size > 0
  const names = ADS_OPTIONS.filter((o) => picked.has(o.id) && o.id !== "other").map((o) => o.label)
  return (
    <>
      <h3 id="journey-heading" ref={headingRef} tabIndex={-1} className="mt-1 text-[22px] font-bold text-ink focus:outline-none">
        Have you advertised before?
      </h3>
      <fieldset className="mt-4">
        <legend className="text-[15px] text-slate-700">Choose all that apply.</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ADS_OPTIONS.map((o) => {
            const on = picked.has(o.id)
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setNotYet(false)
                  setPicked((prev) => {
                    const next = new Set(prev)
                    if (next.has(o.id)) next.delete(o.id)
                    else next.add(o.id)
                    return next
                  })
                }}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] font-medium ${
                  on ? "border-ink bg-ink text-white" : "border-ink/40 bg-white text-ink hover:border-ink"
                }`}
              >
                {on ? <Check aria-hidden className="h-4 w-4" /> : null}
                {o.label}
              </button>
            )
          })}
          <button
            type="button"
            aria-pressed={notYet}
            onClick={() => {
              setPicked(new Set())
              setNotYet((v) => !v)
            }}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] font-medium ${
              notYet ? "border-ink bg-ink text-white" : "border-ink/40 bg-white text-ink hover:border-ink"
            }`}
          >
            {notYet ? <Check aria-hidden className="h-4 w-4" /> : null}
            Not yet
          </button>
        </div>
      </fieldset>
      {answered ? (
        <p role="status" className="mt-4 max-w-[44rem] rounded-xl bg-cream p-4 text-[15px] leading-snug text-ink">
          {notYet
            ? "Good to know. Your full report shows the first moves we'd make, with or without ads."
            : `Your free Growth Workspace is where ${
                names.length ? names.join(" and ") : "your ad accounts"
              } can be connected, so you can see what your ads actually bring in. We'll help you set it up.`}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:items-center">
        <button type="button" onClick={onNext} disabled={!answered} className={PRIMARY}>
          Next: your full report
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center justify-center text-[16px] font-medium text-ink underline underline-offset-4 hover:text-brand"
        >
          Back to social profiles
        </button>
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

function StepNumber({
  n,
  done,
  active = false,
  gold = false,
}: {
  n: number
  done: boolean
  active?: boolean
  /** Lit by scroll before a check: gold fill, ink number (gold is an accent, never text on light). */
  gold?: boolean
}) {
  return (
    <span
      aria-hidden
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold motion-safe:transition-colors motion-safe:duration-700 ${
        done
          ? "bg-green-700 text-white"
          : active
            ? "bg-brand text-white ring-4 ring-brand/20"
            : gold
              ? "bg-gold-from text-ink ring-4 ring-gold-from/25"
              : "bg-ink text-white"
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
  onFix,
  detail = false,
}: {
  state: LookupState
  next?: React.ReactNode
  onReset: () => void
  /** "Fix this" on a gap the report can fix: opens the report request on that fix. */
  onFix?: (fix: string) => void
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

      {/* The next step sits above the findings (owner, 2026-10-13): nobody should scroll the whole list to find it. */}
      {state.phase === "done" && next ? (
        <div className="mt-4 rounded-xl bg-cream p-4">
          <p className="text-[15px] leading-snug text-ink">
            The full report lists each fix step by step, with the time it takes. Most can be done for you.
          </p>
          <div className="mt-3 flex flex-col items-stretch gap-x-5 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">{next}</div>
        </div>
      ) : null}

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
                    {result.findings.map((f) => {
                      const fix = f.tone === "gap" && onFix && state.phase === "done" ? FIX_FOR_FINDING[f.id] : undefined
                      return (
                        <li key={f.id} className="flex gap-2 text-[14px] leading-snug text-slate-700">
                          <FindingIcon tone={f.tone} />
                          <span>
                            <span className="sr-only">{TONE_LABEL[f.tone]}: </span>
                            {withStop(f.text)} <span className="text-slate-500">({f.evidence})</span>
                            {fix ? (
                              <>
                                {" "}
                                {/* Inline so the sentence keeps its line height; the ::after box gives a 44px tap target. */}
                                <button
                                  type="button"
                                  onClick={() => onFix?.(fix)}
                                  className="relative inline font-semibold text-brand underline underline-offset-4 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                                >
                                  Fix this
                                </button>
                              </>
                            ) : null}
                          </span>
                        </li>
                      )
                    })}
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
            Your free score reads your public pages and, when we can confirm it, your Google listing. Search rankings and ad activity aren&apos;t part of it.
          </p>
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
        lookup.openReport(null)
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
      Or book a free call
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
