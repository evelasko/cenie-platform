import Link from 'next/link'
import { TYPOGRAPHY } from '@/lib/typography'

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  external?: boolean
}

export function CTAButton({
  href,
  children,
  variant = 'primary',
  external = false,
}: CTAButtonProps) {
  const baseStyles = `${TYPOGRAPHY.button} inline-block px-8 py-4 rounded-md transition-colors text-center`
  const variantStyles =
    variant === 'primary'
      ? 'bg-gray-900 text-white hover:bg-gray-700'
      : 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50'

  const className = `${baseStyles} ${variantStyles}`

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
