import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  parseRequestBody,
} from '../../../../lib/api-utils'

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)
    const { email } = resetPasswordSchema.parse(body)

    const auth = getAdminAuth()

    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email, {
      url: process.env.PASSWORD_RESET_URL || 'https://cenie.org/reset-password',
    })

    // In production, you would send this link via email
    // For now, we'll return it in the response (remove in production)
    return createSuccessResponse({
      message: 'Password reset email sent',
      // Remove this in production - only for development
      resetLink: process.env.NODE_ENV === 'development' ? link : undefined,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    if (error.code === 'auth/user-not-found') {
      // Don't reveal that the user doesn't exist for security
      return createSuccessResponse({ message: 'Password reset email sent' })
    }

    return handleApiError(error)
  }
}
