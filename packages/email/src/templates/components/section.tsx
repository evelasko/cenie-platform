import { Section as ReactEmailSection } from '@react-email/components'
import type { ReactNode } from 'react'

interface EmailSectionProps {
  children: ReactNode
  backgroundColor?: string
  padding?: string
}

export const EmailSection = ({
  children,
  backgroundColor,
  padding = '24px',
}: EmailSectionProps) => {
  return (
    <ReactEmailSection
      style={{
        backgroundColor,
        padding,
        borderRadius: '8px',
        marginBottom: '24px',
      }}
    >
      {children}
    </ReactEmailSection>
  )
}
