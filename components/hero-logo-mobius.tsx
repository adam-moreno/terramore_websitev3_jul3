"use client"

import { useEffect, useRef } from "react"
import { INTEGRATION_LOGOS } from "@/lib/integrations"

const LOOP_SECONDS = 42

// A figure eight that uses the whole track box: the two lobes reach the box edges, and the
// crossing sits at the center of the headline. The mask hole hides the marks while they pass
// behind the type, so the visible part of the orbit is the outer curve of each lobe.
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

      // The hole is a little smaller than the copy so marks fade out right as they pass behind the type.
      layer.style.setProperty("--hole-cx", `${copyBox.left - sectionBox.left + copyBox.width / 2}px`)
      layer.style.setProperty("--hole-cy", `${copyBox.top - sectionBox.top + copyBox.height / 2}px`)
      layer.style.setProperty("--hole-rx", `${copyBox.width * 0.42}px`)
      layer.style.setProperty("--hole-ry", `${copyBox.height * 0.46}px`)
      layer.style.setProperty("--track-w", `${trackW}px`)
      layer.style.setProperty("--track-h", `${trackH}px`)
      track.style.setProperty("--mobius-path", path)
      track.querySelectorAll<HTMLElement>(".hero-mobius-logo").forEach((logo) => {
        logo.style.offsetPath = path
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
              style={{ animationDelay: `${(-index * LOOP_SECONDS) / INTEGRATION_LOGOS.length}s` }}
            >
              <img src={`https://cdn.simpleicons.org/${logo.slug}`} alt="" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
