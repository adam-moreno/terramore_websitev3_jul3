"use client"

import { useState, useEffect } from "react"
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
  Search,
  Lightbulb,
  Zap,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Eye,
  MessageSquare,
  FileText,
  Cpu,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { IClosedPopup } from "@/components/iclosed-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useIClosedPopup } from "@/hooks/use-iclosed-popup"

export default function SolutionsPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isIClosedOpen, openPopup: openIClosed, closePopup: closeIClosed } = useIClosedPopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activePhase, setActivePhase] = useState("discovery")
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  
  // Fallback to ensure content is always visible
  const shouldShowContent = isVisible || animateCards

  // Animation effects - improved for reliable page load
  useEffect(() => {
    // Set visible immediately on mount
    setIsVisible(true)
    
    // Use requestAnimationFrame for better timing
    const animationFrame = requestAnimationFrame(() => {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setAnimateCards(true)
      }, 100)
    })
    
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  // Alternative approach: set both states immediately if the above doesn't work
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVisible) setIsVisible(true)
      if (!animateCards) setAnimateCards(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [isVisible, animateCards])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFooterNavigation = (href: string) => {
    window.location.href = href
  }

  const handlePhaseClick = (phaseId: string) => {
    setActivePhase(phaseId)
  }

  const handleDetailToggle = (detailId: string) => {
    setExpandedDetails(expandedDetails === detailId ? null : detailId)
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        /* CSS fallback to ensure content is visible */
        .animate-fallback {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
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
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 px-4 overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 ease-out animate-fallback ${
              shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Business Solutions That <span className="text-blue-400 animate-pulse">Scale</span>
          </h1>
          <p 
            className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 transition-all duration-1000 ease-out delay-300 animate-fallback ${
              shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Comprehensive business scaling solutions designed to transform your operations and accelerate growth.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-1000 ease-out delay-500 transform hover:scale-105 text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl"
            onClick={openIClosed}
          >
            I'M READY FOR OUTSIDE HELP
            <ArrowRight className="w-5 h-5 ml-2 animate-bounce" />
          </Button>
        </div>
      </div>

      {/* Solutions Grid - Updated with specific service names */}
      <div className="py-16 px-4 bg-white relative">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"
          style={{ opacity: Math.min(scrollY / 1000, 0.3) }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Solutions</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              Comprehensive business scaling solutions tailored to your specific needs and growth objectives.
            </p>
          </div>

          {/* Updated grid for better mobile experience - 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-1000 place-items-center animate-fallback ${
            shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Paid Advertising */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
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
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
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
            <p className="text-lg max-w-3xl mx-auto text-gray-600 mb-8">
              We follow a proven methodology to ensure your business transformation is successful and sustainable.
            </p>
            
                         {/* Phase Navigation */}
             <div className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-1000 delay-500 ${
               shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
             }`}>
              {[
                { id: "discovery", name: "Discovery", icon: Search, activeClass: "bg-blue-600 text-white shadow-lg", inactiveClass: "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200" },
                { id: "strategy", name: "Strategy", icon: Lightbulb, activeClass: "bg-purple-600 text-white shadow-lg", inactiveClass: "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200" },
                { id: "implementation", name: "Implementation", icon: Zap, activeClass: "bg-green-600 text-white shadow-lg", inactiveClass: "bg-white text-gray-600 hover:bg-green-50 border border-gray-200" },
                { id: "optimization", name: "Optimization", icon: BarChart3, activeClass: "bg-orange-600 text-white shadow-lg", inactiveClass: "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200" }
              ].map((phase) => (
                                 <button
                   key={phase.id}
                   onClick={() => handlePhaseClick(phase.id)}
                   className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                     activePhase === phase.id ? phase.activeClass : phase.inactiveClass
                   }`}
                 >
                  <phase.icon className="w-5 h-5" />
                  <span className="font-medium">{phase.name}</span>
                </button>
              ))}
            </div>
          </div>

                     {/* Interactive Phase Content */}
           <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-700 ease-in-out ${
             shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
           }`}>
                         {/* Discovery Phase */}
             {activePhase === "discovery" && (
               <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Discovery Phase</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We dive deep into your business to understand your current state, challenges, and opportunities for growth.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                     {/* Business Analysis */}
                   <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center mb-4">
                      <Eye className="w-6 h-6 text-blue-600 mr-3" />
                      <h4 className="font-semibold">Business Analysis</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Comprehensive analysis of your current business operations, revenue streams, and market position.
                    </p>
                                         <button
                       onClick={() => handleDetailToggle("business-analysis")}
                       className="text-blue-600 text-sm font-medium hover:underline transition-all duration-200 hover:text-blue-800"
                     >
                       {expandedDetails === "business-analysis" ? "Show Less" : "Learn More"}
                     </button>
                    {expandedDetails === "business-analysis" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Revenue model analysis</li>
                          <li>• Customer journey mapping</li>
                          <li>• Operational efficiency review</li>
                          <li>• Technology stack assessment</li>
                          <li>• Team structure evaluation</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Competitive Research */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Target className="w-6 h-6 text-blue-600 mr-3" />
                      <h4 className="font-semibold">Competitive Research</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      In-depth analysis of your competitors to identify gaps, opportunities, and differentiation strategies.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "competitive-research" ? null : "competitive-research")}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "competitive-research" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "competitive-research" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Competitor messaging analysis</li>
                          <li>• Pricing strategy comparison</li>
                          <li>• Marketing channel identification</li>
                          <li>• Customer pain point research</li>
                          <li>• Market positioning opportunities</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Market Research */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                      <h4 className="font-semibold">Market Research</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Data-driven market analysis to understand your target audience and market opportunities.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "market-research" ? null : "market-research")}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "market-research" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "market-research" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Target audience profiling</li>
                          <li>• Market size and growth potential</li>
                          <li>• Customer behavior analysis</li>
                          <li>• Industry trend identification</li>
                          <li>• Demand forecasting</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

                         {/* Strategy Phase */}
             {activePhase === "strategy" && (
               <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Strategy Phase</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We develop a comprehensive strategy that aligns with your business goals and market opportunities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Media Planning */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Megaphone className="w-6 h-6 text-purple-600 mr-3" />
                      <h4 className="font-semibold">Media Planning</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Strategic media planning across multiple channels to maximize reach and ROI.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "media-planning" ? null : "media-planning")}
                      className="text-purple-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "media-planning" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "media-planning" && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Channel mix optimization</li>
                          <li>• Budget allocation strategy</li>
                          <li>• Audience targeting parameters</li>
                          <li>• Creative asset planning</li>
                          <li>• Performance benchmarks</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Offer Development */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Award className="w-6 h-6 text-purple-600 mr-3" />
                      <h4 className="font-semibold">Offer Development</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Craft compelling offers that resonate with your target audience and drive conversions.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "offer-development" ? null : "offer-development")}
                      className="text-purple-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "offer-development" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "offer-development" && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Value proposition refinement</li>
                          <li>• Pricing strategy optimization</li>
                          <li>• Bundle and package design</li>
                          <li>• Risk reversal implementation</li>
                          <li>• Urgency and scarcity tactics</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Messaging Strategy */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="w-6 h-6 text-purple-600 mr-3" />
                      <h4 className="font-semibold">Messaging Strategy</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Develop compelling messaging that speaks directly to your audience's pain points and desires.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "messaging-strategy" ? null : "messaging-strategy")}
                      className="text-purple-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "messaging-strategy" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "messaging-strategy" && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Brand voice development</li>
                          <li>• Key message identification</li>
                          <li>• Pain point messaging</li>
                          <li>• Benefit-focused copywriting</li>
                          <li>• Multi-channel messaging consistency</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

                         {/* Implementation Phase */}
             {activePhase === "implementation" && (
               <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Implementation Phase</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We execute your strategy with precision, ensuring smooth implementation and minimal business disruption.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Content Strategy */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <FileText className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-semibold">Content Strategy</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Create and distribute valuable content that attracts, engages, and converts your target audience.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "content-strategy" ? null : "content-strategy")}
                      className="text-green-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "content-strategy" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "content-strategy" && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Content calendar development</li>
                          <li>• Blog and article creation</li>
                          <li>• Social media content planning</li>
                          <li>• Video and multimedia content</li>
                          <li>• SEO-optimized content creation</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Workflow Automation */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Cpu className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-semibold">Workflow Automation</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Streamline your business processes with intelligent automation that saves time and reduces errors.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "workflow-automation" ? null : "workflow-automation")}
                      className="text-green-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "workflow-automation" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "workflow-automation" && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Lead capture automation</li>
                          <li>• Email sequence setup</li>
                          <li>• CRM integration</li>
                          <li>• Task and reminder automation</li>
                          <li>• Reporting and analytics automation</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Campaign Launch */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Rocket className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-semibold">Campaign Launch</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Execute multi-channel campaigns with precision timing and coordinated messaging.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "campaign-launch" ? null : "campaign-launch")}
                      className="text-green-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "campaign-launch" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "campaign-launch" && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Multi-channel coordination</li>
                          <li>• A/B testing setup</li>
                          <li>• Performance tracking implementation</li>
                          <li>• Team training and onboarding</li>
                          <li>• Launch timeline management</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

                         {/* Optimization Phase */}
             {activePhase === "optimization" && (
               <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Optimization Phase</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We continuously monitor, analyze, and optimize your campaigns for maximum performance and ROI.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Performance Monitoring */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Eye className="w-6 h-6 text-orange-600 mr-3" />
                      <h4 className="font-semibold">Performance Monitoring</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Real-time monitoring of campaign performance with actionable insights and recommendations.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "performance-monitoring" ? null : "performance-monitoring")}
                      className="text-orange-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "performance-monitoring" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "performance-monitoring" && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Real-time dashboard monitoring</li>
                          <li>• KPI tracking and reporting</li>
                          <li>• Conversion rate analysis</li>
                          <li>• ROI calculation and optimization</li>
                          <li>• Alert system for performance issues</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Campaign Adjustments */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <RotateCcw className="w-6 h-6 text-orange-600 mr-3" />
                      <h4 className="font-semibold">Campaign Adjustments</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Agile campaign management with the ability to make real-time adjustments based on performance data.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "campaign-adjustments" ? null : "campaign-adjustments")}
                      className="text-orange-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "campaign-adjustments" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "campaign-adjustments" && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Budget reallocation strategies</li>
                          <li>• Creative optimization</li>
                          <li>• Targeting refinement</li>
                          <li>• Bid strategy adjustments</li>
                          <li>• Channel mix optimization</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Continuous Improvement */}
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <ArrowUpRight className="w-6 h-6 text-orange-600 mr-3" />
                      <h4 className="font-semibold">Continuous Improvement</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Ongoing optimization and scaling strategies to continuously improve results and grow your business.
                    </p>
                    <button
                      onClick={() => setExpandedDetails(expandedDetails === "continuous-improvement" ? null : "continuous-improvement")}
                      className="text-orange-600 text-sm font-medium hover:underline"
                    >
                      {expandedDetails === "continuous-improvement" ? "Show Less" : "Learn More"}
                    </button>
                    {expandedDetails === "continuous-improvement" && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• A/B testing optimization</li>
                          <li>• Scaling successful campaigns</li>
                          <li>• New channel exploration</li>
                          <li>• Technology stack upgrades</li>
                          <li>• Team skill development</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

                     {/* Interactive Demo CTA */}
           <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${
             shouldShowContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
           }`}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to See This Process in Action?</h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Get a personalized walkthrough of how we can apply this methodology to your specific business challenges.
              </p>
                             <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={openIClosed}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Schedule Demo
                  </Button>
                </div>
            </div>
          </div>
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
              <button
                onClick={() => handleFooterNavigation("/disclosure")}
                className="hover:text-blue-200 transition-colors text-sm cursor-pointer bg-transparent border-none text-white"
              >
                Disclosure
              </button>
              <button
                onClick={() => handleFooterNavigation("/dmca")}
                className="hover:text-blue-200 transition-colors text-sm cursor-pointer bg-transparent border-none text-white"
              >
                DMCA POLICY
              </button>
              <button
                onClick={openDoNotSell}
                className="hover:text-blue-200 transition-colors text-sm cursor-pointer bg-transparent border-none text-white"
              >
                Do Not Sell My Personal Information
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm leading-relaxed opacity-90 max-w-6xl mx-auto">
            <p>
              Results mentioned on this website are not typical and are not a guarantee of your success. Individual
              results will vary depending on education, effort, application, experience, and background. Due to the
              sensitivity of financial information, we do not track the typical results of our students. We cannot
              guarantee that you will make money or that you will be successful if you employ the business strategies
              discussed. Consequently, your results may significantly vary. We do not give investment, tax, or other
              professional advice. Specific transactions and experiences are mentioned for informational purposes only.
              The information contained within this website is the property of Terramore.io. Any use of the images,
              content, or ideas expressed herein without the express written consent of Terramore.io is prohibited.
              Copyright © 2025 Terramore.io, LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* iClosed Popup */}
      <IClosedPopup isOpen={isIClosedOpen} onClose={closeIClosed} />
      
      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
    </div>
  )
}
