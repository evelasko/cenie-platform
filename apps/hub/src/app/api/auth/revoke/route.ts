import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth } from '@/lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '@/lib/api-utils'
import { logger } from '@/lib/logger'

const revokeSchema = z.object({
  userId: z.string(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { userId } = revokeSchema.parse(body)

    const auth = getAdminAuth()

    // Revoke all refresh tokens for the user
    await auth.revokeRefreshTokens(userId)

    logger.info('Session revoked', { userId })

    return createSuccessResponse({ message: 'Session revoked successfully' })
  })
)
