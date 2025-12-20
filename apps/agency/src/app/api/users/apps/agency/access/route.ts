import { NextRequest, NextResponse } from 'next/server'
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'

const logger = createLogger({ name: 'agency:access' })

/**
 * GET /api/users/apps/agency/access
 * Check if the authenticated user has access to Agency
 */
export async function GET(request: NextRequest) {
  try {
    // Get ID token from Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No valid authorization header')
      return NextResponse.json({ hasAccess: false, error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')

    // Verify the ID token with Firebase Admin
    logger.debug('Verifying ID token with Firebase Admin')
    const adminApp = initializeAdminApp()
    const auth = adminApp.auth()

    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(idToken)
      logger.debug('Token verified', { userId: decodedToken.uid })
    } catch (error) {
      logger.error('Token verification failed', { error })
      return NextResponse.json({ hasAccess: false, error: 'Invalid token' }, { status: 401 })
    }

    const userId = decodedToken.uid

    // Check Firestore for user app access
    const firestore = adminApp.firestore()
    logger.debug('Querying Firestore for user_app_access', { userId, appName: 'agency' })

    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', 'agency')
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      logger.info('No access found for user - auto-granting client role', { userId })
      
      // Auto-grant client access for new users
      const accessData = {
        userId,
        appName: 'agency',
        role: 'client',
        isActive: true,
        grantedAt: new Date(),
        grantedBy: null, // Auto-granted
      }

      const accessRef = await firestore.collection('user_app_access').add(accessData)
      
      logger.info('Client access granted', { userId, accessId: accessRef.id })

      return NextResponse.json({
        hasAccess: true,
        role: 'client',
        userId,
        appName: 'agency',
      })
    }

    const accessDoc = accessSnapshot.docs[0]
    const accessData = accessDoc.data()
    
    logger.info('Access found', {
      userId,
      role: accessData.role,
      isActive: accessData.isActive,
    })

    return NextResponse.json({
      hasAccess: true,
      role: accessData.role || 'client',
      userId,
      appName: 'agency',
    })
  } catch (error) {
    logger.error('Error checking app access', { error })
    return NextResponse.json(
      {
        hasAccess: false,
        error: 'Failed to check access',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

