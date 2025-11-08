# MASTER IMPLEMENTATION GUIDE

## Auth Consolidation & Infrastructure

**Version**: 1.0  
**Created**: 2025-01-08  
**Total Duration**: 4 weeks  
**Team**: 2-3 LLM Coding Agents (parallel execution)

---

## QUICK REFERENCE

### Phase Documents Location

All detailed phase requirements are in `/docs/implementation/`:

- ✅ **PHASE_1A_AUTH_PACKAGES.md** - Auth server, utils, OAuth packages (5 days)
- ✅ **PHASE_1B_EMAIL_PACKAGE.md** - Email infrastructure package (3 days)
- **PHASE_1C_SENTRY_PACKAGE.md** - Sentry integration package (2 days)
- **PHASE_2_ACADEMY_AUTH.md** - Academy app authentication (5 days)
- **PHASE_3_AGENCY_AUTH.md** - Agency app authentication (5 days)
- **PHASE_4_REFACTORING.md** - Hub & Editorial refactoring (3 days)
- **PHASE_5_EMAIL_INTEGRATION.md** - Email in all apps (5 days)
- **PHASE_6_SENTRY_INTEGRATION.md** - Sentry in all apps (3 days)
- **PHASE_7_ADVANCED_FEATURES.md** - Access control, caching, tooling (5 days)

### Evaluation Documents (Context)

- `/docs/evaluations/EMAIL-IMPLEMENTATION.md` - Email architecture decisions
- `/docs/evaluations/SENTRY-INTEGRATION.md` - Sentry integration strategy

---

## PARALLEL EXECUTION STRATEGY

### Week 1: Foundation Packages (Parallel)

```
Agent 1 → Phase 1A: Auth Packages (@cenie/auth-server, @cenie/auth-utils, @cenie/oauth-handlers)
          ├─ Day 1-2: @cenie/auth-server extraction
          ├─ Day 3: @cenie/auth-utils creation
          ├─ Day 4-5: @cenie/oauth-handlers extraction
          └─ Testing: Editorial regression, Hub OAuth

Agent 2 → Phase 1B: Email Package (@cenie/email)
          ├─ Day 1: Core sender + Resend provider
          ├─ Day 2: Template rendering + base layout
          ├─ Day 3: Testing & documentation
          └─ DNS setup coordination

Agent 3 → Phase 1C: Sentry Package (@cenie/sentry)
          ├─ Day 1: Sentry transport + logger integration
          ├─ Day 2: Error enrichment + testing
          └─ Free for Phase 5 prep
```

**Coordination Point**: End of Week 1

- All 3 agents demo their packages
- Integration smoke tests
- Merge all packages to main branch

### Week 2: New App Implementation (Parallel)

```
Agent 1 → Phase 2: Academy Authentication
          ├─ Day 1: Sign-in/sign-up pages + OAuth
          ├─ Day 2: Session management + access check endpoint
          ├─ Day 3: Dashboard protection + role middleware
          ├─ Day 4-5: Student/Instructor dashboards + testing

Agent 2 → Phase 3: Agency Authentication
          ├─ Day 1: Sign-in/sign-up pages + OAuth
          ├─ Day 2: Session management + access check endpoint
          ├─ Day 3: Dashboard protection + role middleware
          ├─ Day 4-5: Client/Manager dashboards + testing

Agent 3 → Phase 5: Email Integration (can start early)
          ├─ Day 1-2: Hub email config + templates
          ├─ Day 3-4: Editorial email config + templates
          └─ Day 5: Initial testing
```

**Coordination Point**: End of Week 2

- Academy demo with full auth flow
- Agency demo with full auth flow
- Cross-app SSO testing
- Access control verification

### Week 3: Refactoring & Email (Mixed)

