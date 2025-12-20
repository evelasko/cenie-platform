# Agency Authentication Testing Guide

## Quick Start

### 1. Start the Development Server

```bash
cd /Users/henry/Workbench/CENIE/platform
pnpm dev --filter @cenie/agency
```

The app will be available at: **<http://localhost:3003>**

### 2. Initial Test - Sign Up

1. Navigate to <http://localhost:3003/sign-up>
2. Create a new account:
   - **Email/Password**: Enter email and password
   - **OAuth**: Click Google or Apple button
3. After successful signup:
   - Should auto-grant `client` role
   - Should redirect to `/dashboard`
   - Should see client dashboard

### 3. Test Sign In

1. Sign out from dashboard
2. Navigate to <http://localhost:3003/sign-in>
3. Sign in with your credentials
4. Should redirect to `/dashboard`

### 4. Test Client Dashboard

**URL**: <http://localhost:3003/dashboard>

**Expected Behavior**:

- Shows 4 stats cards (all 0 initially)
- Shows "My Projects" section with empty state
- Shows "Recent Activity" section
- Navigation shows:
  - Dashboard
  - My Projects
  - Browse Templates
  - Profile (if implemented)

**Navigation Should NOT Show**:

- Manage Templates
- Clients
- Admin

### 5. Test Protected Routes

**Try accessing without authentication**:

- <http://localhost:3003/dashboard> → Should redirect to `/sign-in`
- <http://localhost:3003/projects> → Should redirect to `/sign-in`
- <http://localhost:3003/my-templates> → Should redirect to `/sign-in`

**Public routes (should work without auth)**:

- <http://localhost:3003/> → Home page
- <http://localhost:3003/templates> → Template browsing
- <http://localhost:3003/sign-in> → Sign in page
- <http://localhost:3003/sign-up> → Sign up page

### 6. Test Manager Role

#### Grant Manager Role in Firestore

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Find collection: `user_app_access`
4. Find or create document for your user:

```json
{
  "userId": "YOUR_USER_UID",
  "appName": "agency",
  "role": "manager",
  "isActive": true,
  "grantedAt": "2025-11-09T00:00:00.000Z",
  "grantedBy": null
}
```

5. Sign out and sign in again
6. Should now see manager navigation links

#### Test Manager Dashboard

**URL**: <http://localhost:3003/dashboard/templates>

**Expected Behavior**:

- Shows "Manage Templates" page
- Shows 4 stats cards for managers
- Shows "Create Template" button
- Empty state for templates

**URL**: <http://localhost:3003/dashboard/templates/new>

**Expected Behavior**:

- Shows template creation form
- Fields: Name, Description, Category, Estimated Time, Complexity
- Cancel and Create buttons

**URL**: <http://localhost:3003/dashboard/clients>

**Expected Behavior**:

- Shows "Client Management" page
- Shows 4 stats cards
- Empty state for clients

**Navigation Should Show**:

- Dashboard
- My Projects
- Browse Templates
- **Manage Templates** (new)
- **Clients** (new)

### 7. Test Session Persistence

1. Sign in
2. Close browser
3. Reopen browser
4. Navigate to <http://localhost:3003/dashboard>
5. Should still be signed in (session cookie persists)

### 8. Test Sign Out

1. Click "Sign Out" button in navigation
2. Should:
   - Clear session cookie
   - Sign out from Firebase
   - Redirect to `/sign-in`
3. Try accessing `/dashboard`
4. Should redirect to `/sign-in`

## API Testing

### Test Session Creation

```bash
# Get ID token from Firebase (sign in first, then get from browser devtools)
curl -X POST http://localhost:3003/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_ID_TOKEN"}'

# Expected response:
# {"success":true}
```

### Test Access Check

```bash
curl http://localhost:3003/api/users/apps/agency/access \
  -H "Authorization: Bearer YOUR_ID_TOKEN"

# Expected response:
# {
#   "hasAccess": true,
#   "role": "client",
#   "userId": "...",
#   "appName": "agency"
# }
```

### Test Session Deletion

```bash
curl -X DELETE http://localhost:3003/api/auth/session

# Expected response:
# {"success":true}
```

## Common Issues & Solutions

### Issue: "You do not have access to Agency"

**Solution**: The access check is failing. Check:

