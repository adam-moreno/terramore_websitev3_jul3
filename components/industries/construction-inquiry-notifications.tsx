"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
  pickInquiryChannel,
  resolveVisitorLocality,
  type InquiryChannel,
} from "@/lib/construction-locality"

type AppKind = "messages" | "slack" | "calendly" | "terramore"

type Props = {
  surface: "desktop-panel" | "mobile-hero" | "page-bottom"
  className?: string
}

const CYCLE: AppKind[] = ["messages", "slack", "calendly", "terramore"]
const CYCLE_MS = 4200

const APP_META: Record<
  AppKind,
  {
    appName: string
    title: (place: string) => string
    body: (place: string, channel: InquiryChannel) => string
    photo: string
    photoAlt: string
  }
> = {
  messages: {
    appName: "Messages",
    title: (place) => `New Inquiry — ${place}`,
    body: (_place, channel) => `Whole-home renovation · via ${channel}`,
    photo: "/founder/sofia-ramirez-cartoon.png",
    photoAlt: "",
  },
  slack: {
    appName: "Slack",
    title: (place) => `New inquiry from ${place}`,
    body: (_place, channel) => `#leads · Source: ${channel}`,
    photo: "/founder/marcus-bell-cartoon.png",
    photoAlt: "",
  },
  calendly: {
    appName: "Calendly",
    title: (place) => `Meeting booked — ${place}`,
    body: (_place, channel) => `Consultation · Tomorrow 10:00 AM · ${channel}`,
    photo: "/founder/jordan-blake-cartoon.png",
    photoAlt: "",
  },
  terramore: {
    appName: "Terramore",
    title: (place) => `Lead scored — ${place}`,
    body: (_place, channel) => `High intent · ${channel} · ready to follow up`,
    photo: "/founder/adam-moreno-headshot.png",
    photoAlt: "",
  },
}

/**
 * iOS-style frosted notification banners over the construction hero.
 * Same look for every app — photo + app badge + title + app name — cycling
 * Messages → Slack → Calendly → Terramore at the top of the surface.
 */
export function ConstructionInquiryNotifications({ surface, className = "" }: Props) {
  const [places, setPlaces] = useState<string[]>([
    "Sherman Oaks",
    "Bel Air",
    "Glendale",
    "Pasadena",
  ])
  const [channels, setChannels] = useState<InquiryChannel[]>([
    "Google Ads",
    "Instagram Ads",
    "Google Search",
    "Website form",
  ])
  const [visible, setVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    let cancelled = false
    const delay = reduceMotion ? 0 : surface === "page-bottom" ? 200 : 600
    const showTimer = window.setTimeout(() => {
      if (!cancelled) setVisible(true)
    }, delay)

    ;(async () => {
      const locality = await resolveVisitorLocality()
      if (cancelled) return
      const nextPlaces = locality.places.length >= 4 ? locality.places : [locality.place, ...locality.places]
      setPlaces(nextPlaces.slice(0, 4))
      setChannels(
        nextPlaces.slice(0, 4).map((p, i) => pickInquiryChannel(`${p}|${surface}|${i}`))
      )
    })()

    return () => {
      cancelled = true
      window.clearTimeout(showTimer)
    }
  }, [surface, reduceMotion])

  useEffect(() => {
    if (reduceMotion || !visible) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % CYCLE.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, visible])

  const kind = CYCLE[index]!
  const place = places[index % places.length] ?? places[0]!
  const channel = channels[index % channels.length] ?? "Google Ads"
  const topClass =
    surface === "mobile-hero"
      ? "left-4 right-4 top-[4.85rem] mx-auto max-w-[21.5rem]"
      : surface === "desktop-panel"
        ? "left-4 right-4 top-3.5 mx-auto max-w-[21rem] sm:left-5 sm:right-5 sm:top-4"
        : "inset-x-0 top-0 mx-auto max-w-[21.5rem]"

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 ${className}`}
      aria-hidden
      data-surface={surface}
    >
      <div
        className={`absolute ${topClass} transition-all duration-500 ease-out ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <IOSBanner
          key={`${kind}-${place}`}
          kind={kind}
          place={place}
          channel={channel}
          reduceMotion={reduceMotion}
        />
      </div>
    </div>
  )
}

