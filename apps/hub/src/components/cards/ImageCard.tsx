"use client"

import clsx from 'clsx'
import Image from 'next/image'
import React, { useState, useEffect, useRef, useCallback } from 'react'

interface ImageCardProps {
  src: string
  alt: string
  children?: React.ReactNode
  variant?: 'framed' | 'clean'
  onClick?: () => void
  diableContentAnimation?: boolean
  className?: string
  useNoise?: boolean
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
  useNoise = false,
}: ImageCardProps) {
  // State for mobile tap toggle (only used when onClick is undefined on small screens)
  const [isMobileActive, setIsMobileActive] = useState(false)
  
  // Noise overlay refs and logic (only when useNoise is true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Noise generation functions
  const generateNoise = useCallback(() => {
    if (!useNoise) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = canvas
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // Generate random black and white noise
    for (let i = 0; i < data.length; i += 4) {
      // Apply some bias toward darker values for more realistic TV static
      const biasedValue = Math.pow(Math.random(), 2) * 255
      
      data[i] = biasedValue     // Red
      data[i + 1] = biasedValue // Green  
      data[i + 2] = biasedValue // Blue
      data[i + 3] = 255         // Alpha (fully opaque)
    }

    ctx.putImageData(imageData, 0, 0)
  }, [useNoise])

  const resizeCanvas = useCallback(() => {
    if (!useNoise) return
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    // Set canvas size to match container
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    
    // Set canvas display size to match actual size
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
  }, [useNoise])

  // Noise animation effect
  useEffect(() => {
    if (!useNoise) return

    // Initial setup
    resizeCanvas()
    generateNoise()

    // Generate new noise 12 times per second
    const animationInterval = setInterval(generateNoise, 1000 / 12)

    // Handle window resize
    const handleResize = () => {
      resizeCanvas()
      generateNoise()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(animationInterval)
      window.removeEventListener("resize", handleResize)
    }
  }, [useNoise, generateNoise, resizeCanvas])
  
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
        
        {/* Noise Overlays (conditional) */}
        {useNoise && (
          <>
            {/* Dark noise overlay */}
            <div className="absolute inset-0 bg-black/30 z-[15] pointer-events-none" />
            
            {/* Canvas noise overlay */}
            <div className="absolute inset-0 z-[20] overflow-hidden pointer-events-none">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-[0.10] mix-blend-overlay"
                style={{
                  filter: "contrast(1.5) brightness(0.8)",
                  pointerEvents: "none",
                }}
              />
            </div>
            
            {/* Static PNG noise overlay */}
            <div className="absolute inset-0 z-[21] overflow-hidden pointer-events-none">
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "url('/media/graphics/noise.png')",
                  backgroundRepeat: "repeat",
                  backgroundSize: "128px 128px",
                  animation: "noise-flicker 0.143s infinite steps(1)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </>
        )}
        
        {/* Content Layer */}
        {children && (
          <div className={clsx(
            "absolute inset-0 z-30",
            // Only apply transition and timing when doing built-in content animation
            !diableContentAnimation && "transition-transform",
            !diableContentAnimation && animationDetails,
            // Large screen hover animations (md:group-hover)
            !diableContentAnimation && "md:group-hover:scale-[0.8]",
            // Small screen tap animations (only when onClick is undefined)
            !onClick && !diableContentAnimation && isMobileActive && "max-md:scale-[0.8]"
          )}>
            {children}
          </div>
        )}
      </div>
      
      {/* CSS for noise animation (only included when useNoise is true) */}
      {useNoise && (
        <style jsx>{`
          @keyframes noise-flicker {
            0% { transform: translate(0px, 0px); }
            14.3% { transform: translate(-2px, 1px); }
            28.6% { transform: translate(1px, -3px); }
            42.9% { transform: translate(3px, 2px); }
            57.1% { transform: translate(-1px, -1px); }
            71.4% { transform: translate(2px, -2px); }
            85.7% { transform: translate(-3px, 1px); }
            100% { transform: translate(1px, 3px); }
          }
        `}</style>
      )}
    </div>
  )
}