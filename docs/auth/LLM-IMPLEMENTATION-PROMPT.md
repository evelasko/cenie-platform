# LLM Agent Implementation Prompt

**Task**: Implement CENIE's monorepo-wide authentication system  
**Type**: Multi-phase software implementation  
**Expected Duration**: 12 weeks (phased)  
**Quality Level**: Production-ready

---

## Context Documents Required

**CRITICAL**: Before starting, you MUST have these documents in your context:

### Required Documents (Provide ALL of these)

1. `docs/auth/00-OVERVIEW.md` - System architecture and goals
2. `docs/auth/01-AUTH-CORE.md` - Core package specification
3. `docs/auth/02-AUTH-PROVIDERS.md` - Providers package specification
4. `docs/auth/03-AUTH-CLIENT.md` - Client package specification
5. `docs/auth/04-AUTH-SERVER.md` - Server package specification
6. `docs/auth/05-AUTH-ACCESS.md` - Access control specification
7. `docs/auth/IMPLEMENTATION-SUMMARY.md` - Complete implementation roadmap

### Current Codebase Context (For Understanding Current State)

8. `packages/firebase/src/server.ts` - Current Firebase server implementation
9. `packages/firebase/src/client.ts` - Current Firebase client implementation
10. `apps/editorial/src/app/sign-in/page.tsx` - Current sign-in implementation
11. `apps/editorial/src/app/dashboard/layout.tsx` - Current auth state management
12. `apps/editorial/src/lib/hub-auth.ts` - Current API client
13. `apps/editorial/src/app/api/auth/session/route.ts` - Current session API

### Project Structure

14. `package.json` (workspace root) - Understand monorepo setup
15. `pnpm-workspace.yaml` - Workspace configuration
16. `turbo.json` - Build system configuration

---

## Your Mission

You are implementing a **production-ready, monorepo-wide authentication system** that will serve all apps in the CENIE platform. This is a critical infrastructure project that requires:

- ✅ **Strict adherence to specifications** (no improvisation)
- ✅ **High code quality** (TypeScript strict mode, 90%+ test coverage)
- ✅ **Comprehensive testing** (unit, integration, e2e)
- ✅ **Zero breaking changes** to existing apps during migration
- ✅ **Performance optimization** (meet all benchmarks)
- ✅ **Complete documentation** (inline comments, JSDoc, examples)

---

## Critical Requirements

### 1. **Follow the Specifications EXACTLY**

The specifications in `docs/auth/*.md` are **prescriptive, not suggestive**:

- ❌ DO NOT deviate from the specified interfaces
- ❌ DO NOT add features not in the spec
- ❌ DO NOT skip specified features
- ❌ DO NOT change type definitions
- ✅ DO ask for clarification if something is unclear
- ✅ DO flag potential issues in the spec
- ✅ DO implement exactly as specified

### 2. **Maintain Backwards Compatibility**

During migration:

- ❌ DO NOT break existing apps
- ❌ DO NOT force all apps to migrate at once
- ✅ DO implement packages in parallel with existing code
- ✅ DO create adapter layers if needed
- ✅ DO test with existing apps before any changes to app code

### 3. **Quality Standards**

Every package MUST meet these standards:

**Code Quality**:

- TypeScript strict mode enabled
- No `any` types (use `unknown` and type guards)
- ESLint passing with zero warnings
- Prettier formatted
- No unused imports or variables

**Testing**:

- 90%+ code coverage minimum
- Unit tests for all utilities
- Integration tests for all features
- E2E tests for critical flows
- Mock providers for testing

**Documentation**:

- JSDoc for all public APIs
- Inline comments for complex logic
- README.md in each package
- Usage examples
- Migration guides

**Performance**:

- Bundle size < specified limits
- Tree-shakeable exports
- Lazy loading where appropriate
- Performance tests passing

### 4. **Phased Implementation**

You MUST implement in phases as specified in `IMPLEMENTATION-SUMMARY.md`:

**Phase 1: Foundation** (Weeks 1-2)

- Focus: `@cenie/auth-core` package
- Deliverable: Types, utilities, tests
- Success criteria: <5KB, 100% test coverage

**Phase 2: Providers** (Week 3)

- Focus: `@cenie/auth-providers` package
- Deliverable: Firebase & Supabase providers
- Success criteria: Editorial app still works unchanged

