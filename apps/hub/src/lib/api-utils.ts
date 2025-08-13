import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { type Profile, type UserAppAccess, type Subscription, type SerializedProfile, type SerializedUserAppAccess, type SerializedSubscription } from './types'

export function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status })
}

export function createSuccessResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ZodError) {
    return createErrorResponse('Validation error', 400)
  }
  
  return createErrorResponse('Internal server error', 500)
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
  } catch {
    throw new Error('Invalid JSON body')
  }
}