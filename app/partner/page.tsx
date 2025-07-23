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
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"

export default function PartnerPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
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
              <Link href="/partner" className="text-blue-300 transition-colors">
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
              onClick={() => {
                // Handle form submission
                console.log("Form submitted:", formData)
                alert("Thank you! We'll be in touch soon.")
              }}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
            >
              <span>Submit Application</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
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