**Phase 3: Client** (Week 4)

- Focus: `@cenie/auth-client` package
- Deliverable: React hooks, context, migrate editorial
- Success criteria: <20KB bundle impact, no performance regression

**Phase 4: Server** (Week 5)

- Focus: `@cenie/auth-server` package
- Deliverable: Middleware, API wrappers
- Success criteria: 50% code reduction in API routes

**Phase 5: Access Control** (Week 6)

- Focus: `@cenie/auth-access` package
- Deliverable: RBAC system with caching
- Success criteria: <100ms access checks

**Phase 6: Hub Migration** (Weeks 7-8)

- Focus: Apply to hub app
- Deliverable: Second app validated
- Success criteria: <50% time of editorial migration

**Phase 7: Ecosystem** (Weeks 9-10)

- Focus: Remaining apps + supporting packages
- Deliverable: Complete system
- Success criteria: All apps migrated

**Phase 8: Polish** (Weeks 11-12)

- Focus: Optimization, docs, monitoring
- Deliverable: Production-ready
- Success criteria: All metrics met

---

## Implementation Guidelines

### Package Structure Standards

Each package MUST follow this structure:

```tree
packages/auth-[name]/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # Type definitions
│   ├── [feature]/            # Feature directories
│   │   ├── index.ts
│   │   ├── [feature].ts
│   │   └── [feature].test.ts
│   └── testing/              # Test utilities
│       ├── mocks.ts
│       └── fixtures.ts
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
└── LICENSE
```

### Code Style Requirements

**TypeScript Configuration**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

**Import Order**:

1. External dependencies
2. Internal package imports (`@cenie/*`)
3. Relative imports
4. Type imports (separate)

**Naming Conventions**:

- Interfaces: `IAuthProvider`, `IAccessControl` (prefix with `I`)
- Types: `AuthState`, `SessionConfig` (PascalCase)
- Classes: `SessionManager`, `TokenManager` (PascalCase)
- Functions: `verifySession`, `createToken` (camelCase)
- Constants: `DEFAULT_SESSION_DURATION`, `STORAGE_KEYS` (UPPER_SNAKE_CASE)
- Hooks: `useAuth`, `useSession` (camelCase with `use` prefix)

### Testing Requirements

**Unit Tests**:

- Test file co-located with source: `feature.ts` → `feature.test.ts`
- Use Vitest as test runner
- Mock all external dependencies
- Test edge cases and error conditions
- Minimum 90% coverage per file

**Integration Tests**:

- In `tests/integration/` directory
- Test interaction between packages
- Use real provider implementations
- Test complete auth flows

**E2E Tests**:

- In `tests/e2e/` directory
- Test in actual Next.js app context
- Use Playwright or similar
- Test critical user journeys

**Example Test Structure**:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SessionManager } from './session-manager'
import { MemoryStorage } from '../storage'

