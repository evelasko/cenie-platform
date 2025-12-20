import { AuthenticationError, AuthorizationError, DatabaseError } from '@cenie/errors'
import { verifyIdToken } from '@cenie/auth-server/helpers'
import type { NextRequest } from 'next/server'

import { getAdminFirestore } from './firebase-admin'
import { COLLECTIONS } from './types'

/**
 * Authenticate request and extract userId from Bearer token
 * This is a Hub-specific helper that maintains compatibility with existing code
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; user: { uid: string; email: string | null } }> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1] // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token required', {
        metadata: { hasAuthHeader: !!authHeader },
      })
    }

    // Verify Firebase ID token using shared package
    const decoded = await verifyIdToken(token)

    return {
      userId: decoded.uid,
      user: {
        uid: decoded.uid,
        email: decoded.email || null,
      },
    }
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      throw error
    }

    throw new AuthenticationError('Authentication failed', {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

/**
 * Require admin role - checks if user has admin role in any app
 */
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

    throw new DatabaseError('Authorization check failed', {
      cause: error instanceof Error ? error : undefined,
      metadata: { userId },
    })
  }
}

