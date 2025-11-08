import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
// ConflictError imported but handled by withErrorHandling
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'
import { COLLECTIONS, Profile, UserAppAccess } from '@/lib/types'
import { createSuccessResponse, parseRequestBody } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { Timestamp } from 'firebase-admin/firestore'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { email, password, fullName } = signUpSchema.parse(body)

    const auth = getAdminAuth()
    const firestore = getAdminFirestore()

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    })

    // Create user profile in Firestore
    const profileData: Profile = {
      id: userRecord.uid,
      email: userRecord.email!,
      fullName: fullName || null,
      avatarUrl: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await firestore.collection(COLLECTIONS.PROFILES).doc(userRecord.uid).set(profileData)

    // Grant default access to hub
    const accessData: UserAppAccess = {
      userId: userRecord.uid,
      appName: 'hub',
      role: 'user',
      isActive: true,
      grantedAt: Timestamp.now(),
      grantedBy: null,
    }

    await firestore.collection(COLLECTIONS.USER_APP_ACCESS).add(accessData)

    logger.info('User signup successful', {
      userId: userRecord.uid,
      email,
    })

    return createSuccessResponse(
      {
        message: 'User created successfully',
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          fullName,
        },
      },
      201
    )
  })
)
