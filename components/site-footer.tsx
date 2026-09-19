"use client"

import Link from "next/link"
import { DualCtas } from "@/components/dual-ctas"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { Logo } from "@/components/logo"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"

const EXPLORE = [
  { href: "/marketing", label: "Marketing" },
  { href: "/solutions", label: "Solutions" },
  { href: "/integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/report", label: "Free report" },
  { href: "/resources", label: "Start here" },
]

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/security", label: "Security" },
  { href: "/#faq", label: "Questions" },
  { href: "/enterprise", label: "Larger teams" },
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
    <footer className="border-t border-black/[0.06] bg-white py-12 md:py-16">
      <div className="page-shell">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-14">
          <div className="max-w-sm">
            <Logo size="md" animate={false} on="light" />
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              We find the step where you lose sales and fix it.
            </p>
            <DualCtas className="mt-6" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/40">Explore</p>
              <ul className="mt-3 space-y-2">
                {EXPLORE.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[14px] text-slate-600 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/40">Company</p>
              <ul className="mt-3 space-y-2">
                {COMPANY.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[14px] text-slate-600 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={DASHBOARD_LOGIN_URL} className="text-[14px] text-slate-600 hover:text-ink">
                    Log in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/[0.06] pt-6">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[13px] text-slate-500 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={openPopup} className="text-[13px] text-slate-500 hover:text-ink">
                Do not sell my information
              </button>
            </li>
          </ul>
          <p className="mt-4 max-w-4xl text-[12px] leading-relaxed text-slate-400">
            Results mentioned on this website are not typical and are not a guarantee of your success. Individual
            results vary. Terramore.io is owned and operated by Adam Moreno. Copyright &copy;{" "}
            {new Date().getFullYear()} Terramore.io. All rights reserved.
          </p>
        </div>
      </div>
      <DoNotSellPopup isOpen={isOpen} onClose={closePopup} />
    </footer>
  )
}
