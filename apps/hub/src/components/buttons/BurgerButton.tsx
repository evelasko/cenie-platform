"use client"

import clsx from 'clsx'

interface BurgerButtonProps {
  isOpen: boolean
  onClick: () => void
  width?: number // Width in pixels, defaults to 32 (w-8)
  height?: number // Height in pixels, defaults to 32 (h-8)
}

export default function BurgerButton({ isOpen, onClick, width = 32, height = 32 }: BurgerButtonProps) {
  const lineWidth = Math.max(24, width * 0.75) // Line width is 75% of button width, minimum 24px
  
  // Calculate optimal rotation angle to prevent overflow
  // The diagonal of the rotated line should not exceed the button height
  // For a line of width W rotated by angle θ, the height becomes W * sin(θ)
  // We want W * sin(θ) ≤ height, so θ ≤ arcsin(height / W)
  const maxRotationRadians = Math.asin(Math.min(1, height / lineWidth))
  const maxRotationDegrees = (maxRotationRadians * 180) / Math.PI
  
  // Use the smaller of 45° or the calculated maximum to ensure no overflow
  const rotationAngle = Math.min(45, maxRotationDegrees)
  
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative flex flex-col justify-center items-center rounded-sm group",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-label="Toggle menu"
    >
      <span
        className={clsx(
          "absolute block h-0.5 transition-all duration-300 ease-in-out",
          "bg-[color:var(--color-nav-text)] group-hover:bg-[color:var(--color-nav-hover)]",
          {
            "bg-[color:var(--color-nav-hover)]": isOpen,
            "-translate-y-1": !isOpen
          }
        )}
        style={{ 
          transformOrigin: 'center',
          width: `${lineWidth}px`,
          transform: isOpen ? `rotate(${rotationAngle}deg)` : !isOpen ? 'translateY(-4px)' : undefined
        }}
      />
      <span
        className={clsx(
          "absolute block h-0.5 transition-all duration-300 ease-in-out",
          "bg-[color:var(--color-nav-text)] group-hover:bg-[color:var(--color-nav-hover)]",
          {
            "bg-[color:var(--color-nav-hover)]": isOpen,
            "translate-y-1": !isOpen
          }
        )}
        style={{ 
          transformOrigin: 'center',
          width: `${lineWidth}px`,
          transform: isOpen ? `rotate(-${rotationAngle}deg)` : !isOpen ? 'translateY(4px)' : undefined
        }}
      />
    </button>
  )
}