describe('SessionManager', () => {
  let manager: SessionManager
  let storage: MemoryStorage

  beforeEach(() => {
    storage = new MemoryStorage()
    manager = new SessionManager(storage, {
      duration: 1000,
      autoRefresh: false,
      refreshBefore: 100,
      rememberDevice: false,
      storage: 'memory',
    })
  })

  afterEach(async () => {
    await storage.clear()
  })

  describe('saveSession', () => {
    it('should save session to storage', async () => {
      const session = createMockSession()
      await manager.saveSession(session)

      const retrieved = await manager.getSession()
      expect(retrieved).toEqual(session)
    })

    it('should emit session-create event', async () => {
      const session = createMockSession()
      const handler = vi.fn()

      manager.on('session-create', handler)
      await manager.saveSession(session)

      expect(handler).toHaveBeenCalledWith(session)
    })
  })

  // ... more tests
})
```

---

## Step-by-Step Implementation Process

### For Each Phase:

**Step 1: Read the Specification**

- Read the relevant package spec document thoroughly
- Understand all interfaces and types
- Review examples
- Note any questions or concerns

**Step 2: Set Up Package Structure**

- Create package directory
- Initialize package.json
- Set up tsconfig.json
- Create src/ directory structure
- Set up testing framework

**Step 3: Implement Types**

- Start with type definitions from spec
- Ensure exact match to specification
- Add JSDoc comments
- Export types properly

**Step 4: Implement Core Logic**

- Implement interfaces from spec
- Follow examples in spec
- Add comprehensive error handling
- Add logging (environment-aware)

**Step 5: Write Tests**

- Write tests as you implement (TDD encouraged)
- Aim for 100% coverage
- Test happy paths and edge cases
- Test error conditions

**Step 6: Document**

- Write package README.md
- Add usage examples
- Document any deviations from spec (with justification)
- Update CHANGELOG.md

**Step 7: Validate**

- Run all tests
- Check bundle size
- Run linter
- Test with example app
- Verify backwards compatibility

**Step 8: Review Checklist**

- [ ] Matches specification exactly
- [ ] Tests passing (90%+ coverage)
- [ ] TypeScript strict mode passing
- [ ] ESLint passing
- [ ] Bundle size within limits
- [ ] Documentation complete
- [ ] Examples working
- [ ] Backwards compatible

---

## Specific Implementation Instructions

### Phase 1: @cenie/auth-core Implementation

**File: `packages/auth-core/src/types.ts`**

Implement ALL types from `01-AUTH-CORE.md`:

- `BaseUser`, `User`, `UserProfile`
- `SessionState`, `Session`, `SessionConfig`
- `AuthToken`, `TokenPair`, `TokenPayload`
- `AuthState`, `AuthStatus`, `AuthStateChange`
- All error types and enums
- OAuth types

**File: `packages/auth-core/src/utils/session-state-machine.ts`**

Implement `SessionStateMachine` class exactly as specified:

```typescript
export class SessionStateMachine {
  private static readonly transitions: Record<SessionState, SessionState[]> = {
    [SessionState.UNAUTHENTICATED]: [SessionState.AUTHENTICATING],
    [SessionState.AUTHENTICATING]: [
      SessionState.AUTHENTICATED,
      SessionState.UNAUTHENTICATED,
      SessionState.INVALID,
    ],
    [SessionState.AUTHENTICATED]: [
      SessionState.EXPIRED,
      SessionState.INVALID,
      SessionState.SIGNED_OUT,
    ],
    [SessionState.EXPIRED]: [SessionState.AUTHENTICATING, SessionState.SIGNED_OUT],
    [SessionState.INVALID]: [SessionState.AUTHENTICATING, SessionState.UNAUTHENTICATED],
    [SessionState.SIGNED_OUT]: [SessionState.AUTHENTICATING],
  }

  transition(current: SessionState, event: SessionEvent): SessionState {
    // Implementation here
  }

  canTransition(from: SessionState, to: SessionState): boolean {
    // Implementation here
  }

