/**
 * TerraAI's draft reply to an owner's text (2026-10-16). One Claude call with the voice guide (lib/sms/terraai/voice.ts)
 * as a cached system prompt and the owner's context in the user turn; structured output gives the reply, intent and
 * hand-off flag. Claude Opus 5.5 at low effort (texting is chat), with Anthropic's server-side fallback on a policy
 * decline. Never throws: any failure becomes a hand-off draft for Adam.
 */

import Anthropic from "@anthropic-ai/sdk"
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod"
import * as z from "zod/v4"
import { DISCLOSURE, TERRAAI_SYSTEM } from "@/lib/sms/terraai/voice"
import { renderContext, type TextContext } from "@/lib/sms/terraai/context"

export const TERRAAI_MODEL = "claude-opus-5-5"

export const INTENTS = [
  "question_report", "free_check", "booking", "reschedule", "pricing", "workspace", "who_are_you",
  "wants_human", "complaint", "opt_out", "small_talk", "spam", "other",
] as const

const DraftSchema = z.object({
  reply: z.string(),
  intent: z.enum(INTENTS),
  handoff: z.boolean(),
  handoff_reason: z.string(),
  notes_for_adam: z.string(),
})

export type TerraaiDraft = { reply: string; intent: (typeof INTENTS)[number]; handoff: boolean; handoffReason: string; notes: string; error?: string }

/** Cleans a draft for a text message and makes sure a first text carries the disclosure. Pure. */
export function finishDraft(raw: { reply: string; intent: TerraaiDraft["intent"]; handoff: boolean; handoff_reason: string; notes_for_adam: string }, firstText: boolean): TerraaiDraft {
  let reply = raw.reply
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  if (firstText && !/TerraAI/.test(reply)) reply = `${DISCLOSURE} ${reply}`
  return { reply: reply.slice(0, 1000), intent: raw.intent, handoff: raw.handoff, handoffReason: raw.handoff_reason.trim(), notes: raw.notes_for_adam.trim() }
}

function handoffDraft(firstText: boolean, error: string): TerraaiDraft {
  const reply = `${firstText ? `${DISCLOSURE} ` : ""}Thanks for the text. Someone from our Customer Success team will text you shortly.`
  return { reply, intent: "other", handoff: true, handoffReason: "TerraAI couldn't draft a reply", notes: "", error }
}

export type DraftDeps = { client?: Pick<Anthropic, "beta"> }

export async function draftReply(ctx: TextContext, latest: string, deps: DraftDeps = {}): Promise<TerraaiDraft> {
  try {
    const client = deps.client ?? new Anthropic()
    const response = await client.beta.messages.parse({
      model: TERRAAI_MODEL,
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: TERRAAI_SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "low", format: betaZodOutputFormat(DraftSchema) },
      messages: [{ role: "user", content: renderContext(ctx, latest) }],
    })
    if (response.stop_reason === "refusal") return handoffDraft(ctx.firstText, "declined")
    const parsed = response.parsed_output
    if (!parsed) return handoffDraft(ctx.firstText, "no parsed output")
    return finishDraft(parsed, ctx.firstText)
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return handoffDraft(ctx.firstText, "rate limited")
    if (error instanceof Anthropic.APIError) return handoffDraft(ctx.firstText, `api ${error.status}`)
    return handoffDraft(ctx.firstText, error instanceof Error ? error.message : String(error))
  }
}
