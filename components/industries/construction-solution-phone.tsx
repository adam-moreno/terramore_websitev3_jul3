"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from "react"
import { resolveVisitorLocality } from "@/lib/construction-locality"

type SceneId = "film" | "portfolio" | "website" | "search" | "advertise" | "followup" | "outcome"

type Step = {
  n: string
  cue: string
  title: string
  body: string
  scenes: readonly { id: SceneId; ms: number }[]
}

/** Terramore's working order. Each step builds on the one before it, so the list and phone stay sequential. */
const STEPS: readonly Step[] = [
  {
    n: "01",
    cue: "Film",
    title: "We film your jobs.",
    body: "A Terramore videographer shoots on site: the crew, the progress, the finished work.",
    scenes: [{ id: "film", ms: 5200 }],
  },
  {
    n: "02",
    cue: "Portfolio",
    title: "Footage becomes proof.",
    body: "We edit it into project stories and before-and-afters homeowners actually look at.",
    scenes: [{ id: "portfolio", ms: 4600 }],
  },
  {
    n: "03",
    cue: "Website",
    title: "Your site shows the work.",
    body: "We upgrade your website around real projects, with a clear way to request an estimate.",
    scenes: [{ id: "website", ms: 4600 }],
  },
  {
    n: "04",
    cue: "Search",
    title: "Found on Google and ChatGPT.",
    body: "We make you searchable where homeowners look for a contractor in your area.",
    scenes: [{ id: "search", ms: 5600 }],
  },
  {
    n: "05",
    cue: "Advertise",
    title: "Your footage runs as ads.",
    body: "We run ads with your own project video to homeowners nearby.",
    scenes: [{ id: "advertise", ms: 4600 }],
  },
  {
    n: "06",
    cue: "Follow-up",
    title: "Every lead gets answered.",
    body: "Inquiries get an instant reply, your team gets notified, and estimates get booked.",
    scenes: [
      { id: "followup", ms: 5200 },
      { id: "outcome", ms: 4600 },
    ],
  },
]

const DEFAULT_METRO = "Los Angeles"
const PROJECT = "Whole-home rebuild"
const VIDEO_SRC = "/industries/construction/hero-portrait.mp4?v=0921"
const POSTER_SRC = "/industries/construction/hero-poster.jpg?v=0921"

/** One project's footage threads through every scene: in-progress stills + finished aerials. */
const SHOTS = {
  during: "/industries/construction/roll/job-05.jpg",
  duringAlt: "/industries/construction/roll/job-02.jpg",
  detail: "/industries/construction/roll/job-03.jpg",
  after: "/industries/construction/roll/job-01.jpg",
  aerial: "/industries/construction/roll/job-04.jpg",
  afterAlt: "/industries/construction/roll/job-06.jpg",
} as const

function stepDuration(step: Step) {
  return step.scenes.reduce((sum, scene) => sum + scene.ms, 0)
}

function sceneIndexAt(step: Step, elapsed: number) {
  let end = 0
  for (let i = 0; i < step.scenes.length; i++) {
    end += step.scenes[i]!.ms
    if (elapsed < end) return i
  }
  return step.scenes.length - 1
}

/**
 * Solution section: Terramore's 6-step working timeline, one phone scene per step.
 * One whole-home rebuild in the visitor's metro flows through every scene:
 * filmed → portfolio → website → Google / ChatGPT → ads → follow-up → booked (illustrative).
 * The phone auto-advances and loops; the numbered list highlights the active step and
 * jumps the phone when clicked. Auto-advance pauses on mouse hover, keyboard focus, and
 * offscreen. Reduced motion: no auto-advance, step 06 shows its static booked outcome.
 * Metro names always render in full (no CSS ellipsis on place names).
 */
