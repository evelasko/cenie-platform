import type { EmailBrandConfig } from '@cenie/email'

export const hubEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Hub',
    email: process.env.EMAIL_FROM || 'noreply@hub.cenie.org',
  },
  replyTo: {
    name: 'CENIE Support',
    email: process.env.EMAIL_REPLY_TO || 'support@cenie.org',
  },

  branding: {
    primaryColor: '#f76808', // Hub orange
    backgroundColor: '#ffffff',
    textColor: '#0a0a0a',
    fontFamily: 'Gotham, -apple-system, sans-serif',
    logoUrl: 'https://cdn.cenie.org/hub/logo.png', // Update with real URL
  },

  typography: {
    headingFont: 'Gotham, sans-serif',
    bodyFont: 'Gotham, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'Centro de Estudios en Nuevas Inteligencias y Economías',
    unsubscribeUrl: 'https://hub.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },

  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://hub.cenie.org',
}

