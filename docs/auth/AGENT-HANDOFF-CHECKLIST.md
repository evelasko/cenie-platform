# LLM Agent Handoff Checklist

**Use this checklist to ensure smooth handoff to implementation agent**

---

## ☑️ Pre-Handoff Checklist

### Documentation Review

- [ ] All specification documents are complete and accurate
- [ ] No contradictions between documents
- [ ] All examples compile and make sense
- [ ] Success criteria are measurable
- [ ] Timeline is realistic

### Files Preparation

- [ ] All 15 required files are accessible
- [ ] Files are up-to-date
- [ ] No corrupted or incomplete files
- [ ] File paths are correct

### Readiness Check

- [ ] You understand the complete design
- [ ] You're confident in the approach
- [ ] You have time/resources for 12-week project
- [ ] Team is aligned and ready
- [ ] Success metrics are agreed upon

---

## 📋 Files to Provide (Copy This List)

### Specification Documents (7 files)

```
✅ docs/auth/00-OVERVIEW.md
✅ docs/auth/01-AUTH-CORE.md
✅ docs/auth/02-AUTH-PROVIDERS.md
✅ docs/auth/03-AUTH-CLIENT.md
✅ docs/auth/04-AUTH-SERVER.md
✅ docs/auth/05-AUTH-ACCESS.md
✅ docs/auth/IMPLEMENTATION-SUMMARY.md
```

**Total**: ~5,800 lines of detailed specifications

---

### Implementation Guide (1 file)

```
✅ docs/auth/LLM-IMPLEMENTATION-PROMPT.md
```

**Contains**: Quality standards, workflow, testing requirements, best practices

---

### Current Codebase (4 files - for context)

```
✅ packages/firebase/src/server.ts
✅ packages/firebase/src/client.ts
✅ apps/editorial/src/app/sign-in/page.tsx
✅ apps/editorial/src/lib/hub-auth.ts
```

**Purpose**: Understanding current implementation patterns

---

### Project Configuration (3 files)

```
✅ package.json (workspace root)
✅ pnpm-workspace.yaml
✅ turbo.json
```

**Purpose**: Understanding monorepo setup and build system

---

## 📨 The Prompt (Copy & Paste)

### Copy this EXACT message:

```
I need you to implement the CENIE authentication system following detailed specifications.

📁 CONTEXT PROVIDED (15 files):
• 7 specification documents (complete design)
• 1 implementation guide (instructions & quality standards)
• 4 current codebase files (for understanding existing patterns)
• 3 project config files (for setup)

📋 TASK:
Implement 7 reusable npm packages over 8 phases (12 weeks) that provide authentication for all apps in the CENIE monorepo.

📖 INSTRUCTIONS:
1. First, read: docs/auth/AGENT-PROMPT.md (complete instructions)
2. Then, read: docs/auth/00-OVERVIEW.md (system overview)
3. Then, read: docs/auth/IMPLEMENTATION-SUMMARY.md (roadmap)
4. Begin: Phase 1 - Foundation (docs/auth/01-AUTH-CORE.md)

⚠️ CRITICAL RULES:
• Follow specifications EXACTLY - they are prescriptive, not suggestive
• Maintain backwards compatibility - existing apps must keep working
• Meet quality standards - 90%+ test coverage, TypeScript strict mode
• Implement phases sequentially - do NOT skip ahead
• Test continuously - no feature without tests
• Report progress after each deliverable

🎯 PHASE 1 DELIVERABLES:
• @cenie/auth-core package created
• All types from 01-AUTH-CORE.md implemented
• All utilities implemented (SessionStateMachine, TokenManager, etc.)
• Tests written with 100% coverage
• Bundle size < 5KB gzipped
• Documentation complete

📊 SUCCESS CRITERIA (Phase 1):
✓ Package compiles with TypeScript strict mode
✓ All exports match specification
✓ All tests pass (target: 100% coverage)
✓ Bundle size < 5KB
✓ Zero ESLint warnings
✓ README.md with examples

Please confirm you have all 15 files and are ready to begin Phase 1.
```

---

## 🎯 Agent Response Expectations

### Good First Response

```
✅ I have received all 15 files
✅ I have read AGENT-PROMPT.md
✅ I have read 00-OVERVIEW.md
✅ I understand the system architecture
✅ I will implement in 8 phases sequentially
✅ I will follow specifications exactly
✅ I will maintain 90%+ test coverage
✅ I will report progress after each deliverable

Starting Phase 1: Foundation
Reading: docs/auth/01-AUTH-CORE.md

I will now create the @cenie/auth-core package structure...
```

### Bad First Response (RED FLAG)

```
❌ I'll implement the entire auth system quickly
❌ I have some improvements to the design
❌ We can simplify this by [deviating from spec]
❌ Let me start with Phase 3 since it's more interesting
❌ Tests can wait until the end
❌ I'll use `any` types for now and fix later
```

**If you get a bad response**: Redirect immediately to the specifications and requirements.

---

## 📊 Progress Tracking Template

Use this to track agent progress:

