import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, UserAppAccess, SerializedUserAppAccess } from '../../../../lib/types'
import { authenticateRequest, requireAdmin } from '../../../../lib/auth-middleware'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  parseRequestBody,
  serializeAccess,
} from '../../../../lib/api-utils'
import { Timestamp } from 'firebase-admin/firestore'

const bulkGrantSchema = z.object({
  userIds: z.array(z.string()).min(1),
  appName: z.enum(['hub', 'editorial', 'academy', 'learn']),
  role: z.enum(['viewer', 'user', 'editor', 'admin']).default('user'),
})

// Bulk grant access (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId: adminUserId } = authResult

    // Check admin privileges
    const adminCheck = await requireAdmin(adminUserId)
    if (!adminCheck.success) {
      return createErrorResponse(adminCheck.error!, adminCheck.status!)
    }

    const body = await parseRequestBody(request)
    const { userIds, appName, role } = bulkGrantSchema.parse(body)

    const firestore = getAdminFirestore()
    const batch = firestore.batch()
    const accessRecords: SerializedUserAppAccess[] = []

    for (const userId of userIds) {
      // Check if access already exists
      const existingAccessSnapshot = await firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .where('userId', '==', userId)
        .where('appName', '==', appName)
        .limit(1)
        .get()

      const accessData: UserAppAccess = {
        userId,
        appName,
        role,
        isActive: true,
        grantedBy: adminUserId,
        grantedAt: Timestamp.now(),
      }

      if (!existingAccessSnapshot.empty) {
        // Update existing access
        const docRef = existingAccessSnapshot.docs[0].ref
        batch.update(docRef, {
          userId: accessData.userId,
          appName: accessData.appName,
          role: accessData.role,
          isActive: accessData.isActive,
          grantedBy: accessData.grantedBy,
          grantedAt: accessData.grantedAt,
        })
        accessRecords.push(serializeAccess({ ...accessData, id: docRef.id }))
      } else {
        // Create new access
        const docRef = firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc()
        batch.set(docRef, accessData)
        accessRecords.push(serializeAccess({ ...accessData, id: docRef.id }))
      }
    }

    await batch.commit()

    return createSuccessResponse({
      message: `Access granted to ${userIds.length} users`,
      access: accessRecords,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }
    return handleApiError(error)
  }
}
