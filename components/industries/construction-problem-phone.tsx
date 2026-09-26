"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { resolveVisitorLocality } from "@/lib/construction-locality"

type Scene = "roll" | "search" | "serp" | "ringing" | "voicemail" | "missed"

/** Raw jobsite stills from the construction hero video — not polished stock. */
const ROLL_SHOTS = [
  { src: "/industries/construction/roll/job-01.jpg", label: "IMG_2841" },
  { src: "/industries/construction/roll/job-02.jpg", label: "IMG_2847" },
  { src: "/industries/construction/roll/job-03.jpg", label: "IMG_2852" },
  { src: "/industries/construction/roll/job-04.jpg", label: "IMG_2860" },
  { src: "/industries/construction/roll/job-05.jpg", label: "IMG_2866" },
  { src: "/industries/construction/roll/job-06.jpg", label: "IMG_2871" },
  { src: "/industries/construction/roll/job-03.jpg", label: "IMG_2878" },
  { src: "/industries/construction/roll/job-05.jpg", label: "IMG_2884" },
] as const

const SCENE_MS: Record<Scene, number> = {
  roll: 4800,
  search: 5200,
  serp: 5200,
  ringing: 2800,
  voicemail: 2400,
  missed: 3400,
}

const ORDER: Scene[] = ["roll", "search", "serp", "ringing", "voicemail", "missed"]

const DEFAULT_METRO = "Los Angeles"

/**
 * Problem-section phone story:
 * scrolling jobsite camera roll → geo Google search → competitor SERP →
 * ringing → voicemail → Missed Call ×5.
 */
export function ConstructionProblemPhone() {
  const [scene, setScene] = useState<Scene>("roll")
  const [reduceMotion, setReduceMotion] = useState(false)
  const [metro, setMetro] = useState(DEFAULT_METRO)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const locality = await resolveVisitorLocality()
      if (!cancelled && locality.metro) setMetro(locality.metro)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setScene("serp")
      return
    }
    const t = window.setTimeout(() => {
      const i = ORDER.indexOf(scene)
      setScene(ORDER[(i + 1) % ORDER.length]!)
    }, SCENE_MS[scene])
    return () => window.clearTimeout(t)
  }, [scene, reduceMotion])

  const query = `complete home rebuild in ${metro}`

  return (
    <div className="mx-auto w-full max-w-[17.5rem] lg:mx-0 lg:max-w-none">
      <div
        className="relative mx-auto aspect-[9/17] w-full max-w-[15.5rem] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_28px_60px_-28px_rgba(15,30,46,0.55)] ring-1 ring-black/20"
        data-problem-scene={scene}
      >
        <Image
          src="/industries/construction/roll/job-04.jpg"
          alt=""
          fill
          className="object-cover opacity-40 blur-[2px]"
          sizes="160px"
          priority={false}
        />
        <div aria-hidden className="absolute inset-0 bg-ink/55" />

        {scene === "roll" && <CameraRollScene animate={!reduceMotion} />}
        {scene === "search" && (
          <GoogleSearchScene query={query} animate={!reduceMotion} />
        )}
        {scene === "serp" && <GoogleSerpScene query={query} metro={metro} />}
        {scene === "ringing" && <RingingScene />}
        {scene === "voicemail" && <VoicemailScene />}
        {scene === "missed" && <MissedCallsScene />}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-2 z-30 flex justify-center"
        >
          <span className="h-[3px] w-24 rounded-full bg-cream/35" />
        </div>
      </div>
    </div>
  )
}

