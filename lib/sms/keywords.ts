/**
 * Carrier-standard text keywords (CTIA): a message that is only one of these words, ignoring case, spaces and
 * punctuation, is an opt-out, an opt-back-in or a help request. Anything longer ("stop by tomorrow?") is a normal reply.
 * Pure, for scripts/verify-sms-replies.mjs.
 */

export type SmsKeyword = "stop" | "start" | "help" | "human" | null

const STOP = new Set(["stop", "stopall", "unsubscribe", "cancel", "end", "quit", "optout", "revoke"])
const START = new Set(["start", "unstop", "optin"])
const HELP = new Set(["help", "info"])
/** Asking for a real person (TerraAI's first text says "Text ADAM anytime"). */
const HUMAN = new Set(["adam", "team", "human", "person", "realperson", "agent", "representative", "rep", "customersuccess", "talktoaperson", "talktosomeone", "talktoadam"])

export function smsKeyword(content: string | null | undefined): SmsKeyword {
  const word = String(content ?? "").toLowerCase().replace(/[^a-z]/g, "")
  if (!word || word.length > 18) return null
  if (STOP.has(word)) return "stop"
  if (START.has(word)) return "start"
  if (HELP.has(word)) return "help"
  if (HUMAN.has(word)) return "human"
  return null
}

export const SMS_REPLIES = {
  stop: "Terramore: you're unsubscribed and won't get more texts from us. Reply START to opt back in.",
  start: "Terramore: you're opted back in to texts about your report and calls. Reply STOP to opt out.",
  /** Asking for a person: one quick question so Customer Success comes prepared; TerraAI's draft takes it from there. */
  human: "Hi, this is TerraAI, Terramore's AI assistant. Happy to connect you with our Customer Success team. So they come prepared, what kind of business do you run, and where?",
  help: "Terramore: texts about your Digital Footprint report and calls with our Customer Success team. Email hello@terramore.io or call (818) 699-9217. Reply STOP to opt out.",
} as const
