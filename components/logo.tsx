"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  animate?: boolean
  /** White artwork on dark bars vs black artwork on light bars. */
  on?: "dark" | "light"
}

export function Logo({
  size = 'md',
  showText = true,
  className = '',
  animate = true,
  on = "dark",
}: LogoProps) {
  const [animationStage, setAnimationStage] = useState<'small' | 'large' | 'normal'>(
    animate ? 'small' : 'normal'
  )

  useEffect(() => {
    if (!animate) return

    const enlargeTimer = setTimeout(() => {
      setAnimationStage('large')
    }, 300)

    const normalizeTimer = setTimeout(() => {
      setAnimationStage('normal')
    }, 1000)

    return () => {
      clearTimeout(enlargeTimer)
      clearTimeout(normalizeTimer)
    }
  }, [animate])

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

  const invert = on === "light" ? "brightness-0" : ""

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374924/Screenshot_2026-01-13_at_11_10_56_PM-Picsart-BackgroundRemover_dsdhua.png"
        alt="Terramore Logo"
        className={`${logoHeightClasses[size]} w-auto object-contain transition-transform duration-800 ease-out relative z-10 ${invert} ${
          animationStage === 'small' ? 'scale-50' : 
          animationStage === 'large' ? 'scale-[2.5]' : 
          'scale-100'
        }`}
      />
      
      {showText && (
        <img 
          src="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374924/Screenshot_2026-01-13_at_11_11_07_PM-Picsart-BackgroundRemover_vwxvqo.png"
          alt="TERRAMORE.IO"
          className={`${textImageHeightClasses[size]} object-contain ${invert}`}
        />
      )}
    </Link>
  )
} 