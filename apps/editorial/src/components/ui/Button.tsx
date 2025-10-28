import { TYPOGRAPHY } from '@/lib/typography'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'general' | 'tertiary' | 'outlined' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text content */
  children: React.ReactNode
  /** Visual style variant */
  variant?: ButtonVariant
  /** Size variant */
  size?: ButtonSize
  /** Leading icon (Lucide icon component) */
  leadingIcon?: LucideIcon
  /** Trailing icon (Lucide icon component) */
  trailingIcon?: LucideIcon
  /** Custom background color (overrides variant) */
  backgroundColor?: string
  /** Custom text color (overrides variant) */
  textColor?: string
  /** Custom border color (overrides variant) */
  borderColor?: string
  /** Custom padding (overrides size) */
  padding?: string
  /** Additional className for custom styling */
  className?: string
  /** Full width button */
  fullWidth?: boolean
}

/**
 * Versatile button component with multiple variants and icon support
 *
 * @example
 * ```tsx
 * import { Download, ArrowRight } from 'lucide-react'
 *
 * <Button variant="primary" leadingIcon={Download}>
 *   Download
 * </Button>
 *
 * <Button variant="outlined" trailingIcon={ArrowRight}>
 *   Learn More
 * </Button>
 * ```
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  backgroundColor,
  textColor,
  borderColor,
  padding,
  className,
  fullWidth = false,
  disabled = false,
  ...props
}: ButtonProps) {
  // Size-based styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  // Icon size based on button size
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  // Variant-based styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 transition-colors',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 transition-colors',
    general: 'bg-black text-white hover:bg-primary transition-colors',
    tertiary:
      'bg-white text-black shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:text-black/50 transition-colors',
    outlined: 'bg-transparent text-black border border-black hover:bg-black/5 transition-colors',
    link: 'bg-transparent text-black/50 hover:text-black transition-colors border-none shadow-none p-0',
  }

  // Custom styles override variants
  const customStyles: React.CSSProperties = {}
  if (backgroundColor) customStyles.backgroundColor = backgroundColor
  if (textColor) customStyles.color = textColor
  if (borderColor) customStyles.borderColor = borderColor

  return (
    <button
      className={clsx(
        TYPOGRAPHY.button,
        // Base styles
        'inline-flex items-center justify-center gap-2 rounded-none transition-all',
        'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        // Variant styles (unless custom colors are provided)
        !backgroundColor && !textColor && !borderColor && variantStyles[variant],
        // Size styles (unless custom padding is provided)
        !padding && sizeStyles[size],
        // Width
        fullWidth && 'w-full',
        // Custom className
        className
      )}
      style={{
        ...customStyles,
        ...(padding && { padding }),
      }}
      disabled={disabled}
      {...props}
    >
      {/* Leading Icon */}
      {LeadingIcon && <LeadingIcon size={iconSize[size]} strokeWidth={1} className="shrink-0" />}

      {/* Label - translateY to compensate for font baseline */}
      <span className="leading-none translate-y-[-0.1em]">{children}</span>

      {/* Trailing Icon */}
      {TrailingIcon && <TrailingIcon size={iconSize[size]} strokeWidth={1} className="shrink-0" />}
    </button>
  )
}