1. Firebase ID token is valid
2. User exists in Firebase Auth
3. Firestore is accessible
4. Network connection to Firebase

### Issue: Redirect loop on sign-in

**Solution**: Session creation failed. Check:

1. Browser console for errors
2. Network tab for API failures
3. Firebase service account credentials
4. Server logs

### Issue: Can't access manager routes as manager

**Solution**:

1. Verify role in Firestore is `"manager"` not `"manager "` (no spaces)
2. Sign out and sign in again to refresh session
3. Check browser console for role value
4. Verify `appName` is `"agency"` in Firestore

### Issue: Session expires immediately

**Solution**:

1. Check server time is correct
2. Verify `maxAge` in session cookie settings
3. Check browser cookie settings
4. Try clearing all cookies and signing in again

### Issue: OAuth doesn't work

**Solution**:

1. Check Firebase Console → Authentication → Sign-in method
2. Verify Google/Apple OAuth is enabled
3. Check authorized domains include `localhost`
4. Verify OAuth redirect URIs are configured

## Browser DevTools Checks

### Check Session Cookie

1. Open DevTools → Application → Cookies
2. Look for cookie named `session`
3. Should have:
   - `HttpOnly`: true
   - `Secure`: false (in dev) / true (in prod)
   - `SameSite`: Lax
   - Expiration: ~14 days from creation

### Check Firebase Auth State

```javascript
// In browser console
firebase.auth().currentUser
// Should show user object when signed in
// Should be null when signed out
```

### Check Network Requests

1. Open DevTools → Network
2. Sign in
3. Look for:
   - `/api/users/apps/agency/access` → 200 OK
   - `/api/auth/session` → 200 OK
4. Check response bodies for expected data

## Test Checklist

- [ ] Sign up with email/password works
- [ ] Sign up with Google OAuth works (if configured)
- [ ] Sign in with email/password works
- [ ] Sign in with Google OAuth works (if configured)
- [ ] Session cookie is created
- [ ] Dashboard loads for client role
- [ ] Navigation shows correct links for client
- [ ] Protected routes redirect when not authenticated
- [ ] Public routes accessible without authentication
- [ ] Manager role can access manager routes
- [ ] Manager navigation shows additional links
- [ ] Template creation form accessible for managers
- [ ] Client management accessible for managers
- [ ] Client cannot access manager routes
- [ ] Session persists across browser restarts
- [ ] Sign out clears session and redirects
- [ ] Middleware redirects work correctly
- [ ] Agency branding/theme is consistent
- [ ] Mobile responsive layout works
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No linter errors

## Performance Checks

- [ ] Initial page load < 2s
- [ ] Dashboard load < 1s
- [ ] Sign in flow < 3s total
- [ ] Navigation smooth and instant
- [ ] No layout shifts on load

## Security Checks

- [ ] Session cookie is HTTP-only
- [ ] Session cookie is Secure in production
- [ ] ID tokens not exposed in URLs
- [ ] Protected routes require authentication
- [ ] Manager routes require manager role
- [ ] API routes verify authentication
- [ ] No sensitive data in browser console
- [ ] CORS configured correctly

## Next Steps After Testing

1. If all tests pass → Ready for staging deployment
2. If tests fail → Review logs and fix issues
3. Add more test users with different roles
4. Test edge cases (expired sessions, invalid tokens, etc.)
5. Test on different browsers (Chrome, Firefox, Safari)
6. Test on mobile devices

## Support

If you encounter issues:

1. Check server logs for errors
2. Check browser console for errors
3. Review Firebase Console for auth errors
4. Check Firestore for correct data structure
5. Verify environment variables are set
6. Ensure dependencies are installed (`pnpm install`)

## Development URLs

- **App**: <http://localhost:3003>
- **Sign In**: <http://localhost:3003/sign-in>
- **Sign Up**: <http://localhost:3003/sign-up>
- **Dashboard**: <http://localhost:3003/dashboard>
- **Manager Templates**: <http://localhost:3003/dashboard/templates>
- **Manager Clients**: <http://localhost:3003/dashboard/clients>

## Production URLs (when deployed)

- **App**: <https://agency.cenie.org>
- **Sign In**: <https://agency.cenie.org/sign-in>
- **Sign Up**: <https://agency.cenie.org/sign-up>
- **Dashboard**: <https://agency.cenie.org/dashboard>
