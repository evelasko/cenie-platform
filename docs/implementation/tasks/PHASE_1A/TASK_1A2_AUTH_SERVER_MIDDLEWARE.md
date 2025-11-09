# TASK 1A-2: Create @cenie/auth-server Middleware Module

**Phase**: 1A - Auth Packages  
**Duration**: 1 day  
**Dependencies**: TASK_1A1 (Session module must be complete)  
**Next Task**: TASK_1A3 (Helper Functions)

---

## OBJECTIVE

Create middleware functions that protect Next.js API routes with authentication and role-based access control. These will be used in all apps to easily add auth requirements to any endpoint.

**What You're Building**: Higher-order functions that wrap API route handlers with auth checks.

**Why This Matters**: Instead of every API route manually checking authentication and roles, they can use `withAuth()` and `withRole()` wrappers for clean, consistent protection.

---

## ARCHITECTURE CONTEXT

### How API Routes Use Middleware

**Without middleware (current Editorial pattern)**:

```typescript
export async function GET(request: NextRequest) {
  // Manual auth check
  const authResult = await requireRole('editor')
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  // Route logic
  const books = await getBooks()
  return NextResponse.json(books)
}
```

**With middleware (goal)**:

```typescript
import { withRole } from '@cenie/auth-server/middleware'

export const GET = withRole('editorial', 'editor', async (request, { user }) => {
  // user is guaranteed to be authenticated with editor role
  const books = await getBooks()
  return NextResponse.json(books)
})
```

**Benefit**: Cleaner code, consistent patterns, less duplication.

### Middleware Pattern

Higher-order functions (HOF) that:

1. Take a handler function
2. Return a new handler function
3. Perform checks before calling original handler
4. Can short-circuit with error responses

This is a common pattern in Express, Next.js, and many frameworks.

---

## SOURCE FILES TO STUDY

**Read these files to understand the pattern:**

1. `apps/editorial/src/lib/auth-helpers.ts`
   - Lines 110-118: `requireAuth()` function
   - Lines 124-143: `requireEditorialAccess()` function
   - Lines 151-184: `requireRole()` function
   - This shows the auth checking pattern you'll wrap

