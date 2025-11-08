import { type NextRequest } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, type Subscription } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth-middleware'
import { createSuccessResponse, serializeSubscription } from '../../../../lib/api-utils'

// Get user subscriptions
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const firestore = getAdminFirestore()

    const subscriptionsSnapshot = await firestore
      .collection(COLLECTIONS.SUBSCRIPTIONS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const subscriptions = subscriptionsSnapshot.docs.map((doc) => {
      const data = doc.data() as Subscription
      return serializeSubscription({ ...data, id: doc.id })
    })

    return createSuccessResponse({ subscriptions })
  })
)
