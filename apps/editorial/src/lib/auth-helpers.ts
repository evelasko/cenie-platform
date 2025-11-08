import { NextResponse } from 'next/server'
import { getServerSession, initializeAdminApp } from '@cenie/firebase/server'
import { logger } from './logger'
import type { DecodedIdToken } from 'firebase-admin/auth'

/**
 * User roles in the editorial app
 */
export type EditorialRole = 'admin' | 'editor' | 'viewer'

/**
 * Authenticated user with editorial access
 */
export interface AuthenticatedUser {
  uid: string
  email: string | null
  role: EditorialRole
  session: DecodedIdToken
}

/**
 * Get the authenticated user from the session cookie
 * Returns null if no valid session exists
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession()

  if (!session) {
    return null
  }

  return {
    uid: session.uid,
    email: session.email || null,
    role: 'viewer', // Default role, will be determined by checkEditorialAccess
    session,
  }
}

/**
 * Check if the user has access to the editorial app via Firestore
 * Returns the user's access data if they have access, null otherwise
 */
export async function checkEditorialAccess(userId: string): Promise<{
  hasAccess: boolean
  role: EditorialRole | null
  isActive: boolean
} | null> {
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()

    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', 'editorial')
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      return {
        hasAccess: false,
        role: null,
        isActive: false,
      }
    }

    const accessDoc = accessSnapshot.docs[0].data()

    return {
      hasAccess: true,
      role: accessDoc.role as EditorialRole,
      isActive: accessDoc.isActive,
    }
  } catch (error) {
    logger.error('[AuthHelpers] Error checking editorial access', { error })
    return null
  }
}

/**
 * Get authenticated user with verified editorial access
 * Returns the user with their role if authenticated and has access
 * Returns null if not authenticated or no access
 */
export async function getAuthenticatedUserWithAccess(): Promise<AuthenticatedUser | null> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return null
  }

  const access = await checkEditorialAccess(user.uid)

  if (!access || !access.hasAccess || !access.role) {
    return null
  }

  return {
    ...user,
    role: access.role,
  }
}

/**
 * Require authentication - returns 401 if not authenticated
 * Use this at the start of protected API routes
 */
export async function requireAuth(): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  return { user }
}

/**
 * Require authentication AND editorial access
 * Returns 401 if not authenticated, 403 if no access
 */
export async function requireEditorialAccess(): Promise<
  { user: AuthenticatedUser } | NextResponse
> {
  const user = await getAuthenticatedUserWithAccess()

  if (!user) {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'You do not have access to the Editorial app' },
      { status: 403 }
    )
  }

  return { user }
}

/**
 * Require a specific minimum role
 * Returns 401 if not authenticated, 403 if insufficient permissions
 *
 * Role hierarchy: viewer < editor < admin
 */
export async function requireRole(
  minimumRole: EditorialRole
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const authResult = await requireEditorialAccess()

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  // Define role hierarchy
  const roleHierarchy: Record<EditorialRole, number> = {
    viewer: 1,
    editor: 2,
    admin: 3,
  }

  const userRoleLevel = roleHierarchy[user.role]
  const requiredRoleLevel = roleHierarchy[minimumRole]

  if (userRoleLevel < requiredRoleLevel) {
    return NextResponse.json(
      {
        error: `This action requires ${minimumRole} role or higher`,
        currentRole: user.role,
        requiredRole: minimumRole,
      },
      { status: 403 }
    )
  }

  return { user }
}

/**
 * Helper to check if user has a specific role or higher
 */
export function hasRole(userRole: EditorialRole, requiredRole: EditorialRole): boolean {
  const roleHierarchy: Record<EditorialRole, number> = {
    viewer: 1,
    editor: 2,
    admin: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
