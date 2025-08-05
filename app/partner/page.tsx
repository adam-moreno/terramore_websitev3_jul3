"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Cookie,
  ChevronDown,
  Menu,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building,
  DollarSign,
  Users,
  Target,
  Clock,
  CreditCard,
  User,
} from "lucide-react"
import Link from "next/link"
import { CalendlyWidget } from "@/components/calendly-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { Logo } from "@/components/logo"

export default function PartnerPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    location: "",
    businessType: "",
    revenue: "",
    teamSize: "",
    goal: "",
    timeline: "",
    budget: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const totalSteps = 8

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleOptionSelect = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch('/api/partner-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            location: "",
            businessType: "",
            revenue: "",
            teamSize: "",
            goal: "",
            timeline: "",
            budget: "",
            name: "",
            email: "",
            phone: "",
            message: "",
          })
          setCurrentStep(1)
        }, 5000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFooterNavigation = (href: string) => {
    window.location.href = href
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">Where are you located?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Help us understand your market and time zone for better collaboration.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {["United States", "Canada", "United Kingdom", "Australia", "Europe", "Other"].map((location) => (
                <div
                  key={location}
                  onClick={() => handleOptionSelect("location", location)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    formData.location === location
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-lg font-semibold">{location}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Building className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">What type of business do you operate?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Understanding your industry helps us tailor our approach to your specific needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {["E-commerce", "SaaS/Technology", "Professional Services", "Healthcare", "Real Estate", "Other"].map(
                (type) => (
                  <div
                    key={type}
                    onClick={() => handleOptionSelect("businessType", type)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      formData.businessType === type
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-lg font-semibold">{type}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <DollarSign className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">What's your current annual revenue?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                This helps us understand your business scale and recommend appropriate solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {["Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "Over $10M"].map(
                (revenue) => (
                  <div
                    key={revenue}
                    onClick={() => handleOptionSelect("revenue", revenue)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      formData.revenue === revenue
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-lg font-semibold">{revenue}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Users className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">How many people are on your team?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Team size helps us understand your operational complexity and scaling needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {["Just me (Solo)", "2-5 people", "6-15 people", "16-50 people", "51-100 people", "Over 100 people"].map(
                (size) => (
                  <div
                    key={size}
                    onClick={() => handleOptionSelect("teamSize", size)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      formData.teamSize === size
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-lg font-semibold">{size}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Target className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">What's your primary business goal?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Understanding your main objective helps us prioritize the right solutions for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "Increase Revenue",
                "Reduce Costs",
                "Improve Operations",
                "Scale Team",
                "Enter New Markets",
                "Exit/Acquisition",
              ].map((goal) => (
                <div
                  key={goal}
                  onClick={() => handleOptionSelect("goal", goal)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    formData.goal === goal
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-lg font-semibold">{goal}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Clock className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">When do you want to achieve this goal?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Timeline expectations help us structure the right implementation plan for your success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {["Within 3 months", "3-6 months", "6-12 months", "1-2 years", "2+ years", "No specific timeline"].map(
                (timeline) => (
                  <div
                    key={timeline}
                    onClick={() => handleOptionSelect("timeline", timeline)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      formData.timeline === timeline
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-lg font-semibold">{timeline}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <CreditCard className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">What's your investment capacity?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Understanding your budget helps us recommend the most suitable solutions and packages.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {["Under $5K", "$5K - $15K", "$15K - $50K", "$50K - $100K", "$100K - $250K", "Over $250K"].map(
                (budget) => (
                  <div
                    key={budget}
                    onClick={() => handleOptionSelect("budget", budget)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      formData.budget === budget
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-lg font-semibold">{budget}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <User className="w-16 h-16 text-blue-600 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">Let's get your contact information</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We'll use this information to prepare a customized proposal for your business.
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-left block">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-blue-50 border-blue-200 focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-blue-50 border-blue-200 focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-left block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-blue-50 border-blue-200 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-left block">
                  Additional Information
                </Label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us more about your business challenges or specific needs..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
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
            <Logo size="lg" className="text-white" />
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
              <Link href="/partner" className="text-blue-300 transition-colors">
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
              <Link href="/partner" className="text-blue-300 transition-colors py-2">
                Partner With Us
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Partner With <span className="text-blue-400">Terramore.io</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Let's work together to scale your business with proven systems and strategies.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {isSubmitted && (
        <div className="py-8 px-4 bg-green-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>Application Submitted Successfully! 🎉</strong>
              <p className="mt-2">Thank you for your interest in partnering with us. We'll review your application and get back to you within 2-3 business days.</p>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="py-8 px-4 bg-red-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {submitError}
            </div>
          </div>
        </div>
      )}

      {/* Questionnaire */}
      <div className="py-16 px-4 bg-white min-h-[600px] flex items-center">
        <div className="max-w-6xl mx-auto w-full">{renderStep()}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
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
      <CalendlyWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
    </div>
  )
}
