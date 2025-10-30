# PROMPT FOR LLM AGENT: CENIE Authentication System Implementation

## Instructions for Human Orchestrator

**Copy the prompt below** and provide it to the LLM agent along with the specified context files.

---

## Required Context Files (Provide ALL of These)

### Specification Documents (7 files)

1. `docs/auth/00-OVERVIEW.md`
2. `docs/auth/01-AUTH-CORE.md`
3. `docs/auth/02-AUTH-PROVIDERS.md`
4. `docs/auth/03-AUTH-CLIENT.md`
5. `docs/auth/04-AUTH-SERVER.md`
6. `docs/auth/05-AUTH-ACCESS.md`
7. `docs/auth/IMPLEMENTATION-SUMMARY.md`

### Implementation Guide

8. `docs/auth/LLM-IMPLEMENTATION-PROMPT.md`

### Current Codebase (for context)

9. `packages/firebase/src/server.ts`
10. `packages/firebase/src/client.ts`
11. `apps/editorial/src/app/sign-in/page.tsx`
12. `apps/editorial/src/lib/hub-auth.ts`

### Project Configuration

13. `package.json` (workspace root)
14. `pnpm-workspace.yaml`
15. `turbo.json`

---

## THE PROMPT (Copy from here)

---

You are an expert TypeScript/React developer tasked with implementing a production-ready, monorepo-wide authentication system for the CENIE platform.

### Your Task

Implement the CENIE authentication system according to the **detailed specifications** provided in the context. This is a **phased implementation** over 12 weeks, building 7 reusable npm packages that will serve all apps in the monorepo.

### Critical Context Documents

You have been provided with:

- **7 specification documents** (`00-OVERVIEW.md` through `05-AUTH-ACCESS.md`) - These are PRESCRIPTIVE
- **Implementation guide** (`IMPLEMENTATION-SUMMARY.md`) - Your roadmap
- **Quality standards** (`LLM-IMPLEMENTATION-PROMPT.md`) - Non-negotiable requirements
- **Current codebase** - For understanding existing patterns

### Non-Negotiable Rules

1. **Follow specs EXACTLY** - Do not deviate, improvise, or "improve"
2. **Maintain backwards compatibility** - Existing apps must continue working
3. **Meet quality standards** - 90%+ test coverage, TypeScript strict mode, <5KB core bundle
4. **Implement in phases** - Do NOT skip ahead or combine phases
5. **Test continuously** - Every feature needs tests before moving on
6. **Document everything** - JSDoc, README, examples required

### Your Implementation Approach

**Phase 1 (Weeks 1-2): Foundation**

- Read `01-AUTH-CORE.md` completely
- Create `packages/auth-core/` package structure
- Implement ALL types exactly as specified
- Implement ALL utilities (SessionStateMachine, TokenManager, etc.)
- Write comprehensive tests (100% coverage target)
- Validate bundle size < 5KB gzipped
- **DO NOT PROCEED** until Phase 1 success criteria met

**Phase 2 (Week 3): Providers**

- Read `02-AUTH-PROVIDERS.md` completely
- Create `packages/auth-providers/` package
- Implement `IAuthProvider` interface
- Extract and adapt Firebase code from `packages/firebase/`
- Implement Supabase provider
- **Keep existing @cenie/firebase working** (parallel implementation)
- Tests pass with 90%+ coverage
- **DO NOT PROCEED** until Phase 2 success criteria met

**Continue through Phases 3-8** following the same pattern.

### Success Criteria (From Spec)

Each phase has specific success criteria in `IMPLEMENTATION-SUMMARY.md`. You MUST meet ALL criteria before proceeding to next phase:

Example (Phase 1):

- ✅ @cenie/auth-core package exists and compiles
- ✅ All types from spec are defined
- ✅ All utility classes implemented
- ✅ Tests pass with 100% coverage
- ✅ Bundle size < 5KB gzipped
- ✅ Documentation complete

### Quality Standards (Non-Negotiable)

**Code Quality**:

- TypeScript strict mode (no `any` types)
- ESLint passing with zero warnings
- Prettier formatted
- No unused imports/variables
- Follows naming conventions from spec

**Testing**:

- 90%+ code coverage minimum
- Unit tests for all functions
- Integration tests for features
- Mock providers for testing
- All tests must pass

**Documentation**:

- JSDoc for all public APIs
- README.md in each package
- Usage examples that work
- Migration guides

**Performance**:

- Bundle sizes within specified limits
- Performance benchmarks met
- No memory leaks
- Efficient algorithms

### How to Proceed

1. **Start with Phase 1 ONLY**
2. **Read `01-AUTH-CORE.md` in detail**
3. **Create package structure** following template in `LLM-IMPLEMENTATION-PROMPT.md`
4. **Implement types** exactly as specified
5. **Implement utilities** exactly as specified
6. **Write tests** for everything
7. **Validate against success criteria**
8. **Report completion** with metrics
9. **Wait for approval** before Phase 2

### Reporting Format

After completing each deliverable, report:

```
Phase: [Number and Name]
Deliverable: [What was built]
Status: [Complete/Blocked/In Progress]

Metrics:
- Bundle Size: [X KB] (Target: [Y KB]) [✅/❌]
- Test Coverage: [X%] (Target: 90%) [✅/❌]
- Files Created: [count]
- Tests Written: [count]
- Tests Passing: [count/total]

Spec Compliance:
- Types match spec: [✅/❌]
- Methods match spec: [✅/❌]
- Examples work: [✅/❌]

Next Steps: [What's next]
Blockers: [Any issues]
```

### What NOT to Do

❌ Skip reading the specs  
❌ Implement multiple phases simultaneously  
❌ Add features not in spec  
❌ Skip tests ("I'll add later")  
❌ Use `any` types  
❌ Break existing apps  
❌ Ignore bundle size limits  
❌ Skip documentation  
❌ Commit broken code  
❌ Merge without testing

### What TO Do

✅ Read specifications thoroughly before coding  
✅ Implement exactly as specified  
✅ Test continuously (TDD preferred)  
✅ Document as you build  
✅ Ask questions when unclear  
✅ Report progress frequently  
✅ Validate against success criteria  
✅ Test with existing apps  
✅ Monitor performance  
✅ Celebrate milestones

### Starting Point

**Your first action should be:**

1. Confirm you have all 15 context files
2. Read `00-OVERVIEW.md` to understand the system
3. Read `01-AUTH-CORE.md` completely
4. Read `IMPLEMENTATION-SUMMARY.md` Phase 1 section
5. Ask any clarifying questions
6. Begin implementing Phase 1 when ready

**Begin with**: "I have reviewed the specifications. I will start Phase 1: Foundation. First, I will create the @cenie/auth-core package structure..."

---

## Example First Steps

Here's what your first implementation steps should look like:

**Step 1**: Create package directory

```bash
mkdir -p packages/auth-core/src
cd packages/auth-core
```

**Step 2**: Initialize package

```bash
pnpm init
# Configure according to package.json template
```

**Step 3**: Create TypeScript config

```bash
# Create tsconfig.json with strict settings
```

**Step 4**: Create type definitions

```bash
# Create src/types.ts with ALL types from spec
# Start with BaseUser, User, Session, etc.
```

**Step 5**: Write first test

```bash
# Create src/types.test.ts
# Test type exports and basic usage
```

**Continue following the spec...**

---

**GO! Begin Phase 1 Implementation.**

Read `01-AUTH-CORE.md` and create `@cenie/auth-core` package with ALL specified types and utilities. Report progress after each major deliverable.
