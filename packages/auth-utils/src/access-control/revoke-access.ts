import { DatabaseError } from '@cenie/errors'
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { Timestamp } from 'firebase-admin/firestore'

import type { AppName } from '../types'

import { accessCache } from './cache'

const logger = createLogger({ name: 'auth-utils:access-control:revoke' })

/**
 * Revoke user's access to an app
 * Sets isActive to false (soft delete for audit trail)
 *
 * @param userId - Firebase UID of the user
 * @param appName - Name of the app to revoke access for
 *
 * @example
 * ```typescript
 * await revokeAccess('user123', 'editorial')
 * ```
 */
export async function revokeAccess(userId: string, appName: AppName): Promise<void> {
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()

    // Find access record
    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      logger.warn('No access to revoke', { userId, appName })
      return
    }

    // Update record to inactive
    const docId = accessSnapshot.docs[0].id
    await firestore.collection('user_app_access').doc(docId).update({
      isActive: false,
      updatedAt: Timestamp.now(),
    })

    logger.info('Access revoked', { userId, appName })

    // Clear cache
    accessCache.clear(userId, appName)

    // Sync custom claims
    const { syncCustomClaims } = await import('../tokens/sync-claims')
    await syncCustomClaims(userId)
  } catch (error: unknown) {
    logger.error('Failed to revoke access', { error, userId, appName })
    throw new DatabaseError('Failed to revoke access', {
      cause: error instanceof Error ? error : undefined,
      metadata: { userId, appName },
    })
  }
}

