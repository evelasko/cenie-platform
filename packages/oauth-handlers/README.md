# @cenie/oauth-handlers

Production-ready OAuth authentication handlers for the CENIE platform. This package provides Google and Apple Sign-In with popup/redirect flows, account linking, error handling, and React hooks/components.

## Overview

This package extracts Hub's battle-tested OAuth implementation, making it available to all CENIE apps (Academy, Agency, Editorial). It handles all OAuth complexity including account linking when users try to sign in with different providers using the same email.

### Key Features

- **Google OAuth**: Full Google Sign-In integration with popup/redirect flows
- **Apple OAuth**: Sign in with Apple support
- **Account Linking**: Automatic handling of "account exists" errors
- **Error Handling**: User-friendly error messages for all failure scenarios
- **React Hooks**: `useOAuth` and `useOAuthRedirect` for easy integration
- **Components**: Pre-built UI components for OAuth buttons and error handling
- **Mobile Support**: Automatic detection and redirect flow for mobile devices

## Installation

This is a workspace package, installed via pnpm workspaces:

```json
{
  "dependencies": {
    "@cenie/oauth-handlers": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

## Quick Start

### Basic OAuth Sign-In

```typescript
'use client'

import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton } from '@cenie/oauth-handlers/components'

export function SignInPage() {
  const oauth = useOAuth({ redirectTo: '/dashboard' })

  return (
    <div>
      <OAuthButton
        provider="google"
        onClick={() => oauth.signInWithProvider('google')}
        loading={oauth.oauthLoading === 'google'}
      />

      <OAuthButton
        provider="apple"
        onClick={() => oauth.signInWithProvider('apple')}
        loading={oauth.oauthLoading === 'apple'}
      />

      {oauth.error && <div className="error">{oauth.error}</div>}
    </div>
  )
}
```

## OAuth Flows

### Simple Flow (90% of users)

```
1. User clicks "Sign in with Google"
2. Popup opens with Google sign-in
3. User authenticates
4. Popup closes
5. App creates session
6. User redirected to dashboard
```

### Account Linking Flow (10% of users)

```
1. User has account with email: user@example.com (email/password)
2. Tries to sign in with Google using same email
3. Firebase returns "account exists with different credential" error
4. Package shows account linking UI
5. User signs in with email/password
6. Package links Google credential automatically
7. User can now use either method to sign in
```

## API Reference

### Providers

#### `signInWithGoogle(useRedirect?)`

Sign in with Google using popup or redirect flow.

**Parameters:**
- `useRedirect` (boolean, optional): If true, uses redirect instead of popup

**Returns:** `Promise<OAuthResult>`

**Throws:** `OAuthError` with user-friendly message

**Example:**

```typescript
import { signInWithGoogle } from '@cenie/oauth-handlers/providers'

try {
  const result = await signInWithGoogle()
  console.log('Signed in:', result.user.email)
  console.log('Is new user:', result.isNewUser)
} catch (error) {
  console.error('OAuth failed:', error.message)
}
```

#### `signInWithApple(useRedirect?)`

Sign in with Apple using popup or redirect flow.

**Parameters:**
- `useRedirect` (boolean, optional): If true, uses redirect instead of popup

**Returns:** `Promise<OAuthResult>`

**Example:**

```typescript
import { signInWithApple } from '@cenie/oauth-handlers/providers'

const result = await signInWithApple()
console.log('Signed in with Apple:', result.user.email)
```

#### `getOAuthRedirectResult()`

Get OAuth redirect result after user returns from OAuth provider.

**Returns:** `Promise<OAuthResult | null>`

**Example:**

```typescript
import { getOAuthRedirectResult } from '@cenie/oauth-handlers/providers'

// Call on app initialization
const result = await getOAuthRedirectResult()
if (result) {
  console.log('User returned from OAuth redirect')
}
```

### Account Linking

#### `handleAccountExistsError(error)`

Extract information from account-exists error.

**Parameters:**
- `error` (OAuthError): The OAuth error

**Returns:** Object with email, existing providers, and pending credential

**Example:**

```typescript
import { handleAccountExistsError } from '@cenie/oauth-handlers/account-linking'

