"use client"

import { useEffect, useRef, useState } from "react"
import { MotionToggle } from "@/components/motion-toggle"

/**
 * "What Terramore does for your business": the owner-approved brand film (v6, 51.8 s, silent), under the section's
 * heading and the approved /marketing line (VD-029). It replaces the earlier Find / Connect / Act / Measure path.
 *
 * Motion (WCAG 2.2.2, VISUAL_DOCTRINE motion rules): the film loops, so it always has a Pause / Play control: a small
 * icon-only button in the corner, quiet at rest and full strength on hover or focus (the pattern used on product pages
 * such as Apple's), and a tap on the film itself also pauses or plays it.
 * It plays only while it's on screen and never restarts on its own after the viewer pauses it. Under reduced motion it
 * doesn't autoplay: the poster shows with a Play button. The film is silent, so it needs no captions; its content is
 * described in text for screen readers. Every business, score, audience, ad and revenue figure in it is an example and
 * is labelled as such inside the film; the note under the player says so too.
 *
 * Source: the film repo branch film/terramore-explainer (Remotion, src/remotion/terramore-film), re-encoded for the web
 * (H.264, CRF 24, no audio, fast start).
 */

/** Landscape (16:9) from md up; the 4:5 portrait cut on phones (film repo: TerramoreBrandFilmPortrait). */
const CUTS = {
  landscape: { src: "/marketing/film/terramore-brand-film.mp4", poster: "/marketing/film/terramore-brand-film-poster.jpg", aspect: "aspect-video" },
  portrait: { src: "/marketing/film/terramore-brand-film-portrait.mp4", poster: "/marketing/film/terramore-brand-film-portrait-poster.jpg", aspect: "aspect-[4/5]" },
} as const
const PHONE = "(max-width: 767px)"

export function WhatTerramoreDoes() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [cut, setCut] = useState<keyof typeof CUTS>("landscape")

  // Phones get the portrait cut; the choice follows the viewport if it changes.
  useEffect(() => {
    const media = window.matchMedia(PHONE)
    const sync = () => setCut(media.matches ? "portrait" : "landscape")
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true // nothing starts on its own; Play is one click away
      return
    }
    if (!("IntersectionObserver" in window)) {
      video.play().catch(() => {})
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [cut])

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => {})
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  return (
    <section aria-labelledby="what-terramore-does-heading" className="bg-cream pb-10 pt-16 md:pb-16 md:pt-24">
      <div className="page-shell">
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gold-ink">How we work with businesses</p>
          <h2
            id="what-terramore-does-heading"
            className="mt-3 text-balance text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[44px]"
          >
            What Terramore does for your business
          </h2>
          <p className="mx-auto mt-4 max-w-[38rem] text-[17px] leading-relaxed text-slate-700 md:text-[18px]">
            Terramore combines software, strategy, and hands-on execution to find the next growth opportunity, act on it,
            and measure what happens.
          </p>
        </div>

        <figure className="mx-auto mt-10 max-w-[64rem] md:mt-12">
          <div className="relative overflow-hidden rounded-[20px] bg-ink shadow-[0_30px_60px_-30px_rgba(15,30,46,0.45)] ring-1 ring-black/[0.06] md:rounded-[28px]">
            {/* Tapping the film also pauses or plays it; the corner button is the visible, keyboard-reachable control. */}
            <video
              key={cut}
              ref={videoRef}
              className={`block w-full cursor-pointer ${CUTS[cut].aspect}`}
              src={CUTS[cut].src}
              poster={CUTS[cut].poster}
              muted
              loop
              playsInline
              preload="metadata"
              aria-describedby="terramore-film-description"
              onClick={toggle}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <MotionToggle
              paused={!playing}
              onToggle={toggle}
              label="video"
              tone="dark"
              compact
              className="absolute bottom-3 left-3 opacity-70 backdrop-blur transition-opacity hover:opacity-100 focus-visible:opacity-100 md:bottom-4 md:left-4"
            />
          </div>
          <figcaption className="mt-3 text-center text-[13px] text-slate-600">
            Illustrative: example businesses and sample data.
          </figcaption>
          <p id="terramore-film-description" className="sr-only">
            A silent film. We diagnose your business: a Digital Footprint report scores digital experience, discoverability, trust,
            conversion readiness and technical health. Integrate with your existing tools: Google, Meta, Shopify, HubSpot
            and Mailchimp connect to the Growth Workspace. One intelligence layer: find your customers, where your
            customers are, where your buyers are (the states with your repeat customers and deal seekers), what your
            customers search and their demographics, for service businesses and product brands. Map your customer journey: search, a social post, reviews, emails, your landing
            page, then a booked call or an order. Create your content: social, video, drone and animation. We create and
            manage your ads across Google, Meta, TikTok, YouTube and PR. Revenue month by month from June to September.
            We&rsquo;re your Growth Partner, not your agency. Get more. Earn more. Terramore.
          </p>
        </figure>

        <p className="mt-6 text-center">
          <a
            href="#how-we-work"
            className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink underline underline-offset-4 hover:text-brand"
          >
            See each step in detail
          </a>
        </p>
      </div>
    </section>
  )
}
