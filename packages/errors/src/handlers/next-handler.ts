/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from '@cenie/logger'
import { logContext } from '@cenie/logger/context'
import { type NextRequest, NextResponse } from 'next/server'

import { type AppError } from '../errors'
import { classifyError } from '../utils/error-classifier'

/**
 * Default logger for error handling
 */
const defaultLogger = createLogger({ name: 'error-handler' })

/**
 * Format error for API response
 */
function formatErrorResponse(error: AppError): Record<string, any> {
  const response: Record<string, any> = {
    error: {
      code: error.code,
      message: error.getUserMessage(),
      statusCode: error.statusCode,
    },
  }

  // Add request ID if available
  const requestId = logContext.get('requestId') || error.requestId
  if (requestId) {
    response.error.requestId = requestId
  }

  // Add development details
  if (process.env.NODE_ENV === 'development') {
    response.error.details = error.details || error.message
    response.error.timestamp = error.timestamp.toISOString()

    if (error.stack) {
      response.error.stack = error.stack
    }
  }

  return response
}

/**
 * Wrapper for Next.js API route handlers with automatic error handling
 *
 * @example
 * ```typescript
 * import { withErrorHandling } from '@cenie/errors/next'
 * import { NotFoundError } from '@cenie/errors'
 *
 * export const GET = withErrorHandling(async (request) => {
 *   const user = await getUser(id)
 *   if (!user) {
 *     throw new NotFoundError('User not found')
 *   }
 *   return NextResponse.json({ user })
 * })
 * ```
 */
export function withErrorHandling<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      // Classify error
      const appError = classifyError(error)

      // Log error
      appError.log(defaultLogger)

      // Return formatted error response
      const response = formatErrorResponse(appError)
      return NextResponse.json(response, { status: appError.statusCode })
    }
  }
}

/**
 * Handle errors in Server Components
 * Converts errors to appropriate HTTP responses
 */
export function handleServerComponentError(error: unknown): never {
  const appError = classifyError(error)
  appError.log(defaultLogger)

  // Throw with status code for Next.js to handle
  const response = formatErrorResponse(appError)
  throw new Error(JSON.stringify(response))
}

/**
 * Create error response without throwing
 * Useful for explicit error returns
 */
export function createErrorResponse(error: unknown): NextResponse {
  const appError = classifyError(error)
  appError.log(defaultLogger)

  const response = formatErrorResponse(appError)
  return NextResponse.json(response, { status: appError.statusCode })
}
