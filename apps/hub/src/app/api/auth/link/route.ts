import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { ValidationError } from '@cenie/errors'
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'
import { COLLECTIONS } from '@/lib/types'
import { createSuccessResponse, parseRequestBody } from '@/lib/api-utils'
import { authenticateRequest } from '@/lib/auth-middleware'
import { logger } from '@/lib/logger'
import { Timestamp } from 'firebase-admin/firestore'

const linkAccountSchema = z.object({
  provider: z.enum(['google', 'apple']),
  email: z.string().email(),
  existingProviders: z.array(z.string()),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    // Authenticate the request using Firebase ID token
    const authResult = await authenticateRequest(request)
    const { userId } = authResult

    const body = await parseRequestBody(request)
    const { provider, email } = linkAccountSchema.parse(body)

    const auth = getAdminAuth()
    const firestore = getAdminFirestore()

    // Get the user record from Firebase Auth
    const userRecord = await auth.getUser(userId)

    // Verify that the email matches
    if (userRecord.email !== email) {
      throw new ValidationError('Email mismatch', {
        metadata: { userId, providedEmail: email, userEmail: userRecord.email },
      })
    }

    // Update the user profile with the latest information from the OAuth provider
    const profileRef = firestore.collection(COLLECTIONS.PROFILES).doc(userId)
    const profileDoc = await profileRef.get()

    if (profileDoc.exists) {
      await profileRef.update({
        updatedAt: Timestamp.now(),
        // Update avatar if provider has one and user doesn't have one already
        ...(userRecord.photoURL &&
          !profileDoc.data()!.avatarUrl && {
            avatarUrl: userRecord.photoURL,
          }),
        // Update display name if provider has one and user doesn't have one already
        ...(userRecord.displayName &&
          !profileDoc.data()!.fullName && {
            fullName: userRecord.displayName,
          }),
      })
    }

    logger.info('Account linked successfully', {
      userId,
      provider,
      email,
    })

    return createSuccessResponse({
      message: `${provider} account linked successfully`,
      user: {
        id: userId,
        email: userRecord.email,
        fullName: userRecord.displayName,
        avatarUrl: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
      },
    })
  })
)

// GET endpoint to check existing sign-in methods for an email
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    if (!email) {
      throw new ValidationError('Email parameter is required', {
        metadata: { hasEmailParam: false },
      })
    }

    const auth = getAdminAuth()

    try {
      // Get user by email to check existing providers
      const userRecord = await auth.getUserByEmail(email)

      // Extract provider information from user record
      const providers = userRecord.providerData.map((provider) => provider.providerId)

      return createSuccessResponse({
        email,
        exists: true,
        providers,
        emailVerified: userRecord.emailVerified,
      })
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return createSuccessResponse({
          email,
          exists: false,
          providers: [],
          emailVerified: false,
        })
      }
      throw error
    }
  })
)
