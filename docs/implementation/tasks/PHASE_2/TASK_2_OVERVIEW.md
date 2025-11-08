# PHASE 2 OVERVIEW: Academy Authentication

**Agent Assignment**: Agent 1  
**Duration**: 5 days (5 sequential tasks)  
**Dependencies**: Phase 1A complete (all auth packages ready)  
**Outcome**: Academy app with full authentication (student/instructor/admin roles)

---

## PHASE GOAL

Implement complete authentication system for Academy app using the shared packages created in Phase 1A. Academy will have three roles:
- **Student**: Can enroll in courses, view content, track progress
- **Instructor**: Can create courses, manage students, view analytics
- **Admin**: Full system access, user management

**This is the first production use** of the new auth packages - success here validates the entire architecture.

---

## TASKS BREAKDOWN

| Task | Title | Focus | Deliverable |
|------|-------|-------|-------------|
| 2-1 | Sign-In/Sign-Up Pages | UI + OAuth | Auth pages with Academy branding |
| 2-2 | Session & Access API | Server-side auth | API endpoints for session/access |
| 2-3 | Route Protection | Middleware | Protected dashboard routes |
| 2-4 | Student Dashboard | Role-specific UI | Student-facing features |
| 2-5 | Instructor Dashboard | Role-specific UI | Instructor-facing features |

---

## ACADEMY APP CONTEXT

### Current State

**Location**: `apps/academy/`

**Structure**:
```
apps/academy/src/
├── app/
│   ├── coming-soon.tsx
│   ├── dashboard/
│   │   └── page.tsx (minimal, no auth)
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx (has AuthProvider but unused)
│   ├── sign-in/
│   │   └── page.tsx (exists but minimal)
│   └── typography/
│       └── page.tsx
└── lib/ (empty - no utilities yet)
```

**Key Files**:
- `layout.tsx` - Has Geist font, basic providers
- `providers.tsx` - Has AuthProvider from @cenie/firebase
- `sign-in/page.tsx` - Exists but needs complete implementation

**Branding**:
- Color: Academy blue (to be defined)
- Font: Geist (modern sans-serif, already loaded)
- Logo: `@cenie/ui/graphics/LogoAcademy`
- Tone: Educational, encouraging, modern

### What Academy Needs

**Public Pages** (unauthenticated):
- Homepage: Course catalog
- Course detail pages
- Sign-in page
- Sign-up page

**Protected Pages** (require authentication):
- `/dashboard` - Student dashboard (my courses, progress)
- `/dashboard/courses` - Instructor course management
- `/dashboard/students` - Instructor student management
- `/dashboard/analytics` - Instructor analytics

**API Routes** (to be created):
- `/api/auth/session` - Session creation (POST, DELETE)
- `/api/users/apps/academy/access` - Access check (GET)
- Future: Course management APIs (not part of auth tasks)

---

## SHARED PACKAGES AVAILABLE

From Phase 1A, you now have:

```typescript
// Session management
import { createSession, verifySession, clearSession } from '@cenie/auth-server/session'

// Middleware
import { withAuth, withRole } from '@cenie/auth-server/middleware'

// Helpers
import { getAuthenticatedUser, checkAppAccess } from '@cenie/auth-server/helpers'

// Role utilities
import { hasRole, APP_ROLES } from '@cenie/auth-utils/roles'

// OAuth
import { useOAuth } from '@cenie/oauth-handlers/hooks'
import { OAuthButton } from '@cenie/oauth-handlers/components'

// Existing packages
import { getFirebaseAuth } from '@cenie/firebase/client'
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'
import { AuthenticationError } from '@cenie/errors'
```

**Your job in Phase 2**: Use these packages to build Academy's authentication.

---

## SUCCESS CRITERIA FOR PHASE 2

By end of 5 days, Academy must have:

### Authentication Features
- [ ] Email/password sign-up and sign-in working
- [ ] Google OAuth working (popup and redirect)
- [ ] Apple OAuth working (popup and redirect)
- [ ] Account linking working (handles email conflicts)
- [ ] Session persistence (14-day cookies)
- [ ] Logout functionality

### Access Control
- [ ] Three roles implemented: student, instructor, admin
- [ ] Firestore `user_app_access` records created on signup
- [ ] Role-based route protection
- [ ] Access check endpoint functional