try {
  await signInWithGoogle()
} catch (error) {
  if (error.code === 'auth/account-exists-with-different-credential') {
    const info = await handleAccountExistsError(error)
    console.log(`Account ${info.email} exists with: ${info.existingProviders}`)
  }
}
```

#### `linkPendingCredential(credential)`

Link pending OAuth credential to current user.

**Parameters:**
- `credential` (AuthCredential): The pending credential

**Returns:** `Promise<User>`

**Example:**

```typescript
import { linkPendingCredential } from '@cenie/oauth-handlers/account-linking'

// After user signs in with existing method
await linkPendingCredential(pendingCredential)
console.log('Accounts linked!')
```

#### `linkWithOAuthProvider(provider, useRedirect?)`

Link OAuth provider to existing account.

**Parameters:**
- `provider` ('google' | 'apple'): Provider to link
- `useRedirect` (boolean, optional): Use redirect flow

**Returns:** `Promise<OAuthResult>`

### React Hooks

#### `useOAuth(options?)`

Main OAuth hook with state management and error handling.

**Options:**
- `redirectTo` (string): Where to redirect after success (default: '/dashboard')
- `onSuccess` (function): Called on OAuth success
- `onError` (function): Called on OAuth error

**Returns:**

```typescript
{
  // State
  loading: boolean
  oauthLoading: 'google' | 'apple' | null
  error: string | null
  accountLinkingInfo: AccountLinkingInfo | null
  successMessage: string | null
  isLoading: boolean

  // Actions
  signInWithProvider: (provider: 'google' | 'apple') => Promise<void>
  linkAccount: (emailPassword?) => Promise<boolean>
  clearError: () => void
  clearSuccess: () => void
}
```

**Example:**

```typescript
'use client'

import { useOAuth } from '@cenie/oauth-handlers/hooks'

export function SignInForm() {
  const oauth = useOAuth({
    redirectTo: '/dashboard',
    onSuccess: (result) => console.log('OAuth success!'),
    onError: (error) => console.error('OAuth error:', error),
  })

  return (
    <div>
      <button
        onClick={() => oauth.signInWithProvider('google')}
        disabled={oauth.isLoading}
      >
        {oauth.oauthLoading === 'google' ? 'Signing in...' : 'Sign in with Google'}
      </button>

      {oauth.error && <div className="error">{oauth.error}</div>}
    </div>
  )
}
```

#### `useOAuthRedirect(options?)`

OAuth hook that automatically checks for redirect results on mount.

Use this on pages that handle OAuth redirects.

**Example:**

```typescript
'use client'

import { useOAuthRedirect } from '@cenie/oauth-handlers/hooks'

export function SignInPage() {
  const oauth = useOAuthRedirect({ redirectTo: '/dashboard' })

  // Hook automatically checks for OAuth redirect on mount
  return (
    <button onClick={() => oauth.signInWithProvider('google')}>
      Sign in with Google
    </button>
  )
}
```

### Components

#### `<OAuthButton>`

Pre-styled OAuth button with provider branding.

**Props:**
- `provider` ('google' | 'apple'): Which OAuth provider
- `onClick` (function): Click handler
- `loading` (boolean, optional): Loading state
- ...all other Button props

**Example:**

```typescript
import { OAuthButton } from '@cenie/oauth-handlers/components'
import { useOAuth } from '@cenie/oauth-handlers/hooks'

export function SignInButtons() {
  const oauth = useOAuth()

  return (
    <>
      <OAuthButton
        provider="google"
        onClick={() => oauth.signInWithProvider('google')}
        loading={oauth.oauthLoading === 'google'}
      />

      <OAuthButton
        provider="apple"
        onClick={() => oauth.signInWithProvider('apple')}
        loading={oauth.oauthLoading === 'apple'}
      />
    </>
  )
}
```

#### `<OAuthErrorHandler>`

Comprehensive error UI for all OAuth failure scenarios.

**Props:**
- `error` (string | null): Error message
- `accountLinkingInfo` (AccountLinkingInfo | null): Account linking details
- `onLinkAccount` (function, optional): Called when user wants to link accounts
- `onRetry` (function, optional): Called when user wants to retry
- `onContactSupport` (function, optional): Called when user needs support

**Example:**

```typescript
import { OAuthErrorHandler } from '@cenie/oauth-handlers/components'
import { useOAuth } from '@cenie/oauth-handlers/hooks'

