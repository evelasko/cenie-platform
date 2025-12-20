import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'

import type { AccessData, AppName } from '../types'

import { accessCache } from './cache'

const logger = createLogger({ name: 'auth-utils:access-control:check' })

/**
 * Check user app access with caching
 * Queries Firestore directly and caches the result
 *
 * @param userId - Firebase UID of the user
 * @param appName - Name of the app to check access for
 * @returns AccessData object with access status and role
 *
 * @example
 * ```typescript
 * const access = await checkUserAppAccess(user.uid, 'editorial')
 * if (access.hasAccess) {
 *   console.log(`User has ${access.role} role`)
 * }
 * ```
 */
export async function checkUserAppAccess(
  userId: string,
  appName: AppName
): Promise<AccessData> {
  // Check cache first
  const cached = accessCache.get(userId, appName)

  if (cached) {
    logger.debug('Access check cache hit', { userId, appName })
    return cached
  }

  // Cache miss - query Firestore directly
  logger.debug('Access check cache miss - querying Firestore', { userId, appName })
  
  try {
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()

    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    let access: AccessData

    if (accessSnapshot.empty) {
      access = {
        hasAccess: false,
        role: null,
        isActive: false,
      }
    } else {
      const accessDoc = accessSnapshot.docs[0].data()
      access = {
        hasAccess: true,
        role: accessDoc.role as string,
        isActive: accessDoc.isActive as boolean,
      }
    }

    // Cache the result
    accessCache.set(userId, appName, access)

    return access
  } catch (error: unknown) {
    logger.error('Error checking app access', { error, userId, appName })
    
    // Return no access on error (fail closed)
    return {
      hasAccess: false,
      role: null,
      isActive: false,
    }
  }
}

