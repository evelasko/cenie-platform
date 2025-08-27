import { NextRequest } from 'next/server'
import { getAdminAuth, getAdminFirestore } from '../../../../../lib/firebase-admin'
import { COLLECTIONS, Profile } from '../../../../../lib/types'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from '../../../../../lib/api-utils'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const auth = getAdminAuth()
    const firestore = getAdminFirestore()

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(token)

    // Get user profile from Firestore
    const profileDoc = await firestore.collection(COLLECTIONS.PROFILES).doc(decodedToken.uid).get()

    if (!profileDoc.exists) {
      return createErrorResponse('User profile not found', 404)
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
      return createErrorResponse('Token expired', 401)
    }

    if (error.code === 'auth/invalid-id-token') {
      return createErrorResponse('Invalid token', 401)
    }

    return handleApiError(error)
  }
}
