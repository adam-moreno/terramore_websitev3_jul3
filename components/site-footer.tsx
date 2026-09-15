"use client"

import Link from "next/link"
import { DualCtas } from "@/components/dual-ctas"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { Logo } from "@/components/logo"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"

const PRIMARY = [
  { href: "/solutions", label: "Solutions" },
  { href: "/integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/report", label: "Free Digital Footprint report" },
  { href: "/about", label: "About" },
  { href: "/security", label: "Security" },
  { href: "/#faq", label: "Questions" },
  { href: "/enterprise", label: "Larger teams" },
  { href: "/resources", label: "Start here" },
  { href: "/book", label: "Talk with us" },
]

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclosure", label: "Disclosure" },
  { href: "/dmca", label: "DMCA" },
]

export function SiteFooter() {
  const { isOpen, openPopup, closePopup } = useDoNotSellPopup()

  return (
    <footer className="section-y border-t border-black/[0.06] bg-white md:py-16">
      <div className="page-shell">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo size="md" animate={false} on="light" />
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              We find the step where you lose sales and fix it. Talk first. If you are not ready for a call, ask for a
              free Digital Footprint report.
            </p>
            <DualCtas className="mt-6" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/40">Visit</p>
              <ul className="mt-3 space-y-2">
                {PRIMARY.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[15px] text-slate-600 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={DASHBOARD_LOGIN_URL} className="text-[15px] text-slate-600 hover:text-ink">
                    Log in
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/40">Legal</p>
              <ul className="mt-3 space-y-2">
                {LEGAL.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[15px] text-slate-600 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={openPopup} className="text-[15px] text-slate-600 hover:text-ink">
                    Do not sell my information
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 max-w-4xl text-[12px] leading-relaxed text-slate-400">
          Results mentioned on this website are not typical and are not a guarantee of your success. Individual results
          vary. Terramore.io is owned and operated by Adam Moreno. Copyright © {new Date().getFullYear()} Terramore.io.
          All rights reserved.
        </p>
      </div>
      <DoNotSellPopup isOpen={isOpen} onClose={closePopup} />
    </footer>
  )
}
