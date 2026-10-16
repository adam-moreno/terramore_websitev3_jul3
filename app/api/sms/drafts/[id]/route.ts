/**
 * POST /api/sms/drafts/{id} { t, action: "send" | "discard", text? } — Adam's decision on a TerraAI draft.
 * Auth: the signed review link token (lib/sms/terraai/store.ts). The draft is claimed before sending, so a double
 * click sends once. "send" with changed text is recorded as "edited" (those edits become TerraAI's examples).
 */

import { NextRequest, NextResponse } from "next/server"
import { sendSms } from "@/lib/notify"
import { decideDraft, getDraft, verifyDraftToken } from "@/lib/sms/terraai/store"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = (await request.json().catch(() => null)) as { t?: string; action?: string; text?: string } | null
  if (!verifyDraftToken(id, body?.t)) return NextResponse.json({ error: "This link has expired. Reply from the Sendblue inbox instead." }, { status: 401 })
  const draft = await getDraft(id)
  if (!draft) return NextResponse.json({ error: "Draft not found." }, { status: 404 })
  if (draft.status !== "pending") return NextResponse.json({ error: `Already ${draft.status}.`, status: draft.status }, { status: 409 })

  if (body?.action === "discard") {
    await decideDraft(id, "discarded", null)
    return NextResponse.json({ ok: true, status: "discarded" })
  }
  if (body?.action !== "send") return NextResponse.json({ error: "Unknown action." }, { status: 400 })

  const text = String(body.text ?? draft.draft).trim()
  if (!text || text.length > 1000) return NextResponse.json({ error: "The text must be 1 to 1000 characters." }, { status: 400 })
  const edited = text !== draft.draft.trim()
  if (!(await decideDraft(id, edited ? "edited" : "sent", text))) return NextResponse.json({ error: "Already decided." }, { status: 409 })
  const result = await sendSms(draft.phone, text, { typing: false, stream: "terraai", source: edited ? "adam" : "terraai" })
  if (!result.ok) {
    await decideDraft(id, "failed", text).catch(() => false)
    return NextResponse.json({ error: result.skipped ? `Not sent: ${result.error}` : "Sendblue didn't accept the text. Try from the Sendblue inbox." }, { status: 502 })
  }
  return NextResponse.json({ ok: true, status: edited ? "edited" : "sent" })
}
