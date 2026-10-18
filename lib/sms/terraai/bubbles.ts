/**
 * TerraAI texts like a person (Adam, 2026-10-17): a reply goes out as 1 to 3 short texts, with the typing bubble
 * showing before each one. TerraAI separates texts with a blank line; this splits them and paces them. Pure.
 */

export const MAX_BUBBLES = 3

/** "Hi.\n\nSaw your report.\n\nWant a summary?" → three texts. More than three are folded into the last. */
export function splitBubbles(reply: string): string[] {
  const parts = reply
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
  if (parts.length <= MAX_BUBBLES) return parts
  return [...parts.slice(0, MAX_BUBBLES - 1), parts.slice(MAX_BUBBLES - 1).join(" ")]
}

/** How long the typing bubble shows before a text: about a person's typing speed, between 1.2 and 4.5 seconds. */
export function typingDelayMs(text: string): number {
  return Math.min(4500, Math.max(1200, 700 + text.length * 35))
}
