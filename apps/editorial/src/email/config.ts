import type { EmailBrandConfig } from '@cenie/email'

export const editorialEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Editorial',
    email: process.env.EMAIL_FROM || 'noreply@editorial.cenie.org',
  },
  replyTo: {
    name: 'CENIE Editorial Support',
    email: process.env.EMAIL_REPLY_TO || 'support@editorial.cenie.org',
  },

  branding: {
    primaryColor: 'oklch(0.4732 0.1247 46.2007)', // Warm earth tone
    backgroundColor: '#ffffff',
    textColor: 'oklch(0.2686 0 0)',
    fontFamily: 'Barlow, serif',
    logoUrl: 'https://cdn.cenie.org/editorial/logo.png', // Update with real URL
  },

  typography: {
    headingFont: 'Anziano, serif', // Editorial uses serif!
    bodyFont: 'Barlow, sans-serif',
    headingWeight: 400,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'CENIE Editorial',
    unsubscribeUrl: 'https://editorial.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },

  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://editorial.cenie.org',
}

