import { cn } from '@cenie/ui/lib'
import type { ReactNode } from 'react'

interface SiteContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'
}

export function SiteContainer({ children, className, as: Tag = 'div' }: SiteContainerProps) {
  return <Tag className={cn('site-container', className)}>{children}</Tag>
}