function IOSBanner({
  kind,
  place,
  channel,
  reduceMotion,
}: {
  kind: AppKind
  place: string
  channel: InquiryChannel
  reduceMotion: boolean
}) {
  const meta = APP_META[kind]

  return (
    <div
      className={`overflow-hidden rounded-[0.95rem] shadow-[0_4px_18px_-4px_rgba(15,30,46,0.4)] ring-1 ring-black/[0.08] backdrop-blur-sm ${
        reduceMotion ? "" : "animate-fade-in"
      }`}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.92)" }}
    >
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <div className="relative h-8 w-8 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-black/5">
            <Image
              src={meta.photo}
              alt={meta.photoAlt}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center overflow-hidden rounded-[4px] shadow-sm ring-[1.5px] ring-white">
            <AppBadge kind={kind} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-1.5">
            <p className="truncate text-[12px] font-semibold leading-tight tracking-[-0.01em] text-ink">
              {meta.title(place)}
            </p>
            <p className="shrink-0 text-[9.5px] tabular-nums text-ink/50">now</p>
          </div>
          <p className="mt-px truncate text-[10.5px] leading-snug text-ink/70">
            <span className="font-medium text-ink">{meta.appName}</span>
            <span className="text-ink/35"> · </span>
            <span>{meta.body(place, channel)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function AppBadge({ kind }: { kind: AppKind }) {
  if (kind === "messages") {
    return (
      <svg viewBox="0 0 20 20" className="h-full w-full" aria-hidden>
        <rect width="20" height="20" rx="4.5" fill="#34C759" />
        <path
          d="M4.2 5.8c0-.7.6-1.3 1.3-1.3h9c.7 0 1.3.6 1.3 1.3v6.2c0 .7-.6 1.3-1.3 1.3H9.1L6.2 15.8V13.3H5.5c-.7 0-1.3-.6-1.3-1.3V5.8z"
          fill="white"
        />
      </svg>
    )
  }
  if (kind === "slack") {
    return (
      <svg viewBox="0 0 20 20" className="h-full w-full" aria-hidden>
        <rect width="20" height="20" rx="4.5" fill="#4A154B" />
        <path
          fill="#E01E5A"
          d="M7.6 12.2a1.3 1.3 0 1 1-1.3-1.3h1.3v1.3zm.7 0a1.3 1.3 0 1 1 2.6 0v3.3a1.3 1.3 0 1 1-2.6 0v-3.3z"
        />
        <path
          fill="#36C5F0"
          d="M7.8 7.6A1.3 1.3 0 1 1 9.1 6.3v1.3H7.8zm0 .7a1.3 1.3 0 1 1 0 2.6H4.5a1.3 1.3 0 1 1 0-2.6h3.3z"
        />
        <path
          fill="#2EB67D"
          d="M12.4 7.8a1.3 1.3 0 1 1 1.3 1.3h-1.3V7.8zm-.7 0a1.3 1.3 0 1 1-2.6 0V4.5a1.3 1.3 0 1 1 2.6 0v3.3z"
        />
        <path
          fill="#ECB22E"
          d="M12.2 12.4a1.3 1.3 0 1 1-1.3 1.3v-1.3h1.3zm0-.7a1.3 1.3 0 1 1 0-2.6h3.3a1.3 1.3 0 1 1 0 2.6h-3.3z"
        />
      </svg>
    )
  }
  if (kind === "calendly") {
    return (
      <svg viewBox="0 0 20 20" className="h-full w-full" aria-hidden>
        <rect width="20" height="20" rx="4.5" fill="#006BFF" />
        <path
          d="M6.2 5.2h7.6c.7 0 1.2.5 1.2 1.2v7.2c0 .7-.5 1.2-1.2 1.2H6.2c-.7 0-1.2-.5-1.2-1.2V6.4c0-.7.5-1.2 1.2-1.2zm0 2.2v1.2h7.6V7.4H6.2zm0 2.4v3.8h7.6v-3.8H6.2z"
          fill="white"
        />
      </svg>
    )
  }
  // Terramore mark on brand tile — favicon asset reads clearly at badge size
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand p-[1.5px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png"
        alt=""
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  )
}
