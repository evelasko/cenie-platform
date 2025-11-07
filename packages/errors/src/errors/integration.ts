import type { ErrorOptions } from '../types'

import { AppError } from './base'

/**
 * External Service Error
 * Base class for third-party service failures
 */
export class ExternalServiceError extends AppError {
  readonly service: string

  constructor(service: string, message: string, options: ErrorOptions = {}) {
    super(`EXTERNAL_SERVICE_ERROR_${service.toUpperCase()}`, message, 502, 'high', {
      ...options,
      userMessage: options.userMessage || 'An external service is temporarily unavailable',
      retryable: options.retryable ?? true,
      metadata: { service, ...options.metadata },
    })

    this.service = service
  }
}

/**
 * Database Error
 * For database connection and query failures
 */
export class DatabaseError extends ExternalServiceError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('database', message, {
      userMessage: options.userMessage || 'A database error occurred',
      ...options,
    })
  }
}

/**
 * Payment Error
 * For payment processing failures
 */
export class PaymentError extends ExternalServiceError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('payment', message, {
      userMessage: options.userMessage || 'Payment processing failed',
      ...options,
    })
  }
}

/**
 * Storage Error
 * For cloud storage failures
 */
export class StorageError extends ExternalServiceError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('storage', message, {
      userMessage: options.userMessage || 'File storage operation failed',
      retryable: true,
      ...options,
    })
  }
}

/**
 * API Error
 * For external API call failures
 */
export class APIError extends ExternalServiceError {
  constructor(service: string, message: string, options: ErrorOptions = {}) {
    super(service, message, {
      userMessage: options.userMessage || `Failed to communicate with ${service}`,
      ...options,
    })
  }
}

/**
 * Timeout Error
 * For operation timeouts
 */
export class TimeoutError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('TIMEOUT', message, 504, 'high', {
      userMessage: options.userMessage || 'The operation timed out',
      retryable: true,
      ...options,
    })
  }
}
