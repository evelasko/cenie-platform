import { createLogger, developmentPreset, productionPreset } from '@cenie/logger/client'

/**
 * Client-side logger instance for the academy app
 * Automatically uses development preset in dev, production preset in prod
 */
export const logger = createLogger(
  process.env.NODE_ENV === 'production'
    ? productionPreset('academy:client', { version: '0.1.0' })
    : developmentPreset('academy:client', { version: '0.1.0' })
)

