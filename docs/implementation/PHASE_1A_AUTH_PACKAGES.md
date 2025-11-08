# PHASE 1A: FOUNDATION - AUTH PACKAGES

**Agent Assignment**: Agent 1  
**Duration**: 5 days  
**Dependencies**: None  
**Deliverables**: 3 new shared packages (`@cenie/auth-server`, `@cenie/auth-utils`, `@cenie/oauth-handlers`)

---

## OVERVIEW

Extract proven authentication patterns from Editorial and Hub into reusable shared packages. Editorial's session management is the blueprint - it "works perfectly well" and should be the foundation for all apps.

**Source Code References:**

- `apps/editorial/src/lib/auth-helpers.ts` - Session and access control patterns
- `apps/editorial/src/app/api/auth/session/route.ts` - Session creation
- `apps/hub/src/lib/auth-middleware.ts` - Auth middleware patterns
- `apps/hub/src/app/api/auth/oauth/route.ts` - OAuth server logic
- `apps/hub/src/hooks/use-oauth.ts` - OAuth client logic
- `apps/hub/src/components/auth/oauth-error-handler.tsx` - Account linking UI

---

## PACKAGE 1: @cenie/auth-server

### Purpose

Server-side authentication utilities for Next.js API routes and Server Components.

### Location

`packages/auth-server/`

### Directory Structure

```
packages/auth-server/
├── src/
│   ├── session/
│   │   ├── create-session.ts
│   │   ├── verify-session.ts
│   │   ├── clear-session.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── with-auth.ts
│   │   ├── with-role.ts
│   │   └── index.ts
│   ├── helpers/
│   │   ├── get-authenticated-user.ts
│   │   ├── check-app-access.ts
│   │   ├── verify-token.ts
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Detailed Requirements

#### 1. Session Management Module (`src/session/`)

**File: `create-session.ts`**

Extract from: `apps/editorial/src/app/api/auth/session/route.ts` (lines 8-50)

Requirements:

- Function signature: `createSession(idToken: string, appName: string, options?: SessionOptions): Promise<string>`
- Use `initializeAdminApp()` from `@cenie/firebase/server`
- Call `auth.createSessionCookie(idToken, { expiresIn: 14 * 24 * 60 * 60 * 1000 })`
- Return the session cookie string
- If creation fails, throw `AuthenticationError` from `@cenie/errors`
- Log session creation using `@cenie/logger`
- Include metadata: userId (from decoded token), appName, expiresIn

**File: `verify-session.ts`**

Extract from: `apps/editorial/src/lib/auth-helpers.ts` (getAuthenticatedUser function)

Requirements:

- Function signature: `verifySession(sessionCookie: string): Promise<DecodedIdToken | null>`
- Use `initializeAdminApp()` from `@cenie/firebase/server`
- Call `auth.verifySessionCookie(sessionCookie, true)` (check revoked)
- Return decoded token or null if invalid
- Log verification failures with reason
- Do NOT throw errors for invalid sessions (return null instead)

**File: `clear-session.ts`**

Extract from: `apps/editorial/src/app/api/auth/session/route.ts` (DELETE handler)

Requirements:

- Function signature: `clearSession(): Promise<void>`
- Use Next.js `cookies()` from `next/headers`
- Delete 'session' cookie
- No errors if cookie doesn't exist
- Log session clearing

**Integration Pattern**:

```typescript
// How apps will use this
import { createSession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'

// In API route
const sessionCookie = await createSession(idToken, 'academy')
const cookieStore = await cookies()
cookieStore.set('session', sessionCookie, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 14,
  path: '/',
})
```

#### 2. Middleware Module (`src/middleware/`)

**File: `with-auth.ts`**

Extract from: `apps/editorial/src/lib/auth-helpers.ts` (requireAuth function)

Requirements:

- Function signature: `withAuth<T>(handler: AuthenticatedHandler<T>): NextRouteHandler`
- Read session cookie from request
- Verify session using `verifySession()`
- If valid: call handler with authenticated user
- If invalid: return `NextResponse.json({ error: 'Authentication required' }, { status: 401 })`
- Attach user object to handler context

Type definitions:

```typescript
type AuthenticatedHandler<T> = (
  request: NextRequest,
  context: { user: AuthenticatedUser; params?: T }
) => Promise<NextResponse> | NextResponse

