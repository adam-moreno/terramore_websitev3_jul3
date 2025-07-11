"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { SchedulePopup } from "@/components/schedule-popup"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useState } from "react"

export default function TerramoreHomepage() {
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
                  The Foundation
                </Link>
                <Link
                  href="/courses/offers"
                  className="block text-gray-300 hover:text-blue-300 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Make It Real
                </Link>
                <Link
                  href="/courses/leads"
                  className="block text-gray-300 hover:text-blue-300 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Build to Grow
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

      {/* Hero Section */}
      <div className="relative py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Person Image */}
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-slate-500">Professional Image</span>
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                DO YOU WANT TO SCALE
                <br />
                <span className="text-slate-800">YOUR BUSINESS?</span>
              </h1>

              <p className="text-lg text-slate-700 mb-8 max-w-md mx-auto">
                Learn from the team that has scaled businesses to over $250m+ in annual revenue with AI-powered
                solutions.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                LEARN TO SCALE
              </Button>
            </div>

            {/* Right Person Image */}
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-slate-500">Professional Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Training Section */}
      <div className="py-8 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            <span className="text-blue-600">FREE</span> ADVANCED TRAINING
          </h2>
          <p className="text-lg text-slate-700 mb-12">
            Videos, eBooks, Guides, Templates, Downloads & more to help
            <br />
            you succeed.
          </p>

          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-16"></div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* The Foundation Course */}
            <Link href="/courses/scaling" className="group" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-red-500 hover:bg-red-600 w-fit">Brand New</Badge>
                  <div className="w-full h-32 bg-slate-200 rounded mb-4 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        THE FOUNDATION
                      </h3>
                      <p className="text-slate-600 text-sm">From Idea to Income (Beginner Essentials)</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Make It Real Course */}
            <Link href="/courses/offers" className="group" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-red-500 hover:bg-red-600 w-fit">It's Free</Badge>
                  <div className="w-full h-32 bg-slate-200 rounded mb-4 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">📈</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        MAKE IT REAL
                      </h3>
                      <p className="text-slate-600 text-sm">Monetization & Systems</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Build to Grow Course */}
            <Link href="/courses/leads" className="group" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-red-500 hover:bg-red-600 w-fit">It's Free</Badge>
                  <div className="w-full h-32 bg-slate-200 rounded mb-4 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        BUILD TO GROW
                      </h3>
                      <p className="text-slate-600 text-sm">Audience, Brand, and Legacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Scaling Workshop */}
            <Link href="/workshops" className="group" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-red-600 hover:bg-red-700 w-fit">Live In-Person</Badge>
                  <div className="w-full h-32 bg-slate-200 rounded mb-4 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-500 text-sm">Workshop Image</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        SCALING WORKSHOP
                      </h3>
                      <p className="text-slate-600 text-sm">Hands-on scaling strategies</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {/* The Foundation Course */}
            <Link href="/courses/scaling" className="group block" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="flex p-6">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-red-500 hover:bg-red-600 text-xs">Brand New</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      THE FOUNDATION
                    </h3>
                    <p className="text-slate-600 text-sm">From Idea to Income (Beginner Essentials)</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Make It Real Course */}
            <Link href="/courses/offers" className="group block" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="flex p-6">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-red-500 hover:bg-red-600 text-xs">It's Free</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      MAKE IT REAL
                    </h3>
                    <p className="text-slate-600 text-sm">Monetization & Systems</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Build to Grow Course */}
            <Link href="/courses/leads" className="group block" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="flex p-6">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-2xl">🧭</span>
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-red-500 hover:bg-red-600 text-xs">It's Free</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      BUILD TO GROW
                    </h3>
                    <p className="text-slate-600 text-sm">Audience, Brand, and Legacy</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Scaling Workshop */}
            <Link href="/workshops" className="group block" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="flex p-6">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-slate-500 text-xs text-center">Workshop</span>
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-red-600 hover:bg-red-700 text-xs">Live In-Person</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      SCALING WORKSHOP
                    </h3>
                    <p className="text-slate-600 text-sm">Hands-on scaling strategies</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Get answers to common questions about our programs and services</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What's the difference between your beginner and intermediate programs?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Our beginner programs are designed for businesses generating under $100K annually and focus on
                foundational marketing strategies, lead generation basics, and initial automation setup. Intermediate
                programs target businesses with $100K-$1M revenue, covering advanced scaling techniques, sophisticated
                marketing funnels, and comprehensive business systems.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                How much do your consulting services cost?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Our consulting packages range from $2,500/month for basic strategy consulting to $15,000/month for
                comprehensive done-with-you implementation. We also offer one-time strategy sessions starting at $500.
                All pricing depends on your business size, complexity, and specific needs. Schedule a free consultation
                to get a customized quote.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What marketing strategies do you specialize in?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We specialize in AI-powered marketing automation, multi-channel lead generation, conversion
                optimization, email marketing sequences, social media advertising, content marketing systems, and
                data-driven growth strategies. Our approach combines proven traditional methods with cutting-edge AI
                tools for maximum efficiency.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                How quickly can I expect to see results from your scaling programs?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Most clients see initial improvements within 30-60 days, with significant scaling results typically
                occurring within 3-6 months. However, timeline varies based on your starting point, industry,
                implementation speed, and market conditions. We provide realistic timelines during your initial
                consultation based on your specific situation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you offer one-on-one consulting or only group programs?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We offer both! Our group programs provide excellent value and peer learning opportunities, while our
                one-on-one consulting delivers personalized strategies tailored to your unique business challenges. Many
                clients start with group programs and upgrade to individual consulting as they scale.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What industries do you work with?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We work with service-based businesses, e-commerce companies, SaaS startups, professional services,
                coaches and consultants, real estate professionals, and B2B companies. Our strategies are adaptable
                across industries, though we specialize in businesses with high-value transactions and
                relationship-based sales.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Are your courses self-paced or do they have set schedules?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We offer both options. Our self-paced courses allow you to learn at your own speed with lifetime access
                to materials. Our live cohort programs follow set schedules with weekly group calls, accountability
                partners, and real-time feedback. Choose based on your learning style and availability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you provide ongoing support after completing a program?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Yes! All our programs include 90 days of email support after completion. We also have an exclusive
                alumni community, monthly Q&A calls for graduates, and optional ongoing coaching packages. Our goal is
                your long-term success, not just course completion.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What if I'm not making any money yet?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                I'd recommend starting with one of our FREE courses to identify where your customer journey is breaking
                down. Most early-stage businesses struggle with one of these key areas: building an audience (lead
                generation), finding the right target audience (market research and positioning), creating a compelling
                product or service offering, or converting prospects into paying customers. Our free courses will help
                you pinpoint exactly where you're getting stuck and provide actionable steps to fix it. Once you're
                generating consistent revenue, you can then focus on scaling strategies.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* About Our Funder Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">ABOUT OUR FOUNDER</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=400&width=400&text=Adam+Moreno"
                alt="Adam Moreno - Founder of Terramore.io"
                className="w-full max-w-md rounded-lg shadow-lg object-cover"
              />
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Adam Moreno is the founder and managing partner of Terramore.io. With over a decade of experience in
                corporate market research, Adam has worked directly with major digital and television platforms at
                leading companies including Kantar and Samba TV, where he specialized in comprehensive market insights
                and consumer behavior analysis across social media platforms.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                As a solutions and sales engineer, Adam has extensive experience in software sales, working with Fortune
                500 companies to develop automated audience targeting systems and real-time analytics dashboards. His
                expertise in brand lift insights and data-driven marketing strategies has helped major advertisers
                optimize their campaigns across traditional and streaming platforms.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Adam's technical background spans software engineering, data engineering, and full-stack development. He
                has built websites, mobile applications, and worked directly with social media platforms to create
                comprehensive marketing solutions. His mission at Terramore.io is to make advanced business education
                and AI-powered marketing strategies accessible to entrepreneurs and business owners looking to scale
                their operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Roadmap CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-6 md:p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get Your Custom Business Roadmap</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Receive a personalized step-by-step roadmap tailored to your business. This comprehensive guide includes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left max-w-2xl mx-auto px-4 md:px-0">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Custom growth strategy for your industry</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Revenue optimization opportunities</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Marketing automation recommendations</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">90-day implementation timeline</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-12 py-4 rounded-full text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full max-w-sm mx-auto"
            >
              Download Your Free Roadmap
            </Button>

            <p className="text-sm text-gray-500 mt-4">No spam, just actionable insights delivered to your inbox</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Logo and Main Navigation */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/images/terramore-logo-clean.png"
                alt="Terramore Logo"
                className="w-8 h-8 object-contain mr-3 filter brightness-0 invert"
              />
              <span className="text-xl font-bold">TERRAMORE.IO</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <button
                onClick={() => handleFooterNavigation("/workshops")}
                className="hover:text-blue-200 transition-colors text-lg cursor-pointer bg-transparent border-none text-white"
              >
                Workshops
              </button>
              <div className="relative group">
                <div className="flex items-center space-x-1 hover:text-blue-200 transition-colors cursor-pointer text-lg">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => handleFooterNavigation("/courses/scaling")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 bg-transparent border-none cursor-pointer"
                    >
                      The Foundation
                    </button>
                    <button
                      onClick={() => handleFooterNavigation("/courses/offers")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 bg-transparent border-none cursor-pointer"
                    >
                      Make It Real
                    </button>
                    <button
                      onClick={() => handleFooterNavigation("/courses/leads")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 bg-transparent border-none cursor-pointer"
                    >
                      Build to Grow
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleFooterNavigation("/solutions")}
                className="hover:text-blue-200 transition-colors text-lg cursor-pointer bg-transparent border-none text-white"
              >
                Solutions
              </button>
              <button
                onClick={() => handleFooterNavigation("/partner")}
                className="hover:text-blue-200 transition-colors text-lg cursor-pointer bg-transparent border-none text-white"
              >
                Partner With Us
              </button>
              <button
                onClick={() => handleFooterNavigation("/about")}
                className="hover:text-blue-200 transition-colors text-lg cursor-pointer bg-transparent border-none text-white"
              >
                About the Firm
              </button>
              <button
                onClick={() => handleFooterNavigation("/resources")}
                className="hover:text-blue-200 transition-colors text-lg cursor-pointer bg-transparent border-none text-white"
              >
                Resources
              </button>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button
                onClick={() => handleFooterNavigation("/privacy")}
                className="hover:text-blue-200 transition-colors text-sm cursor-pointer bg-transparent border-none text-white"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleFooterNavigation("/terms")}
                className="hover:text-blue-200 transition-colors text-sm cursor-pointer bg-transparent border-none text-white"
              >
                Terms of Service
              </button>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Disclosure</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">DMCA POLICY</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Do Not Sell My Info</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm leading-relaxed opacity-90 max-w-6xl mx-auto">
            <p>
              Adam Moreno's results are not typical and are not a guarantee of your success. Adam Moreno is an
              experienced business owner and consultant, and your results will vary depending on education, effort,
              application, experience, and background. Adam Moreno does not personally invest in every business he works
              with through Terramore.io, LLC. Due to the sensitivity of financial information, we do not track the
              typical results of our students. We cannot guarantee that you will make money or that you will be
              successful if you employ his business strategies specifically or generally. Consequently, your results may
              significantly vary from his. We do not give investment, tax, or other professional advice. Specific
              transactions and experiences are mentioned for informational purposes only. The information contained
              within this website is the property of Terramore.io. Any use of the images, content, or ideas expressed
              herein without the express written consent of Terramore.io is prohibited. Copyright © 2025 Terramore.io,
              LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* Schedule Popup */}
      <SchedulePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
