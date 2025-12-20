import { getFirebaseAuth } from '@cenie/firebase/client'
import { fetchSignInMethodsForEmail, type AuthCredential } from 'firebase/auth'

import type { OAuthError } from '../providers/types'

/**
 * Handle account-exists-with-different-credential error
 *
 * Extracts information needed to help user link their accounts
 *
 * @param error - OAuthError from Firebase
 * @returns Email, existing providers, and pending credential
 * @throws Error if not an account-exists error
 *
 * @example
 * ```typescript
 * try {
 *   await signInWithGoogle()
 * } catch (error) {
 *   if (error.code === 'auth/account-exists-with-different-credential') {
 *     const info = await handleAccountExistsError(error)
 *     console.log(`Account ${info.email} exists with: ${info.existingProviders}`)
 *   }
 * }
 * ```
 */
export async function handleAccountExistsError(error: OAuthError): Promise<{
  email: string
  existingProviders: string[]
  pendingCredential: AuthCredential | null
}> {
  if (error.code !== 'auth/account-exists-with-different-credential') {
    throw error
  }

  const { email } = error
  if (!email) {
    throw new Error('No email found in error')
  }

  const auth = getFirebaseAuth()
  const existingProviders = await fetchSignInMethodsForEmail(auth, email)

  return {
    email,
    existingProviders,
    pendingCredential: error.credential || null,
  }
}

