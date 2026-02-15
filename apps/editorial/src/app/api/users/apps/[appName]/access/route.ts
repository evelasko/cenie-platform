import { NextRequest, NextResponse } from 'next/server'
import { initializeAdminApp } from '@cenie/firebase/server'
import { logger } from '@/lib/logger'

/**
 * GET /api/users/apps/[appName]/access
 * Check if the authenticated user has access to a specific app
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appName: string }> }
) {
  const log = logger.child({ route: 'check-app-access' })

  try {
    // Get ID token from Authorization header
    const authHeader = request.headers.get('authorization')
    log.debug('Request received', {
      hasAuthHeader: !!authHeader,
    })

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      log.error('No valid authorization header')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')
    log.debug('ID token extracted', { tokenLength: idToken.length })

    // Verify the ID token with Firebase Admin
    log.debug('Verifying ID token with Firebase Admin')
    const adminApp = initializeAdminApp()
    const auth = adminApp.auth()

    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(idToken)
      log.debug('Token verified', { userId: decodedToken.uid })
    } catch (error) {
      log.error('Token verification failed', { error })
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const userId = decodedToken.uid
    const { appName } = await params
    log.info('Checking access', { userId, appName })

    // Check Firestore for user app access
    const firestore = adminApp.firestore()
    log.debug('Querying Firestore for user_app_access')

    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    log.debug('Query result', {
      empty: accessSnapshot.empty,
      size: accessSnapshot.size,
    })

    if (accessSnapshot.empty) {
      log.info('No access found for user', { userId, appName })
      return NextResponse.json({
        success: true,
        data: [], // Return empty array to indicate no access
      })
    }

    const accessDoc = accessSnapshot.docs[0]
    const accessData = accessDoc.data()
    log.info('Access found', {
      userId,
      appName,
      role: accessData.role,
      isActive: accessData.isActive,
    })

    // Return in the format expected by hubAuth.checkAppAccess
    return NextResponse.json({
      success: true,
      data: [
        {
          id: accessDoc.id,
          userId: accessData.userId,
          appName: accessData.appName,
          role: accessData.role,
          isActive: accessData.isActive,
          grantedAt: accessData.grantedAt,
          grantedBy: accessData.grantedBy,
        },
      ],
    })
  } catch (error) {
    log.error('Error checking app access', { error })
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check access',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
