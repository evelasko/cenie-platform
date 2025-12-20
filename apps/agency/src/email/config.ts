import type { EmailBrandConfig } from '@cenie/email'

export const agencyEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE AGENCY',
    email: process.env.EMAIL_FROM || 'noreply@agency.cenie.org',
  },
  replyTo: {
    name: 'CENIE Agency Support',
    email: process.env.EMAIL_REPLY_TO || 'support@agency.cenie.org',
  },

  branding: {
    primaryColor: '#0f172a', // Slate-900
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://cdn.cenie.org/agency/logo.png', // Update with real URL
  },

  typography: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'CENIE AGENCY',
    unsubscribeUrl: 'https://agency.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },

  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://agency.cenie.org',
}

