# @cenie/auth-server

Server-side authentication utilities for the CENIE platform. This package provides session management, middleware, and authentication helpers for Next.js server components and API routes.

## Overview

This package extracts and centralizes the proven authentication patterns from the Editorial app, making them available to all CENIE apps (Hub, Editorial, Academy, Agency).

### Key Features

- **Session Management**: Create, verify, and clear Firebase session cookies
- **Middleware**: Higher-order functions to protect API routes with authentication and role-based access control
- **Security**: HttpOnly cookies prevent XSS attacks
- **Long-lived Sessions**: 14-day sessions (better UX than 1-hour Firebase tokens)
- **SSR Compatible**: Works with Next.js Server Components
- **Revocable**: Server can invalidate sessions at any time

## Installation

This is a workspace package, installed via pnpm workspaces:

```json
{
  "dependencies": {
    "@cenie/auth-server": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

## Architecture

### Authentication Flow

1. User authenticates with Firebase (email/password or OAuth)
2. Client receives ID token from Firebase
3. Client sends ID token to `/api/auth/session` endpoint
4. Server creates Firebase session cookie (14-day, httpOnly)
5. Server sets cookie in response
6. Future requests use session cookie (no Firebase client SDK needed)

### Session Cookie Format

- **Name**: `session`
- **Type**: Firebase session cookie (created via Firebase Admin SDK)
- **Duration**: 14 days (configurable)
- **Security**: httpOnly, secure (in production), sameSite: lax
- **Path**: `/`

## API Reference

### Session Management

#### `createSession(idToken, appName, options?)`

Creates a Firebase session cookie from an ID token.

**Parameters:**

- `idToken` (string): Firebase ID token from client authentication
- `appName` (AppName): The app creating the session (`'hub'`, `'editorial'`, `'academy'`, or `'agency'`)
- `options` (SessionOptions, optional): Configuration options
  - `expiresIn` (number): Session duration in milliseconds (default: 14 days, max: 14 days)

**Returns:** `Promise<string>` - The session cookie string

**Throws:** `AuthenticationError` if session creation fails

**Example:**

```typescript
import { createSession } from '@cenie/auth-server/session'