```
Agent 1 → Phase 4A: Hub Refactoring
          ├─ Day 1: Replace auth-middleware with @cenie/auth-server
          ├─ Day 2: Migrate OAuth to @cenie/oauth-handlers
          └─ Day 3: Testing + cleanup

Agent 2 → Phase 4B: Editorial Refactoring
          ├─ Day 1: Replace auth-helpers with @cenie/auth-server
          ├─ Day 2: Update API routes to use new middleware
          └─ Day 3: Testing + cleanup

Agent 3 → Phase 5: Email Integration (continued)
          ├─ Day 1-2: Academy email config + templates
          ├─ Day 3-4: Agency email config + templates
          └─ Day 5: Email verification flow implementation
```

**Coordination Point**: End of Week 3

- Hub and Editorial fully migrated
- All apps can send branded emails
- Email verification working

### Week 4: Monitoring & Polish

```
Agent 1 → Phase 6: Sentry Integration
          ├─ Day 1: Sentry in Hub + Editorial
          ├─ Day 2: Sentry in Academy + Agency
          └─ Day 3: Alert configuration + testing

Agent 2 → Phase 7: Advanced Features
          ├─ Day 1: Custom claims implementation
          ├─ Day 2: Access control caching
          ├─ Day 3: Access management CLI
          ├─ Day 4: Session device tracking (optional)
          └─ Day 5: Documentation + polish

Agent 3 → Testing & Documentation
          ├─ Integration testing across all apps
          ├─ Performance testing
          ├─ Documentation review
          └─ Deployment preparation
```

**Final Coordination**: End of Week 4

- Full system demo
- Load testing results
- Production deployment plan
- Handoff documentation

---

## PHASE SUMMARIES

### Phase 1A: Auth Packages (Agent 1, 5 days)

**Deliverables:**

- `@cenie/auth-server` - Session management, middleware, helpers
- `@cenie/auth-utils` - Role hierarchy, access control, caching
- `@cenie/oauth-handlers` - Google/Apple OAuth, account linking

**Key Requirements:**

- Extract from Editorial's `lib/auth-helpers.ts` (proven patterns)
- Extract from Hub's OAuth implementation (account linking)
- Use @cenie/errors and @cenie/logger consistently
- Maintain compatibility with Editorial and Hub

**Success Criteria:**

- Editorial continues working (regression test)
- Hub OAuth still functional
- All TypeScript strict mode passing

**See**: PHASE_1A_AUTH_PACKAGES.md (full 20+ page specification)

### Phase 1B: Email Package (Agent 2, 3 days)

**Deliverables:**

- `@cenie/email` - Email sender, Resend provider, template rendering

**Key Requirements:**

- Provider abstraction (Resend primary, SendGrid fallback)
- React Email for templates
- Bulk sending with batching
- Template rendering with brand injection

**Success Criteria:**

- Can send emails via Resend
- Templates render correctly
- Bulk sending works
- Error handling comprehensive

**See**: PHASE_1B_EMAIL_PACKAGE.md (full specification with DNS setup)

### Phase 1C: Sentry Package (Agent 3, 2 days)

**Deliverables:**

- `@cenie/sentry` - Sentry transport for logger, error enrichment

**Key Requirements:**

- Transport implementation for @cenie/logger
- Automatic error capture from logger
- Request context enrichment
- Breadcrumb capture from info/debug logs
- Environment-specific behavior (dev vs prod)

**Architecture:**

```typescript
// @cenie/logger gets new transport
import { SentryTransport } from '@cenie/sentry'

const logger = createLogger({
  name: 'my-app',
  transports: [new ConsoleTransport(), new SentryTransport({ dsn: process.env.SENTRY_DSN })],
})

// Errors logged automatically go to Sentry
logger.error('Something failed', { userId, action })
```

**Success Criteria:**

- Errors flow to Sentry automatically
- Context captured correctly
- No impact on existing logger usage
- DSN configuration per app

**Reference**: /docs/evaluations/SENTRY-INTEGRATION.md

### Phase 2: Academy Authentication (Agent 1, 5 days)

**Deliverables:**

