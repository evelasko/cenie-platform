import { ZodError } from 'zod'

import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  InternalError,
  AppError,
} from '../errors'

/**
 * Classify unknown errors into appropriate AppError types
 */
export function classifyError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error
  }

  // Not an Error object
  if (!(error instanceof Error)) {
    return new InternalError('Unknown error occurred', {
      details: String(error),
    })
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return new ValidationError('Validation failed', {
      metadata: {
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
  }

  // Firebase Auth errors
  if ('code' in error && typeof error.code === 'string') {
    const code = error.code as string

    // Firebase auth codes
    if (code.startsWith('auth/')) {
      if (
        code === 'auth/invalid-email' ||
        code === 'auth/invalid-password' ||
        code === 'auth/weak-password'
      ) {
        return new ValidationError(error.message, { cause: error })
      }

      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        return new AuthenticationError(error.message, { cause: error })
      }

      if (code === 'auth/email-already-in-use') {
        return new ConflictError('Email already registered', { cause: error })
      }

      return new AuthenticationError(error.message, { cause: error })
    }

    // Postgres error codes
    if (code.startsWith('23')) {
      // 23505 = unique constraint violation
      if (code === '23505') {
        return new ConflictError('Resource already exists', { cause: error })
      }

      // 23503 = foreign key violation
      if (code === '23503') {
        return new ValidationError('Referenced resource does not exist', { cause: error })
      }

      return new DatabaseError('Database constraint violation', { cause: error })
    }

    // Connection errors
    if (code === 'ECONNREFUSED' || code === 'ETIMEDOUT' || code === 'ENOTFOUND') {
      return new DatabaseError('Database connection failed', {
        cause: error,
        retryable: true,
      })
    }
  }

  // Supabase RLS errors (check message patterns)
  if (error.message.includes('row-level security') || error.message.includes('RLS')) {
    return new AuthorizationError('Permission denied', { cause: error })
  }

  // Not found patterns
  if (
    error.message.toLowerCase().includes('not found') ||
    error.message.toLowerCase().includes('does not exist')
  ) {
    return new NotFoundError(error.message, { cause: error })
  }

  // Default to internal error
  return new InternalError('An unexpected error occurred', {
    cause: error,
    details: error.message,
  })
}

/**
 * Check if an error should be reported to error tracking
 */
export function shouldReportError(error: AppError): boolean {
  // Don't report low severity errors
  if (error.severity === 'low') {
    return false
  }

  // Don't report validation errors (too noisy)
  if (error instanceof ValidationError) {
    return false
  }

  // Don't report authentication errors (expected)
  if (error instanceof AuthenticationError) {
    return false
  }

  // Report everything else
  return true
}