  getAllowedTransitions(state: SessionState): SessionState[] {
    return SessionStateMachine.transitions[state] || []
  }
}
```

**Continue with all other utilities from spec...**

### Phase 2: @cenie/auth-providers Implementation

**File: `packages/auth-providers/src/interfaces/provider.ts`**

Define `IAuthProvider` interface exactly as specified in `02-AUTH-PROVIDERS.md`.

**File: `packages/auth-providers/src/providers/firebase.ts`**

Extract and refactor existing Firebase code from `packages/firebase/src/server.ts` and `packages/firebase/src/client.ts` into the new `FirebaseAuthProvider` class.

**IMPORTANT**:

- DO NOT break existing `@cenie/firebase` package yet
- Implement new provider alongside old code
- Test that both work simultaneously
- Only deprecate old code after full migration

### Phase 3-8: Continue Following Specifications

For each phase, refer to the relevant specification document and implement exactly as specified.

---

## Quality Assurance Checklist

### Before Committing ANY Code

- [ ] **Read the spec** for what you're implementing
- [ ] **Understand the why** behind each decision
- [ ] **Follow TypeScript strict mode** (no exceptions)
- [ ] **Write tests first** or alongside code
- [ ] **Document as you go** (don't leave for later)
- [ ] **Test with existing apps** (no breaking changes)
- [ ] **Check bundle size** (must be under limits)
- [ ] **Review your own code** (read it as if reviewing someone else's)

### Before Marking Phase Complete

- [ ] **All deliverables** listed in IMPLEMENTATION-SUMMARY.md completed
- [ ] **All success criteria** met
- [ ] **Tests passing** with required coverage
- [ ] **Documentation complete** and accurate
- [ ] **No regressions** in existing functionality
- [ ] **Performance benchmarks** met or exceeded
- [ ] **Code reviewed** (self-review minimum)
- [ ] **Demo prepared** (show it working)

---

## Common Pitfalls to Avoid

### ❌ DON'T Do These

1. **Don't improvise** - The spec is comprehensive for a reason
2. **Don't skip tests** - "I'll add tests later" never works
3. **Don't break existing apps** - Always maintain backwards compatibility
4. **Don't optimize prematurely** - Follow spec first, optimize in Phase 8
5. **Don't bundle everything** - Keep packages separate and focused
6. **Don't use `any` types** - Use `unknown` and type guards
7. **Don't skip documentation** - Future you will thank present you
8. **Don't commit broken code** - All commits should pass tests
9. **Don't merge without testing** - Test in actual apps first
10. **Don't ignore bundle size** - Monitor constantly

### ✅ DO These

1. **Do follow the spec religiously** - It's battle-tested design
2. **Do write tests alongside code** - TDD or concurrent testing
3. **Do test with existing apps** - Continuous validation
4. **Do ask questions** - Clarify before implementing
5. **Do commit frequently** - Small, atomic commits
6. **Do document thoroughly** - Explain the why, not just the what
7. **Do monitor performance** - Benchmark each phase
8. **Do seek feedback** - Show progress regularly
9. **Do celebrate milestones** - Complete phases are achievements
10. **Do maintain quality** - Never compromise on quality for speed

---

## Implementation Workflow

### Daily Workflow

**Morning**:

1. Review current phase objectives
2. Read relevant spec sections
3. Plan today's tasks (what will you implement)
4. Set up tests for planned work

**During Development**:

1. Implement one feature/component at a time
2. Write/update tests immediately
3. Run tests frequently
4. Document as you go
5. Commit working code

**End of Day**:

1. Run full test suite
2. Check bundle size
3. Update progress tracker
4. Document any blockers or questions
5. Commit all working code

### Weekly Workflow

**Start of Week**:

1. Review phase plan in IMPLEMENTATION-SUMMARY.md
2. Break down into daily tasks
3. Identify dependencies
4. Plan testing approach

**During Week**:

1. Daily standup (async or sync)
2. Track progress against phase objectives
3. Flag issues early
4. Share wins and learnings

**End of Week**:

1. Demo completed work
2. Review against success criteria
3. Update documentation
4. Plan next week

---

## Testing Strategy

### Test Categories

**1. Unit Tests** (Per file, 90%+ coverage)

```typescript
// Test all public methods
// Test edge cases
// Test error conditions
// Mock dependencies
```

**2. Integration Tests** (Per package)

```typescript
// Test package integration
// Test with real providers
// Test configuration options
// Test error recovery
```

**3. E2E Tests** (Per phase)

```typescript
// Test complete auth flows
// Test in real Next.js app
// Test cross-tab sync
// Test session persistence
```

**4. Performance Tests** (Per phase)

```typescript
// Measure auth flow time
// Measure bundle size
// Measure cache performance
// Compare against benchmarks
```

### Test Data

Use the `TestFactories` from `@cenie/auth-core`:

```typescript
const user = TestFactories.createUser({
  email: 'test@example.com',
  displayName: 'Test User',
})

