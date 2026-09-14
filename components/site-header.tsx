"use client"

import {
  BarChart3,
  Briefcase,
  Calendar,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { Logo } from "@/components/logo"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"
import { CAPABILITIES, OWNER_JOBS, capabilityPath } from "@/lib/capabilities"
import { INTEGRATION_CATEGORIES, integrationPath } from "@/lib/integrations"

type MenuItem = { href: string; label: string; strong?: boolean; icon?: LucideIcon }
type MenuSection = { heading: string; items: MenuItem[] }

const JOB_ICONS: LucideIcon[] = [ShoppingBag, Briefcase, Mail, MapPin, Users, CreditCard]
const CAPABILITY_ICONS: LucideIcon[] = [
  Megaphone,
  Sparkles,
  Users,
  BarChart3,
  CreditCard,
  Briefcase,
  LayoutGrid,
  Sparkles,
  Briefcase,
  MapPin,
  Users,
]

const INTEGRATION_ICONS: Record<string, LucideIcon> = {
  "email-marketing": Mail,
  "calls-texts-and-chat": MessageSquare,
  advertising: Megaphone,
  ecommerce: ShoppingBag,
  payments: CreditCard,
  analytics: BarChart3,
  scheduling: Calendar,
}

const solutionsSections: MenuSection[] = [
  {
    heading: "Pick the job",
    items: [
      ...OWNER_JOBS.map((job, index) => ({
        href: job.href,
        label: job.label,
        icon: JOB_ICONS[index % JOB_ICONS.length],
      })),
      { href: "/#use-cases", label: "See every job we take", strong: true },
    ],
  },
  {
    heading: "Every capability",
    items: [
      ...CAPABILITIES.map((item, index) => ({
        href: capabilityPath(item.slug),
        label: item.navTitle,
        icon: CAPABILITY_ICONS[index % CAPABILITY_ICONS.length],
      })),
      { href: "/solutions", label: "All solutions", strong: true },
    ],
  },
]

const integrationLinks: MenuItem[] = [
  ...INTEGRATION_CATEGORIES.map((item) => ({
    href: integrationPath(item.slug),
    label: item.navTitle,
    icon: INTEGRATION_ICONS[item.slug] ?? LayoutGrid,
  })),
  { href: "/integrations", label: "All integrations", strong: true },
]

const resourceLinks: MenuItem[] = [
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/report", label: "Free Digital Footprint report", icon: FileText },
  { href: "/about", label: "About", icon: Users },
  { href: "/security", label: "Security", icon: Lock },
  { href: "/#faq", label: "Questions", icon: CircleHelp },
  { href: "/resources", label: "Start here", icon: Sparkles },
  { href: "/partner", label: "Talk with us", icon: MessageSquare },
]

/** Mobile "More" list: original Terramore labels, with icons for accordion rows. */
const moreLinks: MenuItem[] = [
  { href: "/#how-we-work", label: "How we work", icon: Wrench },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/report", label: "Free Digital Footprint report", icon: FileText },
  { href: "/about", label: "About", icon: Users },
  { href: "/security", label: "Security", icon: Lock },
  { href: "/#faq", label: "Questions", icon: CircleHelp },
  { href: "/resources", label: "Start here", icon: Sparkles },
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

function MobileAccordion({
  label,
  children,
  defaultOpen = false,
}: {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border-b border-black/[0.04] last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-4 text-left text-[17px] font-medium text-ink"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div id={panelId} className="pb-4 pt-1">
          {children}
        </div>
      ) : null}
    </div>
  )
}

function MobileItemRow({ item, onPick }: { item: MenuItem; onPick: () => void }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onPick}
      className={`flex items-center gap-3 py-2.5 text-[15px] ${
        item.strong ? "font-semibold text-brand" : "font-medium text-ink"
      }`}
    >
      {Icon ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-slate-500">
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      ) : null}
      <span>{item.label}</span>
    </Link>
  )
}

function MobileSection({
  heading,
  items,
  onPick,
}: {
  heading: string
  items: MenuItem[]
  onPick: () => void
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{heading}</p>
      <div className="flex flex-col">
        {items.map((item) => (
          <MobileItemRow key={`${item.href}-${item.label}`} item={item} onPick={onPick} />
        ))}
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
            wordmarkClassName="!h-7 w-auto lg:!h-8"
          />

          <div className="ml-auto flex items-center gap-1.5 lg:hidden">
            <Link
              href="/partner"
              className="shrink-0 rounded-lg bg-brand px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-brand-hover"
            >
              Let&apos;s talk
            </Link>
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
        </div>

        {open ? (
          <div className="pointer-events-auto mt-2 max-h-[min(70vh,32rem)] w-full overflow-y-auto rounded-2xl border border-black/[0.06] bg-white px-4 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] lg:hidden">
            <a
              href={DASHBOARD_LOGIN_URL}
              title="Current clients. Invite only."
              onClick={close}
              className="block border-b border-black/[0.04] py-4 text-[17px] font-semibold text-brand"
            >
              Log in
              <span className="mt-0.5 block text-[12px] font-medium text-brand/60">Current clients. Invite only.</span>
            </a>

            <MobileAccordion label="Solutions">
              {solutionsSections.map((section) => (
                <MobileSection
                  key={section.heading}
                  heading={section.heading}
                  items={section.items}
                  onPick={close}
                />
              ))}
            </MobileAccordion>

            <MobileAccordion label="Integrations">
              <div className="flex flex-col">
                {integrationLinks.map((item) => (
                  <MobileItemRow key={`${item.href}-${item.label}`} item={item} onPick={close} />
                ))}
              </div>
            </MobileAccordion>

            <MobileAccordion label="More">
              <div className="flex flex-col">
                {moreLinks.map((item) => (
                  <MobileItemRow key={`${item.href}-${item.label}`} item={item} onPick={close} />
                ))}
              </div>
            </MobileAccordion>
          </div>
        ) : null}
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
