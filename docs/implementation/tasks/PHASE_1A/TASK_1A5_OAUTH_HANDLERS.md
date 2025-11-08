# TASK 1A-5: Create @cenie/oauth-handlers Package

**Phase**: 1A - Auth Packages  
**Duration**: 1 day  
**Dependencies**: TASK_1A1, 1A2, 1A3 (full auth-server package complete)  
**Next Task**: Phase 2 & 3 (Academy and Agency can now implement OAuth)

---

## OBJECTIVE

Extract Hub's comprehensive OAuth implementation (Google + Apple) into a shared package that all apps can use. This includes the complex account linking flow that handles edge cases when users try to sign in with different providers using the same email.

**What You're Building**: Production-ready OAuth with account linking, popup/redirect support, and excellent error handling.

**Why This Matters**: OAuth is complex with many edge cases (popup blocked, account exists, credential linking). Hub already handles all of this perfectly. Don't recreate - extract and reuse across all apps.

---

## ARCHITECTURE CONTEXT

### OAuth Flow Overview

**Simple Case** (90% of users):
```
User clicks "Sign in with Google"
  → Popup opens
  → User authorizes
  → Popup closes
  → User authenticated
  → Redirect to dashboard
```

**Complex Case** (10% of users - Account Linking):
```
User signs up with email: user@example.com
  → Later tries Google OAuth with same email
  → Firebase says "account exists with different credentials"
  → Show user: "Link your Google account to existing email account?"
  → User signs in with email first
  → Then links Google credential
  → Now user can use either method to sign in
```

**Hub handles both cases perfectly** - we're extracting this battle-tested code.

### OAuth Providers

**Google**:
- Scopes: profile, email
- Prompt: select_account (forces account picker)
- Redirect URI: Configured in Firebase Console

**Apple**:
- Scopes: email, name
- Locale: en
- Redirect URI: Configured in Firebase Console

Both support popup (desktop) and redirect (mobile) flows.

---

## SOURCE FILES TO STUDY