const session = TestFactories.createSession({
  userId: user.id,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
})
```

---

## Debugging and Problem-Solving

### When Something Doesn't Work

1. **Check the spec** - Did you implement it exactly?
2. **Check the tests** - Are they testing the right thing?
3. **Check the types** - TypeScript errors are usually helpful
4. **Check existing code** - How does it currently work?
5. **Add logging** - Temporary console.logs are okay for debugging
6. **Simplify** - Remove complexity until it works, then add back
7. **Ask for help** - Don't spin your wheels for hours

### When Performance Is Slow

1. **Measure first** - Don't optimize without data
2. **Check bundle size** - Use webpack-bundle-analyzer
3. **Profile** - Use Chrome DevTools or Node profiler
4. **Look for N+1 queries** - Common in database code
5. **Check caching** - Is cache hit rate high enough?
6. **Review spec** - Optimization strategies are included

### When Tests Fail

1. **Read the error** - Carefully, it usually tells you exactly what's wrong
2. **Check test validity** - Is the test correct?
3. **Check implementation** - Does it match the spec?
4. **Isolate the problem** - Comment out code until test passes
5. **Check mocks** - Are mocks set up correctly?
6. **Check async** - Missing await? Race condition?

---

## Communication Protocol

### Progress Updates

**Daily**:

- What you completed
- What you're working on
- Any blockers
- Questions for clarification

**Weekly**:

- Phase progress (% complete)
- Metrics status
- Risks or concerns
- Demo of working features

### Asking Questions

**Good Question Format**:

```
Context: I'm implementing [feature] in Phase [X]
Spec Reference: [Document name, section]
Question: [Specific question]
What I've Tried: [What you've already attempted]
Impact: [Why this is blocking you]
```

**Example**:

```
Context: I'm implementing the SessionStateMachine in Phase 1
Spec Reference: 01-AUTH-CORE.md, Session State Machine section
Question: Should the transition from EXPIRED to AUTHENTICATED be allowed directly, or must it go through AUTHENTICATING?
What I've Tried: I reviewed the state transition diagram but it's not explicit about this path
Impact: This affects the transition validation logic and test cases
```

### Reporting Issues in Spec

If you find issues, contradictions, or ambiguities in the specifications:

**Report Format**:

```
Document: [filename]
Section: [section name]
Issue Type: [Ambiguity | Contradiction | Missing Info | Error]
Description: [What's the issue]
Impact: [How does this affect implementation]
Suggested Fix: [If you have one]
```

---

## Success Criteria Per Phase

### Phase 1: Foundation Success

- [ ] @cenie/auth-core package exists and compiles
- [ ] All types from spec are defined
- [ ] All utility classes implemented
- [ ] Tests pass with 100% coverage
- [ ] Bundle size < 5KB gzipped
- [ ] Documentation complete
- [ ] Example usage works

### Phase 2: Providers Success

- [ ] Firebase provider works exactly like current implementation
- [ ] Supabase provider implemented
- [ ] Provider factory works
- [ ] Tests pass with 90%+ coverage
- [ ] Editorial app still works (no changes to app)
- [ ] Provider switching tested
- [ ] Documentation complete

### Phase 3: Client Success

- [ ] All React hooks working
- [ ] AuthProvider context working
- [ ] Session management working
- [ ] Tab sync working
- [ ] Editorial app migrated and working
- [ ] Tests pass with 90%+ coverage
- [ ] Bundle size impact < 20KB
- [ ] No performance regression
- [ ] Documentation and examples complete

### Phase 4: Server Success

- [ ] Middleware functions working
- [ ] API route wrappers working
- [ ] CSRF protection working
- [ ] Rate limiting working
- [ ] Editorial API routes migrated
- [ ] Tests pass with 90%+ coverage
- [ ] API route code reduced by 50%+
- [ ] Documentation complete

### Phase 5: Access Control Success

- [ ] RBAC system working
- [ ] Firestore backend working
- [ ] Caching working (>90% hit rate)
- [ ] Editorial access checks migrated
- [ ] Access checks < 100ms (cached)
- [ ] Tests pass with 90%+ coverage
- [ ] Firestore queries reduced by 80%+
- [ ] Documentation complete

### Phase 6: Hub Migration Success

- [ ] Hub app fully migrated
- [ ] All hub features working
- [ ] No new packages needed
- [ ] Migration took < 50% time of editorial
- [ ] Tests passing
- [ ] Documentation updated

### Phase 7: Ecosystem Success

- [ ] Academy app migrated
- [ ] Agency app migrated
- [ ] @cenie/auth-ui implemented
- [ ] @cenie/auth-testing complete
- [ ] New app setup < 1 hour
- [ ] All tests passing
- [ ] Documentation complete

### Phase 8: Polish Success

- [ ] All performance benchmarks met
- [ ] Bundle sizes optimized
- [ ] Documentation excellent
- [ ] Monitoring implemented
- [ ] Production deployment successful
- [ ] Zero critical bugs
- [ ] Team trained

---

## File Creation Guidelines

### When Creating New Files

**Every file MUST have**:

1. File header comment with purpose
2. Imports organized properly
3. Type definitions
4. Implementation
5. Exports
6. JSDoc on public APIs

**Example**:

````typescript
/**
 * Session management utilities for client-side authentication
 *
 * @packageDocumentation
 */

import type { Session, SessionConfig, SessionState } from '../types'
import { TimeUtils, STORAGE_KEYS } from '../utils'
import type { Storage } from '../storage'

/**
 * Manages client-side session persistence and lifecycle
 *
 * @example
 * ```typescript
 * const storage = new MemoryStorage()
 * const manager = new SessionManager(storage, sessionConfig)
 *
 * await manager.saveSession(session)
 * const current = await manager.getSession()
 * ```
 */
export class SessionManager {
  // Implementation
}
````

### Package.json Template

```json
{
  "name": "@cenie/auth-[name]",
  "version": "2.0.0",
  "description": "[Package description from spec]",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    // From spec
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cenie/platform.git",
    "directory": "packages/auth-[name]"
  },
  "keywords": ["auth", "authentication", "cenie"],
  "author": "CENIE",
  "license": "MIT"
}
```

---

## Error Handling Standards

### Error Creation

Always use typed errors from `@cenie/auth-core`:

```typescript
// ❌ Bad
throw new Error('Authentication failed')

