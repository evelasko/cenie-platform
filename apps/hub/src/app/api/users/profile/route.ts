import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { NotFoundError } from '@cenie/errors'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, type Profile } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth'
import { createSuccessResponse, parseRequestBody, serializeProfile } from '../../../../lib/api-utils'
import { Timestamp } from 'firebase-admin/firestore'

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.url().optional(),
})

// Get user profile
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const firestore = getAdminFirestore()

    const profileDoc = await firestore.collection(COLLECTIONS.PROFILES).doc(userId).get()

    if (!profileDoc.exists) {
      throw new NotFoundError('Profile not found', {
        metadata: { userId },
      })
    }

    const profile = profileDoc.data() as Profile
    return createSuccessResponse({ profile: serializeProfile(profile) })
  })
)

// Update user profile
export const PUT = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const body = await parseRequestBody(request)
    const updates = updateProfileSchema.parse(body)

    const firestore = getAdminFirestore()

    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.now(),
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    await firestore.collection(COLLECTIONS.PROFILES).doc(userId).update(updateData)

    // Get updated profile
    const profileDoc = await firestore.collection(COLLECTIONS.PROFILES).doc(userId).get()

    const profile = profileDoc.data() as Profile
    return createSuccessResponse({ profile: serializeProfile(profile) })
  })
)
