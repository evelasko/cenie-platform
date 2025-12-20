import { hasRole } from '@cenie/auth-utils/roles'
import { createLogger } from '@cenie/logger'
import { NextResponse } from 'next/server'

import { checkAppAccess } from '../helpers/check-app-access'
import type { AppName } from '../types'

import type { AuthenticatedHandler, NextRouteHandler } from './types'
import { withAuth } from './with-auth'


const logger = createLogger({ name: 'auth-server:middleware:withRole' })

/**
 * Higher-order function that wraps an API route handler with role-based access control
 * 
 * Ensures the user is authenticated AND has the required role for the specified app.
 * Returns 401 if not authenticated, 403 if no access or insufficient permissions.
 * 
 * @param appName - The app to check access for (hub, editorial, academy, agency)
 * @param minimumRole - The minimum role required (e.g., 'viewer', 'editor', 'admin')
 * @param handler - The route handler to protect
 * @returns A new route handler that requires authentication and role
 * 
 * @example
 * ```typescript
 * import { withRole } from '@cenie/auth-server/middleware'
 * 
 * export const GET = withRole('editorial', 'editor', async (request, { user }) => {
 *   // user is guaranteed to have editor role or higher in editorial app
 *   return NextResponse.json({ role: user.role })
 * })
 * ```
 * 
 * @note checkAppAccess is imported from helpers module (TASK_1A3).
 * Role hierarchy checking uses hasRole from @cenie/auth-utils (TASK_1A4).
 */
export function withRole<TParams = unknown>(
  appName: AppName,
  minimumRole: string,
  handler: AuthenticatedHandler<TParams>
): NextRouteHandler<TParams> {
  // Compose with withAuth to ensure authentication first
  return withAuth<TParams>(async (request, context) => {
    const { user } = context

    try {
      // Check if user has access to the app
      const access = await checkAppAccess(user.uid, appName)

      if (!access.hasAccess) {
        logger.warn('Access denied - user has no app access', {
          userId: user.uid,
          appName,
          path: request.nextUrl.pathname,
        })
        return NextResponse.json(
          { error: `No access to ${appName} app` },
          { status: 403 }
        )
      }

      // Check if access has a role
      if (!access.role) {
        logger.warn('Access denied - no role assigned', {
          userId: user.uid,
          appName,
          path: request.nextUrl.pathname,
        })
        return NextResponse.json(
          { error: 'No role assigned' },
          { status: 403 }
        )
      }

      // Check role hierarchy
      if (!hasRole(access.role, minimumRole)) {
        logger.warn('Access denied - insufficient role', {
          userId: user.uid,
          appName,
          userRole: access.role,
          requiredRole: minimumRole,
          path: request.nextUrl.pathname,
        })
        return NextResponse.json(
          {
            error: 'Insufficient permissions',
            userRole: access.role,
            requiredRole: minimumRole,
          },
          { status: 403 }
        )
      }

      // Update user object with actual role from access check
      const authenticatedUser = {
        ...user,
        role: access.role,
      }

      logger.debug('User authorized with role', {
        userId: user.uid,
        appName,
        role: access.role,
        path: request.nextUrl.pathname,
      })

      // Call handler with role-verified user
      return await handler(request, {
        ...context,
        user: authenticatedUser,
      })
    } catch (error: unknown) {
      logger.error('Error in withRole middleware', {
        error,
        appName,
        minimumRole,
        path: request.nextUrl.pathname,
      })
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}

