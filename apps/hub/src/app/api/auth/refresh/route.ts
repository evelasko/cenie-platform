import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'

const refreshSchema = z.object({
  refreshToken: z.string(),
  userId: z.string(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { userId } = refreshSchema.parse(body)

    const auth = getAdminAuth()

    // Create a new custom token
    const customToken = await auth.createCustomToken(userId)

    // Get user data
    const userRecord = await auth.getUser(userId)

    logger.info('Token refreshed', { userId })

    return createSuccessResponse({
      customToken,
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName,
      },
    })
  })
)
