import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createSuccessResponse, parseRequestBody } from '../../../../lib/api-utils'
import { logger } from '../../../../lib/logger'

const verificationSchema = z.object({
  email: z.string().email(),
})

export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    const body = await parseRequestBody(request)
    const { email } = verificationSchema.parse(body)

    const auth = getAdminAuth()

    try {
      // Generate email verification link
      const link = await auth.generateEmailVerificationLink(email, {
        url: process.env.EMAIL_VERIFICATION_URL || 'https://cenie.org/verify-email',
      })

      logger.info('Verification email link generated', { email })

      // In production, you would send this link via email
      return createSuccessResponse({
        message: 'Verification email sent',
        // Remove this in production - only for development
        verificationLink: process.env.NODE_ENV === 'development' ? link : undefined,
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
