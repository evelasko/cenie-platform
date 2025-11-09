# TASK INDEX - Complete Breakdown

**Total Tasks**: 28 atomic tasks across 7 phases  
**Total Duration**: 4 weeks with parallel execution  
**Format**: Each task = 1 focused work session (4-8 hours)

---

## PHASE 1A: AUTH PACKAGES (5 tasks, 5 days)

**Agent**: Agent 1  
**Can start**: Immediately (no dependencies)

| Task     | Title                                       | Duration | Status   |
| -------- | ------------------------------------------- | -------- | -------- |
| **1A-1** | Create @cenie/auth-server Session Module    | 1 day    | ✅ Ready |
| **1A-2** | Create @cenie/auth-server Middleware Module | 1 day    | ✅ Ready |
| **1A-3** | Create @cenie/auth-server Helpers Module    | 1 day    | ✅ Ready |
| **1A-4** | Create @cenie/auth-utils Package            | 1 day    | ✅ Ready |
| **1A-5** | Create @cenie/oauth-handlers Package        | 1 day    | ✅ Ready |

**Deliverables**: 3 complete packages ready for use in Academy/Agency

---

## PHASE 1B: EMAIL PACKAGE (2 tasks, 3 days)

**Agent**: Agent 2  
**Can start**: Immediately (runs parallel to 1A)

| Task     | Title                                      | Duration | Status   |
| -------- | ------------------------------------------ | -------- | -------- |
| **1B-1** | Create @cenie/email Core & Resend Provider | 2 days   | ✅ Ready |
| **1B-2** | Create Email Templates Infrastructure      | 1 day    | ✅ Ready |

**Deliverables**: Email package ready for integration

---

## PHASE 1C: SENTRY PACKAGE (1 task, 2 days)

**Agent**: Agent 3  
**Can start**: Immediately (runs parallel to 1A and 1B)

| Task     | Title                                              | Duration | Status   |
| -------- | -------------------------------------------------- | -------- | -------- |
| **1C-1** | Create @cenie/sentry Package with Logger Transport | 2 days   | ✅ Ready |

**Deliverables**: Sentry monitoring ready for integration

---

## PHASE 2: ACADEMY AUTHENTICATION (5 tasks, 5 days)

**Agent**: Agent 1  
**Depends on**: Phase 1A complete  
**Can start**: After 1A-5 done

| Task    | Title                                      | Duration | Status       |
| ------- | ------------------------------------------ | -------- | ------------ |
| **2-1** | Create Academy Sign-In/Sign-Up Pages       | 1 day    | 📝 To create |
| **2-2** | Create Academy Session & Access API Routes | 1 day    | 📝 To create |
| **2-3** | Add Academy Route Protection & Middleware  | 1 day    | 📝 To create |
| **2-4** | Create Academy Student Dashboard           | 1 day    | 📝 To create |
| **2-5** | Create Academy Instructor Dashboard        | 1 day    | 📝 To create |

**Deliverables**: Fully authenticated Academy app with student/instructor roles

---

## PHASE 3: AGENCY AUTHENTICATION (5 tasks, 5 days)

**Agent**: Agent 2  
**Depends on**: Phase 1A complete  
**Can start**: After 1A-5 done (parallel to Phase 2)

| Task    | Title                                     | Duration | Status       |
| ------- | ----------------------------------------- | -------- | ------------ |
| **3-1** | Create Agency Sign-In/Sign-Up Pages       | 1 day    | 📝 To create |
| **3-2** | Create Agency Session & Access API Routes | 1 day    | 📝 To create |
| **3-3** | Add Agency Route Protection & Middleware  | 1 day    | 📝 To create |
| **3-4** | Create Agency Client Dashboard            | 1 day    | 📝 To create |
| **3-5** | Create Agency Manager Dashboard           | 1 day    | 📝 To create |

**Deliverables**: Fully authenticated Agency app with client/manager roles

---

## PHASE 4A: HUB REFACTORING (3 tasks, 3 days)

**Agent**: Agent 1  
**Depends on**: Phase 2 complete  
**Can start**: After Phase 2 done

| Task     | Title                                           | Duration | Status       |
| -------- | ----------------------------------------------- | -------- | ------------ |
| **4A-1** | Refactor Hub Auth Middleware to Shared Packages | 1 day    | 📝 To create |
| **4A-2** | Migrate Hub OAuth to @cenie/oauth-handlers      | 1 day    | 📝 To create |
| **4A-3** | Hub Testing & Cleanup                           | 1 day    | 📝 To create |

