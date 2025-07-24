"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Cookie, ChevronDown, Menu, Play } from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { useRoadmapModal } from "@/hooks/use-roadmap-modal"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { Logo } from "@/components/logo"

export default function LeadsCoursePage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const { isOpen: isRoadmapOpen, setIsOpen: setIsRoadmapOpen } = useRoadmapModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(0)
  const [isModulesOpen, setIsModulesOpen] = useState(false)

  const videos = [
    { title: "Branding That Actually Matters – You > Logo", duration: "18:34" },
    { title: "Creating Your Content Strategy – Educate, Entertain, Engage", duration: "21:45" },
    { title: "Lead Generation with Authority – Building Funnels & Opt-ins", duration: "24:12" },
    { title: "Warm Outreach + Inbound Combo – The Hybrid Model", duration: "19:28" },
    { title: "Using Data to Decide – Intro to Analytics for Founders", duration: "16:33" },
    { title: "Client Retention Tactics – Keeping What You Earn", duration: "17:56" },
    { title: "Creating Digital Products for Passive Revenue", duration: "23:47" },
    { title: "Affiliate Marketing & Partnerships as a Growth Lever", duration: "20:15" },
    { title: "Your First Team Member – Delegate for Real Growth", duration: "22:08" },
    { title: "BONUS: Brand Audit Template + SOP Library", duration: "15:32" },
  ]

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
            <Logo size="lg" className="text-white" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <div className="flex items-center space-x-1 text-blue-300 transition-colors cursor-pointer">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/courses/scaling"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      The Foundation
                    </Link>
                    <Link
                      href="/courses/offers"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Make It Real
                    </Link>
                    <Link href="/courses/leads" className="block px-4 py-2 text-gray-800 bg-blue-50 text-blue-600">
                      Build to Grow
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <div className="py-2">
                <span className="text-blue-300">Courses</span>
                <div className="ml-4 mt-2 space-y-2">
                  <Link href="/courses/scaling" className="block text-white hover:text-blue-300 transition-colors">
                    The Foundation
                  </Link>
                  <Link href="/courses/offers" className="block text-white hover:text-blue-300 transition-colors">
                    Make It Real
                  </Link>
                  <Link href="/courses/leads" className="block text-white hover:text-blue-300 transition-colors">
                    Build to Grow
                  </Link>
                </div>
              </div>
              <Link href="/solutions" className="text-white hover:text-blue-300 transition-colors py-2">
                Solutions
              </Link>
              <Link href="/partner" className="text-white hover:text-blue-300 transition-colors py-2">
                Partner With Us
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Hero */}
        <div className="bg-white text-center py-6 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Leads</h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-4"></div>
        </div>

        {/* Course Modules Accordion */}
        <div className="bg-slate-900 text-white">
          <button
            onClick={() => setIsModulesOpen(!isModulesOpen)}
            className="w-full py-6 px-6 flex items-center justify-center space-x-2 text-lg font-medium"
          >
            <span>Course Modules</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isModulesOpen ? "rotate-180" : ""}`} />
          </button>

          {isModulesOpen && (
            <div className="px-6 pb-6">
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedVideo === index ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    onClick={() => setSelectedVideo(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white">{video.title}</h4>
                        <p className="text-xs text-gray-300 mt-1">{video.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="p-6">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-white text-sm">{videos[selectedVideo].title}</div>
            <div className="absolute bottom-4 right-4 text-white text-sm">{videos[selectedVideo].duration}</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="px-6 space-y-4 mb-8">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg"
            onClick={() => setIsRoadmapOpen(true)}
          >
            GET MY $100M ROADMAP
          </Button>


        </div>

        {/* Mobile Form */}
        <div className="px-6 pb-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">
              <span className="font-black">Get Custom Content & Direct Access</span>
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Join our email marketing list for exclusive content, strategies, and direct communication with our team. See how our proven methods convert in real businesses.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                Company Name
              </Label>
              <Input
                id="company"
                type="text"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                By providing your information today, you are giving consent for us or our partners, to contact you by
                mail, phone, text, or email using automated technology to the data provided, even if the phone number is
                present on a state or national Do Not Call list. We do not sell your personal information to other
                companies, and you can withdraw consent at any time. By submitting this form, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => handleFooterNavigation("/privacy")}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => handleFooterNavigation("/terms")}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Terms of Service
                </button>
                .
              </p>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Go to Step 2
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto h-screen sticky top-0">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">🧭 Build to Grow – Audience, Brand, and Legacy</h2>
            <p className="text-sm text-gray-600">
              Transform your hustle into a scalable brand that builds lasting authority and creates multiple revenue
              streams.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-2">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVideo === index ? "bg-blue-100 border-l-4 border-blue-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedVideo(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-medium ${selectedVideo === index ? "text-blue-600" : "text-gray-900"}`}
                      >
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Video Section */}
          <div className="flex-1 p-8">
            <div className="mb-8">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm">{videos[selectedVideo].title}</div>
                <div className="absolute bottom-4 right-4 text-white text-sm">{videos[selectedVideo].duration}</div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{videos[selectedVideo].title}</h1>
              <p className="text-gray-600 leading-relaxed">
                {selectedVideo === 0 &&
                  "Build a personal brand that matters more than any logo. Learn how to position yourself as the authority in your space and create authentic connections with your audience."}
                {selectedVideo === 1 &&
                  "Develop a content strategy that educates, entertains, and engages your audience across all platforms. Create content that builds trust and drives business results."}
                {selectedVideo === 2 &&
                  "Master lead generation through authority building. Create high-converting funnels and opt-ins that attract qualified prospects who are ready to buy."}
                {selectedVideo === 3 &&
                  "Combine warm outreach with inbound marketing for maximum impact. Learn the hybrid model that successful entrepreneurs use to scale consistently."}
                {selectedVideo === 4 &&
                  "Make data-driven decisions with simple analytics. Learn which metrics matter and how to use data to optimize your marketing and business operations."}
                {selectedVideo === 5 &&
                  "Keep the clients you work hard to get. Implement retention strategies that increase lifetime value and create a stable, predictable revenue base."}
                {selectedVideo === 6 &&
                  "Build passive revenue streams with digital products. Learn how to package your expertise into scalable offerings that generate income while you sleep."}
                {selectedVideo === 7 &&
                  "Leverage affiliate marketing and strategic partnerships to accelerate growth. Build relationships that create win-win opportunities for expansion."}
                {selectedVideo === 8 &&
                  "Make your first strategic hire and delegate effectively. Learn what to delegate first and how to build a team that supports real growth."}
                {selectedVideo === 9 &&
                  "BONUS: Get access to brand audit templates and SOP libraries to systematize your brand building and operational processes."}
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-96 bg-white p-8 border-l border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                <span className="font-black">Get Custom Content & Direct Access</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Join our email marketing list for exclusive content, strategies, and direct communication with our team. See how our proven methods convert in real businesses.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company Name
                </Label>
                <Input
                  id="company"
                  type="text"
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  By providing your information today, you are giving consent for us or our partners, to contact you by
                  mail, phone, text, or email using automated technology to the data provided, even if the phone number
                  is present on a state or national Do Not Call list. We do not sell your personal information to other
                  companies, and you can withdraw consent at any time. By submitting this form, you agree to our{" "}
                  <button
                    type="button"
                    onClick={() => handleFooterNavigation("/privacy")}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Privacy Policy
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => handleFooterNavigation("/terms")}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Terms of Service
                  </button>
                  .
                </p>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Go to Step 2
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>



      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Logo size="md" className="text-white" />
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
                  <Link href="/courses/leads" className="text-gray-400 hover:text-white transition-colors">
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
