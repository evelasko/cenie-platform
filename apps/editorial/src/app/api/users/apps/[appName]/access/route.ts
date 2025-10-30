import { NextRequest, NextResponse } from 'next/server'
import { initializeAdminApp } from '@cenie/firebase/server'

/**
 * GET /api/users/apps/[appName]/access
 * Check if the authenticated user has access to a specific app
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appName: string }> }
) {
  console.log('=== CHECK APP ACCESS DEBUG ===')
  try {
    // Get ID token from Authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Auth header:', {
      exists: !!authHeader,
      value: authHeader?.substring(0, 20) + '...',
    })

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid authorization header')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')
    console.log('ID token extracted, length:', idToken.length)

    // Verify the ID token with Firebase Admin
    console.log('🔑 Verifying ID token with Firebase Admin...')
    const adminApp = initializeAdminApp()
    const auth = adminApp.auth()

    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(idToken)
      console.log('✅ Token verified, user ID:', decodedToken.uid)
    } catch (error) {
      console.error('❌ Token verification failed:', error)
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const userId = decodedToken.uid
    const { appName } = await params
    console.log('Checking access for:', { userId, appName })

    // Check Firestore for user app access
    const firestore = adminApp.firestore()
    console.log('📚 Querying Firestore for user_app_access...')

    const accessSnapshot = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    console.log('Query result:', {
      empty: accessSnapshot.empty,
      size: accessSnapshot.size,
    })

    if (accessSnapshot.empty) {
      console.log('❌ No access found for user')
      return NextResponse.json({
        success: true,
        data: [], // Return empty array to indicate no access
      })
    }

    const accessDoc = accessSnapshot.docs[0]
    const accessData = accessDoc.data()
    console.log('✅ Access found:', {
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
    console.error('❌ Error checking app access:', error)
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