```markdown
# Auth Implementation Progress

## Overall Status

- Start Date: [date]
- Current Phase: [number/name]
- Completion: [X]%
- On Track: [Yes/No]

## Phase Status

### Phase 1: Foundation (Weeks 1-2)

- Status: [Not Started/In Progress/Complete/Blocked]
- Bundle Size: [X.X KB / 5KB target]
- Test Coverage: [XX% / 100% target]
- Files Created: [count]
- Tests Passing: [X/Y]
- Issues: [any issues]
- Notes: [notes]

### Phase 2: Providers (Week 3)

- Status: [Not Started/In Progress/Complete/Blocked]
- Bundle Size: [X KB / 15KB target]
- Test Coverage: [XX% / 90% target]
- Files Created: [count]
- Tests Passing: [X/Y]
- Backwards Compat: [Verified/Not Verified]
- Issues: [any issues]
- Notes: [notes]

[... continue for all phases]

## Metrics Dashboard

| Metric           | Target | Current | Status |
| ---------------- | ------ | ------- | ------ |
| Code Reuse       | 80%+   | TBD     | ⏳     |
| Bundle Size      | <40KB  | TBD     | ⏳     |
| Test Coverage    | 90%+   | TBD     | ⏳     |
| Time to Add Auth | <1hr   | TBD     | ⏳     |

## Issues Log

| Date | Issue | Resolution | Status |
| ---- | ----- | ---------- | ------ |
| -    | -     | -          | -      |

## Decisions Log

| Date | Decision | Rationale | Impact |
| ---- | -------- | --------- | ------ |
| -    | -        | -         | -      |
```

---

## 🚨 Stop Criteria (When to Pause)

**Stop implementation if**:

1. **Spec Deviation**: Agent deviates from specification
2. **Quality Issues**: Tests failing, bundle too large, coverage too low
3. **Breaking Changes**: Existing apps break
4. **Major Blockers**: Can't proceed without clarification
5. **Timeline Issues**: Phase taking much longer than estimated
6. **Scope Creep**: Agent adding features not in spec

**Action**: Pause, assess, correct, resume

---

## ✅ Completion Criteria

### Definition of Done (Per Phase)

A phase is ONLY complete when:

1. ✅ All deliverables from spec are implemented
2. ✅ All success criteria are met
3. ✅ All tests pass with required coverage
4. ✅ Bundle size within limits
5. ✅ Documentation complete
6. ✅ No regressions in existing apps
7. ✅ Code reviewed
8. ✅ Demo successful

**If ANY criteria is not met**: Phase is NOT complete

---

### Definition of Done (Full Project)

The project is complete when:

1. ✅ All 8 phases complete
2. ✅ All 7 packages published to monorepo
3. ✅ All 4 apps migrated
4. ✅ All success metrics met
5. ✅ Documentation complete
6. ✅ Production deployed
7. ✅ Team trained
8. ✅ Monitoring in place

---

## 💬 Communication Templates

### Daily Check-in Request

```
Daily status update for Phase [X]:

What did you complete today?
What are you working on now?
Any blockers or questions?
Current metrics (bundle size, coverage)?
On track for phase completion?
```

### Phase Approval

```
Phase [X] review complete. Results:

✅ All deliverables complete
✅ Success criteria met
✅ Tests passing ([XX%] coverage)
✅ Bundle size within limits ([X KB] / [Y KB])
✅ No breaking changes verified
✅ Documentation complete

APPROVED to proceed to Phase [X+1].

Please read the specification for Phase [X+1] before starting.
```

### Course Correction

```
Phase [X] needs corrections:

Issues Found:
1. [Issue description]
2. [Issue description]

Required Changes:
1. [What needs to change]
2. [What needs to change]

Please address these issues and report when resolved.
Do not proceed to next phase until approved.
```

---

## 🎓 Knowledge Transfer

### After Implementation Complete

Schedule sessions to:

1. **Walkthrough** of each package (1 hour each)
2. **Demo** of complete auth flow (30 min)
3. **Testing** demonstration (30 min)
4. **Migration** guide walkthrough (1 hour)
5. **Q&A** session (1 hour)
6. **Handoff** to maintenance team

**Total**: ~8 hours of knowledge transfer

---

## 📚 Reference Quick Links

### During Implementation

- **Stuck?** → Read `LLM-IMPLEMENTATION-PROMPT.md` troubleshooting section
- **Need example?** → Check specification documents for examples
- **Need pattern?** → Review current codebase files
- **Need validation?** → Check success criteria in `IMPLEMENTATION-SUMMARY.md`

### For Validation

- **Bundle size**: `pnpm build && du -sh dist/`
- **Test coverage**: `pnpm test:coverage`
- **Type check**: `pnpm typecheck`
- **Lint**: `pnpm lint`
- **Full check**: `pnpm test && pnpm lint && pnpm typecheck && pnpm build`

---

**Ready to hand off?**

✅ Gather the 15 files  
✅ Copy the prompt  
✅ Send to agent  
✅ Monitor progress  
✅ Validate deliverables  
✅ Celebrate success!

**Go build something amazing!** 🚀
