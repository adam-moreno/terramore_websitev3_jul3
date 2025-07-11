"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Cookie,
  ChevronDown,
  Menu,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Award,
  Mail,
  Megaphone,
  Globe,
  Palette,
  Camera,
  Rocket,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { SchedulePopup } from "@/components/schedule-popup"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"

export default function SolutionsPage() {
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
              <Link href="/solutions" className="text-blue-300 transition-colors">
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
          <div className="lg:hidden mt-4 px-4 py-2 bg-slate-800 rounded-md">
            <div className="flex flex-col space-y-3">
              <Link href="/workshops" className="text-white hover:text-blue-300 transition-colors py-2">
                Workshops
              </Link>
              <div className="relative">
                <div className="flex items-center space-x-1 text-white hover:text-blue-300 transition-colors py-2">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="pl-4 mt-1 space-y-2">
                  <Link href="/courses/scaling" className="block text-gray-300 hover:text-blue-300">
                    The Foundation
                  </Link>
                  <Link href="/courses/offers" className="block text-gray-300 hover:text-blue-300">
                    Make It Real
                  </Link>
                  <Link href="/courses/leads" className="block text-gray-300 hover:text-blue-300">
                    Build to Grow
                  </Link>
                </div>
              </div>
              <Link href="/solutions" className="text-blue-300 transition-colors py-2">
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

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Business Solutions That <span className="text-blue-400">Scale</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Comprehensive business scaling solutions designed to transform your operations and accelerate growth.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsPopupOpen(true)}>
            Start My Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Solutions Grid - Updated with specific service names */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Solutions</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              Comprehensive business scaling solutions tailored to your specific needs and growth objectives.
            </p>
          </div>

          {/* Updated grid for better mobile experience - 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Paid Advertising */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Paid Advertising</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Strategic paid advertising campaigns that maximize ROI and drive qualified leads.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Google Ads</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Facebook Ads</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>LinkedIn Ads</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Social Media</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Build and engage your audience across all major social media platforms.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Content Strategy</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Community Management</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Analytics & Reporting</span>
                </li>
              </ul>
            </div>

            {/* Public Relations */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Megaphone className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Public Relations</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Build brand awareness and credibility through strategic PR campaigns.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Media Outreach</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Press Releases</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Crisis Management</span>
                </li>
              </ul>
            </div>

            {/* Automations */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Automations</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Streamline your business processes with intelligent automation systems.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Workflow Automation</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>CRM Integration</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Lead Nurturing</span>
                </li>
              </ul>
            </div>

            {/* Digital Marketing */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Digital Marketing</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Comprehensive digital marketing strategies that drive growth and engagement.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>SEO Optimization</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Content Marketing</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Analytics & Tracking</span>
                </li>
              </ul>
            </div>

            {/* Website */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Website</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Professional websites that convert visitors into customers and drive business growth.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Custom Design</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Mobile Responsive</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Conversion Optimization</span>
                </li>
              </ul>
            </div>

            {/* Influencer Marketing */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Influencer Marketing</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Connect with the right influencers to amplify your brand and reach new audiences.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Influencer Outreach</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Campaign Management</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Performance Tracking</span>
                </li>
              </ul>
            </div>

            {/* Graphic Design */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Palette className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Graphic Design</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Professional graphic design that captures your brand essence and engages your audience.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Logo Design</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Marketing Materials</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Social Media Graphics</span>
                </li>
              </ul>
            </div>

            {/* Email Marketing */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Email Marketing</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Strategic email campaigns that nurture leads and drive conversions at scale.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Email Sequences</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>List Building</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>A/B Testing</span>
                </li>
              </ul>
            </div>

            {/* Branding */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Branding</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Develop a strong brand identity that resonates with your target audience and stands out.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Brand Strategy</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Visual Identity</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Brand Guidelines</span>
                </li>
              </ul>
            </div>

            {/* Launch Campaign */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Launch Campaign</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                Comprehensive launch campaigns that create buzz and drive immediate results.
              </p>
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Pre-Launch Strategy</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Multi-Channel Campaigns</span>
                </li>
                <li className="flex items-center text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Performance Optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How Terramore Works Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Terramore Works</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              We follow a proven methodology to ensure your business transformation is successful and sustainable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Discovery</h3>
              <p className="text-gray-600 text-sm">
                We analyze your current business state and identify growth opportunities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Strategy</h3>
              <p className="text-gray-600 text-sm">We develop a customized strategy tailored to your specific needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Implementation</h3>
              <p className="text-gray-600 text-sm">We execute the plan systematically with minimal disruption.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Optimization</h3>
              <p className="text-gray-600 text-sm">We continuously monitor and optimize for maximum results.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Scale Your Business?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Get a custom solution designed specifically for your business challenges and growth goals.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setIsPopupOpen(true)}>
            Start My Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer - Same as homepage */}
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
