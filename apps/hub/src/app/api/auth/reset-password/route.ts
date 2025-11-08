import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { email } = resetPasswordSchema.parse(body)

    const auth = getAdminAuth()

    try {
      // Generate password reset link
      const link = await auth.generatePasswordResetLink(email, {
        url: process.env.PASSWORD_RESET_URL || 'https://cenie.org/reset-password',
      })

      logger.info('Password reset link generated', { email })

      // In production, you would send this link via email
      // For now, we'll return it in the response (remove in production)
      return createSuccessResponse({
        message: 'Password reset email sent',
        // Remove this in production - only for development
        resetLink: process.env.NODE_ENV === 'development' ? link : undefined,
      })
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Don't reveal that the user doesn't exist for security
        logger.debug('Password reset requested for non-existent user', { email })
        return createSuccessResponse({ message: 'Password reset email sent' })
      }
      throw error
    }
  })
)
