"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog"

const PRIVACY_EMAIL = "admin@terramore.io"
const PRIVACY_MAILTO = `mailto:${PRIVACY_EMAIL}?subject=Privacy%20request`

interface DoNotSellPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function DoNotSellPopup({ isOpen, onClose }: DoNotSellPopupProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle")
  const contentRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const close = () => {
    setCopyStatus("idle")
    onClose()
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(PRIVACY_EMAIL)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("failed")
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
      }}
    >
      <DialogPortal>
        {/* Above the fixed site header (z-[80]) and schedule button (z-[70]). */}
        <DialogOverlay className="z-[100] bg-ink/60" />
        <DialogPrimitive.Content
          ref={contentRef}
          aria-modal="true"
          onOpenAutoFocus={(event) => {
            const active = document.activeElement
            returnFocusRef.current = active instanceof HTMLElement && active !== document.body ? active : null
            event.preventDefault()
            contentRef.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            returnFocusRef.current?.focus()
          }}
          className="fixed left-1/2 top-1/2 z-[100] max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.75rem] bg-white px-7 py-7 shadow-[0_24px_60px_-20px_rgba(15,30,46,0.45)] focus:outline-none md:px-9 md:py-9"
        >
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-[1.35rem] font-semibold tracking-tight text-ink">Your privacy choices</DialogTitle>
            <DialogClose className="-m-2 shrink-0 rounded-full p-2 text-[13px] font-medium text-slate-500 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              Close
            </DialogClose>
          </div>

          <DialogDescription className="mt-3 text-[15px] leading-relaxed text-ink/75">
            To ask Terramore not to sell or share your personal information, to stop marketing emails, or to delete your
            information, email us from the address you used with Terramore and tell us what you&apos;d like.
          </DialogDescription>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
            We may need to confirm your identity before we act on a request.
          </p>

          <a
            href={PRIVACY_MAILTO}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Email {PRIVACY_EMAIL}
          </a>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-cream px-5 py-4">
            <div className="min-w-0">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/70">Email address</p>
              <p className="mt-1 select-all break-all text-[15px] font-medium text-ink">{PRIVACY_EMAIL}</p>
            </div>
            <button
              type="button"
              onClick={copyAddress}
              className="shrink-0 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-[13px] font-medium text-ink hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Copy
            </button>
          </div>
          <p role="status" className="mt-2 min-h-[1.25rem] text-[13px] text-slate-500">
            {copyStatus === "copied" ? "Copied." : null}
            {copyStatus === "failed" ? "Couldn't copy. Select the address above and copy it." : null}
          </p>

          <Link
            href="/privacy"
            onClick={close}
            className="mt-3 inline-block rounded text-[14px] font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Read our privacy policy
          </Link>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
