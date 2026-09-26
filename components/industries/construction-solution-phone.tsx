"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { resolveVisitorLocality } from "@/lib/construction-locality"

type Scene = "publish" | "devices" | "rank" | "booked" | "revenue"

const ROLL_SHOTS = [
  { src: "/industries/construction/roll/job-01.jpg", stamp: "On site" },
  { src: "/industries/construction/roll/job-02.jpg", stamp: "In ads" },
  { src: "/industries/construction/roll/job-04.jpg", stamp: "GBP" },
  { src: "/industries/construction/roll/job-05.jpg", stamp: "Case study" },
  { src: "/industries/construction/roll/job-03.jpg", stamp: "Posted" },
  { src: "/industries/construction/roll/job-06.jpg", stamp: "Live" },
] as const

const DEVICES = [
  { id: "tv", label: "TV", src: "/industries/construction/roll/job-01.jpg", frame: "aspect-[16/10]" },
  { id: "laptop", label: "Laptop", src: "/industries/construction/roll/job-04.jpg", frame: "aspect-[16/10]" },
  { id: "phone", label: "Phone", src: "/industries/construction/roll/job-02.jpg", frame: "aspect-[9/14]" },
  { id: "ipad", label: "iPad", src: "/industries/construction/roll/job-05.jpg", frame: "aspect-[4/3]" },
] as const

const SCENE_MS: Record<Scene, number> = {
  publish: 4000,
  devices: 4800,
  rank: 4800,
  booked: 3600,
  revenue: 4000,
}

const ORDER: Scene[] = ["publish", "devices", "rank", "booked", "revenue"]

const DEFAULT_METRO = "Los Angeles"

/**
 * Solution-section phone: proof published → stay visible to the same household across
 * TV / laptop / phone / iPad while they decide → you rank locally → estimate booked → revenue.
 * Metro names always render in full (no CSS ellipsis on place names).
 */
