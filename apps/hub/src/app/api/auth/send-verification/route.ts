import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'
import { hubEmailSender } from '../../../../email/sender'
import { HubVerificationEmail } from '../../../../email/templates/verification'

const verificationSchema = z.object({
  email: z.string().email(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { email } = verificationSchema.parse(body)

    const auth = getAdminAuth()

    try {
      // Get user to get display name
      const user = await auth.getUserByEmail(email)

      // Generate email verification link
      const verificationUrl = await auth.generateEmailVerificationLink(email, {
        url: process.env.EMAIL_VERIFICATION_URL || 'https://hub.cenie.org/auth/verify',
      })

      logger.info('Verification email link generated', { email })

      // Send branded verification email
      await hubEmailSender.send({
        to: email,
        template: HubVerificationEmail,
        data: {
          userName: user.displayName || 'there',
          verificationUrl,
        },
      })

      logger.info('Verification email sent', { email })

      return createSuccessResponse({
        message: 'Verification email sent',
        // Include link in development for testing
        verificationLink: process.env.NODE_ENV === 'development' ? verificationUrl : undefined,
      })
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Don't reveal that the user doesn't exist for security
        logger.debug('Verification email requested for non-existent user', { email })
        return createSuccessResponse({ message: 'Verification email sent' })
      }
      throw error
    }
  })
)
