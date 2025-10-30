# Firebase Authentication Debugging Guide

## The Issue

You're seeing:

```
⚠ ./packages/firebase/src
Package firebase-admin can't be external
...
Request headers: { cookie: null, authorization: null }
Auth result: { hasSession: false, userId: undefined, userEmail: undefined }
Authentication failed: No session found
POST /api/books/.../investigate-translation 401
```

## Root Cause

**`firebase-admin` was not installed in the app directory.** When you mark a package as `serverExternalPackages` in Next.js, it needs to be installed **locally in that app**, not just in a workspace package.

## Fix Applied

### 1. Added `firebase-admin` to Editorial App

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

### 2. Improved Path Resolution

**File**: `packages/firebase/src/server.ts`

Updated to search multiple possible locations for `firebase-serviceaccount.json`:

- `apps/editorial/../../firebase-serviceaccount.json` (workspace root from app)
- `firebase-serviceaccount.json` (workspace root)
- From package location

## Testing Steps

### Step 1: Restart Dev Server

**Important**: Stop your current dev server and restart it to pick up the new dependencies.

```bash
# Kill the current server (Ctrl+C)
cd /Users/henry/Workbench/CENIE/platform/apps/editorial
pnpm dev
```

### Step 2: Test Sign-In Flow

1. **Navigate to sign-in page**:

   ```
   http://localhost:3001/sign-in
   ```

2. **Open Browser DevTools**:
   - Press `F12` or `Cmd+Option+I`
   - Go to **Network** tab
   - Check **Preserve log**

3. **Sign in** with your credentials

4. **Verify session creation**:
   - In Network tab, look for request to `/api/auth/session`
   - Status should be `200 OK`
   - Response should be `{"success": true}`

5. **Check cookie was created**:
   - Go to **Application** tab (or **Storage** in Firefox)
   - Expand **Cookies** → `http://localhost:3001`
   - Look for cookie named `session`
   - Value should be a long string (the session token)

### Step 3: Test API Route

1. **Navigate to books page**:

   ```
   http://localhost:3001/dashboard/books
   ```

2. **Click "Investigate Translation"** on any book

3. **Check the terminal output**:

   ```
   === INVESTIGATE TRANSLATION DEBUG ===
   Request headers: { cookie: "session=...", authorization: null }
   Auth result: { hasSession: true, userId: "...", userEmail: "..." }
   POST /api/books/.../investigate-translation 200 ✅
   ```

   The cookie should **NOT be null** anymore!

## Debugging Commands

### Check if firebase-admin is installed

```bash
cd /Users/henry/Workbench/CENIE/platform/apps/editorial
ls -la node_modules/firebase-admin
# Should show the directory exists
```

### Check if service account file exists

```bash
cd /Users/henry/Workbench/CENIE/platform
ls -la firebase-serviceaccount.json
# Should show the file
```

### Test Firebase Admin initialization

Create a test file `apps/editorial/test-firebase.js`:

```javascript
const { initializeAdminApp } = require('./node_modules/@cenie/firebase/src/server.ts')

try {
  const app = initializeAdminApp()
  console.log('✅ Firebase Admin initialized successfully')
  console.log('Project ID:', app.options.projectId)
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message)
}
```

Run it:

```bash
cd apps/editorial
node test-firebase.js
```

## Common Issues & Solutions

### Issue 1: "firebase-admin can't be external"

**Solution**: Make sure `firebase-admin` is in `apps/editorial/package.json` dependencies (already fixed).

```bash
cd apps/editorial
grep firebase-admin package.json
# Should output: "firebase-admin": "^13.5.0",
```

### Issue 2: Cookie is still null after sign-in

**Possible causes**:

1. **Session creation failed**:
   - Check browser Network tab for `/api/auth/session` request
   - Should return `{"success": true}`
   - If it fails, check server logs for errors

2. **Cookie not set due to domain mismatch**:
   - Make sure you're accessing via `localhost:3001`
   - Not via `127.0.0.1` or IP address

3. **Cookie expired or cleared**:
   - Clear all cookies and sign in again
   - Session cookies expire after 14 days

### Issue 3: "Firebase Admin credentials not found"

**Solution**: Ensure environment variables OR service account file exists.

**Option A** - Use service account file (current setup):

```bash
ls /Users/henry/Workbench/CENIE/platform/firebase-serviceaccount.json
```

**Option B** - Use environment variables:
Create `apps/editorial/.env.local`:

```bash
FIREBASE_PROJECT_ID=cenie-platform
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cenie-platform.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Issue 4: Session verified but still get 401

**Possible causes**:

1. **User doesn't have access to Editorial app**:

   ```
   Check Firestore: user_app_access collection
   Document should have: { userId: "...", appName: "editorial", isActive: true, role: "admin" or "editor" }
   ```

2. **Multiple Firebase projects**:
   - Ensure you're using the correct Firebase project
   - Check `firebase-serviceaccount.json` project_id matches your Firebase console

## Expected Flow (After Fix)

```
1. User visits /sign-in
   ↓
2. Signs in with Email/Google/Apple
   ↓
3. Client gets Firebase ID token
   ↓
4. POST /api/auth/session with { idToken }
   ↓
5. Server creates session cookie (14 days expiry)
   ↓
6. Cookie set in browser (httpOnly, secure, sameSite: lax)
   ↓
7. User redirected to /dashboard
   ↓
8. Any API request includes session cookie automatically
   ↓
9. API route calls getServerSession() → verifies cookie → gets user
   ↓
10. Request succeeds with 200 ✅
```

## Verification Checklist

- [ ] `firebase-admin` installed in `apps/editorial/node_modules`
- [ ] Dev server restarted after installing dependencies
- [ ] Can sign in successfully
- [ ] Session cookie created (visible in DevTools)
- [ ] API requests include cookie header (not null)
- [ ] `getServerSession()` returns user object (not null)
- [ ] API routes return 200 instead of 401

## Next Steps After Successful Testing

1. **Deploy to Vercel**:
   - Add `firebase-admin` to deployment
   - Set environment variables in Vercel dashboard
   - Test authentication in production

2. **Set up proper error handling**:
   - Better error messages for auth failures
   - Redirect to sign-in on 401 errors

3. **Add session refresh**:
   - Refresh session before it expires
   - Handle token revocation

## Still Having Issues?

If after following all steps you still see `cookie: null`:

1. **Clear browser cache and cookies completely**
2. **Try incognito/private browsing mode**
3. **Check if there are any ad-blockers or privacy extensions blocking cookies**
4. **Verify the session API route is working**:
   ```bash
   curl -X POST http://localhost:3001/api/auth/session \
     -H "Content-Type: application/json" \
     -d '{"idToken":"test"}'
   # Should see error about invalid token (meaning the route works)
   ```

## Logs to Check

**Terminal output should show**:

```
✓ Compiled /api/auth/session in XXXms
✓ Compiled /api/books/[id]/investigate-translation in XXXms
=== INVESTIGATE TRANSLATION DEBUG ===
Request headers: { cookie: "session=eyJhbGc...", authorization: null }
Auth result: { hasSession: true, userId: "abc123", userEmail: "user@example.com" }
POST /api/books/.../investigate-translation 200 in XXXms
```

**Browser Console should NOT show**:

- No CORS errors
- No cookie-related warnings
- No 401 errors

## Contact for Help

If you've followed all steps and still have issues, provide:

1. Terminal logs showing the error
2. Browser Network tab screenshot of the failing request
3. Browser Application tab screenshot showing cookies
4. Result of `pnpm list firebase-admin` from apps/editorial
