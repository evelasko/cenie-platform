import type { NextRequest, NextResponse } from 'next/server'

import type { AuthenticatedUser } from '../types'

/**
 * Handler function that receives authenticated user
 */
export type AuthenticatedHandler<TParams = unknown> = (
  request: NextRequest,
  context: {
    user: AuthenticatedUser
    params?: TParams
  }
) => Promise<NextResponse> | NextResponse

/**
 * Standard Next.js API route handler
 */
export type NextRouteHandler<TParams = unknown> = (
  request: NextRequest,
  context?: { params?: TParams }
) => Promise<NextResponse>

