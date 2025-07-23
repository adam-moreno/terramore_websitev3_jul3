import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {/* Terramore Logo from Cloudinary */}
      <img 
        src="https://res.cloudinary.com/dx7id04uv/image/upload/v1753313070/Screenshot_2025-07-23_at_4.21.18_PM_1_dxk0j8.png"
        alt="Terramore Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${textSizes[size]}`}>
          TERRAMORE.IO
        </span>
      )}
    </Link>
  )
} 