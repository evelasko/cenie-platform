import type { LoggerConfig } from '../core/types';
/**
 * Testing preset configuration
 * - WARN level (minimal output during tests)
 * - No transports (silent by default)
 * - Can be overridden for specific tests
 */
export declare function testingPreset(name: string, context?: Record<string, any>): LoggerConfig;
