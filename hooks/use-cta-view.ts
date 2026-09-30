"use client"

import { useEffect, useRef } from "react"
import { trackCtaView } from "@/lib/analytics"
import { CTA_IDS, CTA_VIEW_MIN_MS, CTA_VIEW_THRESHOLD, type CtaId } from "@/lib/funnel-taxonomy"

/**
 * primary_cta_view for an approved CTA: at least CTA_VIEW_THRESHOLD of it on screen for CTA_VIEW_MIN_MS in a visible
 * tab, once per page view. Hidden (display:none) and below-the-fold CTAs never count until actually seen.
 * Returns a ref for the CTA element; a no-op when ctaId is missing or not impression-tracked.
 */
export function useCtaView<T extends Element>(ctaId: CtaId | undefined) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!ctaId || !element || !CTA_IDS[ctaId]?.view || typeof IntersectionObserver === "undefined") return

    let inView = false
    let timer: number | undefined
    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
    }
    const start = () => {
      if (timer !== undefined || !inView || document.visibilityState !== "visible") return
      timer = window.setTimeout(() => {
        timer = undefined
        trackCtaView(ctaId)
        observer.disconnect()
      }, CTA_VIEW_MIN_MS)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        inView = entry.isIntersecting && entry.intersectionRatio >= CTA_VIEW_THRESHOLD
        if (inView) start()
        else stop()
      },
      { threshold: [0, CTA_VIEW_THRESHOLD] },
    )
    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop())

    observer.observe(element)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [ctaId])

  return ref
}
