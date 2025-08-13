import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, type Profile } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth-middleware'
import { createErrorResponse, createSuccessResponse, handleApiError, parseRequestBody, serializeProfile } from '../../../../lib/api-utils'
import { Timestamp } from 'firebase-admin/firestore'

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.url().optional(),
})

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult
    const firestore = getAdminFirestore()

    const profileDoc = await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userId)
      .get()

    if (!profileDoc.exists) {
      return createErrorResponse('Profile not found', 404)
    }

    const profile = profileDoc.data() as Profile
    return createSuccessResponse({ profile: serializeProfile(profile) })
  } catch (error) {
    return handleApiError(error)
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult
    const body = await parseRequestBody(request)
    const updates = updateProfileSchema.parse(body)

    const firestore = getAdminFirestore()

    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.now(),
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userId)
      .update(updateData)

    // Get updated profile
    const profileDoc = await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userId)
      .get()

    const profile = profileDoc.data() as Profile
    return createSuccessResponse({ profile: serializeProfile(profile) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    return handleApiError(error)
  }
}