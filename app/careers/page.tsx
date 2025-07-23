"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { useState } from "react"

export default function CareersPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleFooterNavigation = (href: string) => {
    window.location.href = href
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Corner Buttons */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          onClick={() => setIsPopupOpen(true)}
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      {/* Navigation */}
      <nav className="bg-slate-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/terramore-logo-clean.png" alt="Terramore Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold">TERRAMORE.IO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <div className="flex items-center space-x-1 hover:text-blue-300 transition-colors cursor-pointer">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/courses/scaling"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Scaling
                    </Link>
                    <Link
                      href="/courses/offers"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Offers
                    </Link>
                    <Link
                      href="/courses/leads"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Leads
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/solutions" className="hover:text-blue-300 transition-colors">
                Solutions
              </Link>
              <Link href="/partner" className="hover:text-blue-300 transition-colors">
                Partner With Us
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" className="text-white hover:text-blue-300">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Careers</h1>
          <p className="text-lg text-slate-600 mb-8">This page is coming soon!</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Back to Home</Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <img src="/images/terramore-logo-clean.png" alt="Terramore Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold">TERRAMORE.IO</span>
              </div>
              <p className="text-gray-400 text-sm">
                Helping businesses scale through proven systems, strategic marketing, and operational excellence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/workshops" className="text-gray-400 hover:text-white transition-colors">
                    Workshops
                  </Link>
                </li>
                <li>
                  <Link href="/courses/scaling" className="text-gray-400 hover:text-white transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="text-gray-400 hover:text-white transition-colors">
                    Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclosure" className="text-gray-400 hover:text-white transition-colors">
                    Disclosure
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="text-gray-400 hover:text-white transition-colors">
                    DMCA Policy
                  </Link>
                </li>
                <li>
                  <button
                    onClick={openDoNotSell}
                    className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer bg-transparent border-none"
                  >
                    Do Not Sell My Personal Information
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Terramore.io. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
    </div>
  )
}
