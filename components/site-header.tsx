"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { BookingLink } from "@/components/booking-popup"
import { CheckMyBusinessLink } from "@/components/business-lookup"
import { Logo } from "@/components/logo"
import { ScheduleFab } from "@/components/schedule-fab"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"

/* Flat menu — no dropdowns. Solutions subpages, integrations, and resources
   still exist as routes (for backlinks) but are intentionally not in the nav.
   "How we work" points at /book (the Google Ads landing page doubles as the
   how-we-work story). */
const NAV_LINKS = [
  { href: "/marketing", label: "Marketing" },
  { href: "/solutions", label: "Solutions" },
  { href: "/book", label: "How we work" },
] as const

/** Visitors already booking (or managing a booking) keep "Let's talk" as the header's primary action. */
function isBookingStage(pathname: string | null): boolean {
  return pathname === "/schedule" || pathname === "/book" || Boolean(pathname?.startsWith("/book/"))
}

const PRIMARY_SM = "shrink-0 rounded-lg bg-brand px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-brand-hover"
const PRIMARY_LG = "rounded-full bg-brand px-4 py-2 text-[13px] font-medium text-white hover:bg-brand-hover"
const SECONDARY_LG = "rounded-full border border-ink/20 px-4 py-2 text-[13px] font-medium text-ink hover:border-ink/40"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  // Search-first: "Check my business" leads on every public page except the booking stage.
  const searchFirst = !isBookingStage(pathname)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className="pointer-events-none fixed top-4 left-0 right-0 z-[80]">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="pointer-events-auto fixed inset-0 z-[75] bg-ink/25 lg:hidden"
          onClick={close}
        />
      ) : null}

      <div className="page-shell relative z-[80]">
        <div className="pointer-events-auto flex w-full items-center gap-2 overflow-visible rounded-xl border border-black/[0.06] bg-white/95 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-4">
          <Logo
            size="md"
            animate={false}
            on="light"
            className="min-w-0 shrink"
            wordmarkClassName="!h-5 w-auto min-[400px]:!h-6 sm:!h-7 lg:!h-8"
          />

          <div className="ml-auto flex items-center gap-1.5 lg:hidden">
            {searchFirst ? (
              <CheckMyBusinessLink ctaId="header_report" className={`${PRIMARY_SM} max-[374px]:hidden`} />
            ) : (
              <BookingLink label="Let's talk" source="header" ctaId="header_book" className={PRIMARY_SM} />
            )}
            <button
              type="button"
              className="rounded-lg p-1.5 text-ink"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <nav className="ml-auto hidden items-center gap-6 text-[13px] font-medium text-slate-600 lg:flex">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={DASHBOARD_LOGIN_URL}
              title="Current clients. Invite only."
              className="flex flex-col items-end px-3 py-1 text-[13px] font-medium text-slate-600 hover:text-slate-900"
            >
              <span>Log in</span>
              <span className="text-[10px] font-normal text-slate-500">Current clients</span>
            </a>
            {searchFirst ? (
              <>
                <BookingLink label="Let's talk" source="header" ctaId="header_book" className={SECONDARY_LG} />
                <CheckMyBusinessLink ctaId="header_report" className={PRIMARY_LG} />
              </>
            ) : (
              <BookingLink label="Let's talk" source="header" ctaId="header_book" className={PRIMARY_LG} />
            )}
          </div>
        </div>

        {open ? (
          <div className="pointer-events-auto mt-2 w-full rounded-2xl border border-black/[0.06] bg-white px-4 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] lg:hidden">
            <a
              href={DASHBOARD_LOGIN_URL}
              title="Current clients. Invite only."
              onClick={close}
              className="block border-b border-black/[0.04] py-4 text-[17px] font-semibold text-brand"
            >
              Log in
              <span className="mt-0.5 block text-[12px] font-medium text-brand/60">Current clients. Invite only.</span>
            </a>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="block border-b border-black/[0.04] py-4 text-[17px] font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
            {searchFirst ? (
              <div className="py-4">
                {/* Under 375 px the bar has no room for "Check my business"; it leads the menu instead. */}
                <CheckMyBusinessLink
                  ctaId="header_report"
                  className="mb-3 inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-[16px] font-medium text-white min-[375px]:hidden"
                />
                <br className="min-[375px]:hidden" />
                <BookingLink
                  label="Let's talk"
                  source="header"
                  ctaId="header_book"
                  className="inline-flex min-h-11 items-center text-[17px] font-medium text-ink underline underline-offset-4"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isReportFunnel = pathname === "/report" || pathname?.startsWith("/report/")

  if (isReportFunnel) {
    return (
      <>
        <header className="sticky top-0 z-[80] border-b border-black/[0.06] bg-cream/95 backdrop-blur-md">
          <div className="page-shell flex h-14 items-center justify-between md:h-16">
            <Logo size="sm" animate={false} on="light" wordmarkClassName="!h-5 min-[400px]:!h-6" />
            <div className="flex shrink-0 items-center gap-3">
              <a href={DASHBOARD_LOGIN_URL} className="whitespace-nowrap text-[13px] font-medium text-ink/70 hover:text-ink">
                Log in
              </a>
              <BookingLink
                label="Let's talk"
                source="report"
                ctaId="report_header_book"
                className="hidden h-9 items-center justify-center rounded-full border border-ink/20 px-4 text-[14px] font-medium text-ink hover:border-ink/40 sm:inline-flex"
              />
              <CheckMyBusinessLink
                ctaId="report_header_report"
                className="hidden h-9 items-center justify-center whitespace-nowrap rounded-full bg-brand px-3 text-[13px] font-medium text-white hover:bg-brand-hover min-[375px]:inline-flex sm:px-4 sm:text-[14px]"
              />
            </div>
          </div>
        </header>
        <div>{children}</div>
        <ScheduleFab />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <div className={isHome ? "" : "pt-24"}>{children}</div>
      <ScheduleFab />
    </>
  )
}
