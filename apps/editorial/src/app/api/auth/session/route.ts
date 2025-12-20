import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'

/**
 * POST /api/auth/session
 * Creates a server-side session cookie from a Firebase ID token
 */
export async function POST(request: NextRequest) {
  console.log('=== SESSION CREATION DEBUG ===')
  try {
    const body = await request.json()
    console.log('Request body received:', {
      hasIdToken: !!body.idToken,
      tokenLength: body.idToken?.length,
    })

    const { idToken } = body

    if (!idToken) {
      console.error('❌ No ID token provided in request')
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    console.log('🔑 Creating session cookie with @cenie/auth-server...')
    // Create session cookie using the new package
    const sessionCookie = await createSession(idToken, 'editorial')
    console.log('Session cookie created:', { length: sessionCookie.length })

    // Set the cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    console.log('✅ Session cookie created successfully!')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Session creation error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack',
    })
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
    console.error('Session deletion error:', error)
    return NextResponse.json(
      {
        error: 'Failed to clear session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
