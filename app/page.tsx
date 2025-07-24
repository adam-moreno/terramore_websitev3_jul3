"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { IClosedPopup } from "@/components/iclosed-popup"
import { RoadmapModal } from "@/components/roadmap-modal"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { FreeCoursesPopup } from "@/components/free-courses-popup"
import { FounderPhotoCarousel } from "@/components/founder-photo-carousel"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useIClosedPopup } from "@/hooks/use-iclosed-popup"
import { useRoadmapModal } from "@/hooks/use-roadmap-modal"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { useFreeCoursesPopup } from "@/hooks/use-free-courses-popup"
import { useEffect, useState } from "react"
import "@/styles/fadeInUp.css"
import { Logo } from "@/components/logo"

export default function TerramoreHomepage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isIClosedOpen, openPopup: openIClosed, closePopup: closeIClosed } = useIClosedPopup()
  const { isOpen: isRoadmapOpen, setIsOpen: setIsRoadmapOpen } = useRoadmapModal()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const { isOpen: isFreeCoursesOpen, openPopup: openFreeCourses, closePopup: closeFreeCourses } = useFreeCoursesPopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showAllFAQs, setShowAllFAQs] = useState(false)

  // Founder photos for the carousel
  const founderPhotos = [
    {
      src: "https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto/v1752608693/adam-moreno-profile-new_jb3lr7.jpg",
      alt: "Adam Moreno - Professional headshot",
      description: "Adam Moreno, Founder of Terramore.io",
      orientation: "portrait" as const
    },
    {
      src: "https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto/v1752637614/IMG_3975_ljqyww.jpg",
      alt: "Adam Moreno - Professional photo",
      description: "Adam Moreno, Business Consultant",
      orientation: "portrait" as const
    },
    {
      src: "https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto,w_800,h_600,c_fill,g_north,fl_force_strip/v1752637620/IMG_1209_qooehx.heic",
      alt: "Adam Moreno - Portrait",
      description: "Team Terramore - Building scalable business solutions",
      orientation: "landscape" as const
    }
  ]

  const flashCards = [
    {
      audience: "Brand Building",
      color: "bg-purple-500",
      content: "Struggling to stand out from your competition? Our team of expert web designers, sales closers, and content creators work together to make your business the obvious choice and drive consistent profits."
    },
    {
      audience: "Entrepreneur making no money",
      color: "bg-orange-500",
      content: "Struggling to make your first dollar still? We can help you identify your first profitable product, create compelling offers, build your website, and establish your first revenue stream from scratch."
    },
    {
      audience: "Established Service Business",
      color: "bg-teal-500",
      content: "Want to build a bigger following? Let's scale your audience with proven content strategies and engagement frameworks that turn followers into customers."
    },
    {
      audience: "Analytics Confusion",
      color: "bg-blue-600",
      content: "Don't understand your customer analytics? Our team will help diagnose opportunities using your current data from social media, app analytics, and website metrics that you may not know you have."
    },
    {
      audience: "Content Creator",
      color: "bg-green-500",
      content: "Struggling with views on your content? We help you create viral-worthy content that gets seen, shared, and drives real business results."
    },
    {
      audience: "Website Owner",
      color: "bg-indigo-500",
      content: "Can't get conversions to your website? We implement conversion optimization strategies that turn your traffic into paying customers."
    },
    {
      audience: "Digital Product Creator",
      color: "bg-pink-500",
      content: "See others making money through digital products? We'll help you create, launch, and scale digital products that generate passive income."
    },
    {
      audience: "Tech Startup",
      color: "bg-cyan-500",
      content: "Need to validate your product idea? We help you build MVPs, test market demand, and iterate quickly to find product-market fit."
    },
    {
      audience: "Scale-Up Company",
      color: "bg-amber-500",
      content: "Ready to take your business to the next level? We implement scalable systems and processes that support rapid growth without breaking."
    },
    {
      audience: "E-commerce Business",
      color: "bg-emerald-500",
      content: "Struggling with cart abandonment? We optimize your entire customer journey to increase conversions and average order value."
    },
    {
      audience: "Personal Brand",
      color: "bg-violet-500",
      content: "Want to become an industry authority? We help you build thought leadership through strategic content and speaking opportunities."
    },
    {
      audience: "Ambitious Founder",
      color: "bg-lime-500",
      content: "Looking to increase revenue flows? We implement proven strategies to diversify income streams and maximize profitability."
    },
    {
      audience: "HVAC Company",
      color: "bg-orange-500",
      content: "Struggling to get consistent service calls? We help you implement lead generation systems that bring in qualified customers year-round, not just during peak seasons."
    },
    {
      audience: "Law Firm",
      color: "bg-slate-600",
      content: "Tired of competing on price alone? We help you build a premium brand that attracts high-value clients willing to pay premium rates for your expertise."
    },
    {
      audience: "Financial Advisor",
      color: "bg-emerald-500",
      content: "Finding it hard to build trust with prospects? We create content strategies that establish your authority and attract qualified clients."
    },
    {
      audience: "I sell a course",
      color: "bg-purple-600",
      content: "Struggling to get students to buy your course? We help you create compelling course launches, build an engaged audience, and implement proven sales strategies that convert."
    },
    {
      audience: "Ready to Scale",
      color: "bg-purple-600",
      content: "Ready to take your business to the next level? We implement scalable frameworks that power marketing, automation, and growth."
    },
    {
      audience: "Business with Poor Website",
      color: "bg-amber-500",
      content: "Your website sucks and it's costing you customers? Our expert web designers build trust-worthy, conversion-focused websites that turn visitors into paying customers."
    },
    {
      audience: "Working Just to Stay Afloat",
      color: "bg-blue-500",
      content: "You have some clients, seen money come in, but feel like you're working just to keep it afloat? Our team of software engineers and AI specialists will build automations that give you back your time and freedom."
    }
  ]

  useEffect(() => {
    if (isHovering) return // Pause timer when hovering

    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashCards.length)
    }, 6500) // Change every 6.5 seconds (increased by 1.5 seconds)

    return () => clearInterval(interval)
  }, [flashCards.length, isHovering])

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashCards.length)
    }
    if (isRightSwipe) {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashCards.length) % flashCards.length)
    }
  }

  const handleFooterNavigation = (href: string) => {
    window.location.href = href
  }

  // Animation keyframes for fade-in-up
  const fadeInUp = {
    from: { opacity: 0, transform: 'translateY(24px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
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
              {/* <Link href="/workshops" className="hover:text-blue-300 transition-colors">
                Workshops
              </Link> */}
              <div className="relative group">
                <div className="flex items-center space-x-1 hover:text-blue-300 transition-colors cursor-pointer">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-100 z-50">
                  <div className="py-2">
                    <Link
                      href="/courses/scaling"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      The Foundation
                    </Link>
                    <Link
                      href="/courses/offers"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Make It Real
                    </Link>
                    <Link
                      href="/courses/leads"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-800 text-white py-4 px-6 border-t border-slate-700">
          <div className="flex flex-col space-y-4">
            {/* <Link
              href="/workshops"
              className="hover:text-blue-300 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workshops
            </Link> */}
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
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-16">
            {/* Left Person Image */}
            <div className="hidden lg:flex flex-shrink-0 absolute left-0 top-1/2 -translate-y-1/2">
              <div className="w-56 h-96 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto,w_600,h_900,c_fill,g_north,e_enhance:20,e_sharpen:30,fl_force_strip/v1752637525/IMG_4094_cbdtly.jpg"
                  alt="Adam Moreno - Professional headshot"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center w-full lg:max-w-4xl mx-auto px-2">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight uppercase">
                WHY IS YOUR<br />BUSINESS STUCK?
              </h1>
              
              {/* Video Placeholder - Mobile Only */}
              <div className="mb-8 lg:hidden">
                <div className="w-full max-w-2xl mx-auto bg-slate-200 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Video Placeholder
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-lg md:text-xl lg:text-2xl font-medium text-slate-700 mb-8 max-w-2xl mx-auto">
                <span className="block">
                  Learn from a team that's spent 10+ years building scalable frameworks that power marketing, automation, and growth.
                </span>
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={openIClosed}
                >
                  I'M READY FOR CHANGE
                </Button>
              </div>
            </div>

            {/* Right Video Placeholder */}
            <div className="hidden lg:flex flex-shrink-0 absolute right-0 top-1/2 -translate-y-1/2">
              <div className="w-56 h-96 bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Video Placeholder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Flashcard Section */}
      <div className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="relative min-h-[300px] md:min-h-[400px] overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {flashCards.map((card, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out px-4 ${
                  index === currentCardIndex
                    ? 'opacity-100 transform translate-x-0'
                    : index < currentCardIndex
                    ? 'opacity-0 transform -translate-x-full'
                    : 'opacity-0 transform translate-x-full'
                }`}
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-12 border border-gray-100 relative transform transition-all duration-300 hover:shadow-xl cursor-pointer w-full max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                  <div className={`absolute top-4 left-4 ${card.color} text-white px-3 py-1 rounded-md text-sm font-medium`}>
                    {card.audience}
                  </div>
                  <div className="pt-8">
                    <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed">
                      <span className="text-slate-900 block mb-4">
                        {card.content.split('?')[0]}?
                      </span>
                      <span className="text-slate-700 block">
                        {card.content.split('?')[1]}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {flashCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentCardIndex ? 'bg-blue-600 w-6' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          
          {/* Mobile swipe indicator */}
          <div className="md:hidden text-center mt-4">
            <p className="text-sm text-slate-500">
              ← Swipe to navigate →
            </p>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Free Courses Notification Banner */}
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            onClick={openFreeCourses}
          >
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🎉</span>
                <h3 className="text-xl font-bold">FREE Courses Coming by End of August!</h3>
              </div>
              <p className="text-blue-100 text-lg">
                Click here to sign up for email notifications when new course videos are uploaded!
              </p>
            </div>
          </div>
          
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Free Courses to Transform Your Business
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Learn marketing, sales, and automation strategies that help you grow your audience and serve your customers better
            </p>
          </div>
          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* The Foundation Course */}
            <Link href="/courses/scaling" className="group">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-green-500 hover:bg-green-600 w-fit">🚀 Launch Your Business</Badge>
                  <div className="w-full h-24 mb-4 flex items-center justify-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:text-green-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        THE FOUNDATION
                      </h3>
                      <p className="text-slate-600 text-sm mb-6">From Idea to Income (Beginner Essentials)</p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                      Take This Course
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Make It Real Course */}
            <Link href="/courses/offers" className="group">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-purple-500 hover:bg-purple-600 w-fit">⚡ Scale Your Systems</Badge>
                  <div className="w-full h-24 mb-4 flex items-center justify-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        MAKE IT REAL
                      </h3>
                      <p className="text-slate-600 text-sm mb-6">Struggling with consistency, client processes, or strategy.</p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                      Take This Course
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Build to Grow Course */}
            <Link href="/courses/leads" className="group">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-80">
                <div className="p-6 h-full flex flex-col">
                  <Badge className="mb-4 bg-orange-500 hover:bg-orange-600 w-fit">🌟 Build Your Legacy</Badge>
                  <div className="w-full h-24 mb-4 flex items-center justify-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect x="4" y="8" width="16" height="10" rx="5" fill="currentColor"/>
                        <rect x="9" y="18" width="6" height="2" rx="1" fill="currentColor"/>
                        <circle cx="8.5" cy="13" r="1" fill="white"/>
                        <circle cx="15.5" cy="13" r="1" fill="white"/>
                        <rect x="11" y="4" width="2" height="4" rx="1" fill="currentColor"/>
                        <circle cx="7" cy="7" r="1" fill="currentColor"/>
                        <circle cx="17" cy="7" r="1" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        BUILD TO GROW
                      </h3>
                      <p className="text-slate-600 text-sm mb-6">Reduce your workload, automate lead gen, and tighten operations.</p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                      Take This Course
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Scaling Workshop */}
            <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden h-80 relative">
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700 w-fit">Coming Soon</Badge>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      SCALING WORKSHOP
                    </h3>
                    <p className="text-slate-600 text-sm mb-6">Live In-Person Training</p>
                  </div>
                  <Button className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold shadow-lg transition-all cursor-not-allowed">
                    Coming Soon
                  </Button>
                </div>
              </div>
              {/* Diagonal overlay */}
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[100px] border-t-[100px] border-l-blue-600 border-t-transparent opacity-20"></div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {/* The Foundation Course */}
            <Link href="/courses/scaling" className="group block">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <Badge className="mb-4 bg-green-500 hover:bg-green-600 w-fit">🚀 Launch Your Business</Badge>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    THE FOUNDATION
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">From Idea to Income (Beginner Essentials)</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    Take This Course
                  </Button>
                </div>
              </div>
            </Link>

            {/* Make It Real Course */}
            <Link href="/courses/offers" className="group block">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <Badge className="mb-4 bg-purple-500 hover:bg-purple-600 w-fit">⚡ Scale Your Systems</Badge>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    MAKE IT REAL
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">Struggling with consistency, client processes, or strategy.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    Take This Course
                  </Button>
                </div>
              </div>
            </Link>

            {/* Build to Grow Course */}
            <Link href="/courses/leads" className="group block">
              <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <Badge className="mb-4 bg-orange-500 hover:bg-orange-600 w-fit">🌟 Build Your Legacy</Badge>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    BUILD TO GROW
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">Teach high-revenue service providers how to reduce their workload, automate lead gen, and tighten operations.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    Take This Course
                  </Button>
                </div>
              </div>
            </Link>

            {/* Scaling Workshop */}
            <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden relative">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="flex-1">
                    <Badge className="mb-2 bg-blue-600 hover:bg-blue-700 text-xs">Coming Soon</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      SCALING WORKSHOP
                    </h3>
                    <p className="text-slate-600 text-sm">Live In-Person Training</p>
                  </div>
                </div>
                <Button className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold shadow-lg transition-all cursor-not-allowed">
                  Coming Soon
                </Button>
              </div>
              {/* Diagonal overlay */}
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[80px] border-t-[80px] border-l-blue-600 border-t-transparent opacity-20"></div>
            </div>
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
            {/* First 5 FAQs - Always visible */}
            <AccordionItem value="item-1" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                How much do your services cost?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We offer multiple pricing models to fit your business stage and budget:
                <br /><br />
                <strong>Free Resources:</strong> Start with our free courses and content to build your foundation
                <br /><br />
                <strong>Beginner Package:</strong> Perfect for businesses ready to invest in growth ($2,000+)
                <br /><br />
                <strong>Scale-Up Services:</strong> Comprehensive systems and automation ($5,000-$15,000+)
                <br /><br />
                <strong>Performance-Based:</strong> Commission models for businesses with proven revenue
                <br /><br />
                <strong>Monthly Retainers:</strong> Ongoing support and optimization
                <br /><br />
                We work with businesses for 6-12 months depending on your needs. Many clients start with just $500 upfront and pay the rest as they grow.
                <br /><br />
                ➡️ <button onClick={openIClosed} className="text-blue-600 hover:text-blue-800 underline font-medium">See where you fit and book a strategy call to discuss your options.</button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What's included in your beginner package?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Our beginner package includes everything you need to get started:
                <br /><br />
                • Offer creation and positioning<br />
                • One custom landing page or funnel<br />
                • Up to 5 automations (lead capture, nurture, onboarding, etc.)<br />
                • A tailored 30-day growth plan<br />
                • Content strategy roadmap<br />
                • Onboarding + system documentation<br /><br />
                This is perfect for early-stage businesses ready to build their foundation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Can I work with you on a performance or commission-based model?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Yes—if you have an offer with clear revenue potential or traction, we'll consider hybrid deals that combine a reduced upfront cost with performance-based commission structures.
                <br /><br />
                ➡️ <button onClick={openIClosed} className="text-blue-600 hover:text-blue-800 underline font-medium">Submit a short application or schedule a call to explore eligibility.</button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                I don't have a product, website, or audience. Can you still help?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Absolutely. We specialize in helping early-stage entrepreneurs build from scratch—whether it's crafting your first offer, setting up lead capture, or designing your first sales page.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you help with content and branding?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Yes—we provide full content strategy, assist with campaign planning, and source influencers or creators when needed. We also help with visual identity and messaging to ensure everything aligns with your goals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you run ads or manage paid campaigns?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We offer complete media planning and ad management, including funnel design, creative direction, and daily optimization for platforms like Meta, Google, and YouTube. Your media budget and goals will shape the strategy we recommend.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What kind of automations do you build?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We build scalable automations that reduce your workload and boost conversions—everything from CRM integrations to email/SMS workflows, onboarding systems, and client retention sequences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you offer salespeople or closers?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We do provide appointment setters and closers when the foundation is in place. That said, we focus first on making sure your offer, funnel, and lead flow are ready—because no closer can fix a broken system.
                <br /><br />
                ➡️ <button onClick={openIClosed} className="text-blue-600 hover:text-blue-800 underline font-medium">If your offer is strong and you're ready for scale, we'll plug in sales support.</button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Can you help me grow my audience or brand?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Yes—we support brand awareness through influencer marketing, social campaigns, and paid reach strategies. We help you get seen by the right people using modern, conversion-friendly tactics.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you work with businesses that are already earning revenue?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We work with companies from pre-revenue up to $100K+ per month. For those already earning, we focus on scaling infrastructure, automation, and freeing up your time through operational systems.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                How soon can I expect results?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Most clients start to see measurable results within 30–45 days, especially if they follow our rollout plan. We work with businesses typically anywhere from 6-12 months depending on how much help they need and which pricing model they choose. Timelines vary based on offer, niche, and how quickly you're able to implement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                How do you increase sales for service businesses?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We don't just plug in ads or build funnels—we look at the entire sales system: offer structure, messaging, pipeline flow, lead nurture, and conversion points. Then we optimize or automate wherever possible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Can you help me launch a digital product?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Yes—we help package your expertise into digital products (courses, toolkits, subscriptions), and then build and market your funnel to support it from pre-launch to scale.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What if I have more questions or don't know where I fit?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                No problem—many founders aren't sure where they stand. That's what we're here for.
                <br /><br />
                ➡️ <button onClick={openIClosed} className="text-blue-600 hover:text-blue-800 underline font-medium">Book a free strategy call and we'll help you assess your next best step—no pressure, just clarity.</button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                What makes your team different from other marketing agencies?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                We're a group of web developers, software engineers, and data scientists who focus on the consumer journey. Stop worrying about the product, and start worrying about how your audience is perceiving your service/brand/business. We build the technical infrastructure and data systems that power successful customer experiences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-16" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Do you provide analytics and data insights?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Yes—our data scientists build comprehensive analytics dashboards that track customer behavior, conversion funnels, and business performance. We provide actionable insights that help you understand your audience better and optimize your customer journey for maximum results.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-17" className="bg-white rounded-lg px-6 border border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                Can you build backends for websites and mobile apps?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-2">
                Absolutely. Our software engineers build robust backends for both websites and mobile apps, including apps for the Apple App Store and Google Play Store. We handle everything from API development and database design to server infrastructure and app store optimization.
              </AccordionContent>
            </AccordionItem>

            {/* Additional FAQs - Show only when showAllFAQs is true */}
                          {showAllFAQs && (
                <>
                  <AccordionItem value="item-6" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Do you run ads or manage paid campaigns?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We offer complete media planning and ad management, including funnel design, creative direction, and daily optimization for platforms like Meta, Google, and YouTube. Your media budget and goals will shape the strategy we recommend.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      What kind of automations do you build?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We build scalable automations that reduce your workload and boost conversions—everything from CRM integrations to email/SMS workflows, onboarding systems, and client retention sequences.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Do you offer salespeople or closers?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We do provide appointment setters and closers when the foundation is in place. That said, we focus first on making sure your offer, funnel, and lead flow are ready—because no closer can fix a broken system.
                      <br /><br />
                      ➡️ <button onClick={openIClosed} className="text-blue-600 hover:text-blue-800 underline font-medium">If your offer is strong and you're ready for scale, we'll plug in sales support.</button>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Can you help me grow my audience or brand?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      Yes—we support brand awareness through influencer marketing, social campaigns, and paid reach strategies. We help you get seen by the right people using modern, conversion-friendly tactics.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Do you work with businesses that are already earning revenue?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We work with companies from pre-revenue up to $100K+ per month. For those already earning, we focus on scaling infrastructure, automation, and freeing up your time through operational systems.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-11" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      How soon can I expect results?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      Most clients start to see measurable results within 30–45 days, especially if they follow our rollout plan. We work with businesses typically anywhere from 6-12 months depending on how much help they need and which pricing model they choose. Timelines vary based on offer, niche, and how quickly you're able to implement.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-12" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      How do you increase sales for service businesses?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We don't just plug in ads or build funnels—we look at the entire sales system: offer structure, messaging, pipeline flow, lead nurture, and conversion points. Then we optimize or automate wherever possible.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-13" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Can you help me launch a digital product?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      Yes—we help package your expertise into digital products (courses, toolkits, subscriptions), and then build and market your funnel to support it from pre-launch to scale.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-14" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      What if I have more questions or don't know where I fit?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      No problem—many founders aren't sure where they stand. That's what we're here for.
                      <br /><br />
                      ➡️ <button onClick={openIClosed} className="text-blue-600 hover:text-blue-800 underline font-medium">Book a free strategy call and we'll help you assess your next best step—no pressure, just clarity.</button>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-15" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      What makes your team different from other marketing agencies?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We're a group of web developers, software engineers, and data scientists who focus on the consumer journey. Stop worrying about the product, and start worrying about how your audience is perceiving your service/brand/business. We build the technical infrastructure and data systems that power successful customer experiences.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-16" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Do you provide analytics and data insights?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      Yes—our data scientists build comprehensive analytics dashboards that track customer behavior, conversion funnels, and business performance. We provide actionable insights that help you understand your audience better and optimize your customer journey for maximum results.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-17" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      Can you build backends for websites and mobile apps?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      Absolutely. Our software engineers build robust backends for both websites and mobile apps, including apps for the Apple App Store and Google Play Store. We handle everything from API development and database design to server infrastructure and app store optimization.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-18" className="bg-white rounded-lg px-6 border border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                      How do you use data to improve customer experience?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pt-2">
                      We analyze customer behavior data to identify friction points in your customer journey, optimize conversion paths, and personalize user experiences. Our data-driven approach ensures every touchpoint is designed to move prospects closer to becoming customers.
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}
          </Accordion>

          {/* Show More/Less Button */}
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAllFAQs(!showAllFAQs)}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              {showAllFAQs ? 'Show Less' : 'Show More FAQs'}
            </Button>
          </div>
        </div>
      </div>

      {/* About Our Funder Section */}
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
              onClick={() => setIsRoadmapOpen(true)}
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
              <Logo size="md" className="text-white" />
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {/* <button
                onClick={() => handleFooterNavigation("/workshops")}
                className="hover:text-blue-200 transition-colors text-lg cursor-pointer bg-transparent border-none text-white"
              >
                Workshops
              </button> */}
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
      {/* iClosed Widget */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* iClosed Popup for FAQ Links */}
      <IClosedPopup isOpen={isIClosedOpen} onClose={closeIClosed} />
      
      {/* Roadmap Modal */}
      <RoadmapModal isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} />
      
      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
      
      {/* Free Courses Popup */}
      <FreeCoursesPopup isOpen={isFreeCoursesOpen} onClose={closeFreeCourses} />
    </div>
  )
}
