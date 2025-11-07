/* eslint-disable @typescript-eslint/no-explicit-any */
import { logContext } from '../context/async-context'
import { sanitize, DEFAULT_REDACT_FIELDS } from '../utils/sanitizer'
import { serialize, serializeError } from '../utils/serializer'

import { parseLogLevel, getLogLevelName, shouldLog } from './levels'
import type {
  LoggerConfig,
  ILogger,
  LogEntry,
  LogContext,
  Transport,
  Environment,
  LogLevelName,
} from './types'
import { LogLevel } from './types'

/**
 * Core Logger implementation
 */
export class Logger implements ILogger {
  private readonly name: string
  private readonly level: LogLevel
  private readonly environment: Environment
  private readonly transports: Transport[]
  private readonly redactFields: string[]
  private readonly prettyPrint: boolean
  private readonly defaultContext: Record<string, any>

  constructor(config: LoggerConfig) {
    this.name = config.name
    this.level = parseLogLevel(config.level ?? LogLevel.INFO)
    this.environment = config.environment ?? this.detectEnvironment()
    this.transports = config.transports ?? []
    this.redactFields = [...DEFAULT_REDACT_FIELDS, ...(config.redact ?? [])]
    this.prettyPrint = config.prettyPrint ?? this.environment === 'development'
    this.defaultContext = config.context ?? {}
  }

  /**
   * Detect environment from NODE_ENV
   */
  private detectEnvironment(): Environment {
    const env = process.env.NODE_ENV
    if (env === 'production') return 'production'
    if (env === 'test') return 'test'
    return 'development'
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevelName,
    message: string,
    error?: any,
    metadata?: any
  ): LogEntry {
    // Build context from multiple sources
    const asyncContext = logContext.getAll()
    const context: LogContext = {
      app: this.name,
      environment: this.environment,
      ...this.defaultContext,
      ...asyncContext,
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    // Add error if provided
    if (error) {
      entry.error = serializeError(error)
    }

    // Add metadata if provided
    if (metadata) {
      const serialized = serialize(metadata)
      entry.metadata = sanitize(serialized, this.redactFields)
    }

    return entry
  }

  /**
   * Write log entry to all transports
   */
  private async write(entry: LogEntry): Promise<void> {
    const promises = this.transports.map((transport) => transport.write(entry))
    await Promise.all(promises)
  }

  /**
   * Log at a specific level
   */
  private log(level: LogLevel, message: string, error?: any, metadata?: any): void {
    if (!shouldLog(level, this.level)) {
      return
    }

    const levelName = getLogLevelName(level)
    const entry = this.createLogEntry(levelName, message, error, metadata)

    // Write to transports (async but don't block)
    void this.write(entry)
  }

  /**
   * TRACE level logging
   */
  trace(message: string, metadata?: any): void {
    this.log(LogLevel.TRACE, message, undefined, metadata)
  }

  /**
   * DEBUG level logging
   */
  debug(message: string, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, undefined, metadata)
  }

  /**
   * INFO level logging
   */
  info(message: string, metadata?: any): void {
    this.log(LogLevel.INFO, message, undefined, metadata)
  }

  /**
   * WARN level logging
   */
  warn(message: string, metadata?: any): void {
    this.log(LogLevel.WARN, message, undefined, metadata)
  }

  /**
   * ERROR level logging
   */
  error(message: string, error?: any, metadata?: any): void {
    this.log(LogLevel.ERROR, message, error, metadata)
  }

  /**
   * FATAL level logging
   */
  fatal(message: string, error?: any, metadata?: any): void {
    this.log(LogLevel.FATAL, message, error, metadata)
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): ILogger {
    return new Logger({
      name: this.name,
      level: this.level,
      environment: this.environment,
      context: { ...this.defaultContext, ...context },
      transports: this.transports,
      redact: this.redactFields,
      prettyPrint: this.prettyPrint,
    })
  }

  /**
   * Flush all transports
   */
  async flush(): Promise<void> {
    const promises = this.transports.filter((t) => t.flush).map((t) => t.flush!())
    await Promise.all(promises)
  }

  /**
   * Close all transports
   */
  async close(): Promise<void> {
    const promises = this.transports.filter((t) => t.close).map((t) => t.close!())
    await Promise.all(promises)
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(config: LoggerConfig): ILogger {
  return new Logger(config)
}
