"use client"

import { useState } from "react"

/** Send as written, edit then send, or discard a TerraAI draft. */
export function DraftReview({ id, token, draft }: { id: string; token: string; draft: string }) {
  const [text, setText] = useState(draft)
  const [state, setState] = useState<"idle" | "busy" | "done">("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function act(action: "send" | "discard") {
    setState("busy")
    setMessage(null)
    try {
      const response = await fetch(`/api/sms/drafts/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, action, text }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; status?: string; error?: string }
      if (!response.ok) {
        setState("idle")
        setMessage(data.error || "That didn't work. Try again, or reply from the Sendblue inbox.")
        return
      }
      setState("done")
      setMessage(data.status === "discarded" ? "Discarded. Nothing was sent." : data.status === "edited" ? "Sent with your edits." : "Sent.")
    } catch {
      setState("idle")
      setMessage("Couldn't reach the server. Try again.")
    }
  }

  const changed = text.trim() !== draft.trim()
  return (
    <div className="grid gap-3">
      <label htmlFor="draft-text" className="text-[14px] font-medium text-ink">
        TerraAI&apos;s draft {changed ? <span className="font-normal text-ink/60">(edited)</span> : null}
      </label>
      <textarea
        id="draft-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={state !== "idle"}
        rows={6}
        className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[16px] leading-relaxed text-ink focus:border-brand focus:outline-none"
      />
      <p className="text-[12px] text-ink/60">{text.trim().length} characters</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void act("send")}
          disabled={state !== "idle" || !text.trim()}
          className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {state === "busy" ? "Sending…" : changed ? "Send my version" : "Send"}
        </button>
        <button
          type="button"
          onClick={() => void act("discard")}
          disabled={state !== "idle"}
          className="min-h-11 text-[14px] font-medium text-ink/60 hover:text-ink disabled:opacity-60"
        >
          Discard
        </button>
      </div>
      {message ? (
        <p role="status" className="text-[14px] text-ink/80">
          {message}
        </p>
      ) : null}
    </div>
  )
}
