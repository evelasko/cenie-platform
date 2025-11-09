# TASK 2-3: Add Academy Route Protection & Middleware

**Phase**: 2 - Academy Authentication  
**Duration**: 1 day  
**Dependencies**: TASK_22 (Session API routes working)  
**Next Task**: TASK_24 (Student Dashboard)

---

## OBJECTIVE

Add Next.js middleware to protect Academy's dashboard routes and create role-based access helpers. This ensures unauthenticated users can't access the dashboard and students can't access instructor-only features.

**What You're Building**: Route protection layer that enforces authentication and authorization.

**Why This Matters**: Security. Without this, anyone can access `/dashboard` and all course management features. This task locks down protected content.

---

## ARCHITECTURE CONTEXT

### Route Protection Patterns

**Public Routes** (no authentication):

- `/` - Homepage
- `/courses` - Course catalog (public browsing)
- `/sign-in` - Sign-in page
- `/sign-up` - Sign-up page
- `/about`, `/contact`, etc.

**Protected Routes** (require authentication):

- `/dashboard/*` - All dashboard pages
- `/my-courses/*` - Student-specific pages
- `/profile/*` - User profile pages

**Role-Protected Routes**:

- `/dashboard/courses/*` - Requires instructor role
- `/dashboard/students/*` - Requires instructor role
- `/dashboard/admin/*` - Requires admin role

### Middleware vs API Route Protection

**Next.js Middleware** (`middleware.ts` file):

- Runs before page renders
- Redirects unauthenticated users to `/sign-in`
- Fast (no page load for unauthorized)
- Used for page routes

**API Route Middleware** (from @cenie/auth-server):

- Protects API endpoints
- Returns 401/403 errors
- Used with `withAuth()` and `withRole()`
- Already implemented in Phase 1A

**Both are needed** - pages use Next.js middleware, APIs use route middleware.

---

## SOURCE FILES TO STUDY

**References**:

1. `apps/editorial/src/proxy.ts`
   - Lines 1-68: Next.js middleware implementation
   - Shows public route checking
   - Session verification pattern
   - **This is your template**

2. `apps/hub/src/middleware.ts` (if exists)
   - Alternative implementation
   - May have i18n considerations

3. `@cenie/firebase/src/middleware.ts`
   - Lines 28-70: `createAuthMiddleware()` function
   - Shows middleware factory pattern

---

## WHAT TO BUILD

### Files to Create

```
apps/academy/src/
├── middleware.ts (NEW)
└── lib/
    └── auth.ts (UPDATE - add helpers)
```

---

## DETAILED REQUIREMENTS

### File 1: Next.js Middleware (`src/middleware.ts`)

**Purpose**: Protect dashboard routes from unauthenticated access

**Implementation**:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@cenie/auth-server/session'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/courses',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

