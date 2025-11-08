import { NextRequest } from 'next/server'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { NotFoundError, AuthenticationError } from '@cenie/errors'
import { getAdminAuth, getAdminFirestore } from '../../../../../lib/firebase-admin'
import { COLLECTIONS, Profile } from '../../../../../lib/types'
import { createSuccessResponse } from '../../../../../lib/api-utils'

export const GET = withErrorHandling(
  withLogging(async (
    _request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
  ) => {
    const { token } = await params
    const auth = getAdminAuth()
    const firestore = getAdminFirestore()

    try {
      // Verify the ID token
      const decodedToken = await auth.verifyIdToken(token)

      // Get user profile from Firestore
      const profileDoc = await firestore
        .collection(COLLECTIONS.PROFILES)
        .doc(decodedToken.uid)
        .get()

      if (!profileDoc.exists) {
        throw new NotFoundError('User profile not found', {
          metadata: { userId: decodedToken.uid },
        })
      }

      const profile = profileDoc.data() as Profile

      return createSuccessResponse({
        user: {
          id: decodedToken.uid,
          email: decodedToken.email,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          emailVerified: decodedToken.email_verified,
        },
      })
    } catch (error: any) {
      if (error.code === 'auth/id-token-expired') {
        throw new AuthenticationError('Token expired', {
          metadata: { tokenType: 'id-token' },
        })
      }

      if (error.code === 'auth/invalid-id-token') {
        throw new AuthenticationError('Invalid token', {
          metadata: { tokenType: 'id-token' },
        })
      }

      throw error
    }
  })
)
