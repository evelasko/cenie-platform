import type { LoggerConfig } from '../core/types'
import { LogLevel } from '../core/types'
import { ConsoleTransport } from '../transports/console'

/**
 * Development preset configuration
 * - DEBUG level logging
 * - Pretty printed output
 * - Console transport
 */
export function developmentPreset(name: string, context?: Record<string, any>): LoggerConfig {
  return {
    name,
    level: LogLevel.DEBUG,
    environment: 'development',
    context,
    transports: [new ConsoleTransport({ prettyPrint: true })],
    prettyPrint: true,
  }
}
