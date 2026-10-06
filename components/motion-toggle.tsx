"use client"

import { Pause, Play, RotateCcw } from "lucide-react"

/**
 * Visible, keyboard-reachable control for autoplaying motion (VR-47): Pause while it plays, Play when paused, and
 * Replay once a play-once demo has finished (`ended`).
 */
export function MotionToggle({
  paused,
  onToggle,
  label,
  tone = "light",
  className = "",
  ended = false,
}: {
  paused: boolean
  onToggle: () => void
  /** What moves, e.g. "industry list". Read after "Pause" / "Play" / "Replay". */
  label: string
  tone?: "light" | "dark"
  className?: string
  /** The demo played to its end and is holding its last frame. */
  ended?: boolean
}) {
  const verb = ended ? "Replay" : paused ? "Play" : "Pause"
  const Icon = ended ? RotateCcw : paused ? Play : Pause
  const colors =
    tone === "dark"
      ? "border-white/30 bg-ink/70 text-cream hover:bg-ink focus-visible:ring-gold-from"
      : "border-ink/20 bg-white text-ink hover:bg-cream focus-visible:ring-brand"

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${verb} ${label}`}
      className={`inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${colors} ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {verb}
    </button>
  )
}
