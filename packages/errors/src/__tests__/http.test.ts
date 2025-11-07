import { describe, it, expect } from 'vitest'
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  ServiceUnavailableError,
} from '../errors/http'
import { AppError } from '../errors/base'

describe('HTTP Error Classes', () => {
  describe('ValidationError', () => {
    it('should create validation error with correct defaults', () => {
      const error = new ValidationError('Invalid input')

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.severity).toBe('low')
      expect(error.message).toBe('Invalid input')
      expect(error.userMessage).toBe('Invalid input data')
      expect(error.retryable).toBe(false)
    })

    it('should accept custom user message', () => {
      const error = new ValidationError('Field validation failed', {
        userMessage: 'Please check your input',
      })

      expect(error.message).toBe('Field validation failed')
      expect(error.userMessage).toBe('Please check your input')
    })

    it('should accept metadata', () => {
      const error = new ValidationError('Invalid email', {
        metadata: { field: 'email', value: 'invalid' },
      })

      expect(error.metadata).toEqual({ field: 'email', value: 'invalid' })
    })
  })

  describe('AuthenticationError', () => {
    it('should create authentication error with correct defaults', () => {
      const error = new AuthenticationError('Invalid credentials')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
      expect(error.statusCode).toBe(401)
      expect(error.severity).toBe('medium')
      expect(error.message).toBe('Invalid credentials')
      expect(error.userMessage).toBe('Authentication failed')
      expect(error.retryable).toBe(false)
    })

    it('should accept custom options', () => {
      const error = new AuthenticationError('Token expired', {
        userMessage: 'Please log in again',
        metadata: { reason: 'token_expired' },
      })

      expect(error.userMessage).toBe('Please log in again')
      expect(error.metadata).toEqual({ reason: 'token_expired' })
    })
  })

  describe('AuthorizationError', () => {
    it('should create authorization error with correct defaults', () => {
      const error = new AuthorizationError('Access denied')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('AUTHORIZATION_ERROR')
      expect(error.statusCode).toBe(403)
      expect(error.severity).toBe('medium')
      expect(error.message).toBe('Access denied')
      expect(error.userMessage).toBe('You do not have permission to perform this action')
      expect(error.retryable).toBe(false)
    })

    it('should accept custom options', () => {
      const error = new AuthorizationError('Insufficient permissions', {
        userMessage: 'Admin access required',
        metadata: { requiredRole: 'admin', userRole: 'user' },
      })

      expect(error.userMessage).toBe('Admin access required')
      expect(error.metadata.requiredRole).toBe('admin')
    })
  })

  describe('NotFoundError', () => {
    it('should create not found error with correct defaults', () => {
      const error = new NotFoundError('Resource not found')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
      expect(error.severity).toBe('low')
      expect(error.message).toBe('Resource not found')
      expect(error.userMessage).toBe('The requested resource was not found')
      expect(error.retryable).toBe(false)
    })

    it('should accept custom options', () => {
      const error = new NotFoundError('User not found', {
        userMessage: 'User does not exist',
        metadata: { userId: '123' },
      })

      expect(error.userMessage).toBe('User does not exist')
      expect(error.metadata).toEqual({ userId: '123' })
    })
  })

  describe('ConflictError', () => {
    it('should create conflict error with correct defaults', () => {
      const error = new ConflictError('Resource already exists')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('CONFLICT')
      expect(error.statusCode).toBe(409)
      expect(error.severity).toBe('medium')
      expect(error.message).toBe('Resource already exists')
      expect(error.userMessage).toBe('A conflict occurred with the existing data')
      expect(error.retryable).toBe(false)
    })

    it('should accept custom options', () => {
      const error = new ConflictError('Email already exists', {
        userMessage: 'This email is already registered',
        metadata: { email: 'test@example.com' },
      })

      expect(error.userMessage).toBe('This email is already registered')
      expect(error.metadata).toEqual({ email: 'test@example.com' })
    })
  })

  describe('RateLimitError', () => {
    it('should create rate limit error with correct defaults', () => {
      const error = new RateLimitError('Rate limit exceeded')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
      expect(error.statusCode).toBe(429)
      expect(error.severity).toBe('low')
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.userMessage).toBe('Too many requests. Please try again later')
      expect(error.retryable).toBe(true)
    })

    it('should be retryable by default', () => {
      const error = new RateLimitError('Rate limit exceeded')
      expect(error.isRetryable()).toBe(true)
    })

    it('should accept custom options', () => {
      const error = new RateLimitError('Too many login attempts', {
        userMessage: 'Please wait 5 minutes before trying again',
        metadata: { retryAfter: 300 },
      })

      expect(error.userMessage).toBe('Please wait 5 minutes before trying again')
      expect(error.metadata).toEqual({ retryAfter: 300 })
    })
  })

  describe('InternalError', () => {
    it('should create internal error with correct defaults', () => {
      const error = new InternalError('Unexpected error')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('INTERNAL_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.severity).toBe('critical')
      expect(error.message).toBe('Unexpected error')
      expect(error.userMessage).toBe('An unexpected error occurred')
      expect(error.retryable).toBe(false)
    })

    it('should accept custom options', () => {
      const originalError = new Error('Database connection failed')
      const error = new InternalError('Database error', {
        cause: originalError,
        userMessage: 'Service temporarily unavailable',
        details: 'Connection pool exhausted',
      })

      expect(error.cause).toBe(originalError)
      expect(error.userMessage).toBe('Service temporarily unavailable')
      expect(error.details).toBe('Connection pool exhausted')
    })
  })

  describe('ServiceUnavailableError', () => {
    it('should create service unavailable error with correct defaults', () => {
      const error = new ServiceUnavailableError('Service down')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('SERVICE_UNAVAILABLE')
      expect(error.statusCode).toBe(503)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('Service down')
      expect(error.userMessage).toBe('Service is temporarily unavailable')
      expect(error.retryable).toBe(true)
    })

    it('should be retryable by default', () => {
      const error = new ServiceUnavailableError('Maintenance mode')
      expect(error.isRetryable()).toBe(true)
    })

    it('should accept custom options', () => {
      const error = new ServiceUnavailableError('Under maintenance', {
        userMessage: 'System is under maintenance',
        metadata: { estimatedDowntime: '30 minutes' },
      })

      expect(error.userMessage).toBe('System is under maintenance')
      expect(error.metadata).toEqual({ estimatedDowntime: '30 minutes' })
    })
  })

  describe('Error inheritance and instanceof checks', () => {
    it('should maintain proper inheritance chain', () => {
      const errors = [
        new ValidationError('test'),
        new AuthenticationError('test'),
        new AuthorizationError('test'),
        new NotFoundError('test'),
        new ConflictError('test'),
        new RateLimitError('test'),
        new InternalError('test'),
        new ServiceUnavailableError('test'),
      ]

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
        expect(error.stack).toBeDefined()
      })
    })

    it('should allow specific error type checking', () => {
      const notFoundError = new NotFoundError('test')
      const validationError = new ValidationError('test')

      expect(notFoundError).toBeInstanceOf(NotFoundError)
      expect(notFoundError).not.toBeInstanceOf(ValidationError)
      expect(validationError).toBeInstanceOf(ValidationError)
      expect(validationError).not.toBeInstanceOf(NotFoundError)
    })
  })
})

