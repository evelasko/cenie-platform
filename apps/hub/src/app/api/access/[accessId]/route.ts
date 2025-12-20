import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { NotFoundError } from '@cenie/errors'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, UserAppAccess } from '../../../../lib/types'
import { authenticateRequest, requireAdmin } from '../../../../lib/auth'
import { createSuccessResponse, parseRequestBody, serializeAccess } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'

const updateAccessSchema = z.object({
  role: z.enum(['viewer', 'user', 'editor', 'admin']).optional(),
  isActive: z.boolean().optional(),
})

// Update user access (admin only)
export const PUT = withErrorHandling(
  withLogging(async (
    request: NextRequest,
    { params }: { params: Promise<{ accessId: string }> }
  ) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    // Check admin privileges
    await requireAdmin(userId)

    const { accessId } = await params
    const body = await parseRequestBody(request)
    const updates = updateAccessSchema.parse(body)

    const firestore = getAdminFirestore()

    const updateData: any = {}
    if (updates.role !== undefined) updateData.role = updates.role
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive

    await firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc(accessId).update(updateData)

    const updatedDoc = await firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc(accessId).get()

    if (!updatedDoc.exists) {
      throw new NotFoundError('Access record not found', {
        metadata: { accessId },
      })
    }

    const access = { ...(updatedDoc.data() as UserAppAccess), id: accessId }

    logger.info('Access updated', { accessId, updates, adminUserId: userId })

    return createSuccessResponse({
      message: 'Access updated successfully',
      access: serializeAccess(access),
    })
  })
)

// Revoke user access (admin only)
export const DELETE = withErrorHandling(
  withLogging(async (
    request: NextRequest,
    { params }: { params: Promise<{ accessId: string }> }
  ) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    // Check admin privileges
    await requireAdmin(userId)

    const { accessId } = await params
    const firestore = getAdminFirestore()

    await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .update({ isActive: false })

    const updatedDoc = await firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc(accessId).get()

    if (!updatedDoc.exists) {
      throw new NotFoundError('Access record not found', {
        metadata: { accessId },
      })
    }

    const access = { ...(updatedDoc.data() as UserAppAccess), id: accessId }

    logger.info('Access revoked', { accessId, adminUserId: userId })

    return createSuccessResponse({
      message: 'Access revoked successfully',
      access: serializeAccess(access),
    })
  })
)
