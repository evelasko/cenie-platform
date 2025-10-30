# @cenie/auth-server - Server Package Specification

**Version**: 2.0.0  
**Package Name**: `@cenie/auth-server`  
**Dependencies**: `next@14+`, `@cenie/auth-core`, `@cenie/auth-providers`

---

## Purpose

Provides server-side authentication utilities for Next.js API routes and middleware. Handles session verification, access control, rate limiting, and security features.

**Key Characteristics**:

- ✅ Next.js App Router and Pages Router support
- ✅ Composable middleware system
- ✅ Type-safe API route wrappers
- ✅ Built-in rate limiting
- ✅ CSRF protection
- ✅ Audit logging

---

## Core Middleware

### Session Verification Middleware

```typescript
import type { NextRequest, NextResponse } from 'next/server'
import type { IAuthProvider } from '@cenie/auth-providers'
import type { User, Session, TokenPayload } from '@cenie/auth-core'

/**
 * Verify session cookie middleware
 */
export async function verifySession(
  request: NextRequest,
  provider: IAuthProvider
): Promise<SessionVerificationResult> {
  const sessionCookie = request.cookies.get(COOKIE_NAMES.SESSION)

  if (!sessionCookie) {
    return {
      success: false,
      error: new AuthError('No session cookie found', AuthErrorCode.SESSION_NOT_FOUND),
    }
  }

  try {
    const payload = await provider.verifySessionCookie(sessionCookie.value)

    return {
      success: true,
      payload,
      userId: payload.sub,
      sessionCookie: sessionCookie.value,
    }
  } catch (error) {
    return {
      success: false,
      error: new SessionError('Invalid session cookie', AuthErrorCode.SESSION_INVALID, {
        originalError: error,
      }),
    }
  }
}

export interface SessionVerificationResult {
  success: boolean
  payload?: TokenPayload
  userId?: string
  sessionCookie?: string
  error?: AuthError
}
```

### Token Verification Middleware

```typescript
/**
 * Verify Bearer token middleware
 */
export async function verifyBearerToken(
  request: NextRequest,
  provider: IAuthProvider
): Promise<TokenVerificationResult> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      error: new AuthError('No Bearer token found', AuthErrorCode.UNAUTHORIZED),
    }
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const payload = await provider.verifyIdToken(token)

    return {
      success: true,
      payload,
      userId: payload.sub,
      token,
    }
  } catch (error) {
    return {
      success: false,
      error: new TokenError('Invalid token', AuthErrorCode.TOKEN_INVALID, { originalError: error }),
    }
  }
}

export interface TokenVerificationResult {
  success: boolean
  payload?: TokenPayload
  userId?: string
  token?: string
  error?: AuthError
}
```

---

## API Route Wrappers

### withAuth Wrapper

```typescript
import type { NextRequest } from 'next/server'

/**
 * Authenticated request with user data
 */
export interface AuthenticatedRequest extends NextRequest {
  /** Authenticated user ID */
  userId: string

  /** Token payload */
  payload: TokenPayload

  /** Session cookie (if using session auth) */
  sessionCookie?: string

  /** Bearer token (if using token auth) */
  bearerToken?: string
}

/**
 * API route handler type
 */
export type AuthenticatedRouteHandler<T = unknown> = (
  req: AuthenticatedRequest,
  context?: any
) => Promise<NextResponse<T>> | NextResponse<T>

/**
 * Wrap API route with authentication
 */
export function withAuth<T = unknown>(
  handler: AuthenticatedRouteHandler<T>,
  options?: WithAuthOptions
): (req: NextRequest, context?: any) => Promise<NextResponse> {
  return async (req: NextRequest, context?: any) => {
    const provider = await getProvider(options?.providerId)

    // Try session cookie first, then Bearer token
    let result = await verifySession(req, provider)

    if (!result.success && options?.fallbackToBearer) {
      result = await verifyBearerToken(req, provider)
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: options?.errorMessage ?? 'Authentication required',
          code: result.error?.code,
        },
        { status: 401 }
      )
    }

    // Attach user data to request
    const authenticatedReq = req as AuthenticatedRequest
    authenticatedReq.userId = result.userId!
    authenticatedReq.payload = result.payload!

    if ('sessionCookie' in result) {
      authenticatedReq.sessionCookie = result.sessionCookie
    }
    if ('token' in result) {
      authenticatedReq.bearerToken = result.token
    }

    // Call handler
    return handler(authenticatedReq, context)
  }
}

export interface WithAuthOptions {
  /** Provider to use for verification */
  providerId?: ProviderId

  /** Fallback to Bearer token if session fails */
  fallbackToBearer?: boolean

  /** Custom error message */
  errorMessage?: string

  /** Custom error handler */
  onError?: (error: AuthError) => NextResponse
}
```

