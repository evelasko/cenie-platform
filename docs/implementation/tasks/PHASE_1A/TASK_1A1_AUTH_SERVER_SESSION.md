# TASK 1A-1: Create @cenie/auth-server Session Module

**Phase**: 1A - Auth Packages  
**Duration**: 1 day  
**Dependencies**: None  
**Next Task**: TASK_1A2 (Middleware Module)

---

## OBJECTIVE

Extract Editorial's proven session management code into a shared package module that all apps can use for server-side session creation, verification, and clearing.

**What You're Building**: The session management foundation that Editorial already uses successfully.

**Why This Matters**: Editorial's 14-day httpOnly session cookies work perfectly. We need this same pattern for Academy and Agency, and Hub/Editorial will refactor to use this shared version.

---

## ARCHITECTURE CONTEXT

### Current Authentication Reality

Apps authenticate **directly with Firebase**, not through Hub:

```
User Browser → Firebase Auth → ID Token → App Server → Firestore (access check) → Session Cookie
```

**Session Flow**:

1. User authenticates with Firebase (email/password or OAuth)
2. Client gets ID token from Firebase
3. Client sends ID token to `/api/auth/session` endpoint
4. Server creates Firebase session cookie (14-day, httpOnly)
5. Server sets cookie in response
6. Future requests use session cookie (no Firebase client SDK needed)

### Why Session Cookies?

- **Security**: HttpOnly prevents XSS attacks
- **SSR**: Works with Next.js Server Components
- **Long-lived**: 14 days (better UX than 1-hour Firebase tokens)
- **Revocable**: Server can invalidate sessions

### Editorial's Implementation (Your Blueprint)

Editorial already does this perfectly in:

- `apps/editorial/src/app/api/auth/session/route.ts` - Session creation
- `apps/editorial/src/lib/auth-helpers.ts` - Session verification
- `@cenie/firebase/src/server.ts` - Firebase Admin utilities

**Your job**: Extract this into `@cenie/auth-server` package so all apps can use it.

---

## SOURCE FILES TO STUDY

**Read these files to understand the implementation:**

1. `apps/editorial/src/app/api/auth/session/route.ts`
   - Lines 8-50: POST handler (session creation)
   - Lines 56-70: DELETE handler (session clearing)
   - This is your primary reference

2. `apps/editorial/src/lib/auth-helpers.ts`
   - Lines 25-38: `getAuthenticatedUser()` (reads and verifies session)
   - Shows how sessions are used in API routes

3. `@cenie/firebase/src/server.ts`
   - Lines 96-125: `createSessionCookie()` function
   - Lines 127-143: `verifySessionCookie()` function
   - Lines 145-154: `getServerSession()` function
   - Lines 156-194: `createServerSession()` function
   - These are the Firebase Admin utilities you'll wrap

**DO NOT read the entire files** - focus on the line ranges specified above.

---

## WHAT TO BUILD

### Package Structure

Create this directory structure:

```
packages/auth-server/
├── src/
│   ├── session/
│   │   ├── create-session.ts
│   │   ├── verify-session.ts
│   │   ├── clear-session.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── types.ts (shared types)
│   └── index.ts (main package export)
├── package.json
├── tsconfig.json
└── README.md
```

---

## DETAILED REQUIREMENTS

### File 1: `src/session/types.ts`

**Purpose**: Type definitions for session management

```typescript
export interface SessionOptions {
  expiresIn?: number // milliseconds, default 14 days
}

export interface CreateSessionResult {
  success: boolean
  sessionCookie?: string
  error?: string
}
```

### File 2: `src/session/create-session.ts`

**Purpose**: Create a Firebase session cookie from an ID token

**Function Signature**:

```typescript
export async function createSession(
  idToken: string,
  appName: string,
  options?: SessionOptions
): Promise<string>
```

**Implementation Requirements**:

1. **Import Dependencies**:

   ```typescript
   import { initializeAdminApp } from '@cenie/firebase/server'
   import { AuthenticationError } from '@cenie/errors'
   import { createLogger } from '@cenie/logger'
   ```

2. **Validate Input**:
   - Throw `AuthenticationError` if `idToken` is empty
   - Validate `appName` is one of: 'hub', 'editorial', 'academy', 'agency'

3. **Calculate Expiration**:
   - Default: 14 days = `14 * 24 * 60 * 60 * 1000` milliseconds
   - Use `options.expiresIn` if provided
   - Firebase limit: max 2 weeks, enforce this

4. **Create Session Cookie**:
   - Get Firebase Admin app: `const adminApp = initializeAdminApp()`
   - Get auth instance: `const auth = adminApp.auth()`
   - Call: `const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })`
   - Handle errors:
     - If Firebase throws error, wrap in `AuthenticationError`
     - Include metadata: appName, expiresIn