- Sign-in/sign-up pages with Academy branding
- Session management API route
- Access check endpoint
- Role-based middleware (student, instructor, admin)
- Protected dashboard routes
- Student and Instructor dashboards

**Key Requirements:**

- Use @cenie/auth-server for all server auth
- Use @cenie/oauth-handlers for Google/Apple
- Academy blue theme (from @cenie/ui/graphics/LogoAcademy)
- Session cookies (14-day, httpOnly)
- Firestore access check for 'academy' app
- Role hierarchy: student (1), instructor (2), admin (3)

**Routes to Create:**

```
/sign-in - Sign-in page with OAuth
/sign-up - Sign-up page with OAuth
/dashboard - Student dashboard (requires student role)
/dashboard/courses - Course management (requires instructor role)
/api/auth/session - Session creation endpoint
/api/users/apps/academy/access - Access check endpoint
```

**Success Criteria:**

- Students can sign up and access courses
- Instructors can manage courses
- OAuth works (Google + Apple)
- Sessions persist correctly
- Role enforcement working

### Phase 3: Agency Authentication (Agent 2, 5 days)

**Deliverables:**

- Same as Academy but with Agency branding and roles

**Agency Roles:**

- client: Can browse templates, manage their projects
- manager: Can create templates, manage clients
- admin: Full system access

**Routes to Create:**

```
/sign-in - Sign-in page
/sign-up - Sign-up page
/dashboard - Client dashboard
/dashboard/templates - Template management (requires manager role)
/api/auth/session - Session endpoint
/api/users/apps/agency/access - Access check endpoint
```

**Success Criteria:**

- Clients can access their projects
- Managers can create templates
- OAuth working
- Session management working

### Phase 4: Hub & Editorial Refactoring (Agent 1 & 2, 3 days each)

**Hub Refactoring (Agent 1):**

- Replace `lib/auth-middleware.ts` with @cenie/auth-server imports
- Migrate OAuth components to @cenie/oauth-handlers
- Update all API routes to use new middleware
- Test all existing flows (no breaking changes)

**Editorial Refactoring (Agent 2):**

- Delete `lib/auth-helpers.ts`
- Import from @cenie/auth-server instead
- Update all API routes
- Test book management, contributor management

**Critical:**

- Zero functionality changes
- Zero breaking changes
- Comprehensive regression testing
- These are refactors, not rewrites

**Success Criteria:**

- Hub: All auth flows working
- Editorial: All workflows working (books, catalog, contributors)
- No new bugs introduced
- Code is cleaner (less duplication)

### Phase 5: Email Integration (Agent 3, 5 days)

**Deliverables:**

- Email configuration for all 4 apps
- Branded templates for common emails (verification, reset, welcome)
- App-specific templates
- Email verification flow
- Password reset flow

**Per-App Work:**

Each app needs:

```
apps/[app]/src/email/
├── config.ts - Brand configuration (colors, fonts, logos)
├── sender.ts - App-specific EmailSender instance
└── templates/
    ├── verification.tsx - Branded verification email
    ├── password-reset.tsx - Branded password reset
    └── welcome.tsx - Branded welcome email
```

**Integration Points:**

- Update `/api/auth/send-verification` to actually send emails
- Update `/api/auth/reset-password` to send reset emails
- Send welcome email on signup

**DNS Setup Required:**

- Verify 4 subdomains in Resend dashboard
- Configure SPF, DKIM, DMARC for each
- Test deliverability

**Success Criteria:**

- All apps can send branded emails
- Email verification flow works
- Password reset flow works
- Deliverability good (inbox, not spam)

### Phase 6: Sentry Integration (Agent 1, 3 days)

**Deliverables:**

- Sentry configured in all 4 apps
- Error tracking working
- Performance monitoring enabled
- Source maps uploaded
- Alert configuration

**Per-App Work:**

1. Add `instrumentation.ts` file (Next.js 15 convention)
2. Add Sentry DSN to environment variables
3. Configure `@sentry/nextjs` in `next.config`
4. Test error capture