### withRole Wrapper

```typescript
/**
 * Wrap API route with role-based access control
 */
export function withRole<T = unknown>(
  allowedRoles: string[],
  handler: AuthenticatedRouteHandler<T>,
  options?: WithRoleOptions
): AuthenticatedRouteHandler<T> {
  return async (req: AuthenticatedRequest, context?: any) => {
    const accessControl = getAccessControl(options?.accessControlId)

    const hasAccess = await accessControl.checkRole(req.userId, allowedRoles, options)

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions',
          code: AuthErrorCode.FORBIDDEN,
          required: allowedRoles,
        },
        { status: 403 }
      )
    }

    return handler(req, context)
  }
}

export interface WithRoleOptions {
  /** Access control system to use */
  accessControlId?: string

  /** App name for multi-app access control */
  appName?: string

  /** Require all roles or any role */
  requireAll?: boolean

  /** Custom error handler */
  onError?: (userId: string, required: string[]) => NextResponse
}
```

### Composable Middleware

```typescript
/**
 * Compose multiple middleware functions
 */
export function compose<T = unknown>(
  ...middlewares: Array<
    | AuthenticatedRouteHandler<T>
    | ((handler: AuthenticatedRouteHandler<T>) => AuthenticatedRouteHandler<T>)
  >
): AuthenticatedRouteHandler<T> {
  return middlewares.reduce((acc, middleware) => {
    if (typeof middleware === 'function' && middleware.length === 2) {
      // It's a wrapper (takes handler, returns handler)
      return middleware as any
    }
    // It's a handler, chain it
    return async (req, context) => {
      await (middleware as AuthenticatedRouteHandler<T>)(req, context)
      return acc(req, context)
    }
  })
}

// Usage example:
const handler = compose(
  withAuth,
  withRole(['admin', 'editor']),
  withRateLimit({ max: 100, window: '1m' }),
  async (req) => {
    // Your handler logic
    return NextResponse.json({ success: true })
  }
)
```

---

## Next.js Middleware Integration

### App Router Middleware

```typescript
/**
 * Create auth middleware for Next.js App Router
 */
export function createAuthMiddleware(config: AuthMiddlewareConfig) {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip public routes
    if (isPublicRoute(pathname, config.publicRoutes)) {
      return NextResponse.next()
    }

    const provider = await getProvider(config.providerId)
    const result = await verifySession(request, provider)

    // Handle unauthenticated requests
    if (!result.success) {
      if (config.redirectToLogin) {
        const loginUrl = new URL(config.loginPath ?? '/sign-in', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Attach user ID to headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-user-id', result.userId!)

    return response
  }
}

export interface AuthMiddlewareConfig {
  /** Provider to use */
  providerId?: ProviderId

  /** Public routes (no auth required) */
  publicRoutes?: string[]

  /** Protected routes (require auth) */
  protectedRoutes?: string[]

  /** Redirect to login page */
  redirectToLogin?: boolean

  /** Login page path */
  loginPath?: string

  /** Callback after successful auth */
  onAuthenticated?: (userId: string, request: NextRequest) => void | Promise<void>
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string, publicRoutes?: string[]): boolean {
  if (!publicRoutes) return false

  return publicRoutes.some((route) => {
    // Exact match
    if (route === pathname) return true

    // Wildcard match (e.g., /public/*)
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2)
      return pathname.startsWith(prefix)
    }

    return false
  })
}
```

### Route Segment Config

