import type { ReactElement } from 'react'

export interface EmailBrandConfig {
  // Sender Identity
  from: {
    name: string
    email: string
  }
  replyTo?: {
    name: string
    email: string
  }

  // Visual Branding
  branding: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    logoUrl: string
  }

  // Typography
  typography: {
    headingFont: string
    bodyFont: string
    headingWeight: number
    bodyWeight: number
  }

  // Footer
  footer?: {
    organizationName: string
    address?: string
    unsubscribeUrl?: string
    socialLinks?: {
      twitter?: string
      linkedin?: string
      facebook?: string
      instagram?: string
    }
  }

  // Base URL for email links
  baseUrl: string
}

export interface EmailTemplate<T = unknown> {
  name: string
  subject: string | ((data: T) => string)
  component: (
    props: T & {
      branding: EmailBrandConfig['branding']
      typography: EmailBrandConfig['typography']
      baseUrl: string
    }
  ) => ReactElement
}

export interface SendEmailOptions<T = unknown> {
  to: string | string[]
  template: EmailTemplate<T>
  data: T
  subject?: string // Override template subject
  from?: { name: string; email: string } // Override config from
  replyTo?: { name: string; email: string } // Override config replyTo
  priority?: 'normal' | 'high'
  cc?: string | string[]
  bcc?: string | string[]
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface BulkEmailResult {
  total: number
  succeeded: number
  failed: number
  results: Array<{
    status: 'fulfilled' | 'rejected'
    value?: EmailResult
    reason?: unknown
  }>
}
