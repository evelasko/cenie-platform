import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminAuth, getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, Profile, UserAppAccess } from '../../../../lib/types'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  parseRequestBody,
} from '../../../../lib/api-utils'
import { Timestamp } from 'firebase-admin/firestore'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    if (error.code === 'auth/email-already-exists') {
      return createErrorResponse('Email already exists', 400)
    }

    return handleApiError(error)
  }
}
