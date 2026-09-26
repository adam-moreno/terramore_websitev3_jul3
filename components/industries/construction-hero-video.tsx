"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const VIDEO_SRC = "/industries/construction/hero-portrait.mp4?v=0921"
const POSTER_SRC = "/industries/construction/hero-poster.jpg?v=0921"

/**
 * Portrait construction hero media.
 * Mobile: full-bleed background behind copy.
 * Desktop: fills the right-hand media frame (object-cover crops sides).
 * Reduced motion: poster still only.
 */
export function ConstructionHeroVideo({
  variant,
  className = "",
}: {
  variant: "background" | "panel"
  className?: string
}) {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

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
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    </div>
  )
}
