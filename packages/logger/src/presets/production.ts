import type { LoggerConfig } from '../core/types'
import { LogLevel } from '../core/types'
import { ConsoleTransport } from '../transports/console'

/**
 * Production preset configuration
 * - INFO level logging (less verbose)
 * - JSON formatted output (for log aggregation)
 * - Console transport
 */
export function productionPreset(name: string, context?: Record<string, any>): LoggerConfig {
  return {
    name,
    level: LogLevel.INFO,
    environment: 'production',
    context,
    transports: [new ConsoleTransport({ prettyPrint: false })],
    prettyPrint: false,
  }
}