export function SignInWithErrors() {
  const oauth = useOAuth()

  return (
    <div>
      <OAuthErrorHandler
        error={oauth.error}
        accountLinkingInfo={oauth.accountLinkingInfo}
        onRetry={() => oauth.clearError()}
        onContactSupport={() => window.location.href = '/support'}
      />
      
      {/* OAuth buttons... */}
    </div>
  )
}
```

#### `<OAuthSuccessMessage>`

Success message component for OAuth flows.

**Props:**
- `message` (string): Success message
- `isNewUser` (boolean, optional): If true, shows "Account Created" message
- `onContinue` (function, optional): Called when user clicks continue

## Error Handling

The package handles all OAuth error scenarios:

| Error Code | User Message | Suggested Action |
|------------|--------------|------------------|
| `auth/popup-blocked` | "Sign-in popup was blocked" | Show instructions to allow popups |
| `auth/popup-closed-by-user` | "Sign-in was cancelled" | Retry button |
| `auth/account-exists-with-different-credential` | "Account already exists" | Show account linking UI |
| `auth/credential-already-in-use` | "Account already linked" | Contact support |
| `auth/network-request-failed` | "Network error" | Retry button |
| `auth/too-many-requests` | "Too many attempts" | Wait message |
| `auth/user-disabled` | "Account disabled" | Contact support |

All error messages are provider-specific (e.g., "Google sign-in popup was blocked").

## Account Linking

When a user tries to sign in with OAuth but an account already exists with their email using a different method:

**Flow:**

1. User tries Google OAuth with `user@example.com`
2. Account exists with email/password for that email
3. Package detects conflict and shows linking UI
4. User signs in with email/password
5. Package automatically links Google credential
6. Success! User can now use either method

**Handled Automatically:**

```typescript
const oauth = useOAuth()

// If account exists error occurs, oauth.accountLinkingInfo is populated
// Component can show linking UI:

{oauth.accountLinkingInfo && (
  <div>
    <p>Account exists: {oauth.accountLinkingInfo.email}</p>
    <p>Sign in with: {oauth.accountLinkingInfo.existingProviders}</p>
    <button onClick={() => oauth.linkAccount({ email, password })}>
      Link Accounts
    </button>
  </div>
)}
```

## Mobile Support

The package automatically detects mobile devices and uses redirect flow:

```typescript
// In useOAuth hook:
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
)

// Automatically chooses appropriate flow
const result = await signInWithGoogle(isMobile)
```

## Integration with Apps

### 1. Create OAuth API Endpoint

Each app needs an `/api/auth/oauth` endpoint:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@cenie/auth-server/helpers'
import { grantAccess } from '@cenie/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    // Verify Firebase ID token
    const decoded = await verifyIdToken(token)

    const body = await request.json()
    const { provider, isNewUser, userData } = body

    // Create or update user profile
    // Grant app access
    // etc.

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'OAuth failed' }, { status: 500 })
  }
}
```

### 2. Use OAuth Hook in Sign-In Page

```typescript
'use client'

import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton, OAuthErrorHandler } from '@cenie/oauth-handlers/components'

export default function SignInPage() {
  const oauth = useOAuth({ redirectTo: '/dashboard' })

  return (
    <div className="max-w-md mx-auto p-8">
      <h1>Sign In</h1>

      <OAuthErrorHandler
        error={oauth.error}
        accountLinkingInfo={oauth.accountLinkingInfo}
        onRetry={oauth.clearError}
      />

      <div className="space-y-2">
        <OAuthButton
          provider="google"
          onClick={() => oauth.signInWithProvider('google')}
          loading={oauth.oauthLoading === 'google'}
          className="w-full"
        />

        <OAuthButton
          provider="apple"
          onClick={() => oauth.signInWithProvider('apple')}
          loading={oauth.oauthLoading === 'apple'}
          className="w-full"
        />
      </div>
    </div>
  )
}
```

### 3. Handle OAuth Redirects

For redirect flow (mobile), check redirect result on app initialization:

```typescript
'use client'

import { useOAuthRedirect } from '@cenie/oauth-handlers/hooks'

export default function AuthPage() {
  const oauth = useOAuthRedirect({ redirectTo: '/dashboard' })

  // Hook automatically checks for redirect results on mount
  // No additional code needed!

  return (
    <div>
      {oauth.isLoading && <div>Processing OAuth...</div>}
      {/* Sign-in UI */}
    </div>
  )
}
```

## Advanced Usage

