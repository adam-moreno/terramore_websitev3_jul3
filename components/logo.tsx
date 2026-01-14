"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const [animationStage, setAnimationStage] = useState<'small' | 'large' | 'normal'>('small')

  useEffect(() => {
    // Stage 1: Start small (immediate)
    // Stage 2: Enlarge after 300ms
    const enlargeTimer = setTimeout(() => {
      setAnimationStage('large')
    }, 300)

    // Stage 3: Return to normal after 1000ms (700ms after enlargement)
    const normalizeTimer = setTimeout(() => {
      setAnimationStage('normal')
    }, 1000)

    return () => {
      clearTimeout(enlargeTimer)
      clearTimeout(normalizeTimer)
    }
  }, [])

  const logoHeightClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  }

  const textImageHeightClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {/* Terramore Logo from Cloudinary with animation */}
      <img 
        src="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374924/Screenshot_2026-01-13_at_11_10_56_PM-Picsart-BackgroundRemover_dsdhua.png"
        alt="Terramore Logo"
        className={`${logoHeightClasses[size]} w-auto object-contain transition-transform duration-800 ease-out relative z-10 ${
          animationStage === 'small' ? 'scale-50' : 
          animationStage === 'large' ? 'scale-[2.5]' : 
          'scale-100'
        }`}
      />
      
      {/* Logo Text Image */}
      {showText && (
        <img 
          src="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374924/Screenshot_2026-01-13_at_11_11_07_PM-Picsart-BackgroundRemover_vwxvqo.png"
          alt="TERRAMORE.IO"
          className={`${textImageHeightClasses[size]} object-contain`}
        />
      )}
    </Link>
  )
} 