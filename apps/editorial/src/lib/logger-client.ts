import { createLogger, developmentPreset, productionPreset } from '@cenie/logger/client'

/**
 * Client-side logger instance for the editorial app
 * Automatically uses development preset in dev, production preset in prod
 */
export const logger = createLogger(
  process.env.NODE_ENV === 'production'
    ? productionPreset('editorial:client', { version: '0.1.0' })
    : developmentPreset('editorial:client', { version: '0.1.0' })
)

