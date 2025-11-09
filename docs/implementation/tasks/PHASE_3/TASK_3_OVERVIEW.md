# PHASE 3 OVERVIEW: Agency Authentication

**Agent Assignment**: Agent 2  
**Duration**: 5 days (runs parallel to Phase 2)  
**Dependencies**: Phase 1A complete (auth packages ready)  
**Outcome**: Agency app with full authentication (client/manager/admin roles)

---

## PHASE GOAL

Implement complete authentication system for Agency app using shared packages from Phase 1A. Agency will have three roles:

- **Client**: Can browse automation templates, manage their projects
- **Manager**: Can create templates, manage clients, view analytics
- **Admin**: Full system access, user management

**Pattern**: Mirrors Academy implementation (Phase 2) with different branding and business logic.

---

## TASKS BREAKDOWN

| Task | Title                        | Pattern Source       | Duration |
| ---- | ---------------------------- | -------------------- | -------- |
| 3-1  | Agency Sign-In/Sign-Up Pages | Copy TASK_21 pattern | 1 day    |
| 3-2  | Agency Session & Access API  | Copy TASK_22 pattern | 1 day    |
| 3-3  | Agency Route Protection      | Copy TASK_23 pattern | 1 day    |
| 3-4  | Agency Client Dashboard      | Copy TASK_24 pattern | 1 day    |
| 3-5  | Agency Manager Dashboard     | Copy TASK_25 pattern | 1 day    |

**Key Differences from Academy**:

- Branding: Bold, modern, tech-focused (not educational blue)
- Roles: client/manager (not student/instructor)
- Business context: Automation templates (not courses)
- Tone: Professional services (not educational)

---

## AGENCY APP CONTEXT

### Current State

**Location**: `apps/agency/`

**Structure** (minimal, needs full implementation):

```
apps/agency/src/
├── app/
│   ├── coming-soon.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
└── lib/ (doesn't exist - will create)
```

**Everything needs to be built** - Agency is least developed app.

### Agency Branding

**Visual Identity**:

- Primary: Modern tech colors (likely dark blue or teal - to be defined)
- Typography: Clean, modern sans-serif
- Logo: `@cenie/ui/graphics/LogoAgency`
- Tone: Professional, efficient, results-driven

**Contrast with Academy**:

- Academy: Educational, encouraging, blue gradients
- Agency: Professional, bold, darker palette

---

## TASK-BY-TASK MAPPING TO ACADEMY

### TASK 3-1 = TASK_21 Pattern (Sign-In Pages)

**Copy from**: `TASK_21_ACADEMY_SIGNIN_PAGES.md`

**Changes**:

- File path: `apps/agency/` instead of `apps/academy/`
- Constants: `AGENCY_CONFIG` instead of `ACADEMY_CONFIG`
- Branding: Agency colors, LogoAgency component
- Text: "Professional Automation" instead of "Learning Journey"
- AppName: 'agency' instead of 'academy'
- Default role: 'client' instead of 'student'

**Same**:

- OAuth integration (Google + Apple)
- Email/password forms
- Account linking flow
- Session creation logic
- All shared package usage

### TASK 3-2 = TASK_22 Pattern (Session API)

**Copy from**: `TASK_22_ACADEMY_SESSION_API.md`

**Changes**:

- File path: `apps/agency/src/app/api/`
- appName parameter: 'agency' instead of 'academy'
- Logger name: 'agency-session' instead of 'academy-session'
- Default role: 'client' instead of 'student'

**Same**:

- API route structure
- Session management logic
- Access check pattern
- OAuth processing

### TASK 3-3 = TASK_23 Pattern (Protection)

**Copy from**: `TASK_23_ACADEMY_PROTECTION.md`

**Changes**:

- File path: `apps/agency/src/middleware.ts`
- Protected paths: `/dashboard`, `/projects`, `/templates`
- Role helpers: `requireClient()`, `requireManager()`, `requireAgencyAdmin()`

**Same**:

- Middleware logic
- Public route pattern
- Redirect logic
- Session verification

### TASK 3-4 = TASK_24 Pattern (Client Dashboard)

**Copy from**: `TASK_24_ACADEMY_DASHBOARDS.md` (student section)

**Changes**:

- Role: 'client' instead of 'student'
- Content: "My Projects" instead of "My Courses"
- Stats: Projects, Templates Used, Automations Active
- Empty state: "Browse Templates" instead of "Browse Courses"

**Same**:

