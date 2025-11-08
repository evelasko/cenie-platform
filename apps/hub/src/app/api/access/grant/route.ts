import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, UserAppAccess } from '../../../../lib/types'
import { authenticateRequest, requireAdmin } from '../../../../lib/auth-middleware'
import { createSuccessResponse, parseRequestBody, serializeAccess } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'
import { Timestamp } from 'firebase-admin/firestore'

const grantAccessSchema = z.object({
  userId: z.string(),
  appName: z.enum(['hub', 'editorial', 'academy', 'learn']),
  role: z.enum(['viewer', 'user', 'editor', 'admin']).default('user'),
})

// Grant app access to user (admin only)
export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const authResult = await authenticateRequest(request)
    const { userId: adminUserId } = authResult

    // Check admin privileges
    await requireAdmin(adminUserId)

    const body = await parseRequestBody(request)
    const { userId, appName, role } = grantAccessSchema.parse(body)

    const firestore = getAdminFirestore()

    // Check if access already exists
    const existingAccessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .limit(1)
      .get()

    if (!existingAccessSnapshot.empty) {
      // Update existing access
      const docId = existingAccessSnapshot.docs[0].id

      await firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc(docId).update({
        role,
        isActive: true,
        grantedBy: adminUserId,
        grantedAt: Timestamp.now(),
      })

      const updatedDoc = await firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc(docId).get()

      const access = { ...(updatedDoc.data() as UserAppAccess), id: docId }

      logger.info('Access updated', { userId, appName, role, adminUserId })

      return createSuccessResponse({
        message: 'Access updated successfully',
        access: serializeAccess(access),
      })
    }

    // Create new access
    const accessData: UserAppAccess = {
      userId,
      appName,
      role,
      isActive: true,
      grantedBy: adminUserId,
      grantedAt: Timestamp.now(),
    }

    const docRef = await firestore.collection(COLLECTIONS.USER_APP_ACCESS).add(accessData)

    const access = { ...accessData, id: docRef.id }

    logger.info('Access granted', { userId, appName, role, adminUserId })

    return createSuccessResponse(
      {
        message: 'Access granted successfully',
        access: serializeAccess(access),
      },
      201
    )
  })
)
