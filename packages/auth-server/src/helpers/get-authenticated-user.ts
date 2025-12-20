import { cookies } from 'next/headers'

import { verifySession } from '../session/verify-session'

import type { AuthenticatedUser } from './types'

/**
 * Get the authenticated user from the session cookie
 * 
 * @returns AuthenticatedUser if session is valid, null if no session or invalid
 * 
 * @example
 * ```typescript
 * const user = await getAuthenticatedUser()
 * if (!user) {
 *   return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
 * }
 * // user.uid, user.email, user.session are now available
 * ```
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  // Get session cookie from request
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return null
  }

  // Verify the session
  const session = await verifySession(sessionCookie.value)

  if (!session) {
    return null
  }

  // Build and return authenticated user object
  return {
    uid: session.uid,
    email: session.email || null,
    role: 'viewer', // Default role, actual role determined by checkAppAccess
    session,
  }
}

