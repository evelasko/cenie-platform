import { LogLevel, type LogLevelName } from './types';
/**
 * Map log level names to numeric values
 */
export declare const LOG_LEVEL_MAP: Record<LogLevelName, LogLevel>;
/**
 * Map numeric log levels to names
 */
export declare const LOG_LEVEL_NAMES: Record<LogLevel, LogLevelName>;
/**
 * Convert log level name or number to LogLevel enum
 */
export declare function parseLogLevel(level: LogLevel | LogLevelName | string): LogLevel;
/**
 * Get log level name from numeric level
 */
export declare function getLogLevelName(level: LogLevel): LogLevelName;
/**
 * Check if a log level should be logged based on minimum level
 */
export declare function shouldLog(level: LogLevel, minLevel: LogLevel): boolean;