export async function POST(request: NextRequest) {
  const { idToken } = await request.json()

  try {
    const sessionCookie = await createSession(idToken, 'editorial')
    
    // Set cookie in response
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
```

#### `verifySession(sessionCookie)`

Verifies a session cookie and returns the decoded token data.

**Parameters:**

- `sessionCookie` (string): The session cookie string to verify

**Returns:** `Promise<DecodedIdToken | null>` - Decoded token if valid, null if invalid/expired

**Note:** Returns `null` instead of throwing because expired sessions are normal. The caller decides how to handle.

**Example:**

```typescript
import { verifySession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const decoded = await verifySession(sessionCookie.value)

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  // User is authenticated
  return NextResponse.json({
    userId: decoded.uid,
    email: decoded.email,
  })
}
```

#### `clearSession()`

Clears the session cookie (logout).

**Returns:** `Promise<void>`

**Example:**

```typescript
import { clearSession } from '@cenie/auth-server/session'

export async function DELETE() {
  try {
    await clearSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    )
  }
}
```

### Middleware

#### `withAuth(handler)`

Wraps an API route handler to require authentication.

**Parameters:**

- `handler` (AuthenticatedHandler): The route handler to protect
  - Receives `request` and `{ user, params? }` as arguments
  - `user` is guaranteed to be authenticated

**Returns:** `NextRouteHandler` - A wrapped handler that checks authentication

**Example:**

```typescript
import { withAuth } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

export const GET = withAuth(async (_request, { user }) => {
  // user is guaranteed to be authenticated
  return NextResponse.json({
    userId: user.uid,
    email: user.email,
  })
})
```

**Behavior:**

- Returns **401 Unauthorized** if no session cookie exists
- Returns **401 Unauthorized** if session is invalid or expired
- Calls handler with authenticated user if session is valid
- Returns **500 Internal Server Error** if handler throws

#### `withRole(appName, minimumRole, handler)`

Wraps an API route handler to require specific role for an app.

**Parameters:**

- `appName` (AppName): The app to check access for
- `minimumRole` (string): Minimum role required (e.g., 'viewer', 'editor', 'admin')
- `handler` (AuthenticatedHandler): The route handler to protect

**Returns:** `NextRouteHandler` - A wrapped handler that checks authentication and role

**Example:**

```typescript
import { withRole } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

export const GET = withRole('editorial', 'editor', async (_request, { user }) => {
  // user is guaranteed to have editor role or higher in editorial app
  return NextResponse.json({
    role: user.role,
    message: 'You have editor access!',
  })
})
```

**Behavior:**

- Composes with `withAuth` (checks authentication first)
- Returns **403 Forbidden** if user has no access to the app
- Returns **403 Forbidden** if user's role is insufficient
- Calls handler with role-verified user if authorized
- Returns **500 Internal Server Error** if handler throws

**Note:** This middleware depends on helper functions from TASK_1A3 and TASK_1A4. It will return **501 Not Implemented** if those dependencies are not yet available.

### Helpers

#### `getAuthenticatedUser()`

Gets the authenticated user from the session cookie.

**Returns:** `Promise<AuthenticatedUser | null>` - User if authenticated, null otherwise

**Example:**

```typescript
import { getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({
    userId: user.uid,
    email: user.email,
  })
}
```

**Behavior:**

- Reads session cookie from request
- Verifies session with Firebase Admin
- Returns user object if session is valid
- Returns null if no session or invalid (does not throw)

#### `checkAppAccess(userId, appName)`

Checks if a user has access to a specific app and gets their role.

**Parameters:**

- `userId` (string): Firebase UID of the user
- `appName` (AppName): The app to check access for

**Returns:** `Promise<AccessData>` - Access status and role information

**Example:**

```typescript
import { checkAppAccess, getAuthenticatedUser } from '@cenie/auth-server/helpers'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const access = await checkAppAccess(user.uid, 'editorial')

  if (!access.hasAccess) {
    return NextResponse.json({ error: 'No access to editorial' }, { status: 403 })
  }

  return NextResponse.json({
    userId: user.uid,
    role: access.role,
  })
}
```

**Behavior:**

- Queries Firestore `user_app_access` collection
- Returns access status, role, and active state
- Returns `{ hasAccess: false }` if no access found
- Returns `{ hasAccess: false }` on error (fail closed for security)
- Does not throw errors

**Firestore Query:**

```typescript
firestore
  .collection('user_app_access')
  .where('userId', '==', userId)
  .where('appName', '==', appName)
  .where('isActive', '==', true)
  .limit(1)
```

#### `verifyIdToken(token)`

Verifies a Firebase ID token from an Authorization header.

**Parameters:**

- `token` (string): The Firebase ID token to verify

**Returns:** `Promise<DecodedIdToken>` - Decoded token data if valid

**Throws:** `AuthenticationError` if token is invalid, expired, or malformed

**Example:**

```typescript
import { verifyIdToken } from '@cenie/auth-server/helpers'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded = await verifyIdToken(token)

    return NextResponse.json({
      userId: decoded.uid,
      email: decoded.email,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid token' },
      { status: 401 }
    )
  }
}
```

**Use Cases:**

- Mobile app API requests
- Service-to-service communication
- Inter-app API calls
- Routes that need Bearer token authentication

**Error Codes:**

- `auth/id-token-expired` → "Token expired"
- `auth/invalid-id-token` → "Invalid token"
- `auth/argument-error` → "Malformed token"
- Generic → "Token verification failed"

## Types

### `AppName`

Valid CENIE app names:

```typescript
type AppName = 'hub' | 'editorial' | 'academy' | 'agency'
```

### `SessionOptions`

Configuration options for session creation:

```typescript
interface SessionOptions {
  expiresIn?: number // milliseconds, default 14 days
}
```

### `AuthenticatedUser`

Authenticated user data:

```typescript
interface AuthenticatedUser {
  uid: string
  email: string | null
  role: string
  session: DecodedIdToken
}
```

### `AccessData`

User access information:

```typescript
interface AccessData {
  hasAccess: boolean
  role: string | null
  isActive: boolean
}
```

### `AuthenticatedHandler<TParams>`

Handler function type that receives authenticated user:

```typescript
type AuthenticatedHandler<TParams = unknown> = (
  request: NextRequest,
  context: {
    user: AuthenticatedUser
    params?: TParams
  }
) => Promise<NextResponse> | NextResponse
```

### `NextRouteHandler<TParams>`

Standard Next.js API route handler type:

```typescript
type NextRouteHandler<TParams = unknown> = (
  request: NextRequest,
  context?: { params?: TParams }
) => Promise<NextResponse>
```

## Integration Guide

### Setting Up Authentication in Your App

1. **Create a session endpoint** (`/api/auth/session/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createSession, clearSession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'

