import { NextResponse } from 'next/server'
import { createErrorResponse as createErrorResponseFromErrors } from '@cenie/errors/next'
import { ValidationError } from '@cenie/errors'
import {
  type Profile,
  type UserAppAccess,
  type Subscription,
  type SerializedProfile,
  type SerializedUserAppAccess,
  type SerializedSubscription,
} from './types'

/**
 * Create a success response
 */
export function createSuccessResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Create an error response from an error object
 * Uses the centralized error handling from @cenie/errors
 */
export function createErrorResponse(error: unknown): NextResponse {
  return createErrorResponseFromErrors(error)
}

/**
 * Legacy helper for creating error responses with string messages
 * @deprecated Use typed errors from @cenie/errors instead
 */
export function createErrorResponseLegacy(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status })
}

/**
 * Legacy error handler
 * @deprecated Use withErrorHandling wrapper from @cenie/errors/next instead
 */
export function handleApiError(error: unknown) {
  return createErrorResponse(error)
}

// Helper functions to serialize Firestore timestamps
export function serializeProfile(profile: Profile): SerializedProfile {
  return {
    ...profile,
    createdAt: profile.createdAt.toDate().toISOString(),
    updatedAt: profile.updatedAt.toDate().toISOString(),
  }
}

export function serializeAccess(access: UserAppAccess): SerializedUserAppAccess {
  return {
    ...access,
    grantedAt: access.grantedAt.toDate().toISOString(),
  }
}

export function serializeSubscription(subscription: Subscription): SerializedSubscription {
  return {
    ...subscription,
    createdAt: subscription.createdAt.toDate().toISOString(),
    updatedAt: subscription.updatedAt.toDate().toISOString(),
    currentPeriodStart: subscription.currentPeriodStart?.toDate().toISOString(),
    currentPeriodEnd: subscription.currentPeriodEnd?.toDate().toISOString(),
  }
}

export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch (error) {
    throw new ValidationError('Invalid JSON body', {
      cause: error,
      metadata: { body: 'Failed to parse request body' },
    })
  }
}
