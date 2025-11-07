import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

import { type AppError } from '../errors'
import { classifyError } from '../utils/error-classifier'

/**
 * Format error for API response
 */
function formatErrorResponse(error: AppError, requestId?: string): Record<string, any> {
  const response: Record<string, any> = {
    error: {
      code: error.code,
      message: error.getUserMessage(),
      statusCode: error.statusCode,
    },
  }

  // Add request ID
  if (requestId || error.requestId) {
    response.error.requestId = requestId || error.requestId
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
 * Express error handling middleware
 * Should be added after all routes
 *
 * @example
 * ```typescript
 * import { errorHandler } from '@cenie/errors/express'
 *
 * // After all routes
 * app.use(errorHandler())
 * ```
 */
export function errorHandler(): ErrorRequestHandler {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Skip if response already sent
    if (res.headersSent) {
      return next(err)
    }

    // Classify error
    const appError = classifyError(err)

    // Log error (will be logged by req.log if available from logger middleware)
    if (req.log) {
      appError.log(req.log)
    }

    // Get request ID from logger context if available
    const requestId = req.log ? undefined : undefined

    // Send error response
    const response = formatErrorResponse(appError, requestId)
    res.status(appError.statusCode).json(response)
  }
}

/**
 * Async error wrapper for Express route handlers
 * Catches async errors and passes to error middleware
 *
 * @example
 * ```typescript
 * import { asyncHandler } from '@cenie/errors/express'
 *
 * app.get('/users/:id', asyncHandler(async (req, res) => {
 *   const user = await getUser(req.params.id)
 *   if (!user) {
 *     throw new NotFoundError('User not found')
 *   }
 *   res.json({ user })
 * }))
 * ```
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
