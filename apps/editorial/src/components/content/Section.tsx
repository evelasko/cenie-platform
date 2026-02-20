import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg' | 'none'
}

export function Section({ children, className = '', spacing = 'md' }: SectionProps) {
  const spacingClasses = {
    sm: 'py-16',
    md: 'py-24',
    lg: 'py-30',
    none: '',
  }

  return <section className={`${spacingClasses[spacing]} ${className}`}>{children}</section>
}
