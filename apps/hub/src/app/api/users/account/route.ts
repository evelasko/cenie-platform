import { type NextRequest } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth, getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth'
import { createSuccessResponse } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'

// Delete user account
export const DELETE = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const firestore = getAdminFirestore()
    const auth = getAdminAuth()

    // Start a batch operation
    const batch = firestore.batch()

    // Delete user subscriptions
    const subscriptionsSnapshot = await firestore
      .collection(COLLECTIONS.SUBSCRIPTIONS)
      .where('userId', '==', userId)
      .get()

    subscriptionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete user app access
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .get()

    accessSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete user profile
    const profileRef = firestore.collection(COLLECTIONS.PROFILES).doc(userId)
    batch.delete(profileRef)

    // Commit the batch
    await batch.commit()

    // Delete auth user
    await auth.deleteUser(userId)

    logger.info('Account deleted', { userId })

    return createSuccessResponse({ message: 'Account deleted successfully' })
  })
)
