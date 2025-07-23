"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FounderPhoto {
  src: string
  alt: string
  description?: string
  orientation?: 'portrait' | 'landscape'
}

interface FounderPhotoCarouselProps {
  photos: FounderPhoto[]
  autoRotate?: boolean
  rotationInterval?: number
}

export function FounderPhotoCarousel({ 
  photos, 
  autoRotate = true, 
  rotationInterval = 5000 
}: FounderPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!autoRotate || isHovering) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, isHovering, rotationInterval, photos.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (photos.length === 0) {
    return (
      <div className="w-full max-w-md h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full max-w-md mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 transform scale-100'
                : 'opacity-0 transform scale-95'
            }`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className={`w-full h-full ${
                photo.orientation === 'landscape' 
                  ? 'object-contain bg-gray-100' 
                  : 'object-contain bg-gray-100'
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
            {photo.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                <p className="text-sm">{photo.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {photos.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Photo Counter */}
      {photos.length > 1 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {currentIndex + 1} of {photos.length}
        </div>
      )}
    </div>
  )
} 