import { type NextRequest } from 'next/server'
import { getAdminAuth, getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS } from '../../../../lib/types'
import { authenticateRequest } from '../../../../lib/auth-middleware'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from '../../../../lib/api-utils'

// Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)

    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult
    const firestore = getAdminFirestore()
    const auth = getAdminAuth()

    // Start a batch operation
    const batch = firestore.batch()

    // Delete user subscriptions
    const subscriptionsSnapshot = await firestore
      .collection(COLLECTIONS.SUBSCRIPTIONS)
      .where('userId', '==', userId)
      .get()

    subscriptionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete user app access
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .get()

    accessSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete user profile
    const profileRef = firestore.collection(COLLECTIONS.PROFILES).doc(userId)
    batch.delete(profileRef)

    // Commit the batch
    await batch.commit()

    // Delete auth user
    await auth.deleteUser(userId)

    return createSuccessResponse({ message: 'Account deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
