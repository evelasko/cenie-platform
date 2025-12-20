import { DatabaseError } from '@cenie/errors'
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { Timestamp } from 'firebase-admin/firestore'

import type { AppName } from '../types'

import { accessCache } from './cache'

const logger = createLogger({ name: 'auth-utils:access-control:grant' })

export interface GrantAccessOptions {
  userId: string
  appName: AppName
  role: string
  grantedBy: string | null
}

/**
 * Grant user access to an app
 * Creates or updates record in Firestore user_app_access collection
 *
 * @param options - Grant access options
 *
 * @example
 * ```typescript
 * await grantAccess({
 *   userId: 'user123',
 *   appName: 'editorial',
 *   role: 'editor',
 *   grantedBy: 'admin456'
 * })
 * ```
 */
export async function grantAccess(options: GrantAccessOptions): Promise<void> {
  const { userId, appName, role, grantedBy } = options

  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()

    // Check if access already exists
    const existingAccess = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .limit(1)
      .get()

    if (!existingAccess.empty) {
      // Update existing record
      const docId = existingAccess.docs[0].id
      await firestore.collection('user_app_access').doc(docId).update({
        role,
        isActive: true,
        grantedAt: Timestamp.now(),
        grantedBy,
      })

      logger.info('Updated existing access', { userId, appName, role })
    } else {
      // Create new record
      await firestore.collection('user_app_access').add({
        userId,
        appName,
        role,
        isActive: true,
        grantedAt: Timestamp.now(),
        grantedBy,
      })

      logger.info('Granted new access', { userId, appName, role })
    }

    // Clear cache for this user/app
    accessCache.clear(userId, appName)

    // Sync custom claims
    const { syncCustomClaims } = await import('../tokens/sync-claims')
    await syncCustomClaims(userId)
  } catch (error: unknown) {
    logger.error('Failed to grant access', { error, userId, appName, role })
    throw new DatabaseError('Failed to grant access', {
      cause: error instanceof Error ? error : undefined,
      metadata: { userId, appName, role },
    })
  }
}

