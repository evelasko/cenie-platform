import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  spacing?: 'normal' | 'large' | 'small'
}

export function Section({ children, className = '', spacing = 'normal' }: SectionProps) {
  const spacingClasses = {
    small: 'py-8',
    normal: 'py-12',
    large: 'py-16',
  }

  return <section className={`${spacingClasses[spacing]} ${className}`}>{children}</section>
}
