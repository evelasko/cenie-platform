import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'
import { hubEmailSender } from '../../../../email/sender'
import { HubPasswordResetEmail } from '../../../../email/templates/password-reset'

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { email } = resetPasswordSchema.parse(body)

    const auth = getAdminAuth()

    try {
      // Get user to get display name
      const user = await auth.getUserByEmail(email)

      // Generate password reset link
      const resetUrl = await auth.generatePasswordResetLink(email, {
        url: process.env.PASSWORD_RESET_URL || 'https://hub.cenie.org/auth/reset-password',
      })

      logger.info('Password reset link generated', { email })

      // Send branded password reset email
      await hubEmailSender.send({
        to: email,
        template: HubPasswordResetEmail,
        data: {
          userName: user.displayName || 'there',
          resetUrl,
          expiresIn: '1 hour',
        },
      })

      logger.info('Password reset email sent', { email })

      return createSuccessResponse({
        message: 'Password reset email sent',
        // Include link in development for testing
        resetLink: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
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
