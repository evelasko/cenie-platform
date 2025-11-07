import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { classifyError, shouldReportError } from '../utils/error-classifier'
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  InternalError,
} from '../errors'

describe('Error Classifier', () => {
  describe('classifyError', () => {
    it('should pass through AppError instances', () => {
      const originalError = new ValidationError('Test error')
      const classified = classifyError(originalError)

      expect(classified).toBe(originalError)
      expect(classified).toBeInstanceOf(ValidationError)
    })

    it('should convert non-Error objects to InternalError', () => {
      const classified1 = classifyError('string error')
      const classified2 = classifyError(null)
      const classified3 = classifyError(undefined)
      const classified4 = classifyError(123)
      const classified5 = classifyError({ error: 'object' })

      expect(classified1).toBeInstanceOf(InternalError)
      expect(classified1.message).toBe('Unknown error occurred')
      expect(classified1.details).toBe('string error')

      expect(classified2).toBeInstanceOf(InternalError)
      expect(classified3).toBeInstanceOf(InternalError)
      expect(classified4).toBeInstanceOf(InternalError)
      expect(classified5).toBeInstanceOf(InternalError)
    })

    describe('Zod validation errors', () => {
      it('should convert ZodError to ValidationError', () => {
        // Create a real Zod schema validation error
        const schema = z.object({
          email: z.string(),
          password: z.string().min(8),
        })

        let zodError: any
        try {
          schema.parse({ email: 123, password: 'short' })
        } catch (error) {
          zodError = error
        }

        const classified = classifyError(zodError)

        expect(classified).toBeInstanceOf(ValidationError)
        expect(classified.message).toBe('Validation failed')
        expect(classified.metadata.issues).toBeDefined()
        expect(classified.metadata.issues.length).toBeGreaterThan(0)
        expect(classified.metadata.issues[0]).toHaveProperty('path')
        expect(classified.metadata.issues[0]).toHaveProperty('message')
      })

      it('should handle nested path in Zod errors', () => {
        const schema = z.object({
          user: z.object({
            profile: z.object({
              name: z.string(),
            }),
          }),
        })

        let zodError: any
        try {
          schema.parse({ user: { profile: {} } })
        } catch (error) {
          zodError = error
        }

        const classified = classifyError(zodError)

        expect(classified).toBeInstanceOf(ValidationError)
        expect(classified.metadata.issues).toBeDefined()
        expect(classified.metadata.issues[0].path).toContain('name')
      })
    })

    describe('Firebase auth errors', () => {
      it('should convert validation-related Firebase errors to ValidationError', () => {
        const errors = [
          { code: 'auth/invalid-email', message: 'Invalid email format' },
          { code: 'auth/invalid-password', message: 'Invalid password' },
          { code: 'auth/weak-password', message: 'Password is too weak' },
        ]

        errors.forEach((err) => {
          const error = Object.assign(new Error(err.message), { code: err.code })
          const classified = classifyError(error)

          expect(classified).toBeInstanceOf(ValidationError)
          expect(classified.cause).toBe(error)
        })
      })

      it('should convert authentication-related Firebase errors to AuthenticationError', () => {
        const errors = [
          { code: 'auth/user-not-found', message: 'User not found' },
          { code: 'auth/wrong-password', message: 'Wrong password' },
          { code: 'auth/invalid-credential', message: 'Invalid credential' },
        ]

        errors.forEach((err) => {
          const error = Object.assign(new Error(err.message), { code: err.code })
          const classified = classifyError(error)

          expect(classified).toBeInstanceOf(AuthenticationError)
          expect(classified.cause).toBe(error)
        })
      })

      it('should convert duplicate email Firebase error to ConflictError', () => {
        const error = Object.assign(new Error('Email already in use'), {
          code: 'auth/email-already-in-use',
        })
        const classified = classifyError(error)

        expect(classified).toBeInstanceOf(ConflictError)
        expect(classified.message).toBe('Email already registered')
        expect(classified.cause).toBe(error)
      })

      it('should convert other Firebase auth errors to AuthenticationError', () => {
        const error = Object.assign(new Error('Auth error'), {
          code: 'auth/unknown-error',
        })
        const classified = classifyError(error)

        expect(classified).toBeInstanceOf(AuthenticationError)
        expect(classified.cause).toBe(error)
      })
    })

    describe('Postgres error codes', () => {
      it('should convert unique constraint violation (23505) to ConflictError', () => {
        const error = Object.assign(new Error('Duplicate key value'), {
          code: '23505',
        })
        const classified = classifyError(error)

        expect(classified).toBeInstanceOf(ConflictError)
        expect(classified.message).toBe('Resource already exists')
        expect(classified.cause).toBe(error)
      })

      it('should convert foreign key violation (23503) to ValidationError', () => {
        const error = Object.assign(new Error('Foreign key constraint'), {
          code: '23503',
        })
        const classified = classifyError(error)

        expect(classified).toBeInstanceOf(ValidationError)
        expect(classified.message).toBe('Referenced resource does not exist')
        expect(classified.cause).toBe(error)
      })

      it('should convert other 23xxx codes to DatabaseError', () => {
        const error = Object.assign(new Error('Constraint violation'), {
          code: '23514',
        })
        const classified = classifyError(error)

        expect(classified).toBeInstanceOf(DatabaseError)
        expect(classified.message).toBe('Database constraint violation')
        expect(classified.cause).toBe(error)
      })
    })

    describe('Connection errors', () => {
      it('should convert connection errors to DatabaseError with retryable flag', () => {
        const connectionErrors = [
          { code: 'ECONNREFUSED', message: 'Connection refused' },
          { code: 'ETIMEDOUT', message: 'Connection timed out' },
          { code: 'ENOTFOUND', message: 'Host not found' },
        ]

        connectionErrors.forEach((err) => {
          const error = Object.assign(new Error(err.message), { code: err.code })
          const classified = classifyError(error)

          expect(classified).toBeInstanceOf(DatabaseError)
          expect(classified.message).toBe('Database connection failed')
          expect(classified.retryable).toBe(true)
          expect(classified.isRetryable()).toBe(true)
          expect(classified.cause).toBe(error)
        })
      })
    })

    describe('Supabase RLS errors', () => {
      it('should convert RLS errors to AuthorizationError', () => {
        const rlsErrors = [
          new Error('new row violates row-level security policy'),
          new Error('RLS policy violation'),
          new Error('Permission denied by row-level security'),
        ]

        rlsErrors.forEach((error) => {
          const classified = classifyError(error)

          expect(classified).toBeInstanceOf(AuthorizationError)
          expect(classified.message).toBe('Permission denied')
          expect(classified.cause).toBe(error)
        })
      })
    })

    describe('Not found errors', () => {
      it('should convert "not found" messages to NotFoundError', () => {
        const notFoundErrors = [
          new Error('User not found'),
          new Error('Resource not found'),
          new Error('The requested item was not found'),
          new Error('Document does not exist'),
          new Error('Record does not exist in database'),
        ]

        notFoundErrors.forEach((error) => {
          const classified = classifyError(error)

          expect(classified).toBeInstanceOf(NotFoundError)
          expect(classified.cause).toBe(error)
        })
      })

      it('should be case-insensitive when detecting not found errors', () => {
        const error = new Error('USER NOT FOUND')
        const classified = classifyError(error)

        expect(classified).toBeInstanceOf(NotFoundError)
      })
    })

    describe('Generic errors', () => {
      it('should convert unknown errors to InternalError', () => {
        const genericErrors = [
          new Error('Something went wrong'),
          new Error('Unexpected error'),
          new TypeError('Cannot read property of undefined'),
          new RangeError('Index out of bounds'),
        ]

        genericErrors.forEach((error) => {
          const classified = classifyError(error)

          expect(classified).toBeInstanceOf(InternalError)
          expect(classified.message).toBe('An unexpected error occurred')
          expect(classified.cause).toBe(error)
          expect(classified.details).toBe(error.message)
        })
      })
    })
  })

  describe('shouldReportError', () => {
    it('should not report low severity errors', () => {
      const lowErrors = [
        new ValidationError('Test'),
        new NotFoundError('Test'),
        new class extends AppError {
          constructor() {
            super('TEST', 'Test', 400, 'low', {})
          }
        }(),
      ]

      lowErrors.forEach((error) => {
        expect(shouldReportError(error)).toBe(false)
      })
    })

    it('should not report validation errors', () => {
      const error = new ValidationError('Invalid input')
      expect(error.severity).toBe('low')
      expect(shouldReportError(error)).toBe(false)
    })

    it('should not report authentication errors', () => {
      const error = new AuthenticationError('Invalid credentials')
      expect(shouldReportError(error)).toBe(false)
    })

    it('should report medium severity errors (except validation and auth)', () => {
      const mediumErrors = [
        new AuthorizationError('Access denied'),
        new ConflictError('Duplicate entry'),
      ]

      mediumErrors.forEach((error) => {
        expect(error.severity).toBe('medium')
        expect(shouldReportError(error)).toBe(true)
      })
    })

    it('should report high severity errors', () => {
      const highErrors = [
        new class extends AppError {
          constructor() {
            super('HIGH_ERROR', 'Test', 503, 'high', {})
          }
        }(),
        new DatabaseError('Connection failed'),
      ]

      highErrors.forEach((error) => {
        expect(error.severity).toBe('high')
        expect(shouldReportError(error)).toBe(true)
      })
    })

    it('should report critical severity errors', () => {
      const error = new InternalError('System failure')
      expect(error.severity).toBe('critical')
      expect(shouldReportError(error)).toBe(true)
    })

    it('should have consistent reporting logic', () => {
      // Not reported
      expect(shouldReportError(new ValidationError('test'))).toBe(false)
      expect(shouldReportError(new AuthenticationError('test'))).toBe(false)
      expect(shouldReportError(new NotFoundError('test'))).toBe(false)

      // Reported
      expect(shouldReportError(new AuthorizationError('test'))).toBe(true)
      expect(shouldReportError(new ConflictError('test'))).toBe(true)
      expect(shouldReportError(new InternalError('test'))).toBe(true)
      expect(shouldReportError(new DatabaseError('test'))).toBe(true)
    })
  })
})

