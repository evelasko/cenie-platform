'use client'

import clsx from 'clsx'
import { useRef, useEffect } from 'react'

interface MediaHeroProps {
  backgroundVideo?: string
  backgroundClassName?: string
  children: React.ReactNode
  backgroundVideoPoster?: string
}

export default function MediaHero({
  backgroundVideo,
  backgroundClassName,
  children,
  backgroundVideoPoster,
}: MediaHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Noise generation effect (extracted from NoiseOverlay component)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const generateNoise = () => {
      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      // Generate random black and white noise
      for (let i = 0; i < data.length; i += 4) {
        // Apply some bias toward darker values for more realistic TV static
        const biasedValue = Math.pow(Math.random(), 2) * 255

        data[i] = biasedValue // Red
        data[i + 1] = biasedValue // Green
        data[i + 2] = biasedValue // Blue
        data[i + 3] = 255 // Alpha (fully opaque)
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      // Set canvas size to match container
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Set canvas display size to match actual size
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    // Initial setup
    resizeCanvas()
    generateNoise()

    // Generate new noise 12 times per second (same as NoiseOverlay)
    const animationInterval = setInterval(generateNoise, 1000 / 12)

    // Handle window resize
    const handleResize = () => {
      resizeCanvas()
      generateNoise()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(animationInterval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center radius-lg w-full pb-1 relative hero-height-mobile z-10',
        backgroundVideo,
        backgroundClassName
      )}
    >
      {/* Background video layer */}
      {backgroundVideo && (
        <video
          className="absolute inset-0 radius-lg z-[1] w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={backgroundVideoPoster}
          preload="auto"
          style={{
            backgroundColor: 'var(--color-neutral-50)',
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Dark overlay (same as NoiseOverlay) */}
      <div className="absolute inset-0 radius-lg bg-black/30 z-[2] pointer-events-none" />

      {/* Canvas noise overlay (same as NoiseOverlay) */}
      <div className="absolute inset-0 radius-lg z-[3] overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-[0.10] mix-blend-overlay radius-lg"
          style={{
            filter: 'contrast(1.5) brightness(0.8)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Additional static noise layer using the PNG for texture variation (same as NoiseOverlay) */}
      <div className="absolute inset-0 radius-lg z-[4] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03] radius-lg"
          style={{
            backgroundImage: "url('/media/graphics/noise.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
            animation: 'hero-noise-flicker 0.143s infinite steps(1)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative w-full z-[5]">{children}</div>

      {/* Noise flicker animation keyframes (same as NoiseOverlay) */}
      <style jsx>{`
        @keyframes hero-noise-flicker {
          0% {
            transform: translate(0px, 0px);
          }
          14.3% {
            transform: translate(-2px, 1px);
          }
          28.6% {
            transform: translate(1px, -3px);
          }
          42.9% {
            transform: translate(3px, 2px);
          }
          57.1% {
            transform: translate(-1px, -1px);
          }
          71.4% {
            transform: translate(2px, -2px);
          }
          85.7% {
            transform: translate(-3px, 1px);
          }
          100% {
            transform: translate(1px, 3px);
          }
        }
      `}</style>
    </div>
  )
}