type NextRouteHandler = (
  request: NextRequest,
  context?: { params?: unknown }
) => Promise<NextResponse>
```

**File: `with-role.ts`**

Extract from: `apps/editorial/src/lib/auth-helpers.ts` (requireRole function)

Requirements:

- Function signature: `withRole<T>(appName: AppName, minimumRole: string, handler: AuthenticatedHandler<T>): NextRouteHandler`
- First authenticate using `withAuth` logic
- Check app access using `checkAppAccess()` from helpers
- Verify role hierarchy using `hasRole()` from `@cenie/auth-utils`
- If insufficient permissions: return `NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })`
- Include current and required roles in error response

**Integration Pattern**:

```typescript
// In API route
import { withAuth, withRole } from '@cenie/auth-server/middleware'

export const GET = withAuth(async (request, { user }) => {
  // user is guaranteed to be authenticated
  return NextResponse.json({ user })
})

export const POST = withRole('academy', 'instructor', async (request, { user }) => {
  // user is guaranteed to be instructor or admin
  return NextResponse.json({ message: 'Course created' })
})
```

#### 3. Helper Functions Module (`src/helpers/`)

**File: `get-authenticated-user.ts`**

Extract from: `apps/editorial/src/lib/auth-helpers.ts` (getAuthenticatedUser function, lines 25-38)

Requirements:

- Function signature: `getAuthenticatedUser(): Promise<AuthenticatedUser | null>`
- Import `cookies` from `next/headers`
- Read 'session' cookie
- If no cookie: return null
- Verify session using `verifySession()`
- If invalid: return null
- Return AuthenticatedUser object with uid, email, role (default 'viewer'), session

**File: `check-app-access.ts`**

Extract from: `apps/editorial/src/lib/auth-helpers.ts` (checkEditorialAccess function, lines 44-80)

Requirements:

- Function signature: `checkAppAccess(userId: string, appName: AppName): Promise<AccessData>`
- Import `initializeAdminApp` from `@cenie/firebase/server`
- Query Firestore collection 'user_app_access':
  - `.where('userId', '==', userId)`
  - `.where('appName', '==', appName)`
  - `.where('isActive', '==', true)`
  - `.limit(1)`
- If no results: return `{ hasAccess: false, role: null, isActive: false }`
- If found: return `{ hasAccess: true, role: doc.role, isActive: doc.isActive }`
- Catch errors and log them, return `{ hasAccess: false, role: null, isActive: false }`

**File: `verify-token.ts`**

Extract from: `apps/hub/src/lib/auth-middleware.ts` (authenticateRequest function)

Requirements:

- Function signature: `verifyIdToken(token: string): Promise<DecodedIdToken>`
- Use Firebase Admin `auth.verifyIdToken(token)`
- Handle specific errors:
  - `auth/id-token-expired` → throw AuthenticationError with message 'Token expired'
  - `auth/invalid-id-token` → throw AuthenticationError with message 'Invalid token'
  - Other errors → throw AuthenticationError with message 'Token verification failed'
- Include token metadata in error (without exposing full token)

#### 4. Type Definitions (`src/types.ts`)

```typescript
import type { DecodedIdToken } from 'firebase-admin/auth'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

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

export interface SessionOptions {
  expiresIn?: number // milliseconds, default 14 days
}

export type AuthenticatedHandler<T = unknown> = (
  request: NextRequest,
  context: { user: AuthenticatedUser; params?: T }
) => Promise<NextResponse> | NextResponse

