import { describe, it, expect } from 'vitest'
import {
  ExternalServiceError,
  DatabaseError,
  PaymentError,
  StorageError,
  APIError,
  TimeoutError,
} from '../errors/integration'
import { AppError } from '../errors/base'

describe('Integration Error Classes', () => {
  describe('ExternalServiceError', () => {
    it('should create external service error with correct defaults', () => {
      const error = new ExternalServiceError('stripe', 'Connection failed')

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ExternalServiceError)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR_STRIPE')
      expect(error.statusCode).toBe(502)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('Connection failed')
      expect(error.userMessage).toBe('An external service is temporarily unavailable')
      expect(error.retryable).toBe(true)
      expect(error.service).toBe('stripe')
    })

    it('should include service in metadata', () => {
      const error = new ExternalServiceError('twilio', 'API error')

      expect(error.metadata).toHaveProperty('service', 'twilio')
    })

    it('should accept custom options', () => {
      const error = new ExternalServiceError('sendgrid', 'Email send failed', {
        userMessage: 'Failed to send email',
        metadata: { emailId: '123' },
      })

      expect(error.userMessage).toBe('Failed to send email')
      expect(error.metadata).toEqual({
        service: 'sendgrid',
        emailId: '123',
      })
    })

    it('should be retryable by default', () => {
      const error = new ExternalServiceError('service', 'Error')
      expect(error.isRetryable()).toBe(true)
    })

    it('should uppercase service name in error code', () => {
      const error = new ExternalServiceError('myService', 'Error')
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR_MYSERVICE')
    })
  })

  describe('DatabaseError', () => {
    it('should create database error with correct defaults', () => {
      const error = new DatabaseError('Connection timeout')

      expect(error).toBeInstanceOf(ExternalServiceError)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR_DATABASE')
      expect(error.statusCode).toBe(502)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('Connection timeout')
      expect(error.userMessage).toBe('A database error occurred')
      expect(error.retryable).toBe(true)
      expect(error.service).toBe('database')
    })

    it('should accept custom options', () => {
      const error = new DatabaseError('Query failed', {
        userMessage: 'Unable to fetch data',
        metadata: { query: 'SELECT * FROM users' },
      })

      expect(error.userMessage).toBe('Unable to fetch data')
      expect(error.metadata).toEqual({
        service: 'database',
        query: 'SELECT * FROM users',
      })
    })

    it('should preserve cause chain', () => {
      const originalError = new Error('Connection refused')
      const error = new DatabaseError('DB connection failed', {
        cause: originalError,
      })

      expect(error.cause).toBe(originalError)
    })
  })

  describe('PaymentError', () => {
    it('should create payment error with correct defaults', () => {
      const error = new PaymentError('Card declined')

      expect(error).toBeInstanceOf(ExternalServiceError)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR_PAYMENT')
      expect(error.statusCode).toBe(502)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('Card declined')
      expect(error.userMessage).toBe('Payment processing failed')
      expect(error.retryable).toBe(true)
      expect(error.service).toBe('payment')
    })

    it('should accept custom options', () => {
      const error = new PaymentError('Insufficient funds', {
        userMessage: 'Your card has insufficient funds',
        metadata: { cardLast4: '4242', amount: 99.99 },
      })

      expect(error.userMessage).toBe('Your card has insufficient funds')
      expect(error.metadata).toEqual({
        service: 'payment',
        cardLast4: '4242',
        amount: 99.99,
      })
    })
  })

  describe('StorageError', () => {
    it('should create storage error with correct defaults', () => {
      const error = new StorageError('Upload failed')

      expect(error).toBeInstanceOf(ExternalServiceError)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR_STORAGE')
      expect(error.statusCode).toBe(502)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('Upload failed')
      expect(error.userMessage).toBe('File storage operation failed')
      expect(error.retryable).toBe(true)
      expect(error.service).toBe('storage')
    })

    it('should accept custom options', () => {
      const error = new StorageError('File not found', {
        userMessage: 'The requested file could not be found',
        metadata: { bucket: 'uploads', key: 'image.jpg' },
      })

      expect(error.userMessage).toBe('The requested file could not be found')
      expect(error.metadata).toEqual({
        service: 'storage',
        bucket: 'uploads',
        key: 'image.jpg',
      })
    })

    it('should be retryable explicitly', () => {
      const error = new StorageError('Temporary failure')
      expect(error.retryable).toBe(true)
      expect(error.isRetryable()).toBe(true)
    })
  })

  describe('APIError', () => {
    it('should create API error with correct defaults', () => {
      const error = new APIError('github', 'API rate limit exceeded')

      expect(error).toBeInstanceOf(ExternalServiceError)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR_GITHUB')
      expect(error.statusCode).toBe(502)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('API rate limit exceeded')
      expect(error.userMessage).toBe('Failed to communicate with github')
      expect(error.retryable).toBe(true)
      expect(error.service).toBe('github')
    })

    it('should accept custom service names', () => {
      const services = ['google', 'twitter', 'slack', 'openai']

      services.forEach((service) => {
        const error = new APIError(service, 'API error')
        expect(error.service).toBe(service)
        expect(error.code).toBe(`EXTERNAL_SERVICE_ERROR_${service.toUpperCase()}`)
        expect(error.userMessage).toBe(`Failed to communicate with ${service}`)
      })
    })

    it('should accept custom options', () => {
      const error = new APIError('spotify', 'Authentication failed', {
        userMessage: 'Failed to connect to Spotify',
        metadata: { endpoint: '/api/v1/tracks', statusCode: 401 },
      })

      expect(error.userMessage).toBe('Failed to connect to Spotify')
      expect(error.metadata).toEqual({
        service: 'spotify',
        endpoint: '/api/v1/tracks',
        statusCode: 401,
      })
    })
  })

  describe('TimeoutError', () => {
    it('should create timeout error with correct defaults', () => {
      const error = new TimeoutError('Request timed out')

      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe('TIMEOUT')
      expect(error.statusCode).toBe(504)
      expect(error.severity).toBe('high')
      expect(error.message).toBe('Request timed out')
      expect(error.userMessage).toBe('The operation timed out')
      expect(error.retryable).toBe(true)
    })

    it('should be retryable by default', () => {
      const error = new TimeoutError('Operation exceeded time limit')
      expect(error.isRetryable()).toBe(true)
    })

    it('should accept custom options', () => {
      const error = new TimeoutError('Database query timeout', {
        userMessage: 'The database query took too long',
        metadata: { timeout: 30000, operation: 'SELECT' },
      })

      expect(error.userMessage).toBe('The database query took too long')
      expect(error.metadata).toEqual({
        timeout: 30000,
        operation: 'SELECT',
      })
    })

    it('should accept custom timeout values', () => {
      const error = new TimeoutError('Timeout after 5s', {
        metadata: { timeoutMs: 5000 },
      })

      expect(error.metadata.timeoutMs).toBe(5000)
    })
  })

  describe('Error inheritance', () => {
    it('should maintain proper inheritance chain for service errors', () => {
      const errors = [
        new DatabaseError('test'),
        new PaymentError('test'),
        new StorageError('test'),
        new APIError('service', 'test'),
      ]

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
        expect(error).toBeInstanceOf(ExternalServiceError)
        expect(error.stack).toBeDefined()
      })
    })

    it('should allow specific error type checking', () => {
      const dbError = new DatabaseError('test')
      const paymentError = new PaymentError('test')

      expect(dbError).toBeInstanceOf(DatabaseError)
      expect(dbError).not.toBeInstanceOf(PaymentError)
      expect(paymentError).toBeInstanceOf(PaymentError)
      expect(paymentError).not.toBeInstanceOf(DatabaseError)
    })

    it('should have timeout error separate from external service errors', () => {
      const timeoutError = new TimeoutError('test')
      const dbError = new DatabaseError('test')

      expect(timeoutError).toBeInstanceOf(AppError)
      expect(timeoutError).not.toBeInstanceOf(ExternalServiceError)
      expect(dbError).toBeInstanceOf(ExternalServiceError)
    })
  })
})

