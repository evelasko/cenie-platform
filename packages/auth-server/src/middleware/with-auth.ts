import { createLogger } from '@cenie/logger'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { verifySession } from '../session/verify-session'
import type { AuthenticatedUser } from '../types'

import type { AuthenticatedHandler, NextRouteHandler } from './types'

const logger = createLogger({ name: 'auth-server:middleware:withAuth' })

/**
 * Higher-order function that wraps an API route handler with authentication
 * 
 * Ensures the user has a valid session before calling the handler.
 * Returns 401 if not authenticated.
 * 
 * @param handler - The route handler to protect with authentication
 * @returns A new route handler that requires authentication
 * 
 * @example
 * ```typescript
 * import { withAuth } from '@cenie/auth-server/middleware'
 * 
 * export const GET = withAuth(async (request, { user }) => {
 *   // user is guaranteed to be authenticated
 *   return NextResponse.json({ userId: user.uid })
 * })
 * ```
 */
export function withAuth<TParams = unknown>(
  handler: AuthenticatedHandler<TParams>
): NextRouteHandler<TParams> {
  return async (request: NextRequest, context?: { params?: TParams }) => {
    try {
      // Get session cookie
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('session')

      if (!sessionCookie) {
        logger.warn('Authentication required - no session cookie', {
          path: request.nextUrl.pathname,
        })
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      // Verify session
      const decoded = await verifySession(sessionCookie.value)

      if (!decoded) {
        logger.warn('Authentication failed - invalid session', {
          path: request.nextUrl.pathname,
        })
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
      }

      // Build user object
      const user: AuthenticatedUser = {
        uid: decoded.uid,
        email: decoded.email || null,
        role: 'viewer', // Default role, will be determined by access check in withRole
        session: decoded,
      }

      logger.debug('User authenticated', {
        userId: user.uid,
        path: request.nextUrl.pathname,
      })

      // Call original handler with authenticated user
      return await handler(request, { user, params: context?.params })
    } catch (error: unknown) {
      logger.error('Error in withAuth middleware', {
        error,
        path: request.nextUrl.pathname,
      })
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

