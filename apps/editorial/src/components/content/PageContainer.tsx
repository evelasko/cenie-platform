import { ReactNode } from 'react'
import { SiteContainer } from '@/components/layout/SiteContainer'
import { GridLayout } from '@/components/layout/GridLayout'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <SiteContainer className={className}>
      <GridLayout>
        <div className="content-narrow">{children}</div>
      </GridLayout>
    </SiteContainer>
  )
}
