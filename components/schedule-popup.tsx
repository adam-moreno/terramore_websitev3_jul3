"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SchedulePopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SchedulePopup({ isOpen, onClose }: SchedulePopupProps) {
  if (!isOpen) return null

  const handleScheduleCall = () => {
    // You can add booking logic here
    console.log("Schedule 1-on-1 Call clicked")
    onClose()
  }

  const handleDateSelect = (date: string) => {
    console.log("Date selected:", date)
    // You can add date selection logic here
  }

  // Get current and upcoming dates
  const today = new Date()
  const dates = []
  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = days[date.getDay()]
    const dateNum = date.getDate().toString().padStart(2, "0")
    return { day, dateNum }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Popup */}
      <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-w-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Adam Moreno</h3>
              <p className="text-xs text-gray-500">Founder</p>
            </div>
          </div>

          <h4 className="font-semibold text-gray-900 text-base mb-3 leading-tight">
            Join Our Next In-Person Scaling Workshop
          </h4>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            A small, private workshop hosted in-person where you'll receive personalized tactical advice on how to scale
            faster than the team that does it for Terramore.io
          </p>
        </div>

        {/* Date Selection */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 mb-4">
            {dates.map((date, index) => {
              const { day, dateNum } = formatDate(date)
              const isFirst = index === 0
              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(`${day} ${dateNum}`)}
                  className={`flex-1 py-3 px-2 rounded-lg text-center transition-colors ${
                    isFirst ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="text-xs font-medium">{day}</div>
                  <div className="text-sm font-semibold">{dateNum}</div>
                </button>
              )
            })}
          </div>

          {/* Action button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm"
            onClick={handleScheduleCall}
          >
            Schedule a 1-on-1 Call
          </Button>

          {/* Footer */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400">Powered by ⭐ Closed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
