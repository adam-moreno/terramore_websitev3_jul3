"use client"

import { useEffect, useState } from "react"

interface CalendlyWidgetProps {
  isOpen: boolean
  onClose: () => void
}

// US Federal Holidays for 2024 (can be extended for future years)
const US_HOLIDAYS_2024 = [
  "2024-01-01", // New Year's Day
  "2024-01-15", // Martin Luther King Jr. Day
  "2024-02-19", // Washington's Birthday
  "2024-05-27", // Memorial Day
  "2024-06-19", // Juneteenth National Independence Day
  "2024-07-04", // Independence Day
  "2024-09-02", // Labor Day
  "2024-10-14", // Columbus Day
  "2024-11-11", // Veterans Day
  "2024-11-28", // Thanksgiving Day
  "2024-12-25", // Christmas Day
]

function isHoliday(date: Date) {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  return US_HOLIDAYS_2024.includes(`${y}-${m}-${d}`)
}

function getNextBusinessDays(count: number): Date[] {
  const days: Date[] = []
  let date = new Date()
  while (days.length < count) {
    const day = date.getDay()
    if (day !== 0 && day !== 6 && !isHoliday(date)) {
      days.push(new Date(date))
    }
    date.setDate(date.getDate() + 1)
  }
  return days
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export function CalendlyWidget({ isOpen, onClose }: CalendlyWidgetProps) {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [showBooking, setShowBooking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(0)
  
  const loadingMessages = [
    "Finding the right person for your call...",
    "Coordinating schedules...",
    "Checking time zones...",
    "Preparing your strategy session...",
    "Setting up your personalized consultation..."
  ]

  const businessDays = getNextBusinessDays(5)
  const selectedDate = businessDays[selectedDateIdx]

  useEffect(() => {
    if (!isOpen) {
      setShowBooking(false)
      setSelectedDateIdx(0)
      setIsLoading(false)
    }
  }, [isOpen])

  const handleScheduleClick = () => {
    setIsLoading(true)
    setLoadingMessage(0)
    setShowBooking(true)
    
    // Rotate through loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessage(prev => (prev + 1) % loadingMessages.length)
    }, 2000)

    // Hide loading after 3 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      clearInterval(messageInterval)
      clearTimeout(loadingTimeout)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-80 max-w-sm overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Profile & Title */}
        <div className="flex items-center space-x-3 p-4 pb-2 pt-6">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200">
            <img
              src="https://res.cloudinary.com/dx7id04uv/image/upload/f_auto,q_auto,w_48,h_48,c_fill/v1752608693/adam-moreno-profile-new_jb3lr7.jpg"
              alt="Adam Moreno"
              className="w-full h-full object-cover"
              loading="eager"
              style={{
                imageRendering: 'crisp-edges'
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Adam Moreno</h3>
            <p className="text-xs text-gray-500">Founder</p>
          </div>
        </div>
        {/* Description */}
        {!showBooking && (
          <>
            <div className="px-4 pb-2">
              <h4 className="font-semibold text-gray-900 text-base mb-1 leading-tight">
                Ready to Scale Your Business?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                We help founders grow with customized strategies built for real businesses. Growth doesn't need to be complex.
              </p>
            </div>
            {/* Month */}
            <div className="px-4 text-xs text-gray-500 font-medium mb-1">
              {MONTH_LABELS[businessDays[0].getMonth()]}
            </div>
            {/* Date Buttons */}
            <div className="flex space-x-2 px-4 mb-4">
              {businessDays.map((date, idx) => {
                const isSelected = idx === selectedDateIdx
                const isToday = idx === 0 && (new Date().toDateString() === date.toDateString())
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDateIdx(idx)}
                    className={`flex-1 py-3 px-2 rounded-lg text-center transition-colors font-medium border
                      ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-blue-700 border-transparent hover:bg-blue-50 hover:border-blue-300"}
                      ${isToday ? "ring-2 ring-blue-400" : ""}
                    `}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="text-xs font-medium">{DAY_LABELS[date.getDay()]}</div>
                    <div className="text-sm font-semibold">{date.getDate()}</div>
                  </button>
                )
              })}
            </div>
            {/* CTA Button */}
            <div className="px-4 pb-2">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors shadow"
                onClick={handleScheduleClick}
              >
                Schedule a 1-on-1 Call
              </button>
            </div>
            {/* Footer */}
            <div className="text-center pb-3">
              <p className="text-xs text-gray-400">Terramore Scheduling</p>
            </div>
          </>
        )}
        {/* Loading State */}
        {showBooking && isLoading && (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600 text-center text-sm font-medium">
              {loadingMessages[loadingMessage]}
            </p>
          </div>
        )}
        {/* Embedded Calendly Booking Form */}
        {showBooking && !isLoading && (
          <div className="w-full h-96 flex flex-col items-center justify-center p-4">
            <iframe
              src="https://calendly.com/terramore/30min"
              className="w-full h-full border-0 rounded-lg"
              title="Schedule Appointment"
              allow="camera; microphone; geolocation"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}
      </div>
    </div>
  )
} 