```typescript
/**
 * Generate route config for protected pages
 */
export const protectedRouteConfig = {
  runtime: 'edge', // or 'nodejs'

  // Middleware matcher
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Rate Limiting

### Rate Limiter Implementation

```typescript
/**
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private requests = new Map<string, RequestRecord[]>()

  constructor(private config: RateLimitConfig) {
    // Clean up old records periodically
    setInterval(() => this.cleanup(), config.windowMs)
  }

  /**
   * Check if request should be allowed
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Get existing records
    let records = this.requests.get(identifier) ?? []

    // Filter to current window
    records = records.filter((r) => r.timestamp > windowStart)

    // Check if over limit
    if (records.length >= this.config.max) {
      const oldestRequest = records[0]
      const resetTime = oldestRequest.timestamp + this.config.windowMs

      return {
        allowed: false,
        limit: this.config.max,
        remaining: 0,
        resetTime,
      }
    }

    // Add new record
    records.push({ timestamp: now })
    this.requests.set(identifier, records)

    return {
      allowed: true,
      limit: this.config.max,
      remaining: this.config.max - records.length,
      resetTime: now + this.config.windowMs,
    }
  }

  /**
   * Clean up old records
   */
  private cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    for (const [identifier, records] of this.requests.entries()) {
      const filteredRecords = records.filter((r) => r.timestamp > windowStart)

      if (filteredRecords.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, filteredRecords)
      }
    }
  }
}

export interface RateLimitConfig {
  /** Maximum requests */
  max: number

  /** Time window in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
}

interface RequestRecord {
  timestamp: number
}
```

### Rate Limit Middleware

```typescript
/**
 * Rate limiting middleware
 */
export function withRateLimit<T = unknown>(
  config: RateLimitConfig,
  options?: RateLimitOptions
): (handler: AuthenticatedRouteHandler<T>) => AuthenticatedRouteHandler<T> {
  const limiter = new RateLimiter(config)

  return (handler) => {
    return async (req: AuthenticatedRequest, context) => {
      // Use user ID as identifier, fallback to IP
      const identifier = req.userId ?? req.headers.get('x-forwarded-for') ?? 'anonymous'

      const result = limiter.check(identifier)

      // Add rate limit headers
      const response = result.allowed
        ? await handler(req, context)
        : NextResponse.json(
            {
              error: 'Too many requests',
              code: AuthErrorCode.TOO_MANY_REQUESTS,
              retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
            },
            { status: 429 }
          )

      response.headers.set('X-RateLimit-Limit', String(result.limit))
      response.headers.set('X-RateLimit-Remaining', String(result.remaining))
      response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)))

      if (!result.allowed) {
        response.headers.set(
          'Retry-After',
          String(Math.ceil((result.resetTime - Date.now()) / 1000))
        )
      }

      return response
    }
  }
}

export interface RateLimitOptions {
  /** Custom identifier function */
  getIdentifier?: (req: NextRequest) => string

  /** Skip rate limiting for certain users */
  skip?: (req: AuthenticatedRequest) => boolean

  /** Custom error handler */
  onLimitExceeded?: (identifier: string) => NextResponse
}
```

---

## CSRF Protection

### CSRF Token Management

```typescript
/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection<T = unknown>(
  options?: CSRFOptions
): (handler: AuthenticatedRouteHandler<T>) => AuthenticatedRouteHandler<T> {
  return (handler) => {
    return async (req: AuthenticatedRequest, context) => {
      // Skip GET, HEAD, OPTIONS
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return handler(req, context)
      }

      // Get CSRF token from cookie
      const csrfCookie = req.cookies.get(COOKIE_NAMES.CSRF)

      if (!csrfCookie) {
        return NextResponse.json({ error: 'CSRF token missing' }, { status: 403 })
      }

      // Get CSRF token from header or body
      const csrfHeader = req.headers.get('x-csrf-token') ?? (await req.json()).csrfToken

      if (!csrfHeader || csrfHeader !== csrfCookie.value) {
        return NextResponse.json({ error: 'CSRF token invalid' }, { status: 403 })
      }

      return handler(req, context)
    }
  }
}

export interface CSRFOptions {
  /** Cookie options */
  cookieOptions?: Partial<SessionCookieOptions>

  /** Custom token generator */
  generateToken?: () => string
}
```

---

## Audit Logging

### Audit Logger

```typescript
/**
 * Audit log entry
 */
export interface AuditLogEntry {
  /** Timestamp */
  timestamp: string

  /** User ID */
  userId: string

  /** Action performed */
  action: string

  /** Resource accessed */
  resource?: string

  /** Request method */
  method: string

  /** Request path */
  path: string

  /** IP address */
  ipAddress?: string

  /** User agent */
  userAgent?: string

  /** Result (success/failure) */
  result: 'success' | 'failure'

