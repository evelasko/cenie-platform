# TASK 1A-3: Create @cenie/auth-server Helpers Module

**Phase**: 1A - Auth Packages  
**Duration**: 1 day  
**Dependencies**: TASK_1A1 (Session Module)  
**Next Task**: TASK_1A4 (Auth Utils Package)

---

## OBJECTIVE

Create helper functions that API routes use to get authenticated users and check app access. These are the building blocks used by the middleware from TASK_1A2.

**What You're Building**: Reusable functions that read sessions, verify tokens, and query Firestore for access control.

**Why This Matters**: These helpers eliminate 200+ lines of duplicated code between Hub and Editorial. Every app needs to check "is user authenticated?" and "does user have access to this app?" - now they all use the same code.

---

## ARCHITECTURE CONTEXT

### How Apps Check Authentication

**Current Process** (Editorial does this manually in every protected route):
1. Get session cookie from request
2. Verify session with Firebase Admin
3. Query Firestore for app access
4. Check role hierarchy
5. Return user with role or error

**After This Task**: All apps use shared helper functions for this.

### Firestore Collections

**`profiles` collection**:
```typescript
{
  id: string // Firebase UID
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**`user_app_access` collection**:
```typescript
{
  userId: string // Firebase UID
  appName: 'hub' | 'editorial' | 'academy' | 'agency'
  role: string // 'viewer', 'editor', 'admin', etc.
  isActive: boolean
  grantedAt: Timestamp
  grantedBy: string | null
}
```

**Query Pattern** (used everywhere):
```typescript
firestore
  .collection('user_app_access')
  .where('userId', '==', userId)
  .where('appName', '==', 'editorial')
  .where('isActive', '==', true)
  .limit(1)
  .get()
```

---

## SOURCE FILES TO STUDY

**Primary Reference** (Editorial's proven implementation):

1. `apps/editorial/src/lib/auth-helpers.ts`
   - Lines 25-38: `getAuthenticatedUser()` - Session reading
   - Lines 44-80: `checkEditorialAccess()` - Firestore access query
   - Lines 87-104: `getAuthenticatedUserWithAccess()` - Combined operation
   - **This file is your blueprint**

2. `@cenie/firebase/src/server.ts`
   - Lines 145-154: `getServerSession()` - Cookie reading pattern
   - Shows how to get session from cookies

3. `apps/hub/src/lib/auth-middleware.ts`
   - Lines 12-64: `authenticateRequest()` - Alternative pattern
   - Similar logic but different error handling

**Use Editorial's approach** - it's cleaner and matches our requirements.

---

## WHAT TO BUILD

### Add to Package Structure

```
packages/auth-server/src/
├── session/ (exists from TASK_1A1)
├── middleware/ (exists from TASK_1A2)
├── helpers/
│   ├── get-authenticated-user.ts
│   ├── check-app-access.ts
│   ├── verify-id-token.ts
│   ├── types.ts
│   └── index.ts
├── types.ts (update)
└── index.ts (update)
```

---

## DETAILED REQUIREMENTS

### File 1: `src/helpers/types.ts`

```typescript
import type { DecodedIdToken } from 'firebase-admin/auth'

export interface AuthenticatedUser {
  uid: string
  email: string | null
  role: string
  session: DecodedIdToken
}