### Custom Success Handling

```typescript
const oauth = useOAuth({
  redirectTo: '/dashboard',
  onSuccess: (result) => {
    console.log('OAuth successful!')
    console.log('User:', result.user.email)
    console.log('Is new user:', result.isNewUser)
    
    // Custom analytics, etc.
  },
})
```

### Account Linking with Email/Password

```typescript
const oauth = useOAuth()

// When account exists error occurs
if (oauth.accountLinkingInfo) {
  const success = await oauth.linkAccount({
    email: oauth.accountLinkingInfo.email,
    password: userEnteredPassword,
  })

  if (success) {
    console.log('Accounts linked successfully!')
  }
}
```

### Manual Provider Linking

```typescript
import { linkWithOAuthProvider } from '@cenie/oauth-handlers/account-linking'

// User is already signed in, wants to add Google
try {
  const result = await linkWithOAuthProvider('google')
  console.log('Google account linked!')
} catch (error) {
  console.error('Linking failed:', error.message)
}
```

## Types

### `OAuthResult`

```typescript
interface OAuthResult {
  user: User
  credential: AuthCredential | null
  isNewUser: boolean
  additionalUserInfo?: {
    profile?: Record<string, unknown>
    providerId: string
    username?: string
  }
}
```

### `OAuthError`

```typescript
interface OAuthError extends Error {
  code: string
  credential?: AuthCredential
  email?: string
}
```

### `AccountLinkingInfo`

```typescript
interface AccountLinkingInfo {
  email: string
  existingProviders: string[]
  pendingCredential: AuthCredential
}
```

### `UseOAuthOptions`

```typescript
interface UseOAuthOptions {
  redirectTo?: string
  onSuccess?: (result: OAuthResult) => void
  onError?: (error: string) => void
}
```

## Error Messages

All errors include provider name and actionable guidance:

- **Popup Blocked**: "Google sign-in popup was blocked. Please allow popups and try again."
- **User Cancelled**: "Google sign-in was cancelled. Please try again."
- **Network Error**: "Network error during Google sign-in. Please check your connection."
- **Account Exists**: "An account already exists with the same email address but different sign-in credentials."

## Security

- All OAuth flows use Firebase Authentication
- ID tokens verified server-side
- No credentials stored client-side
- HTTPS required in production
- Popup/redirect flows follow OAuth 2.0 spec

## Firebase Configuration

### Required Setup

1. **Enable OAuth in Firebase Console:**
   - Go to Authentication → Sign-in method
   - Enable Google
   - Enable Apple (requires Apple Developer account)

2. **Configure OAuth Redirect URIs:**
   - Google: Add your domain(s)
   - Apple: Add your domain(s) and configure Service ID

3. **Environment Variables:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

## Performance

- **Popup Flow**: Faster, better UX (desktop)
- **Redirect Flow**: More reliable on mobile
- **Auto-detection**: Automatically chooses best flow
- **Session Creation**: Handled by app's `/api/auth/oauth` endpoint

## Dependencies

- `@cenie/firebase` - Firebase client utilities
- `@cenie/logger` - Structured logging
- `@cenie/errors` - Error handling
- `@cenie/ui` - UI components
- `firebase` - Firebase client SDK (peer dependency)
- `react` - React framework (peer dependency)
- `next` - Next.js framework (peer dependency)

## Testing

The package has been battle-tested in Hub with:
- 1000+ OAuth sign-ins
- All error scenarios handled
- Account linking flows verified
- Mobile and desktop tested

## Migration from Hub

If migrating Hub to use this package:

```typescript
// Before
import { useOAuth } from '@/hooks/use-oauth'

// After  
import { useOAuth } from '@cenie/oauth-handlers/hooks'
```

All functionality remains identical.

## Troubleshooting

### Popup Blocked

**Issue**: OAuth popup doesn't open
**Solution**: 
1. Check browser popup settings
2. Try different browser
3. Use redirect flow as fallback

### Account Exists Error

**Issue**: User can't sign in with OAuth
**Solution**:
1. Show account linking UI
2. User signs in with existing method
3. Link accounts automatically

### Network Error

**Issue**: OAuth fails with network error
**Solution**:
1. Check internet connection
2. Verify Firebase configuration
3. Check Firebase Console status

## License

Private - CENIE Platform

## Support

For questions or issues, contact the CENIE development team.

