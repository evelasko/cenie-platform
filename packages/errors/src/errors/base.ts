import type { ILogger } from '@cenie/logger'
import { logContext } from '@cenie/logger/context'

import type { ErrorCode, ErrorSeverity, ErrorMetadata, ErrorOptions } from '../types'

/**
 * Base error class for all application errors
 * Extends Error with additional context and metadata
 */
export abstract class AppError extends Error {
  readonly code: ErrorCode
  readonly statusCode: number
  readonly severity: ErrorSeverity
  readonly userMessage: string
  readonly details?: string
  readonly metadata: ErrorMetadata
  readonly retryable: boolean
  readonly timestamp: Date
  readonly requestId?: string

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    severity: ErrorSeverity,
    options: ErrorOptions = {}
  ) {
    super(message)

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.severity = severity
    this.userMessage = options.userMessage || message
    this.details = options.details
    this.metadata = options.metadata || {}
    this.retryable = options.retryable ?? false
    this.timestamp = new Date()

    // Capture request ID from log context
    this.requestId = logContext.get('requestId')

    // Preserve cause chain
    if (options.cause) {
      this.cause = options.cause
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.retryable
  }

  /**
   * Get user-safe error message
   */
  getUserMessage(): string {
    return this.userMessage
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON(): Record<string, any> {
    return {
      code: this.code,
      message: this.userMessage,
      statusCode: this.statusCode,
      requestId: this.requestId,
      ...(process.env.NODE_ENV === 'development' && {
        details: this.details || this.message,
        timestamp: this.timestamp.toISOString(),
        stack: this.stack,
      }),
    }
  }

  /**
   * Get log level based on severity
   */
  getLogLevel(): 'debug' | 'info' | 'warn' | 'error' | 'fatal' {
    switch (this.severity) {
      case 'low':
        return 'debug'
      case 'medium':
        return 'info'
      case 'high':
        return 'warn'
      case 'critical':
        return 'error'
      default:
        return 'error'
    }
  }

  /**
   * Log this error using the provided logger
   */
  log(logger: ILogger): void {
    const level = this.getLogLevel()
    const method = level === 'error' || level === 'fatal' ? 'error' : level

    logger[method](this.message, this.cause instanceof Error ? this.cause : undefined, {
      code: this.code,
      statusCode: this.statusCode,
      severity: this.severity,
      ...this.metadata,
    })
  }
}
