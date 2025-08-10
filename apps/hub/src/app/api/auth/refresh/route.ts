import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '../../../../lib/firebase-admin'
import { createErrorResponse, createSuccessResponse, handleApiError, parseRequestBody } from '../../../../lib/api-utils'

const refreshSchema = z.object({
  refreshToken: z.string(),
  userId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request)
    const { userId } = refreshSchema.parse(body)

    const auth = getAdminAuth()

    // Create a new custom token
    const customToken = await auth.createCustomToken(userId)

    // Get user data
    const userRecord = await auth.getUser(userId)

    return createSuccessResponse({
      customToken,
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }
    return handleApiError(error)
  }
}