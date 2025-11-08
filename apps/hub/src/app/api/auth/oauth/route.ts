import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { NotFoundError } from '@cenie/errors'
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'
import { COLLECTIONS, Profile, UserAppAccess } from '@/lib/types'
import { createSuccessResponse, parseRequestBody } from '@/lib/api-utils'
import { authenticateRequest } from '@/lib/auth-middleware'
import { logger } from '@/lib/logger'
import { Timestamp } from 'firebase-admin/firestore'

const oauthSignInSchema = z.object({
  provider: z.enum(['google', 'apple']),
  isNewUser: z.boolean().optional(),
  userData: z.object({
    email: z.string().email(),
    fullName: z.string().nullable().optional(),
    photoURL: z.string().nullable().optional(),
    providerId: z.string(),
    additionalUserInfo: z
      .object({
        profile: z.record(z.string(), z.any()).optional(),
        providerId: z.string(),
        username: z.string().optional(),
      })
      .optional(),
  }),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    // Authenticate the request using Firebase ID token
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const body = await parseRequestBody(request)
    const { provider, isNewUser, userData } = oauthSignInSchema.parse(body)

    const auth = getAdminAuth()
    const firestore = getAdminFirestore()

    // Get the user record from Firebase Auth
    const userRecord = await auth.getUser(userId)

    let profile: Profile | null = null
    let isUserCreated = false

    // Check if user profile already exists
    const profileRef = firestore.collection(COLLECTIONS.PROFILES).doc(userId)
    const profileDoc = await profileRef.get()

    if (!profileDoc.exists || isNewUser) {
      // Create or update user profile
      const profileData: Profile = {
        id: userId,
        email: userData.email,
        fullName: userData.fullName || userRecord.displayName || null,
        avatarUrl: userData.photoURL || userRecord.photoURL || null,
        createdAt: profileDoc.exists ? profileDoc.data()!.createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await profileRef.set(profileData, { merge: true })
      profile = profileData

      if (!profileDoc.exists) {
        isUserCreated = true

        // Grant default access to hub for new users
        const accessData: UserAppAccess = {
          userId,
          appName: 'hub',
          role: 'user',
          isActive: true,
          grantedAt: Timestamp.now(),
          grantedBy: null,
        }

        await firestore.collection(COLLECTIONS.USER_APP_ACCESS).add(accessData)
      }
    } else {
      profile = profileDoc.data() as Profile

      // Update last login info
      await profileRef.update({
        updatedAt: Timestamp.now(),
        // Update avatar if provider has newer one
        ...(userData.photoURL && { avatarUrl: userData.photoURL }),
      })
    }

    // Get user's app access permissions
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get()

    const appAccess = accessSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (UserAppAccess & { id: string })[]

    logger.info('OAuth sign-in successful', {
      userId,
      provider,
      isNewUser: isUserCreated,
    })

    return createSuccessResponse(
      {
        message: isUserCreated ? 'User created successfully' : 'User signed in successfully',
        isNewUser: isUserCreated,
        user: {
          id: userId,
          email: profile.email,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          provider,
          emailVerified: userRecord.emailVerified,
        },
        appAccess,
      },
      isUserCreated ? 201 : 200
    )
  })
)

// GET route to handle OAuth redirect results
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    // This endpoint can be used by clients to verify OAuth redirect results
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const firestore = getAdminFirestore()

    // Get user profile and access permissions
    const [profileDoc, accessSnapshot] = await Promise.all([
      firestore.collection(COLLECTIONS.PROFILES).doc(userId).get(),
      firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .get(),
    ])

    if (!profileDoc.exists) {
      throw new NotFoundError('User profile not found', {
        metadata: { userId },
      })
    }

    const profile = profileDoc.data() as Profile
    const appAccess = accessSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (UserAppAccess & { id: string })[]

    return createSuccessResponse({
      user: {
        id: userId,
        email: profile.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
      },
      appAccess,
    })
  })
)
