# TASK 3-1 through 3-5: Complete Agency Authentication (Consolidated)

**Phase**: 3 - Agency Authentication  
**Duration**: 5 days  
**Dependencies**: Phase 1A complete  
**Pattern**: Mirrors Academy (Phase 2) with branding/role changes

---

## OBJECTIVE

Implement complete authentication for Agency app by following the exact same pattern as Academy (Phase 2) but with Agency-specific branding, roles, and business context.

**What You're Building**: All 5 Agency tasks in one consolidated guide.

**Why Consolidated**: Agency implementation is nearly identical to Academy - same auth packages, same patterns, only branding and roles differ. A single comprehensive guide is more efficient than 5 repetitive cards.

---

## IMPLEMENTATION STRATEGY

**Follow Academy as Template**: For each task, copy the Academy implementation and make these substitutions:

| Academy            | Agency                 |
| ------------------ | ---------------------- |
| `apps/academy/`    | `apps/agency/`         |
| Port 3002          | Port 3003              |
| `'academy'`        | `'agency'`             |
| `ACADEMY_CONFIG`   | `AGENCY_CONFIG`        |
| `student`          | `client`               |
| `instructor`       | `manager`              |
| Blue theme         | Dark/modern theme      |
| Educational tone   | Professional tone      |
| "Learning journey" | "Automation solutions" |
| "Courses"          | "Templates"            |
| "Enrolled"         | "Active projects"      |

**All authentication logic stays the same** - just context changes.

---

