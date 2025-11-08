import { type NextRequest } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminFirestore } from '../../../../../../lib/firebase-admin'
import { COLLECTIONS, type UserAppAccess } from '../../../../../../lib/types'
import { authenticateRequest } from '../../../../../../lib/auth-middleware'
import { createSuccessResponse } from '../../../../../../lib/api-utils'

// Check specific app access
export const GET = withErrorHandling(
  withLogging(async (
    request: NextRequest,
    { params }: { params: Promise<{ appName: string }> }
  ) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult
    const { appName } = await params
    const firestore = getAdminFirestore()

    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      return createSuccessResponse({
        hasAccess: false,
        role: null,
      })
    }

    const access = accessSnapshot.docs[0].data() as UserAppAccess

    return createSuccessResponse({
      hasAccess: true,
      role: access.role,
      grantedAt: access.grantedAt.toDate().toISOString(),
    })
  })
)