function CameraRollScene({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink">
      <div className="relative z-20 shrink-0 bg-gradient-to-b from-ink via-ink/95 to-transparent px-3.5 pb-3 pt-3">
        <div className="flex items-center justify-between text-[10px] font-medium text-cream/65">
          <span>Recents</span>
          <span>Select</span>
        </div>
        <p className="mt-1.5 text-[15px] font-semibold tracking-tight text-cream">Camera Roll</p>
        <p className="mt-0.5 text-[11px] text-cream/45">247 photos · 0 shared</p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className={`grid grid-cols-2 gap-0.5 px-0.5 ${animate ? "construction-roll-scroll" : ""}`}
        >
          {[...ROLL_SHOTS, ...ROLL_SHOTS].map((shot, i) => (
            <div key={`${shot.label}-${i}`} className="relative aspect-[3/4] overflow-hidden bg-ink/80">
              <Image
                src={shot.src}
                alt=""
                fill
                className="object-cover opacity-95"
                sizes="120px"
              />
              <div aria-hidden className="absolute inset-0 bg-ink/15" />
              <span className="absolute bottom-1 left-1 rounded bg-ink/70 px-1 py-0.5 text-[8px] font-medium tabular-nums tracking-wide text-cream/80">
                {shot.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 shrink-0 bg-gradient-to-t from-ink via-ink/95 to-transparent px-4 pb-5 pt-8">
        <p className="text-center text-[11px] font-medium leading-snug text-cream/60">
          Best projects. Still on the phone.
        </p>
      </div>
    </div>
  )
}

function GoogleSearchScene({ query, animate }: { query: string; animate: boolean }) {
  const [typed, setTyped] = useState(animate ? "" : query)

  useEffect(() => {
    if (!animate) {
      setTyped(query)
      return
    }
    setTyped("")
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(query.slice(0, i))
      if (i >= query.length) window.clearInterval(id)
    }, 38)
    return () => window.clearInterval(id)
  }, [query, animate])

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-[#f8f9fa] pt-3 text-ink">
      <div className="flex items-center justify-between px-3.5 text-[10px] font-medium text-ink/45">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-[1px] bg-ink/35" />
          <span className="h-2 w-1 rounded-sm bg-ink/35" />
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <GoogleWordmark />
      </div>

      <div className="mx-3 mt-5 flex items-start gap-2 rounded-2xl border border-ink/10 bg-white px-3 py-2.5 shadow-[0_1px_6px_rgba(32,33,36,0.12)]">
        <SearchIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" />
        <p className="min-w-0 flex-1 text-[11px] leading-snug text-ink">
          {typed}
          {animate && typed.length < query.length ? (
            <span className="construction-search-caret ml-px inline-block h-3 w-[1.5px] translate-y-[1px] bg-brand align-middle" />
          ) : null}
        </p>
      </div>

      <div className="mx-3 mt-3 space-y-0 overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_rgba(32,33,36,0.08)]">
        {searchSuggestions(query).map((s) => (
          <div
            key={s}
            className="flex items-start gap-2.5 border-b border-ink/[0.06] px-3 py-2.5 last:border-b-0"
          >
            <SearchIcon className="mt-0.5 h-3 w-3 shrink-0 text-ink/30" />
            <p className="min-w-0 flex-1 text-[11px] leading-snug text-ink/70">{s}</p>
          </div>
        ))}
      </div>

      <p className="mt-auto px-4 pb-8 text-center text-[10px] font-medium leading-snug text-ink/40">
        Someone in {query.split(" in ").pop()} is looking right now.
      </p>
    </div>
  )
}

function searchSuggestions(query: string): string[] {
  const metro = query.split(" in ").pop() ?? "your area"
  return [
    query,
    `home renovation contractor ${metro}`,
    `best general contractor ${metro}`,
  ]
}

function GoogleSerpScene({ query, metro }: { query: string; metro: string }) {
  const results = [
    {
      rank: "Ad",
      title: "Your Competitor",
      url: `yourcompetitor.com · ${metro}`,
      blurb: `Full home rebuilds in ${metro}. Free estimates. Book this week.`,
      accent: true,
    },
    {
      rank: "1",
      title: "Competitor #2",
      url: `competitor2.com · rebuilds`,
      blurb: `Whole-home renovation · ${metro} · 200+ projects shown online.`,
      accent: false,
    },
    {
      rank: "2",
      title: "Newbie That Gets More Jobs",
      url: `newbietakesjobs.com`,
      blurb: `Newer company. Better ads. Showing up where homeowners search.`,
      accent: false,
    },
  ] as const

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white pt-3 text-ink">
      <div className="flex items-start gap-2 border-b border-ink/[0.08] px-2.5 pb-2.5">
        <GoogleG className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1 rounded-2xl bg-[#f1f3f4] px-2.5 py-1.5 text-[10px] leading-snug text-ink/85">
          {query}
        </div>
      </div>

      <div className="px-3 pt-2">
        <p className="text-[9px] text-ink/40">About 2,480,000 results</p>
      </div>

      <div className="mt-1 flex-1 space-y-3 overflow-hidden px-3 pb-2">
        {results.map((r) => (
          <div key={r.title} className="construction-serp-row">
            <div className="flex flex-wrap items-center gap-1.5">
              {r.rank === "Ad" ? (
                <span className="rounded px-1 py-px text-[8px] font-bold uppercase tracking-wide text-ink/55 ring-1 ring-ink/15">
                  Ad
                </span>
              ) : null}
              <p className="text-[9px] leading-snug text-ink/45">{r.url}</p>
            </div>
            <p className="mt-0.5 text-[13px] font-medium leading-snug tracking-tight text-[#1a0dab]">
              {r.title}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-ink/55">{r.blurb}</p>
          </div>
        ))}

        <div className="rounded-lg border border-dashed border-ink/15 bg-ink/[0.03] px-2.5 py-2">
          <p className="text-[10px] font-semibold text-ink/45">Your business</p>
          <p className="mt-0.5 text-[10px] leading-snug text-ink/35">
            Not on page 1 for “{query}”
          </p>
        </div>
      </div>

      <p className="px-3 pb-7 text-center text-[10px] font-medium leading-snug text-ink/40">
        They searched {metro}. They found everyone but you.
      </p>
    </div>
  )
}

function RingingScene() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-between px-5 pb-10 pt-14 text-cream">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/50">
          Incoming call
        </p>
        <div className="relative mx-auto mt-6 flex h-16 w-16 items-center justify-center">
          <span
            aria-hidden
            className="construction-call-ring absolute inset-0 rounded-full bg-brand/30"
          />
          <span
            aria-hidden
            className="construction-call-ring-delay absolute inset-[-6px] rounded-full bg-brand/15"
          />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cream/15 text-[22px] font-semibold ring-1 ring-cream/25 backdrop-blur-sm">
            ?
          </span>
        </div>
        <p className="mt-5 text-[20px] font-semibold tracking-tight">Unknown</p>
        <p className="mt-1 text-[13px] text-cream/55">mobile · estimate request</p>
        <p className="mt-3 text-[12px] font-medium text-gold-from">Ringing…</p>
      </div>

      <div className="flex w-full items-end justify-between px-2">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/90 text-cream shadow-lg">
            <PhoneIcon end />
          </span>
          <span className="text-[10px] text-cream/55">Decline</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/90 text-cream shadow-lg">
            <PhoneIcon />
          </span>
          <span className="text-[10px] text-cream/55">Accept</span>
        </div>
      </div>
    </div>
  )
}

