import { createLogger, developmentPreset, productionPreset } from '@cenie/logger/server'
import { SentryTransport } from '@cenie/sentry'

/**
 * Server-side logger instance for the agency app
 * Automatically uses development preset in dev, production preset in prod
 * Adds Sentry transport if DSN is configured
 */
const baseConfig = process.env.NODE_ENV === 'production'
  ? productionPreset('agency', { version: '0.1.0' })
  : developmentPreset('agency', { version: '0.1.0' })

// Add Sentry transport if DSN is available
const transports = [...(baseConfig.transports || [])]
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  transports.push(
    new SentryTransport({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.VERCEL_GIT_COMMIT_SHA,
    })
  )
}

export const logger = createLogger({
  ...baseConfig,
  transports,
})