5. **Logging**:
   - On success: Log with `logger.info('Session created', { appName, expiresIn })`
   - On failure: Log with `logger.error('Session creation failed', { error, appName })`
   - **Do NOT log the actual token or session cookie**

6. **Return**:
   - Return the session cookie string
   - Throw `AuthenticationError` if creation fails

**Reference Implementation**:
Look at `@cenie/firebase/src/server.ts` lines 96-125 for the pattern, but **simplify it** - you don't need all the console.log statements.

### File 3: `src/session/verify-session.ts`

**Purpose**: Verify a session cookie and return decoded token data

**Function Signature**:

```typescript
export async function verifySession(sessionCookie: string): Promise<DecodedIdToken | null>
```

**Implementation Requirements**:

1. **Import Dependencies**:

   ```typescript
   import { initializeAdminApp } from '@cenie/firebase/server'
   import type { DecodedIdToken } from 'firebase-admin/auth'
   import { createLogger } from '@cenie/logger'
   ```

2. **Validate Input**:
   - If `sessionCookie` is empty or null: return `null` (not an error)

3. **Verify Cookie**:
   - Get Firebase Admin: `const adminApp = initializeAdminApp()`
   - Get auth: `const auth = adminApp.auth()`
   - Call: `const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)`
     - The `true` parameter checks if session is revoked
   - **Error handling**:
     - If verification fails: return `null` (don't throw)
     - Log the failure reason but continue

4. **Return**:
   - Return `DecodedIdToken` if valid
   - Return `null` if invalid or expired

**Why return null instead of throwing?**

- Session checks happen on every request
- Expired sessions are normal, not errors
- Returning null lets caller decide how to handle (redirect to login, etc.)

**Reference Implementation**:
Look at `@cenie/firebase/src/server.ts` lines 127-143 and `apps/editorial/src/lib/auth-helpers.ts` lines 25-38.

### File 4: `src/session/clear-session.ts`

**Purpose**: Clear the session cookie (logout)

**Function Signature**:

```typescript
export async function clearSession(): Promise<void>
```

**Implementation Requirements**:

1. **Import Dependencies**:

   ```typescript
   import { cookies } from 'next/headers'
   ```

2. **Delete Cookie**:
   - Get cookie store: `const cookieStore = await cookies()`
   - Delete: `cookieStore.delete('session')`
   - No error if cookie doesn't exist

3. **No Logging Needed**: This is a simple operation

**Reference Implementation**:
Look at `apps/editorial/src/app/api/auth/session/route.ts` lines 56-70.

### File 5: `src/session/index.ts`

**Purpose**: Export all session functions

```typescript
export * from './create-session'
export * from './verify-session'
export * from './clear-session'
export * from './types'
```

### File 6: `src/types.ts` (Package-level types)

**Purpose**: Shared types for the entire auth-server package

```typescript
import type { DecodedIdToken } from 'firebase-admin/auth'
import type { NextRequest, NextResponse } from 'next/server'

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

// More types will be added in later tasks
```

### File 7: `src/index.ts` (Package main export)

**Purpose**: Main package entry point

```typescript
// Session management
export * from './session'

// Types
export type { AppName, AuthenticatedUser, AccessData } from './types'
```

**Note**: Middleware and helpers will be added in later tasks.

### File 8: `package.json`

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
    "./session": "./src/session/index.ts"
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

### File 9: `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### File 10: `README.md`

Create a comprehensive README with:

- Purpose of the package
- Installation (workspace package)
- API documentation for all 3 functions
- Usage examples
- Integration with apps

---

## STEP-BY-STEP IMPLEMENTATION INSTRUCTIONS

### Step 1: Create Package Structure (10 minutes)

```bash
# From workspace root
mkdir -p packages/auth-server/src/session

# Create files
touch packages/auth-server/src/session/types.ts
touch packages/auth-server/src/session/create-session.ts
touch packages/auth-server/src/session/verify-session.ts
touch packages/auth-server/src/session/clear-session.ts
touch packages/auth-server/src/session/index.ts
touch packages/auth-server/src/types.ts
touch packages/auth-server/src/index.ts
touch packages/auth-server/package.json
touch packages/auth-server/tsconfig.json
touch packages/auth-server/README.md
```

### Step 2: Create package.json and tsconfig.json (5 minutes)

Copy the JSON configurations from above exactly.

### Step 3: Implement Types (10 minutes)

- Implement `src/session/types.ts` (interface definitions)
- Implement `src/types.ts` (package-level types)

### Step 4: Implement create-session.ts (30 minutes)

1. Read `@cenie/firebase/src/server.ts` lines 96-125
2. Read `apps/editorial/src/app/api/auth/session/route.ts` lines 8-50
3. Extract the core logic (without the route wrapper)
4. Add proper error handling using `@cenie/errors`
5. Add logging using `@cenie/logger`
6. Keep it simple - don't copy all the console.log debugging statements

### Step 5: Implement verify-session.ts (20 minutes)

1. Read `@cenie/firebase/src/server.ts` lines 127-143
2. Extract the verification logic
3. Make it return null on failure (not throw)
4. Add minimal logging (just failures)

### Step 6: Implement clear-session.ts (10 minutes)

1. Read `apps/editorial/src/app/api/auth/session/route.ts` lines 56-70
2. Extract the cookie deletion logic
3. Very simple function

### Step 7: Create Index Files (5 minutes)

- Create `src/session/index.ts` with all exports
- Create `src/index.ts` with session exports

### Step 8: Install Dependencies (5 minutes)

```bash
cd packages/auth-server
pnpm install
```

### Step 9: Type Check (5 minutes)

```bash
pnpm --filter=@cenie/auth-server type-check
```

Fix any TypeScript errors.

### Step 10: Create README.md (30 minutes)

Document:

- What this package does
- API documentation with examples
- How apps use it

---

## TESTING REQUIREMENTS

### Test 1: Package Builds

```bash
pnpm --filter=@cenie/auth-server type-check
pnpm --filter=@cenie/auth-server lint
```

**Expected**: Zero errors, zero warnings.

### Test 2: Editorial Integration Test

**Modify Editorial to use the new package** (temporary test):

1. Open `apps/editorial/src/app/api/auth/session/route.ts`
2. Add import: `import { createSession } from '@cenie/auth-server/session'`
3. Replace session creation logic with: `const sessionCookie = await createSession(idToken, 'editorial')`
4. Test Editorial:
   ```bash
   pnpm --filter=@cenie/editorial dev
   ```
5. Go to http://localhost:3001/sign-in
6. Sign in with test credentials
7. Verify you can access dashboard
8. Check browser cookies (should have 'session' cookie)

**Expected**: Editorial works exactly as before.

**After testing**: You can leave the import there or revert - Editorial will fully migrate in Phase 4B.

### Test 3: Session Cookie Verification

Create a simple test in `apps/editorial/src/app/api/test-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }

  const decoded = await verifySession(sessionCookie.value)

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  return NextResponse.json({
    userId: decoded.uid,
    email: decoded.email,
  })
}
```

Test:

1. Sign in to Editorial
2. Visit http://localhost:3001/api/test-session
3. Should see your user ID and email

**After testing**: Delete this test route.

---

## SUCCESS CRITERIA

- [ ] Package structure created correctly
- [ ] All TypeScript files compile without errors
- [ ] Linting passes (zero warnings)
- [ ] `createSession()` function works (tested with Editorial)
- [ ] `verifySession()` function works (tested with test route)
- [ ] `clearSession()` function works (logout functionality)
- [ ] README.md is comprehensive
- [ ] Editorial still works perfectly (regression test)

---

## COMMON PITFALLS TO AVOID

1. **Don't recreate Firebase Admin initialization**: Use `initializeAdminApp()` from `@cenie/firebase/server`

2. **Don't throw errors on invalid sessions**: `verifySession()` should return `null`, not throw

3. **Don't add extra features**: Just extract what Editorial does, nothing more

4. **Don't skip testing**: Test with Editorial before marking complete

5. **Don't log sensitive data**: Never log tokens, session cookies, or passwords

---

## WHAT TO HAND OFF

When complete, provide:

- [ ] Git commit with new package
- [ ] Test results (screenshots or logs)
- [ ] Any issues encountered
- [ ] Confirmation Editorial still works

**Next Agent** (or same agent) will use this package in TASK_1A2 to build the middleware module.

---

## QUESTIONS TO RESOLVE

If you encounter these, ask for clarification:

1. **Firebase Admin initialization fails**: Check environment variables are set
2. **TypeScript errors on @cenie/firebase imports**: Run `pnpm install` at root
3. **Editorial breaks during testing**: Revert changes and review extraction
4. **Session cookie not being set**: Check Next.js cookies() API usage

---

## ESTIMATED TIME BREAKDOWN

- Setup: 30 minutes
- Implementation: 2 hours
- Testing: 1 hour
- Documentation: 1 hour
- **Total**: ~4-5 hours (one focused work day)

---

**Ready to build? Start with Step 1 and work through sequentially. Test frequently!**
