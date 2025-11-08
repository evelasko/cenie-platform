# AUTH CONSOLIDATION & INFRASTRUCTURE IMPLEMENTATION PLAN

**Version**: 1.0  
**Created**: 2025-01-08  
**Status**: Ready for Agent Execution  
**Timeline**: 4 weeks (with parallel execution)

---

## EXECUTIVE SUMMARY

This document provides a complete, agent-executable implementation plan for:

- **Authentication consolidation** across Hub, Editorial, Academy, and Agency apps
- **Email infrastructure** with branded transactional emails
- **Sentry integration** for production monitoring
- **Advanced auth features** (access control, OAuth, session management)

The plan is organized into **7 discrete phases** designed for sequential and parallel execution by multiple LLM coding agents.

---

## PHASE EXECUTION STRATEGY

### Parallel Execution Timeline

```
Week 1:
├─ Phase 1A: Auth Packages        [Agent 1] ▓▓▓▓▓▓▓▓▓▓ (Days 1-5)
├─ Phase 1B: Email Package        [Agent 2] ▓▓▓▓▓▓ (Days 1-3)
└─ Phase 1C: Sentry Package       [Agent 3] ▓▓▓▓ (Days 1-2)

Week 2:
├─ Phase 2: Academy Auth          [Agent 1] ▓▓▓▓▓▓▓▓▓▓ (Days 6-10)
└─ Phase 3: Agency Auth           [Agent 2] ▓▓▓▓▓▓▓▓▓▓ (Days 6-10)

Week 3:
├─ Phase 4A: Hub Refactoring      [Agent 1] ▓▓▓▓▓ (Days 11-13)
├─ Phase 4B: Editorial Refactor   [Agent 2] ▓▓▓▓▓ (Days 11-13)
└─ Phase 5: Email Integration     [Agent 3] ▓▓▓▓▓▓▓▓▓▓ (Days 11-15)

Week 4:
├─ Phase 6: Sentry Integration    [Agent 1] ▓▓▓▓▓ (Days 16-18)
└─ Phase 7: Advanced Features     [Agent 2] ▓▓▓▓▓▓▓▓▓▓ (Days 16-20)
```

### Phase Dependencies

```
Phase 1A (Auth Packages) ──┬──> Phase 2 (Academy)
                           ├──> Phase 3 (Agency)
                           └──> Phase 4 (Hub/Editorial)

Phase 1B (Email) ────────────> Phase 5 (Email Integration)

Phase 1C (Sentry) ───────────> Phase 6 (Sentry Integration)

Phase 2 + Phase 3 ───────────> Phase 7 (Advanced Features)
```

---

## CRITICAL CONTEXT FOR ALL AGENTS

### Existing Infrastructure (DO NOT RECREATE)

**Packages that EXIST and are WORKING:**

- `@cenie/errors` - Error handling with AppError hierarchy
- `@cenie/logger` - Structured logging with server/client exports
- `@cenie/firebase` - Firebase client and server SDK wrappers
- `@cenie/supabase` - PostgreSQL database client (NOT for auth)
- `@cenie/ui` - Component library with Radix UI

**Packages that DO NOT EXIST (need creation):**

- `@cenie/auth-server` - Server-side auth utilities
- `@cenie/auth-utils` - Common auth utilities
- `@cenie/oauth-handlers` - OAuth flow handlers
- `@cenie/email` - Email sending infrastructure
- `@cenie/sentry` - Sentry monitoring integration

### Authentication Architecture (CURRENT REALITY)

**NOT centralized through Hub API** - Each app authenticates directly with Firebase:

```
App (Browser) → Firebase Auth → Firebase ID Token → App Server
                                                   ↓
                                           Firestore (access check)
```

**Hub's Role**: Provides access management UI, NOT an authentication proxy.

**Firestore Collections:**

- `profiles` - User profile data
- `user_app_access` - App permissions with roles

**App-Specific Roles:**

- Hub: `user`, `admin`
- Editorial: `viewer`, `editor`, `admin`
- Academy: `student`, `instructor`, `admin`
- Agency: `client`, `manager`, `admin`

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4
- **Auth Provider**: Firebase Auth (committed for 2-3 years)
- **Database**: Supabase PostgreSQL (data) + Firebase Firestore (auth data)
- **Email**: Resend (API key already configured)
- **Monitoring**: Sentry (to be integrated)
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo

### Critical Decisions Already Made

✅ Firebase-only for authentication (no provider abstraction needed)  
✅ Distributed auth (apps authenticate directly, not through Hub)  
✅ Minimal extraction (discover patterns, don't design upfront)  
✅ Server-side sessions (httpOnly cookies, like Editorial)  
✅ Hybrid access control (custom claims + Firestore with caching)  
✅ Shared email operations, branded templates per app  
✅ Sentry via logger transport (not scattered throughout code)

---
