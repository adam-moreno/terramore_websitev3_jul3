"use client"

interface CalendlyPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendlyPopup({ isOpen, onClose }: CalendlyPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl h-[600px] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white shadow-sm"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Schedule Your Strategy Call</h3>
          <p className="text-sm text-gray-600 mt-1">Book a free consultation to discuss your business goals</p>
        </div>
        
        {/* Embedded Calendly Widget */}
        <div className="w-full h-full">
          <iframe
            src="https://calendly.com/terramore/30min"
            className="w-full h-full border-0"
            title="Schedule Appointment"
            allow="camera; microphone; geolocation"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  )
} 