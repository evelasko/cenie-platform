import { getFirebaseAuth } from '@cenie/firebase/client'
import { linkWithCredential, type AuthCredential, type User } from 'firebase/auth'

/**
 * Link pending credential after signing in with existing provider
 *
 * After user signs in with their existing method, this links the new OAuth credential
 *
 * @param pendingCredential - The OAuth credential to link
 * @returns Updated user with linked credential
 * @throws Error if no authenticated user
 *
 * @example
 * ```typescript
 * // User signs in with email/password
 * await signIn(email, password)
 *
 * // Then link the pending Google credential
 * const user = await linkPendingCredential(pendingCredential)
 * console.log('Credential linked!')
 * ```
 */
export async function linkPendingCredential(pendingCredential: AuthCredential): Promise<User> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('No authenticated user to link credential with')
  }

  const result = await linkWithCredential(user, pendingCredential)
  return result.user
}

