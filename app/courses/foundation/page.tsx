"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Cookie, ChevronDown, Menu, Play } from "lucide-react"
import Link from "next/link"
import { CalendlyWidget } from "@/components/calendly-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { useRoadmapModal } from "@/hooks/use-roadmap-modal"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { RoadmapModal } from "@/components/roadmap-modal"
import { Logo } from "@/components/logo"

const R2_BASE = "https://pub-ebfd3500fb2e4d449346ae4c5c507e84.r2.dev"

/** Option B: course_type and signup_source match the new URL slug for dashboard consistency. */
const COURSE_SLUG = "foundation" as const

const COURSE_NAME = "The Foundation – From Idea to Income"

const modules = [
  {
    title: "Module 0 — Introduction",
    description: "Welcome to The Foundation course. This video will guide you through the entire course structure and help you understand how to make your first dollar online. We'll cover the mindset, tools, and strategies you need to go from idea to income.",
    whoBenefits: ["Brand-new entrepreneurs", "People with an idea but no revenue yet", "Anyone feeling stuck in analysis paralysis"],
    whatYouLearn: ["How the course is structured", "What it takes to go from idea to first dollar", "Mindset and tools you’ll need"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module0.mov`,
  },
  {
    title: "Module 1",
    description: "Develop the right entrepreneurial mindset to overcome analysis paralysis and take action. Learn how successful entrepreneurs think differently and how to build confidence in your business decisions.",
    whoBenefits: ["Overthinkers who delay launching", "First-time founders", "People who need more confidence to act"],
    whatYouLearn: ["How successful entrepreneurs think", "Ways to overcome analysis paralysis", "How to build confidence in your decisions"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module1.mov`,
  },
  {
    title: "Module 2",
    description: "Discover how to identify profitable niches by solving real problems. We'll show you research techniques to validate your ideas and find markets with genuine demand.",
    whoBenefits: ["People unsure which niche to pick", "Anyone with multiple ideas", "Founders who want to validate before building"],
    whatYouLearn: ["How to find profitable niches", "Research techniques to validate ideas", "How to spot real demand"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module2.mov`,
  },
  {
    title: "Module 3",
    description: "Learn the fundamentals of creating valuable offers that customers actually want to buy. Focus on value creation over product features to build compelling propositions.",
    whoBenefits: ["People with a product but no sales", "Service providers who undersell", "Anyone who struggles to explain their value"],
    whatYouLearn: ["How to create offers people want to buy", "Value creation vs. product features", "How to build a compelling proposition"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module3.mov`,
  },
  {
    title: "Module 4",
    description: "Master the art of launching without perfection using MVPs and simple service models. Get to market quickly and iterate based on real customer feedback.",
    whoBenefits: ["Perfectionists who never launch", "People waiting for the “right” moment", "Solo founders who want to move fast"],
    whatYouLearn: ["What an MVP is and why it matters", "Simple service models to start with", "How to iterate from real feedback"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module4.mov`,
  },
  {
    title: "Module 5",
    description: "Proven strategies for acquiring your first clients through warm outreach and local networking. Build relationships that convert into paying customers.",
    whoBenefits: ["People with no clients yet", "Introverts who dislike cold outreach", "Local or service-based businesses"],
    whatYouLearn: ["Warm outreach that works", "How to use local networks", "Turning relationships into paying clients"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module5.mov`,
  },
  {
    title: "Module 6",
    description: "Compare different platforms and tools to find the ones that will make you profitable fastest. Focus on revenue-generating activities from day one.",
    whoBenefits: ["People overwhelmed by tool choices", "Solo founders on a budget", "Anyone who wants to focus on what makes money"],
    whatYouLearn: ["Which platforms and tools matter most", "How to prioritize revenue-generating work", "Where to invest time and money first"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module6.mov`,
  },
  {
    title: "Module 7",
    description: "Learn pricing psychology and strategies for new businesses. Price confidently even when you're just starting out and don't have extensive experience.",
    whoBenefits: ["People who underprice their work", "New service providers", "Anyone afraid to raise prices"],
    whatYouLearn: ["Pricing psychology that works", "How to price as a newcomer", "Ways to price with confidence"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module7.mov`,
  },
  {
    title: "Module 8",
    description: "Deliver exceptional results to your first clients even if you're new to the industry. Build systems for consistent quality and customer satisfaction.",
    whoBenefits: ["First-time service providers", "People who worry they’re not “ready”", "Anyone who wants repeat clients"],
    whatYouLearn: ["How to deliver great results when you’re new", "Simple systems for quality and consistency", "How to keep clients satisfied"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module8.mov`,
  },
  {
    title: "Module 9",
    description: "Set up tracking systems and feedback loops to measure progress and continuously improve your business operations and customer experience.",
    whoBenefits: ["People who fly by the seat of their pants", "Founders who want to scale", "Anyone who wants to improve over time"],
    whatYouLearn: ["What to track and why", "How to build feedback loops", "Ways to improve operations and experience"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module9.mov`,
  },
  {
    title: "Module 10",
    description: "Bring it all together with a clear path from where you are now to your first consistent revenue. Plan your next steps with confidence.",
    whoBenefits: ["People who’ve watched all modules but need a plan", "Anyone close to first revenue", "Founders who want a clear next step"],
    whatYouLearn: ["How to tie everything together", "A clear path to first consistent revenue", "How to plan your next steps"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Module10.mov`,
  },
  {
    title: "Bonus",
    description: "A complete real-world breakdown of how to make $1,000 in 7 days starting from scratch. Step-by-step scenario with actual tactics and timelines.",
    whoBenefits: ["Anyone who wants a concrete 7-day challenge", "People who learn best by example", "Founders who want a fast proof of concept"],
    whatYouLearn: ["A real-world $1K-in-7-days scenario", "Exact tactics and timelines", "How to adapt the plan to your situation"],
    src: `${R2_BASE}/Foundations_Portrait_Mar1426_Bonus.mov`,
  },
]

export default function FoundationCoursePage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const { isOpen: isRoadmapOpen, setIsOpen: setIsRoadmapOpen } = useRoadmapModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(0)
  const [isModulesOpen, setIsModulesOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)

  const handleSelectModule = useCallback((index: number) => {
    mobileVideoRef.current?.pause()
    desktopVideoRef.current?.pause()
    setSelectedVideo(index)
    setVideoLoading(true)
    setVideoError(null)
  }, [])

  const handleVideoReady = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoLoading(false)
    setVideoError(null)
    mobileVideoRef.current?.pause()
    desktopVideoRef.current?.pause()
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024
    const toPlay = isDesktop ? desktopVideoRef.current : mobileVideoRef.current
    if (toPlay) toPlay.play().catch(() => {})
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoLoading(false)
    setVideoError("This video couldn’t be loaded. Try another module or check your connection.")
  }, [])

  const handleCourseSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const firstName = (fd.get("firstName") as string)?.trim() ?? ""
    const lastName = (fd.get("lastName") as string)?.trim() ?? ""
    const email = (fd.get("email") as string)?.trim() ?? ""
    const phone = (fd.get("phone") as string)?.trim() || null
    const company = (fd.get("company") as string)?.trim() || null
    if (!firstName || !lastName || !email) {
      setSubmitMessage({ type: "error", text: "Please fill in required fields." })
      return
    }
    setIsSubmitting(true)
    setSubmitMessage(null)
    try {
      const res = await fetch("/api/course-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          courseType: COURSE_SLUG,
          signupSource: COURSE_SLUG,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSubmitMessage({ type: "success", text: "Thanks! You're signed up." })
        form.reset()
      } else if (res.status === 409) {
        setSubmitMessage({ type: "error", text: "This email is already registered." })
      } else {
        setSubmitMessage({ type: "error", text: (data.error as string) || "Something went wrong. Please try again." })
      }
    } catch {
      setSubmitMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    <Link href="/courses/foundation" className="block px-4 py-2 text-gray-800 bg-blue-50 text-blue-600">
                      The Foundation
                    </Link>
                    <Link
                      href="/courses/make-it-real"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Make It Real
                    </Link>
                    <Link
                      href="/courses/build-to-grow"
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
              <Link href="/courses/foundation" className="block text-white hover:text-blue-300 transition-colors">
                The Foundation
              </Link>
              <Link href="/courses/make-it-real" className="block text-white hover:text-blue-300 transition-colors">
                Make It Real
              </Link>
              <Link href="/courses/build-to-grow" className="block text-white hover:text-blue-300 transition-colors">
                Build to Grow
              </Link>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">The Foundation</h1>
          <p className="text-gray-600 text-sm md:text-base">From Idea to Income</p>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-4 mt-2"></div>
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
                {modules.map((module, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedVideo === index ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    onClick={() => handleSelectModule(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white">{module.title}</h4>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-2">{module.description}</p>
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
          <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-6">
            <video
              ref={mobileVideoRef}
              key={modules[selectedVideo].src}
              src={modules[selectedVideo].src}
              controls
              preload="auto"
              playsInline
              className="w-full h-full object-contain"
              onLoadedData={handleVideoReady}
              onCanPlay={handleVideoReady}
              onError={handleVideoError}
            />
            {videoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white p-6">
                <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium">{modules[selectedVideo].title}</p>
                <p className="text-xs text-gray-400 mt-1">Loading video…</p>
              </div>
            )}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white p-6">
                <p className="text-sm text-center text-gray-300">{videoError}</p>
              </div>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mt-2">{modules[selectedVideo].title}</h2>
          <p className="text-sm text-gray-600 mt-2">{modules[selectedVideo].description}</p>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Who benefits from this module</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                {modules[selectedVideo].whoBenefits.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">What you&apos;ll learn</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                {modules[selectedVideo].whatYouLearn.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="px-6 space-y-4 mb-8">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg"
            onClick={() => setIsRoadmapOpen(true)}
          >
            Get My Custom Business Roadmap
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

          <form className="space-y-4" onSubmit={handleCourseSignup}>
            <div>
              <Label htmlFor="mobile-firstName" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="mobile-firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="mobile-lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="mobile-lastName"
                name="lastName"
                type="text"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="mobile-email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="mobile-email"
                name="email"
                type="email"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="mobile-phone" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <Input
                id="mobile-phone"
                name="phone"
                type="tel"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="mobile-company" className="text-sm font-medium text-gray-700">
                Company Name
              </Label>
              <Input
                id="mobile-company"
                name="company"
                type="text"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              {submitMessage && (
                <p className={`text-sm mb-4 ${submitMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                  {submitMessage.text}
                </p>
              )}
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
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? "Submitting…" : "Go to Step 2"}
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
            <h2 className="text-lg font-bold text-gray-900 mb-2">🚀 {COURSE_NAME}</h2>
            <p className="text-sm text-gray-600">
              Transform your business idea into your first profitable dollar online with proven strategies and
              actionable steps for solopreneurs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-2">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVideo === index ? "bg-blue-100 border-l-4 border-blue-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectModule(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-medium ${selectedVideo === index ? "text-blue-600" : "text-gray-900"}`}
                      >
                        {module.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{module.description}</p>
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
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={desktopVideoRef}
                  key={modules[selectedVideo].src}
                  src={modules[selectedVideo].src}
                  controls
                  preload="auto"
                  playsInline
                  className="w-full h-full object-contain"
                  onLoadedData={handleVideoReady}
                  onCanPlay={handleVideoReady}
                  onError={handleVideoError}
                />
                {videoLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white p-6">
                    <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium">{modules[selectedVideo].title}</p>
                    <p className="text-xs text-gray-400 mt-1">Loading video…</p>
                  </div>
                )}
                {videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white p-6">
                    <p className="text-sm text-center text-gray-300">{videoError}</p>
                  </div>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900 mt-4">{modules[selectedVideo].title}</h1>
              <p className="text-gray-600 leading-relaxed mt-2">{modules[selectedVideo].description}</p>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Who benefits from this module</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {modules[selectedVideo].whoBenefits.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">What you&apos;ll learn</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {modules[selectedVideo].whatYouLearn.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
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
                <Label htmlFor="desktop-firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="desktop-firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="desktop-lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="desktop-lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="desktop-email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="desktop-email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="desktop-phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="desktop-phone"
                  name="phone"
                  type="tel"
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="desktop-company" className="text-sm font-medium text-gray-700">
                  Company Name
                </Label>
                <Input
                  id="desktop-company"
                  name="company"
                  type="text"
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                {submitMessage && (
                  <p className={`text-sm mb-4 ${submitMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {submitMessage.text}
                  </p>
                )}
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
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? "Submitting…" : "Go to Step 2"}
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
                  <Link href="/courses/foundation" className="text-gray-400 hover:text-white transition-colors">
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
      <CalendlyWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Roadmap Modal */}
      <RoadmapModal isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} />

      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
    </div>
  )
}