2. `apps/hub/src/lib/auth-middleware.ts`
   - Lines 12-64: `authenticateRequest()` function
   - Lines 66-98: `requireAdmin()` function
   - Alternative implementation (Hub's version)

3. `@cenie/firebase/src/middleware.ts`
   - Lines 5-26: `withAuth()` middleware pattern
   - Shows HOF structure (though this is for Next.js middleware, not API routes)

**Use Editorial's pattern** as primary reference - it's cleaner and matches our needs.

---

## WHAT TO BUILD

### Add to Package Structure

```
packages/auth-server/src/
├── session/ (already exists from TASK_1A1)
├── middleware/
│   ├── with-auth.ts
│   ├── with-role.ts
│   ├── types.ts
│   └── index.ts
├── types.ts (update)
└── index.ts (update)
```

---

## DETAILED REQUIREMENTS

### File 1: `src/middleware/types.ts`

**Purpose**: Type definitions for middleware

```typescript
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
```

### File 2: `src/middleware/with-auth.ts`

**Purpose**: Require authentication for an API route

**Function Signature**:

```typescript
export function withAuth<TParams = unknown>(
  handler: AuthenticatedHandler<TParams>
): NextRouteHandler<TParams>
```

**Implementation Requirements**:

1. **Import Dependencies**:

   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { cookies } from 'next/headers'
   import { verifySession } from '../session/verify-session'
   import { createLogger } from '@cenie/logger'
   import type { AuthenticatedHandler, NextRouteHandler } from './types'
   import type { AuthenticatedUser } from '../types'
   ```

2. **Return a Wrapped Handler**:
   - Return an async function that matches `NextRouteHandler` signature
   - This function will be called by Next.js on each request

3. **Authentication Check**:
   - Get cookie store: `const cookieStore = await cookies()`
   - Get session cookie: `const sessionCookie = cookieStore.get('session')`
   - If no cookie:

     ```typescript
     return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
     ```

   - Verify session: `const decoded = await verifySession(sessionCookie.value)`
   - If invalid (null):

     ```typescript
     return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
     ```

4. **Build User Object**:

   ```typescript
   const user: AuthenticatedUser = {
     uid: decoded.uid,
     email: decoded.email || null,
     role: 'viewer', // Default role, will be determined by access check
     session: decoded,
   }
   ```

5. **Call Original Handler**:
   - Call handler with user in context
   - Pass params through if they exist
   - Return handler's response

6. **Error Handling**:
   - Wrap in try-catch
   - Log errors using `@cenie/logger`
   - Return 500 error if handler throws

**Complete Implementation Pattern**:

```typescript
export function withAuth<TParams = unknown>(
  handler: AuthenticatedHandler<TParams>
): NextRouteHandler<TParams> {
  return async (request: NextRequest, context?: { params?: TParams }) => {
    const logger = createLogger({ name: 'withAuth' })

    try {
      // Get session cookie
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('session')

      if (!sessionCookie) {
        logger.warn('Authentication required - no session cookie')
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      // Verify session
      const decoded = await verifySession(sessionCookie.value)

      if (!decoded) {
        logger.warn('Authentication failed - invalid session')
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
      }

      // Build user object
      const user: AuthenticatedUser = {
        uid: decoded.uid,
        email: decoded.email || null,
        role: 'viewer', // Default
        session: decoded,
      }

      // Call original handler
      return await handler(request, { user, params: context?.params })
    } catch (error) {
      logger.error('Error in withAuth middleware', { error })
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
```

### File 3: `src/middleware/with-role.ts`

**Purpose**: Require specific role for an API route

**Function Signature**:

```typescript
export function withRole<TParams = unknown>(
  appName: AppName,
  minimumRole: string,
  handler: AuthenticatedHandler<TParams>
): NextRouteHandler<TParams>
```

**Implementation Requirements**:

1. **Import Dependencies**:

   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { withAuth } from './with-auth'
   import { checkAppAccess } from '../helpers/check-app-access' // Will be created in TASK_1A3
   import { createLogger } from '@cenie/logger'
   import type { AuthenticatedHandler, NextRouteHandler } from './types'
   import type { AppName } from '../types'
   ```

2. **Compose with withAuth**:
   - First use `withAuth` to ensure user is authenticated
   - Then add role checking on top

3. **Implementation Pattern**:

   ```typescript
   export function withRole<TParams = unknown>(
     appName: AppName,
     minimumRole: string,
     handler: AuthenticatedHandler<TParams>
   ): NextRouteHandler<TParams> {
     return withAuth<TParams>(async (request, context) => {
       const { user } = context
       const logger = createLogger({ name: 'withRole' })

       try {
         // Import helpers (will be created in next task)
         const { checkAppAccess } = await import('../helpers/check-app-access')

         // Check app access
         const access = await checkAppAccess(user.uid, appName)

         if (!access.hasAccess) {
           logger.warn('Access denied - user has no app access', {
             userId: user.uid,
             appName,
           })
           return NextResponse.json({ error: `No access to ${appName} app` }, { status: 403 })
         }

         // Check role hierarchy
         const { hasRole } = await import('@cenie/auth-utils/roles')

         if (!hasRole(access.role!, minimumRole)) {
           logger.warn('Access denied - insufficient role', {
             userId: user.uid,
             appName,
             userRole: access.role,
             requiredRole: minimumRole,
           })
           return NextResponse.json(
             {
               error: 'Insufficient permissions',
               userRole: access.role,
               requiredRole: minimumRole,
             },
             { status: 403 }
           )
         }

         // Update user object with actual role
         const authenticatedUser = {
           ...user,
           role: access.role!,
         }

         // Call handler with role-verified user
         return await handler(request, {
           ...context,
           user: authenticatedUser,
         })
       } catch (error) {
         logger.error('Error in withRole middleware', { error, appName, minimumRole })
         return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
       }
     })
   }
   ```

**Important Notes**:

- `checkAppAccess` will be created in TASK_1A3 (next task)
- `hasRole` will be created in TASK_1A4 (@cenie/auth-utils)
- Use dynamic imports for now to avoid circular dependencies
- The composability (withAuth → withRole) keeps code DRY

### File 4: `src/middleware/index.ts`

```typescript
export * from './with-auth'
export * from './with-role'
export * from './types'
```

### File 5: Update `src/index.ts`

Add middleware exports:

```typescript
// Session management
export * from './session'

// Middleware
export * from './middleware'

// Types
export type { AppName, AuthenticatedUser, AccessData } from './types'
```

### File 6: Update `package.json`

Add middleware export:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./session": "./src/session/index.ts",
    "./middleware": "./src/middleware/index.ts"
  }
}
```

---

## TESTING REQUIREMENTS

### Test 1: withAuth Protection

Create test route: `apps/editorial/src/app/api/test-auth/route.ts`

```typescript
import { withAuth } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

export const GET = withAuth(async (request, { user }) => {
  return NextResponse.json({
    message: 'You are authenticated!',
    userId: user.uid,
    email: user.email,
  })
})
```

**Test**:

1. Sign in to Editorial
2. Visit `http://localhost:3001/api/test-auth`
3. Should see user data

**Test without session**:

1. Clear browser cookies
2. Visit `http://localhost:3001/api/test-auth`
3. Should get 401 Unauthorized

**After testing**: Delete test route.

### Test 2: withRole Protection

**Note**: This test depends on TASK_1A3 and TASK_1A4 being complete. You can write the test now but it won't work until those tasks are done.

Create test route: `apps/editorial/src/app/api/test-role/route.ts`

```typescript
import { withRole } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

export const GET = withRole('editorial', 'editor', async (request, { user }) => {
  return NextResponse.json({
    message: 'You have editor access!',
    role: user.role,
  })
})
```

**Test** (after dependencies complete):

1. Sign in as user with 'editor' role
2. Visit `http://localhost:3001/api/test-role`
3. Should succeed

**Test with lower role**:

1. Sign in as user with 'viewer' role
2. Visit `http://localhost:3001/api/test-role`
3. Should get 403 Forbidden

---

## SUCCESS CRITERIA

- [ ] `withAuth()` function implemented correctly
- [ ] `withRole()` function implemented correctly
- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] withAuth test passes (authenticated access works, unauthenticated returns 401)
- [ ] Package exports updated
- [ ] README updated with middleware documentation

**Note**: Full withRole testing will be done after TASK_1A3 and TASK_1A4 are complete.

---

## COMMON PITFALLS

1. **Don't forget to compose**: `withRole` should use `withAuth` internally
2. **Don't throw in withAuth**: Return 401 response, don't throw errors
3. **Don't block on dependencies**: You can implement `withRole` now even though `checkAppAccess` doesn't exist yet - use dynamic import
4. **Don't skip the test**: Test withAuth before marking complete

---

## HANDOFF

When complete:

- [ ] Middleware module working
- [ ] withAuth tested with Editorial
- [ ] withRole implemented (will be fully tested after dependencies)
- [ ] Documentation updated

**Next**: TASK_1A3 will create the helper functions that `withRole` depends on.

---

**Estimated Time**: 4-5 hours (one focused work day)