### Dashboards
- [ ] Student dashboard (protected, requires student role)
- [ ] Instructor dashboard (protected, requires instructor role)
- [ ] Admin dashboard (protected, requires admin role)
- [ ] Navigation based on role

### Technical Quality
- [ ] TypeScript strict mode passing
- [ ] Linting clean (zero warnings)
- [ ] No console errors
- [ ] All auth flows tested end-to-end

---

## TESTING CHECKLIST (End of Phase 2)

### Test Flow 1: New Student Signup
1. Visit http://localhost:3002/sign-up
2. Enter email/password
3. Submit form
4. Should create Firebase user
5. Should create Firestore profile
6. Should grant 'student' role in `user_app_access`
7. Should redirect to student dashboard
8. Should have session cookie (check browser DevTools)

### Test Flow 2: Google OAuth (New User)
1. Visit http://localhost:3002/sign-in
2. Click "Continue with Google"
3. Popup opens, select Google account
4. Should create user, grant student role
5. Should redirect to dashboard

### Test Flow 3: Instructor Access
1. Sign in as student
2. Access `/dashboard/courses` (instructor page)
3. Should get 403 Forbidden
4. Use CLI or Hub to grant instructor role
5. Refresh page
6. Should now see instructor dashboard

### Test Flow 4: Session Persistence
1. Sign in
2. Close browser
3. Reopen browser
4. Visit http://localhost:3002/dashboard
5. Should still be signed in (session persists)

### Test Flow 5: Logout
1. Sign in
2. Click logout
3. Should clear session
4. Redirect to sign-in page
5. Accessing /dashboard should redirect to sign-in

---

## INTEGRATION NOTES

### Firebase Configuration

Academy has its own Firebase app (per your decision):

**Environment Variables** (apps/academy/.env.local):
```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=academy-cenie.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=academy-cenie
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Firebase Admin (shared with other apps - same credentials)
FIREBASE_PROJECT_ID=cenie-platform
FIREBASE_CLIENT_EMAIL=xxx@cenie-platform.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----"
```

**Why different client configs?**: Each app has its own Firebase app for branding in OAuth consent screens.

**Why same admin config?**: All apps share Firestore database for user profiles and access control.

### Firestore Access Records

When granting Academy access, create:
```typescript
{
  userId: 'firebase-uid',
  appName: 'academy',
  role: 'student', // or 'instructor' or 'admin'
  isActive: true,
  grantedAt: Timestamp.now(),
  grantedBy: null, // or admin's userId
}
```

---

## HANDOFF BETWEEN TASKS

**Task 2-1 → Task 2-2**:
- Sign-in/sign-up pages created
- OAuth components integrated
- Pages call `/api/auth/session` (to be created in 2-2)

**Task 2-2 → Task 2-3**:
- Session and access API endpoints working
- Can create and verify sessions
- Ready to protect routes

**Task 2-3 → Task 2-4**:
- Middleware protecting dashboard routes
- Role-based access working
- Student dashboard can be built

**Task 2-4 → Task 2-5**:
- Student dashboard complete
- Instructor dashboard follows same pattern

---

## TASK CARD LOCATIONS

All Phase 2 task cards in `/docs/implementation/tasks/PHASE_2/`:

- `TASK_2_OVERVIEW.md` (this file)
- `TASK_21_ACADEMY_SIGNIN_PAGES.md`
- `TASK_22_ACADEMY_SESSION_API.md`
- `TASK_23_ACADEMY_PROTECTION.md`
- `TASK_24_ACADEMY_STUDENT_DASHBOARD.md`
- `TASK_25_ACADEMY_INSTRUCTOR_DASHBOARD.md`

**Start with**: TASK_21 after Phase 1A is complete.

---

## COORDINATION WITH PHASE 3

Phase 3 (Agency) runs **parallel** to Phase 2:
- Agent 1 does Academy (Phase 2)
- Agent 2 does Agency (Phase 3)
- Both follow nearly identical patterns
- Can share learnings in daily standups

**Agency differences**:
- Different roles (client, manager instead of student, instructor)
- Different branding (bold, uppercase instead of educational blue)
- Different dashboard features (templates vs courses)

**Same auth infrastructure** - that's the power of shared packages!

---

**Proceed to TASK_21 to begin Academy implementation.**

