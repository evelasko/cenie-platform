import type { LoggerConfig } from '../core/types';
/**
 * Production preset configuration
 * - INFO level logging (less verbose)
 * - JSON formatted output (for log aggregation)
 * - Console transport
 */
export declare function productionPreset(name: string, context?: Record<string, any>): LoggerConfig;
