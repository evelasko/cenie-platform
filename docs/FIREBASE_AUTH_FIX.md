# Firebase Authentication Fix - Next.js 16 Monorepo

## Problem Summary

The Editorial app was throwing a **401 Authentication Error** when calling the `/api/books/[id]/investigate-translation` API route. The issues were:

1. **firebase-admin bundling error**: "Package firebase-admin can't be external"
2. **No session cookie**: Request headers showed `cookie: null`
3. **Authentication failure**: "No session found" in API routes

## Root Causes

### 1. Missing Next.js Configuration

Next.js 16 requires explicit configuration to mark server-only packages like `firebase-admin` as external (not to be bundled).

### 2. Missing Session Cookie Creation

The sign-in flow was only creating client-side Firebase authentication state but never created the server-side session cookie that API routes expect.

### 3. No Session API Endpoint

There was no API endpoint to create or delete server-side session cookies.

## Solutions Implemented

### 1. Installed firebase-admin Locally

**Critical**: `firebase-admin` must be installed in `apps/editorial/package.json`, not just in the workspace package.

**File**: `apps/editorial/package.json`

```json
{
  "dependencies": {
    "firebase-admin": "^13.5.0",
    "@cenie/supabase": "workspace:*"
    // ... other deps
  }
}
```

**Why**: When Next.js marks a package as `serverExternalPackages`, it expects the package to be resolvable from the app's `node_modules`. Just having it in a workspace package isn't enough.

### 2. Updated Next.js Configuration

**File**: `apps/editorial/next.config.js`

```javascript
const nextConfig = {
  // ... other config

  // Added transpilePackages for workspace packages
  transpilePackages: ['@cenie/ui', '@cenie/design-system', '@cenie/firebase', '@cenie/supabase'],

  // Mark firebase-admin as external (not to be bundled)
  serverExternalPackages: ['firebase-admin'],

  // Added Firebase environment variables
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  },
}
```

**Key Changes**:

- Added `serverExternalPackages: ['firebase-admin']` to prevent bundling
- Added workspace packages to `transpilePackages`
- Exposed Firebase environment variables to the Next.js app

### 2. Created Session API Endpoint

**File**: `apps/editorial/src/app/api/auth/session/route.ts`

Created a new API route to handle server-side session cookies:

```typescript
// POST /api/auth/session - Create session cookie
export async function POST(request: NextRequest) {
  const { idToken } = await request.json()
  const success = await createServerSession(idToken)
  return NextResponse.json({ success })
}

// DELETE /api/auth/session - Clear session cookie
export async function DELETE() {
  await clearServerSession()
  return NextResponse.json({ success: true })
}
```

### 3. Updated Sign-In Flow

**File**: `apps/editorial/src/app/sign-in/page.tsx`

Updated all sign-in methods (Email, Google, Apple) to create a server-side session cookie after successful authentication:

```typescript
// After Firebase authentication
const idToken = await result.user.getIdToken()

// Create server-side session cookie
const sessionResponse = await fetch('/api/auth/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken }),
})
```

### 4. Updated Sign-Out Flow

**Files**:

- `apps/editorial/src/components/layout/Navbar.tsx`
- `apps/editorial/src/app/dashboard/layout.tsx`

Updated sign-out handlers to clear the server-side session cookie:

```typescript
const handleSignOut = async () => {
  // Clear server-side session cookie
  await fetch('/api/auth/session', { method: 'DELETE' })

  // Sign out from Firebase client
  await signOut()

  router.push('/sign-in')
}
```

### 5. Enhanced Firebase Admin Initialization

**File**: `packages/firebase/src/server.ts`

Updated the Firebase Admin initialization to support multiple credential sources:

```typescript
export function initializeAdminApp() {
  // Priority order:
  // 1. FIREBASE_SERVICE_ACCOUNT_PATH environment variable
  // 2. Individual environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
  // 3. Default path: ../../firebase-serviceaccount.json
}
```

This provides flexibility for both development and production environments.

## How It Works Now

### Authentication Flow

