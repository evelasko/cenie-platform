import * as Sentry from '@sentry/nextjs'
import type { LogEntry, Transport, ErrorInfo } from '@cenie/logger'
import type { SentryTransportOptions } from './types'

/**
 * Sentry transport for @cenie/logger
 * Sends logs to Sentry based on log level:
 * - error/fatal → Sentry errors
 * - warn → Sentry warnings
 * - info/debug → Sentry breadcrumbs
 */
export class SentryTransport implements Transport {
  private options: SentryTransportOptions
  private initialized: boolean = false

  constructor(options: SentryTransportOptions) {
    this.options = {
      enabled: true,
      sampleRate: 0.1, // 10% performance traces
      ...options,
    }

    // Only initialize if enabled and DSN provided
    if (this.options.enabled && this.options.dsn) {
      this.initialize()
    }
  }

  private initialize(): void {
    if (this.initialized) return

    Sentry.init({
      dsn: this.options.dsn,
      environment: this.options.environment || process.env.NODE_ENV,
      release: this.options.release || process.env.VERCEL_GIT_COMMIT_SHA,
      tracesSampleRate: this.options.sampleRate,
      
      // Don't capture console.log as breadcrumbs (we handle this explicitly)
      // replayIntegration is client-side only; conditionally include it
      integrations: typeof Sentry.replayIntegration === 'function'
        ? [
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ]
        : [],
      
      // Before sending, sanitize PII
      beforeSend: (event, hint) => {
        const sanitized = this.sanitizeEvent(event as Sentry.Event, hint)
        return sanitized as typeof event | null
      },
    })

    this.initialized = true
  }

  async write(entry: LogEntry): Promise<void> {
    if (!this.initialized || !this.options.enabled) {
      return
    }

    const { level, message, metadata, error, context } = entry

    // Set Sentry context
    if (context || metadata) {
      Sentry.setContext('custom', {
        ...context,
        ...metadata,
      })
    }

    // Set user context if available
    if (context?.userId) {
      Sentry.setUser({
        id: context.userId,
        email: context.email,
      })
    }

    // Handle based on log level
    switch (level) {
      case 'error':
      case 'fatal':
        this.captureError(message, error, metadata, level === 'fatal')
        break

      case 'warn':
        Sentry.captureMessage(message, {
          level: 'warning',
          extra: metadata,
        })
        break

      case 'info':
      case 'debug':
        // Add as breadcrumb for context
        Sentry.addBreadcrumb({
          message,
          level: level === 'info' ? 'info' : 'debug',
          data: metadata,
          timestamp: Date.now() / 1000,
        })
        break

      case 'trace':
        // Trace level also becomes breadcrumb
        Sentry.addBreadcrumb({
          message,
          level: 'debug',
          data: metadata,
          timestamp: Date.now() / 1000,
        })
        break
    }
  }

  private captureError(
    message: string,
    error: ErrorInfo | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any,
    isFatal: boolean
  ): void {
    if (error) {
      // Enrich error with metadata
      Sentry.withScope((scope) => {
        // Set severity
        scope.setLevel(isFatal ? 'fatal' : 'error')

        // Add metadata as extra context
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            scope.setExtra(key, value)
          })
        }

        // Handle AppError metadata (from ErrorInfo)
        // AppError instances are serialized, so check for code and severity in ErrorInfo
        if (this.hasAppErrorMetadata(error)) {
          if (error.code) {
            scope.setTag('error_code', String(error.code))
          }
          if (error.severity) {
            scope.setTag('error_severity', String(error.severity))
          }
          
          // Include any other AppError-specific metadata
          if (error.metadata && typeof error.metadata === 'object') {
            Object.entries(error.metadata).forEach(([key, value]) => {
              scope.setExtra(`error_${key}`, value)
            })
          }
        }

        // Reconstruct Error object from ErrorInfo
        const errorObj = this.reconstructError(error)
        Sentry.captureException(errorObj)
      })
    } else {
      // No error object, just message
      Sentry.captureMessage(message, {
        level: isFatal ? 'fatal' : 'error',
        extra: metadata,
      })
    }
  }

  private hasAppErrorMetadata(error: ErrorInfo): boolean {
    // Check if ErrorInfo has AppError-specific properties
    return !!(error.code || error.severity)
  }

  /**
   * Reconstruct Error object from ErrorInfo (serialized error from logger)
   */
  private reconstructError(error: ErrorInfo): Error {
    // Create error with message
    const err = new Error(error.message)
    err.name = error.name || 'Error'
    
    // Restore stack trace if available
    if (error.stack) {
      err.stack = error.stack
    }
    
    // Restore error code if available
    if (error.code !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(err as any).code = error.code
    }
    
    return err
  }

  private sanitizeEvent(event: Sentry.Event, _hint: Sentry.EventHint): Sentry.Event | null {
    // Remove PII from breadcrumbs and context
    // Redact sensitive fields
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization', 'apikey']
    
    // Sanitize breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sanitizedData: Record<string, any> = {}
          Object.keys(breadcrumb.data).forEach((key) => {
            if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
              sanitizedData[key] = '[REDACTED]'
            } else {
              sanitizedData[key] = breadcrumb.data![key]
            }
          })
          breadcrumb.data = sanitizedData
        }
        return breadcrumb
      })
    }

    // Sanitize context
    if (event.extra) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitizedExtra: Record<string, any> = {}
      Object.keys(event.extra).forEach((key) => {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          sanitizedExtra[key] = '[REDACTED]'
        } else {
          sanitizedExtra[key] = event.extra![key]
        }
      })
      event.extra = sanitizedExtra
    }

    // Sanitize tags
    if (event.tags) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitizedTags: Record<string, any> = {}
      Object.keys(event.tags).forEach((key) => {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          sanitizedTags[key] = '[REDACTED]'
        } else {
          sanitizedTags[key] = event.tags![key]
        }
      })
      event.tags = sanitizedTags
    }

    return event
  }

  async flush(): Promise<void> {
    if (!this.initialized) return
    await Sentry.close(2000) // 2 second timeout
  }

  async close(): Promise<void> {
    await this.flush()
  }
}

