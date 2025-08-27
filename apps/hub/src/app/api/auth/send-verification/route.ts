import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  parseRequestBody,
} from '../../../../lib/api-utils'

const verificationSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)
    const { email } = verificationSchema.parse(body)

    const auth = getAdminAuth()

    // Generate email verification link
    const link = await auth.generateEmailVerificationLink(email, {
      url: process.env.EMAIL_VERIFICATION_URL || 'https://cenie.org/verify-email',
    })

    // In production, you would send this link via email
    return createSuccessResponse({
      message: 'Verification email sent',
      // Remove this in production - only for development
      verificationLink: process.env.NODE_ENV === 'development' ? link : undefined,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    if (error.code === 'auth/user-not-found') {
      // Don't reveal that the user doesn't exist for security
      return createSuccessResponse({ message: 'Verification email sent' })
    }

    return handleApiError(error)
  }
}