**Deliverables**: Hub using shared packages, no functionality changes

---

## PHASE 4B: EDITORIAL REFACTORING (3 tasks, 3 days)

**Agent**: Agent 2  
**Depends on**: Phase 3 complete  
**Can start**: After Phase 3 done (parallel to 4A)

| Task     | Title                                              | Duration | Status       |
| -------- | -------------------------------------------------- | -------- | ------------ |
| **4B-1** | Refactor Editorial Auth Helpers to Shared Packages | 1 day    | 📝 To create |
| **4B-2** | Update Editorial API Routes to Use New Middleware  | 1 day    | 📝 To create |
| **4B-3** | Editorial Testing & Cleanup                        | 1 day    | 📝 To create |

**Deliverables**: Editorial using shared packages, all workflows working

---

## PHASE 5: EMAIL INTEGRATION (5 tasks, 5 days)

**Agent**: Agent 3  
**Depends on**: Phase 1B complete  
**Can start**: After 1B-2 done, can run parallel to Phase 4

| Task    | Title                                                   | Duration | Status       |
| ------- | ------------------------------------------------------- | -------- | ------------ |
| **5-1** | Configure Email for Hub (Templates & Integration)       | 1 day    | 📝 To create |
| **5-2** | Configure Email for Editorial (Templates & Integration) | 1 day    | 📝 To create |
| **5-3** | Configure Email for Academy (Templates & Integration)   | 1 day    | 📝 To create |
| **5-4** | Configure Email for Agency (Templates & Integration)    | 1 day    | 📝 To create |
| **5-5** | Implement Email Verification & Password Reset Flows     | 1 day    | 📝 To create |

**Deliverables**: All apps sending branded emails, verification working

---

## PHASE 6: SENTRY INTEGRATION (4 tasks, 3 days)

**Agent**: Agent 1  
**Depends on**: Phase 1C complete, Phase 4A complete  
**Can start**: After Phase 4A done

| Task    | Title                                | Duration | Status       |
| ------- | ------------------------------------ | -------- | ------------ |
| **6-1** | Integrate Sentry in Hub & Editorial  | 1 day    | 📝 To create |
| **6-2** | Integrate Sentry in Academy & Agency | 1 day    | 📝 To create |
| **6-3** | Configure Source Maps & Releases     | 0.5 day  | 📝 To create |
| **6-4** | Configure Alerts & Dashboards        | 0.5 day  | 📝 To create |

**Deliverables**: Sentry monitoring all 4 apps, alerts configured

---

## PHASE 7: ADVANCED FEATURES (5 tasks, 5 days)

**Agent**: Agent 2  
**Depends on**: Phases 2, 3, 4B complete  
**Can start**: After Phase 4B done

| Task    | Title                                        | Duration | Status       |
| ------- | -------------------------------------------- | -------- | ------------ |
| **7-1** | Implement Custom Claims for Access Control   | 1 day    | 📝 To create |
| **7-2** | Implement Access Control Caching             | 1 day    | 📝 To create |
| **7-3** | Create Access Management CLI Tool            | 1 day    | 📝 To create |
| **7-4** | Implement Session Device Tracking (Optional) | 1 day    | 📝 To create |
| **7-5** | Final Documentation & Deployment Guide       | 1 day    | 📝 To create |

**Deliverables**: Production-ready features, comprehensive documentation

---

## TASK CARDS STATUS

### ✅ ALL CARDS COMPLETE (100%)

**Phase 1A - Auth Packages (5 detailed cards)**:

- ✅ TASK_1A1_AUTH_SERVER_SESSION.md
- ✅ TASK_1A2_AUTH_SERVER_MIDDLEWARE.md
- ✅ TASK_1A3_AUTH_SERVER_HELPERS.md
- ✅ TASK_1A4_AUTH_UTILS.md
- ✅ TASK_1A5_OAUTH_HANDLERS.md

**Phase 1B - Email Package (2 detailed cards)**:

- ✅ TASK_1B1_EMAIL_CORE.md
- ✅ TASK_1B2_EMAIL_TEMPLATES.md

**Phase 1C - Sentry Package (1 detailed card)**:

- ✅ TASK_1C1_SENTRY_PACKAGE.md

