# TASK 2-2: Create Academy Session & Access API Routes

**Phase**: 2 - Academy Authentication  
**Duration**: 1 day  
**Dependencies**: TASK_1A1, 1A2, 1A3 (auth-server package complete)  
**Next Task**: TASK_23 (Route Protection)

---

## OBJECTIVE

Create the server-side API routes that Academy's sign-in/sign-up pages (from TASK_21) need to function. These routes handle session creation, OAuth post-processing, and access verification.

**What You're Building**: The backend endpoints that complete the authentication flow.

**Why This Matters**: TASK_21 created the UI, now we need the server logic. After this task, students and instructors can fully authenticate and access Academy.

---

## ARCHITECTURE CONTEXT

### API Routes Needed

**Session Management**:

- `POST /api/auth/session` - Create session cookie from Firebase ID token
- `DELETE /api/auth/session` - Clear session (logout)

**Access Control**:

- `GET /api/users/apps/academy/access` - Check if user has Academy access
- `POST /api/auth/oauth` - Process OAuth signup/signin (grant access)

**Authentication Flow** (from TASK_21 sign-in):

```
1. User authenticates with Firebase (email or OAuth)
2. Client gets ID token
3. Client calls /api/users/apps/academy/access with token
4. Server verifies token, checks Firestore for academy access
5. If access granted, client calls /api/auth/session with token
6. Server creates session cookie
7. Client redirects to dashboard
```

### Using Shared Packages

From Phase 1A, you have:

```typescript
import { createSession, verifySession } from '@cenie/auth-server/session'
import { verifyIdToken, checkAppAccess } from '@cenie/auth-server/helpers'
import { grantAccess } from '@cenie/auth-utils/access-control'
```

**Your job**: Create API routes that use these packages.

---

## SOURCE FILES TO STUDY

**Primary References**:

1. `apps/editorial/src/app/api/auth/session/route.ts`
   - Complete file (70 lines) - Session creation pattern
   - POST handler: Creates session cookie
   - DELETE handler: Clears session
   - **Copy this pattern exactly, change 'editorial' to 'academy'**

2. `apps/editorial/src/app/api/users/apps/[appName]/access/route.ts`
   - Complete file (105 lines) - Access check pattern
   - GET handler: Verifies token, checks Firestore
   - **Copy and adapt for Academy**

3. `apps/hub/src/app/api/auth/oauth/route.ts`
   - Lines 31-127: OAuth post-processing
   - Creates profile, grants access
   - **Adapt for Academy**

---

## WHAT TO BUILD

### Create API Routes

```
apps/academy/src/app/api/
├── auth/
│   ├── session/
│   │   └── route.ts (NEW)
│   └── oauth/
│       └── route.ts (NEW)
└── users/
    └── apps/
        └── academy/
            └── access/
                └── route.ts (NEW)
```

---

## DETAILED REQUIREMENTS

### Route 1: Session Management (`/api/auth/session/route.ts`)

**Purpose**: Create and delete session cookies

**POST Handler** (Create Session):

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@cenie/auth-server/session'
import { cookies } from 'next/headers'
import { createLogger } from '@cenie/logger'
import { AuthenticationError } from '@cenie/errors'

const logger = createLogger({ name: 'academy-session' })

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 })
    }

    // Create session cookie using shared package
    logger.debug('Creating Academy session')
    const sessionCookie = await createSession(idToken, 'academy')

    // Set cookie in response
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    })

    logger.info('Academy session created successfully')

    return NextResponse.json({
      success: true,
      message: 'Session created',
    })
  } catch (error) {
    logger.error('Failed to create session', { error })

    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
```

**DELETE Handler** (Logout):

```typescript
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')

    logger.info('Academy session cleared')

    return NextResponse.json({
      success: true,
      message: 'Session cleared',
    })
  } catch (error) {
    logger.error('Failed to clear session', { error })
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 })
  }
}
```

**Reference**: Extract from `apps/editorial/src/app/api/auth/session/route.ts`

### Route 2: Access Check (`/api/users/apps/academy/access/route.ts`)

**Purpose**: Verify user has Academy access before allowing sign-in

**GET Handler**:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken, checkAppAccess } from '@cenie/auth-server/helpers'
import { createLogger } from '@cenie/logger'
import { AuthenticationError } from '@cenie/errors'

const logger = createLogger({ name: 'academy-access-check' })

export async function GET(request: NextRequest) {
  try {
    // Get ID token from Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Access check failed - no authorization header')
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')

    // Verify ID token
    const decoded = await verifyIdToken(idToken)
    const userId = decoded.uid

    logger.debug('Checking Academy access', { userId })

    // Check Academy access using shared helper
    const access = await checkAppAccess(userId, 'academy')

    if (!access.hasAccess) {
      logger.info('User has no Academy access', { userId })
      return NextResponse.json(
        {
          hasAccess: false,
          error: 'No access to Academy',
        },
        { status: 403 }
      )
    }

    logger.info('Academy access confirmed', { userId, role: access.role })

    return NextResponse.json({
      hasAccess: true,
      role: access.role,
      isActive: access.isActive,
    })
  } catch (error) {
    logger.error('Access check failed', { error })

    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ error: 'Access check failed' }, { status: 500 })
  }
}
```

