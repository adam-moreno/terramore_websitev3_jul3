"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SchedulePopup } from "@/components/schedule-popup"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { Cookie, ChevronDown, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ResourcesPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleFooterNavigation = (href: string) => {
    window.location.href = href
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Corner Buttons */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button size="sm" variant="secondary" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Cookie className="w-4 h-4 mr-2" />
          Cookies
        </Button>
      </div>

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

      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Badge variant="secondary" className="mr-3 bg-white text-blue-800">
            NEW
          </Badge>
          <span className="text-sm font-medium">
            2025 AI Marketing Workshop Dates Announced: Find out if you're a fit
          </span>
          <span className="ml-2">→</span>
        </div>
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
              <Link href="/workshops" className="hover:text-blue-300 transition-colors">
                Workshops
              </Link>
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
              <Link href="/about" className="hover:text-blue-300 transition-colors">
                About the Firm
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-blue-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-800 text-white py-4 px-6 border-t border-slate-700">
          <div className="flex flex-col space-y-4">
            <Link
              href="/workshops"
              className="hover:text-blue-300 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workshops
            </Link>
            <div className="py-2">
              <div className="text-white mb-2">Courses</div>
              <div className="pl-4 space-y-2">
                <Link
                  href="/courses/scaling"
                  className="block text-gray-300 hover:text-blue-300 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Scaling
                </Link>
                <Link
                  href="/courses/offers"
                  className="block text-gray-300 hover:text-blue-300 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Offers
                </Link>
                <Link
                  href="/courses/leads"
                  className="block text-gray-300 hover:text-blue-300 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leads
                </Link>
              </div>
            </div>
            <Link
              href="/solutions"
              className="hover:text-blue-300 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link
              href="/partner"
              className="hover:text-blue-300 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Partner With Us
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-300 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About the Firm
            </Link>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Resources</h1>
          <p className="text-lg text-slate-600 mb-8">This page is coming soon!</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Back to Home</Button>
          </Link>
        </div>
      </div>

      {/* Schedule Popup */}
      <SchedulePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
