import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Profile, UserAppAccess, Subscription, SerializedProfile, SerializedUserAppAccess, SerializedSubscription } from './types'

export function createErrorResponse(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status })
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function handleApiError(error: any) {
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
    return await request.json()
  } catch (error) {
    throw new Error('Invalid JSON body')
  }
}