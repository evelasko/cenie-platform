import { NextRequest } from 'next/server'
import { getAdminFirestore } from '../../../../../lib/firebase-admin'
import { COLLECTIONS, UserAppAccess, Profile } from '../../../../../lib/types'
import { authenticateRequest, requireAdmin } from '../../../../../lib/auth-middleware'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  serializeAccess,
} from '../../../../../lib/api-utils'

// List all users with app access (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appName: string }> }
) {
  try {
    const authResult = await authenticateRequest(request)

    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult

    // Check admin privileges
    const adminCheck = await requireAdmin(userId)
    if (!adminCheck.success) {
      return createErrorResponse(adminCheck.error!, adminCheck.status!)
    }

    const { appName } = await params
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const offset = (page - 1) * limit
    const firestore = getAdminFirestore()

    // Get access records with pagination
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('appName', '==', appName)
      .orderBy('grantedAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get()

    // Get user profiles for each access record
    const users = await Promise.all(
      accessSnapshot.docs.map(async (doc) => {
        const accessData = doc.data() as UserAppAccess
        const profileDoc = await firestore
          .collection(COLLECTIONS.PROFILES)
          .doc(accessData.userId)
          .get()

        const profile = profileDoc.exists ? (profileDoc.data() as Profile) : null

        return {
          ...serializeAccess({ ...accessData, id: doc.id }),
          profile: profile
            ? {
                id: profile.id,
                email: profile.email,
                fullName: profile.fullName,
                avatarUrl: profile.avatarUrl,
              }
            : null,
        }
      })
    )

    return createSuccessResponse({ users, page, limit })
  } catch (error) {
    return handleApiError(error)
  }
}