// ✅ Good
throw new AuthError('Authentication failed', AuthErrorCode.INVALID_CREDENTIALS, {
  attemptedEmail: email,
})
```

### Error Propagation

```typescript
// In provider implementations
try {
  // Provider-specific operation
} catch (error) {
  // Map to our error types
  throw this.mapProviderError(error)
}

// In application code
try {
  await authProvider.signIn(email, password)
} catch (error) {
  if (error instanceof AuthError) {
    // Handle our errors
    switch (error.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        // Show message to user
        break
      // ... other cases
    }
  }
  throw error // Re-throw if not handled
}
```

---

## Performance Monitoring

### Bundle Size Monitoring

After each package implementation:

```bash
# Build the package
pnpm build

# Check size
du -sh dist/
npx bundlesize

# Compare against limits
# @cenie/auth-core: < 5KB
# @cenie/auth-providers: < 15KB
# @cenie/auth-client: < 12KB
# @cenie/auth-server: < 10KB
# @cenie/auth-access: < 8KB
```

### Runtime Performance

Add performance markers:

```typescript
// In critical paths
const start = performance.now()
// ... operation
const duration = performance.now() - start

if (duration > PERFORMANCE_THRESHOLD) {
  console.warn(`Slow operation: ${duration}ms`)
}
```

---

## Migration Strategy

### Parallel Implementation (Weeks 1-4)

- Build new packages WITHOUT touching existing code
- Test new packages with example apps
- Validate approach before migration

### Gradual Migration (Weeks 5-10)

- Migrate one app at a time
- Keep old code working during migration
- Add deprecation warnings to old code
- Only remove old code when ALL apps migrated

### Rollback Plan

Always maintain ability to rollback:

- Keep old packages functional
- Use feature flags for new auth
- Deploy to staging first
- Monitor error rates closely

---

## Deliverables Per Phase

### What to Provide at End of Each Phase

1. **Working Code**
   - All source files in `packages/auth-[name]/src/`
   - Properly structured and organized
   - Compiled and tested

2. **Tests**
   - Unit tests with 90%+ coverage
   - Integration tests
   - All tests passing
   - Test reports generated

3. **Documentation**
   - Package README.md with examples
   - API documentation (generated from JSDoc)
   - CHANGELOG.md with all changes
   - Migration guide (if applicable)

4. **Metrics Report**
   - Bundle size analysis
   - Performance benchmarks
   - Test coverage report
   - Comparison with targets

5. **Demo**
   - Working example in app
   - Video or screenshots
   - Key features highlighted

---

## Final Checklist

### Before Considering Project Complete

- [ ] All 7 packages implemented
- [ ] All 4 apps migrated
- [ ] All tests passing (90%+ coverage)
- [ ] All performance benchmarks met
- [ ] Bundle sizes within limits
- [ ] Documentation complete
- [ ] Examples working
- [ ] Migration guides written
- [ ] Staging deployment successful
- [ ] Production deployment planned
- [ ] Team trained
- [ ] Monitoring in place

---

## Remember

This is **infrastructure code** that will serve the entire CENIE platform. Quality and correctness are paramount. Take your time, follow the specifications, test thoroughly, and build something that will last.

**The specifications are comprehensive and battle-tested. Trust them. Follow them. Build amazing things.**

---

**Ready to begin? Start with Phase 1: Foundation**

Read `docs/auth/01-AUTH-CORE.md` and begin implementing `@cenie/auth-core`. Good luck! 🚀
