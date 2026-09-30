"use client"

import { useEffect, useRef } from "react"
import { INTEGRATION_LOGOS } from "@/lib/integrations"

// Marks rest along the path, in every motion setting: nothing moves behind the headline
// (Visual Doctrine forbidden zones), and there is no collapsed reduced-motion state.
// A figure eight that uses the whole track box: the two lobes reach the box edges, and the
// crossing sits at the center of the headline. The mask hole hides whatever sits behind the type,
// so the visible part of the orbit is the outer curve of each lobe.
function infinityPath(width: number, height: number) {
  const pad = 24
  const cx = width / 2
  const cy = height / 2
  const rx = Math.max(48, (width - pad * 2) / 4)
  const ry = Math.max(36, cy - pad)
  const left = cx - rx * 2
  const right = cx + rx * 2
  return `M ${cx} ${cy} C ${cx} ${cy - ry} ${left} ${cy - ry} ${left} ${cy} C ${left} ${cy + ry} ${cx} ${cy + ry} ${cx} ${cy} C ${cx} ${cy - ry} ${right} ${cy - ry} ${right} ${cy} C ${right} ${cy + ry} ${cx} ${cy + ry} ${cx} ${cy}`
}

const MARK_SIZE = 40
const MARK_GAP = 52
const SAMPLES = 720
// The mask is transparent to 84% of the hole ellipse and opaque at 100%; 0.97 keeps each mark above 80% mask opacity.
const CLEAR_OF_HOLE = 0.97

type Frame = {
  originX: number
  originY: number
  hole: { cx: number; cy: number; rx: number; ry: number }
  headline: { left: number; top: number; right: number; bottom: number }
  width: number
  height: number
  fadeTop: number
}

// Resting spots, as offset-distance percentages, only where a whole mark is visible: outside the mask hole,
// clear of the headline, below the top fade and inside the clipped hero. Marks are spread evenly and at least
// MARK_GAP apart, so a narrow hero shows fewer marks (earliest in the list first, like the phone layout)
// instead of parking some where the mask hides them.
function restingOffsets(d: string, frame: Frame, max: number) {
  const probe = document.createElementNS("http://www.w3.org/2000/svg", "path")
  probe.setAttribute("d", d)
  const total = probe.getTotalLength()
  if (!total) return []
  const edge = MARK_SIZE / 2
  const { hole, headline } = frame
  const clear: number[] = []
  for (let i = 0; i < SAMPLES; i++) {
    const at = (i / SAMPLES) * total
    const point = probe.getPointAtLength(at)
    // The negative margins on .hero-mobius-logo render each mark's center half a mark up and left of its path point.
    const x = frame.originX + point.x - edge
    const y = frame.originY + point.y - edge
    const inHole = Math.hypot((x - hole.cx) / hole.rx, (y - hole.cy) / hole.ry) < CLEAR_OF_HOLE
    const onHeadline =
      x > headline.left - edge && x < headline.right + edge && y > headline.top - edge && y < headline.bottom + edge
    const inFrame = x > edge && x < frame.width - edge && y > frame.fadeTop + edge && y < frame.height - edge
    if (!inHole && !onHeadline && inFrame) clear.push(at)
  }
  const clearLength = (clear.length / SAMPLES) * total
  const count = Math.min(max, Math.floor(clearLength / MARK_GAP))
  return Array.from({ length: count }, (_, k) => {
    const at = clear[Math.floor(((k + 0.5) * clear.length) / count)]
    return (at / total) * 100
  })
}

export function HeroLogoMobius() {
  const layerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const track = trackRef.current
    if (!layer || !track) return
    const section = layer.closest("section")
    const copy = section?.querySelector("[data-hero-copy]")
    if (!section || !(copy instanceof HTMLElement)) return

    const update = () => {
      const sectionBox = section.getBoundingClientRect()
      const copyBox = copy.getBoundingClientRect()
      // The track is wider and taller than the copy, so the lobes clear the mask hole on every side.
      const reach = Math.min(200, Math.max(120, sectionBox.width * 0.1))
      const trackW = Math.min(sectionBox.width * 0.94, copyBox.width + reach * 2)
      const trackH = Math.min(Math.max(copyBox.height + 150, 260), 460)
      const d = infinityPath(trackW, trackH)
      const path = `path("${d}")`

      // The hole is a little smaller than the copy so marks fade out right where the type starts.
      const hole = {
        cx: copyBox.left - sectionBox.left + copyBox.width / 2,
        cy: copyBox.top - sectionBox.top + copyBox.height / 2,
        rx: copyBox.width * 0.42,
        ry: copyBox.height * 0.46,
      }
      layer.style.setProperty("--hole-cx", `${hole.cx}px`)
      layer.style.setProperty("--hole-cy", `${hole.cy}px`)
      layer.style.setProperty("--hole-rx", `${hole.rx}px`)
      layer.style.setProperty("--hole-ry", `${hole.ry}px`)
      layer.style.setProperty("--track-w", `${trackW}px`)
      layer.style.setProperty("--track-h", `${trackH}px`)
      track.style.setProperty("--mobius-path", path)

      const logos = track.querySelectorAll<HTMLElement>(".hero-mobius-logo")
      const headlineBox = (copy.querySelector("h1") ?? copy).getBoundingClientRect()
      const offsets = restingOffsets(
        d,
        {
          originX: hole.cx - trackW / 2,
          originY: hole.cy - trackH / 2,
          hole,
          headline: {
            left: headlineBox.left - sectionBox.left,
            top: headlineBox.top - sectionBox.top,
            right: headlineBox.right - sectionBox.left,
            bottom: headlineBox.bottom - sectionBox.top,
          },
          width: layer.clientWidth,
          height: Math.min(layer.clientHeight, section.clientHeight),
          // Same 5.75rem as the .hero-logo-topfade mask in globals.css.
          fadeTop: parseFloat(getComputedStyle(document.documentElement).fontSize) * 5.75,
        },
        logos.length,
      )
      logos.forEach((logo, index) => {
        logo.style.offsetPath = path
        if (index < offsets.length) {
          logo.style.offsetDistance = `${offsets[index]}%`
          logo.style.display = ""
        } else {
          logo.style.display = "none"
        }
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(section)
    observer.observe(copy)
    window.addEventListener("resize", update)
    void document.fonts?.ready.then(update)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div
      ref={layerRef}
      className="hero-logo-mask pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="hero-logo-topfade absolute inset-0">
        <div ref={trackRef} className="hero-mobius-track">
          {INTEGRATION_LOGOS.map((logo, index) => (
            <span
              key={logo.slug}
              className="hero-mobius-logo"
              style={{ offsetDistance: `${(index / INTEGRATION_LOGOS.length) * 100}%` }}
            >
              <img src={`https://cdn.simpleicons.org/${logo.slug}`} alt="" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