## AGENCY-SPECIFIC CONFIGURATION

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
    maxAge: 14 * 24 * 60 * 60,
  },

  defaultRole: 'client' as const,

  roles: {
    client: {
      displayName: 'Client',
      dashboardPath: '/dashboard',
      description: 'Access to templates and projects',
    },
    manager: {
      displayName: 'Template Manager',
      dashboardPath: '/dashboard/templates',
      description: 'Create and manage automation templates',
    },
    admin: {
      displayName: 'Administrator',
      dashboardPath: '/dashboard/admin',
      description: 'Full system administration',
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

## TASK 3-1: AGENCY SIGN-IN/SIGN-UP PAGES

### Reference

**Copy from**: `TASK_21_ACADEMY_SIGNIN_PAGES.md` + `apps/academy/src/app/(auth)/`

### Create

```
apps/agency/src/app/
├── (auth)/
│   ├── layout.tsx
│   ├── sign-in/
│   │   └── page.tsx
│   └── sign-up/
│       └── page.tsx
```

### Agency Branding Customizations

**Layout** (`(auth)/layout.tsx`):

```typescript
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
```

**Sign-In Page Heading**:

```typescript
<h1>Welcome to Agency</h1>
<p>Access your automation solutions</p>
```

**Sign-Up Page Heading**:

```typescript
<h1>Start Automating</h1>
<p>Join the future of work automation</p>
```

**Button Colors**:

```css
className="bg-slate-700 hover:bg-slate-600"
```

**All other logic**: Identical to Academy (OAuth, email/password, error handling, access check, session creation).

### Test

1. Visit <http://localhost:3003/sign-in>
2. Sign in with email or OAuth
3. Should redirect to client dashboard

---

## TASK 3-2: AGENCY SESSION & ACCESS API

### Reference

**Copy from**: `TASK_22_ACADEMY_SESSION_API.md` + `apps/academy/src/app/api/`

### Create

```
apps/agency/src/app/api/
├── auth/
│   ├── session/
│   │   └── route.ts
│   └── oauth/
│       └── route.ts
└── users/
    └── apps/
        └── agency/
            └── access/
                └── route.ts
```

### Changes from Academy

**In all routes**:

- appName: `'agency'` (not `'academy'`)
- Logger name: `'agency-session'`, `'agency-access'`, etc.
- Default role: `'client'` (not `'student'`)

**Everything else**: Identical logic.

### Test

```bash
# Session creation
curl -X POST http://localhost:3003/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_TOKEN"}'

# Access check
curl http://localhost:3003/api/users/apps/agency/access \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## TASK 3-3: AGENCY ROUTE PROTECTION

### Reference

**Copy from**: `TASK_23_ACADEMY_PROTECTION.md` + `apps/academy/src/middleware.ts`

### Create

```
apps/agency/src/middleware.ts
```

### Changes from Academy

**Public routes**:

```typescript
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/templates', // Browse templates (public)
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]
```

**Protected paths**:

```typescript
const protectedPaths = ['/dashboard', '/projects', '/my-templates']
```

**Everything else**: Identical middleware logic.

### Test

1. Unauthenticated → /dashboard → redirects to /sign-in ✓
2. Authenticated → /dashboard → loads ✓
3. Public routes always accessible ✓

---

## TASK 3-4: AGENCY CLIENT DASHBOARD

### Reference

**Copy from**: `TASK_24_ACADEMY_DASHBOARDS.md` (student dashboard section)

### Create

```
apps/agency/src/
├── app/dashboard/
│   ├── layout.tsx
│   └── page.tsx
└── components/dashboard/
    └── nav.tsx
```

### Dashboard Content (Client View)

**Stats Cards**:

- Active Projects: 0
- Templates Used: 0
- Automations Running: 0
- This Month's Savings: $0

**Main Content**:

```typescript
<section>
  <h2>My Projects</h2>
  <EmptyState
    icon={Briefcase}
    title="No projects yet"
    description="Browse templates to start your first automation project"
    action={{ label: "Browse Templates", href: "/templates" }}
  />
</section>
```

**Navigation Links (Client)**:

- Dashboard
- My Projects
- Browse Templates
- Profile

### Test

1. Sign in as client
2. Visit /dashboard
3. Should see client stats and navigation
4. Should NOT see manager links

---

## TASK 3-5: AGENCY MANAGER DASHBOARD

### Reference

**Copy from**: `TASK_24_ACADEMY_DASHBOARDS.md` (instructor dashboard section)

### Create

```
apps/agency/src/app/dashboard/
├── templates/
│   ├── page.tsx (NEW - manager template management)
│   └── new/
│       └── page.tsx (NEW - create template form)
└── clients/
    └── page.tsx (NEW - client management)
```

### Dashboard Content (Manager View)

**Stats Cards**:

- Active Templates: 0
- Total Clients: 0
- Avg Project Value: $0
- Templates This Month: 0

**Main Content**:

```typescript
<section>
  <h2>Manage Templates</h2>
  <Button href="/dashboard/templates/new">
    Create Template
  </Button>

  <EmptyState
    title="No templates yet"
    description="Create your first automation template"
  />
</section>
```

**Navigation Links (Manager)**:

- Dashboard (client view)
- My Projects
- **Manage Templates** (manager only)
- **Clients** (manager only)
- **Analytics** (manager only)
- Profile

### Test

1. Grant manager role in Firestore
2. Sign in
3. Visit /dashboard/templates
4. Should load manager interface
5. Navigation should show manager links

**As client**:

1. Try /dashboard/templates
2. Should redirect to /dashboard (403 or redirect)

---

## COMPLETE TESTING CHECKLIST

After all 5 tasks complete, test Agency end-to-end:

- [ ] **Sign-up**: Email and OAuth working
- [ ] **Sign-in**: Email and OAuth working
- [ ] **Sessions**: Persist across browser restarts
- [ ] **Client Dashboard**: Accessible with client role
- [ ] **Manager Dashboard**: Accessible with manager role, blocked for clients
- [ ] **Navigation**: Shows appropriate links based on role
- [ ] **Route Protection**: Middleware redirects unauthenticated users
- [ ] **API Protection**: API routes enforce roles
- [ ] **Logout**: Clears session and redirects
- [ ] **Account Linking**: Handles OAuth conflicts

---

## BRANDING GUIDELINES

### Agency Visual Identity

**Color Palette**:

```css
:root {
  --agency-primary: #0f172a; /* Slate-900 */
  --agency-accent: #0ea5e9; /* Sky-500 */
  --agency-bg: #1e293b; /* Slate-800 */
  --agency-text: #f8fafc; /* Slate-50 */
}
```

**Typography**:

- Headings: Bold, uppercase (professional)
- Body: Clean sans-serif
- Buttons: Uppercase labels

**Tone of Voice**:

- Professional, direct, results-focused
- "Automate", "Optimize", "Scale"
- Not: "Learn", "Discover", "Journey"

**UI Style**:

- Dark mode aesthetic
- Sharp corners (not rounded like Academy)
- Monochrome with accent colors
- Data-driven visuals (charts, metrics)

---

## DELIVERABLES

After 5 days of implementation:

**Files Created** (~20 files):

- Authentication pages (sign-in, sign-up)
- API routes (session, access, OAuth)
- Middleware (route protection)
- Dashboards (client, manager, admin)
- Components (navigation, stats, etc.)
- Helpers (auth, constants)

**Features Working**:

- Full authentication (email + OAuth)
- Session management
- Access control
- Role-based dashboards
- Protected routes

**Quality**:

- TypeScript strict mode ✓
- Linting clean ✓
- Tested end-to-end ✓
- Documentation inline ✓

---

## TIME ALLOCATION

**Day 1**: Sign-in/sign-up pages (TASK_3-1)

- 3 hours: Copy Academy pages
- 2 hours: Apply Agency branding
- 2 hours: Testing
- 1 hour: Refinement

**Day 2**: Session & Access API (TASK_3-2)

- 2 hours: Copy API routes
- 1 hour: Customize for Agency
- 2 hours: Testing
- 1 hour: Integration testing

**Day 3**: Route Protection (TASK_3-3)

- 2 hours: Middleware implementation
- 2 hours: Auth helpers
- 2 hours: Testing
- 2 hours: End-to-end flow

**Day 4**: Client Dashboard (TASK_3-4)

- 3 hours: Dashboard layout
- 2 hours: Navigation component
- 2 hours: Client content
- 1 hour: Testing

**Day 5**: Manager Dashboard (TASK_3-5)

- 3 hours: Manager pages
- 2 hours: Template management UI
- 2 hours: Client management UI
- 1 hour: Final testing

---

## SUCCESS CRITERIA

- [ ] All authentication flows working
- [ ] Three roles implemented and enforced
- [ ] Dashboards functional and branded
- [ ] Route protection comprehensive
- [ ] OAuth integration complete
- [ ] Session management working
- [ ] No regressions in Academy (if shared packages modified)
- [ ] TypeScript and linting clean
- [ ] Ready for production use

---

## HANDOFF

**Phase 3 Complete** means:

- Academy (Phase 2) ✓
- Agency (Phase 3) ✓
- **Both new apps fully authenticated** ✓

**Next**: Phase 4 refactors Hub and Editorial to use the same shared packages.

---

**Estimated Time**: 5 days (40 hours total work)

**Efficiency Note**: Following Academy's pattern closely allows for rapid implementation. Most work is copy-paste-customize, not greenfield development.
