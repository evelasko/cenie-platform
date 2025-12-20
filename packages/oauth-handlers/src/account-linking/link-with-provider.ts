import { getFirebaseAuth } from '@cenie/firebase/client'
import {
  GoogleAuthProvider,
  linkWithPopup,
  linkWithRedirect,
  OAuthProvider,
  type AuthError,
  type UserCredential,
} from 'firebase/auth'

import { handleOAuthError } from '../providers/error-handler'
import type { OAuthResult } from '../providers/types'

/**
 * Link existing account with OAuth provider
 *
 * Allows users to add Google/Apple login to their existing email account
 *
 * @param provider - Provider to link ('google' or 'apple')
 * @param useRedirect - If true, uses redirect flow
 * @returns OAuth result with linked credential
 * @throws Error if no authenticated user
 * @throws OAuthError if linking fails
 *
 * @example
 * ```typescript
 * // User is signed in with email/password
 * // Now they want to add Google login
 * try {
 *   await linkWithOAuthProvider('google')
 *   console.log('Google account linked!')
 * } catch (error) {
 *   console.error('Linking failed:', error.message)
 * }
 * ```
 */
export async function linkWithOAuthProvider(
  provider: 'google' | 'apple',
  useRedirect = false
): Promise<OAuthResult> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('No authenticated user to link with')
  }

  let oauthProvider: GoogleAuthProvider | OAuthProvider

  if (provider === 'google') {
    oauthProvider = new GoogleAuthProvider()
    oauthProvider.addScope('profile')
    oauthProvider.addScope('email')
  } else {
    oauthProvider = new OAuthProvider('apple.com')
    oauthProvider.addScope('email')
    oauthProvider.addScope('name')
  }

  try {
    let result: UserCredential

    if (useRedirect) {
      await linkWithRedirect(user, oauthProvider)
      throw new Error('Redirect initiated - check redirect result on app initialization')
    } else {
      result = await linkWithPopup(user, oauthProvider)
    }

    const credential =
      provider === 'google'
        ? GoogleAuthProvider.credentialFromResult(result)
        : OAuthProvider.credentialFromResult(result)

    if (!result) {
      throw new Error('No result from linkWithPopup or linkWithRedirect')
    }
    return {
      user: result.user,
      credential,
      isNewUser: false, // Linking existing account
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      additionalUserInfo: (result as any).additionalUserInfo || undefined,
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, provider === 'google' ? 'Google' : 'Apple')
  }
}

