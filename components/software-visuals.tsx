"use client"

import { useEffect, useRef, useState, forwardRef, type ReactNode } from "react"
import Link from "next/link"
import { INTEGRATION_LOGOS } from "@/lib/integrations"

const TILE =
  "rounded-2xl bg-white shadow-[0_12px_28px_-18px_rgba(15,30,46,0.28)] ring-1 ring-black/[0.04]"

const Wash = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  function Wash({ children, className = "" }, ref) {
    // A visual that brings its own background (the dark Vlair recorder) should not get the blue wash under it.
    const wash = /\bbg-/.test(className) ? "" : "software-visual-wash"
    // From md up the wash fills a fixed-aspect frame. Below md it sits in flow with a minimum height,
    // so a phone-width visual grows to fit its content instead of overlapping or clipping it.
    return (
      <div
        ref={ref}
        className={`${wash} relative min-h-[26rem] overflow-hidden md:absolute md:inset-0 md:min-h-0 ${className}`}
      >
        {children}
      </div>
    )
  }
)

function LineIcon({
  children,
  size = 28,
}: {
  children: ReactNode
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f1e2e"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function BrandLogo({
  slug,
  name,
  size = 28,
  className,
}: {
  slug: string
  name: string
  size?: number
  className?: string
}) {
  // When a className is given it owns the size, so the logo can change size across breakpoints.
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={name}
      className={`object-contain ${className ?? ""}`}
      style={className ? undefined : { width: size, height: size }}
    />
  )
}

function useCycle(length: number, ms: number, paused: boolean) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % length)
    }, ms)
    return () => window.clearInterval(id)
  }, [length, ms, paused])

  return [index, setIndex] as const
}

const TILE_TILTS = [-1.8, 2.2, -1.2, 1.6, -2.4, 1.1] as const

function scatterLogo(index: number) {
  const tilt = `${TILE_TILTS[index % TILE_TILTS.length]}deg`
  const delay = `${(index % 8) * 0.28}s`
  return { tilt, delay }
}

