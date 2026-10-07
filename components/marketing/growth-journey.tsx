"use client"

import { useRef, useState, type CSSProperties } from "react"
import { MotionToggle } from "@/components/motion-toggle"
import { JOURNEY_ICONS, JOURNEY_MOCKS } from "@/components/marketing/journey-artifacts"
import { useOnScreenAndVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay"
import { trackEvent } from "@/lib/analytics"
import { JOURNEY } from "@/lib/marketing-system"

/**
 * /marketing hero: one inquiry traced through the system Terramore builds. Six artifacts hang off one "system bus";
 * a marker travels the bus and each artifact arrives as the customer reaches it (purpose: sequence, cause and effect).
 *
 * Motion is CSS only (`gs-` keyframes in app/globals.css), transform and opacity. It plays once (about 8 s) from the
 * first paint, so it needs no JavaScript to reach its final frame, then holds. JavaScript adds Pause / Play / Replay
 * and pauses it off screen or in a hidden tab (VR-47, VR-48). Under reduced motion the final frame shows with no
 * control (VR-45).
 *
 * md and up: two columns of artifacts either side of a vertical bus (a taller board at lg, where the hero first goes
 * side by side and the column is narrowest). Phones: the same six steps as a compact log
 * down a left-hand bus, one line each, except the text reply and the booking, which keep their artifacts.
 */

/** Where each artifact sits on the md+ board, in % of the board (the board keeps a fixed aspect ratio). */
const SLOTS: readonly { x: string; y: string }[] = [
  { x: "0%", y: "0%" },
  { x: "53%", y: "5%" },
  { x: "0%", y: "33.5%" },
  { x: "53%", y: "38.5%" },
  { x: "0%", y: "67%" },
  { x: "53%", y: "72%" },
]

/** The two money moments keep their artifact on phones; the other steps are one line each. */
const PHONE_MOCKS = new Set(["reply", "booked"])

/** Seconds at which the customer reaches each step. Keep in step with the gs-dot and gs-fill keyframes. */
const ARRIVE = [0.4, 1.7, 3.0, 4.3, 5.6, 6.9] as const

export function GrowthJourney() {
  const boardRef = useRef<HTMLDivElement>(null)
  const visible = useOnScreenAndVisible(boardRef, 0.15)
  const reduce = usePrefersReducedMotion()
  const [userPaused, setUserPaused] = useState(false)
  const [ended, setEnded] = useState(false)
  const [run, setRun] = useState(0)

  const paused = userPaused || !visible

  function toggle() {
    if (ended) {
      setEnded(false)
      setUserPaused(false)
      setRun((n) => n + 1)
      trackEvent("select_content", { content_type: "marketing_demo", content_id: "journey_replay" })
      return
    }
    setUserPaused((p) => !p)
  }

  return (
    <figure className="relative" aria-labelledby="growth-journey-caption">
      <div className="flex items-center justify-between gap-4">
        <figcaption id="growth-journey-caption" className="text-[14px] font-semibold text-ink">
          One inquiry, start to finish
          <span className="block text-[13px] font-normal text-slate-600">Sample business · example journey</span>
        </figcaption>
        {reduce ? null : <MotionToggle paused={userPaused} ended={ended} onToggle={toggle} label="journey" />}
      </div>

      <div
        ref={boardRef}
        data-paused={paused ? "" : undefined}
        onAnimationEnd={(e) => {
          if (e.animationName === "gs-final") setEnded(true)
        }}
        className="gs-board relative mt-5 md:aspect-[20/17] lg:aspect-[20/19] xl:aspect-[20/17]"
      >
        {/* Replay remounts this wrapper only, so the observed board (and its pause state) stays the same node. */}
        <div key={run} className="contents">
          {/* md+: the system bus between the two columns, its progress fill and the travelling customer. */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[30px] hidden h-[72%] w-px -translate-x-1/2 bg-ink/15 md:block"
          />
          <div
            aria-hidden
            className="gs-fill absolute left-1/2 top-[30px] hidden h-[72%] w-[2px] -translate-x-1/2 bg-brand md:block"
          />
          <div aria-hidden className="gs-dot pointer-events-none absolute inset-0 hidden md:block">
            <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-brand ring-1 ring-brand/35" />
          </div>

          {/* Phones: the bus runs down the left edge. */}
          <div aria-hidden className="absolute bottom-6 left-[11px] top-6 w-px bg-ink/15 md:hidden" />
          <div
            aria-hidden
            className="gs-fill-m absolute bottom-6 left-[10px] top-6 w-[3px] rounded-full bg-brand md:hidden"
          />

          <ol className="relative space-y-2.5 md:static md:space-y-0">
            {JOURNEY.map((step, i) => {
              const Icon = JOURNEY_ICONS[step.id]
              const Mock = JOURNEY_MOCKS[step.id]
              const last = i === JOURNEY.length - 1
              const style = { "--x": SLOTS[i].x, "--y": SLOTS[i].y, "--d": `${ARRIVE[i]}s` } as CSSProperties
              const left = i % 2 === 0
              return (
                <li
                  key={step.id}
                  style={style}
                  className="gs-in relative pl-9 md:absolute md:left-[var(--x)] md:top-[var(--y)] md:flex md:min-h-[29%] md:w-[47%] md:flex-col md:pl-0"
                >
                  {/* Phone node on the left bus. */}
                  <span
                    aria-hidden
                    className="absolute left-[5px] top-[22px] h-[15px] w-[15px] rounded-full border-2 border-ink/20 bg-white md:hidden"
                  />
                  <span
                    aria-hidden
                    className="gs-node absolute left-[5px] top-[22px] h-[15px] w-[15px] rounded-full border-[3px] border-white bg-brand ring-1 ring-brand/35 md:hidden"
                  />
                  {/* md+: a stub from the card to the bus. */}
                  <span
                    aria-hidden
                    className={`absolute top-[29px] hidden h-px w-[6.4%] bg-ink/15 md:block ${left ? "-right-[6.4%]" : "-left-[6.4%]"}`}
                  />

                  <div className="relative rounded-2xl border border-ink/10 bg-white p-3.5 md:flex-1">
                    {/* Arrival highlight and, on the last step, the settled gold ring (opacity only). */}
                    <span
                      aria-hidden
                      className="gs-ring pointer-events-none absolute -inset-px rounded-2xl ring-2 ring-brand/50"
                    />
                    {last ? (
                      <span
                        aria-hidden
                        className="gs-final pointer-events-none absolute -inset-px rounded-2xl ring-2 ring-gold-from"
                      />
                    ) : null}

                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink/[0.05] text-ink"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="min-w-0 flex-1 text-[14px] font-semibold leading-tight text-ink">
                        {step.stage}
                        <span className="block truncate text-[12px] font-medium text-slate-600">{step.system}</span>
                      </p>
                      <span className="shrink-0 text-[12px] font-medium tabular-nums text-slate-600">{step.time}</span>
                    </div>

                    {PHONE_MOCKS.has(step.id) ? null : (
                      <p className="mt-2 text-[14px] leading-snug text-slate-700 md:hidden">{step.summary}</p>
                    )}
                    <div className={`mt-2.5 ${PHONE_MOCKS.has(step.id) ? "" : "hidden md:block"}`}>
                      <Mock />
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </figure>
  )
}
