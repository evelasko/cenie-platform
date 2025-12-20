import { AuthenticationError } from '@cenie/errors'
import { createLogger } from '@cenie/logger'
import { createSession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const logger = createLogger({ name: 'academy:api:session' })

/**
 * POST /api/auth/session
 * Creates a server-side session cookie from a Firebase ID token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      logger.warn('Session creation failed - no ID token provided')
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    logger.debug('Creating Academy session')

    // Create session cookie using shared package
    const sessionCookie = await createSession(idToken, 'academy')

    // Set the cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    logger.info('Academy session created successfully')

    return NextResponse.json({
      success: true,
      message: 'Session created',
    })
  } catch (error: unknown) {
    logger.error('Failed to create session', { error })

    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
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

    logger.info('Academy session cleared')

    return NextResponse.json({
      success: true,
      message: 'Session cleared',
    })
  } catch (error: unknown) {
    logger.error('Failed to clear session', { error })
    return NextResponse.json(
      {
        error: 'Failed to clear session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

