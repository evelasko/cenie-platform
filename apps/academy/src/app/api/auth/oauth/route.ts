import { grantAccess } from '@cenie/auth-utils/access-control'
import { verifyIdToken } from '@cenie/auth-server/helpers'
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { Timestamp } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

const logger = createLogger({ name: 'academy:api:oauth' })

interface OAuthRequestBody {
  appName: 'academy'
  role?: string
  isNewUser: boolean
}

/**
 * POST /api/auth/oauth
 * Process OAuth signup/signin - creates profile and grants Academy access
 */
export async function POST(request: NextRequest) {
  try {
    // Get and verify ID token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('OAuth processing failed - no authorization header')
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')
    const decoded = await verifyIdToken(idToken)
    const userId = decoded.uid

    const body: OAuthRequestBody = await request.json()
    const { isNewUser, role = 'student' } = body

    logger.debug('Processing OAuth', { userId, isNewUser, role })

    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()
    const auth = adminApp.auth()

    // Get user record from Firebase Auth
    const userRecord = await auth.getUser(userId)

    // Check if profile exists
    const profileRef = firestore.collection('profiles').doc(userId)
    const profileDoc = await profileRef.get()

    if (!profileDoc.exists || isNewUser) {
      // Create or update profile
      const profileData = {
        id: userId,
        email: userRecord.email || decoded.email,
        fullName: userRecord.displayName || null,
        avatarUrl: userRecord.photoURL || null,
        createdAt: profileDoc.exists ? profileDoc.data()!.createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await profileRef.set(profileData, { merge: true })
      logger.info('Profile created/updated', { userId, isNewUser })
    } else {
      // Update last login info for existing users
      await profileRef.update({
        updatedAt: Timestamp.now(),
        // Update avatar if OAuth provider has newer one
        ...(userRecord.photoURL && { avatarUrl: userRecord.photoURL }),
      })
      logger.debug('Profile updated with last login', { userId })
    }

    // Check if user already has Academy access
    const existingAccess = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', 'academy')
      .limit(1)
      .get()

    if (existingAccess.empty) {
      // Grant Academy access with specified role
      await grantAccess({
        userId,
        appName: 'academy',
        role: role || 'student', // Default to student
        grantedBy: null, // Self-signup
      })

      logger.info('Academy access granted', { userId, role })
    } else {
      logger.debug('User already has Academy access', { userId })
    }

    return NextResponse.json({
      success: true,
      message: 'OAuth processing complete',
      userId,
    })
  } catch (error: unknown) {
    logger.error('OAuth processing failed', { error })
    return NextResponse.json(
      {
        error: 'OAuth processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

