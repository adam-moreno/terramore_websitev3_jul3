"use client"

import { Pause, Play } from "lucide-react"

/** Visible, keyboard-reachable pause control for autoplaying motion (VR-47). */
export function MotionToggle({
  paused,
  onToggle,
  label,
  tone = "light",
  className = "",
}: {
  paused: boolean
  onToggle: () => void
  /** What moves, e.g. "industry list". Read after "Pause" / "Play". */
  label: string
  tone?: "light" | "dark"
  className?: string
}) {
  const Icon = paused ? Play : Pause
  const colors =
    tone === "dark"
      ? "border-white/30 bg-ink/70 text-cream hover:bg-ink focus-visible:ring-gold-from"
      : "border-ink/20 bg-white text-ink hover:bg-cream focus-visible:ring-brand"

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${paused ? "Play" : "Pause"} ${label}`}
      className={`inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${colors} ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {paused ? "Play" : "Pause"}
    </button>
  )
}
