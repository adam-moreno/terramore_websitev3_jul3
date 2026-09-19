"use client"

import Image from "next/image"
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

/* Second column group for the immersive footer, mirroring how Superside
   splits Services vs Navigation into labeled sub-columns. */
const SERVICES_LINKS = [
  { href: "/marketing", label: "Ad creative" },
  { href: "/marketing", label: "Paid campaigns" },
  { href: "/marketing", label: "Landing pages" },
  { href: "/marketing", label: "Email & SMS" },
  { href: "/marketing", label: "Short-form content" },
  { href: "/solutions", label: "Automation" },
  { href: "/solutions", label: "Analytics & attribution" },
]

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclosure", label: "Disclosure" },
  { href: "/dmca", label: "DMCA" },
]

export function SiteFooter({
  tagline = "We find the step where you lose sales and fix it.",
  backgroundImage,
}: {
  tagline?: string
  backgroundImage?: string
}) {
  const { isOpen, openPopup, closePopup } = useDoNotSellPopup()

  /* ---------------------------------------------------------------- */
  /* Immersive variant (marketing page): full-bleed artwork behind a   */
  /* dark wash, big centered headline + CTA, labeled column groups     */
  /* with hairline rules, and a logo/legal bottom bar — Superside-style. */
  /* ---------------------------------------------------------------- */
  if (backgroundImage) {
    return (
      <footer className="relative overflow-hidden">
        <Image
          src={backgroundImage}
          alt=""
          aria-hidden
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover object-center"
          sizes="100vw"
        />
        {/* Dark wash so white type reads over the artwork. */}
        <div aria-hidden className="absolute inset-0 bg-ink/70" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/60" />

        {/* Roaming characters: dragon flies left→right across the top,
            the monster-truck chase tears right→left along the bottom.
            Decorative only; hidden under prefers-reduced-motion. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="marketing-dragon-fly absolute top-[24%] left-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marketing/footer-dragon.png" alt="" className="marketing-dragon-bob h-16 w-auto opacity-90 md:h-24" />
          </div>
          <div className="marketing-chase-run absolute bottom-1 left-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marketing/footer-chase.png" alt="" className="h-14 w-auto opacity-90 md:h-20" />
          </div>
        </div>

        <div className="page-shell relative pb-10 pt-20 md:pt-28">
          {/* Big centered headline + CTA */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[3rem]">
              Your next campaign is <span className="font-serif italic">an adventure away.</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <Link
                href="/book"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-[14px] font-semibold text-ink transition hover:bg-white/90"
              >
                Book a demo
              </Link>
            </div>
          </div>

          {/* Labeled column groups with hairline rules */}
          <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-10">
            <div>
              <p className="border-b border-white/25 pb-3 text-[13px] font-medium text-white">Services</p>
              <div className="mt-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[14px] font-semibold text-white">Creative &amp; campaigns</p>
                  <ul className="mt-4 space-y-2.5">
                    {SERVICES_LINKS.slice(0, 4).map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-[13px] text-white/60 transition hover:text-white">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">Systems &amp; data</p>
                  <ul className="mt-4 space-y-2.5">
                    {SERVICES_LINKS.slice(4).map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-[13px] text-white/60 transition hover:text-white">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <p className="border-b border-white/25 pb-3 text-[13px] font-medium text-white">Navigation</p>
              <div className="mt-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[14px] font-semibold text-white">Explore</p>
                  <ul className="mt-4 space-y-2.5">
                    {EXPLORE.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-[13px] text-white/60 transition hover:text-white">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">Company</p>
                  <ul className="mt-4 space-y-2.5">
                    {COMPANY.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-[13px] text-white/60 transition hover:text-white">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <a href={DASHBOARD_LOGIN_URL} className="text-[13px] text-white/60 transition hover:text-white">
                        Log in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar: logo + copyright left, legal inline right */}
          <div className="mt-20 border-t border-white/15 pt-8 md:mt-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <Logo size="md" animate={false} on="dark" />
                <p className="mt-3 text-[12px] text-white/50">
                  &copy; {new Date().getFullYear()} Terramore.io. All rights reserved.
                </p>
              </div>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {LEGAL.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[12px] text-white/50 underline-offset-4 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={openPopup}
                    className="text-[12px] text-white/50 underline-offset-4 transition hover:text-white"
                  >
                    Do not sell my information
                  </button>
                </li>
              </ul>
            </div>
            <p className="mt-6 max-w-4xl text-[11px] leading-relaxed text-white/40">
              Results mentioned on this website are not typical and are not a guarantee of your success. Individual
              results vary. Terramore.io is owned and operated by Adam Moreno.
            </p>
          </div>
        </div>
        <DoNotSellPopup isOpen={isOpen} onClose={closePopup} />
      </footer>
    )
  }

  /* Default light footer, unchanged for every other page. */
  return (
    <footer className="border-t border-black/[0.06] bg-white py-12 md:py-16">
      <div className="page-shell">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-14">
          <div className="max-w-sm">
            <Logo size="md" animate={false} on="light" />
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">{tagline}</p>
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
