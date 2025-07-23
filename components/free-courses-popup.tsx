"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Mail, CheckCircle, Gift } from "lucide-react"

interface FreeCoursesPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function FreeCoursesPopup({ isOpen, onClose }: FreeCoursesPopupProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    emailConsent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.emailConsent) {
      newErrors.emailConsent = "You must consent to email marketing to receive course updates"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual Supabase API call
      const response = await fetch('/api/free-courses-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            company: "",
            emailConsent: false
          })
          onClose()
        }, 3000)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Get FREE Course Updates!</h2>
              <p className="text-sm text-gray-600">Be the first to know when new courses launch</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                🎉 <strong>FREE Courses Coming by End of August!</strong> Sign up to get notified when each course video is uploaded. 
                You'll receive exclusive content and strategies to transform your business.
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Company Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                Company Name (Optional)
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            {/* Email Consent Checkbox */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailConsent}
                  onChange={(e) => handleInputChange("emailConsent", e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">I consent to email marketing</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    I agree to receive email updates about new course content, exclusive strategies, and business tips. 
                    I can unsubscribe at any time.
                  </p>
                </div>
              </label>
              {errors.emailConsent && (
                <p className="text-xs text-red-500 ml-7">{errors.emailConsent}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? "Signing Up..." : "Get FREE Updates"}
              </Button>
            </div>

            {/* Legal Notice */}
            <div className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our{" "}
              <button
                type="button"
                onClick={() => window.open('/privacy', '_blank')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => window.open('/terms', '_blank')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Terms of Service
              </button>
              .
            </div>
          </form>
        ) : (
          /* Success Message */
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              You're All Set! 🎉
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You've been successfully added to our FREE course updates list. 
              We'll notify you as soon as new course content is available!
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>What's Next:</strong> Check your email for a welcome message and stay tuned for course announcements!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 