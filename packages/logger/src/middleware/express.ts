import type { Request, Response, NextFunction } from 'express'

import { logContext, ContextKeys } from '../context/async-context.server'
import type { ILogger } from '../core/types'

/**
 * Extend Express Request to include logger
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      log: ILogger
    }
  }
}

/**
 * Extract client IP from Express request
 */
function getClientIP(req: Request): string | undefined {
  const forwardedFor = req.headers['x-forwarded-for']
  const realIp = req.headers['x-real-ip']

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim()
  }

  if (typeof realIp === 'string') {
    return realIp
  }

  return req.socket.remoteAddress
}

/**
 * Request logging middleware for Express
 * Adds request context and attaches logger to req.log
 *
 * @example
 * ```typescript
 * import { createLogger } from '@cenie/logger'
 * import { requestLogger } from '@cenie/logger/express'
 *
 * const logger = createLogger({ name: 'api' })
 * app.use(requestLogger(logger))
 *
 * app.get('/users', (req, res) => {
 *   req.log.info('Fetching users')
 *   // ...
 * })
 * ```
 */
export function requestLogger(logger: ILogger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = crypto.randomUUID()

    const context = {
      [ContextKeys.REQUEST_ID]: requestId,
      [ContextKeys.PATH]: req.path,
      [ContextKeys.METHOD]: req.method,
      [ContextKeys.USER_AGENT]: req.headers['user-agent'],
      [ContextKeys.IP_ADDRESS]: getClientIP(req),
    }

    // Run the rest of the request in log context
    logContext.run(context, () => {
      // Attach child logger to request
      req.log = logger.child(context)

      const start = Date.now()

      // Log when response finishes
      res.on('finish', () => {
        const duration = Date.now() - start
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'

        req.log[level]('Request completed', {
          statusCode: res.statusCode,
          duration,
          method: req.method,
          path: req.path,
        })
      })

      next()
    })
  }
}

/**
 * Error logging middleware for Express
 * Should be added after all routes
 *
 * @example
 * ```typescript
 * import { errorLogger } from '@cenie/logger/express'
 *
 * // After all routes
 * app.use(errorLogger())
 *
 * // Then your error handler
 * app.use((err, req, res, next) => {
 *   res.status(500).json({ error: 'Internal server error' })
 * })
 * ```
 */
export function errorLogger() {
  return (err: Error, req: Request, _res: Response, next: NextFunction) => {
    if (req.log) {
      req.log.error('Request error', err, {
        method: req.method,
        path: req.path,
        query: req.query,
      })
    }

    next(err)
  }
}

/**
 * Add user context to current Express request
 */
export function setUserContext(userId: string, sessionId?: string): void {
  logContext.set(ContextKeys.USER_ID, userId)
  if (sessionId) {
    logContext.set(ContextKeys.SESSION_ID, sessionId)
  }
}

/**
 * Add custom context to current Express request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addContext(key: string, value: any): void {
  logContext.set(key, value)
}

// Unused variable fix
export {} // This ensures the module has exports
