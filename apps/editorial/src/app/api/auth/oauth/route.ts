import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken, checkAppAccess } from '@cenie/auth-server/helpers'
import { createSession } from '@cenie/auth-server/session'
import { createLogger } from '@cenie/logger'
import { cookies } from 'next/headers'
import { z } from 'zod'

const logger = createLogger({ name: 'editorial:api:auth:oauth' })

const oauthSignInSchema = z.object({
  provider: z.enum(['google', 'apple']),
  isNewUser: z.boolean().optional(),
  userData: z.object({
    email: z.string().email(),
    fullName: z.string().nullable().optional(),
    photoURL: z.string().nullable().optional(),
    providerId: z.string(),
  }),
})

/**
 * POST /api/auth/oauth
 *
 * Handles OAuth sign-in for the editorial app:
 * 1. Verifies the Firebase ID token from Authorization header
 * 2. Checks the user has editorial app access
 * 3. Creates a session cookie
 * 4. Returns success with user info
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the request using Firebase ID token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const decoded = await verifyIdToken(token)
    const userId = decoded.uid

    // 2. Parse and validate request body
    const body = await request.json()
    const parseResult = oauthSignInSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const { provider, userData } = parseResult.data

    // 3. Check editorial app access
    const access = await checkAppAccess(userId, 'editorial')

    if (!access.hasAccess) {
      logger.warn('OAuth sign-in denied - no editorial access', {
        userId,
        email: userData.email,
        provider,
      })

      return NextResponse.json(
        {
          error: 'You do not have access to the Editorial app. Please contact your administrator.',
          code: 'NO_APP_ACCESS',
        },
        { status: 403 }
      )
    }

    // 4. Create session cookie
    const sessionCookie = await createSession(token, 'editorial')

    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    logger.info('OAuth sign-in successful for editorial', {
      userId,
      provider,
      email: userData.email,
      role: access.role,
    })

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: {
        id: userId,
        email: userData.email,
        fullName: userData.fullName,
        role: access.role,
      },
    })
  } catch (error) {
    logger.error('OAuth sign-in error', { error })

    // Handle specific auth errors
    if (error instanceof Error && error.message.includes('Token')) {
      return NextResponse.json(
        { error: 'Authentication failed: invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to complete OAuth sign-in',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
