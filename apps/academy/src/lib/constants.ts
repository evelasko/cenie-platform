export const ACADEMY_CONFIG = {
  appName: 'academy' as const,
  displayName: 'CENIE Academy',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',

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
  defaultRole: 'student' as const,
  roles: {
    student: {
      displayName: 'Student',
      dashboardPath: '/dashboard',
    },
    instructor: {
      displayName: 'Instructor',
      dashboardPath: '/dashboard/courses',
    },
    admin: {
      displayName: 'Administrator',
      dashboardPath: '/dashboard/admin',
    },
  },
} as const

