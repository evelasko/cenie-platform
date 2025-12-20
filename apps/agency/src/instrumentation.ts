import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA,
      
      // Integrations
      integrations: [
        Sentry.httpIntegration(),
      ],
      
      // Before sending, sanitize PII
      beforeSend(event, hint) {
        // Remove sensitive data
        if (event.request?.headers) {
          delete event.request.headers.authorization
          delete event.request.headers.cookie
        }
        return event
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime initialization (if needed)
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
    })
  }
}

