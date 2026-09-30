"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { MotionToggle } from "@/components/motion-toggle"
import { useOnScreenAndVisible, usePrefersReducedMotion } from "@/hooks/use-autoplay"

const VIDEO_SRC = "/industries/construction/hero-portrait.mp4?v=0921"
const POSTER_SRC = "/industries/construction/hero-poster.jpg?v=0921"

/**
 * Portrait construction hero media.
 * Mobile: full-bleed background behind copy.
 * Desktop: fills the right-hand media frame (object-cover crops sides).
 * Atmosphere: real jobsite footage sets the scene. It sits behind or beside the H1, so it starts on the
 * poster and only plays after Play; it stops off screen or in a hidden tab (VR-47, VR-48). Reduced motion:
 * poster still only.
 */
export function ConstructionHeroVideo({
  variant,
  className = "",
}: {
  variant: "background" | "panel"
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(true)
  const reduceMotion = usePrefersReducedMotion()
  const onScreen = useOnScreenAndVisible(rootRef, 0.1)
  const playing = onScreen && !paused && !reduceMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) video.play().catch(() => {})
    else video.pause()
  }, [playing])

  if (reduceMotion) {
    return (
      <div className={`absolute inset-0 ${className}`} aria-hidden>
        <Image
          src={POSTER_SRC}
          alt=""
          fill
          priority={variant === "background"}
          className="object-cover object-center"
          sizes={variant === "background" ? "100vw" : "(max-width: 1024px) 100vw, 48vw"}
        />
      </div>
    )
  }

  return (
    <div ref={rootRef} className={`absolute inset-0 ${className}`}>
      <video
        ref={videoRef}
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <MotionToggle
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
        label="background video"
        tone="dark"
        className={`absolute z-20 ${variant === "background" ? "bottom-5 left-4" : "bottom-4 right-4"}`}
      />
    </div>
  )
}