**Reference**: Extract from `apps/editorial/src/app/api/users/apps/[appName]/access/route.ts`

### Route 3: OAuth Post-Processing (`/api/auth/oauth/route.ts`)

**Purpose**: After OAuth success, create user profile and grant Academy access

**POST Handler**:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { initializeAdminApp } from '@cenie/firebase/server'
import { verifyIdToken } from '@cenie/auth-server/helpers'
import { grantAccess } from '@cenie/auth-utils/access-control'
import { createLogger } from '@cenie/logger'
import { Timestamp } from 'firebase-admin/firestore'

const logger = createLogger({ name: 'academy-oauth' })

interface OAuthRequestBody {
  appName: 'academy'
  role?: string
  isNewUser: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Get and verify ID token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const idToken = authHeader.replace('Bearer ', '')
    const decoded = await verifyIdToken(idToken)
    const userId = decoded.uid

    const body: OAuthRequestBody = await request.json()
    const { isNewUser, role = 'student' } = body

    logger.debug('Processing OAuth', { userId, isNewUser, role })

    const adminApp = initializeAdminApp()
    const firestore = adminApp.firestore()
    const auth = adminApp.auth()

    // Get user record from Firebase Auth
    const userRecord = await auth.getUser(userId)

    // Check if profile exists
    const profileRef = firestore.collection('profiles').doc(userId)
    const profileDoc = await profileRef.get()

    if (!profileDoc.exists || isNewUser) {
      // Create or update profile
      const profileData = {
        id: userId,
        email: userRecord.email || decoded.email,
        fullName: userRecord.displayName || null,
        avatarUrl: userRecord.photoURL || null,
        createdAt: profileDoc.exists ? profileDoc.data()!.createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await profileRef.set(profileData, { merge: true })
      logger.info('Profile created/updated', { userId, isNewUser })
    }

    // Check if user already has Academy access
    const existingAccess = await firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', 'academy')
      .limit(1)
      .get()

    if (existingAccess.empty) {
      // Grant Academy access with specified role
      await grantAccess({
        userId,
        appName: 'academy',
        role: role || 'student', // Default to student
        grantedBy: null, // Self-signup
      })

      logger.info('Academy access granted', { userId, role })
    } else {
      logger.debug('User already has Academy access', { userId })
    }

    return NextResponse.json({
      success: true,
      message: 'OAuth processing complete',
      userId,
    })
  } catch (error) {
    logger.error('OAuth processing failed', { error })
    return NextResponse.json({ error: 'OAuth processing failed' }, { status: 500 })
  }
}
```

**Reference**: Adapted from `apps/hub/src/app/api/auth/oauth/route.ts`

---

## TESTING REQUIREMENTS

### Test 1: Session Creation

**Manual Test**:

1. Start Academy: `pnpm --filter=@cenie/academy dev`
2. Open browser DevTools → Network tab
3. Visit <http://localhost:3002/sign-in>
4. Sign in with test credentials
5. Watch network tab for POST to `/api/auth/session`
6. Should return 200 OK
7. Check Application tab → Cookies
8. Should see 'session' cookie with:
   - HttpOnly: true
   - Secure: true (if production)
   - SameSite: Lax
   - Max-Age: 1209600 (14 days)

**Test with curl**:

```bash
# Get Firebase ID token first (from browser console or Firebase SDK)
curl -X POST http://localhost:3002/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_FIREBASE_ID_TOKEN"}'
```

**Expected**: `{"success":true,"message":"Session created"}`

### Test 2: Access Check

**Setup**:

1. Create test user in Firebase Auth
2. Grant Academy access in Firestore (manual or use CLI from Phase 7)

**Test**:

```bash
# Get user's ID token
curl http://localhost:3002/api/users/apps/academy/access \
  -H "Authorization: Bearer YOUR_ID_TOKEN"
