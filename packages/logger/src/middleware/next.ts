import type { NextRequest } from 'next/server'

import { logContext, ContextKeys } from '../context/async-context'

/**
 * Extract client IP from Next.js request
 */
function getClientIP(request: NextRequest): string | undefined {
  // Try various headers in order of reliability
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  return forwardedFor?.split(',')[0].trim() || realIp || cfConnectingIp || undefined
}

/**
 * Extract request context for logging
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRequestContext(request: NextRequest): Record<string, any> {
  return {
    [ContextKeys.REQUEST_ID]: crypto.randomUUID(),
    [ContextKeys.PATH]: request.nextUrl.pathname,
    [ContextKeys.METHOD]: request.method,
    [ContextKeys.USER_AGENT]: request.headers.get('user-agent') || undefined,
    [ContextKeys.IP_ADDRESS]: getClientIP(request),
  }
}

/**
 * Wrapper for Next.js API route handlers with logging context
 *
 * @example
 * ```typescript
 * import { withLogging } from '@cenie/logger/next'
 *
 * export const POST = withLogging(async (request) => {
 *   // logger calls here will include request context
 *   logger.info('Processing request')
 *   return NextResponse.json({ success: true })
 * })
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withLogging<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    const context = extractRequestContext(request)

    return logContext.run(context, () => handler(request, ...args))
  }
}

/**
 * Add user context to the current request
 * Call this after authentication to include user info in logs
 *
 * @example
 * ```typescript
 * const user = await authenticate(request)
 * setUserContext(user.id, user.email)
 * ```
 */
export function setUserContext(userId: string, sessionId?: string): void {
  logContext.set(ContextKeys.USER_ID, userId)
  if (sessionId) {
    logContext.set(ContextKeys.SESSION_ID, sessionId)
  }
}

/**
 * Add custom context to current request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addContext(key: string, value: any): void {
  logContext.set(key, value)
}
