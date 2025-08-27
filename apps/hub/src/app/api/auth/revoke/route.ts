import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  parseRequestBody,
} from '../../../../lib/api-utils'

const revokeSchema = z.object({
  userId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)
    const { userId } = revokeSchema.parse(body)

    const auth = getAdminAuth()

    // Revoke all refresh tokens for the user
    await auth.revokeRefreshTokens(userId)

    return createSuccessResponse({ message: 'Session revoked successfully' })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    if (error.code === 'auth/user-not-found') {
      return createErrorResponse('User not found', 404)
    }

    return handleApiError(error)
  }
}