1. **User signs in** (Email/Google/Apple) → Client-side Firebase authentication
2. **Get ID token** from Firebase Auth
3. **Create session cookie** via `/api/auth/session` POST request
4. **Session cookie stored** in browser (httpOnly, secure, sameSite: 'lax')
5. **API requests** automatically include the session cookie
6. **API routes verify** session using `getServerSession()` from `@cenie/firebase/server`

### Session Lifecycle

```
Sign In Flow:
Client Auth → Get ID Token → POST /api/auth/session → Set Cookie → Redirect

API Request Flow:
Browser → Cookie Header → API Route → getServerSession() → Verify → Process

Sign Out Flow:
DELETE /api/auth/session → Clear Cookie → Sign Out Client → Redirect
```

## Firebase Admin Credentials

The app supports multiple ways to provide Firebase Admin credentials:

### Option 1: Service Account File (Recommended for Development)

```bash
# Already present at project root
firebase-serviceaccount.json
```

### Option 2: Environment Variables (Recommended for Production)

```bash
FIREBASE_PROJECT_ID=cenie-platform
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cenie-platform.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Option 3: Custom Path

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceaccount.json
```

## Testing the Fix

1. **Start the dev server**:

   ```bash
   cd apps/editorial
   pnpm dev
   ```

2. **Sign in** at `/sign-in`
3. **Navigate to** `/dashboard/books`
4. **Click "Investigate Translation"** on any book
5. **Verify**: The API call should now succeed with a 200 status

## Key Files Modified

```
apps/editorial/
├── next.config.js                                    # Added serverExternalPackages
├── src/
│   ├── app/
│   │   ├── api/auth/session/route.ts               # NEW: Session API
│   │   ├── sign-in/page.tsx                        # Updated: Create session
│   │   └── dashboard/layout.tsx                     # Updated: Clear session
│   └── components/layout/Navbar.tsx                 # Updated: Clear session

packages/firebase/
└── src/server.ts                                     # Enhanced: Multi-source init
```

## Dependencies

All required dependencies are already installed via the workspace packages:

- `firebase-admin` → via `@cenie/firebase` (workspace package)
- `firebase` → Client-side SDK
- `@supabase/ssr` → For database operations

## Environment Variables Needed

Make sure these are set (in Vercel, `.env.local`, or deployment environment):

```bash
# Firebase (uses service account file in dev, env vars in prod)
FIREBASE_PROJECT_ID=cenie-platform

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-secret-key

# Google API
GOOGLE_API_KEY=your-api-key
```

## Next Steps

1. **Test the authentication flow** end-to-end
2. **Test API routes** that require authentication
3. **Deploy to Vercel** with environment variables configured
4. **Monitor** for any session-related issues

## Additional Notes

- Session cookies are **httpOnly** (not accessible via JavaScript)
- Session cookies are **secure** in production (HTTPS only)
- Session cookies use **sameSite: 'lax'** for CSRF protection
- Session cookies expire after **14 days**
- The middleware (`proxy.ts`) handles Supabase auth but doesn't interfere with Firebase session cookies
- API routes are excluded from the middleware matcher

## Troubleshooting

### If you still get 401 errors:

1. **Check if session cookie is created**:
   - Open browser DevTools → Application → Cookies
   - Look for a cookie named `session`

2. **Check API route headers**:
   - The debug logs should show `cookie: "session=..."`

3. **Verify Firebase Admin credentials**:
   - Check that `firebase-serviceaccount.json` exists at project root
   - Or verify environment variables are set correctly

4. **Clear cookies and sign in again**:
   - Sometimes old cookies can interfere

### If firebase-admin still can't be resolved:

1. **Verify the workspace package is installed**:

   ```bash
   pnpm list firebase-admin
   ```

2. **Rebuild the project**:
   ```bash
   pnpm clean
   pnpm install
   pnpm dev
   ```

## References

- [Next.js 16 serverExternalPackages](https://nextjs.org/docs/app/api-reference/next-config-js/serverExternalPackages)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Session Cookies](https://firebase.google.com/docs/auth/admin/manage-cookies)
