import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { NotFoundError, ValidationError } from '@cenie/errors'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'

const updatePasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(6),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { userId, newPassword } = updatePasswordSchema.parse(body)

    const auth = getAdminAuth()

    try {
      // Update password
      await auth.updateUser(userId, {
        password: newPassword,
      })

      logger.info('Password updated', { userId })

      return createSuccessResponse({ message: 'Password updated successfully' })
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError('User not found', {
          metadata: { userId },
        })
      }

      if (error.code === 'auth/weak-password') {
        throw new ValidationError('Password is too weak', {
          metadata: { userId },
        })
      }

      throw error
    }
  })
)
