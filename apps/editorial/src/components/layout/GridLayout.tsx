import { cn } from '@cenie/ui/lib'
import type { ReactNode } from 'react'

interface GridLayoutProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'main'
}

export function GridLayout({ children, className, as: Tag = 'div' }: GridLayoutProps) {
  return <Tag className={cn('grid-layout', className)}>{children}</Tag>
}
