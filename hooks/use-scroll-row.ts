"use client"

import { useEffect, type RefObject } from "react"

// Keeps the active pill of a horizontally scrolling row in view. Uses scrollTo on the row itself
// instead of scrollIntoView, so the page never jumps vertically when a pill is tapped.
export function useScrollRow(rowRef: RefObject<HTMLElement | null>, activeIndex: number) {
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const child = row.children[activeIndex] as HTMLElement | undefined
    if (!child) return
    if (row.scrollWidth <= row.clientWidth) return
    const rowBox = row.getBoundingClientRect()
    const childBox = child.getBoundingClientRect()
    const left = childBox.left - rowBox.left + row.scrollLeft - (rowBox.width - childBox.width) / 2
    row.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }, [rowRef, activeIndex])
}
