"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Play, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"

export default function WorkshopsPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const [currentVideo, setCurrentVideo] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)

  const testimonialVideos = [
    {
      id: 1,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Client+Review+1",
      title: "Sarah's Success Story",
      description: "How Sarah scaled her business 300% in 6 months",
    },
    {
      id: 2,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Client+Review+2",
      title: "Mike's Transformation",
      description: "From startup to 7-figure revenue",
    },
    {
      id: 3,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Client+Review+3",
      title: "Jennifer's Journey",
      description: "Automated systems that changed everything",
    },
    {
      id: 4,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Client+Review+4",
      title: "David's Results",
      description: "Scaling with AI-powered marketing",
    },
  ]

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % testimonialVideos.length)
  }

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + testimonialVideos.length) % testimonialVideos.length)
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
              <Link href="/workshops" className="text-blue-300 transition-colors">
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
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" className="text-white hover:text-blue-300">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            LEARN HOW TO SCALE YOUR
            <br />
            BUSINESS
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-300">
            Join our 100 person, <span className="underline font-semibold">in-person</span> scaling workshop.
          </p>

          {/* Workshop Image */}
          <div className="mb-12">
            <img
              src="/placeholder.svg?height=400&width=600&text=Workshop+Presenter+Speaking+to+Audience"
              alt="Workshop presenter speaking to audience"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
            />
          </div>

          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            It's a 2-day, interactive workshop where you'll receive{" "}
            <span className="font-bold text-white">personalized, actionable insights</span> from the team that's scaled
            Terramore.io & it's portfolio companies.
          </p>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-6 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transition-all mb-16"
          >
            I'M READY TO SCALE
          </Button>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What Attendees Are Saying:</h2>
        </div>
      </div>

      {/* Video Carousel Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Video Carousel */}
          <div className="relative mb-12">
            <div className="flex items-center justify-center">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={prevVideo}
                className="absolute left-0 z-10 rounded-full bg-white/80 hover:bg-white shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Main Video Display */}
              <div className="relative mx-16">
                <img
                  src={testimonialVideos[currentVideo].thumbnail || "/placeholder.svg"}
                  alt={testimonialVideos[currentVideo].title}
                  className="rounded-lg shadow-2xl max-w-lg mx-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                    <Play className="w-12 h-12 text-white" />
                  </Button>
                </div>

                {/* Video Info */}
                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{testimonialVideos[currentVideo].title}</h3>
                  <p className="text-gray-600">{testimonialVideos[currentVideo].description}</p>
                </div>
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={nextVideo}
                className="absolute right-0 z-10 rounded-full bg-white/80 hover:bg-white shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Video Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonialVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideo(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentVideo ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail Preview */}
            <div className="flex justify-center space-x-4 mt-8 overflow-x-auto">
              {testimonialVideos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideo(index)}
                  className={`flex-shrink-0 relative ${
                    index === currentVideo ? "ring-2 ring-blue-600" : ""
                  } rounded-lg overflow-hidden`}
                >
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-24 h-16 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-gray-600 mb-12 max-w-2xl mx-auto text-center">
            Individual experiences presented here may not be typical. Their background, education, effort, and
            application affected their experience. The information shared here are for example purposes and not a
            guarantee of a rate of return or a specific result. Your results may vary.
          </p>

          {/* Workshop Description */}
          <div className="mb-16 text-center">
            <p className="text-xl md:text-2xl text-gray-800 mb-4">
              This workshop is designed to help you achieve rapid,
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mb-4">transformative growth</p>
            <p className="text-xl md:text-2xl text-gray-800">and take your business to the next level.</p>
          </div>

          {/* New Booking Section */}
          <div className="mb-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              BOOK A CALL <span className="text-blue-600">BELOW</span> TO SEE IF YOU'RE A FIT
            </h3>

            {/* Form Steps */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep === 1 ? "bg-blue-600" : "bg-gray-300"}`}></div>
                <span className={`font-medium ${currentStep === 1 ? "text-gray-900" : "text-gray-500"}`}>
                  Fill out the form
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep === 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
                <span className={`font-medium ${currentStep === 2 ? "text-gray-900" : "text-gray-500"}`}>
                  Book your event
                </span>
              </div>
            </div>

            {/* Booking Interface */}
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Form Section */}
                <div className="p-8 border-r border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Terramore.io Scaling Workshop Meeting</h4>
                  <p className="text-gray-600 mb-6">
                    Excited to speak with you for our <span className="underline">in-person</span> scaling workshop.
                  </p>
                  <p className="text-gray-600 mb-6">Book a call below to see if you are a fit.</p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex">
                        <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                          <span className="text-sm">🇺🇸</span>
                          <span className="ml-2 text-sm">+1</span>
                        </div>
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          className="rounded-l-none border-l-0 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="First name *"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="Last name *"
                          className="focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        By entering information, I agree to <span className="underline">Terms & Privacy Policy</span>,
                        and to receive text messages
                      </label>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                      Continue →
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">Powered by ▼ Closed</p>
                  </div>
                </div>

                {/* Calendar Section */}
                <div className="p-8 bg-gray-50">
                  <div className="text-center">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">June 2025</h5>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                        <div key={day} className="text-xs font-medium text-gray-500 p-2">
                          {day}
                        </div>
                      ))}

                      {/* Calendar Days */}
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                        <div
                          key={day}
                          className={`p-2 text-sm cursor-pointer hover:bg-blue-100 rounded ${
                            day === 28 ? "bg-blue-600 text-white" : "text-gray-700"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">Please fill out the form before choosing your time slot.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="max-w-4xl mx-auto mt-8">
              <p className="text-xs text-gray-500 leading-relaxed">
                By providing your information today, you are giving consent for us or our partners, to contact you by
                mail, phone, text, or email using automated technology to the data provided, even if the phone number is
                present on a state or national Do Not Call list. We do not sell your personal information to other
                companies, and you can withdraw consent at any time. By submitting this form, you agree to our Privacy
                Policy and Terms of Service.
              </p>
            </div>
          </div>

          {/* Event Description Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  It's not like any other event you've ever been to before
                </h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  It's an opportunity to walk away with <span className="font-bold">3-5 tactical steps</span> tailored
                  to solving your biggest business challenges, guided by experts who've scaled businesses to over $250M+
                  in revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-8 rounded-full text-3xl font-bold shadow-lg hover:shadow-xl transition-all mb-16"
        >
          I'M READY TO SCALE
        </Button>
      </div>

      {/* Workshop Experience Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Here's What You'll Experience at the Workshop
            </h2>
          </div>

          {/* Feature 1: Direct Access to Alex */}
          <div className="flex items-start gap-8 mb-20">
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg?height=290&width=390&text=Alex+Speaking+with+Team+Member"
                alt="Alex speaking with team member in workshop setting"
                className="w-[390px] h-[290px] rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Direct Access to Adam</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">and the</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Terramore.io Team</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Get face-to-face with the team behind proven scaling strategies and meet Adam Moreno, founder of
                Terramore.io. Our workshop gives you the unique opportunity to ask questions and get actionable advice
                directly from the experts who have successfully helped businesses implement AI-powered marketing and
                scaling solutions.
              </p>
            </div>
          </div>

          {/* Feature 2: High-Level Peers */}
          <div className="flex items-start gap-8 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">A Room Full of High-Level Peers</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                This isn't just another event for businesses in the early stages. We carefully select attendees to
                ensure you're surrounded by business leaders like yourself. Expect discussions and strategies that are
                relevant to high-revenue, high-growth businesses ready to scale even further.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg?height=290&width=390&text=Workshop+Attendees+in+Conference+Room"
                alt="Workshop attendees in conference room with purple lighting"
                className="w-[390px] h-[290px] rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Feature 3: Track Record of Success */}
          <div className="flex items-start gap-8 mb-20">
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg?height=290&width=390&text=Presentation+Setup+Success+Stories"
                alt="Presentation setup showing success stories"
                className="w-[390px] h-[290px] rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Track Record of Success</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our proven methodologies have helped countless businesses achieve remarkable growth. Learn from real
                case studies and success stories of companies that have implemented our AI-powered scaling strategies
                and marketing automation systems to achieve exponential revenue growth.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Workshop Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Feature 4: High-Level Peers */}
          <div className="flex items-start gap-8 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">A Room Full of High-Level Peers</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                This isn't just another event for businesses in the early stages. We carefully select attendees to
                ensure you're surrounded by business leaders like yourself. Expect discussions and strategies that are
                relevant to high-revenue, high-growth businesses ready to scale even further.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/images/workshop-additional-1.png"
                alt="Conference room with purple lighting and many high-level business attendees"
                className="w-[390px] h-[290px] rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Feature 5: Track Record of Success */}
          <div className="flex items-start gap-8 mb-20">
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg?height=290&width=390&text=Presenter+Speaking+to+Audience"
                alt="Presenter speaking to engaged audience in conference setting"
                className="w-[390px] h-[290px] rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Track Record of Success</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our workshop has a proven history of driving significant growth. Past attendees have seen incredible
                results, with some doubling or even quadrupling their revenue within months of attending. When you join
                us, you're tapping into a legacy of success.
              </p>
            </div>
          </div>

          {/* Feature 6: Potential for Future Partnership */}
          <div className="flex items-start gap-8 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Potential for Future Partnership</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                While there's no guarantee of ongoing services, attending this workshop could open the door to a future
                partnership with Terramore.io. It's an opportunity to build relationships with a team that's deeply
                invested in helping you scale using cutting-edge AI marketing strategies and proven business systems.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg?height=290&width=390&text=Woman+Speaking+to+Large+Audience"
                alt="Woman speaking to large audience in conference setting"
                className="w-[390px] h-[290px] rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Curriculum Section */}
      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Side - Title */}
            <div>
              <div className="w-16 h-1 bg-blue-600 mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                The WHAT:
                <br />
                THINKING
                <br />
                LIKE A
                <br />
                <span className="text-blue-500">CEO</span>
              </h2>
            </div>

            {/* Right Side - Bullet Points */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">• Great CEOs Build Great Companies</h3>
                <p className="text-gray-300 leading-relaxed">
                  Learn the mindset and approach of great CEOs who drive growth and create lasting success.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">• The Theory of Constraints</h3>
                <p className="text-gray-300 leading-relaxed">
                  Identify the biggest bottlenecks in your business and eliminate them for rapid growth.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">• Live Demonstration</h3>
                <p className="text-gray-300 leading-relaxed">
                  See how these principles are applied to real businesses in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="space-y-12">
            {/* Top Row - 3 items horizontally aligned */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value Adders */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">VALUE ADDERS:</h3>
                <div className="w-12 h-0.5 bg-blue-600 mx-auto mb-4"></div>
                <h4 className="text-lg font-medium text-gray-300 italic mb-4">
                  How to Make Your Company More Valuable
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Discover what drives enterprise value and how to make your business more attractive to potential
                  buyers or investors.
                </p>
              </div>

              {/* Value Detractors */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">VALUE DETRACTORS:</h3>
                <div className="w-12 h-0.5 bg-blue-600 mx-auto mb-4"></div>
                <h4 className="text-lg font-medium text-gray-300 italic mb-4">
                  How to Avoid Making Your Company Less Valuable
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Uncover the common mistakes that drain value from your business and learn how to fix them.
                </p>
              </div>

              {/* The Who */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">THE WHO:</h3>
                <div className="w-12 h-0.5 bg-blue-600 mx-auto mb-4"></div>
                <h4 className="text-lg font-medium text-gray-300 italic mb-4">Finding and Retaining Top Talent</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Attract and keep the right people to scale your business, and learn how to solve talent issues without
                  needing more time or skills.
                </p>
              </div>
            </div>

            {/* Bottom Row - 2 items centered underneath */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Maximizing Enterprise Value */}
              <div className="text-center">
                <h4 className="text-lg font-medium text-gray-300 italic mb-4">Maximizing Enterprise Value</h4>
                <div className="w-12 h-0.5 bg-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Find and remove the key constraint in your business to unlock exponential growth.
                </p>
              </div>

              {/* Huge Exits & Wealth Creation */}
              <div className="text-center">
                <h4 className="text-lg font-medium text-gray-300 italic mb-4">Huge Exits & Wealth Creation</h4>
                <div className="w-12 h-0.5 bg-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Learn how to position your company for a big exit and create long-term wealth.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-8 rounded-full text-3xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              I'M READY TO SCALE
            </Button>
          </div>
        </div>
      </div>

      {/* About Our Founder Section */}
      <div className="bg-white py-20 px-6">
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
                Whether you're in e-commerce, professional services, SaaS, healthcare, real estate, or any other
                industry, Adam's proven frameworks for AI-powered marketing automation and business scaling work across
                all sectors. His mission at Terramore.io is to help entrepreneurs and business owners implement
                cutting-edge strategies that drive measurable growth, regardless of their industry or business model.
              </p>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  See How We Can Help Your Industry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop FAQs Section */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-8 rounded-full text-3xl font-bold shadow-lg hover:shadow-xl transition-all mb-12"
            >
              I'M READY TO SCALE
            </Button>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Workshop FAQs</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What is the Terramore.io Scaling Workshop?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                The Terramore.io Scaling Workshop is an intensive 2-day, in-person event designed for business owners
                ready to scale their operations. Led by Adam Moreno and his team, this workshop provides personalized,
                actionable insights from experts who have successfully implemented AI-powered marketing strategies and
                scaling solutions. You'll learn proven frameworks and methodologies that have been tested across
                multiple successful companies and industries.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                How Do I Register for a Scaling Workshop?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Registration begins with booking a qualification call using the form on this page. Our team will assess
                your business to ensure you're a good fit for the workshop. If approved, you'll receive registration
                details and payment instructions. Due to limited capacity (100 attendees), we carefully select
                participants to ensure the highest quality experience for everyone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                How Can I Bring a Guest to the Scaling Workshop?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Each ticket is for one attendee only. If you'd like to bring a business partner or team member, they
                must register separately and go through the same qualification process. This ensures all attendees meet
                our criteria and can fully benefit from the advanced content. Group discounts may be available for
                qualifying businesses - please discuss this during your qualification call.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Where's the workshop located?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                The workshop is held in Las Vegas, Nevada, at a premium conference facility. The exact venue details
                will be provided upon registration confirmation. Las Vegas was chosen for its accessibility, with direct
                flights from most major cities, and its concentration of high-quality venues and accommodations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Will lodging and transportation be included in my Scaling Workshop ticket purchase?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                No, lodging and transportation are not included in your ticket price. You are responsible for booking
                your own flights and hotel accommodations. We will provide a list of recommended hotels near the venue,
                some with special rates for workshop attendees. Most attendees find this gives them flexibility in
                choosing accommodations that fit their preferences and budget.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Where to stay and what to do in Las Vegas?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                We recommend staying at hotels within 10-15 minutes of the venue for convenience. Popular options
                include properties on the Strip or downtown Las Vegas. We'll provide a detailed accommodation guide with
                recommended hotels, transportation options, and local attractions. Many attendees extend their stay to
                network with fellow entrepreneurs or enjoy Las Vegas entertainment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Will there be food, snacks, refreshments?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Yes! All meals, snacks, and refreshments are included during workshop hours. We provide breakfast,
                lunch, dinner, and healthy snacks throughout both days. Our catering includes options for various
                dietary preferences and restrictions. Coffee, tea, and other beverages are available throughout the
                event to keep you energized and focused.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What about dietary restrictions, what foods do you offer?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                We accommodate most dietary restrictions including vegetarian, vegan, gluten-free, keto, and common
                allergies. Please inform us of any dietary needs during registration. Our catering includes a variety of
                healthy options, lean proteins, fresh vegetables, fruits, and brain-healthy snacks designed to maintain
                your energy and focus throughout the intensive sessions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What time does the Scaling Workshop start and end each day?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Day 1: 8:00 AM - 6:00 PM (includes breakfast, lunch, and networking dinner) Day 2: 8:00 AM - 5:00 PM
                (includes breakfast and lunch) We recommend arriving 30 minutes early each day for check-in and
                networking. The schedule is intensive but includes strategic breaks to maximize learning and retention.
                Detailed agenda will be provided upon registration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Where do I find my workshop itinerary?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Your detailed itinerary will be emailed to you 1-2 weeks before the workshop date. It includes session
                topics, speaker schedules, meal times, networking opportunities, and venue information. You'll also
                receive a mobile app link with real-time updates, attendee networking features, and digital resources to
                enhance your workshop experience.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                How should I prepare for the workshop?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Come prepared with your current business challenges, financial statements, and specific goals. We'll
                send a pre-workshop questionnaire to help you identify key areas to focus on. Bring a notebook, laptop,
                and business cards for networking. Most importantly, come with an open mind and ready to implement what
                you learn immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What's the Scaling Workshop format each day?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Each day combines keynote presentations, interactive workshops, case study analysis, and small group
                sessions. You'll participate in live business assessments, strategy development exercises, and Q&A
                sessions with Adam Moreno and his team. The format is highly interactive - expect to work on your actual
                business challenges with expert guidance throughout both days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Who are the main speakers?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Adam Moreno is the primary speaker, sharing insights from his extensive experience in market research,
                AI-powered marketing strategies, and business scaling. You'll also hear from key Terramore.io team
                members, successful client case studies, and special guest experts in areas like automation, data
                analytics, and digital marketing. Each speaker brings real-world experience and actionable strategies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What should I bring to the workshop?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Bring a laptop, notebook, pens, business cards, and your current business financials. We'll provide
                workbooks, templates, and other materials. Dress code is business casual. Don't forget chargers for your
                devices, and consider bringing a portable battery pack. Most importantly, bring your specific business
                challenges and goals to maximize the personalized advice you'll receive.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Can I hire the Terramore.io team members directly to help me scale my business?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                While the workshop is educational and not a sales event, exceptional businesses may be considered for
                deeper partnerships with Terramore.io. However, there's no guarantee of additional services or
                consulting opportunities. The workshop's primary value is the education, strategies, and networking
                opportunities you'll gain during the two days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-16" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Can I change my workshop date?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Date changes are possible subject to availability and must be requested at least 30 days before your
                original workshop date. A $500 administrative fee applies to date changes. If no alternative dates work
                for you within 12 months, you may be eligible for a refund minus the administrative fee, subject to our
                cancellation policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-17" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What is your cancellation and refund policy?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Full refunds are available up to 60 days before the workshop. 50% refunds are available 30-59 days
                before. No refunds are available within 30 days of the workshop date, except in cases of medical
                emergency with documentation. All refund requests must be submitted in writing and may take 7-10
                business days to process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-18" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                My plans changed, can I transfer my ticket to someone else?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Yes, ticket transfers are allowed up to 14 days before the workshop date. The new attendee must go
                through our qualification process to ensure they're a good fit. A $250 transfer fee applies, and both
                parties must complete transfer documentation. The new attendee will receive all pre-workshop materials
                and communications.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-19" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Are photos, videos, computers and pictures allowed while onsite?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Personal devices are allowed, but recording of sessions is strictly prohibited to protect proprietary
                content and attendee privacy. Photography is permitted during breaks and networking sessions, but not
                during presentations. We'll provide professional photos from the event and key presentation materials
                digitally after the workshop.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-20" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Is there a code of conduct?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Yes, we maintain a professional environment focused on learning and networking. Respectful behavior
                toward all attendees, speakers, and staff is required. Disruptive behavior, inappropriate conduct, or
                violation of our recording policy may result in removal without refund. We want everyone to feel
                comfortable sharing and learning in a supportive environment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-21" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                What's the best time to arrive in Las Vegas to beat the heat?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                If traveling during summer months, we recommend arriving the evening before to avoid midday heat and
                potential flight delays. The venue is climate-controlled, but early arrival allows you to settle in,
                network with other early arrivals, and start fresh on day one. Most attendees find arriving 1 day early
                optimal for preparation and adjustment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-22" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                Will there be a security checkpoint?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Yes, there will be a security checkpoint at the venue entrance. Please bring a government-issued photo
                ID for entry. Prohibited items include weapons, recording devices, and outside food/beverages. The
                security process is quick and professional, similar to entering a corporate office building. Plan to
                arrive 15-30 minutes early on your first day to account for check-in and security.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-23" className="bg-white rounded-lg px-6 border-b border-gray-300">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-6">
                How much is a ticket?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                Ticket pricing is provided during your qualification call, as it varies based on your business size,
                revenue, and specific needs. The investment reflects the high-value, personalized nature of the content
                and the limited number of attendees. Payment plans may be available for qualifying businesses. The price
                includes all sessions, materials, meals, and ongoing support resources.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Left Column */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Workshop Terms & Conditions</h3>
            </div>

            {/* Right Column */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Workshop FAQs</h3>
            </div>
          </div>

          {/* Logo and Navigation */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/images/terramore-logo-clean.png"
                alt="Terramore Logo"
                className="w-8 h-8 object-contain mr-3"
              />
              <span className="text-xl font-bold">TERRAMORE.IO</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Link href="/workshops" className="hover:text-blue-200 transition-colors">
                Workshops
              </Link>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Courses</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Books</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Media</div>
              <Link href="/partner" className="hover:text-blue-200 transition-colors">
                Partner With Us
              </Link>
              <Link href="/careers" className="hover:text-blue-200 transition-colors">
                Careers
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="/privacy" className="hover:text-blue-200 transition-colors">
                Privacy Policy
              </Link>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Terms of Service</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Disclosure</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">DMCA Policy</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Do Not Sell My Info</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm leading-relaxed opacity-90">
            <p>
              Adam Moreno's results are not typical and are not a guarantee of your success. Adam is an experienced
              business owner and consultant, and your results will vary depending on education, effort, application,
              experience, and background. Adam does not personally invest in every business he works with through
              Terramore.io, LLC. Due to the sensitivity of financial information, we do not track the typical results of
              our students. We cannot guarantee that you will make money or that you will be successful if you employ
              his business strategies specifically or generally. Consequently, your results may significantly vary from
              his. We do not give investment, tax, or other professional advice. Specific transactions and experiences
              are mentioned for informational purposes only. The information contained within this website is the
              property of Terramore.io. Any use of the images, content, or ideas expressed herein without the express
              written consent of Terramore.io is prohibited. Copyright © 2025 Terramore.io, LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
