"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu, ArrowRight } from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { FounderPhotoCarousel } from "@/components/founder-photo-carousel"

export default function AboutPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const founderPhotos = [
    {
      src: "https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_auto/v1752608693/adam-moreno-profile-new_jb3lr7.jpg",
      alt: "Adam Moreno - Professional Headshot",
      description: "Adam Moreno, Founder & CEO of Terramore.io"
    },
    {
      src: "https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_auto/v1752608693/adam-moreno-profile-new_jb3lr7.jpg",
      alt: "Adam Moreno - Business Portrait",
      description: "Leading business strategist and entrepreneur"
    },
    {
      src: "https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_auto/v1752608693/adam-moreno-profile-new_jb3lr7.jpg",
      alt: "Adam Moreno - Executive Photo",
      description: "Expert in marketing automation and growth strategies"
    }
  ]

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
              <Link href="/about" className="text-blue-300 transition-colors">
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
          <div className="lg:hidden mt-4 px-4 py-2 bg-slate-800 rounded-md">
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <div className="flex items-center space-x-1 text-white hover:text-blue-300 transition-colors py-2">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="pl-4 mt-1 space-y-2">
                  <Link href="/courses/scaling" className="block text-gray-300 hover:text-blue-300">
                    Scaling
                  </Link>
                  <Link href="/courses/offers" className="block text-gray-300 hover:text-blue-300">
                    Offers
                  </Link>
                  <Link href="/courses/leads" className="block text-gray-300 hover:text-blue-300">
                    Leads
                  </Link>
                </div>
              </div>
              <Link href="/solutions" className="text-white hover:text-blue-300 transition-colors py-2">
                Solutions
              </Link>
              <Link href="/partner" className="text-white hover:text-blue-300 transition-colors py-2">
                Partner With Us
              </Link>
              <Link href="/about" className="text-blue-300 transition-colors py-2">
                About the Firm
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Increased height to match other pages */}
      <div className="bg-slate-900 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Learn about our mission, values, and the team behind Terramore.io's success in helping businesses scale.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-lg md:text-xl max-w-4xl mx-auto text-gray-600 leading-relaxed">
            At Terramore.io, we're dedicated to helping businesses break through growth barriers and achieve sustainable
            scaling. We believe every business has the potential to reach new heights with the right systems,
            strategies, and support.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              These core principles guide everything we do and shape how we serve our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Results-Driven</h3>
              <p className="text-gray-600">
                We focus on delivering measurable outcomes that directly impact your bottom line and business growth.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Partnership</h3>
              <p className="text-gray-600">
                We work alongside you as true partners, invested in your success and committed to your long-term growth.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of industry trends and leverage cutting-edge strategies to give you a competitive
                advantage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Our Founder Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">ABOUT OUR FOUNDER</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Photo Carousel */}
            <div className="flex justify-center">
              <FounderPhotoCarousel 
                photos={founderPhotos}
                autoRotate={true}
                rotationInterval={6000}
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

      {/* Stats Section */}
      <div className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Numbers that showcase the real results we've delivered for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg">Businesses Scaled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">$1M+</div>
              <div className="text-lg">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-lg">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">3x</div>
              <div className="text-lg">Average Growth Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Scale Your Business?</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 mb-8">
            Join hundreds of successful businesses that have transformed their operations and achieved sustainable
            growth with our proven methodologies.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsPopupOpen(true)}>
            Schedule Your Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
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
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/resources" className="text-gray-400 hover:text-white transition-colors">
                    Free Resources
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-gray-400 hover:text-white transition-colors">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
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
                  <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Terramore.io. All rights reserved.</p>
            <p className="text-gray-500 text-xs mt-4 max-w-3xl mx-auto">
              Terramore.io is owned and operated by Adam Moreno. Results mentioned are not typical or guaranteed.
              Individual results will vary based on your business, implementation, and market conditions.
            </p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
