import { AuthenticationError } from '@cenie/errors'
import { initializeAdminApp } from '@cenie/firebase/server'
import type { DecodedIdToken } from 'firebase-admin/auth'

/**
 * Verify a Firebase ID token from an Authorization header
 * 
 * Used for API routes that receive Bearer tokens instead of session cookies.
 * Common in:
 * - API calls from mobile apps
 * - Service-to-service communication
 * - Inter-app API requests
 * 
 * @param token - The Firebase ID token to verify
 * @returns DecodedIdToken if valid
 * @throws AuthenticationError if token is invalid, expired, or missing
 * 
 * @example
 * ```typescript
 * const authHeader = request.headers.get('authorization')
 * const token = authHeader?.replace('Bearer ', '')
 * 
 * try {
 *   const decoded = await verifyIdToken(token)
 *   // Token is valid, use decoded.uid, decoded.email, etc.
 * } catch (error) {
 *   return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
 * }
 * ```
 */
export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  // Validate input
  if (!token || token.trim().length === 0) {
    throw new AuthenticationError('Token is required')
  }

  try {
    // Get Firebase Admin and verify token
    const adminApp = initializeAdminApp()
    const auth = adminApp.auth()
    const decodedToken = await auth.verifyIdToken(token)

    return decodedToken
  } catch (error: unknown) {
    // Handle specific Firebase error codes
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string }

      if (firebaseError.code === 'auth/id-token-expired') {
        throw new AuthenticationError('Token expired', {
          metadata: { tokenType: 'id-token' },
        })
      }

      if (firebaseError.code === 'auth/invalid-id-token') {
        throw new AuthenticationError('Invalid token', {
          metadata: { tokenType: 'id-token' },
        })
      }

      if (firebaseError.code === 'auth/argument-error') {
        throw new AuthenticationError('Malformed token', {
          metadata: { tokenType: 'id-token' },
        })
      }
    }

    // Generic verification error
    throw new AuthenticationError('Token verification failed', {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

