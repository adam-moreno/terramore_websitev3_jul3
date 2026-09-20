"use client"

/**
 * DiagnosticCard — the /book hero visualization.
 *
 * A miniature piece of Terramore "thinking through" a business, in four
 * looping states: Business snapshot → Customer journey → Opportunity found
 * → Next move. Built from typography, spacing, and hairlines only — no
 * charts, no dashboard chrome. Motion is opacity + ≤16px translation with
 * a premium ease; under prefers-reduced-motion it becomes a manual
 * switcher with plain crossfades. Presentation only: booking, tracking,
 * and the qualification flow live elsewhere and are untouched.
 */

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

/* ------------------------------------------------------------------ */
/* Motion primitives                                                   */
/* ------------------------------------------------------------------ */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const DURATION = 720

const ReducedMotion = createContext(false)

/** Fades + lifts a block into place. Delay applies on the way in only, so
 *  everything leaves together when a state ends. */
function Fade({
  on,
  delay = 0,
  y = 12,
  className = "",
  children,
}: {
  on: boolean
  delay?: number
  y?: number
  className?: string
  children?: ReactNode
}) {
  const reduced = useContext(ReducedMotion)
  const d = reduced ? 320 : DURATION
  const shift = reduced ? 0 : y
  return (
    <div
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : `translateY(${shift}px)`,
        transition: `opacity ${d}ms ${EASE} ${on ? delay : 0}ms, transform ${d}ms ${EASE} ${on ? delay : 0}ms`,
      }}
    >
      {children}
    </div>
  )
}

/** Masked text reveal: the line rises out of a clipped box. */
function Mask({ on, delay = 0, className = "", children }: { on: boolean; delay?: number; className?: string; children: ReactNode }) {
  const reduced = useContext(ReducedMotion)
  const d = reduced ? 320 : DURATION + 120
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span
        className="block"
        style={{
          opacity: on ? 1 : 0,
          transform: on || reduced ? "translateY(0)" : "translateY(105%)",
          transition: `opacity ${d}ms ${EASE} ${on ? delay : 0}ms, transform ${d}ms ${EASE} ${on ? delay : 0}ms`,
        }}
      >
        {children}
      </span>
    </span>
  )
}

/** Smooth count-up on activation. Holds its last value while leaving so the
 *  number never snaps to zero mid-fade. */
