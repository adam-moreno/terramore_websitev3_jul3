"use client"

import { ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Logo } from "@/components/logo"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"
import { CAPABILITIES, OWNER_JOBS, capabilityPath } from "@/lib/capabilities"
import { INTEGRATION_CATEGORIES, integrationPath } from "@/lib/integrations"

type MenuItem = { href: string; label: string; strong?: boolean }
type MenuSection = { heading: string; items: MenuItem[] }

const solutionsSections: MenuSection[] = [
  {
    heading: "Pick the job",
    items: [
      ...OWNER_JOBS.map((job) => ({ href: job.href, label: job.label })),
      { href: "/#use-cases", label: "See every job we take", strong: true },
    ],
  },
  {
    heading: "Every capability",
    items: [
      ...CAPABILITIES.map((item) => ({ href: capabilityPath(item.slug), label: item.navTitle })),
      { href: "/solutions", label: "All solutions", strong: true },
    ],
  },
]

const integrationLinks: MenuItem[] = [
  ...INTEGRATION_CATEGORIES.map((item) => ({
    href: integrationPath(item.slug),
    label: item.navTitle,
  })),
  { href: "/integrations", label: "All integrations", strong: true },
]

const resourceLinks: MenuItem[] = [
  { href: "/pricing", label: "Pricing" },
  { href: "/report", label: "Free Digital Footprint report" },
  { href: "/about", label: "About" },
  { href: "/security", label: "Security" },
  { href: "/#faq", label: "Questions" },
  { href: "/resources", label: "Start here" },
  { href: "/partner", label: "Talk with us" },
]

function MenuLink({ item, onPick }: { item: MenuItem; onPick: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onPick}
      className={`block px-4 py-2 hover:bg-slate-50 ${item.strong ? "font-semibold text-brand" : "text-slate-700"}`}
    >
      {item.label}
    </Link>
  )
}

function HeaderMenu({
  label,
  items = [],
  sections,
  columns = 1,
}: {
  label: string
  items?: MenuItem[]
  sections?: MenuSection[]
  columns?: 1 | 2
}) {
  const [pinned, setPinned] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pinned) return
    const onDoc = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setPinned(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [pinned])

  return (
    <div ref={ref} className="relative group">
      <button
        type="button"
        aria-expanded={pinned}
        onClick={() => setPinned((value) => !value)}
        className="flex items-center gap-1 hover:text-slate-900"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition ${pinned ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute top-full z-[90] pt-3 transition ${
          pinned
            ? "visible opacity-100"
            : "invisible opacity-0 group-hover:visible group-hover:opacity-100"
        } ${columns === 2 ? "left-1/2 w-[34rem] -translate-x-1/2" : "left-1/2 w-56 -translate-x-1/2"}`}
      >
        <div
          className={`rounded-2xl border border-black/[0.06] bg-white py-2 shadow-lg ${
            columns === 2 ? "grid grid-cols-2" : ""
          }`}
        >
          {sections
            ? sections.map((section) => (
                <div key={section.heading} className="py-1">
                  <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {section.heading}
                  </p>
                  {section.items.map((item) => (
                    <MenuLink key={`${item.href}-${item.label}`} item={item} onPick={() => setPinned(false)} />
                  ))}
                </div>
              ))
            : items.map((item) => (
                <MenuLink key={`${item.href}-${item.label}`} item={item} onPick={() => setPinned(false)} />
              ))}
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="pointer-events-none fixed top-4 left-0 right-0 z-[80]">
      <div className="page-shell">
      <div className="pointer-events-auto flex w-full items-center justify-between overflow-visible rounded-xl border border-black/[0.06] bg-white/90 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <Logo size="md" animate={false} on="light" />

        <nav className="hidden items-center gap-6 text-[13px] font-medium text-slate-600 lg:flex">
          <HeaderMenu label="Solutions" sections={solutionsSections} columns={2} />
          <HeaderMenu label="Integrations" items={integrationLinks} columns={2} />
          <HeaderMenu label="Resources" items={resourceLinks} />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={DASHBOARD_LOGIN_URL}
            title="Current clients. Invite only."
            className="flex flex-col items-end px-3 py-1 text-[13px] font-medium text-slate-600 hover:text-slate-900"
          >
            <span>Log in</span>
            <span className="text-[10px] font-normal text-slate-400">Current clients</span>
          </a>
          <Link
            href="/partner"
            className="rounded-full bg-brand px-4 py-2 text-[13px] font-medium text-white hover:bg-brand-hover"
          >
            Let&apos;s talk
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="pointer-events-auto mt-2 w-full rounded-xl border border-black/[0.06] bg-white p-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-3 text-[15px] text-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Pick the job</p>
            {OWNER_JOBS.map((job) => (
              <Link key={job.label} href={job.href}>
                {job.label}
              </Link>
            ))}
            <Link href="/solutions" className="font-semibold text-brand">
              All solutions
            </Link>
            <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Integrations</p>
            {INTEGRATION_CATEGORIES.map((item) => (
              <Link key={item.slug} href={integrationPath(item.slug)}>
                {item.navTitle}
              </Link>
            ))}
            <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">More</p>
            <Link href="/#how-we-work">How we work</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/report">Free Digital Footprint report</Link>
            <Link href="/about">About</Link>
            <Link href="/security">Security</Link>
            <Link href="/#faq">Questions</Link>
            <Link href="/resources">Start here</Link>
            <a href={DASHBOARD_LOGIN_URL} title="Current clients. Invite only.">
              Log in
            </a>
            <p className="text-[12px] text-slate-400">Current clients. Invite only.</p>
            <Link
              href="/partner"
              className="rounded-full bg-brand px-4 py-2.5 text-center font-medium text-white"
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>
      )}
      </div>
    </header>
  )
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <>
      <SiteHeader />
      <div className={isHome ? "" : "pt-24"}>{children}</div>
    </>
  )
}
