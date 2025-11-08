import type { LoggerConfig } from '../core/types';
/**
 * Development preset configuration
 * - DEBUG level logging
 * - Pretty printed output
 * - Console transport
 */
export declare function developmentPreset(name: string, context?: Record<string, any>): LoggerConfig;
