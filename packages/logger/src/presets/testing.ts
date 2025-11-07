import type { LoggerConfig } from '../core/types'
import { LogLevel } from '../core/types'

/**
 * Testing preset configuration
 * - WARN level (minimal output during tests)
 * - No transports (silent by default)
 * - Can be overridden for specific tests
 */
export function testingPreset(name: string, context?: Record<string, any>): LoggerConfig {
  return {
    name,
    level: LogLevel.WARN,
    environment: 'test',
    context,
    transports: [], // Silent by default
    prettyPrint: false,
  }
}