export type NextRouteHandler<T = unknown> = (
  request: NextRequest,
  context?: { params?: T }
) => Promise<NextResponse>
```

### Package Configuration

**`package.json`:**

```json
{
  "name": "@cenie/auth-server",
  "version": "0.0.1",
  "private": true,
  "description": "Server-side authentication utilities for CENIE platform",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./session": "./src/session/index.ts",
    "./middleware": "./src/middleware/index.ts",
    "./helpers": "./src/helpers/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .turbo node_modules dist"
  },
  "dependencies": {
    "@cenie/firebase": "workspace:*",
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*"
  },
  "peerDependencies": {
    "next": "^16.0.0",
    "firebase-admin": "^13.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

**`tsconfig.json`:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

### Testing Strategy

1. **Unit Tests** (create in `src/__tests__/`):
   - Test session creation with mock Firebase Admin
   - Test session verification with valid/invalid/expired cookies
   - Test role hierarchy enforcement
   - Test error cases (missing tokens, invalid credentials)

2. **Integration Tests**:
   - Verify Editorial continues working after code extraction
   - Test actual Firestore queries against test database
   - Test middleware composition (withAuth → withRole)

3. **Regression Testing**:
   - Run Editorial app locally
   - Sign in and verify session creation
   - Access protected routes
   - Test role-based access (editor, admin)
   - Ensure no functionality breaks

---

## PACKAGE 2: @cenie/auth-utils

### Purpose

Common authentication utilities shared across all apps and contexts (client + server).

### Location

`packages/auth-utils/`

### Directory Structure

```
packages/auth-utils/
├── src/
│   ├── roles/
│   │   ├── constants.ts
│   │   ├── hierarchy.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── access-control/
│   │   ├── check-access.ts
│   │   ├── grant-access.ts
│   │   ├── revoke-access.ts
│   │   ├── cache.ts
│   │   └── index.ts
│   ├── tokens/
│   │   ├── custom-claims.ts
│   │   ├── sync-claims.ts
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Detailed Requirements

#### 1. Role Management Module (`src/roles/`)

**File: `constants.ts`**

Requirements:

- Define all app roles as const objects
- Type-safe role definitions
- Export individual app role arrays and combined type

```typescript
export const APP_ROLES = {
  hub: ['user', 'admin'] as const,
  editorial: ['viewer', 'editor', 'admin'] as const,
  academy: ['student', 'instructor', 'admin'] as const,
  agency: ['client', 'manager', 'admin'] as const,
} as const

export const ROLE_HIERARCHY = {
  // Hub
  user: 1,

  // Editorial
  viewer: 1,
  editor: 2,

  // Academy
  student: 1,
  instructor: 2,

  // Agency
  client: 1,
  manager: 2,

  // Universal
  admin: 3,
} as const

export type RoleLevel = (typeof ROLE_HIERARCHY)[keyof typeof ROLE_HIERARCHY]
```

**File: `hierarchy.ts`**

Requirements:

- Function: `hasRole(userRole: string, requiredRole: string): boolean`
  - Look up both roles in ROLE_HIERARCHY
  - Return `userRoleLevel >= requiredRoleLevel`
  - If role not found, default to level 0
- Function: `getRoleLevel(role: string): number`
  - Return level from ROLE_HIERARCHY
  - Return 0 if role not found

**File: `types.ts`**

```typescript
import type { APP_ROLES } from './constants'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

export type HubRole = (typeof APP_ROLES.hub)[number]
export type EditorialRole = (typeof APP_ROLES.editorial)[number]
export type AcademyRole = (typeof APP_ROLES.academy)[number]
export type AgencyRole = (typeof APP_ROLES.agency)[number]

export type AppRole<T extends AppName> = T extends 'hub'
  ? HubRole
  : T extends 'editorial'
    ? EditorialRole
    : T extends 'academy'
      ? AcademyRole
      : T extends 'agency'
        ? AgencyRole
        : never

export type AnyRole = HubRole | EditorialRole | AcademyRole | AgencyRole
```

#### 2. Access Control Module (`src/access-control/`)

**File: `cache.ts`**

Requirements:

- Implement in-memory cache with TTL
- Cache structure: `Map<string, { data: AccessData, expiresAt: number }>`
- Cache key format: `${userId}:${appName}`
- Default TTL: 5 minutes (300,000 ms)
- Functions:
  - `getCached(userId, appName): AccessData | null`
  - `setCached(userId, appName, data, ttl?): void`
  - `clearCached(userId, appName): void`
  - `clearAllForUser(userId): void`
  - Background cleanup of expired entries (every minute)

**File: `check-access.ts`**

Requirements:

- Function: `checkUserAppAccess(userId: string, appName: AppName, firestore: Firestore): Promise<AccessData>`
- Check cache first using `getCached()`
- If cached and not expired: return cached data
- If not cached:
  - Query Firestore 'user_app_access' collection
  - Same query as in @cenie/auth-server
  - Cache result using `setCached()`
  - Return access data
- Log cache hits and misses for monitoring

**File: `grant-access.ts`**

Requirements:

- Function: `grantAccess(userId: string, appName: AppName, role: string, grantedBy: string | null, firestore: Firestore, auth: Auth): Promise<void>`
- Add record to Firestore 'user_app_access':

  ```typescript
  {
    userId,
    appName,
    role,
    isActive: true,
    grantedAt: admin.firestore.FieldValue.serverTimestamp(),
    grantedBy
  }
  ```

- Update custom claims using `syncCustomClaims(userId)`
- Clear cache using `clearCached(userId, appName)`
- Log access grant with all details

**File: `revoke-access.ts`**

Requirements:

- Function: `revokeAccess(userId: string, appName: AppName, firestore: Firestore, auth: Auth): Promise<void>`
- Find user's access record in Firestore
- Update: set `isActive = false`
- Update custom claims using `syncCustomClaims(userId)`
- Clear cache using `clearCached(userId, appName)`
- Log access revocation

#### 3. Tokens Module (`src/tokens/`)

**File: `custom-claims.ts`**

Requirements:

- Function: `updateCustomClaims(userId: string, claims: object, auth: Auth): Promise<void>`
- Use `auth.setCustomUserClaims(userId, claims)`
- Validate claims size (Firebase limit: 1KB)
- Throw error if claims too large
- Log custom claims update

**File: `sync-claims.ts`**

Requirements:

- Function: `syncCustomClaims(userId: string, firestore: Firestore, auth: Auth): Promise<void>`
- Query all active access records for user
- Build claims object:

  ```typescript
  {
    apps: ['hub', 'editorial'],  // Array of app names
    roles: {
      hub: 'user',
      editorial: 'editor'
    }
  }
  ```

- Call `updateCustomClaims()` with built claims
- This enables offline access checks from ID token

### Package Configuration

**`package.json`:**

```json
{
  "name": "@cenie/auth-utils",
  "version": "0.0.1",
  "private": true,
  "description": "Common authentication utilities for CENIE platform",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./roles": "./src/roles/index.ts",
    "./access-control": "./src/access-control/index.ts",
    "./tokens": "./src/tokens/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .turbo node_modules dist"
  },
  "dependencies": {
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*"
  },
  "peerDependencies": {
    "firebase-admin": "^13.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

---

## PACKAGE 3: @cenie/oauth-handlers

### Purpose

OAuth authentication flows (Google, Apple) with account linking support.

### Location

`packages/oauth-handlers/`

### Directory Structure

```
packages/oauth-handlers/
├── src/
│   ├── providers/
│   │   ├── google.ts
│   │   ├── apple.ts
│   │   ├── redirect.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── account-linking/
│   │   ├── handle-conflict.ts
│   │   ├── link-credential.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-oauth.tsx
│   │   ├── use-oauth-redirect.tsx
│   │   └── index.ts
│   ├── components/
│   │   ├── oauth-button.tsx
│   │   ├── oauth-error-handler.tsx
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Detailed Requirements

#### 1. Provider Handlers (`src/providers/`)

**File: `google.ts`**

Extract from: `apps/hub/src/hooks/use-oauth.ts` and `@cenie/firebase/src/auth/utils.ts` (signInWithGoogle function)

Requirements:

- Function: `signInWithGoogle(useRedirect?: boolean): Promise<OAuthResult>`
- Create `GoogleAuthProvider` instance
- Add scopes: 'profile', 'email'
- Set custom parameters: `{ prompt: 'select_account' }`
- If `useRedirect`:
  - Call `signInWithRedirect(auth, provider)`
  - Throw informational error (redirect initiated)
- If popup (default):
  - Call `signInWithPopup(auth, provider)`
  - Extract credential using `GoogleAuthProvider.credentialFromResult()`
  - Return OAuthResult with user, credential, isNewUser flag
- Handle errors using `handleOAuthError()`

**File: `apple.ts`**

Extract from: `@cenie/firebase/src/auth/utils.ts` (signInWithApple function, lines 174-213)

Requirements:

- Function: `signInWithApple(useRedirect?: boolean): Promise<OAuthResult>`
- Create `OAuthProvider('apple.com')` instance
- Add scopes: 'email', 'name'
- Set custom parameters: `{ locale: 'en' }`
- Same popup vs redirect logic as Google
- Extract credential using `OAuthProvider.credentialFromResult()`
- Return OAuthResult
- Handle errors using `handleOAuthError()`

**File: `redirect.ts`**

Extract from: `@cenie/firebase/src/auth/utils.ts` (getOAuthRedirectResult function, lines 218-249)

Requirements:

- Function: `getOAuthRedirectResult(): Promise<OAuthResult | null>`
- Call `getRedirectResult(auth)`
- If no result: return null
- Determine provider from result.providerId
- Extract appropriate credential (Google or Apple)
- Return OAuthResult with user, credential, isNewUser
- Handle errors using `handleOAuthError()`

**File: `types.ts`**

```typescript
import type { User, AuthCredential } from 'firebase/auth'

export interface OAuthResult {
  user: User
  credential: AuthCredential | null
  isNewUser: boolean
  additionalUserInfo?: {
    profile?: Record<string, unknown>
    providerId: string
    username?: string
  }
}

export interface OAuthError extends Error {
  code: string
  credential?: AuthCredential
  email?: string
}
```

**Helper: `handleOAuthError()`**

Extract from: `@cenie/firebase/src/auth/utils.ts` (lines 355-392)

Requirements:

- Function: `handleOAuthError(error: any, provider: string): OAuthError`
- Map Firebase error codes to user-friendly messages:
  - `auth/popup-blocked` → "Sign-in popup was blocked. Please allow popups."
  - `auth/popup-closed-by-user` → "Sign-in was cancelled."
  - `auth/cancelled-popup-request` → "Another sign-in popup is already open."
  - `auth/account-exists-with-different-credential` → "Account already exists with different credentials."
  - `auth/credential-already-in-use` → "This account is already linked."
  - `auth/operation-not-allowed` → "Sign-in not enabled. Contact support."
  - `auth/network-request-failed` → "Network error. Check connection."
  - `auth/too-many-requests` → "Too many attempts. Try again later."
  - `auth/user-disabled` → "Account disabled. Contact support."
- Include provider name in messages
- Preserve original error code and credential

#### 2. Account Linking Module (`src/account-linking/`)

**File: `handle-conflict.ts`**

Extract from: `@cenie/firebase/src/auth/utils.ts` (handleAccountExistsError function, lines 311-335)

Requirements:

- Function: `handleAccountExistsError(error: OAuthError): Promise<{ email: string, existingProviders: string[], pendingCredential: AuthCredential | null }>`
- Check error code is 'auth/account-exists-with-different-credential'
- Extract email from error
- Fetch existing sign-in methods using `fetchSignInMethodsForEmail()`
- Return email, existing providers, and pending credential
- This data is used to show user their options

**File: `link-credential.ts`**

Extract from: `@cenie/firebase/src/auth/utils.ts` (linkPendingCredential function, lines 340-350)

Requirements:

- Function: `linkPendingCredential(pendingCredential: AuthCredential): Promise<User>`
- Get current user from auth
- If no user: throw error "No authenticated user"
- Call `linkWithCredential(user, pendingCredential)`
- Return updated user
- This completes the account linking flow

#### 3. React Hooks (`src/hooks/`)

**File: `use-oauth.tsx`**

Extract from: `apps/hub/src/hooks/use-oauth.ts` (entire file, 247 lines)

Requirements:

- Hook: `useOAuth(options?: UseOAuthOptions)`
- State management:
  - `loading: boolean` - Overall loading state
  - `oauthLoading: 'google' | 'apple' | null` - Which provider is loading
  - `error: string | null` - Error message
  - `accountLinkingInfo: AccountLinkingInfo | null` - For conflict resolution
  - `successMessage: string | null` - Success feedback
- Functions:
  - `handleOAuthSuccess(result)` - Process successful OAuth
  - `signInWithGoogle()` - Initiate Google OAuth
  - `signInWithApple()` - Initiate Apple OAuth
  - `handleLinkAccount(existingProvider)` - Resolve account conflicts
  - `handleRetry()` - Retry after error
- After successful OAuth:
  - Get ID token from user
  - Call `/api/auth/oauth` endpoint (app-specific)
  - Handle response
  - Call `onSuccess` callback
  - Redirect to `redirectTo` path
- On error:
  - Check for account exists error
  - Extract account linking info
  - Show account linking UI
  - Call `onError` callback

```typescript
interface UseOAuthOptions {
  redirectTo?: string
  onSuccess?: (result: OAuthResult) => void
  onError?: (error: OAuthError) => void
}

interface AccountLinkingInfo {
  email: string
  existingProviders: string[]
  pendingCredential: AuthCredential
}
```

**File: `use-oauth-redirect.tsx`**

New hook for handling OAuth redirects:

Requirements:

- Hook: `useOAuthRedirect(options?: UseOAuthOptions)`
- On mount: check for redirect result
- If result found: call `handleOAuthSuccess()`
- If error: handle OAuth error
- Loading state while checking
- This hook is used on pages that handle OAuth redirects

#### 4. React Components (`src/components/`)

**File: `oauth-button.tsx`**

Requirements:

- Component: `<OAuthButton provider="google" | "apple" onClick={handler} loading={boolean}>`
- Styled button with provider logo
- Loading spinner when loading prop is true
- Disabled when loading
- Provider-specific colors:
  - Google: White background, blue text
  - Apple: Black background, white text
- Use `@cenie/ui` button component as base
- Include provider logo (SVG or icon)

**File: `oauth-error-handler.tsx`**

Extract from: `apps/hub/src/components/auth/oauth-error-handler.tsx` (173 lines)

Requirements:

- Component: `<OAuthErrorHandler error={OAuthError} accountLinkingInfo={...} onLinkAccount={fn} onRetry={fn} onContactSupport={fn}>`
- Display different UI based on error type:
  - Account exists: Show existing providers, link button
  - Popup blocked: Instructions to allow popups
  - Network error: Retry button
  - Generic error: Error message and support contact
- Account linking flow:
  - Show which provider user previously used
  - Button to sign in with existing provider
  - Button to link accounts
  - Explanation of account linking
- Styling matches app design
- Uses @cenie/ui components

### Package Configuration

**`package.json`:**

```json
{
  "name": "@cenie/oauth-handlers",
  "version": "0.0.1",
  "private": true,
  "description": "OAuth authentication handlers for CENIE platform",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./providers": "./src/providers/index.ts",
    "./hooks": "./src/hooks/index.ts",
    "./components": "./src/components/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .turbo node_modules dist"
  },
  "dependencies": {
    "@cenie/firebase": "workspace:*",
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*",
    "@cenie/ui": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "firebase": "^12.0.0",
    "next": "^16.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

---

## SUCCESS CRITERIA

### Functional Requirements

- [ ] All 3 packages build without errors
- [ ] TypeScript strict mode passes
- [ ] All exports properly configured and accessible
- [ ] Editorial app continues working (no regressions)
- [ ] Hub OAuth flows still functional
- [ ] Linting passes with zero warnings
- [ ] Type definitions complete and accurate

### Code Quality

- [ ] All code extracted from existing files (not rewritten)
- [ ] Consistent error handling using @cenie/errors
- [ ] Consistent logging using @cenie/logger
- [ ] No duplicate code between packages
- [ ] Proper separation of concerns

### Documentation

- [ ] Each package has comprehensive README.md
- [ ] All exported functions have JSDoc comments
- [ ] Type definitions include descriptions
- [ ] Usage examples in each package README

### Testing

- [ ] Editorial regression tests pass
- [ ] Hub regression tests pass
- [ ] Unit tests for core functions
- [ ] Integration tests for Firestore queries

---

## CRITICAL REMINDERS

1. **EXTRACT, DON'T RECREATE**: Copy code from Editorial and Hub source files. This is refactoring, not reimplementation.

2. **MAINTAIN COMPATIBILITY**: Editorial must continue working during and after extraction. Test frequently.

3. **USE EXISTING PACKAGES**:
   - Use `@cenie/errors` for ALL error handling
   - Use `@cenie/logger` for ALL logging
   - Use `@cenie/firebase` for Firebase SDK access
   - DO NOT create new error types or loggers

4. **TYPE SAFETY**: Full TypeScript strict mode. No `any` types except where absolutely necessary.

5. **NO BREAKING CHANGES**: These packages must be drop-in replacements for existing code.

6. **SESSION MANAGEMENT**: Editorial's session implementation is the gold standard. Copy it exactly.

7. **OAUTH COMPLEXITY**: Hub's OAuth flow handles many edge cases (popup blocked, account linking, etc.). Preserve all this logic.

8. **FIRESTORE QUERIES**: Access check queries must match Editorial's implementation exactly (same indexes, same filters).

---

## NEXT PHASE

After Phase 1A completion, these packages will be used in:

- Phase 2: Academy authentication implementation
- Phase 3: Agency authentication implementation
- Phase 4: Hub and Editorial refactoring to use these packages