**Configuration:**

```typescript
// instrumentation.ts
import * as Sentry from '@sentry/nextjs'
import { SentryTransport } from '@cenie/sentry'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% performance tracking
  integrations: [
    // App-specific integrations
  ],
})

// Logger already configured with SentryTransport from Phase 1C
```

**Success Criteria:**

- Errors appear in Sentry dashboard
- Source maps working (readable stack traces)
- Performance data collecting
- Alerts configured for critical errors

### Phase 7: Advanced Features (Agent 2, 5 days)

**Deliverables:**

- Custom claims for offline access checks
- Access control caching (5-min TTL)
- Access management CLI tool
- Session device tracking (optional)
- Comprehensive documentation

**Custom Claims Implementation:**

```typescript
// When granting access, update custom claims:
await admin.auth().setCustomUserClaims(userId, {
  apps: ['hub', 'academy'],
  roles: {
    hub: 'user',
    academy: 'student',
  },
})

// Apps can check access from ID token (offline):
const token = await user.getIdToken()
const decoded = await admin.auth().verifyIdToken(token)
if (decoded.apps?.includes('academy')) {
  // Has academy access
}
```

**Access Control Caching:**

```typescript
// @cenie/auth-utils cache implementation
const cache = new Map()

async function checkAccess(userId, appName) {
  const key = `${userId}:${appName}`
  const cached = cache.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  const data = await fetchFromFirestore(userId, appName)
  cache.set(key, { data, expiresAt: Date.now() + 300000 }) // 5 min
  return data
}
```

**CLI Tool:**

```bash
# scripts/manage-access.ts
pnpm manage-access grant user@example.com academy student
pnpm manage-access revoke user@example.com editorial
pnpm manage-access list academy
pnpm manage-access sync-claims user@example.com
```

**Success Criteria:**

- Custom claims reducing Firestore queries
- Cache hit rate > 80%
- CLI tool functional
- Documentation complete

---

## COORDINATION CHECKPOINTS

### Daily Standups (Async)

Each agent posts to shared document:

- Yesterday: What was completed
- Today: What will be worked on
- Blockers: Any dependencies or issues

### Weekly Demos

End of each week:

- Live demonstration of deliverables
- Integration testing
- Issue triage
- Next week planning

### Code Reviews

- Each phase requires approval before merge
- Review checklist:
  - TypeScript strict mode passing
  - Linting clean (zero warnings)
  - Tests passing
  - Documentation complete
  - No breaking changes

---

## TESTING STRATEGY

### Unit Tests

- All shared packages have unit tests
- Test coverage > 80%
- Mock Firebase/Firestore for fast tests

### Integration Tests

- Test actual Firebase/Firestore connections
- Use test project, not production
- Test cross-package integrations

### Regression Tests

- Editorial must continue working throughout
- Hub must continue working throughout
- No functionality should break

### E2E Tests (Final Week)

- Full user journeys:
  - Sign up → Email verification → Dashboard access
  - OAuth signup → Account linking → Access across apps
  - Password reset flow
  - Role-based access enforcement
- Test across all 4 apps

---

## DEPLOYMENT STRATEGY

### Staging Deployment (End of Week 3)

- Deploy all apps to staging environment
- Test with staging Firebase project
- Invite team for UAT
- Fix bugs before production

### Production Rollout (Week 4)

- **Phase 1**: Academy & Agency (new apps, low risk)
  - Deploy to production
  - Monitor errors in Sentry
  - User feedback collection
- **Phase 2**: Editorial (existing app, refactored)
  - Deploy during low-traffic window
  - Gradual rollout (10% → 50% → 100% traffic)
  - Rollback plan ready
- **Phase 3**: Hub (central app, highest risk)
  - Deploy during maintenance window
  - Comprehensive testing before full release
  - Monitor authentication metrics

### Monitoring Post-Launch

- Sentry error rates
- Authentication success rates
- Session creation times
- Email deliverability
- User feedback

