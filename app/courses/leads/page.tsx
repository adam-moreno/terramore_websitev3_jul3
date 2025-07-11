"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Cookie, ChevronDown, Menu, Play } from "lucide-react"
import Link from "next/link"
import { SchedulePopup } from "@/components/schedule-popup"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"

export default function LeadsCoursePage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <Link href="/workshops" className="text-white hover:text-blue-300 transition-colors py-2">
                Workshops
              </Link>
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
              <Link href="/about" className="text-white hover:text-blue-300 transition-colors py-2">
                About the Firm
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Hero */}
        <div className="bg-white text-center py-12 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Leads</h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-8"></div>
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
            onClick={() => setIsPopupOpen(true)}
          >
            GET MY PERSONALIZED $100M ROADMAP
          </Button>

          <Button
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-4 text-lg font-semibold rounded-lg bg-transparent"
            onClick={() => (window.location.href = "/workshops")}
          >
            CHECK WORKSHOP DATES
          </Button>
        </div>

        {/* Mobile Form */}
        <div className="px-6 pb-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">
              <span className="font-black">** Business Owners **</span>
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Meet the Terramore.io Team for a private workshop in Vegas.
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
        <div className="w-80 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
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
                <span className="font-black">Business Owners</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Meet the Terramore.io Team for a private workshop in Vegas.
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/terramore-logo-clean.png" alt="Terramore Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold">TERRAMORE.IO</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering entrepreneurs to scale their businesses through proven strategies and expert guidance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleFooterNavigation("/workshops")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Workshops
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterNavigation("/courses/scaling")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Courses
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterNavigation("/solutions")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Solutions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterNavigation("/about")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleFooterNavigation("/privacy")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterNavigation("/terms")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Terramore.io. All rights reserved. | The information provided by Adam Moreno and Terramore.io is
              for educational and informational purposes only and should not be construed as professional advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <SchedulePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
