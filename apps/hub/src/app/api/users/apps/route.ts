import { type NextRequest } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, type UserAppAccess } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth-middleware'
import { createSuccessResponse, serializeAccess } from '../../../../lib/api-utils'

// Get user app access
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const firestore = getAdminFirestore()

    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('grantedAt', 'desc')
      .get()

    const access = accessSnapshot.docs.map((doc) => {
      const data = doc.data() as UserAppAccess
      return serializeAccess({ ...data, id: doc.id })
    })

    return createSuccessResponse({ access })
  })
)
