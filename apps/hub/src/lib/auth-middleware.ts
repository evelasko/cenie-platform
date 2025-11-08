import { type NextRequest } from 'next/server'
import { AuthenticationError, AuthorizationError, DatabaseError } from '@cenie/errors'
import { logger } from './logger'
import { getAdminAuth, getAdminFirestore } from './firebase-admin'
import { COLLECTIONS, type UserAppAccess } from './types'

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  user?: unknown
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; user: unknown }> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token required', {
        metadata: { hasAuthHeader: !!authHeader },
      })
    }

    // Verify Firebase ID token
    const auth = getAdminAuth()
    const decodedToken = await auth.verifyIdToken(token)

    return {
      userId: decodedToken.uid,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        customClaims: decodedToken,
      },
    }
  } catch (error: unknown) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error
    }

    if (error instanceof Error && error.message.includes('auth/id-token-expired')) {
      throw new AuthenticationError('Token expired', {
        cause: error,
        metadata: { tokenType: 'id-token' },
      })
    }

    if (error instanceof Error && error.message.includes('auth/invalid-id-token')) {
      throw new AuthenticationError('Invalid token', {
        cause: error,
        metadata: { tokenType: 'id-token' },
      })
    }

    logger.error('Authentication error', error, {
      hasAuthHeader: !!request.headers.get('authorization'),
    })
    throw new AuthenticationError('Authentication failed', {
      cause: error,
    })
  }
}

export async function requireAdmin(userId: string): Promise<void> {
  try {
    if (!userId) {
      throw new AuthenticationError('Authentication required')
    }

    // Check if user has admin role in any app
    const firestore = getAdminFirestore()
    const adminAccessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('role', '==', 'admin')
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (adminAccessSnapshot.empty) {
      throw new AuthorizationError('Admin access required', {
        metadata: { userId },
      })
    }
  } catch (error: unknown) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error
    }

    logger.error('Admin check error', error, { userId })
    throw new DatabaseError('Authorization check failed', {
      cause: error,
      metadata: { userId },
    })
  }
}

export async function requireAppAccess(
  userId: string,
  appName: string
): Promise<UserAppAccess & { id: string }> {
  try {
    if (!userId) {
      throw new AuthenticationError('Authentication required')
    }

    const firestore = getAdminFirestore()
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      throw new AuthorizationError(`Access denied to ${appName}`, {
        metadata: { userId, appName },
      })
    }

    const access = accessSnapshot.docs[0].data() as UserAppAccess
    return { ...access, id: accessSnapshot.docs[0].id }
  } catch (error: unknown) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error
    }

    logger.error('App access error', error, { userId, appName })
    throw new DatabaseError('Authorization check failed', {
      cause: error,
      metadata: { userId, appName },
    })
  }
}

export async function requireRole(
  userId: string,
  appName: string,
  requiredRole: string
): Promise<UserAppAccess & { id: string }> {
  const roleHierarchy = ['viewer', 'user', 'editor', 'admin']
  const requiredRoleLevel = roleHierarchy.indexOf(requiredRole)

  try {
    if (!userId) {
      throw new AuthenticationError('Authentication required')
    }

    const firestore = getAdminFirestore()
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      throw new AuthorizationError(`Access denied to ${appName}`, {
        metadata: { userId, appName },
      })
    }

    const access = accessSnapshot.docs[0].data() as UserAppAccess
    const userRoleLevel = roleHierarchy.indexOf(access.role)

    if (userRoleLevel < requiredRoleLevel) {
      throw new AuthorizationError(
        `Insufficient permissions. Required: ${requiredRole}, Current: ${access.role}`,
        {
          metadata: { userId, appName, requiredRole, currentRole: access.role },
        }
      )
    }

    return { ...access, id: accessSnapshot.docs[0].id }
  } catch (error: unknown) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error
    }

    logger.error('Role check error', error, { userId, appName, requiredRole })
    throw new DatabaseError('Authorization check failed', {
      cause: error,
      metadata: { userId, appName, requiredRole },
    })
  }
}