export function ConstructionSolutionTimeline() {
  const [position, setPosition] = useState({ step: 0, scene: 0 })
  const [reduceMotion, setReduceMotion] = useState(false)
  const [metro, setMetro] = useState(DEFAULT_METRO)

  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const stepRef = useRef(0)
  const elapsedRef = useRef(0)
  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)
  const visibleRef = useRef(true)

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
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry?.isIntersecting ?? true
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      // Clamp so a backgrounded tab doesn't skip steps on return.
      const dt = Math.min(now - last, 100)
      last = now
      if (!hoveredRef.current && !focusedRef.current && visibleRef.current) {
        elapsedRef.current += dt
        const step = STEPS[stepRef.current]!
        if (elapsedRef.current >= stepDuration(step)) {
          stepRef.current = (stepRef.current + 1) % STEPS.length
          elapsedRef.current = 0
          setPosition({ step: stepRef.current, scene: 0 })
        } else {
          const scene = sceneIndexAt(step, elapsedRef.current)
          setPosition((p) => (p.scene === scene ? p : { step: stepRef.current, scene }))
        }
        if (barRef.current) {
          const progress = elapsedRef.current / stepDuration(STEPS[stepRef.current]!)
          barRef.current.style.transform = `scaleX(${progress})`
        }
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [reduceMotion])

  const jumpTo = (index: number) => {
    const step = STEPS[index]!
    stepRef.current = index
    elapsedRef.current = 0
    if (barRef.current) barRef.current.style.transform = "scaleX(0)"
    setPosition({ step: index, scene: reduceMotion ? step.scenes.length - 1 : 0 })
  }

  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") hoveredRef.current = true
  }
  const onPointerLeave = () => {
    hoveredRef.current = false
  }
  const onFocus = (e: FocusEvent) => {
    focusedRef.current = e.target.matches(":focus-visible")
  }
  const onBlur = () => {
    focusedRef.current = false
  }

  const scene = STEPS[position.step]!.scenes[position.scene]!.id

  return (
    <div
      ref={rootRef}
      className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,19rem)_1fr]"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <SolutionPhone scene={scene} metro={metro} animate={!reduceMotion} />

      <ol className="divide-y divide-white/10 border-y border-white/10">
        {STEPS.map((step, i) => {
          const isActive = i === position.step
          return (
            <li key={step.n}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={isActive ? "step" : undefined}
                className={`group relative flex w-full gap-4 py-4 pl-3 pr-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-from/70 sm:gap-5 sm:py-5 ${
                  isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-[2px] transition-colors ${isActive ? "bg-gold-from" : "bg-transparent"}`}
                />
                <span
                  className={`w-7 shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums transition-colors ${
                    isActive ? "text-gold-from" : "text-cream/40"
                  }`}
                >
                  {step.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      isActive ? "text-gold-from/85" : "text-cream/40"
                    }`}
                  >
                    {step.cue}
                  </span>
                  <span
                    className={`mt-1 block text-[16px] font-semibold leading-snug tracking-tight transition-colors sm:text-[17px] ${
                      isActive ? "text-cream" : "text-cream/65 group-hover:text-cream/85"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`mt-1 block text-[14px] leading-relaxed transition-colors ${
                      isActive ? "text-cream/70" : "text-cream/45"
                    }`}
                  >
                    {step.body}
                  </span>
                </span>
                {isActive && !reduceMotion ? (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
                    <span
                      ref={barRef}
                      className="block h-full origin-left bg-gradient-to-r from-gold-from to-gold-to"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function SolutionPhone({ scene, metro, animate }: { scene: SceneId; metro: string; animate: boolean }) {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[17.5rem] lg:mx-0 lg:max-w-none">
      <div
        className="relative mx-auto aspect-[9/17] w-full max-w-[15.5rem] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_28px_60px_-28px_rgba(15,30,46,0.55)] ring-1 ring-white/15"
        data-solution-scene={scene}
      >
        <Image src={SHOTS.after} alt="" fill className="object-cover opacity-35 blur-[2px]" sizes="160px" />
        <div className="absolute inset-0 bg-ink/50" />

        {scene === "film" && <FilmScene metro={metro} animate={animate} />}
        {scene === "portfolio" && <PortfolioScene metro={metro} />}
        {scene === "website" && <WebsiteScene metro={metro} />}
        {scene === "search" && <SearchScene metro={metro} />}
        {scene === "advertise" && <AdvertiseScene metro={metro} animate={animate} />}
        {scene === "followup" && <FollowUpScene metro={metro} animate={animate} />}
        {scene === "outcome" && <OutcomeScene metro={metro} />}

        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-30 flex justify-center">
          <span className="h-[3px] w-24 rounded-full bg-cream/35" />
        </div>
      </div>
    </div>
  )
}

function ProjectFootage({ animate, sizes }: { animate: boolean; sizes: string }) {
  if (!animate) return <Image src={POSTER_SRC} alt="" fill className="object-cover" sizes={sizes} />
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={VIDEO_SRC}
      poster={POSTER_SRC}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  )
}

const FILM_CLIPS = [
  { src: SHOTS.aerial, label: "Drone" },
  { src: SHOTS.during, label: "Progress" },
  { src: SHOTS.detail, label: "Details" },
] as const

function FilmScene({ metro, animate }: { metro: string; animate: boolean }) {
  const [seconds, setSeconds] = useState(12)

  useEffect(() => {
    if (!animate) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [animate])

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`

  return (
    <div className="absolute inset-0 z-10 bg-ink text-cream">
      <ProjectFootage animate={animate} sizes="248px" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/80" />

      <div className="absolute inset-x-0 top-0 px-3.5 pt-3">
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="flex items-center gap-1.5 rounded bg-ink/60 px-1.5 py-0.5 tabular-nums">
            <span className={`h-1.5 w-1.5 rounded-full bg-red-500 ${animate ? "construction-device-pulse" : ""}`} />
            REC {clock}
          </span>
          <span className="rounded bg-ink/60 px-1.5 py-0.5 text-cream/75">4K · 24fps</span>
        </div>
        <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-from">Day 1 · On site</p>
        <p className="mt-0.5 text-[13px] font-semibold leading-snug tracking-tight">
          {PROJECT} · {metro}
        </p>
      </div>

      <div className="absolute inset-x-5 bottom-[9.5rem] top-[6.5rem]">
        <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-cream/80" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-cream/80" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cream/80" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cream/80" />
      </div>

      <div className="absolute inset-x-2.5 bottom-6 rounded-xl bg-ink/85 p-2.5 ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-center justify-between text-[10px] font-medium">
          <span className="text-cream/70">Shot list</span>
          <span className="text-emerald-300/90">Capturing</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {FILM_CLIPS.map((clip, i) => (
            <div
              key={clip.label}
              className="construction-missed-pop"
              style={animate ? { animationDelay: `${0.8 + i * 1.1}s` } : undefined}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-md ring-1 ring-white/15">
                <Image src={clip.src} alt="" fill className="object-cover" sizes="72px" />
                <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
              </div>
              <p className="mt-1 text-[9px] font-medium text-cream/65">{clip.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PortfolioScene({ metro }: { metro: string }) {
  const gallery = [SHOTS.aerial, SHOTS.afterAlt, SHOTS.duringAlt, SHOTS.detail]
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink px-3 pt-3 text-cream">
      <div className="flex items-center justify-between text-[10px] font-medium text-cream/60">
        <span>Projects</span>
        <span className="text-emerald-300/90">Edited</span>
      </div>
      <p className="mt-1.5 text-[14px] font-semibold leading-snug tracking-tight">{PROJECT}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-cream/50">{metro}</p>

      <div className="construction-device-card relative mt-2.5 grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl ring-1 ring-white/15">
        <div className="relative aspect-[3/5]">
          <Image src={SHOTS.during} alt="" fill className="object-cover" sizes="112px" />
          <span className="absolute left-1.5 top-1.5 rounded bg-ink/75 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.06em]">
            During
          </span>
        </div>
        <div className="relative aspect-[3/5]">
          <Image src={SHOTS.after} alt="" fill className="object-cover" sizes="112px" />
          <span className="absolute right-1.5 top-1.5 rounded bg-emerald-500/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.06em] text-white">
            After
          </span>
        </div>
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-cream/90" />
        <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-[9px] font-bold text-ink shadow">
          ‹›
        </span>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1">
        {gallery.map((src, i) => (
          <div
            key={src}
            className="construction-device-card relative aspect-square overflow-hidden rounded-md ring-1 ring-white/15"
            style={{ animationDelay: `${0.25 + i * 0.12}s` }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="56px" />
            {i === 0 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/35">
                <PlayIcon className="h-3.5 w-3.5 text-cream" />
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-auto pb-7 pt-2 text-center text-[10px] font-medium leading-snug text-cream/50">
        Raw footage. Finished project story.
      </p>
    </div>
  )
}

function WebsiteScene({ metro }: { metro: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white pt-3 text-ink">
      <div className="mx-2.5 flex items-center gap-1.5 rounded-full bg-[#f1f3f4] px-2.5 py-1 text-[9px] text-ink/55">
        <LockIcon className="h-2.5 w-2.5 shrink-0" />
        yourconstruction.co/projects
      </div>
      <div className="flex items-center justify-between px-3 pb-2 pt-2.5">
        <p className="text-[11px] font-bold tracking-tight">Your Construction Co.</p>
        <span className="flex flex-col gap-[3px]">
          <span className="h-px w-3.5 bg-ink/60" />
          <span className="h-px w-3.5 bg-ink/60" />
          <span className="h-px w-3.5 bg-ink/60" />
        </span>
      </div>

      <div className="construction-device-card relative aspect-[16/10] w-full overflow-hidden">
        <Image src={SHOTS.aerial} alt="" fill className="object-cover" sizes="248px" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow">
            <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
          </span>
        </span>
        <span className="absolute bottom-1.5 left-1.5 rounded bg-ink/70 px-1.5 py-0.5 text-[8px] font-semibold text-cream">
          Project film
        </span>
      </div>

      <div className="px-3 pt-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand">Featured project</p>
        <p className="mt-0.5 text-[14px] font-semibold leading-snug tracking-tight">
          {PROJECT} in {metro}
        </p>
        <p className="mt-1 text-[10px] leading-snug text-ink/55">Filmed start to finish: the process and the finished home.</p>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {[SHOTS.during, SHOTS.detail, SHOTS.afterAlt].map((src) => (
            <div key={src} className="relative h-10 overflow-hidden rounded">
              <Image src={src} alt="" fill className="object-cover" sizes="72px" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto px-3 pb-7 pt-2">
        <div className="construction-serp-row flex h-9 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
          Request an estimate
        </div>
      </div>
    </div>
  )
}

function SearchScene({ metro }: { metro: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white pt-3 text-ink">
      <div className="flex items-start gap-2 border-b border-ink/[0.08] px-2.5 pb-2">
        <GoogleG className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1 rounded-2xl bg-[#f1f3f4] px-2.5 py-1.5 text-[10px] leading-snug text-ink/85">
          home remodeler near me
        </div>
      </div>

      <div className="relative h-14 shrink-0 overflow-hidden bg-[#e8eef3]">
        <span className="absolute inset-x-0 top-5 h-1.5 bg-white" />
        <span className="absolute inset-y-0 left-[38%] w-1.5 bg-white" />
        <span className="absolute inset-y-0 left-[72%] w-1 bg-white/80" />
        <span className="absolute left-[18%] top-8 h-2 w-2 rounded-full bg-ink/25 ring-2 ring-white" />
        <span className="absolute left-[80%] top-2 h-2 w-2 rounded-full bg-ink/25 ring-2 ring-white" />
        <span className="absolute left-[50%] top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white ring-2 ring-white">
          1
        </span>
        <span className="absolute bottom-1 left-1.5 text-[8px] font-medium text-ink/45">{metro}</span>
      </div>

      <div className="space-y-1.5 px-3 pt-2">
        <div className="construction-serp-row flex gap-2 rounded-lg bg-brand/[0.06] p-2 ring-1 ring-brand/25">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
            <Image src={SHOTS.after} alt="" fill className="object-cover" sizes="40px" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold leading-snug text-[#1a0dab]">Your Construction Co.</p>
            <p className="text-[9.5px] leading-snug text-ink/55">General contractor · {metro}</p>
            <p className="mt-0.5 text-[9.5px] font-semibold text-brand">Website · Directions · Call</p>
          </div>
        </div>
        <div className="construction-serp-row px-2 opacity-45">
          <p className="text-[11px] font-medium text-[#1a0dab]">Other contractor</p>
          <p className="text-[9.5px] text-ink/55">General contractor</p>
        </div>
      </div>

      <div
        className="construction-serp-row mx-3 mt-2.5 rounded-xl bg-[#f4f4f5] p-2.5"
        style={{ animationDelay: "0.5s" }}
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/45">ChatGPT</p>
        <p className="ml-auto mt-1.5 w-fit max-w-[88%] rounded-2xl bg-white px-2.5 py-1.5 text-[10px] leading-snug text-ink/80 shadow-sm">
          Who should I call for a home rebuild in {metro}?
        </p>
        <p className="mt-1.5 text-[10px] leading-snug text-ink/75">
          Try <span className="font-semibold text-ink">Your Construction Co.</span>. Their site walks through a {metro}{" "}
          whole-home rebuild on video, start to finish.
        </p>
      </div>

      <p className="mt-auto px-3 pb-7 pt-2 text-center text-[10px] font-medium leading-snug text-ink/40">
        Found on Google. Named in ChatGPT.
      </p>
    </div>
  )
}

function AdvertiseScene({ metro, animate }: { metro: string; animate: boolean }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink pt-3 text-cream">
      <div className="flex items-center gap-2 px-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-from to-gold-to text-[10px] font-bold text-ink">
          YC
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold leading-none">Your Construction Co.</p>
          <p className="mt-0.5 text-[9px] leading-snug text-cream/50">Sponsored · {metro}</p>
        </div>
      </div>
      <p className="mt-2 px-3 text-[10.5px] leading-snug text-cream/85">
        Watch a {metro} whole-home rebuild, start to finish.
      </p>

      <div className="construction-device-card relative mt-2 aspect-square w-full overflow-hidden">
        <ProjectFootage animate={animate} sizes="248px" />
        <span className="absolute bottom-2 right-2 rounded bg-ink/70 px-1.5 py-0.5 text-[8px] font-semibold tabular-nums text-cream">
          0:15
        </span>
      </div>
      <div className="construction-serp-row flex items-center justify-between bg-brand px-3 py-2 text-[11px] font-semibold text-white" style={{ animationDelay: "0.4s" }}>
        <span>Get an estimate</span>
        <span>→</span>
      </div>

      <p className="mt-auto pb-7 pt-2 text-center text-[10px] font-medium leading-snug text-cream/50">
        Your footage. Now it&apos;s the ad.
      </p>
    </div>
  )
}

function FollowUpScene({ metro, animate }: { metro: string; animate: boolean }) {
  const notifications = [
    {
      app: "Website",
      time: "now",
      title: "New estimate request",
      body: `${PROJECT} · ${metro}`,
      icon: <span className="text-[10px] font-bold">W</span>,
      iconClass: "bg-brand text-white",
    },
    {
      app: "Messages",
      time: "now",
      title: "Auto-reply sent",
      body: "Thanks! Pick a time for your estimate →",
      icon: <ChatIcon className="h-4 w-4" />,
      iconClass: "bg-emerald-500 text-white",
    },
    {
      app: "Slack · #new-leads",
      time: "now",
      title: "New lead for your estimator",
      body: `${PROJECT}, ${metro}. Auto-reply sent.`,
      icon: <span className="text-[12px] font-bold">#</span>,
      iconClass: "bg-[#4A154B] text-white",
    },
    {
      app: "Calendar",
      time: "now",
      title: "Estimate booked",
      body: "Thu 10:00 AM · on-site walkthrough",
      icon: <span className="text-[8px] font-bold uppercase leading-none">Thu</span>,
      iconClass: "bg-white text-red-500 ring-1 ring-ink/10",
    },
  ]

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink/85 px-3 pt-8 text-cream backdrop-blur-md">
      <div className="text-center">
        <p className="text-[11px] font-medium text-cream/50">Tuesday</p>
        <p className="mt-0.5 text-[38px] font-light leading-none tracking-tight tabular-nums">9:41</p>
      </div>

      <div className="mt-5 space-y-1.5">
        {notifications.map((n, i) => {
          const style: CSSProperties | undefined = animate ? { animationDelay: `${0.3 + i * 0.9}s` } : undefined
          return (
            <div
              key={n.title}
              className="construction-missed-pop rounded-[14px] bg-[rgba(255,255,255,0.94)] px-2.5 py-2 text-ink shadow-[0_8px_24px_-12px_rgba(15,30,46,0.45)]"
              style={style}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${n.iconClass}`}>
                  {n.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[9.5px] font-medium leading-none text-ink/50">{n.app}</p>
                    <p className="text-[9px] text-ink/40">{n.time}</p>
                  </div>
                  <p className="mt-0.5 text-[11.5px] font-semibold leading-snug tracking-tight">{n.title}</p>
                  <p className="text-[10px] leading-snug text-ink/55">{n.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-auto pb-8 pt-2 text-center text-[11px] font-medium text-cream/50">
        Instant reply. Team in the loop.
      </p>
    </div>
  )
}

const JOURNEY = [
  "Saw your ad",
  "Found you on Google",
  "Watched the project film",
  "Got an instant reply",
  "Estimate booked · Thu 10 AM",
] as const

function OutcomeScene({ metro }: { metro: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-ink px-3.5 pt-8 text-cream">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold-from">Estimate booked</p>
        <p className="mt-1.5 text-[13px] leading-snug text-cream/60">
          {PROJECT} · {metro}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
        <p className="text-[10px] font-medium text-cream/45">Estimate on the calendar</p>
        <p className="mt-0.5 text-[22px] font-semibold tracking-tight tabular-nums">Thu · 10:00 AM</p>
        <p className="mt-2 text-[11px] leading-snug text-cream/70">Site walk · {PROJECT}</p>
      </div>

      <p className="mt-3.5 text-[10px] font-medium text-cream/45">How this homeowner got here</p>
      <ol className="mt-1.5 space-y-1.5">
        {JOURNEY.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[11px] leading-snug text-cream/80">
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/90 text-white">
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            {item}
          </li>
        ))}
      </ol>

      <p className="mt-auto pb-8 text-center text-[11px] font-medium text-cream/50">
        Filmed → found → booked.
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

function CheckIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 4.5v15a1 1 0 001.52.85l12-7.5a1 1 0 000-1.7l-12-7.5A1 1 0 007 4.5z" />
    </svg>
  )
}

function LockIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  )
}

function ChatIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3C6.48 3 2 6.8 2 11.5c0 2.3 1.08 4.38 2.83 5.91L4 21l4.1-2.05c1.2.37 2.52.55 3.9.55 5.52 0 10-3.8 10-8.5S17.52 3 12 3z" />
    </svg>
  )
}
