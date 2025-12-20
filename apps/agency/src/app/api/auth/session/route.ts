import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@cenie/auth-server/session'
import { createLogger } from '@cenie/logger'
import { cookies } from 'next/headers'

const logger = createLogger({ name: 'agency:session' })

/**
 * POST /api/auth/session
 * Creates a server-side session cookie from a Firebase ID token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    logger.debug('Session creation request received', {
      hasIdToken: !!body.idToken,
      tokenLength: body.idToken?.length,
    })

    const { idToken } = body

    if (!idToken) {
      logger.error('No ID token provided in request')
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    logger.debug('Creating session cookie for Agency')
    // Create session cookie using the auth-server package
    const sessionCookie = await createSession(idToken, 'agency')

    // Set the cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    logger.info('Session cookie created successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Session creation error', { error })
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
    
    logger.info('Session cleared successfully')
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

