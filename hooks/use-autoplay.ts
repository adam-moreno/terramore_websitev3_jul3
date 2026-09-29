"use client"

import { useEffect, useState, type RefObject } from "react"

export function usePrefersReducedMotion() {
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

/** True while the element is on screen and the tab is visible (VR-48). */
export function useOnScreenAndVisible(ref: RefObject<Element | null>, threshold = 0.15) {
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry?.isIntersecting ?? false), { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])

  useEffect(() => {
    const sync = () => setTabVisible(document.visibilityState === "visible")
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [])

  return onScreen && tabVisible
}