  /** Error details (if failed) */
  error?: string

  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Audit logger interface
 */
export interface AuditLogger {
  /**
   * Log an event
   */
  log(entry: AuditLogEntry): Promise<void>
}

/**
 * Audit logging middleware
 */
export function withAuditLog<T = unknown>(
  logger: AuditLogger,
  options?: AuditLogOptions
): (handler: AuthenticatedRouteHandler<T>) => AuthenticatedRouteHandler<T> {
  return (handler) => {
    return async (req: AuthenticatedRequest, context) => {
      const startTime = Date.now()
      let result: 'success' | 'failure' = 'success'
      let error: string | undefined

      try {
        const response = await handler(req, context)

        if (!response.ok) {
          result = 'failure'
          const body = await response.clone().json()
          error = body.error ?? 'Unknown error'
        }

        return response
      } catch (err) {
        result = 'failure'
        error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      } finally {
        // Log the event
        await logger.log({
          timestamp: new Date().toISOString(),
          userId: req.userId,
          action: options?.action ?? `${req.method} ${req.nextUrl.pathname}`,
          resource: options?.resource,
          method: req.method,
          path: req.nextUrl.pathname,
          ipAddress: req.headers.get('x-forwarded-for') ?? undefined,
          userAgent: req.headers.get('user-agent') ?? undefined,
          result,
          error,
          metadata: {
            duration: Date.now() - startTime,
            ...options?.metadata,
          },
        })
      }
    }
  }
}

export interface AuditLogOptions {
  /** Action name for log */
  action?: string

  /** Resource being accessed */
  resource?: string

  /** Additional metadata */
  metadata?: Record<string, unknown>
}
```

---

## Helper Functions

### Session Cookie Helpers

```typescript
/**
 * Create session cookie response
 */
export function createSessionCookieResponse(
  sessionCookie: string,
  options?: SessionCookieOptions
): NextResponse {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: COOKIE_NAMES.SESSION,
    value: sessionCookie,
    httpOnly: options?.httpOnly ?? true,
    secure: options?.secure ?? process.env.NODE_ENV === 'production',
    sameSite: options?.sameSite ?? 'lax',
    maxAge: options?.expiresIn ? options.expiresIn / 1000 : undefined,
    path: options?.path ?? '/',
    domain: options?.domain,
  })

  return response
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): NextResponse {
  const response = NextResponse.json({ success: true })

  response.cookies.delete(COOKIE_NAMES.SESSION)

  return response
}
```

### Error Response Helpers

```typescript
/**
 * Create standardized error response
 */
export function createErrorResponse(error: AuthError | string, status = 500): NextResponse {
  const authError =
    typeof error === 'string' ? new AuthError(error, AuthErrorCode.INTERNAL_ERROR) : error

  return NextResponse.json(
    {
      error: authError.message,
      code: authError.code,
      details: authError.details,
    },
    { status }
  )
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(message = 'Authentication required'): NextResponse {
  return createErrorResponse(new AuthError(message, AuthErrorCode.UNAUTHORIZED), 401)
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(message = 'Insufficient permissions'): NextResponse {
  return createErrorResponse(new AccessError(message, AuthErrorCode.FORBIDDEN), 403)
}
```

---

## Package Exports

```typescript
// Middleware
export { verifySession, verifyBearerToken } from './middleware/verify'
export { createAuthMiddleware } from './middleware/auth'

// Route wrappers
export { withAuth, withRole, compose } from './wrappers'

// Rate limiting
export { RateLimiter, withRateLimit } from './rate-limit'

// CSRF protection
export { generateCSRFToken, withCSRFProtection } from './csrf'

// Audit logging
export { withAuditLog } from './audit'
export type { AuditLogger, AuditLogEntry } from './audit'

// Helpers
export {
  createSessionCookieResponse,
  clearSessionCookie,
  createErrorResponse,
  createUnauthorizedResponse,
  createForbiddenResponse,
} from './helpers'

// Types
export type {
  AuthenticatedRequest,
  AuthenticatedRouteHandler,
  WithAuthOptions,
  WithRoleOptions,
  AuthMiddlewareConfig,
  RateLimitConfig,
  CSRFOptions,
} from './types'
```

---

**Next Document**: [05-AUTH-ACCESS.md](./05-AUTH-ACCESS.md) - Access Control Specification
