"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { MotionToggle } from "@/components/motion-toggle"
import { useOnScreenAndVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay"

/*
 * /marketing hero: "signals become an operating system" (VD-027, P-07 hybrid).
 * The plate is one generated, retouched still (no text, UI or numbers in it). Everything that behaves is drawn here:
 * channels cut in from the plate's own groove fragments, a hub, three lanes (content, ads, campaigns) and one
 * brass-rimmed result. Loose tokens are lifted from the plate (sprite over a floor patch) and routed, never faded.
 * Sequence (cause and effect, VR-42): beside the H1, so it starts on the finished system and plays once, about 7 s,
 * only after Play (§4.5, VD-018/VD-025); Replay after; pauses off screen or in a hidden tab (VR-48); reduced motion
 * shows the finished state with no control (VR-45). Transform and opacity only (VR-44). Geometry is in the plate's
 * 1600x900 pixels; the SVG and the image share one bottom-right cover rule, so the phone 4:5 crop is the right edge.
 */

const BASE = "/marketing/hero-routing"
const TOTAL_MS = 7000
const EASE = "cubic-bezier(.4,0,.2,1)"
const BRASS = "#b08a4a" // the single result accent (VD-027)

type Route = { id: string; w: number; t: number; dur: number; d: string }
const ROUTES: Route[] = [
  { id: "r1", w: 28, t: 300, dur: 750, d: "M 985 666 C 1010 730, 1110 720, 1176 668" }, // capsule's end → hub
  { id: "r2", w: 26, t: 420, dur: 350, d: "M 1146 646 C 1156 648, 1166 650, 1176 652" }, // outer arc's end → hub
  { id: "r3", w: 26, t: 520, dur: 350, d: "M 1205 596 C 1212 606, 1218 616, 1224 625" }, // inner arc's end → hub
  { id: "trunk", w: 30, t: 600, dur: 800, d: "M 1392 444 C 1420 520, 1385 600, 1290 632" }, // top run → hub
  { id: "notch", w: 24, t: 700, dur: 350, d: "M 1360 549 C 1362 562, 1362 575, 1360 590" }, // notch → trunk
  { id: "e1", w: 22, t: 2700, dur: 700, d: "M 1290 662 C 1305 685, 1322 692, 1350 692 L 1450 692" }, // content
  { id: "e2", w: 22, t: 2700, dur: 700, d: "M 1276 670 C 1290 715, 1312 737, 1350 737 L 1450 737" }, // ads
  { id: "e3", w: 22, t: 2700, dur: 700, d: "M 1255 674 C 1262 745, 1300 782, 1350 782 L 1450 782" }, // campaigns
  { id: "m1", w: 19, t: 4800, dur: 450, d: "M 1450 692 C 1470 694, 1480 712, 1486 725" },
  { id: "m2", w: 19, t: 4800, dur: 450, d: "M 1450 737 L 1487 737" },
  { id: "m3", w: 19, t: 4800, dur: 450, d: "M 1450 782 C 1470 780, 1480 762, 1486 749" },
]
const LANE: Record<string, string> = { e1: ROUTES[5].d, e2: ROUTES[6].d, e3: ROUTES[7].d }

/** Sprite boxes (plate pixels) and their routing. rest = where the token settles on its lane (finished poster). */
type Token = {
  x: number; y: number; w: number; h: number; cx: number; cy: number
  pick: number; dur: number; toHub: string; lane: "e1" | "e2" | "e3"; at: number; rest: [number, number]
}
const TOKENS: Record<string, Token> = {
  ads: { x: 1096, y: 607, w: 110, h: 67, cx: 1137, cy: 636, pick: 1200, dur: 900, toHub: "M 1137 636 C 1130 630, 1128 628, 1126 626", lane: "e2", at: 0.8, rest: [1408.3, 737] },
  content: { x: 1010, y: 665, w: 123, h: 75, cx: 1058, cy: 699, pick: 1350, dur: 1200, toHub: "M 1058 699 C 1085 708, 1115 708, 1140 704 C 1150 703, 1158 703, 1165 703", lane: "e1", at: 0.62, rest: [1385.1, 692] },
  camp2: { x: 1305, y: 621, w: 110, h: 67, cx: 1347, cy: 650, pick: 1500, dur: 900, toHub: "M 1347 650 C 1346 652, 1344 654, 1342 656", lane: "e3", at: 0.71, rest: [1374.8, 782] },
  camp3: { x: 1287, y: 658, w: 112, h: 69, cx: 1330, cy: 688, pick: 1650, dur: 900, toHub: "M 1330 688 C 1327 690, 1324 693, 1320 696", lane: "e3", at: 0.44, rest: [1306.6, 770.9] },
  camp1: { x: 1377, y: 613, w: 110, h: 69, cx: 1419, cy: 643, pick: 1800, dur: 1000, toHub: "M 1419 643 C 1395 630, 1372 618, 1356 612", lane: "e3", at: 0.97, rest: [1442.2, 782] },
}
const LANE_SCALE = 0.8 // tokens settle into the recessed channel

/** Mask sweep for one route: a rect rotated along the route's chord, slid past its end. Pure geometry from `d`. */
function sweep(r: Route) {
  const n = r.d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const [ax, ay] = n
  const [bx, by] = n.slice(-2)
  return {
    ax,
    ay,
    angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI,
    span: Math.hypot(bx - ax, by - ay) + r.w * 2 + 45,
  }
}

const fillBox: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" }
const at = (x: number, y: number, s = 1) => `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(3)})`

type RunState = "idle" | "playing" | "paused" | "ended"

export function MarketingHeroRouting({ copy }: { copy: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const legendRef = useRef<HTMLUListElement>(null)
  const anims = useRef<Animation[]>([])
  const run = useRef(0)
  const [state, setState] = useState<RunState>("idle")
  const stateRef = useRef<RunState>("idle")
  stateRef.current = state
  const reduce = usePrefersReducedMotion()
  const visible = useOnScreenAndVisible(stageRef, 0.25)

  // Build the timeline once. The markup already shows the finished system, so seeking to the end changes nothing.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || typeof svg.animate !== "function") return
    const list: Animation[] = []
    const add = (el: Element, kf: Keyframe[], delay: number, duration: number, easing = EASE, fill: FillMode = "both") => {
      const a = el.animate(kf, { delay, duration, easing, fill })
      a.pause()
      list.push(a)
    }
    const q = (sel: string) => svg.querySelector(sel)!
    for (const r of ROUTES) {
      const { span } = sweep(r)
      add(q(`[data-sweep="${r.id}"]`), [{ transform: "translateX(0px)" }, { transform: `translateX(${span.toFixed(1)}px)` }], r.t, r.dur, "cubic-bezier(.33,0,.2,1)")
    }
    add(q("[data-hub]"), [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "scale(1)" }], 1300, 600)
    add(q("[data-core]"), [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }], 1700, 400)
    add(q("[data-output]"), [{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "scale(1)" }], 5400, 700, "ease-out")
    if (legendRef.current) add(legendRef.current, [{ opacity: 0 }, { opacity: 1 }], 3000, 500, "ease-out")

    const probe = q("[data-probe]") as SVGPathElement
    const sample = (d: string, n: number, upTo = 1) => {
      probe.setAttribute("d", d)
      const L = probe.getTotalLength()
      return Array.from({ length: n + 1 }, (_, i) => probe.getPointAtLength((L * upTo * i) / n))
    }
    for (const [name, t] of Object.entries(TOKENS)) {
      add(q(`[data-patch="${name}"]`), [{ opacity: 0 }, { opacity: 1 }], t.pick, 1, "linear")
      const g = q(`[data-token="${name}"]`)
      const toHub = sample(t.toHub, 40)
      add(g, toHub.map((p) => ({ transform: at(p.x, p.y) })), t.pick, t.dur)
      const along = [toHub[toHub.length - 1], ...sample(LANE[t.lane], 30, t.at)]
      add(g, along.map((p, i) => ({ transform: at(p.x, p.y, 1 + ((LANE_SCALE - 1) * i) / (along.length - 1)) })), 3300, 1500, EASE, "forwards")
    }
    list.forEach((a) => (a.currentTime = TOTAL_MS))
    anims.current = list
    return () => {
      list.forEach((a) => a.cancel())
      anims.current = []
    }
  }, [])

  const seek = (ms: number) => anims.current.forEach((a) => { a.pause(); a.currentTime = ms })
  const pause = useCallback(() => {
    run.current++
    anims.current.forEach((a) => a.pause())
    setState("paused")
  }, [])
  const play = () => {
    const id = ++run.current
    anims.current.forEach((a) => a.play())
    setState("playing")
    Promise.all(anims.current.map((a) => a.finished))
      .then(() => { if (run.current === id) setState("ended") })
      .catch(() => {})
  }
  const toggle = () => {
    if (state === "playing") return pause()
    if (state === "idle" || state === "ended") seek(0)
    play()
  }

  // Stops off screen and in a hidden tab (VR-48); resumes only on Play.
  useEffect(() => {
    if (!visible && stateRef.current === "playing") pause()
  }, [visible, pause])
  // Reduced motion: the finished system, no control.
  useEffect(() => {
    if (!reduce) return
    run.current++
    seek(TOTAL_MS)
    setState("idle")
  }, [reduce])

  return (
    <section className="relative overflow-hidden bg-cream lg:bg-[#f3ece2]" aria-labelledby="marketing-hero-title">
      <div className="relative lg:h-[min(56.25vw,760px)]">
        {/* Copy first in the DOM (phones read it first); on desktop it sits over the plate's empty left side. */}
        <div className="page-shell relative z-[2] pt-28 sm:pt-32 lg:flex lg:h-full lg:items-center lg:pt-0">
          <div className="lg:w-[44%] lg:max-w-[560px]">{copy}</div>
        </div>
        <div
          ref={stageRef}
          className="relative mx-auto mt-8 aspect-[4/5] w-[calc(100%-2rem)] max-w-[560px] overflow-hidden rounded-2xl bg-[#f3ece2] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:w-full lg:max-w-none lg:rounded-none"
        >
          <Image
            src={`${BASE}/plate.jpg`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-bottom"
          />
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMaxYMax slice"
            aria-hidden
            focusable="false"
          >
            <defs>
              <linearGradient id="hr-lead" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fff" />
                <stop offset="0.972" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              {ROUTES.map((r) => {
                const s = sweep(r)
                return (
                  <mask key={r.id} id={`hr-m-${r.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
                    <g transform={`rotate(${s.angle.toFixed(2)} ${s.ax} ${s.ay})`}>
                      <rect
                        data-sweep={r.id}
                        x={s.ax - 1600 - r.w}
                        y={s.ay - 800}
                        width="1600"
                        height="1600"
                        fill="url(#hr-lead)"
                        style={{ transform: `translateX(${s.span.toFixed(1)}px)` }}
                      />
                    </g>
                  </mask>
                )
              })}
            </defs>
            <path data-probe d="M0 0" visibility="hidden" />
            {Object.entries(TOKENS).map(([name, t]) => (
              <image key={name} data-patch={name} href={`${BASE}/patch-${name}.png`} x={t.x} y={t.y} width={t.w} height={t.h} />
            ))}
            {/* Channels: far wall in shadow, a darker crease, then the channel floor matched to the plate's surface. */}
            {ROUTES.map((r) => (
              <g key={r.id} mask={`url(#hr-m-${r.id})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d={r.d} stroke="#d2c8bb" strokeWidth={r.w} transform="translate(-3.4 -4.2)" />
                <path d={r.d} stroke="#bdb1a2" strokeWidth={r.w - 6} transform="translate(-2.4 -3)" />
                <path d={r.d} stroke="#f9f1e7" strokeWidth={r.w - 2} transform="translate(1.4 2.2)" />
              </g>
            ))}
            <g data-hub style={fillBox}>
              <ellipse cx="1235" cy="650" rx="62" ry="25" fill="#cbc0b2" />
              <ellipse cx="1236.6" cy="652.4" rx="59" ry="22.5" fill="#f6eee4" />
              <ellipse cx="1237" cy="653" rx="41" ry="15.5" fill="none" stroke="#e0d4c5" strokeWidth="1.4" />
              <ellipse data-core cx="1237" cy="653" rx="16" ry="6.2" fill="#1b2d45" style={fillBox} />
            </g>
            <g data-output style={fillBox}>
              <ellipse cx="1514" cy="738" rx="30" ry="12.5" fill="#cbc0b2" />
              <ellipse cx="1515.3" cy="740" rx="27.5" ry="10.6" fill="#f6eee4" />
              <ellipse cx="1515.3" cy="740" rx="27.5" ry="10.6" fill="none" stroke={BRASS} strokeWidth="2.6" />
            </g>
            {Object.entries(TOKENS).map(([name, t]) => (
              <g key={name} data-token={name} style={{ transform: at(t.rest[0], t.rest[1], LANE_SCALE) }}>
                <image href={`${BASE}/token-${name}.png`} x={t.x - t.cx} y={t.y - t.cy} width={t.w} height={t.h} />
              </g>
            ))}
          </svg>
          {reduce ? null : (
            <MotionToggle
              paused={state !== "playing"}
              ended={state === "ended"}
              onToggle={toggle}
              label="system illustration"
              className="absolute right-3 top-3 z-[3] lg:right-[2.2%] lg:top-6"
            />
          )}
        </div>
        <ul
          ref={legendRef}
          aria-label="Lanes in the illustration"
          className="relative z-[2] mx-auto mt-3 flex w-fit flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] font-semibold text-ink lg:absolute lg:bottom-[3.2%] lg:right-[calc(2.2%+132px)] lg:mt-0 lg:rounded-full lg:border lg:border-ink/10 lg:bg-cream/95 lg:px-3 lg:py-2"
        >
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="h-[9px] w-[14px] rounded-[3px] border border-[#93b4d6] bg-[#cfe1f3]" />
            Content
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="h-[9px] w-[14px] rounded-full border border-[#c7b79d] bg-[#fbf6ee]" />
            Ads
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="h-[9px] w-[14px] rounded-full bg-[#1b2d45]" />
            Campaigns
          </li>
        </ul>
      </div>
      <p className="sr-only">
        Illustration: loose signals on a floor are routed through channels into one hub, then out along three parallel
        lanes for content, ads and campaigns, which converge into one brass-rimmed result.
      </p>
      <div aria-hidden className="h-10 lg:h-0" />
    </section>
  )
}
