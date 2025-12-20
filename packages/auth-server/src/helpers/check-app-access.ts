import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'

import type { AccessData, AppName } from '../types'

const logger = createLogger({ name: 'auth-server:helpers:checkAppAccess' })

/**
 * Check if a user has access to a specific app and get their role
 * 
 * Queries Firestore `user_app_access` collection to determine:
 * - If the user has access to the app
 * - Their role in the app (viewer, editor, admin, etc.)
 * - If their access is active
 * 
 * @param userId - Firebase UID of the user
 * @param appName - Name of the app to check access for
 * @returns AccessData object with access status and role
 * 
 * @example
 * ```typescript
 * const access = await checkAppAccess(user.uid, 'editorial')
 * if (!access.hasAccess) {
 *   return NextResponse.json({ error: 'No access' }, { status: 403 })
 * }
 * // User has access with role: access.role
 * ```
 */
export async function checkAppAccess(
  userId: string,
  appName: AppName
): Promise<AccessData> {
  try {
    // Get Firebase Admin and Firestore
    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()

    // Query user_app_access collection
    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    // No access found
    if (accessSnapshot.empty) {
      return {
        hasAccess: false,
        role: null,
        isActive: false,
      }
    }

    // Get access document data
    const accessDoc = accessSnapshot.docs[0].data()

    return {
      hasAccess: true,
      role: accessDoc.role as string,
      isActive: accessDoc.isActive as boolean,
    }
  } catch (error: unknown) {
    // Log error but don't throw - fail closed for security
    logger.error('Error checking app access', {
      error,
      userId,
      appName,
    })

    // Return no access on error (fail closed)
    return {
      hasAccess: false,
      role: null,
      isActive: false,
    }
  }
}

