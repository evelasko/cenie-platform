import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  parseRequestBody,
} from '../../../../lib/api-utils'

const updatePasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)
    const { userId, newPassword } = updatePasswordSchema.parse(body)

    const auth = getAdminAuth()

    // Update password
    await auth.updateUser(userId, {
      password: newPassword,
    })

    return createSuccessResponse({ message: 'Password updated successfully' })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    if (error.code === 'auth/user-not-found') {
      return createErrorResponse('User not found', 404)
    }

    if (error.code === 'auth/weak-password') {
      return createErrorResponse('Password is too weak', 400)
    }

    return handleApiError(error)
  }
}
