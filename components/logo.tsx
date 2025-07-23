import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon - Using a simple SVG for reliability */}
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold`}>
        <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}>
          T
        </span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${textSizes[size]}`}>
          TERRAMORE.IO
        </span>
      )}
    </Link>
  )
} 