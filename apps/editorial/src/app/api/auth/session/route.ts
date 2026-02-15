import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@cenie/auth-server/session'
import { verifyIdToken, checkAppAccess } from '@cenie/auth-server/helpers'
import { createLogger } from '@cenie/logger'
import { cookies } from 'next/headers'

const logger = createLogger({ name: 'editorial:api:auth:session' })

/**
 * POST /api/auth/session
 * Creates a server-side session cookie from a Firebase ID token.
 * Also verifies that the user has editorial app access.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    // Verify the token and check editorial access
    const decoded = await verifyIdToken(idToken)
    const access = await checkAppAccess(decoded.uid, 'editorial')

    if (!access.hasAccess) {
      logger.warn('Session creation denied - no editorial access', {
        userId: decoded.uid,
        email: decoded.email,
      })
      return NextResponse.json(
        {
          error: 'You do not have access to the Editorial app. Please contact your administrator.',
          code: 'NO_APP_ACCESS',
        },
        { status: 403 }
      )
    }

    // Create session cookie using the shared package
    const sessionCookie = await createSession(idToken, 'editorial')

    // Set the cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    logger.info('Session created successfully', {
      userId: decoded.uid,
      role: access.role,
    })

    return NextResponse.json({ success: true, role: access.role })
  } catch (error) {
    logger.error('Session creation error', { error })

    if (error instanceof Error && error.message.includes('Token')) {
      return NextResponse.json(
        { error: 'Authentication failed: invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/auth/session
 * Clears the server-side session cookie
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Session deletion error', { error })
    return NextResponse.json(
      {
        error: 'Failed to clear session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
