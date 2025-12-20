export const AGENCY_CONFIG = {
  appName: 'agency' as const,
  displayName: 'CENIE Agency',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003',

  // OAuth redirect URLs
  oauth: {
    redirectTo: '/dashboard',
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
  },

  // Session configuration
  session: {
    cookieName: 'session',
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },

  // Role configuration
  defaultRole: 'client' as const,
  roles: {
    client: {
      displayName: 'Client',
      dashboardPath: '/dashboard',
      description: 'Access to templates and projects',
    },
    manager: {
      displayName: 'Template Manager',
      dashboardPath: '/dashboard/templates',
      description: 'Create and manage automation templates',
    },
    admin: {
      displayName: 'Administrator',
      dashboardPath: '/dashboard/admin',
      description: 'Full system administration',
    },
  },
} as const