// Routes that require authentication
const protectedPaths = ['/dashboard', '/my-courses', '/profile']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path is public
  const isPublicPath = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if path requires authentication
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path))

  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Verify session for protected paths
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie) {
    // No session - redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Verify session is valid
  const decoded = await verifySession(sessionCookie.value)

  if (!decoded) {
    // Invalid session - redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Session valid - allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
```

**How this works**:

1. Middleware runs on every request
2. Public routes pass through immediately
3. Protected routes check for session cookie
4. If no session or invalid: redirect to sign-in with return URL
5. If valid session: allow request to proceed

### File 2: Update Auth Helpers (`src/lib/auth.ts`)

**Add Academy-specific middleware helpers**:

```typescript
import { withRole } from '@cenie/auth-server/middleware'
import type { AcademyRole } from '@cenie/auth-utils/roles'

/**
 * Require student role or higher for API routes
 * Use in API routes that any authenticated student can access
 */
export const requireStudent = () => withRole('academy', 'student')

/**
 * Require instructor role or higher for API routes
 * Use in API routes for course management, student management
 */
export const requireInstructor = () => withRole('academy', 'instructor')

/**
 * Require admin role for API routes
 * Use in API routes for user management, system configuration
 */
export const requireAcademyAdmin = () => withRole('academy', 'admin')
```

**Usage in API routes**:

```typescript
// Any authenticated student
export const GET = requireStudent()(async (request, { user }) => {
  // user.role is 'student', 'instructor', or 'admin'
  return NextResponse.json({ courses: await getCourses(user.uid) })
})

// Only instructors and admins
export const POST = requireInstructor()(async (request, { user }) => {
  // user.role is 'instructor' or 'admin'
  return NextResponse.json({ course: await createCourse(user.uid, data) })
})
```

---

## TESTING REQUIREMENTS

### Test 1: Unauthenticated Access (Should Redirect)

1. Clear browser cookies
2. Visit <http://localhost:3002/dashboard>
3. **Expected**: Redirect to /sign-in?redirect=/dashboard

### Test 2: Authenticated Access (Should Allow)

1. Sign in to Academy
2. Visit <http://localhost:3002/dashboard>
3. **Expected**: Dashboard loads (not redirect)

### Test 3: Public Routes (Always Allow)

**Unauthenticated**:

1. Clear cookies
2. Visit <http://localhost:3002/>
3. **Expected**: Homepage loads (no redirect)

**Authenticated**:

1. Sign in
2. Visit <http://localhost:3002/courses>
3. **Expected**: Courses page loads

### Test 4: Redirect Return URL

1. Clear cookies
2. Visit <http://localhost:3002/dashboard/courses>
3. Should redirect to /sign-in?redirect=/dashboard/courses
4. Sign in
5. **Expected**: Redirect back to /dashboard/courses

### Test 5: API Route Protection

Create test route: `apps/academy/src/app/api/test-role/route.ts`

```typescript
import { requireInstructor } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const GET = requireInstructor()(async (request, { user }) => {
  return NextResponse.json({
    message: 'You have instructor access!',
    role: user.role,
  })
})
```

**Test as student**:

```bash
# Sign in as student, get session cookie
curl http://localhost:3002/api/test-role \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

**Expected**: 403 Forbidden (students can't access instructor routes)

**Test as instructor**:

```bash
# Sign in as instructor, get session cookie
curl http://localhost:3002/api/test-role \
  -H "Cookie: session=INSTRUCTOR_SESSION_COOKIE"
```

**Expected**: 200 OK with success message

**After testing**: Delete test route.

---

## SUCCESS CRITERIA

- [ ] Middleware file created
- [ ] Public routes accessible without auth
- [ ] Protected routes redirect to sign-in when not authenticated
- [ ] Authenticated users can access dashboard
- [ ] Redirect return URL works correctly
- [ ] Auth helpers created (requireStudent, requireInstructor, requireAcademyAdmin)
- [ ] API route protection tested
- [ ] Role hierarchy enforced (student < instructor < admin)
- [ ] TypeScript strict mode passing
- [ ] Linting clean

---

## COMMON PITFALLS

1. **Don't forget matcher config**: Without it, middleware runs on static files (bad performance)

2. **Don't redirect API routes**: Middleware should only redirect page routes, not /api/\* endpoints

3. **Don't verify session twice**: Middleware verifies once, API routes get user from session

4. **Don't block sign-in page**: Make sure `/sign-in` is in publicRoutes array

5. **Don't forget redirect parameter**: Preserve destination URL when redirecting to sign-in

---

## ROUTE PROTECTION MATRIX

After this task:

| Route                 | Public? | Role Required | Middleware Action               |
| --------------------- | ------- | ------------- | ------------------------------- |
| `/`                   | Yes     | None          | Pass through                    |
| `/sign-in`            | Yes     | None          | Pass through                    |
| `/courses`            | Yes     | None          | Pass through                    |
| `/dashboard`          | No      | student       | Redirect if not authenticated   |
| `/dashboard/courses`  | No      | instructor    | Redirect if not authenticated   |
| `/dashboard/admin`    | No      | admin         | Redirect if not authenticated   |
| `/api/courses`        | No      | student       | Return 401 if not authenticated |
| `/api/courses/create` | No      | instructor    | Return 403 if not instructor    |

**Page protection**: Middleware (redirect)  
**API protection**: Route middleware (error response)

---

## HANDOFF

When complete:

- [ ] All routes properly protected
- [ ] Unauthenticated users redirected to sign-in
- [ ] Role-based access working
- [ ] Ready for dashboard implementation

**Next**: TASK_24 will create the Student Dashboard that uses this protection.

---

**Estimated Time**: 4-6 hours

**Note**: This completes the security layer. Test thoroughly - protection must be airtight!
