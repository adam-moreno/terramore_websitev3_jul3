import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Page not found | Terramore.io",
  robots: { index: false },
}

/** Branded "not found" (2026-10-15): an old link should still lead somewhere useful, starting with the free check. */
export default function NotFound() {
  return (
    <>
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 py-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">Page not found</p>
        <h1 className="mt-3 text-[2rem] font-bold leading-tight tracking-tight text-ink">We couldn&apos;t find that page.</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink/75">
          It may have moved. Most people come here to see how their business shows up online, and that takes about a minute.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href="/report" className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover">
            Check my business
          </Link>
          <Link href="/book" className="inline-flex h-11 items-center rounded-full border border-ink/15 px-5 text-[15px] font-medium text-ink hover:border-ink/40">
            Book a free call
          </Link>
          <Link href="/" className="inline-flex h-11 items-center px-2 text-[15px] font-medium text-ink/70 hover:text-ink">
            Go to the homepage
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
