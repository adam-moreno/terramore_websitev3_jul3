import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { TextUsButton } from "@/components/text-us-button"
import { isRefCode, textBody, TEXT_NUMBER_DISPLAY } from "@/lib/sms/text-link"
import { findTextRef } from "@/lib/sms/text-refs"

export const metadata: Metadata = {
  title: "Text Terramore | Terramore.io",
  robots: { index: false },
}

export const dynamic = "force-dynamic"

/**
 * /text?ref=CODE — where "Want reminders by text?" in the booking email lands. On a phone the button opens Messages
 * with the owner's message and ref filled in; on a computer, a QR code does the same from their phone. Without a valid
 * ref it's the general "free check" text. Shows only the owner's first name, never other booking details.
 */
export default async function TextPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  const code = typeof ref === "string" ? ref.trim().toUpperCase() : ""
  const found = isRefCode(code) ? await findTextRef(code) : null
  const kind = found?.kind ?? "site"
  const body = found ? textBody(found.kind, { firstName: found.first_name, code: found.code }) : textBody("site")
  const heading = kind === "booking" ? "Get your call reminders by text" : kind === "report" ? "Get report updates by text" : "Text Terramore"
  const lede =
    kind === "booking"
      ? "Send us one text and we'll text you before your call, with the join link."
      : kind === "report"
        ? "Send us one text and we'll text you about your report."
        : "Send us a text and our Customer Success team will get back to you. Want a free check of your business? Say so and include your website."
  return (
    <>
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-14">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">Text us · {TEXT_NUMBER_DISPLAY}</p>
        <h1 className="mt-3 text-[1.9rem] font-bold leading-tight tracking-tight text-ink">{heading}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink/75">{lede}</p>
        <div className="mt-7">
          <TextUsButton placement="text_page" body={body} label="Open Messages" />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
