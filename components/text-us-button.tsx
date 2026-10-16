"use client"

/**
 * "Tap to text us" (2026-10-16). Opens the owner's Messages app with our number and a short message filled in; the
 * owner sends it, which lets our inbound-first Sendblue line text them back (the reply comes within seconds).
 * Phones and Macs get the button; Windows and Linux get a QR code to scan with their phone; in-app browsers (Instagram,
 * Facebook, TikTok…) get a note to open the page in Safari or Chrome, since they often block Messages. If Messages
 * doesn't open within 1.5 s, the number and message are copied to the clipboard. Pattern: Sendblue's iMessage link
 * button guide. Never sends anything itself.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import { trackFunnelEvent } from "@/lib/analytics"
import { inAppBrowser, qrPayload, smsHref, TEXT_NUMBER_DISPLAY, textPlatform, type TextPlatform } from "@/lib/sms/text-link"

type Placement = "report_success" | "booking_success" | "footer" | "text_page"

export function TextUsButton({
  body,
  placement,
  label = "Tap to text us",
  intro,
  variant = "full",
  className,
}: {
  /** The pre-filled message (lib/sms/text-link.ts textBody). */
  body: string
  placement: Placement
  label?: string
  /** One line above the button, e.g. "Want updates by text?" */
  intro?: string
  /** "compact": a quiet text link for the footer. */
  variant?: "full" | "compact"
  /** Link styling for the compact variant. */
  className?: string
}) {
  const [platform, setPlatform] = useState<TextPlatform | null>(null)
  const [inApp, setInApp] = useState(false)
  const [qr, setQr] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    const p = textPlatform(ua)
    setPlatform(p)
    setInApp(inAppBrowser(ua))
    if (p === "desktop" || p === "mac") {
      QRCode.toString(qrPayload(body), { type: "svg", margin: 1, width: 168, errorCorrectionLevel: "M" })
        .then(setQr)
        .catch(() => setQr(null))
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [body])

  async function copyFallback(message: string) {
    try {
      await navigator.clipboard.writeText(`${TEXT_NUMBER_DISPLAY}\n${body}`)
      setNote(message)
    } catch {
      setNote(`Text us at ${TEXT_NUMBER_DISPLAY}.`)
    }
  }

  function open(event: React.MouseEvent<HTMLAnchorElement>) {
    trackFunnelEvent("text_us_click", { placement })
    if (!platform || platform === "desktop") return
    if (inApp) {
      event.preventDefault()
      void copyFallback("This app may block texting. We copied our number and message. Open this page in Safari or Chrome, or paste it into Messages.")
      return
    }
    // If the page is still showing after 1.5 s, Messages didn't open: copy the number and message instead.
    let left = false
    const leave = () => {
      left = true
    }
    window.addEventListener("pagehide", leave, { once: true })
    document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && leave(), { once: true })
    timer.current = window.setTimeout(() => {
      window.removeEventListener("pagehide", leave)
      if (!left && document.visibilityState === "visible") void copyFallback("Messages didn't open. We copied our number and message so you can paste them.")
    }, 1500)
  }

  const href = platform && platform !== "desktop" ? smsHref(body, platform) : undefined
  const consent = (
    <p className="text-[12px] leading-relaxed text-ink/60">
      By texting us you agree to texts from Terramore about your report and calls. Msg &amp; data rates may apply. Reply STOP to
      opt out.{" "}
      <Link href="/terms#text-messages" className="underline underline-offset-2 hover:text-ink">
        Text terms
      </Link>
    </p>
  )

  if (variant === "compact") {
    // Phones and Macs open Messages directly; anything else goes to /text, which shows a QR code.
    return href ? (
      <a href={href} onClick={open} className={className}>
        Text {TEXT_NUMBER_DISPLAY}
      </a>
    ) : (
      <Link href="/text" onClick={() => trackFunnelEvent("text_us_click", { placement })} className={className}>
        Text {TEXT_NUMBER_DISPLAY}
      </Link>
    )
  }

  return (
    <div className="grid gap-3 text-left">
      {intro ? <p className="text-[15px] font-medium text-ink">{intro}</p> : null}
      {href ? (
        <a
          href={href}
          onClick={open}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-white hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {label}
        </a>
      ) : null}
      {qr && platform !== "ios" && platform !== "android" ? (
        <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-3">
          <span className="block h-[120px] w-[120px] shrink-0 [&>svg]:h-full [&>svg]:w-full" aria-hidden="true" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="text-[14px] leading-relaxed text-ink/75">
            {platform === "mac" ? "Or scan with your phone's camera" : "Scan with your phone's camera"} to text us. The message is filled in; just tap Send.
            <span className="mt-1 block text-ink/60">Or text {TEXT_NUMBER_DISPLAY}.</span>
          </p>
        </div>
      ) : null}
      {inApp && href ? <p className="text-[13px] text-ink/70">Opened from Instagram or Facebook? Texting works best in Safari or Chrome.</p> : null}
      {note ? (
        <p className="text-[13px] text-ink/80" role="status">
          {note}
        </p>
      ) : null}
      {consent}
    </div>
  )
}
