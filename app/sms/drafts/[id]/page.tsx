import type { Metadata } from "next"
import { getDraft, recentMessages, verifyDraftToken } from "@/lib/sms/terraai/store"
import { DraftReview } from "./draft-review"

export const metadata: Metadata = { title: "TerraAI draft | Terramore", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

/** Adam's review of one TerraAI text draft: the conversation, the draft, Send / edit / Discard. Signed link only. */
export default async function DraftPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> }) {
  const { id } = await params
  const { t } = await searchParams
  const valid = verifyDraftToken(id, t)
  const draft = valid ? await getDraft(id) : null
  if (!valid || !draft) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-[1.6rem] font-bold text-ink">This link has expired</h1>
        <p className="mt-3 text-[16px] text-ink/70">Review links last 72 hours. Reply from the Sendblue inbox instead.</p>
      </main>
    )
  }
  const history = await recentMessages(draft.phone, 12)
  return (
    <main className="mx-auto grid max-w-lg gap-6 px-6 py-12">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">TerraAI draft · {draft.phone}</p>
        <h1 className="mt-2 text-[1.6rem] font-bold leading-tight text-ink">{draft.handoff ? "TerraAI suggests you take this one" : "Send, edit or discard"}</h1>
        {draft.notes ? <p className="mt-2 text-[15px] text-ink/70">{draft.notes}</p> : null}
      </div>
      <ol className="grid gap-2" aria-label="Conversation, oldest first">
        {history.map((m) => (
          <li
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-[15px] leading-relaxed ${m.direction === "inbound" ? "justify-self-start bg-ink/[0.06] text-ink" : "justify-self-end bg-brand text-white"}`}
          >
            {m.body}
          </li>
        ))}
      </ol>
      {draft.status === "pending" ? (
        <DraftReview id={draft.id} token={t as string} draft={draft.draft} />
      ) : (
        <p className="text-[15px] text-ink/70">
          Already {draft.status}.{draft.final_text ? ` Sent: "${draft.final_text}"` : ""}
        </p>
      )}
    </main>
  )
}