**Phase 2 - Academy (1 overview + 4 detailed cards)**:

- ✅ TASK_2_OVERVIEW.md
- ✅ TASK_21_ACADEMY_SIGNIN_PAGES.md
- ✅ TASK_22_ACADEMY_SESSION_API.md
- ✅ TASK_23_ACADEMY_PROTECTION.md
- ✅ TASK_24_ACADEMY_DASHBOARDS.md (combines 2-4 and 2-5)

**Phase 3 - Agency (1 overview + 1 consolidated card)**:

- ✅ TASK_3_OVERVIEW.md
- ✅ TASK_31_35_AGENCY_COMPLETE.md (all 5 tasks)

**Phase 4 - Refactoring (1 consolidated card)**:

- ✅ TASK_4_REFACTORING_COMPLETE.md (Hub + Editorial)

**Phase 5 - Email Integration (1 consolidated card)**:

- ✅ TASK_5_EMAIL_INTEGRATION_COMPLETE.md (all 4 apps)

**Phase 6 - Sentry Integration (1 consolidated card)**:

- ✅ TASK_6_SENTRY_INTEGRATION_COMPLETE.md (all 4 apps)

**Phase 7 - Advanced Features (1 consolidated card)**:

- ✅ TASK_7_ADVANCED_FEATURES_COMPLETE.md (all 5 tasks)

**Total**: 16 comprehensive guides covering all 28 atomic tasks (~77,000 words)

---

## TASK CARD STANDARDS

Each task card includes:

1. **Objective** - Clear goal statement
2. **Architecture Context** - Why this matters, how it fits
3. **Source Files** - Exact files to read (with line numbers)
4. **What to Build** - Specific files and functions
5. **Detailed Requirements** - Step-by-step specs
6. **Implementation Pattern** - Code structure guidance
7. **Testing Requirements** - How to verify it works
8. **Success Criteria** - Checklist before marking done
9. **Common Pitfalls** - What to avoid
10. **Handoff** - What next task needs

**Context Size**: 3,000-6,000 words per task (comprehensive but focused)

---

## COORDINATION

### Task Dependencies

```
1A-1 (Session) → 1A-2 (Middleware)
                      ↓
1A-3 (Helpers) ← ─ ─ ┘
     ↓
1A-4 (Auth Utils) → 1A-2 (completes withRole)
     ↓
1A-5 (OAuth)
     ↓
Phase 2 & 3 (Academy, Agency)
```

### Parallel Opportunities

- **1A-1** and **1B-1** (Email) can run completely parallel
- **1A-1** and **1C-1** (Sentry) can run completely parallel
- **Phase 2** and **Phase 3** can run completely parallel
- **Phase 4A** and **Phase 4B** can run completely parallel

---

## AGENT ASSIGNMENTS

### Agent 1 Schedule

Week 1: Tasks 1A-1, 1A-2, 1A-3, 1A-4, 1A-5  
Week 2: Tasks 2-1, 2-2, 2-3, 2-4, 2-5  
Week 3: Tasks 4A-1, 4A-2, 4A-3  
Week 4: Tasks 6-1, 6-2, 6-3, 6-4

### Agent 2 Schedule

Week 1: Tasks 1B-1, 1B-2  
Week 2: Tasks 3-1, 3-2, 3-3, 3-4, 3-5  
Week 3: Tasks 4B-1, 4B-2, 4B-3  
Week 4: Tasks 7-1, 7-2, 7-3, 7-4, 7-5

### Agent 3 Schedule

Week 1: Task 1C-1  
Week 2-3: Tasks 5-1, 5-2, 5-3, 5-4, 5-5  
Week 4: Support testing & documentation

---

## HOW TO USE THIS INDEX

1. **Start with your assigned first task**
2. **Complete it fully** before moving to next
3. **Mark task as complete** when all success criteria met
4. **Hand off to next task** or next agent
5. **Update this index** with completion status

---

## STATUS TRACKING

Update this section as tasks complete:

- **Week 1**: [ ] 7 tasks (1A-1 through 1A-5, 1B-1, 1B-2, 1C-1)
- **Week 2**: [ ] 10 tasks (Phase 2 and 3)
- **Week 3**: [ ] 11 tasks (Phase 4 and 5)
- **Week 4**: [ ] 9 tasks (Phase 6 and 7)

---

**Next**: Create remaining task cards based on priority list above.
