import type { ErrorOptions } from '../types'

import { AppError } from './base'

/**
 * Validation Error (400)
 * For invalid input data
 */
export class ValidationError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('VALIDATION_ERROR', message, 400, 'low', {
      userMessage: options.userMessage || 'Invalid input data',
      ...options,
    })
  }
}

/**
 * Authentication Error (401)
 * For failed authentication
 */
export class AuthenticationError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('AUTHENTICATION_ERROR', message, 401, 'medium', {
      userMessage: options.userMessage || 'Authentication failed',
      ...options,
    })
  }
}

/**
 * Authorization Error (403)
 * For permission denied
 */
export class AuthorizationError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('AUTHORIZATION_ERROR', message, 403, 'medium', {
      userMessage: options.userMessage || 'You do not have permission to perform this action',
      ...options,
    })
  }
}

/**
 * Not Found Error (404)
 * For resources that don't exist
 */
export class NotFoundError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('NOT_FOUND', message, 404, 'low', {
      userMessage: options.userMessage || 'The requested resource was not found',
      ...options,
    })
  }
}

/**
 * Conflict Error (409)
 * For duplicate resources or conflicts
 */
export class ConflictError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('CONFLICT', message, 409, 'medium', {
      userMessage: options.userMessage || 'A conflict occurred with the existing data',
      ...options,
    })
  }
}

/**
 * Rate Limit Error (429)
 * For rate limiting
 */
export class RateLimitError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('RATE_LIMIT_EXCEEDED', message, 429, 'low', {
      userMessage: options.userMessage || 'Too many requests. Please try again later',
      retryable: true,
      ...options,
    })
  }
}

/**
 * Internal Error (500)
 * For unexpected server errors
 */
export class InternalError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('INTERNAL_ERROR', message, 500, 'critical', {
      userMessage: options.userMessage || 'An unexpected error occurred',
      ...options,
    })
  }
}

/**
 * Service Unavailable Error (503)
 * For temporary service outages
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string, options: ErrorOptions = {}) {
    super('SERVICE_UNAVAILABLE', message, 503, 'high', {
      userMessage: options.userMessage || 'Service is temporarily unavailable',
      retryable: true,
      ...options,
    })
  }
}