```

**Expected** (has access):

```json
{
  "hasAccess": true,
  "role": "student",
  "isActive": true
}
```

**Test without access**:

```bash
# Use ID token of user without Academy access
curl http://localhost:3002/api/users/apps/academy/access \
  -H "Authorization: Bearer DIFFERENT_TOKEN"
```

**Expected** (no access):

```json
{
  "hasAccess": false,
  "error": "No access to Academy"
}
```

### Test 3: OAuth Processing

**Setup**:

1. Sign up with Google OAuth (from TASK_21 sign-up page)
2. Watch network tab

**Expected Flow**:

1. OAuth popup closes with Firebase user
2. Client gets ID token
3. Client POSTs to `/api/auth/oauth` with token
4. Should return 200 OK
5. Check Firestore:
   - `profiles` collection: User profile created
   - `user_app_access` collection: Academy access granted with 'student' role

**Test with existing user**:

1. Sign out
2. Sign in with Google (same account)
3. Should not create duplicate records
4. Should succeed without errors

### Test 4: Complete Sign-In Flow (End-to-End)

**With TASK_21 pages + these API routes, test**:

1. Go to <http://localhost:3002/sign-in>
2. Enter email/password
3. Submit form
4. Should:
   - Authenticate with Firebase ✓
   - Check access via `/api/users/apps/academy/access` ✓
   - Create session via `/api/auth/session` ✓
   - Redirect to /dashboard ✓
5. Close browser
6. Reopen browser
7. Visit <http://localhost:3002/dashboard>
8. Should still be authenticated (session persists)

**Expected**: Complete auth flow working end-to-end.

---

## SUCCESS CRITERIA

- [ ] `/api/auth/session` POST handler creates valid session cookies
- [ ] `/api/auth/session` DELETE handler clears sessions
- [ ] `/api/users/apps/academy/access` verifies tokens and checks Firestore
- [ ] `/api/auth/oauth` creates profiles and grants access
- [ ] All routes use shared packages (@cenie/auth-server, @cenie/auth-utils)
- [ ] All routes have proper error handling
- [ ] All routes log appropriately using @cenie/logger
- [ ] TypeScript strict mode passing
- [ ] Linting clean
- [ ] End-to-end sign-in flow works
- [ ] Session persistence confirmed

---

## COMMON PITFALLS

1. **Don't forget 'academy' appName**: Routes should use 'academy', not copy/paste 'editorial'

2. **Don't skip error handling**: Token verification can fail, Firestore queries can fail

3. **Don't forget cookie options**: HttpOnly, Secure (production), SameSite are security critical

4. **Don't log tokens**: Never log ID tokens or session cookies (security)

5. **Don't grant access twice**: Check if access exists before granting

---

## INTEGRATION WITH TASK_21

After this task, **go back to TASK_21 pages** and verify:

1. Sign-in page calls these APIs correctly
2. Sign-up page calls OAuth endpoint
3. Error handling works (show errors from API)
4. Success flow redirects properly

**These routes complete the authentication system** built in TASK_21.

---

## FIRESTORE RECORDS CREATED

### After OAuth Signup

**`profiles` collection**:

```typescript
{
  id: "user-firebase-uid",
  email: "student@example.com",
  fullName: "John Doe",
  avatarUrl: "https://lh3.googleusercontent.com/...",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**`user_app_access` collection**:

```typescript
{
  userId: "user-firebase-uid",
  appName: "academy",
  role: "student",
  isActive: true,
  grantedAt: Timestamp,
  grantedBy: null // Self-signup
}
```

**Verify in Firebase Console** after OAuth test.

---

## HANDOFF

When complete:

- [ ] All 3 API routes functional
- [ ] Sign-in/sign-up flow working end-to-end
- [ ] Sessions persisting correctly
- [ ] Access control enforced

**Next**: TASK_23 will add middleware to protect dashboard routes, using these session APIs.

---

**Estimated Time**: 4-6 hours

**Critical**: Test the complete flow (TASK_21 pages + these APIs) before marking done. The authentication system is now fully functional!
