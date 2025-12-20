import { getFirebaseAuth } from '@cenie/firebase/client'
import {
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  type AuthError,
} from 'firebase/auth'

import { handleOAuthError } from './error-handler'
import type { OAuthResult } from './types'

/**
 * Get redirect result after OAuth redirect flow
 *
 * Call this on app initialization to check if user was redirected back from OAuth
 *
 * @returns OAuth result if redirect happened, null if no redirect
 * @throws OAuthError if redirect failed
 *
 * @example
 * ```typescript
 * // In your app initialization (useEffect)
 * const result = await getOAuthRedirectResult()
 * if (result) {
 *   // User just completed OAuth redirect
 *   console.log('Signed in:', result.user.email)
 * }
 * ```
 */
export async function getOAuthRedirectResult(): Promise<OAuthResult | null> {
  const auth = getFirebaseAuth()

  try {
    const result = await getRedirectResult(auth)

    if (!result) {
      return null
    }

    // Determine the provider and get appropriate credential
    let credential = null
    const { providerId } = result

    if (providerId === 'google.com') {
      credential = GoogleAuthProvider.credentialFromResult(result)
    } else if (providerId === 'apple.com') {
      credential = OAuthProvider.credentialFromResult(result)
    }

    return {
      user: result.user,
      credential,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isNewUser: (result as any).additionalUserInfo?.isNewUser ?? false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      additionalUserInfo: (result as any).additionalUserInfo || undefined,
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, 'OAuth Redirect')
  }
}

