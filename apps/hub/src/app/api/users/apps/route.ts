import { NextRequest } from 'next/server'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, UserAppAccess } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth-middleware'
import { createErrorResponse, createSuccessResponse, handleApiError, serializeAccess } from '../../../../lib/api-utils'

// Get user app access
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult
    const firestore = getAdminFirestore()

    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('grantedAt', 'desc')
      .get()

    const access = accessSnapshot.docs.map(doc => {
      const data = doc.data() as UserAppAccess
      return serializeAccess({ ...data, id: doc.id })
    })

    return createSuccessResponse({ access })
  } catch (error) {
    return handleApiError(error)
  }
}