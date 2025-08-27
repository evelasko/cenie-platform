import { type NextRequest } from 'next/server'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, type Subscription } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth-middleware'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  serializeSubscription,
} from '../../../../lib/api-utils'

// Get user subscriptions
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

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
  } catch (error) {
    return handleApiError(error)
  }
}
