import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  /**
   * Logo variant - full includes text, icon is just the symbol
   */
  variant?: 'full' | 'icon'

  /**
   * Size of the logo
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Whether to wrap in a link to home page
   */
  linkToHome?: boolean

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Show dark mode version (if available)
   */
  darkMode?: boolean
}

const sizeMap = {
  sm: { width: 80, height: 32 },
  md: { width: 120, height: 48 },
  lg: { width: 160, height: 64 },
  xl: { width: 200, height: 80 },
}

export function Logo({
  variant = 'full',
  size = 'md',
  linkToHome = true,
  className = '',
  darkMode = false
}: LogoProps) {
  const dimensions = sizeMap[size]

  // Fallback to text-based logo if image doesn't exist
  const TextLogo = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-xl">JB</span>
      </div>

      {/* Text (only in full variant) */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Julius Baer
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            AML Platform
          </span>
        </div>
      )}
    </div>
  )

  const ImageLogo = () => {
    // Use the actual Julius Baer logo
    // For icon variant, we'll show a cropped/centered portion
    const logoPath = variant === 'icon'
      ? '/julius-baer-logo.jpeg' // Will handle icon display with CSS
      : '/julius-baer-logo.jpeg'

    // Adjust dimensions based on variant
    // Original image is 1280x251 (aspect ratio ~5:1)
    const actualDimensions = variant === 'icon'
      ? { width: dimensions.height, height: dimensions.height } // Square for icon
      : dimensions

    return (
      <div className={`relative ${className}`} style={{
        width: actualDimensions.width,
        height: actualDimensions.height
      }}>
        <Image
          src={logoPath}
          alt="Julius Baer Logo"
          fill
          className={variant === 'icon' ? 'object-contain' : 'object-contain'}
          priority
          sizes={`${actualDimensions.width}px`}
        />
      </div>
    )
  }

  const LogoComponent = () => {
    // Use the Julius Baer image logo
    return <ImageLogo />
  }

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block">
        <LogoComponent />
      </Link>
    )
  }

  return <LogoComponent />
}

/**
 * Usage examples:
 *
 * // Full logo with default size
 * <Logo />
 *
 * // Icon only, large size
 * <Logo variant="icon" size="lg" />
 *
 * // Without link to home
 * <Logo linkToHome={false} />
 *
 * // Custom styling
 * <Logo className="opacity-80 hover:opacity-100" />
 *
 * // Dark mode
 * <Logo darkMode />
 */
