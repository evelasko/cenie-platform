import type { EmailBrandConfig } from '@cenie/email'

export const academyEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Academy',
    email: process.env.EMAIL_FROM || 'noreply@academy.cenie.org',
  },
  replyTo: {
    name: 'CENIE Academy Support',
    email: process.env.EMAIL_REPLY_TO || 'support@academy.cenie.org',
  },

  branding: {
    primaryColor: '#2563eb', // Academy blue
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    fontFamily: 'Geist, sans-serif',
    logoUrl: 'https://cdn.cenie.org/academy/logo.png', // Update with real URL
  },

  typography: {
    headingFont: 'Geist, sans-serif',
    bodyFont: 'Geist, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'CENIE Academy',
    unsubscribeUrl: 'https://academy.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },

  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://academy.cenie.org',
}