// POST - Create session
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      )
    }

    const sessionCookie = await createSession(idToken, 'editorial')

    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// DELETE - Clear session
export async function DELETE() {
  try {
    await clearSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    )
  }
}
```

2. **Create auth helpers** (`lib/auth-helpers.ts`):

```typescript
import { verifySession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'
import type { DecodedIdToken } from 'firebase-admin/auth'

export async function getServerSession(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return null
  }

  return await verifySession(sessionCookie.value)
}

export async function requireAuth() {
  const session = await getServerSession()

  if (!session) {
    throw new Error('Authentication required')
  }

  return session
}
```

3. **Use in protected routes (traditional approach)**:

```typescript
import { requireAuth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const session = await requireAuth()

  // User is authenticated, use session.uid, session.email, etc.
  return NextResponse.json({ userId: session.uid })
}
```

### Using Middleware (Recommended Approach)

Instead of manually checking authentication in every route, use middleware to wrap your handlers:

**1. Simple authentication protection:**

```typescript
import { withAuth } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

export const GET = withAuth(async (_request, { user }) => {
  // user is guaranteed to be authenticated
  return NextResponse.json({
    userId: user.uid,
    email: user.email,
  })
})
```

**2. Role-based protection:**

```typescript
import { withRole } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

// Only users with 'editor' role or higher can access
export const POST = withRole('editorial', 'editor', async (_request, { user }) => {
  // user is authenticated AND has required role
  return NextResponse.json({
    message: 'Article created',
    createdBy: user.uid,
  })
})

// Only admins can access
export const DELETE = withRole('editorial', 'admin', async (_request, { user }) => {
  // user is authenticated AND is an admin
  return NextResponse.json({ message: 'Article deleted' })
})
```

**3. With dynamic route params:**

```typescript
import { withAuth } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

// For routes like /api/articles/[id]
export const GET = withAuth<{ id: string }>(async (_request, { user, params }) => {
  const articleId = params?.id

  return NextResponse.json({
    articleId,
    requestedBy: user.uid,
  })
})
```

**Benefits of middleware approach:**

- **Cleaner code**: No manual auth checks in every route
- **Consistent patterns**: All routes use the same protection mechanism
- **Type safety**: TypeScript knows the user is always available
- **Less duplication**: DRY (Don't Repeat Yourself) principle
- **Composable**: Easy to add multiple layers of protection

## Error Handling

The package uses `@cenie/errors` for consistent error handling:

- **AuthenticationError**: Thrown when authentication fails
  - `code`: Error code (e.g., `'INVALID_ID_TOKEN'`, `'SESSION_CREATION_FAILED'`)
  - `metadata`: Additional context (e.g., `appName`, `expiresIn`)
  - `cause`: Original error if available

## Logging

The package uses `@cenie/logger` for structured logging:

- Session creation: Logs success with app name and expiration
- Session verification: Logs failures at debug level
- Sensitive data (tokens, cookies) are never logged

## Dependencies

- `@cenie/firebase` - Firebase Admin SDK utilities
- `@cenie/errors` - Error handling
- `@cenie/logger` - Structured logging
- `next` - Next.js framework (peer dependency)
- `firebase-admin` - Firebase Admin SDK (peer dependency)

## Security Considerations

1. **HttpOnly cookies**: Prevents XSS attacks from stealing session tokens
2. **Secure flag**: Cookies only sent over HTTPS in production
3. **SameSite**: Prevents CSRF attacks
4. **Session revocation**: Firebase sessions can be revoked server-side
5. **No token logging**: Tokens and cookies are never logged

## Future Enhancements

This package will be extended in future phases to include:

- Middleware for automatic session verification
- Role-based access control helpers
- User management utilities
- OAuth integration helpers

## License

Private - CENIE Platform

## Support

For questions or issues, contact the CENIE development team.