**Critical Source Files** (Hub's OAuth implementation):

1. `packages/firebase/src/auth/utils.ts`
   - Lines 130-169: `signInWithGoogle()` function
   - Lines 174-213: `signInWithApple()` function
   - Lines 218-249: `getOAuthRedirectResult()` function
   - Lines 254-306: `linkWithOAuthProvider()` function
   - Lines 311-335: `handleAccountExistsError()` function
   - Lines 340-350: `linkPendingCredential()` function
   - Lines 355-392: `handleOAuthError()` helper
   - **This file contains all OAuth logic**

2. `apps/hub/src/hooks/use-oauth.ts`
   - Entire file (247 lines) - React hook for OAuth flows
   - Manages state, handles errors, account linking UI
   - **This is the client-side coordinator**

3. `apps/hub/src/components/auth/oauth-error-handler.tsx`
   - Entire file (173 lines) - UI for account linking
   - Shows users their options when account conflict occurs
   - **This is the UX layer**

4. `apps/hub/src/app/api/auth/oauth/route.ts`
   - Lines 31-127: Server-side OAuth handler
   - Creates/updates user profile after OAuth success
   - Grants default Hub access

**Your job**: Extract all this OAuth code into a reusable package.

---

## WHAT TO BUILD

### Package Structure

```
packages/oauth-handlers/
├── src/
│   ├── providers/
│   │   ├── google.ts
│   │   ├── apple.ts
│   │   ├── redirect.ts
│   │   ├── error-handler.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── account-linking/
│   │   ├── handle-conflict.ts
│   │   ├── link-credential.ts
│   │   ├── link-with-provider.ts
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

---

## DETAILED REQUIREMENTS

### Module 1: Providers (`src/providers/`)

**File: `types.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 111-125:

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

**File: `google.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 130-169:

**Function**: `signInWithGoogle(useRedirect?: boolean): Promise<OAuthResult>`

**Requirements**:
1. Import Firebase Auth functions
2. Get Firebase auth instance using `getFirebaseAuth()` from `@cenie/firebase/client`
3. Create GoogleAuthProvider
4. Add scopes: 'profile', 'email'
5. Set custom parameters: `{ prompt: 'select_account' }`
6. If `useRedirect`:
   - Call `signInWithRedirect(auth, provider)`
   - Throw informational error: "Redirect initiated"
7. If popup (default):
   - Call `signInWithPopup(auth, provider)`
   - Extract credential from result
   - Return OAuthResult
8. Error handling: Use `handleOAuthError()` helper

**Copy the code exactly** from the source file - it's battle-tested.

**File: `apple.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 174-213:

**Function**: `signInWithApple(useRedirect?: boolean): Promise<OAuthResult>`

Same structure as Google, but:
- Use `OAuthProvider('apple.com')`
- Scopes: 'email', 'name'
- Custom parameters: `{ locale: 'en' }`

**Copy the code exactly** from source.

**File: `redirect.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 218-249:

**Function**: `getOAuthRedirectResult(): Promise<OAuthResult | null>`

**Purpose**: After OAuth redirect, get the result on page load

**Requirements**:
1. Call `getRedirectResult(auth)` from Firebase
2. If no result: return null
3. If result exists:
   - Determine provider (Google or Apple) from result.providerId
   - Extract appropriate credential
   - Return OAuthResult

**File: `error-handler.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 355-392:

**Function**: `handleOAuthError(error: any, provider: string): OAuthError`

**Purpose**: Convert Firebase error codes to user-friendly messages

**Map these errors**:
- `auth/popup-blocked` → "Sign-in popup was blocked. Please allow popups and try again."
- `auth/popup-closed-by-user` → "Sign-in was cancelled. Please try again."
- `auth/cancelled-popup-request` → "Another sign-in popup is already open."
- `auth/account-exists-with-different-credential` → "An account already exists with the same email address but different sign-in credentials."
- `auth/credential-already-in-use` → "This account is already linked to another user."
- `auth/operation-not-allowed` → "Sign-in is not enabled. Please contact support."
- `auth/network-request-failed` → "Network error. Please check your connection and try again."
- `auth/too-many-requests` → "Too many sign-in attempts. Please try again later."
- `auth/user-disabled` → "Your account has been disabled. Please contact support."

Include provider name in all messages.

**File: `index.ts`**

```typescript
export * from './google'
export * from './apple'
export * from './redirect'
export * from './error-handler'
export * from './types'
```

### Module 2: Account Linking (`src/account-linking/`)

**File: `handle-conflict.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 311-335:

**Function**: `handleAccountExistsError(error: OAuthError)`

**Purpose**: When account exists, extract the information needed to show user their options

**Returns**:
```typescript
{
  email: string
  existingProviders: string[]
  pendingCredential: AuthCredential | null
}
```

**Requirements**:
1. Check error code is 'auth/account-exists-with-different-credential'
2. Extract email from error
3. Call `fetchSignInMethodsForEmail()` to get existing providers
4. Return email, providers, and pending credential

**File: `link-credential.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 340-350:

**Function**: `linkPendingCredential(credential: AuthCredential): Promise<User>`

**Purpose**: After user signs in with existing method, link the new credential

**Requirements**:
1. Get current user from Firebase auth
2. Throw if no current user
3. Call `linkWithCredential(user, credential)`
4. Return updated user

**File: `link-with-provider.ts`**

Extract from `packages/firebase/src/auth/utils.ts` lines 254-306:

**Function**: `linkWithOAuthProvider(provider: 'google' | 'apple', useRedirect?: boolean)`

**Purpose**: Link an OAuth provider to existing account

This is for users who want to add Google/Apple login to their existing email account.

**File: `index.ts`**

```typescript
export * from './handle-conflict'
export * from './link-credential'
export * from './link-with-provider'
```

### Module 3: React Hooks (`src/hooks/`)

**File: `use-oauth.tsx`**

Extract from `apps/hub/src/hooks/use-oauth.ts` (entire file - 247 lines):

**Hook**: `useOAuth(options?: UseOAuthOptions)`

**State Management**:
```typescript
const [loading, setLoading] = useState(false)
const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
const [error, setError] = useState<string | null>(null)
const [accountLinkingInfo, setAccountLinkingInfo] = useState<AccountLinkingInfo | null>(null)
const [successMessage, setSuccessMessage] = useState<string | null>(null)
```

**Functions Returned**:
- `signInWithGoogle()` - Initiate Google OAuth
- `signInWithApple()` - Initiate Apple OAuth
- `handleLinkAccount(provider)` - Resolve account conflicts
- `handleRetry()` - Retry after error
- State: loading, oauthLoading, error, accountLinkingInfo, successMessage

**Critical Flow - After OAuth Success**:
1. Get ID token from Firebase user
2. Call `/api/auth/oauth` endpoint (POST request)
3. Send: provider, isNewUser, userData
4. Server creates profile and grants access
5. Redirect to dashboard

**Extract this file completely** - don't modify the logic, it handles many edge cases.

**File: `use-oauth-redirect.tsx`**

**Hook**: `useOAuthRedirect(options?: UseOAuthOptions)`

**Purpose**: Check for OAuth redirect result on page mount

**Requirements**:
```typescript
'use client'

import { useEffect } from 'react'
import { getOAuthRedirectResult } from '../providers/redirect'
import { useOAuth } from './use-oauth'

export function useOAuthRedirect(options?: UseOAuthOptions) {
  const oauth = useOAuth(options)
  
  useEffect(() => {
    async function checkRedirect() {
      try {
        const result = await getOAuthRedirectResult()
        
        if (result) {
          // Process OAuth result
          await oauth.handleOAuthSuccess(result)
        }
      } catch (error) {
        // Handle OAuth error
        oauth.handleOAuthError(error)
      }
    }
    
    checkRedirect()
  }, [])
  
  return oauth
}
```

**File: `index.ts`**

```typescript
export * from './use-oauth'
export * from './use-oauth-redirect'
```

### Module 4: Components (`src/components/`)

**File: `oauth-button.tsx`**

**Component**: `<OAuthButton provider="google" | "apple" onClick={handler} loading={boolean}>`

**Requirements**:
```typescript
'use client'

import { Button } from '@cenie/ui'
import type { ButtonProps } from '@cenie/ui'

interface OAuthButtonProps extends Omit<ButtonProps, 'onClick'> {
  provider: 'google' | 'apple'
  onClick: () => void
  loading?: boolean
}

export function OAuthButton({
  provider,
  onClick,
  loading = false,
  ...props
}: OAuthButtonProps) {
  const isGoogle = provider === 'google'
  
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      variant={isGoogle ? 'outline' : 'default'}
      className={isGoogle ? '' : 'bg-black text-white hover:bg-gray-900'}
      {...props}
    >
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {isGoogle ? (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              {/* Google logo SVG */}
              <path d="..." fill="#4285F4" />
            </svg>
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              {/* Apple logo SVG */}
              <path d="..." fill="currentColor" />
            </svg>
          )}
          Continue with {isGoogle ? 'Google' : 'Apple'}
        </>
      )}
    </Button>
  )
}
```

**Note**: Get actual SVG paths from Hub's implementation or use lucide-react icons.

**File: `oauth-error-handler.tsx`**

Extract from `apps/hub/src/components/auth/oauth-error-handler.tsx` (entire file - 173 lines):

**Component**: `<OAuthErrorHandler error={error} accountLinkingInfo={info} onLinkAccount={fn} onRetry={fn} onContactSupport={fn}>`

**Purpose**: Display different UI based on OAuth error type

**Error Types to Handle**:
1. **Account Exists**: Show link account UI
2. **Popup Blocked**: Instructions to allow popups
3. **Network Error**: Retry button
4. **Generic Errors**: Error message + support contact

**Extract the entire component** - it handles UX for all error scenarios.

**File: `index.ts`**

```typescript
export * from './oauth-button'
export * from './oauth-error-handler'
```

### Root Files

**File: `src/types.ts`**

Collect all OAuth types in one place:
```typescript
export type { OAuthResult, OAuthError } from './providers/types'

export interface UseOAuthOptions {
  redirectTo?: string
  onSuccess?: (result: OAuthResult) => void
  onError?: (error: OAuthError) => void
}

export interface AccountLinkingInfo {
  email: string
  existingProviders: string[]
  pendingCredential: AuthCredential
}
```

**File: `src/index.ts`**

```typescript
export * from './providers'
export * from './account-linking'
export * from './hooks'
export * from './components'
export * from './types'
```

### Package Configuration

**File: `package.json`**

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
    "./account-linking": "./src/account-linking/index.ts",
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
    "@types/react-dom": "^19.0.0",
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

**File: `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## STEP-BY-STEP IMPLEMENTATION

### Step 1: Create Package Structure (10 min)

```bash
mkdir -p packages/oauth-handlers/src/{providers,account-linking,hooks,components}
cd packages/oauth-handlers
```

Create all empty files from structure above.

### Step 2: Extract Provider Functions (1 hour)

1. Copy `signInWithGoogle()` from `packages/firebase/src/auth/utils.ts` to `src/providers/google.ts`
2. Copy `signInWithApple()` to `src/providers/apple.ts`
3. Copy `getOAuthRedirectResult()` to `src/providers/redirect.ts`
4. Copy `handleOAuthError()` to `src/providers/error-handler.ts`
5. Update imports to use `@cenie/firebase/client`
6. Ensure all types are exported

### Step 3: Extract Account Linking (30 min)

1. Copy `handleAccountExistsError()` to `src/account-linking/handle-conflict.ts`
2. Copy `linkPendingCredential()` to `src/account-linking/link-credential.ts`
3. Copy `linkWithOAuthProvider()` to `src/account-linking/link-with-provider.ts`

### Step 4: Extract React Hook (1 hour)

1. Copy entire `apps/hub/src/hooks/use-oauth.ts` to `src/hooks/use-oauth.tsx`
2. Update imports to use package providers
3. Ensure `useRouter` from `next/navigation` is imported
4. Keep all state management and logic exactly as is

### Step 5: Create OAuth Redirect Hook (30 min)

1. Implement `use-oauth-redirect.tsx` as specified above
2. This is new code (not extracted)
3. Coordinates with `use-oauth.tsx`

### Step 6: Extract OAuth Error Component (30 min)

1. Copy entire `apps/hub/src/components/auth/oauth-error-handler.tsx` to `src/components/oauth-error-handler.tsx`
2. Update imports to use `@cenie/ui`
3. Keep all UI logic the same

### Step 7: Create OAuth Button Component (30 min)

1. Implement `oauth-button.tsx` as specified above
2. Get Google/Apple logos from Hub or use icons
3. Style to match @cenie/ui button variants

### Step 8: Create Index Files & Configuration (20 min)

1. Create all `index.ts` files with proper exports
2. Create `package.json` and `tsconfig.json`
3. Run `pnpm install`

### Step 9: Type Check & Lint (15 min)

```bash
pnpm --filter=@cenie/oauth-handlers type-check
pnpm --filter=@cenie/oauth-handlers lint
```

Fix any errors.

---

## TESTING REQUIREMENTS

### Test 1: Verify Hub Still Works

**Critical Regression Test**:

1. Update Hub to use new package:
   - Open `apps/hub/src/hooks/use-oauth.ts`
   - Delete the file (or rename to `.backup`)
   - Update imports in pages to use `@cenie/oauth-handlers/hooks`

2. Test Hub OAuth:
   ```bash
   pnpm --filter=@cenie/hub dev
   ```

3. Go to http://localhost:3000/en/auth/signin

4. Test Google OAuth:
   - Click "Sign in with Google"
   - Should open popup
   - Authenticate
   - Should redirect to dashboard

5. Test Apple OAuth (if available):
   - Same flow with Apple

6. Test Account Linking (complex):
   - Sign out
   - Sign up with email: test@example.com
   - Sign out
   - Try Google OAuth with same email
   - Should show account linking dialog
   - Follow linking flow
   - Should succeed

**If Hub OAuth works perfectly**: Extraction was successful!

### Test 2: Provider Functions Directly

Create test route: `apps/hub/src/app/api/test-oauth-provider/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { signInWithGoogle } from '@cenie/oauth-handlers/providers'

export async function POST(request: NextRequest) {
  try {
    // This would be called from client, but we can test the export
    return NextResponse.json({
      message: 'OAuth providers exported correctly',
      available: ['google', 'apple'],
    })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

### Test 3: Error Handler Component

Create test page: `apps/hub/src/app/test-oauth-error/page.tsx`

```typescript
'use client'

import { OAuthErrorHandler } from '@cenie/oauth-handlers/components'
import { useState } from 'react'

export default function TestOAuthErrorPage() {
  const [showError, setShowError] = useState(false)
  
  const mockError = {
    code: 'auth/popup-blocked',
    message: 'Popup blocked',
  } as any
  
  return (
    <div className="p-8">
      <button onClick={() => setShowError(true)}>
        Show Error Handler
      </button>
      
      {showError && (
        <OAuthErrorHandler
          error={mockError}
          accountLinkingInfo={null}
          onRetry={() => console.log('Retry')}
          onLinkAccount={() => console.log('Link')}
          onContactSupport={() => console.log('Support')}
        />
      )}
    </div>
  )
}
```

Visit http://localhost:3000/test-oauth-error and verify component renders.

**After all tests**: Delete test files.

---

## SUCCESS CRITERIA

- [ ] Package builds without errors
- [ ] TypeScript strict mode passing
- [ ] Linting passes (zero warnings)
- [ ] All provider functions exported correctly
- [ ] Account linking functions work
- [ ] React hooks functional
- [ ] Components render correctly
- [ ] **Hub OAuth still works perfectly** (critical regression test)
- [ ] Package exports configured properly
- [ ] README with OAuth flow documentation

---

## COMMON PITFALLS

1. **Don't modify Hub's OAuth logic**: Extract exactly, don't "improve" it - it works perfectly

2. **Don't skip account linking**: This is complex but critical - many users will hit this

3. **Don't forget 'use client' directive**: Hooks and components need this

4. **Don't break Hub**: Test Hub OAuth frequently during extraction

5. **Don't hardcode Hub URLs**: The hook should be app-agnostic (it calls the app's own `/api/auth/oauth`)

---

## INTEGRATION NOTE

After this task:
- Academy (Phase 2) can add Google/Apple OAuth
- Agency (Phase 3) can add Google/Apple OAuth
- Hub can be refactored (Phase 4A) to use this package
- **Users can OAuth into any CENIE app** with consistent experience

---

## HANDOFF

When complete:
- [ ] Package fully functional
- [ ] Hub OAuth regression test passed
- [ ] All components and hooks working
- [ ] Documentation complete

**This completes Phase 1A!** All 3 auth packages are now ready.

**Next**: Academy (Phase 2) and Agency (Phase 3) can begin implementation using these packages.

---

**Estimated Time**: 6-8 hours

**Critical**: This is the most complex task in Phase 1A. Take your time, test thoroughly with Hub, and don't skip the account linking flow.

