import { getFirebaseAuth } from '@cenie/firebase/client'
import {
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type AuthError,
  type UserCredential,
} from 'firebase/auth'

import { handleOAuthError } from './error-handler'
import type { OAuthResult } from './types'

/**
 * Sign in with Apple using popup or redirect
 *
 * @param useRedirect - If true, uses redirect flow (better for mobile)
 * @returns OAuth result with user and credential
 * @throws OAuthError with user-friendly message
 *
 * @example
 * ```typescript
 * try {
 *   const result = await signInWithApple()
 *   console.log('Signed in:', result.user.email)
 * } catch (error) {
 *   console.error('OAuth failed:', error.message)
 * }
 * ```
 */
export async function signInWithApple(useRedirect = false): Promise<OAuthResult> {
  const auth = getFirebaseAuth()
  const provider = new OAuthProvider('apple.com')

  // Add required scopes for Apple
  provider.addScope('email')
  provider.addScope('name')

  // Add custom parameters for Apple Sign-In
  provider.setCustomParameters({
    locale: 'en',
  })

  try {
    let result: UserCredential

    if (useRedirect) {
      // Use redirect for mobile or when popup is blocked
      await signInWithRedirect(auth, provider)
      // The result will be available after redirect via getRedirectResult
      throw new Error('Redirect initiated - check redirect result on app initialization')
    } else {
      // Use popup for desktop
      result = await signInWithPopup(auth, provider)
    }

    const credential = OAuthProvider.credentialFromResult(result)

    return {
      user: result.user,
      credential,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isNewUser: (result as any).additionalUserInfo?.isNewUser ?? false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      additionalUserInfo: (result as any).additionalUserInfo || undefined,
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, 'Apple')
  }
}

