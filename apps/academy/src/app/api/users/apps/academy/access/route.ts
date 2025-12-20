import { AuthenticationError } from '@cenie/errors'
import { checkAppAccess, verifyIdToken } from '@cenie/auth-server/helpers'
import { createLogger } from '@cenie/logger'
import { NextRequest, NextResponse } from 'next/server'

const logger = createLogger({ name: 'academy:api:access-check' })

/**
 * GET /api/users/apps/academy/access
 * Check if the authenticated user has access to Academy
 */
export async function GET(request: NextRequest) {
  try {
    // Get ID token from Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Access check failed - no authorization header')
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')

    // Verify ID token
    logger.debug('Verifying ID token for access check')
    const decoded = await verifyIdToken(idToken)
    const userId = decoded.uid

    logger.debug('Checking Academy access', { userId })

    // Check Academy access using shared helper
    const access = await checkAppAccess(userId, 'academy')

    if (!access.hasAccess) {
      logger.info('User has no Academy access', { userId })
      return NextResponse.json(
        {
          hasAccess: false,
          error: 'No access to Academy',
        },
        { status: 403 }
      )
    }

    logger.info('Academy access confirmed', { userId, role: access.role })

    return NextResponse.json({
      hasAccess: true,
      role: access.role,
      isActive: access.isActive,
    })
  } catch (error: unknown) {
    logger.error('Access check failed', { error })

    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        error: 'Access check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

