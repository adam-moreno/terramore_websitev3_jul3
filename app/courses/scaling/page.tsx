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
import { DoNotSellPopup } from "@/components/do-not-sell-popup"

export default function ScalingCoursePage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(0)
  const [isModulesOpen, setIsModulesOpen] = useState(false)

  const videos = [
    { title: "Start Here – Your Guide to Making Your First Dollar", duration: "12:34" },
    { title: "The Modern Entrepreneur's Mindset – Avoiding Analysis Paralysis", duration: "15:22" },
    { title: "Finding the Right Niche – Solving Real Problems", duration: "18:45" },
    { title: "Offer Building 101 – Value > Product", duration: "14:12" },
    { title: "MVPs and Service Simplicity – Launch Without Perfection", duration: "16:33" },
    { title: "Getting Your First Client – Warm Outreach and Local Networks", duration: "19:28" },
    { title: "Money-Making Platforms – Which Tools Make You Profitable Fast?", duration: "13:56" },
    { title: "How to Price When You're Just Starting", duration: "11:47" },
    { title: "Delivering Results (Even If You're New)", duration: "17:15" },
    { title: "Tracking Progress & Feedback Loops", duration: "12:08" },
    { title: "BONUS: How I'd Make $1K in 7 Days From Scratch – Real-World Scenario Breakdown", duration: "25:43" },
  ]

  const handleFooterNavigation = (href: string) => {
    window.location.href = href
  }

  const handleCourseSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const company = formData.get('company') as string

    try {
      const response = await fetch('/api/course-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          courseType: 'scaling',
          signupSource: 'scaling_course_page'
        }),
      })

      if (response.ok) {
        alert('Thank you! You\'ve been successfully signed up for course updates.')
        ;(e.target as HTMLFormElement).reset()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to sign up. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Something went wrong. Please try again.')
    }
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
                <div className="flex items-center space-x-1 text-blue-300 transition-colors cursor-pointer">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/courses/scaling" className="block px-4 py-2 text-gray-800 bg-blue-50 text-blue-600">
                      The Foundation
                    </Link>
                    <Link
                      href="/courses/offers"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Make It Real
                    </Link>
                    <Link
                      href="/courses/leads"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
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
        <div className="bg-white text-center py-12 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Foundation</h1>
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
          >
            CHECK WORKSHOP DATES
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
            <h2 className="text-lg font-bold text-gray-900 mb-2">🚀 The Foundation – From Idea to Income</h2>
            <p className="text-sm text-gray-600 mb-4">(Beginner Essentials)</p>
            <p className="text-sm text-gray-600">
              Transform your business idea into your first profitable dollar online with proven strategies and
              actionable steps.
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
                  "Welcome to The Foundation course! This video will guide you through the entire course structure and help you understand how to make your first dollar online. We'll cover the mindset, tools, and strategies you need to go from idea to income."}
                {selectedVideo === 1 &&
                  "Develop the right entrepreneurial mindset to overcome analysis paralysis and take action. Learn how successful entrepreneurs think differently and how to build confidence in your business decisions."}
                {selectedVideo === 2 &&
                  "Discover how to identify profitable niches by solving real problems. We'll show you research techniques to validate your ideas and find markets with genuine demand."}
                {selectedVideo === 3 &&
                  "Learn the fundamentals of creating valuable offers that customers actually want to buy. Focus on value creation over product features to build compelling propositions."}
                {selectedVideo === 4 &&
                  "Master the art of launching without perfection using MVPs and simple service models. Get to market quickly and iterate based on real customer feedback."}
                {selectedVideo === 5 &&
                  "Proven strategies for acquiring your first clients through warm outreach and local networking. Build relationships that convert into paying customers."}
                {selectedVideo === 6 &&
                  "Compare different platforms and tools to find the ones that will make you profitable fastest. Focus on revenue-generating activities from day one."}
                {selectedVideo === 7 &&
                  "Learn pricing psychology and strategies for new businesses. Price confidently even when you're just starting out and don't have extensive experience."}
                {selectedVideo === 8 &&
                  "Deliver exceptional results to your first clients even if you're new to the industry. Build systems for consistent quality and customer satisfaction."}
                {selectedVideo === 9 &&
                  "Set up tracking systems and feedback loops to measure progress and continuously improve your business operations and customer experience."}
                {selectedVideo === 10 &&
                  "BONUS: A complete real-world breakdown of how to make $1,000 in 7 days starting from scratch. Step-by-step scenario with actual tactics and timelines."}
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

            <form className="space-y-4" onSubmit={handleCourseSignup}>
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
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
                  name="lastName"
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
                  name="email"
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
                  name="phone"
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
                  name="company"
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
