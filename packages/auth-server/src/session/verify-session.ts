import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import type { DecodedIdToken } from 'firebase-admin/auth'

const logger = createLogger({ name: 'auth-server:session:verify' })

/**
 * Verify a session cookie and return decoded token data
 * 
 * @param sessionCookie - The session cookie string to verify
 * @returns DecodedIdToken if valid, null if invalid or expired
 * 
 * Note: This function returns null instead of throwing errors because
 * session checks happen on every request and expired sessions are normal.
 * The caller can decide how to handle invalid sessions (e.g., redirect to login).
 */
export async function verifySession(sessionCookie: string): Promise<DecodedIdToken | null> {
  // Return null for empty/missing cookie (not an error)
  if (!sessionCookie || sessionCookie.trim().length === 0) {
    return null
  }

  try {
    // Get Firebase Admin instance
    const adminApp = initializeAdminApp()
    const auth = adminApp.auth()

    // Verify session cookie (true = check if revoked)
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

    return decodedClaims
  } catch (error: unknown) {
    // Log the failure but return null (not an error condition)
    logger.debug('Session verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
    })

    return null
  }
}

