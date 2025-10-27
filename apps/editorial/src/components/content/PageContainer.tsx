import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return <div className={`container mx-auto px-6 py-12 max-w-4xl ${className}`}>{children}</div>
}