export function IntegrationTilesVisual({
  showLink = true,
}: {
  showLink?: boolean
}) {
  return (
    <Wash>
      {/* Phones: center the logo field and the button together as one group so the button hugs the last
          row of logos. From md up the grid and the button return to their fixed absolute positions. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-1 md:static md:block md:gap-0 md:px-0">
        <div
          className={`grid grid-cols-6 content-center items-center justify-items-center gap-x-1.5 gap-y-2 px-3 md:absolute md:inset-x-3 md:top-6 md:gap-x-3 md:gap-y-3 md:p-0 ${
            showLink ? "md:bottom-[3.15rem]" : "md:bottom-2"
          }`}
        >
          {INTEGRATION_LOGOS.map((logo, index) => {
            const spot = scatterLogo(index)
            return (
              <div
                key={logo.slug}
                className="software-icon-tile software-icon-tile-still flex h-9 w-9 items-center justify-center md:h-10 md:w-10"
                style={{
                  transform: `rotate(${spot.tilt})`,
                  animationDelay: spot.delay,
                }}
              >
                <BrandLogo slug={logo.slug} name={logo.name} className="h-4 w-4 md:h-[18px] md:w-[18px]" />
              </div>
            )
          })}
        </div>

        {showLink ? (
          <Link
            href="/integrations"
            className="z-[3] rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-brand shadow-[0_10px_22px_-14px_rgba(15,30,46,0.45)] ring-1 ring-brand/20 transition hover:bg-brand hover:text-white hover:ring-brand md:absolute md:bottom-3 md:left-1/2 md:-translate-x-1/2"
          >
            See all integrations
          </Link>
        ) : null}
      </div>
    </Wash>
  )
}

const MONEY_BEATS = [
  {
    id: "ads",
    line: "Ads put new people on the site.",
    source: "Ads",
    add: 2180,
    apps: [
      { slug: "meta", name: "Meta" },
      { slug: "googleads", name: "Google Ads" },
      { slug: "facebook", name: "Facebook" },
    ],
  },
  {
    id: "site",
    line: "The site turns a click into an order.",
    source: "Site",
    add: 3040,
    apps: [
      { slug: "shopify", name: "Shopify" },
      { slug: "stripe", name: "Stripe" },
    ],
  },
  {
    id: "follow",
    line: "A text brings a quiet lead back.",
    source: "Email",
    add: 1920,
    apps: [
      { slug: "mailchimp", name: "Mailchimp" },
      { slug: "whatsapp", name: "WhatsApp" },
      { slug: "hubspot", name: "HubSpot" },
    ],
  },
  {
    id: "content",
    line: "One shoot. Posted on every platform.",
    source: "Content",
    add: 1280,
    apps: [
      { slug: "instagram", name: "Instagram" },
      { slug: "youtube", name: "YouTube" },
      { slug: "tiktok", name: "TikTok" },
    ],
  },
] as const

function Face({ src, name, size = 48 }: { src: string; name: string; size?: number }) {
  return (
    <img
      src={src}
      alt={name}
      className="shrink-0 rounded-full object-cover ring-1 ring-black/5"
      style={{ width: size, height: size }}
    />
  )
}

function DataRow({
  label,
  value,
  loud = false,
  compact = false,
}: {
  label: string
  value: string
  loud?: boolean
  compact?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        className={`shrink-0 ${compact ? "text-[11px]" : "text-[13px]"} ${
          loud ? "font-semibold text-ink" : "font-medium text-slate-400"
        }`}
      >
        {label}
      </span>
      <span
        className={`whitespace-pre-line text-right font-normal leading-snug text-slate-600 ${
          compact ? "text-[11px]" : "text-[13px]"
        }`}
      >
        {value}
      </span>
    </div>
  )
}

type VlairPage = "home" | "product" | "checkout" | "paid" | "email"
type TrackRow = { label: string; value: string }
type VlairTarget = "shop" | "short" | "bag" | "pay"

const SITE_BEATS = [
  { id: "home", label: "Home", url: "vlair.com/" },
  { id: "scroll", label: "Scroll", url: "vlair.com/" },
  { id: "product", label: "Product", url: "vlair.com/sculpt-bodysuit" },
  { id: "checkout", label: "Checkout", url: "vlair.com/checkout" },
  { id: "buy", label: "Buy", url: "vlair.com/checkout" },
] as const

type VlairView = {
  beat: number
  page: VlairPage
  url: string
  scroll: number
  cursor: { x: number; y: number }
  clicking: boolean
  snap: boolean
  gaze: VlairTarget | null
  press: VlairTarget | null
  form: { name: string; card: string }
  metrics: TrackRow[]
}

const TRACK_SLOTS = [
  "Page",
  "Scroll",
  "Products",
  "Cart",
  "User",
  "Card",
  "Checkout",
  "Paid",
  "Order",
  "Email",
  "Campaign",
  "Upsell",
] as const

const BAG_CURSOR = { x: 67, y: 63 }
const PAY_CURSOR = { x: 50, y: 84 }

function patchMetrics(rows: TrackRow[], label: string, value: string): TrackRow[] {
  const index = rows.findIndex((row) => row.label === label)
  if (index === -1) return [...rows, { label, value }]
  return rows.map((row, i) => (i === index ? { label, value } : row))
}

function TrackHud({ rows, onDark = false }: { rows: TrackRow[]; onDark?: boolean }) {
  const values = Object.fromEntries(rows.map((row) => [row.label, row.value]))
  const filled = TRACK_SLOTS.map((label) => ({
    label,
    value: values[label]?.replace("\n", ", "),
  }))
    .filter((row) => row.value)
    .slice(-4)

  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 software-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-medium ${onDark ? "text-white/40" : "text-slate-400"}`}>What we tracked</p>
        {filled.length === 0 ? (
          <p className={`text-[11px] ${onDark ? "text-white/35" : "text-slate-300"}`}>Watching this visit</p>
        ) : (
          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
            {filled.map((row) => (
              <p key={row.label} className="software-track-row-in text-[11px] leading-snug">
                <span className={`font-semibold ${onDark ? "text-white" : "text-ink"}`}>{row.label}</span>{" "}
                <span className={onDark ? "text-white/60" : "text-slate-600"}>{row.value}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function settledVlair(beat: number): VlairView {
  if (beat === 0) {
    return {
      beat: 0,
      page: "home",
      url: "vlair.com/",
      scroll: 0,
      cursor: { x: 62, y: 40 },
      clicking: false,
      snap: true,
      gaze: null,
      press: null,
      form: { name: "", card: "" },
      metrics: [
        { label: "Page", value: "Home" },
        { label: "Scroll", value: "0%" },
      ],
    }
  }
  if (beat === 1) {
    return {
      beat: 1,
      page: "home",
      url: "vlair.com/",
      scroll: 50,
      cursor: { x: 68, y: 78 },
      clicking: false,
      snap: true,
      gaze: "short",
      press: null,
      form: { name: "", card: "" },
      metrics: [
        { label: "Page", value: "Home" },
        { label: "Scroll", value: "64%" },
        { label: "Products", value: "Sculpt Seamless\nSoft short" },
      ],
    }
  }
  if (beat === 2) {
    return {
      beat: 2,
      page: "product",
      url: "vlair.com/sculpt-bodysuit",
      scroll: 0,
      cursor: BAG_CURSOR,
      clicking: false,
      snap: true,
      gaze: null,
      press: null,
      form: { name: "", card: "" },
      metrics: [
        { label: "Page", value: "Product" },
        { label: "Scroll", value: "64%" },
        { label: "Products", value: "Sculpt Seamless\nSoft short" },
        { label: "Cart", value: "Sculpt Seamless · $128" },
      ],
    }
  }
  if (beat === 3) {
    return {
      beat: 3,
      page: "checkout",
      url: "vlair.com/checkout",
      scroll: 0,
      cursor: PAY_CURSOR,
      clicking: false,
      snap: true,
      gaze: null,
      press: null,
      form: { name: "Jordan Lee", card: "4242 ···· ···· 4242" },
      metrics: [
        { label: "Page", value: "Product" },
        { label: "Scroll", value: "64%" },
        { label: "Products", value: "Sculpt Seamless\nSoft short" },
        { label: "Cart", value: "Sculpt Seamless · $128" },
        { label: "User", value: "Jordan Lee" },
        { label: "Card", value: "Visa ···· 4242" },
        { label: "Checkout", value: "Ready" },
      ],
    }
  }
  return {
    beat: 4,
    page: "email",
    url: "vlair.com/email/first-buy",
    scroll: 0,
    cursor: { x: 72, y: 78 },
    clicking: false,
    snap: true,
    gaze: null,
    press: null,
    form: { name: "Jordan Lee", card: "4242 ···· ···· 4242" },
    metrics: [
      { label: "Page", value: "Product" },
      { label: "Scroll", value: "64%" },
      { label: "Products", value: "Sculpt Seamless\nSoft short" },
      { label: "Cart", value: "Sculpt Seamless · $128" },
      { label: "User", value: "Jordan Lee" },
      { label: "Card", value: "Visa ···· 4242" },
      { label: "Checkout", value: "Ready" },
      { label: "Paid", value: "Stripe · $128" },
      { label: "Order", value: "#4182" },
      { label: "Email", value: "Confirmation sent" },
      { label: "Campaign", value: "First-time buyer" },
      { label: "Upsell", value: "Soft short · $68" },
    ],
  }
}

function useVlairRecording(paused: boolean) {
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const [view, setView] = useState<VlairView>(() => settledVlair(0))

  useEffect(() => {
    let cancelled = false

    const sleep = async (ms: number) => {
      let left = ms
      while (left > 0) {
        if (cancelled) return
        if (pausedRef.current) {
          await new Promise((resolve) => window.setTimeout(resolve, 80))
          continue
        }
        const slice = Math.min(40, left)
        await new Promise((resolve) => window.setTimeout(resolve, slice))
        left -= slice
      }
    }

    const play = async () => {
      while (!cancelled) {
        setView({ ...settledVlair(0), snap: true, clicking: false, gaze: null })
        await sleep(500)
        if (cancelled) return
        setView((current) => ({ ...current, snap: false, cursor: { x: 56, y: 46 } }))
        await sleep(1400)
        if (cancelled) return

        setView((current) => ({
          ...current,
          beat: 1,
          cursor: { x: 50, y: 54 },
        }))
        await sleep(200)
        if (cancelled) return

        const ticks = [
          { y: 58, scroll: 14, pct: 18 },
          { y: 64, scroll: 28, pct: 36 },
          { y: 70, scroll: 40, pct: 52 },
          { y: 74, scroll: 50, pct: 64 },
        ]
        for (const tick of ticks) {
          setView((current) => ({
            ...current,
            cursor: { x: 50, y: tick.y },
            scroll: tick.scroll,
          }))
          await sleep(550)
          if (cancelled) return
          setView((current) => ({
            ...current,
            metrics: patchMetrics(current.metrics, "Scroll", `${tick.pct}%`),
          }))
          await sleep(750)
          if (cancelled) return
        }

        setView((current) => ({ ...current, cursor: { x: 28, y: 76 }, gaze: "shop" }))
        await sleep(1200)
        if (cancelled) return
        setView((current) => ({
          ...current,
          metrics: patchMetrics(current.metrics, "Products", "Sculpt Seamless"),
        }))
        await sleep(1000)
        if (cancelled) return

        setView((current) => ({ ...current, cursor: { x: 72, y: 76 }, gaze: "short" }))
        await sleep(1200)
        if (cancelled) return
        setView((current) => ({
          ...current,
          metrics: patchMetrics(current.metrics, "Products", "Sculpt Seamless\nSoft short"),
        }))
        await sleep(1000)
        if (cancelled) return

        setView((current) => ({ ...current, cursor: { x: 28, y: 76 }, gaze: "shop" }))
        await sleep(800)
        if (cancelled) return
        setView((current) => ({ ...current, clicking: true, press: "shop", gaze: null }))
        await sleep(520)
        if (cancelled) return
        setView((current) => ({
          ...current,
          beat: 2,
          page: "product",
          url: "vlair.com/sculpt-bodysuit",
          scroll: 0,
          snap: true,
          clicking: false,
          press: null,
          gaze: null,
          cursor: { x: 52, y: 28 },
          metrics: patchMetrics(current.metrics, "Page", "Product"),
        }))
        await sleep(250)
        if (cancelled) return
        setView((current) => ({ ...current, snap: false, cursor: BAG_CURSOR }))
        await sleep(1200)
        if (cancelled) return

        setView((current) => ({ ...current, clicking: true, press: "bag" }))
        await sleep(520)
        if (cancelled) return
        setView((current) => ({
          ...current,
          clicking: false,
          press: null,
          metrics: patchMetrics(current.metrics, "Cart", "Sculpt Seamless · $128"),
        }))
        await sleep(1500)
        if (cancelled) return

        setView((current) => ({
          ...current,
          beat: 3,
          page: "checkout",
          url: "vlair.com/checkout",
          snap: true,
          cursor: { x: 50, y: 38 },
          form: { name: "", card: "" },
        }))
        await sleep(280)
        if (cancelled) return
        setView((current) => ({ ...current, snap: false }))
        await sleep(1000)
        if (cancelled) return
        setView((current) => ({
          ...current,
          form: { name: "Jordan Lee", card: "" },
          cursor: { x: 50, y: 50 },
        }))
        await sleep(700)
        if (cancelled) return
        setView((current) => ({
          ...current,
          metrics: patchMetrics(current.metrics, "User", "Jordan Lee"),
        }))
        await sleep(1200)
        if (cancelled) return
        setView((current) => ({
          ...current,
          form: { name: "Jordan Lee", card: "4242 ···· ···· 4242" },
          cursor: PAY_CURSOR,
          metrics: patchMetrics(current.metrics, "Card", "Visa ···· 4242"),
        }))
        await sleep(700)
        if (cancelled) return
        setView((current) => ({
          ...current,
          metrics: patchMetrics(current.metrics, "Checkout", "Ready"),
        }))
        await sleep(1400)
        if (cancelled) return

        setView((current) => ({ ...current, clicking: true, press: "pay" }))
        await sleep(520)
        if (cancelled) return
        setView((current) => ({
          ...current,
          beat: 4,
          page: "paid",
          snap: true,
          clicking: false,
          press: null,
          cursor: { x: 40, y: 56 },
          metrics: patchMetrics(current.metrics, "Paid", "Stripe · $128"),
        }))
        await sleep(350)
        if (cancelled) return
        setView((current) => ({ ...current, snap: false }))
        await sleep(1200)
        if (cancelled) return
        setView((current) => ({
          ...current,
          metrics: patchMetrics(current.metrics, "Order", "#4182"),
        }))
        await sleep(1200)
        if (cancelled) return
        setView((current) => ({
          ...current,
          metrics: patchMetrics(current.metrics, "Email", "Confirmation sent"),
        }))
        await sleep(1400)
        if (cancelled) return
        setView((current) => ({
          ...current,
          page: "email",
          url: "vlair.com/email/first-buy",
          snap: true,
          cursor: { x: 68, y: 62 },
          metrics: patchMetrics(current.metrics, "Campaign", "First-time buyer"),
        }))
        await sleep(280)
        if (cancelled) return
        setView((current) => ({ ...current, snap: false }))
        await sleep(1100)
        if (cancelled) return
        setView((current) => ({
          ...current,
          cursor: { x: 72, y: 78 },
          metrics: patchMetrics(current.metrics, "Upsell", "Soft short · $68"),
        }))
        await sleep(2800)
      }
    }

    void play()
    return () => {
      cancelled = true
    }
  }, [])

  return view
}

function RecordCursor({
  x,
  y,
  clicking,
  snap,
}: {
  x: number
  y: number
  clicking: boolean
  snap: boolean
}) {
  return (
    <>
      <span
        className={`software-record-rip ${clicking ? "is-on" : ""}`}
        style={{ left: `${x}%`, top: `${y}%` }}
      />
      <svg
        className={`software-record-cursor ${clicking ? "is-click" : ""} ${snap ? "is-snap" : ""}`}
        style={{ left: `${x}%`, top: `${y}%` }}
        viewBox="0 0 12 20"
        aria-hidden
      >
        <path fill="#111" d="M0 0v16.4l4.05-4.1 2.15 5.15 2.35-1-2.15-5.15H12z" />
        <path fill="#fff" d="M1.05 2.05v11.5l3.2-3.2 2.15 5.15 1.15-.48-2.15-5.15h4.3z" />
      </svg>
    </>
  )
}

function VlairChrome({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-[#0a0a0a] text-white">
      <div className="flex shrink-0 items-center gap-1.5 bg-[#141414] px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="ml-1.5 truncate text-[11px] tracking-wide text-white/45">{url}</span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

function VlairHomeDoc({
  scroll,
  press,
  gaze,
  snap,
}: {
  scroll: number
  press: VlairView["press"]
  gaze: VlairView["gaze"]
  snap: boolean
}) {
  return (
    <div
      className="h-[200%] w-full"
      style={{
        transform: `translateY(-${scroll}%)`,
        transition: snap ? "none" : "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <section className="relative h-1/2 overflow-hidden">
        <img src="/vlair/hero-campaign.png" alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="text-[28px] font-light uppercase tracking-[0.32em] text-white">VLAIR</p>
          <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-white/60">Autumn 26</p>
        </div>
      </section>
      <section className="relative h-1/2 overflow-hidden">
        <img
          src="/vlair/editorial-sculpt.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col justify-end gap-2 px-3 pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">The Icons</p>
            <p className="mt-1 text-[15px] font-light uppercase tracking-[0.12em]">Sculpting bodysuits</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={`rounded-xl bg-black/45 p-1.5 ring-1 ring-white/10 ${
                press === "shop" ? "software-record-press ring-white/50" : gaze === "shop" ? "software-record-gaze" : ""
              }`}
            >
              <img
                src="/vlair/product-sculpt-bodysuit-onyx.png"
                alt="VLAIR Sculpt Seamless Bodysuit in Onyx"
                className="h-16 w-full rounded-md object-cover object-top"
              />
              <p className="mt-1 truncate text-[10px] font-medium">Sculpt Seamless</p>
              <p className="text-[10px] text-white/55">$128</p>
            </div>
            <div
              className={`rounded-xl bg-black/45 p-1.5 ring-1 ring-white/10 ${
                press === "short" ? "software-record-press ring-white/50" : gaze === "short" ? "software-record-gaze" : ""
              }`}
            >
              <img
                src="/vlair/editorial-sculpt.png"
                alt="VLAIR Soft short"
                className="h-16 w-full rounded-md object-cover object-center"
              />
              <p className="mt-1 truncate text-[10px] font-medium">Soft short</p>
              <p className="text-[10px] text-white/55">$68</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function VlairRecordScreen({ view }: { view: VlairView }) {
  if (view.page === "product") {
    return (
      <div className="relative h-full">
        <img
          src="/vlair/product-sculpt-bodysuit-onyx.png"
          alt="VLAIR Sculpt Seamless Bodysuit in Onyx"
          className="absolute bottom-3 left-3 top-3 w-[44%] rounded-lg object-cover object-top"
        />
        <div className="absolute left-[52%] right-3 top-[16%]">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Onyx</p>
          <p className="mt-1 text-[15px] font-medium leading-tight">Sculpt Seamless Bodysuit</p>
          <p className="mt-2 text-[16px] text-white/80">$128</p>
        </div>
        <span
          className={`absolute left-[52%] top-[58%] inline-flex w-[38%] justify-center rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-black ${
            view.press === "bag" ? "software-record-press" : ""
          }`}
        >
          Add to bag
        </span>
      </div>
    )
  }

  if (view.page === "checkout") {
    return (
      <div className="relative flex h-full flex-col justify-center gap-2 px-5 pb-14 pt-3 text-[13px]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Checkout</p>
        <div className="rounded-lg bg-white/10 px-3 py-2 text-white/85">
          {view.form.name || <span className="text-white/30">Name</span>}
        </div>
        <div className="rounded-lg bg-white/10 px-3 py-2 text-white/85">
          {view.form.card || <span className="text-white/30">Card</span>}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-white/85">
            {view.form.card ? "04 / 28" : <span className="text-white/30">MM / YY</span>}
          </div>
          <div className="w-16 rounded-lg bg-white/10 px-3 py-2 text-white/85">
            {view.form.card ? "123" : <span className="text-white/30">CVC</span>}
          </div>
        </div>
        <div
          className={`absolute bottom-[8%] left-5 right-5 rounded-lg bg-white py-2 text-center text-[12px] font-semibold uppercase tracking-wide text-black ${
            view.press === "pay" ? "software-record-press" : ""
          }`}
        >
          Pay $128
        </div>
      </div>
    )
  }

  if (view.page === "paid") {
    return (
      <div className="flex h-full items-center gap-4 px-5">
        <img
          src="/vlair/product-sculpt-bodysuit-onyx.png"
          alt="VLAIR Sculpt Seamless Bodysuit in Onyx"
          className="h-[120px] w-[88px] rounded-lg object-cover object-top"
        />
        <div className="min-w-0">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#B8977C]">Paid</p>
          <p className="mt-1 text-[16px] font-medium leading-tight">Sculpt Seamless Bodysuit</p>
          <p className="mt-2 text-[13px] text-white/65">$128 · Stripe</p>
          <p className="mt-2 text-[11px] text-white/45">Confirmation email sent</p>
        </div>
      </div>
    )
  }

  if (view.page === "email") {
    return (
      <div className="flex h-full items-center px-3">
        <div className="w-full rounded-xl bg-white p-2.5 text-ink shadow-[0_12px_28px_-18px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-2">
            <div className="software-icon-tile flex h-5 w-5 items-center justify-center">
              <BrandLogo slug="mailchimp" name="Mailchimp" size={12} />
            </div>
            <p className="min-w-0 truncate text-[12px] font-semibold tracking-tight">
              First-time buyer
            </p>
            <span className="ml-auto shrink-0 text-[10px] font-medium text-slate-400">
              Jordan Lee
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-[#f7f8fa] p-1.5">
            <img
              src="/vlair/editorial-sculpt.png"
              alt="VLAIR Soft short"
              className="h-10 w-10 shrink-0 rounded-md object-cover object-center"
            />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-tight">Soft short</p>
              <p className="text-[10px] text-slate-500">$68 · They looked at this</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Add
            </span>
          </div>
        </div>
      </div>
    )
  }

  return <VlairHomeDoc scroll={view.scroll} press={view.press} gaze={view.gaze} snap={view.snap} />
}

function ChannelDetail({ beat }: { beat: number }) {
  if (beat === 0) {
    return (
      <div className={`${TILE} software-story-arrive flex h-full flex-col overflow-hidden p-2.5`}>
        <div className="flex items-center gap-2.5">
          <Face src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=96&h=96&q=80" name="Devon Hart" size={48} />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-brand">New visit</p>
            <p className="text-[15px] font-semibold tracking-tight text-ink">Devon Hart</p>
            <p className="text-[12px] text-slate-500">Just now</p>
          </div>
        </div>
        <p className="mt-2 text-[13px] leading-snug text-ink/70">From a Meta ad. Data in now.</p>
        <p className="mt-2 text-[11px] font-medium text-slate-400">What we caught</p>
        <div className="mt-1 space-y-0.5">
          <DataRow loud label="Ad" value="Meta · Spring drop" />
          <DataRow loud label="City" value="Austin, TX" />
          <DataRow loud label="CPC" value="$1.14" />
          <DataRow loud label="Page" value="/shop" />
          <DataRow loud label="Device" value="iPhone 15" />
        </div>
        <div className="mt-2 flex items-center gap-2 border-t border-black/[0.05] pt-2">
          <Face src="https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=96&h=96&q=80" name="Mei Tan" size={36} />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-brand">New visit</p>
            <p className="text-[13px] font-semibold text-ink">Mei Tan</p>
            <p className="text-[12px] text-slate-500">Google Ads · Miami</p>
          </div>
        </div>
      </div>
    )
  }

  if (beat === 1) {
    return (
      <div className={`${TILE} software-story-pop flex h-full flex-col overflow-hidden p-2.5`}>
        <p className="text-[12px] font-semibold text-brand">Order just in</p>
        <p className="text-[15px] font-semibold tracking-tight text-ink">Navy tee · $86</p>
        <p className="text-[12px] text-slate-500">Caught in Shopify and Stripe</p>

        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-[#f7f8fa] p-2 ring-1 ring-black/[0.05]">
            <div className="flex items-center gap-1.5">
              <div className="software-icon-tile flex h-7 w-7 items-center justify-center">
                <BrandLogo slug="shopify" name="Shopify" size={14} />
              </div>
              <p className="text-[12px] font-semibold text-ink">Shopify</p>
              <p className="ml-auto text-[10px] font-medium text-slate-400">#1042</p>
            </div>
            <div className="mt-2 flex min-h-0 flex-1 items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=200&q=80"
                alt="Navy tee"
                className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
              />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight text-ink">Navy tee</p>
                <p className="text-[11px] text-slate-500">Qty 1 · $86</p>
              </div>
            </div>
            <div className="mt-1 space-y-0.5">
              <DataRow compact loud label="Cart" value="1 item in" />
              <DataRow compact loud label="Checkout" value="Started" />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-[#ecfdf5] p-2 ring-1 ring-[#14804a]/12">
            <div className="flex items-center gap-1.5">
              <div className="software-icon-tile flex h-7 w-7 items-center justify-center">
                <BrandLogo slug="stripe" name="Stripe" size={14} />
              </div>
              <p className="text-[12px] font-semibold text-ink">Stripe</p>
              <p className="ml-auto text-[10px] font-semibold text-[#14804a]">Paid</p>
            </div>
            <p className="mt-2 text-[22px] font-semibold tracking-tight text-ink">$86.00</p>
            <div className="mt-auto space-y-0.5">
              <DataRow compact loud label="Card" value="Visa · 4242" />
              <DataRow compact loud label="Receipt" value="Sent" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (beat === 2) {
    return (
      <div className={`${TILE} software-story-pop flex h-full flex-col overflow-hidden p-2.5`}>
        <div className="flex items-center gap-2.5">
          <Face src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=96&h=96&q=80" name="Renee Okoye" size={48} />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-brand">Quiet 6 weeks</p>
            <p className="text-[15px] font-semibold tracking-tight text-ink">Renee Okoye</p>
            <p className="text-[12px] text-slate-500">Last buy Jan 12</p>
          </div>
        </div>
        <p className="mt-2 text-[13px] leading-snug text-ink/70">One text. She booked.</p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="software-icon-tile mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
              <BrandLogo slug="mailchimp" name="Mailchimp" size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">Email</p>
              <p className="text-[12px] text-slate-600">Still want the consult? · opened</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="software-icon-tile mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
              <BrandLogo slug="whatsapp" name="WhatsApp" size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">WhatsApp</p>
              <p className="text-[12px] text-slate-600">Yes. Tuesday works.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="software-icon-tile mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
              <BrandLogo slug="hubspot" name="HubSpot" size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">HubSpot</p>
              <p className="text-[12px] text-slate-600">Booked Tue 8:00 am</p>
            </div>
          </div>
        </div>
        <p className="mt-2 border-t border-black/[0.05] pt-2 text-[13px] font-semibold text-[#0f766e]">
          Old lead came back.
        </p>
      </div>
    )
  }

  return (
    <div className={`${TILE} software-story-pop flex h-full flex-col overflow-hidden p-2.5`}>
      <p className="text-[12px] font-semibold text-brand">Automatic posting</p>
      <div className="mt-2 grid min-h-[9rem] flex-1 grid-cols-3 gap-1.5 md:min-h-0">
        {[
          {
            src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=280&q=80",
            alt: "Reel still posted to Instagram",
            slug: "instagram",
            name: "Instagram",
            stamp: "Posted",
            delay: "0.15s",
          },
          {
            src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=280&q=80",
            alt: "Cut posted to YouTube",
            slug: "youtube",
            name: "YouTube",
            stamp: "Live",
            delay: "0.35s",
          },
          {
            src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=280&q=80",
            alt: "Clip posted to TikTok",
            slug: "tiktok",
            name: "TikTok",
            stamp: "Posted",
            delay: "0.55s",
          },
        ].map((post) => (
          <div
            key={post.slug}
            className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-black ring-1 ring-black/10"
          >
            <img src={post.src} alt={post.alt} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
            <div className="relative flex h-7 items-center gap-1 px-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/95">
                <BrandLogo slug={post.slug} name={post.name} size={11} />
              </span>
              <p className="hidden truncate text-[9px] font-semibold text-white md:block">{post.name}</p>
            </div>
            <span
              className="software-posted-stamp absolute right-1.5 top-1.5 rounded-full bg-[#14804a] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white"
              style={{ animationDelay: post.delay }}
            >
              {post.stamp}
            </span>
            <p className="relative mt-auto px-1.5 pb-1.5 text-[9px] font-medium leading-tight text-white/90">
              {post.alt}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const CHANNEL_HOLD_MS = 4000

export function ChannelValueVisual() {
  const [held, setHeld] = useState<number | null>(null)
  const [autoIndex, setIndex] = useCycle(MONEY_BEATS.length, 4000, held !== null)
  const holdTimer = useRef<number | null>(null)
  const active = held ?? autoIndex
  const beat = MONEY_BEATS[active]
  const running = MONEY_BEATS.slice(0, active + 1).reduce((sum, item) => sum + item.add, 0)

  useEffect(() => {
    return () => {
      if (holdTimer.current !== null) window.clearTimeout(holdTimer.current)
    }
  }, [])

  const holdBeat = (index: number) => {
    setHeld(index)
    setIndex(index)
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current)
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null
      setHeld(null)
    }, CHANNEL_HOLD_MS)
  }

  return (
    <Wash className="software-visual-wash-hot flex flex-col p-3">
      <p className="relative z-[4] px-1 text-center text-[14px] font-semibold tracking-tight text-ink">
        {beat.line}
      </p>

      {/* Phones: a clear badge names the active source, then its apps sit in one row. The strip below
          is the switcher, so a first-time viewer can follow which channel is live as it rotates. */}
      <div className="mt-2 flex flex-col items-center gap-1 md:hidden">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand ring-1 ring-brand/20">
          {beat.source}
        </span>
        <div className="flex justify-center gap-1.5">
          {beat.apps.map((app, appIndex) => (
            <div
              key={app.slug}
              className="software-icon-tile flex h-9 w-9 items-center justify-center"
              style={{ animationDelay: `${appIndex * 0.2}s` }}
            >
              <BrandLogo slug={app.slug} name={app.name} size={16} />
            </div>
          ))}
        </div>
      </div>

      {/* The detail card holds a fixed height on phones (sized to the tallest channel) so the whole
          visual never grows or shrinks as the active channel rotates. */}
      <div className="relative mt-2 flex min-h-0 flex-col md:block">
        <div className="hidden md:absolute md:inset-y-0 md:left-0 md:flex md:w-[46%] md:flex-col md:justify-between md:gap-1.5 md:pr-2">
          {MONEY_BEATS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => holdBeat(index)}
              aria-pressed={index === active}
              className={`rounded-2xl px-2 py-1.5 text-left transition ${
                index === active ? "bg-white/80 ring-2 ring-brand/30" : "opacity-45"
              }`}
            >
              <p
                className={`text-[10px] font-semibold ${
                  index === active ? "text-brand" : "text-slate-400"
                }`}
              >
                {item.source}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                {item.apps.map((app, appIndex) => (
                  <div
                    key={app.slug}
                    className="software-icon-tile flex h-9 w-9 items-center justify-center"
                    style={{ animationDelay: `${appIndex * 0.2}s` }}
                  >
                    <BrandLogo slug={app.slug} name={app.name} size={16} />
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="h-[17rem] min-h-0 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[52%]">
          <ChannelDetail beat={active} />
        </div>
      </div>

      <div className={`${TILE} mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-3 py-2 md:flex-nowrap`}>
        <div className="flex w-full min-w-0 gap-1 md:w-auto md:flex-1">
          {MONEY_BEATS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => holdBeat(index)}
              aria-pressed={index === active}
              className={`min-w-0 flex-1 rounded-xl px-1.5 py-1 text-left transition ${
                index === active ? "bg-[#eef3fb] ring-2 ring-inset ring-brand/40" : "opacity-50"
              }`}
            >
              <p
                className={`truncate text-[10px] font-medium ${
                  index === active ? "text-brand" : "text-slate-400"
                }`}
              >
                {item.source}
              </p>
              <p className="text-[12px] font-semibold tabular-nums text-ink">
                ${item.add.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
        <div className="flex w-full items-baseline justify-between border-t border-black/[0.05] pt-1.5 md:block md:w-[4.75rem] md:shrink-0 md:border-0 md:pt-0 md:text-right">
          <p className="text-[10px] font-medium text-slate-400">This week</p>
          <p className="text-[13px] font-semibold tabular-nums text-[#14804a]">
            ${running.toLocaleString()}
          </p>
        </div>
      </div>
    </Wash>
  )
}

export function LeakFlowVisual() {
  const [hovered, setHovered] = useState<number | null>(null)
  const live = useVlairRecording(hovered !== null)
  const view = hovered !== null ? settledVlair(hovered) : live

  return (
    <Wash className="flex flex-col bg-[#0a0a0a] p-0">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden text-white md:h-full">
        <div className="flex shrink-0 items-center gap-1.5 bg-[#141414] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="ml-1.5 truncate text-[11px] tracking-wide text-white/45">{view.url}</span>
        </div>
        <div className="grid shrink-0 grid-cols-5 gap-0.5 bg-[#141414] px-2 pb-2 md:gap-1">
          {SITE_BEATS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              className={`rounded-lg px-0.5 py-1.5 text-center transition md:px-1 ${
                index === view.beat ? "bg-white text-ink" : "bg-white/10 text-white/50"
              }`}
            >
              <p className="text-[9px] font-semibold md:text-[10px]">{item.label}</p>
            </button>
          ))}
        </div>
        {/* The recorded screen needs a real height on phones, where the frame is no longer a fixed aspect. */}
        <div className="relative min-h-[15rem] flex-1 overflow-hidden md:min-h-0">
          {/* Absolute wrapper gives the recorded pages a definite height to size against on every breakpoint. */}
          <div className="absolute inset-0">
            <VlairRecordScreen view={view} />
          </div>
          <RecordCursor x={view.cursor.x} y={view.cursor.y} clicking={view.clicking} snap={view.snap} />
        </div>
        <div className="shrink-0 border-t border-white/10 bg-[#141414] px-3 py-2">
          <TrackHud rows={view.metrics} onDark />
        </div>
      </div>
    </Wash>
  )
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduce(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return reduce
}

function FlowStem({ on }: { on: boolean }) {
  return (
    <div
      className={`software-flow-stem mx-auto h-2 ${on ? "software-flow-stem-on" : ""}`}
      aria-hidden
    />
  )
}

function SoftLogo({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="software-icon-tile flex h-5 w-5 shrink-0 items-center justify-center">
      <BrandLogo slug={slug} name={name} size={11} />
    </div>
  )
}

const FLOW_ROLES = [
  { role: "Owner", initial: "O" },
  { role: "Sales", initial: "S" },
  { role: "VA", initial: "V" },
] as const

const FLOW_MOVES = [
  { slug: "hubspot", name: "HubSpot", title: "Deal created", meta: "$2,400" },
  { slug: "twilio", name: "Twilio", title: "Follow-up sent", meta: "SMS" },
  { slug: "calendly", name: "Calendly", title: "Hold created", meta: "2:15 PM" },
] as const

export function FollowUpFlowVisual() {
  const reduce = usePrefersReducedMotion()
  const [scene] = useCycle(5, 2000, reduce)
  const step = reduce ? 4 : scene

  return (
    <Wash className="flex h-full flex-col justify-between p-3 lg:p-4">
      <p className="sr-only">
        A new lead from Sam Reed for $2,400 reaches the owner, sales, and the VA. A deal is created, a
        follow-up is sent, and a hold is booked. Sam replies that 2:15 works. Sales sees it and the next
        action starts.
      </p>

      <div className="flex shrink-0 items-start justify-between gap-3">
        <p className="text-[15px] font-semibold leading-snug tracking-tight text-ink lg:text-[18px]">
          One lead. Everyone knows what happens next.
        </p>
        <span className="software-pulse-dot mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand lg:mt-2" />
      </div>

      <div
        className={`${TILE} flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-1.5 lg:px-4 lg:py-3 ${
          step === 0 ? "ring-2 ring-brand/30" : ""
        }`}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 lg:text-[12px]">
            New lead
          </p>
          <p className="truncate text-[18px] font-semibold tracking-tight text-ink lg:text-[22px]">
            Sam Reed
          </p>
        </div>
        <p className="shrink-0 text-[14px] font-semibold text-ink lg:text-[16px]">$2,400 · Meta form</p>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-brand lg:text-[13px]">
          <span className="software-pulse-dot h-1.5 w-1.5 rounded-full bg-brand" />
          Just now
        </span>
        <SoftLogo slug="meta" name="Meta" />
      </div>

      <div className={step >= 1 ? "software-node-in" : "opacity-25"}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 lg:text-[12px]">
          Team knows now
        </p>
        <div className="grid grid-cols-3 gap-1.5 lg:mt-1.5 lg:gap-2">
          {FLOW_ROLES.map((person, index) => (
            <div
              key={person.role}
              className={`flex items-center justify-center gap-1.5 rounded-xl bg-white px-2 py-1 ring-1 ring-black/[0.05] lg:gap-2 lg:px-2.5 lg:py-2.5 ${
                step >= 1 ? "software-node-in" : ""
              }`}
              style={step >= 1 ? { animationDelay: `${index * 0.08}s` } : undefined}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef3fb] text-[11px] font-semibold text-brand lg:h-7 lg:w-7 lg:text-[12px]">
                {person.initial}
              </span>
              <span className="text-[13px] font-semibold leading-none text-ink lg:text-[15px]">
                {person.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={step >= 2 ? "software-node-in" : "opacity-25"}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 lg:text-[12px]">
          Business moves
        </p>
        <div className="grid grid-cols-3 gap-1.5 lg:mt-1.5 lg:gap-2">
          {FLOW_MOVES.map((item, index) => (
            <div
              key={item.slug}
              className={`rounded-xl bg-white px-2 py-1 ring-1 ring-black/[0.04] lg:px-3 lg:py-2.5 ${
                step >= 2 ? "software-node-in" : ""
              }`}
              style={step >= 2 ? { animationDelay: `${index * 0.08}s` } : undefined}
            >
              <div className="flex items-center gap-2">
                <SoftLogo slug={item.slug} name={item.name} />
                <p className="text-[11px] text-slate-500 lg:text-[12px]">{item.meta}</p>
              </div>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-ink lg:mt-1.5 lg:text-[15px]">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 lg:gap-2">
        <div className={step >= 3 ? "software-flow-up" : "opacity-25"}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 lg:text-[12px]">
            Customer responds
          </p>
          <div className={`${TILE} rounded-2xl rounded-bl-md px-3 py-1.5 lg:mt-1.5 lg:px-3.5 lg:py-2.5`}>
            <p className="text-[14px] font-medium tracking-tight text-ink lg:text-[16px]">
              &ldquo;2:15 works.&rdquo;
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 lg:text-[12px]">The customer</p>
          </div>
        </div>

        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          className={`shrink-0 ${step >= 3 ? "software-flow-up" : "opacity-25"}`}
          aria-hidden
        >
          <path
            d="M1 7 H15 M11 3 L16 7 L11 11"
            fill="none"
            stroke={step >= 3 ? "#2a66ff" : "#cbd5e1"}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className={`${TILE} px-3 py-1.5 lg:px-3.5 lg:py-2.5 ${step >= 4 ? "software-node-in" : "opacity-25"}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 lg:text-[12px]">
            Next action
          </p>
          <p className="text-[13px] font-semibold leading-snug text-ink lg:mt-1 lg:text-[15px]">
            Contract · Calendar · Prep
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 lg:text-[13px]">Sales sees it</p>
        </div>
      </div>
    </Wash>
  )
}

const AUDIENCE_STAGES = ["Notice you", "On the site", "The city", "Ready"] as const

const AUDIENCE_USERS = [
  {
    name: "Maya Chen",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&h=160&q=80",
    facts: [
      "Clicked a Meta ad",
      "Browsed products",
      "Austin, TX",
      "Shop owner. Ready to buy.",
    ],
  },
  {
    name: "Eli Ward",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80",
    facts: [
      "Opened the Instagram",
      "Stayed on the site",
      "Toronto, ON",
      "Gym owner. Ready to buy.",
    ],
  },
] as const

function AudienceFace({ src, name, size = 32 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  if (failed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-[#eef3fb] text-[11px] font-semibold text-brand ring-2 ring-white"
        style={{ width: size, height: size }}
      >
        {initials}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover object-top ring-2 ring-white"
      style={{ width: size, height: size }}
    />
  )
}

const AUDIENCE_RESULTS = [
  { title: "Reach", before: 36, after: 92, color: "#2a66ff", slug: "meta", logoName: "Meta" },
  { title: "Leads", before: 24, after: 90, color: "#c68809", slug: "google", logoName: "Google" },
  { title: "Deals", before: 18, after: 86, color: "#0f9d8a", slug: "hubspot", logoName: "HubSpot" },
  { title: "Buys", before: 12, after: 80, color: "#6d4aff", slug: null, logoName: "Sales" },
] as const

export function AudienceIntelVisual() {
  const reduce = usePrefersReducedMotion()
  const [walk] = useCycle(6, 1800, reduce)
  const col = reduce ? 3 : Math.min(walk, 3)
  const wrapping = !reduce && walk === 0
  const bought = reduce || walk >= 3

  return (
    <Wash className="flex h-full flex-col justify-between gap-2 p-2.5 lg:gap-3 lg:p-4">
      <p className="sr-only">
        We watch Maya and Eli from the first ad or Instagram tap, through the site, to the city.
        When they are ready to buy, reach, leads, deals, and buys go up.
      </p>

      <div className={`${TILE} px-2.5 py-2 lg:px-3 lg:py-3`}>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 text-[13px] font-semibold tracking-tight text-ink lg:text-[15px]">
            From first look to a buy.
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              bought ? "bg-[#eef3fb] text-brand" : "bg-[#f3f5f8] text-slate-400"
            }`}
          >
            {bought ? "Ready" : "Watching"}
          </span>
        </div>

        <div className="relative mt-2.5 h-8 lg:mt-4 lg:h-10">
          <div
            className={`absolute top-0 flex -translate-x-1/2 gap-1.5 ${
              wrapping ? "" : "transition-[left] duration-700 ease-in-out"
            }`}
            style={{ left: `${col * 25 + 12.5}%` }}
          >
            {AUDIENCE_USERS.map((person) => (
              <AudienceFace key={person.name} src={person.photo} name={person.name} size={32} />
            ))}
          </div>
        </div>

        <div className="relative mt-1">
          <div className="absolute left-[12.5%] right-[12.5%] top-[5px] h-px bg-slate-200" aria-hidden />
          <div className="grid grid-cols-4">
            {AUDIENCE_STAGES.map((label, index) => (
              <div key={label} className="flex min-w-0 flex-col items-center px-0.5">
                <span
                  className={`relative z-[1] h-2.5 w-2.5 rounded-full ${
                    index === col ? "bg-brand" : index < col ? "bg-brand/45" : "bg-slate-200"
                  }`}
                />
                <p
                  className={`mt-1 truncate text-center text-[11px] font-semibold lg:mt-1.5 lg:text-[12px] ${
                    index === col ? "text-ink" : "text-slate-400"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div key={col} className="mt-2 grid grid-cols-2 gap-1.5 lg:mt-3 lg:gap-2">
          {AUDIENCE_USERS.map((person) => (
            <div key={person.name} className="rounded-xl bg-[#eef3fb] px-2 py-1.5 lg:px-3 lg:py-2">
              <p className="text-[11px] font-semibold text-ink lg:text-[12px]">{person.name}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink/80 lg:text-[13px]">{person.facts[col]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${TILE} px-2.5 py-2 lg:px-3 lg:py-2.5 ${bought ? "ring-2 ring-brand/25" : "opacity-40"}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold tracking-tight text-ink lg:text-[14px]">
            Then more people buy.
          </p>
          <div className="hidden items-center gap-2 text-[10px] font-medium text-slate-400 sm:flex">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-sm bg-slate-300" />
              Before
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-sm bg-brand" />
              After we know them
            </span>
          </div>
        </div>
        <div className="mt-1.5 grid grid-cols-4 gap-2 lg:mt-2">
          {AUDIENCE_RESULTS.map((item, index) => (
            <div key={item.title} className="text-center">
              <div className="flex h-10 items-end justify-center gap-1 lg:h-16">
                <span
                  className={`w-2 rounded-sm bg-slate-300 lg:w-2.5 ${bought ? "software-bar-grow" : ""}`}
                  style={{
                    height: `${item.before}%`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
                <span
                  className={`w-2 rounded-sm lg:w-2.5 ${bought ? "software-bar-grow" : ""}`}
                  style={{
                    height: `${item.after}%`,
                    backgroundColor: item.color,
                    animationDelay: `${index * 0.1 + 0.08}s`,
                  }}
                />
                {item.slug ? (
                  <span className="mb-0.5">
                    <SoftLogo slug={item.slug} name={item.logoName} />
                  </span>
                ) : (
                  <span className="software-icon-tile mb-0.5 flex h-5 w-5 items-center justify-center">
                    <LineIcon size={11}>
                      <circle cx="9" cy="8" r="2.2" />
                      <circle cx="15" cy="8" r="2.2" />
                      <path d="M4.8 17c.8-2 2.2-3 4.2-3s3.4 1 4.2 3" />
                      <path d="M10.8 17c.8-2 2.2-3 4.2-3s3.4 1 4.2 3" />
                    </LineIcon>
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-[11px] font-semibold text-ink">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </Wash>
  )
}

const ROADMAP_ROWS = [
  { name: "Move WordPress to Shopify", start: 0, span: 5, state: "done" as const, color: "#2a66ff" },
  { name: "Read past customer data", start: 1, span: 5, state: "now" as const, color: "#c68809" },
  { name: "Email + SMS for old leads", start: 3, span: 5, state: "next" as const, color: "#0f9d8a" },
  { name: "Fix the path to buy", start: 4, span: 5, state: "next" as const, color: "#e05a3c" },
  { name: "Turn advertising back on", start: 6, span: 6, state: "next" as const, color: "#6d4aff" },
  { name: "Launch content", start: 7, span: 5, state: "next" as const, color: "#14804a" },
]

export function RoadmapVisual() {
  return (
    <Wash className="flex h-full flex-col justify-between p-3 lg:p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">90-day roadmap</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">Week 4. Data is open.</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
          Next: old leads
        </span>
      </div>
      <div className="grid grid-cols-4 text-center text-[10px] text-slate-400">
        <span>Wk 1</span>
        <span>Wk 4</span>
        <span>Wk 8</span>
        <span>Wk 12</span>
      </div>
      <div className="space-y-1.5">
        {ROADMAP_ROWS.map((row, index) => (
          <div key={row.name} className={`${TILE} px-3 py-1.5`}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-[12px] font-medium text-ink">{row.name}</p>
              <p className="shrink-0 text-[10px] font-medium text-slate-400">
                {row.state === "done" ? "Done" : row.state === "now" ? "Now" : "Next"}
              </p>
            </div>
            <div className="relative h-2 rounded-full bg-[#f3f5f8]">
              <div
                className="software-gantt-fill absolute top-0 h-2 rounded-full"
                style={{
                  left: `${(row.start / 12) * 100}%`,
                  width: `${(row.span / 12) * 100}%`,
                  backgroundColor: row.color,
                  animationDelay: `${index * 140}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Wash>
  )
}

export function CheckoutFlowVisual() {
  return <LeakFlowVisual />
}

const BOOK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const
const BOOK_TIMES = ["8:00", "9:30", "11:00", "2:00"] as const
const BOOK_HOLDS = [
  { day: 0, time: 0, name: "Priya", at: 1 },
  { day: 1, time: 1, name: "Maya", at: 2 },
  { day: 2, time: 0, name: "Eli", at: 2 },
  { day: 3, time: 2, name: "Chris", at: 3 },
  { day: 4, time: 1, name: "Lena", at: 3 },
  { day: 0, time: 3, name: "Jonah", at: 4 },
  { day: 2, time: 2, name: "Amina", at: 4 },
  { day: 4, time: 3, name: "Diego", at: 5 },
] as const

export function BookingTilesVisual() {
  const reduce = usePrefersReducedMotion()
  const [beat] = useCycle(6, 1200, reduce)
  const step = reduce ? 5 : beat
  const filled = BOOK_HOLDS.filter((hold) => hold.at <= step)

  return (
    <Wash className="flex h-full flex-col justify-between p-3 lg:p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Appointment book</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">The week fills from the ads that work.</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm">
          {filled.length} booked
        </span>
      </div>
      <div className={`${TILE} overflow-hidden p-2.5`}>
        <div className="grid grid-cols-[2.4rem_repeat(5,minmax(0,1fr))] gap-1">
          <span />
          {BOOK_DAYS.map((day) => (
            <p key={day} className="text-center text-[10px] font-semibold text-slate-400">
              {day}
            </p>
          ))}
          {BOOK_TIMES.map((time, timeIndex) => (
            <div key={time} className="contents">
              <p className="self-center text-[10px] font-medium text-slate-400">{time}</p>
              {BOOK_DAYS.map((day, dayIndex) => {
                const hold = BOOK_HOLDS.find((item) => item.day === dayIndex && item.time === timeIndex)
                const on = Boolean(hold && hold.at <= step)
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`flex h-8 items-center justify-center rounded-lg text-[10px] font-semibold ${
                      on
                        ? "bg-brand text-white software-node-in"
                        : "bg-[#f3f5f8] text-transparent"
                    }`}
                  >
                    {on ? hold?.name : "·"}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={`${TILE} px-3 py-2 ${step >= 2 ? "software-node-in" : "opacity-40"}`}>
          <p className="text-[10px] font-medium text-slate-400">Pack ads</p>
          <p className="text-[15px] font-semibold text-ink">{step >= 2 ? "3 live" : "0 live"}</p>
        </div>
        <div className={`${TILE} px-3 py-2 ${step >= 3 ? "software-node-in" : "opacity-40"}`}>
          <p className="text-[10px] font-medium text-slate-400">Old videos</p>
          <p className="text-[15px] font-semibold text-ink">{step >= 3 ? "Paused" : "Still on"}</p>
        </div>
      </div>
    </Wash>
  )
}

const PHONE_CHAT = [
  { from: "Maya", text: "Need someone this week. Kitchen leak.", side: "in" },
  { from: "Assistant", text: "Got it. 1–2 sinks, and is water still running?", side: "ai" },
  { from: "Maya", text: "One sink. Water is off. Tuesday works.", side: "in" },
  { from: "Assistant", text: "Qualified. Tuesday 8am is held.", side: "ai" },
] as const

export function PhoneFlowVisual() {
  const reduce = usePrefersReducedMotion()
  const [beat] = useCycle(6, 1300, reduce)
  const step = reduce ? 5 : beat
  const status = step >= 5 ? "Booked" : step >= 2 ? "Qualifying" : step >= 1 ? "Missed" : "Incoming"

  return (
    <Wash className="flex h-full flex-col justify-between p-3 lg:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">AI intake</p>
          <p className="text-[14px] font-semibold text-ink">Missed call. Still a lead.</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            status === "Booked"
              ? "bg-brand text-white"
              : status === "Qualifying"
                ? "bg-[#fff1d6] text-gold-to"
                : "bg-white text-slate-500"
          }`}
        >
          {status}
        </span>
      </div>

      <div className={`${TILE} flex items-center gap-3 px-3 py-2.5 ${step >= 0 ? "software-node-in" : ""}`}>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            step === 0 ? "bg-brand text-white software-pulse-dot" : "bg-[#f3f5f8] text-ink"
          }`}
        >
          <LineIcon size={18}>
            <path d="M6.5 3.5 9 6l-1.6 1.6a12 12 0 0 0 8.9 8.9L18 15l2.5 2.5-1.2 1.2A16 16 0 0 1 5.3 4.7Z" />
          </LineIcon>
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink">Maya Chen</p>
          <p className="text-[12px] text-slate-500">
            {step === 0 ? "Incoming · 5:12 pm" : "Missed · 5:12 pm"}
          </p>
        </div>
        <span className="ml-auto text-[11px] font-medium text-slate-400">
          {step >= 2 ? "Site chat" : "Phone"}
        </span>
      </div>

      <div className="space-y-1.5">
        {PHONE_CHAT.map((item, index) => {
          const on = index < step - 1
          return (
            <div
              key={item.text}
              className={`${on ? "software-node-in" : "opacity-15"} ${item.side === "ai" ? "ml-8" : "mr-8"}`}
            >
              <div className={`${TILE} px-3 py-2`}>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{item.from}</p>
                <p className="mt-0.5 text-[12px] font-medium leading-snug text-ink">{item.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Wash>
  )
}

const CALENDAR_POSTS = [
  { day: "Mon 14", vertical: "Apparel", title: "Drop teaser", channel: "Instagram", tone: "bg-[#1d1d1f]" },
  { day: "Tue 15", vertical: "Fitness", title: "Class pack", channel: "Meta", tone: "bg-[#2a66ff]" },
  { day: "Wed 16", vertical: "Clinic", title: "New-patient hold", channel: "Email", tone: "bg-[#c68809]" },
  { day: "Thu 17", vertical: "Home", title: "Before / after", channel: "YouTube", tone: "bg-[#e05a3c]" },
  { day: "Fri 18", vertical: "Apparel", title: "Live look", channel: "TikTok", tone: "bg-[#0f9d8a]" },
] as const

export function DropFilesVisual() {
  const reduce = usePrefersReducedMotion()
  const [beat] = useCycle(CALENDAR_POSTS.length + 1, 1500, reduce)
  const step = reduce ? CALENDAR_POSTS.length : beat

  return (
    <Wash className="flex h-full flex-col justify-between p-3 lg:p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Content calendar</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">Posts go live on a date. Same files everywhere.</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm">
          {(() => {
            const n = Math.min(step, CALENDAR_POSTS.length)
            return `${n} ${n === 1 ? "post" : "posts"}`
          })()}
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {CALENDAR_POSTS.map((post, index) => {
          const on = index < step
          const live = index === step - 1
          return (
            <div
              key={`${post.day}-${post.title}`}
              className={`${TILE} flex items-center gap-3 px-3 py-2.5 ${
                on ? "software-node-in" : "opacity-20"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${post.tone}`}>
                <span className="text-[10px] font-semibold leading-none">{post.day.split(" ")[0]}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{post.title}</p>
                <p className="text-[11px] text-slate-500">
                  {post.vertical} · {post.channel}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  live ? "bg-brand text-white" : on ? "bg-[#eef3fb] text-brand" : "text-slate-300"
                }`}
              >
                {live ? "Live" : on ? post.day : "Queued"}
              </span>
            </div>
          )
        })}
      </div>
    </Wash>
  )
}

const CONSULT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const
const CONSULTS = [
  { day: 1, name: "Northshore", time: "9:00", state: "Booked", at: 1 },
  { day: 2, name: "Harbor Law", time: "11:30", state: "Qualified", at: 2 },
  { day: 3, name: "Elm Clinic", time: "2:15", state: "Hold", at: 3 },
] as const

export function ConsultCalendarVisual() {
  const reduce = usePrefersReducedMotion()
  const [beat] = useCycle(CONSULTS.length + 1, 1400, reduce)
  const step = reduce ? CONSULTS.length : beat

  return (
    <Wash className="flex h-full flex-col justify-between p-3 lg:p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Partner calendar</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">Every hold has a next step.</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm">
          {Math.min(step, CONSULTS.length)} consults
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-1.5">
        {CONSULT_DAYS.map((day, dayIndex) => {
          const hold = CONSULTS.find((item) => item.day === dayIndex)
          const on = Boolean(hold && hold.at <= step)
          return (
            <div key={day} className={`${TILE} flex min-h-0 flex-col px-1.5 py-2`}>
              <p className="text-center text-[10px] font-semibold text-slate-400">{day}</p>
              <div className="mt-2 min-h-0 flex-1 rounded-xl bg-[#f3f5f8] p-1.5">
                {on && hold ? (
                  <div
                    className={`software-node-in rounded-lg px-1.5 py-2 text-center ${
                      hold.state === "Booked"
                        ? "bg-brand text-white"
                        : hold.state === "Qualified"
                          ? "bg-[#fff1d6] text-gold-to"
                          : "bg-white text-slate-600 ring-1 ring-black/5"
                    }`}
                  >
                    <p className="text-[10px] font-semibold">{hold.time}</p>
                    <p className="mt-1 text-[10px] font-medium leading-tight">{hold.name}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-wide opacity-80">{hold.state}</p>
                  </div>
                ) : (
                  <p className="pt-6 text-center text-[10px] text-slate-300">Open</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Wash>
  )
}

const REFILL_NOTES = [
  { title: "Welcome", day: "Day 1", subject: "Your order is in" },
  { title: "Refill", day: "Day 28", subject: "Time to refill" },
  { title: "Restock", day: "Early", subject: "You get it first" },
] as const

export function RefillSequenceVisual() {
  const reduce = usePrefersReducedMotion()
  const [beat] = useCycle(REFILL_NOTES.length + 1, 1400, reduce)
  const step = reduce ? REFILL_NOTES.length : beat

  return (
    <Wash className="flex h-full flex-col justify-center p-4">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">Email sequence</p>
      {/* Phones: the three notes stack as rows. From md up they sit side by side with arrows. */}
      <div className="flex w-full flex-col items-stretch gap-2 md:flex-row">
        {REFILL_NOTES.map((note, index) => (
          <div key={note.title} className="flex flex-1 items-center">
            <div
              className={`${TILE} flex w-full items-center gap-3 px-3 py-3 text-left md:block md:py-4 md:text-center ${
                index < step ? "software-node-in" : "opacity-25"
              }`}
            >
              <div
                className="software-icon-tile flex h-10 w-10 shrink-0 items-center justify-center md:mx-auto md:mb-3"
                style={{ animationDelay: `${index * 0.22}s` }}
              >
                <LineIcon size={18}>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </LineIcon>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink">
                  {note.title}
                  <span className="font-normal text-slate-400 md:hidden"> · {note.day}</span>
                </p>
                <p className="hidden text-[11px] text-slate-400 md:block">{note.day}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 md:mt-1 md:text-[10px]">
                  {note.subject}
                </p>
              </div>
            </div>
            {index < REFILL_NOTES.length - 1 && <span className="hidden px-1 text-slate-300 md:inline">→</span>}
          </div>
        ))}
      </div>
    </Wash>
  )
}

const FIND_PLACES = [
  { key: "shopify", slug: "shopify", name: "Shopify", role: "Your store", state: "Live" },
  { key: "amazon", slug: "amazon", name: "Amazon", role: "Second store", state: "Live" },
  { key: "etsy", slug: "etsy", name: "Etsy", role: "Third store", state: "Live" },
  { key: "maps", slug: "google", name: "Google Maps", role: "Local", state: "Live" },
  { key: "seo", slug: "google", name: "Your SEO", role: "Search", state: "Page 1" },
  { key: "yelp", slug: "yelp", name: "Yelp", role: "Aggregator", state: "Claimed" },
] as const

export function DiscoverabilityVisual() {
  const reduce = usePrefersReducedMotion()
  const [lit] = useCycle(FIND_PLACES.length + 1, 1400, reduce)
  const shown = reduce ? FIND_PLACES.length : lit

  return (
    <Wash className="flex h-full flex-col justify-center p-3 lg:p-4">
      <p className="sr-only">
        The shop or the service is live in more than one place. Shopify, Amazon, and Etsy for stores.
        Google Maps, search, and Yelp for people looking nearby.
      </p>
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          The store, Maps, search, and the listing they already trust
        </p>
        <p className="mt-0.5 text-[14px] font-semibold text-ink">More than one door is open.</p>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-1.5 min-[360px]:grid-cols-2">
        {FIND_PLACES.map((place, index) => {
          const on = index < shown
          return (
            <div
              key={place.key}
              className={`${TILE} flex items-center gap-2 px-2.5 py-2 ${
                on ? "software-node-in" : "opacity-30"
              }`}
            >
              <SoftLogo slug={place.slug} name={place.name} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold leading-tight text-ink">{place.name}</p>
                <p className="text-[11px] text-slate-500">{place.role}</p>
              </div>
              <span
                className={`ml-auto shrink-0 text-[10px] font-semibold ${
                  on ? "text-brand" : "text-slate-400"
                }`}
              >
                {place.state}
              </span>
            </div>
          )
        })}
      </div>
    </Wash>
  )
}