function VoicemailScene() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-cream">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/10 ring-1 ring-cream/20">
        <VoicemailIcon />
      </div>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-cream/45">
        Call ended
      </p>
      <p className="mt-2 text-[18px] font-semibold tracking-tight">Sent to Voicemail</p>
      <p className="mt-2 max-w-[14rem] text-[12px] leading-relaxed text-cream/55">
        “Hi, we saw the remodel on Maple… calling about a quote. Can you call us back?”
      </p>
      <div className="mt-5 flex items-end gap-1" aria-hidden>
        {[4, 9, 6, 12, 7, 10, 5, 11, 8, 6, 9, 4].map((h, i) => (
          <span
            key={i}
            className="construction-vm-bar w-[3px] rounded-full bg-gold-from/80"
            style={{ height: h, animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] text-cream/40">New voicemail · 0:18</p>
    </div>
  )
}

function MissedCallsScene() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink/80 px-3.5 pt-10 text-cream backdrop-blur-md">
      <div className="text-center">
        <p className="text-[11px] font-medium text-cream/50">Tuesday</p>
        <p className="mt-0.5 text-[42px] font-light leading-none tracking-tight tabular-nums">9:41</p>
      </div>

      <div className="mt-8 space-y-2">
        <div className="construction-missed-pop rounded-[14px] bg-[rgba(255,255,255,0.92)] px-3 py-2.5 text-ink shadow-[0_8px_24px_-12px_rgba(15,30,46,0.45)]">
          <div className="flex items-start gap-2.5">
            <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-emerald-500 text-white">
              <PhoneIcon className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                5
              </span>
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-semibold leading-none">Phone</p>
                <p className="text-[10px] text-ink/40">now</p>
              </div>
              <p className="mt-1 text-[13px] font-semibold leading-snug tracking-tight">
                Missed Call ×5
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink/55">
                Unknown · estimate requests — none answered
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] bg-[rgba(255,255,255,0.72)] px-3 py-2 text-ink/80">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-violet-500 text-white">
              <VoicemailIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-semibold leading-none">Phone</p>
                <p className="text-[10px] text-ink/35">2m ago</p>
              </div>
              <p className="mt-1 text-[12px] font-medium leading-snug">1 New Voicemail</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-auto pb-8 text-center text-[11px] font-medium text-cream/45">
        Leads calling. Nobody picking up.
      </p>
    </div>
  )
}

function GoogleWordmark() {
  return (
    <p className="text-[28px] font-medium tracking-tight" aria-hidden>
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </p>
  )
}

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon({ end, className = "h-5 w-5" }: { end?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      style={end ? { transform: "rotate(135deg)" } : undefined}
    >
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.02l-2.2 2.19z" />
    </svg>
  )
}

function VoicemailIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="6.5" cy="12" r="3.5" />
      <circle cx="17.5" cy="12" r="3.5" />
      <path d="M6.5 15.5h11" strokeLinecap="round" />
    </svg>
  )
}
