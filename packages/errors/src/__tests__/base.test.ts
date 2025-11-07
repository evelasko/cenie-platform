import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AppError } from '../errors/base'
import { logContext } from '@cenie/logger/context'

// Create a concrete test class since AppError is abstract
class TestError extends AppError {
  constructor(message: string, options = {}) {
    super('TEST_ERROR', message, 500, 'critical', options)
  }
}

describe('AppError', () => {
  beforeEach(() => {
    // Clear context before each test
    logContext.clear()
  })

  afterEach(() => {
    // Clean up after each test
    logContext.clear()
  })

  describe('constructor', () => {
    it('should create an error with basic properties', () => {
      const error = new TestError('Test message')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
      expect(error.name).toBe('TestError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.severity).toBe('critical')
      expect(error.userMessage).toBe('Test message')
      expect(error.retryable).toBe(false)
      expect(error.metadata).toEqual({})
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept custom user message', () => {
      const error = new TestError('Internal message', {
        userMessage: 'User-friendly message',
      })

      expect(error.message).toBe('Internal message')
      expect(error.userMessage).toBe('User-friendly message')
    })

    it('should accept metadata', () => {
      const metadata = { userId: '123', action: 'test' }
      const error = new TestError('Test message', { metadata })

      expect(error.metadata).toEqual(metadata)
    })

    it('should accept details', () => {
      const error = new TestError('Test message', {
        details: 'Detailed information',
      })

      expect(error.details).toBe('Detailed information')
    })

    it('should accept retryable flag', () => {
      const error = new TestError('Test message', { retryable: true })

      expect(error.retryable).toBe(true)
      expect(error.isRetryable()).toBe(true)
    })

    it('should capture request ID from log context', () => {
      logContext.run({ requestId: 'req_123' }, () => {
        const error = new TestError('Test message')
        expect(error.requestId).toBe('req_123')
      })
    })

    it('should handle missing request ID', () => {
      const error = new TestError('Test message')
      expect(error.requestId).toBeUndefined()
    })

    it('should preserve error cause chain', () => {
      const originalError = new Error('Original error')
      const error = new TestError('Wrapped error', { cause: originalError })

      expect(error.cause).toBe(originalError)
    })

    it('should have proper stack trace', () => {
      const error = new TestError('Test message')

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('TestError')
      expect(error.stack).toContain('Test message')
    })
  })

  describe('isRetryable', () => {
    it('should return false by default', () => {
      const error = new TestError('Test message')
      expect(error.isRetryable()).toBe(false)
    })

    it('should return true when retryable is set', () => {
      const error = new TestError('Test message', { retryable: true })
      expect(error.isRetryable()).toBe(true)
    })
  })

  describe('getUserMessage', () => {
    it('should return user message', () => {
      const error = new TestError('Internal message', {
        userMessage: 'User message',
      })
      expect(error.getUserMessage()).toBe('User message')
    })

    it('should return internal message when user message not set', () => {
      const error = new TestError('Internal message')
      expect(error.getUserMessage()).toBe('Internal message')
    })
  })

  describe('toJSON', () => {
    it('should serialize to JSON in production mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      logContext.run({ requestId: 'req_456' }, () => {
        const error = new TestError('Internal message', {
          userMessage: 'User message',
          details: 'Detailed info',
          metadata: { key: 'value' },
        })

        const json = error.toJSON()

        expect(json).toEqual({
          code: 'TEST_ERROR',
          message: 'User message',
          statusCode: 500,
          requestId: 'req_456',
        })

        expect(json.details).toBeUndefined()
        expect(json.stack).toBeUndefined()
        expect(json.timestamp).toBeUndefined()
      })

      process.env.NODE_ENV = originalEnv
    })

    it('should include debug info in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const error = new TestError('Internal message', {
        userMessage: 'User message',
        details: 'Detailed info',
      })

      const json = error.toJSON()

      expect(json.code).toBe('TEST_ERROR')
      expect(json.message).toBe('User message')
      expect(json.statusCode).toBe(500)
      expect(json.details).toBe('Detailed info')
      expect(json.timestamp).toBeDefined()
      expect(json.stack).toBeDefined()

      process.env.NODE_ENV = originalEnv
    })

    it('should use internal message as details in development when no details provided', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const error = new TestError('Internal message')
      const json = error.toJSON()

      expect(json.details).toBe('Internal message')

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('getLogLevel', () => {
    it('should return debug for low severity', () => {
      class LowError extends AppError {
        constructor(message: string) {
          super('LOW_ERROR', message, 400, 'low', {})
        }
      }

      const error = new LowError('Test')
      expect(error.getLogLevel()).toBe('debug')
    })

    it('should return info for medium severity', () => {
      class MediumError extends AppError {
        constructor(message: string) {
          super('MEDIUM_ERROR', message, 403, 'medium', {})
        }
      }

      const error = new MediumError('Test')
      expect(error.getLogLevel()).toBe('info')
    })

    it('should return warn for high severity', () => {
      class HighError extends AppError {
        constructor(message: string) {
          super('HIGH_ERROR', message, 503, 'high', {})
        }
      }

      const error = new HighError('Test')
      expect(error.getLogLevel()).toBe('warn')
    })

    it('should return error for critical severity', () => {
      const error = new TestError('Test')
      expect(error.getLogLevel()).toBe('error')
    })
  })

  describe('log', () => {
    it('should log error with appropriate level and metadata', () => {
      const mockLogger = {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
        trace: vi.fn(),
        fatal: vi.fn(),
      }

      const originalError = new Error('Cause')
      const error = new TestError('Test message', {
        cause: originalError,
        metadata: { key: 'value' },
      })

      error.log(mockLogger as any)

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Test message',
        originalError,
        expect.objectContaining({
          code: 'TEST_ERROR',
          statusCode: 500,
          severity: 'critical',
          key: 'value',
        })
      )
    })

    it('should use appropriate log method for different severities', () => {
      const mockLogger = {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
        trace: vi.fn(),
        fatal: vi.fn(),
      }

      class LowError extends AppError {
        constructor(message: string) {
          super('LOW_ERROR', message, 400, 'low', {})
        }
      }

      const error = new LowError('Test')
      error.log(mockLogger as any)

      expect(mockLogger.debug).toHaveBeenCalled()
    })

    it('should handle errors without cause', () => {
      const mockLogger = {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
        trace: vi.fn(),
        fatal: vi.fn(),
      }

      const error = new TestError('Test message')
      error.log(mockLogger as any)

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Test message',
        undefined,
        expect.any(Object)
      )
    })
  })
})