export interface AccessData {
  hasAccess: boolean
  role: string | null
  isActive: boolean
}
```

**Note**: These types are already in `src/types.ts` but we redefine here for module clarity.

### File 2: `src/helpers/get-authenticated-user.ts`

**Purpose**: Get authenticated user from session cookie

**Function Signature**:
```typescript
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null>
```

**Implementation Requirements**:

1. **Import Dependencies**:
   ```typescript
   import { cookies } from 'next/headers'
   import { verifySession } from '../session/verify-session'
   import type { AuthenticatedUser } from './types'
   ```

2. **Read Session Cookie**:
   ```typescript
   const cookieStore = await cookies()
   const sessionCookie = cookieStore.get('session')
   
   if (!sessionCookie) {
     return null
   }
   ```

3. **Verify Session**:
   ```typescript
   const session = await verifySession(sessionCookie.value)
   
   if (!session) {
     return null
   }
   ```

4. **Build User Object**:
   ```typescript
   return {
     uid: session.uid,
     email: session.email || null,
     role: 'viewer', // Default role, actual role determined by checkAppAccess
     session,
   }
   ```

5. **Return**:
   - Return `AuthenticatedUser` if session valid
   - Return `null` if no session or invalid session
   - **Don't throw errors** - returning null is expected behavior

**Reference**: Extract exactly from `apps/editorial/src/lib/auth-helpers.ts` lines 25-38.

### File 3: `src/helpers/check-app-access.ts`

**Purpose**: Check if user has access to a specific app and get their role

**Function Signature**:
```typescript
export async function checkAppAccess(
  userId: string,
  appName: AppName
): Promise<AccessData>
```

**Implementation Requirements**:

1. **Import Dependencies**:
   ```typescript
   import { initializeAdminApp } from '@cenie/firebase/server'
   import { createLogger } from '@cenie/logger'
   import type { AppName, AccessData } from '../types'
   ```

2. **Query Firestore**:
   ```typescript
   const logger = createLogger({ name: 'check-app-access' })
   
   try {
     const adminApp = initializeAdminApp()
     const firestore = adminApp.firestore()
     
     const accessSnapshot = await firestore
       .collection('user_app_access')
       .where('userId', '==', userId)
       .where('appName', '==', appName)
       .where('isActive', '==', true)
       .limit(1)
       .get()
     
     if (accessSnapshot.empty) {
       return {
         hasAccess: false,
         role: null,
         isActive: false,
       }
     }
     
     const accessDoc = accessSnapshot.docs[0].data()
     
     return {
       hasAccess: true,
       role: accessDoc.role as string,
       isActive: accessDoc.isActive as boolean,
     }
   } catch (error) {
     logger.error('Error checking app access', { error, userId, appName })
     
     // Return no access on error (fail closed)
     return {
       hasAccess: false,
       role: null,
       isActive: false,
     }
   }
   ```

3. **Error Handling**:
   - Catch all errors (Firestore connection issues, etc.)
   - Log the error
   - Return "no access" (fail closed for security)
   - **Don't throw** - return safe default

**Reference**: Extract from `apps/editorial/src/lib/auth-helpers.ts` lines 44-80.

**Important**: This function will be enhanced with caching in Phase 7 (TASK 7-2), but for now, keep it simple - just query Firestore directly.

### File 4: `src/helpers/verify-id-token.ts`

**Purpose**: Verify Firebase ID token from Authorization header

**Function Signature**:
```typescript
export async function verifyIdToken(token: string): Promise<DecodedIdToken>
```

**Implementation Requirements**:

1. **Import Dependencies**:
   ```typescript
   import { initializeAdminApp } from '@cenie/firebase/server'
   import { AuthenticationError } from '@cenie/errors'
   import type { DecodedIdToken } from 'firebase-admin/auth'
   ```

2. **Validate Input**:
   ```typescript
   if (!token) {
     throw new AuthenticationError('Token is required')
   }
   ```

3. **Verify Token**:
   ```typescript
   try {
     const adminApp = initializeAdminApp()
     const auth = adminApp.auth()
     const decodedToken = await auth.verifyIdToken(token)
     return decodedToken
   } catch (error: any) {
     // Handle specific Firebase errors
     if (error.code === 'auth/id-token-expired') {
       throw new AuthenticationError('Token expired', {
         metadata: { tokenType: 'id-token' },
       })
     }
     
     if (error.code === 'auth/invalid-id-token') {
       throw new AuthenticationError('Invalid token', {
         metadata: { tokenType: 'id-token' },
       })
     }
     
     // Generic error
     throw new AuthenticationError('Token verification failed', {
       cause: error,
     })
   }
   ```

**Reference**: Extract from `apps/hub/src/lib/auth-middleware.ts` lines 12-64 (the token verification part).

**Why This Helper?**: Some routes need to verify ID tokens from Authorization headers (not session cookies). For example:
- API routes called from other apps
- Mobile app requests
- Service-to-service communication

### File 5: `src/helpers/index.ts`

```typescript
export * from './get-authenticated-user'
export * from './check-app-access'
export * from './verify-id-token'
export * from './types'
```

### File 6: Update `src/index.ts`

Add helpers exports:
```typescript
// Session management
export * from './session'

// Middleware
export * from './middleware'

// Helpers
export * from './helpers'

