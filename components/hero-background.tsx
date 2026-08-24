"use client"

import { useEffect, useRef, useState } from "react"

type HeroSlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string }

const HERO_SLIDES: HeroSlide[] = [
  { type: "video", src: "/hero/hero-bg-1-apparel-loop.mp4" },
  { type: "image", src: "/hero/hero-bg-1-ecommerce-ops.png" },
  { type: "image", src: "/hero/hero-bg-3-growth-abstract.png" },
  { type: "image", src: "/hero/hero-bg-4-business-meeting.png" },
]

const SLIDE_DURATION_MS = 7000

export function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, SLIDE_DURATION_MS)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex

        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.type === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                className="absolute inset-0 h-full w-full object-cover"
                src={slide.src}
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-cover bg-center ${
                  isActive ? "animate-hero-ken-burns" : ""
                }`}
                style={{ backgroundImage: `url(${slide.src})` }}
              />
            )}
          </div>
        )
      })}

      {/* Dark cinematic overlays for text readability */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
    </div>
  )
}
