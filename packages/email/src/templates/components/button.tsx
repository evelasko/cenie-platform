import { Button as ReactEmailButton } from '@react-email/components'
import type { ReactNode } from 'react'

interface EmailButtonProps {
  href: string
  children: ReactNode
  primaryColor: string
}

export const EmailButton = ({ href, children, primaryColor }: EmailButtonProps) => {
  return (
    <ReactEmailButton
      href={href}
      style={{
        backgroundColor: primaryColor,
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      {children}
    </ReactEmailButton>
  )
}