- Dashboard layout structure
- Stats card pattern
- Navigation pattern

### TASK 3-5 = TASK_25 Pattern (Manager Dashboard)

**Copy from**: `TASK_24_ACADEMY_DASHBOARDS.md` (instructor section)

**Changes**:

- Role: 'manager' instead of 'instructor'
- Content: "Manage Templates" instead of "Manage Courses"
- Stats: Active Templates, Total Clients, Revenue
- Actions: Create Template, Manage Clients

**Same**:

- Dashboard structure
- Role protection
- Navigation

---

## AGENCY-SPECIFIC CONSTANTS

### File: `apps/agency/src/lib/constants.ts`

```typescript
export const AGENCY_CONFIG = {
  appName: 'agency' as const,
  displayName: 'CENIE Agency',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003',

  oauth: {
    redirectTo: '/dashboard',
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
  },

  session: {
    cookieName: 'session',
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },

  defaultRole: 'client' as const,

  roles: {
    client: {
      displayName: 'Client',
      dashboardPath: '/dashboard',
    },
    manager: {
      displayName: 'Manager',
      dashboardPath: '/dashboard/templates',
    },
    admin: {
      displayName: 'Administrator',
      dashboardPath: '/dashboard/admin',
    },
  },
}
```

### File: `apps/agency/src/lib/auth.ts`

```typescript
import { withRole } from '@cenie/auth-server/middleware'

export const requireClient = () => withRole('agency', 'client')
export const requireManager = () => withRole('agency', 'manager')
export const requireAgencyAdmin = () => withRole('agency', 'admin')
```

---

## TESTING REQUIREMENTS

**Same as Academy but with Agency context**:

### Complete Test Flow

1. **New Client Signup**:
   - Visit <http://localhost:3003/sign-up>
   - Create account
   - Should grant 'client' role
   - Redirect to client dashboard

2. **Manager Access**:
   - Grant manager role in Firestore
   - Sign in
   - Should access template management
   - Should see manager navigation

3. **Role Protection**:
   - Client tries /dashboard/templates
   - Should redirect to /dashboard

4. **OAuth Flows**:
   - Google OAuth working
   - Apple OAuth working
   - Account linking working

5. **Session Persistence**:
   - Sign in, close browser, reopen
   - Should still be authenticated

---

## SUCCESS CRITERIA FOR PHASE 3

By end of 5 days:

- [ ] Agency sign-in/sign-up pages working
- [ ] OAuth integration (Google + Apple)
- [ ] Session management API routes
- [ ] Access check endpoint
- [ ] Route protection middleware
- [ ] Client dashboard
- [ ] Manager dashboard
- [ ] Admin dashboard (basic)
- [ ] Role-based navigation
- [ ] All protection layers enforced
- [ ] TypeScript strict mode passing
- [ ] Linting clean

---

## COORDINATION WITH PHASE 2

**Agent 1 (Academy)** and **Agent 2 (Agency)** work in parallel:

**Daily Sync**:

- Share learnings (what worked, what didn't)
- Coordinate on shared package usage
- Compare approaches for consistency

**Example Coordination**:

- Agent 1 discovers issue in @cenie/oauth-handlers
- Logs in shared tracker
- Agent 2 aware, can avoid same issue
- Or vice versa

**End of Week 2**:

- Both apps demo together
- Academy and Agency both authenticated
- Validate consistency
- Test cross-app SSO (sign in to Academy, then Agency - should work with same account)

---

## HANDOFF

**When Phase 3 Complete**:

- [ ] Agency fully authenticated
- [ ] Parallel to Academy implementation
- [ ] Both apps ready for production

**Next Phase**: Phase 4 (Refactoring Hub and Editorial to use shared packages)

---

## TASK CARD LOCATIONS

All Phase 3 task cards in `/docs/implementation/tasks/PHASE_3/`:

- `TASK_3_OVERVIEW.md` (this file)
- `TASK_31_AGENCY_AUTH_PAGES.md` (references TASK_21 pattern)
- `TASK_32_AGENCY_SESSION_API.md` (references TASK_22 pattern)
- `TASK_33_AGENCY_PROTECTION.md` (references TASK_23 pattern)
- `TASK_34_AGENCY_DASHBOARDS.md` (references TASK_24 pattern)

---

**Start with**: TASK_31 after Phase 1A complete.

**Note**: Since Agency closely mirrors Academy, task cards will be shorter and reference Academy cards as templates.
