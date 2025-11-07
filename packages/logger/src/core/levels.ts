import { LogLevel, type LogLevelName } from './types'

/**
 * Map log level names to numeric values
 */
export const LOG_LEVEL_MAP: Record<LogLevelName, LogLevel> = {
  trace: LogLevel.TRACE,
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  fatal: LogLevel.FATAL,
}

/**
 * Map numeric log levels to names
 */
export const LOG_LEVEL_NAMES: Record<LogLevel, LogLevelName> = {
  [LogLevel.TRACE]: 'trace',
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.INFO]: 'info',
  [LogLevel.WARN]: 'warn',
  [LogLevel.ERROR]: 'error',
  [LogLevel.FATAL]: 'fatal',
}

/**
 * Convert log level name or number to LogLevel enum
 */
export function parseLogLevel(level: LogLevel | LogLevelName | string): LogLevel {
  if (typeof level === 'number') {
    return level
  }

  const levelName = level.toLowerCase() as LogLevelName
  return LOG_LEVEL_MAP[levelName] ?? LogLevel.INFO
}

/**
 * Get log level name from numeric level
 */
export function getLogLevelName(level: LogLevel): LogLevelName {
  return LOG_LEVEL_NAMES[level] ?? 'info'
}

/**
 * Check if a log level should be logged based on minimum level
 */
export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return level >= minLevel
}