// Types
export type { AppName, AuthenticatedUser, AccessData } from './types'
```

### File 7: Update `package.json`

Add helpers export:
```json
{
  "exports": {
    ".": "./src/index.ts",
    "./session": "./src/session/index.ts",
    "./middleware": "./src/middleware/index.ts",
    "./helpers": "./src/helpers/index.ts"
  }
}
```

---

## COMPLETING TASK_1A2 DEPENDENCY

Now that `checkAppAccess` exists, **go back to TASK_1A2** and update `with-role.ts`:

Change this line:
```typescript
const { checkAppAccess } = await import('../helpers/check-app-access')
```

To a regular import (now that the file exists):
```typescript
import { checkAppAccess } from '../helpers/check-app-access'
```

This completes the middleware implementation from TASK_1A2.

---

## TESTING REQUIREMENTS

### Test 1: getAuthenticatedUser()

Create test route: `apps/editorial/src/app/api/test-user/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@cenie/auth-server/helpers'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  return NextResponse.json({
    userId: user.uid,
    email: user.email,
    role: user.role,
  })
}
```

**Test Steps**:
1. Sign in to Editorial (http://localhost:3001/sign-in)
2. Visit http://localhost:3001/api/test-user
3. Should see your user data

**Without session**:
1. Clear cookies
2. Visit http://localhost:3001/api/test-user
3. Should get 401 error

### Test 2: checkAppAccess()

Create test route: `apps/editorial/src/app/api/test-access/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, checkAppAccess } from '@cenie/auth-server/helpers'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  // Check editorial access
  const editorialAccess = await checkAppAccess(user.uid, 'editorial')
  
  // Check hub access (probably won't have it)
  const hubAccess = await checkAppAccess(user.uid, 'hub')
  
  return NextResponse.json({
    userId: user.uid,
    editorial: editorialAccess,
    hub: hubAccess,
  })
}
```

**Test Steps**:
1. Sign in to Editorial
2. Visit http://localhost:3001/api/test-access
3. Should see editorial access with your role
4. Hub access should show hasAccess: false (unless you have hub access too)

**Verify Firestore Query**:
- Open Firebase Console → Firestore
- Check `user_app_access` collection
- Find your access record
- Verify role matches what API returns

### Test 3: verifyIdToken()

Create test route: `apps/editorial/src/app/api/test-token/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@cenie/auth-server/helpers'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  try {
    const decoded = await verifyIdToken(token)
    
    return NextResponse.json({
      userId: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 401 }
    )
  }
}
```

**Test Steps**:
1. Sign in to Editorial
2. Open browser console
3. Get Firebase ID token:
   ```javascript
   import { getFirebaseAuth } from '@cenie/firebase/client'
   const auth = getFirebaseAuth()
   const token = await auth.currentUser.getIdToken()
   console.log(token)
   ```
4. Copy the token
5. Make request with curl:
   ```bash
   curl http://localhost:3001/api/test-token \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
6. Should see user data

**Test with invalid token**:
```bash
curl http://localhost:3001/api/test-token \
  -H "Authorization: Bearer invalid_token"
```
Should get 401 with "Invalid token" error.

### Test 4: Complete withRole() from TASK_1A2

Now that `checkAppAccess` exists, test the full `withRole()` middleware:

Create test route: `apps/editorial/src/app/api/test-editor/route.ts`

```typescript
import { withRole } from '@cenie/auth-server/middleware'
import { NextResponse } from 'next/server'

export const GET = withRole('editorial', 'editor', async (request, { user }) => {
  return NextResponse.json({
    message: 'You have editor access!',
    userId: user.uid,
    role: user.role,
  })
})
```

**Test Steps**:
1. Sign in as user with 'editor' or 'admin' role
2. Visit http://localhost:3001/api/test-editor
3. Should succeed with user data

**Test with viewer role**:
1. Change your role in Firestore to 'viewer'
2. Visit http://localhost:3001/api/test-editor
3. Should get 403 Forbidden

**After all tests**: Delete all test routes.

---

## SUCCESS CRITERIA

- [ ] `getAuthenticatedUser()` implemented and tested
- [ ] `checkAppAccess()` implemented and tested
- [ ] `verifyIdToken()` implemented and tested
- [ ] TypeScript compiles without errors
- [ ] Linting passes (zero warnings)
- [ ] All test routes work as expected
- [ ] `withRole()` from TASK_1A2 now fully functional
- [ ] Package exports updated
- [ ] README updated with helper documentation

---

## COMMON PITFALLS

1. **Don't throw on no access**: `checkAppAccess` should return `{ hasAccess: false }`, not throw

2. **Don't forget error handling**: Firestore queries can fail (network issues, permissions, etc.)

3. **Don't cache yet**: Caching will be added in Phase 7. For now, query Firestore directly each time.

4. **Don't modify Firestore**: These are read-only helpers. Granting/revoking access comes later.

5. **Don't skip the token verification test**: It's important for inter-app API calls.

---

## INTEGRATION WITH PREVIOUS TASKS

After this task:
- **TASK_1A2's `withRole()`** becomes fully functional
- Academy and Agency (Phase 2, 3) can use all auth features
- Hub and Editorial refactoring (Phase 4) can migrate to these helpers

---

## HANDOFF

When complete, provide:
- [ ] Git commit with helpers module
- [ ] Test results (screenshots showing all tests pass)
- [ ] Confirmation that `withRole()` now works end-to-end
- [ ] Any issues or questions

**Next**: TASK_1A4 will create `@cenie/auth-utils` package which provides the role hierarchy logic that `withRole()` depends on.

---

**Estimated Time**: 4-6 hours (one focused work day)

**Critical Note**: This task completes the dependency chain for TASK_1A2, making the entire middleware system functional. Test thoroughly!

