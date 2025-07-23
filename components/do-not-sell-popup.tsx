"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Mail, Shield, Trash2, CheckCircle } from "lucide-react"

interface DoNotSellPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function DoNotSellPopup({ isOpen, onClose }: DoNotSellPopupProps) {
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
      setReason("")
      setSelectedOptions([])
      onClose()
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Do Not Sell My Personal Information</h2>
              <p className="text-sm text-gray-600">California Consumer Privacy Act (CCPA)</p>
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Under the California Consumer Privacy Act (CCPA), you have the right to opt out of the sale of your personal information. 
                We respect your privacy and will process your request within 45 days.
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                We need your email to identify and process your request
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                What would you like to do?
              </Label>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes("opt-out-marketing")}
                    onChange={() => handleOptionToggle("opt-out-marketing")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Opt out of marketing communications</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Stop receiving promotional emails, newsletters, and marketing materials
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes("delete-marketing-data")}
                    onChange={() => handleOptionToggle("delete-marketing-data")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Delete my marketing data</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Remove your information from our marketing databases and systems
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes("opt-out-third-party")}
                    onChange={() => handleOptionToggle("opt-out-third-party")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Opt out of third-party data sharing</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Stop sharing your data with third-party marketing partners
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Reason (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                Reason for request (optional)
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why you're making this request..."
                rows={3}
                className="w-full"
              />
            </div>

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
                disabled={!email || selectedOptions.length === 0 || isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Processing..." : "Submit Request"}
              </Button>
            </div>

            {/* Legal Notice */}
            <div className="text-xs text-gray-500 text-center">
              By submitting this request, you acknowledge that we may need to verify your identity 
              and that some information may be retained for legal or business purposes as required by law.
            </div>
          </form>
        ) : (
          /* Success Message */
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Request Submitted Successfully
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We've received your request and will process it within 45 days as required by the CCPA. 
              You'll receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Reference ID:</strong> {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 