function useCountUp(target: number, on: boolean, { delay = 0, duration = 1400 } = {}) {
  const reduced = useContext(ReducedMotion)
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!on) return
    if (reduced) {
      setValue(target)
      return
    }
    let raf = 0
    let start: number | null = null
    setValue(0)
    const timer = window.setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts
        const p = Math.min(1, (ts - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setValue(target * eased)
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [on, target, delay, duration, reduced])
  return value
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Eyebrow({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <Fade on={on} y={8}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">{children}</p>
    </Fade>
  )
}

function Title({ on, delay = 90, children }: { on: boolean; delay?: number; children: ReactNode }) {
  return (
    <Mask on={on} delay={delay} className="mt-3">
      <span className="block text-[1.65rem] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2rem] md:text-[2.25rem]">
        {children}
      </span>
    </Mask>
  )
}

function Check() {
  return (
    <span aria-label="Connected" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.5l2.2 2.2L9.5 3.8" />
      </svg>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* State 1 — Business snapshot                                         */
/* ------------------------------------------------------------------ */

function Snapshot({ on }: { on: boolean }) {
  const ig = useCountUp(18.2, on, { delay: 700 })
  const email = useCountUp(3840, on, { delay: 820 })
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Website", value: <Check /> },
    { label: "Google", value: <Check /> },
    { label: "Instagram", value: <span className="tabular-nums">{ig.toFixed(1)}K</span> },
    { label: "Email", value: <span className="tabular-nums">{Math.round(email).toLocaleString("en-US")}</span> },
    { label: "Paid", value: <Check /> },
  ]
  return (
    <div>
      <Eyebrow on={on}>Business snapshot</Eyebrow>
      <Title on={on}>Northline Atelier</Title>
      <Fade on={on} delay={200} y={8}>
        <p className="mt-2 text-[15px] text-slate-500">Online store · Los Angeles</p>
      </Fade>
      <ul className="mt-7 sm:mt-9">
        {rows.map((row, i) => (
          <li key={row.label}>
            {/* Hairlines live on the fading row so they leave with it. */}
            <Fade
              on={on}
              delay={380 + i * 100}
              y={8}
              className={`flex items-center justify-between border-b border-ink/[0.06] py-3 ${i === 0 ? "border-t" : ""}`}
            >
              <span className="text-[14.5px] font-medium text-ink/80">{row.label}</span>
              <span className="text-[14.5px] font-semibold text-ink">{row.value}</span>
            </Fade>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* State 2 — Customer journey                                          */
/* ------------------------------------------------------------------ */

const JOURNEY = ["Ad", "Landing page", "Inquiry", "Follow-up", "Sale"] as const
const LEAK_INDEX = 3
const INQUIRIES = 31
const FOLLOWED_UP = 18

function Journey({ on }: { on: boolean }) {
  const followed = useCountUp(FOLLOWED_UP, on, { delay: 1900, duration: 1100 })
  const inquiries = useCountUp(INQUIRIES, on, { delay: 1900, duration: 1100 })
  return (
    <div>
      <Eyebrow on={on}>Customer journey</Eyebrow>
      <Fade on={on} delay={90} y={8}>
        <p className="mt-3 text-[15px] text-slate-500">Where a customer goes, step by step.</p>
      </Fade>

      {/* Vertical on small screens, horizontal from sm up. Connectors are hairlines. */}
      <ol className="mt-7 flex flex-col sm:mt-10 sm:flex-row sm:items-center">
        {JOURNEY.map((step, i) => {
          const leak = i === LEAK_INDEX
          return (
            <li key={step} className="flex flex-col sm:flex-1 sm:flex-row sm:items-center">
              {i > 0 ? (
                <Fade on={on} delay={420 + i * 170} y={0} className="ml-[0.6rem] h-4 w-px bg-ink/15 sm:ml-0 sm:mr-2 sm:h-px sm:w-auto sm:flex-1" />
              ) : null}
              <Fade on={on} delay={480 + i * 170} y={10}>
                <span
                  className={`relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-full py-1.5 pr-3.5 pl-1.5 text-[14.5px] font-medium sm:mr-2 ${
                    leak ? "text-ink" : "text-ink/75"
                  }`}
                  style={{
                    backgroundColor: leak && on ? "rgba(247,184,68,0.16)" : "transparent",
                    boxShadow: leak && on ? "inset 0 0 0 1px rgba(198,136,9,0.35)" : "inset 0 0 0 1px transparent",
                    transition: `background-color ${DURATION}ms ${EASE} ${on ? 1500 : 0}ms, box-shadow ${DURATION}ms ${EASE} ${on ? 1500 : 0}ms`,
                  }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: leak && on ? "#c68809" : "rgba(15,30,46,0.25)",
                      transition: `background-color ${DURATION}ms ${EASE} ${on ? 1500 : 0}ms`,
                    }}
                  />
                  {step}
                </span>
              </Fade>
            </li>
          )
        })}
      </ol>

      {/* Evidence for the leak: two numbers and a two-segment hairline bar. */}
      <Fade on={on} delay={1800} y={10} className="mt-7 sm:mt-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <p className="text-[15px] text-ink">
            <span className="font-semibold tabular-nums">{Math.round(inquiries)}</span> inquiries
          </p>
          <p className="text-[15px] text-ink">
            <span className="font-semibold tabular-nums">{Math.round(followed)}</span> followed up
          </p>
        </div>
        <div className="mt-3 flex h-1 max-w-sm gap-1 overflow-hidden rounded-full">
          <span
            className="h-full rounded-full bg-ink/70"
            style={{
              width: `${(FOLLOWED_UP / INQUIRIES) * 100}%`,
              transform: on ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: `transform 1100ms ${EASE} ${on ? 1950 : 0}ms`,
            }}
          />
          <span
            className="h-full flex-1 rounded-full bg-gold-from"
            style={{
              opacity: on ? 1 : 0,
              transition: `opacity ${DURATION}ms ${EASE} ${on ? 2700 : 0}ms`,
            }}
          />
        </div>
      </Fade>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* State 3 — Opportunity found                                         */
/* ------------------------------------------------------------------ */

function Opportunity({ on }: { on: boolean }) {
  return (
    <div>
      <Eyebrow on={on}>Opportunity found</Eyebrow>
      <Title on={on}>Missed follow-up</Title>
      <Fade on={on} delay={260} y={10}>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-slate-600 sm:text-[17px]">
          13 potential customers aren&apos;t being contacted.
        </p>
      </Fade>

      {/* Supporting evidence, carried over from the journey. */}
      <ul className="mt-7 grid max-w-md grid-cols-3 gap-4 sm:mt-9">
        {[
          { k: "Inquiries", v: INQUIRIES, tone: "text-ink" },
          { k: "Followed up", v: FOLLOWED_UP, tone: "text-ink" },
          { k: "Not contacted", v: INQUIRIES - FOLLOWED_UP, tone: "text-gold" },
        ].map((item, i) => (
          <li key={item.k}>
            <Fade on={on} delay={620 + i * 140} y={8} className="border-t border-ink/[0.08] pt-3">
              {/* Number first so the three figures share a baseline even when a label wraps. */}
              <p className={`text-[1.25rem] font-semibold tabular-nums tracking-[-0.01em] ${item.tone}`}>{item.v}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.1em] leading-snug text-ink/45">{item.k}</p>
            </Fade>
          </li>
        ))}
      </ul>

      <Fade on={on} delay={1300} y={8} className="mt-7 sm:mt-9">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-ink px-3.5 py-2 text-[12px] font-medium text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-from" />
          First place we&apos;d look
        </span>
      </Fade>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* State 4 — Next move                                                 */
/* ------------------------------------------------------------------ */

const MOVES = ["Qualify", "Route", "Follow up", "Track conversion"] as const

function NextMove({ on }: { on: boolean }) {
  return (
    <div>
      <Eyebrow on={on}>Next move</Eyebrow>
      <Title on={on}>Automate inquiry follow-up</Title>
      <ol className="mt-7 flex flex-col gap-2 sm:mt-9 sm:flex-row sm:items-center sm:gap-0">
        {MOVES.map((move, i) => (
          <li key={move} className="flex flex-col sm:flex-row sm:items-center">
            {i > 0 ? (
              <Fade on={on} delay={560 + i * 220} y={0} className="hidden h-px w-5 bg-ink/15 sm:block" />
            ) : null}
            <Fade on={on} delay={600 + i * 220} y={10}>
              <span className="inline-flex items-center gap-2.5 rounded-xl border border-ink/[0.07] bg-cream px-3.5 py-2 text-[14px] font-medium text-ink">
                <span className="text-[11px] font-semibold tabular-nums text-ink/35">0{i + 1}</span>
                {move}
              </span>
            </Fade>
          </li>
        ))}
      </ol>
      <Fade on={on} delay={1700} y={6} className="mt-7 sm:mt-9">
        <p className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Ready to discuss
        </p>
      </Fade>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The card                                                            */
/* ------------------------------------------------------------------ */

const STATES = [
  { id: "snapshot", label: "Business", hold: 4600, render: Snapshot },
  { id: "journey", label: "Journey", hold: 5200, render: Journey },
  { id: "opportunity", label: "Opportunity", hold: 3600, render: Opportunity },
  { id: "next", label: "Next move", hold: 3900, render: NextMove },
] as const

export function DiagnosticCard() {
  const [idx, setIdx] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  /* Pause the loop while offscreen — no wasted work, and a visitor who
     scrolls back up meets a fresh state rather than a mid-fade. */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)), {
      threshold: 0.25,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || !visible) return
    const timer = window.setTimeout(() => setIdx((i) => (i + 1) % STATES.length), STATES[idx].hold)
    return () => window.clearTimeout(timer)
  }, [idx, reduced, visible])

  /* The stage eases to the height of the active panel, so each state gets
     exactly the room it needs — no dead space under the shorter ones. */
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const [height, setHeight] = useState<number | null>(null)
  useEffect(() => {
    const el = panelRefs.current[idx]
    if (!el) return
    const measure = () => setHeight(el.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [idx])

  return (
    <ReducedMotion.Provider value={reduced}>
      <div
        ref={ref}
        className="mx-auto max-w-3xl rounded-[1.75rem] bg-white p-6 shadow-[0_24px_70px_-36px_rgba(15,30,46,0.28)] ring-1 ring-ink/[0.05] sm:rounded-[2rem] sm:p-9 md:p-11"
        aria-roledescription="Animated illustration"
      >
        <div
          className="relative min-h-[13rem] sm:min-h-[15rem]"
          style={{
            height: height ?? undefined,
            transition: `height ${reduced ? 320 : DURATION}ms ${EASE}`,
          }}
        >
          {STATES.map((s, i) => {
            const on = i === idx
            const Panel = s.render
            /* Until first measure, the active panel flows normally so SSR/first
               paint has real height; after that every panel is layered. */
            const layered = height !== null || !on
            return (
              <div
                key={s.id}
                ref={(el) => {
                  panelRefs.current[i] = el
                }}
                aria-hidden={!on}
                className={`${layered ? "absolute inset-x-0 top-0" : "relative"} ${on ? "" : "pointer-events-none"}`}
              >
                <Panel on={on} />
              </div>
            )
          })}
        </div>

        {/* Hairline state timer. Doubles as a manual switcher. */}
        <ol className="mt-9 grid grid-cols-4 gap-2 sm:mt-11 sm:gap-3">
          {STATES.map((s, i) => {
            const on = i === idx
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-current={on ? "step" : undefined}
                  aria-label={`Show ${s.label}`}
                  className="group block w-full text-left"
                >
                  <span className="block h-px w-full overflow-hidden rounded-full bg-ink/[0.08]">
                    {on ? (
                      <span
                        key={`${i}-${visible}`}
                        className="diag-timer block h-full w-full bg-ink/70"
                        style={{ animationDuration: `${s.hold}ms`, animationPlayState: visible ? "running" : "paused" }}
                      />
                    ) : null}
                  </span>
                  {/* Full label row only where four labels fit comfortably. */}
                  <span
                    className={`mt-2.5 hidden text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 sm:block ${
                      on ? "text-ink" : "text-ink/35 group-hover:text-ink/60"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        {/* Mobile: one label for the current state instead of four cramped ones. */}
        <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink sm:hidden" aria-hidden>
          {STATES[idx].label}
        </p>
      </div>
    </ReducedMotion.Provider>
  )
}