---

## RISK MITIGATION

### Technical Risks

| Risk                               | Mitigation                                                  |
| ---------------------------------- | ----------------------------------------------------------- |
| Breaking Editorial during refactor | Comprehensive regression tests, gradual migration           |
| OAuth account linking bugs         | Extensive testing with multiple scenarios, error boundaries |
| Email deliverability issues        | DNS configuration checklist, deliverability testing         |
| Sentry overwhelming with errors    | Conservative sampling rates, alert filtering                |
| Performance degradation            | Benchmarking, caching, monitoring                           |

### Process Risks

| Risk                            | Mitigation                                             |
| ------------------------------- | ------------------------------------------------------ |
| Agent conflicts on shared files | Clear phase boundaries, coordination checkpoints       |
| Scope creep                     | Strict adherence to phase requirements, change control |
| Timeline slips                  | Parallel execution, critical path focus                |
| Knowledge gaps                  | Comprehensive documentation, context documents         |

---

## SUCCESS METRICS

### Completion Criteria

- [ ] All 4 apps have functional authentication
- [ ] OAuth working in all apps (Google + Apple)
- [ ] Email sending working (verification, reset, welcome)
- [ ] Sentry capturing errors across all apps
- [ ] All apps using shared packages (@cenie/auth-server, @cenie/email, @cenie/sentry)
- [ ] Zero high-severity bugs in production
- [ ] Documentation complete

### Quality Metrics

- TypeScript strict mode: 100% passing
- Linting warnings: 0
- Test coverage: > 80% for shared packages
- Performance: Session creation < 500ms
- Uptime: > 99.9% during rollout

### Code Reuse Metrics

- Before: ~600-800 lines duplicated auth code
- After: < 100 lines duplicated
- Reduction: > 85%

---

## FINAL DELIVERABLES

### Code

- 5 new shared packages
- 2 new authenticated apps (Academy, Agency)
- 2 refactored apps (Hub, Editorial)
- Branded email templates (12+ templates across apps)
- Access management tooling

### Documentation

- Phase implementation guides (7 documents)
- API documentation for shared packages
- Architecture decision records
- Deployment runbooks
- Troubleshooting guides

### Infrastructure

- Sentry projects configured (4 apps)
- Resend domains verified (4 subdomains)
- DNS records configured
- Monitoring dashboards
- Alert configurations

---

## GETTING STARTED

### For Agent 1 (Auth Lead)

1. Read PHASE_1A_AUTH_PACKAGES.md (comprehensive spec)
2. Study Editorial's `lib/auth-helpers.ts` (your blueprint)
3. Study Hub's OAuth implementation
4. Begin extraction of `@cenie/auth-server` package
5. Coordinate with Agent 2 & 3 on shared types

### For Agent 2 (Email Lead)

1. Read PHASE_1B_EMAIL_PACKAGE.md
2. Read /docs/evaluations/EMAIL-IMPLEMENTATION.md (architecture decisions)
3. Set up Resend account access
4. Begin `@cenie/email` package creation
5. Coordinate DNS configuration

### For Agent 3 (Monitoring Lead)

1. Read Sentry package requirements
2. Read /docs/evaluations/SENTRY-INTEGRATION.md
3. Set up Sentry project access
4. Begin `@cenie/sentry` package creation
5. Plan integration with @cenie/logger

---

## SUPPORT & ESCALATION

### Technical Blockers

- Document in shared issue tracker
- Tag affected agents
- Daily blocker review

### Architectural Decisions

- Propose in shared document
- Get approval before implementation
- Document decision rationale

### Scope Changes

- Require explicit approval
- Impact analysis required
- Timeline adjustment needed

---

This master guide coordinates all implementation efforts. Each agent should:

1. Read their assigned phase documentation thoroughly
2. Follow coordination checkpoints
3. Update progress daily
4. Request help when blocked
5. Test comprehensively before marking complete

**Let's build great authentication infrastructure!** 🚀
