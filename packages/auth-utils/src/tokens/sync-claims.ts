import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'

import type { AppName } from '../types'

import { updateCustomClaims } from './custom-claims'

const logger = createLogger({ name: 'auth-utils:tokens:sync-claims' })

/**
 * Sync user's custom claims based on their Firestore access records
 * Called after granting/revoking access to update ID token claims
 *
 * @param userId - Firebase UID
 *
 * @example
 * ```typescript
 * await syncCustomClaims('user123')
 * // User's ID token will now include their apps and roles
 * ```
 */
export async function syncCustomClaims(userId: string): Promise<void> {
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()
    const auth = adminApp.auth()

    // Get all active access records for user
    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get()

    // Build custom claims
    const apps: AppName[] = []
    const roles: Record<string, string> = {}

    accessSnapshot.forEach((doc) => {
      const data = doc.data()
      apps.push(data.appName as AppName)
      roles[data.appName] = data.role
    })

    const claims = {
      apps, // Array: ['hub', 'editorial']
      roles, // Object: { hub: 'user', editorial: 'editor' }
    }

    // Update Firebase custom claims
    await updateCustomClaims(userId, claims, auth)

    logger.info('Custom claims synced', { userId, apps, roles })
  } catch (error: unknown) {
    logger.error('Failed to sync custom claims', { error, userId })
    // Don't throw - this is not critical, access still works via Firestore
  }
}

