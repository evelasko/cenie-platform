import { createLogger, developmentPreset, productionPreset } from '@cenie/logger/server'

/**
 * Server-side logger instance for the hub app
 * Automatically uses development preset in dev, production preset in prod
 */
export const logger = createLogger(
  process.env.NODE_ENV === 'production'
    ? productionPreset('hub', { version: '0.1.0' })
    : developmentPreset('hub', { version: '0.1.0' })
)
