import clsx from 'clsx'
import Image from 'next/image'
import React, { useState } from 'react'

interface ImageCardProps {
  src: string
  alt: string
  children?: React.ReactNode
  variant?: 'framed' | 'clean'
  onClick?: () => void
  diableContentAnimation?: boolean
  className?: string
}

export const animationDetails = 'duration-500 ease-[cubic-bezier(0.9,0,0.9,1)]'

export default function ImageCard({ 
  src, 
  alt, 
  children, 
  variant = 'framed',
  onClick,
  diableContentAnimation = false,
  className,
}: ImageCardProps) {
  // State for mobile tap toggle (only used when onClick is undefined on small screens)
  const [isMobileActive, setIsMobileActive] = useState(false)
  
  const handleClick = () => {
    if (onClick) {
      // If onClick is defined, just call it (works for both large and small screens)
      onClick()
    } else {
      // If onClick is undefined, toggle mobile animation state (only affects small screens)
      setIsMobileActive(prev => !prev)
    }
  }

  return (
    <div className={clsx(
        "w-full h-full group radius-lg cursor-pointer",
        className,
        // Background: white for framed variant, transparent for clean variant
        variant === 'framed' && "bg-white"
      )}
      onClick={handleClick}
      >
      {/* Image Container - scales from 99% to 100% to create frame effect */}
      <div className={clsx(
        "relative w-full h-full radius-lg overflow-hidden transition-all",
        animationDetails,
        // Scale animation for framed variant: smaller initially, full size on hover
        variant === 'framed' && "scale-[0.99] md:group-hover:scale-100",
        // Small screen tap animations (only when onClick is undefined)
        !onClick && isMobileActive && variant === 'framed' && "max-md:scale-100"
      )}>
        {/* Image */}
        <div className={clsx(
            "absolute inset-0 transition-all",
            animationDetails,
            // Image scale and blur effects (same for both variants)
            "md:group-hover:scale-[1.13] md:group-hover:blur-[7px]",
            // Small screen tap animations (only when onClick is undefined)
            !onClick && isMobileActive && "max-md:scale-[1.13] max-md:blur-[7px]"
        )}>
          <Image 
            src={src} 
            alt={alt}
            fill
            className="object-cover radius-lg"
          />
        </div>
        
        {/* Blackout Overlay */}
        <div className={clsx(
          "absolute inset-0 bg-black transition-opacity",
          animationDetails,
          // Large screen hover animations (md:group-hover)
          "opacity-15 md:group-hover:opacity-20",
          // Small screen tap animations (only when onClick is undefined)
          !onClick && isMobileActive && "max-md:opacity-20"
        )} />
        
        {/* Content Layer */}
        {children && (
          <div className={clsx(
            "absolute inset-0 z-10 transition-transform",
            animationDetails,
            // Large screen hover animations (md:group-hover)
            !diableContentAnimation && "md:group-hover:scale-[0.8]",
            // Small screen tap animations (only when onClick is undefined)
            !onClick && !diableContentAnimation && isMobileActive && "max-md:scale-[0.8]"
          )}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}