export function ConstructionSolutionPhone() {
  const [scene, setScene] = useState<Scene>("publish")
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
      setScene("devices")
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
        className="relative mx-auto aspect-[9/17] w-full max-w-[15.5rem] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_28px_60px_-28px_rgba(15,30,46,0.55)] ring-1 ring-white/15"
        data-solution-scene={scene}
      >
        <Image
          src="/industries/construction/roll/job-01.jpg"
          alt=""
          fill
          className="object-cover opacity-35 blur-[2px]"
          sizes="160px"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/50" />

        {scene === "publish" && <PublishScene animate={!reduceMotion} />}
        {scene === "devices" && <DevicesScene metro={metro} animate={!reduceMotion} />}
        {scene === "rank" && <RankScene query={query} metro={metro} />}
        {scene === "booked" && <BookedScene metro={metro} />}
        {scene === "revenue" && <RevenueScene metro={metro} />}

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

function PublishScene({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink">
      <div className="relative z-20 shrink-0 px-3.5 pb-2 pt-3">
        <div className="flex items-center justify-between text-[10px] font-medium text-cream/65">
          <span>Library</span>
          <span className="text-emerald-300/90">Synced</span>
        </div>
        <p className="mt-1.5 text-[15px] font-semibold tracking-tight text-cream">Proof → channels</p>
        <p className="mt-0.5 text-[11px] text-cream/45">6 assets live · 0 stuck on phone</p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className={`grid grid-cols-2 gap-0.5 px-0.5 ${animate ? "construction-roll-scroll" : ""}`}>
          {[...ROLL_SHOTS, ...ROLL_SHOTS].map((shot, i) => (
            <div key={`${shot.stamp}-${i}`} className="relative aspect-[3/4] overflow-hidden bg-ink/80">
              <Image src={shot.src} alt="" fill className="object-cover" sizes="120px" />
              <div aria-hidden className="absolute inset-0 bg-ink/10" />
              <span className="absolute bottom-1.5 left-1.5 rounded bg-emerald-500/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.06em] text-white">
                {shot.stamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 shrink-0 bg-gradient-to-t from-ink via-ink/95 to-transparent px-4 pb-5 pt-8">
        <p className="text-center text-[11px] font-medium leading-snug text-cream/65">
          Jobsite proof. Working for you.
        </p>
      </div>
    </div>
  )
}

function DevicesScene({ metro, animate }: { metro: string; animate: boolean }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink px-3 pt-3 text-cream">
      <div className="shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-from">
          Staying visible
        </p>
        <p className="mt-1.5 text-[14px] font-semibold tracking-tight leading-snug">
          One homeowner in {metro}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-cream/50">
          Same ad · TV · laptop · phone · iPad
        </p>
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 content-start">
        {DEVICES.map((d, i) => (
          <div
            key={d.id}
            className={`construction-device-card flex flex-col ${animate ? "" : ""}`}
            style={animate ? { animationDelay: `${i * 0.12}s` } : undefined}
          >
            <div
              className={`relative w-full overflow-hidden rounded-md bg-ink ring-1 ring-white/20 ${d.frame} ${
                d.id === "tv" || d.id === "laptop" ? "rounded-sm" : "rounded-lg"
              }`}
            >
              <Image src={d.src} alt="" fill className="object-cover opacity-95" sizes="80px" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute bottom-1 left-1 rounded bg-brand/95 px-1 py-px text-[7px] font-bold uppercase tracking-wide text-white">
                Ad
              </span>
              {animate ? (
                <span
                  aria-hidden
                  className="construction-device-pulse absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ) : null}
            </div>
            {d.id === "tv" || d.id === "laptop" ? (
              <span aria-hidden className="mx-auto mt-0.5 h-0.5 w-8 rounded-full bg-white/25" />
            ) : null}
            <p className="mt-1 text-center text-[9px] font-medium text-cream/55">{d.label}</p>
          </div>
        ))}
      </div>

      <p className="shrink-0 pb-7 pt-2 text-center text-[10px] font-medium leading-snug text-cream/50">
        Still in front of them while they decide.
      </p>
    </div>
  )
}

function RankScene({ query, metro }: { query: string; metro: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white pt-3 text-ink">
      <div className="flex items-start gap-2 border-b border-ink/[0.08] px-2.5 pb-2.5">
        <GoogleG className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1 rounded-2xl bg-[#f1f3f4] px-2.5 py-1.5 text-[10px] leading-snug text-ink/85">
          {query}
        </div>
      </div>

      <div className="px-3 pt-2">
        <p className="text-[9px] leading-snug text-ink/40">People also search in {metro}</p>
      </div>

      <div className="mt-1 flex-1 space-y-2.5 overflow-hidden px-3 pb-2">
        <div className="construction-serp-row rounded-lg bg-brand/[0.06] p-2 ring-1 ring-brand/25">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-brand px-1 py-px text-[8px] font-bold uppercase tracking-wide text-white">
              Ad
            </span>
            <p className="text-[9px] leading-snug text-ink/45">yourcompany.com · {metro}</p>
          </div>
          <p className="mt-0.5 text-[13px] font-semibold leading-snug tracking-tight text-[#1a0dab]">
            Your Company
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-ink/55">
            Whole-home rebuilds in {metro}. Real project photos. Book an estimate.
          </p>
          <p className="mt-1.5 text-[10px] font-semibold text-brand">Call · Get quote</p>
        </div>

        <div className="opacity-45">
          <p className="text-[9px] text-ink/45">yourcompetitor.com</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#1a0dab]">Your Competitor</p>
          <p className="mt-0.5 text-[10px] text-ink/50">Still advertising — below you.</p>
        </div>

        <div className="opacity-35">
          <p className="text-[9px] text-ink/45">newbietakesjobs.com</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#1a0dab]">Newbie That Gets More Jobs</p>
          <p className="mt-0.5 text-[10px] text-ink/50">Not anymore.</p>
        </div>
      </div>

      <p className="px-3 pb-7 text-center text-[10px] font-medium leading-snug text-ink/40">
        Same search in {metro}. You&apos;re the answer.
      </p>
    </div>
  )
}

function BookedScene({ metro }: { metro: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink/85 px-3.5 pt-10 text-cream backdrop-blur-md">
      <div className="text-center">
        <p className="text-[11px] font-medium text-cream/50">Tuesday</p>
        <p className="mt-0.5 text-[42px] font-light leading-none tracking-tight tabular-nums">9:41</p>
      </div>

      <div className="mt-8 space-y-2">
        <div className="construction-missed-pop rounded-[14px] bg-[rgba(255,255,255,0.94)] px-3 py-2.5 text-ink shadow-[0_8px_24px_-12px_rgba(15,30,46,0.45)]">
          <div className="flex items-start gap-2.5">
            <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-emerald-500 text-white">
              <PhoneIcon className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[8px] font-bold text-white ring-2 ring-white">
                ✓
              </span>
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-semibold leading-none">Phone</p>
                <p className="text-[10px] text-ink/40">now</p>
              </div>
              <p className="mt-1 text-[13px] font-semibold leading-snug tracking-tight">
                Answered · Estimate set
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink/55">
                {metro} remodel · tomorrow 10:00 AM
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] bg-[rgba(255,255,255,0.78)] px-3 py-2 text-ink/85">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#006BFF] text-white text-[10px] font-bold">
              C
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-semibold leading-none">Calendly</p>
                <p className="text-[10px] text-ink/35">1m ago</p>
              </div>
              <p className="mt-1 text-[12px] font-medium leading-snug">Meeting booked — {metro}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-auto pb-8 text-center text-[11px] font-medium text-cream/50">
        Lead called. System answered.
      </p>
    </div>
  )
}

function RevenueScene({ metro }: { metro: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink px-3.5 pt-10 text-cream">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold-from">This month</p>
        <p className="mt-2 text-[13px] leading-snug text-cream/55">{metro} pipeline</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <p className="text-[11px] font-medium text-cream/45">Closed from system</p>
        <p className="mt-1 text-[28px] font-semibold tracking-tight tabular-nums text-cream">
          $186k
        </p>
        <p className="mt-1 text-[11px] text-cream/50">2 rebuilds · 1 addition</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="construction-revenue-bar h-full w-[72%] rounded-full bg-gradient-to-r from-gold-from to-brand" />
        </div>
        <p className="mt-2 text-[10px] text-cream/40">vs referral-only baseline</p>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-cream">Whole-home rebuild</p>
            <p className="text-[10px] leading-snug text-cream/45">
              Cross-device ads in {metro} · won
            </p>
          </div>
          <p className="shrink-0 text-[12px] font-semibold tabular-nums text-emerald-300">$124k</p>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-cream">Kitchen + bath</p>
            <p className="text-[10px] leading-snug text-cream/45">Search · follow-up → won</p>
          </div>
          <p className="shrink-0 text-[12px] font-semibold tabular-nums text-emerald-300">$62k</p>
        </div>
      </div>

      <p className="mt-auto pb-8 text-center text-[11px] font-medium text-cream/50">
        Proof → visibility → booked → revenue.
        <span className="mt-0.5 block text-cream/50">Illustrative example</span>
      </p>
    </div>
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

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.02l-2.2 2.19z" />
    </svg>
  )
}
