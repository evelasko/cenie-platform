# AGENT QUICK START GUIDE

**For LLM Coding Agents implementing the CENIE Auth Consolidation Plan**

---

## BEFORE YOU START

### 1. Read These Documents IN ORDER

1. **MASTER_IMPLEMENTATION_GUIDE.md** (15 min) - Overview of entire plan
2. **Your assigned phase document** (30 min) - Detailed requirements
3. **Evaluation documents** (if applicable):
   - EMAIL-IMPLEMENTATION.md (for email work)
   - SENTRY-INTEGRATION.md (for Sentry work)

### 2. Understand The Codebase

**Existing Packages (DO NOT RECREATE):**
```
packages/errors/        ✅ Use for all error handling
packages/logger/        ✅ Use for all logging  
packages/firebase/      ✅ Use for Firebase SDK access
packages/supabase/      ✅ Use for database (NOT auth)
packages/ui/            ✅ Use for UI components
```

**Apps (Current State):**
```
apps/hub/              ✅ OAuth working, needs refactoring
apps/editorial/        ✅ Auth working perfectly, extract from here
apps/academy/          ❌ Needs authentication implementation
apps/agency/           ❌ Needs authentication implementation
```

### 3. Set Up Your Environment

```bash
# Clone and install
cd /Users/henry/Workbench/CENIE/platform
pnpm install

# Run a specific app to understand it
pnpm dev --filter=@cenie/editorial  # Port 3001
pnpm dev --filter=@cenie/hub        # Port 3000

# Test the build system
pnpm build --filter=@cenie/editorial
```

---

## AGENT ROLE ASSIGNMENTS

### 👤 Agent 1: Auth & Academy Lead

**Week 1:** Phase 1A - Auth Packages
- Create `@cenie/auth-server`, `@cenie/auth-utils`, `@cenie/oauth-handlers`
- Extract from Editorial and Hub
- **Start here**: `apps/editorial/src/lib/auth-helpers.ts`

**Week 2:** Phase 2 - Academy Authentication
- Implement auth in Academy app
- Use packages created in Week 1

**Week 3:** Phase 4A - Hub Refactoring
- Migrate Hub to use new packages

**Week 4:** Phase 6 - Sentry Integration
- Add Sentry to all apps

**Primary Document:** PHASE_1A_AUTH_PACKAGES.md

### 👤 Agent 2: Email & Agency Lead

**Week 1:** Phase 1B - Email Package
- Create `@cenie/email` package
- Resend provider integration
- **Key file**: New creation (no extraction)

**Week 2:** Phase 3 - Agency Authentication
- Implement auth in Agency app
- Mirror Academy implementation

**Week 3:** Phase 4B - Editorial Refactoring + Phase 5
- Migrate Editorial to new packages
- Start email integration across apps

**Week 4:** Phase 7 - Advanced Features
- Custom claims, caching, CLI tools

**Primary Documents:** PHASE_1B_EMAIL_PACKAGE.md, EMAIL-IMPLEMENTATION.md

### 👤 Agent 3: Monitoring & Support

**Week 1:** Phase 1C - Sentry Package
- Create `@cenie/sentry` package
- Logger transport integration

**Week 2-3:** Phase 5 - Email Integration
- Help with email templates for all apps
- DNS configuration

**Week 4:** Testing & Documentation
- Cross-app integration testing
- Documentation review

**Primary Document:** SENTRY-INTEGRATION.md

---

## PHASE-BY-PHASE CHECKLIST

### Phase 1A: Auth Packages (Agent 1)

**Day 1-2: @cenie/auth-server**
- [ ] Create package directory structure
- [ ] Extract session management from Editorial
- [ ] Extract middleware patterns
- [ ] Extract helper functions
- [ ] Add comprehensive types
- [ ] Test with Editorial (no regression)

**Day 3: @cenie/auth-utils**
- [ ] Create role hierarchy for all 4 apps
- [ ] Implement access control with caching
- [ ] Add custom claims utilities
- [ ] Type definitions for all roles

**Day 4-5: @cenie/oauth-handlers**
- [ ] Extract OAuth providers from Hub
- [ ] Extract account linking flow
- [ ] Create React hooks
- [ ] Create React components
- [ ] Test OAuth flows (Google + Apple)

**Sign-off Criteria:**
- Editorial still works perfectly
- Hub OAuth still works
- All packages build without errors
- TypeScript strict mode passing

### Phase 1B: Email Package (Agent 2)

**Day 1: Core + Provider**
- [ ] Create EmailSender class
- [ ] Implement Resend provider
- [ ] Add error handling with @cenie/errors
- [ ] Add logging with @cenie/logger

**Day 2: Templates**
- [ ] Set up React Email
- [ ] Create base layout component
- [ ] Create template renderer
- [ ] Test template rendering

**Day 3: Testing + DNS**
- [ ] Send test emails via Resend
- [ ] Configure Resend project
- [ ] Document DNS requirements
- [ ] Create README with examples

**Sign-off Criteria:**
- Can send emails via Resend
- Templates render correctly
- Package fully documented

### Phase 1C: Sentry Package (Agent 3)

**Day 1: Transport**
- [ ] Create SentryTransport class
- [ ] Integrate with @cenie/logger
- [ ] Auto-capture errors from logs
- [ ] Breadcrumb capture from info/debug

**Day 2: Testing**
- [ ] Test error capture
- [ ] Test context enrichment
- [ ] Test environment filtering
- [ ] Create README

**Sign-off Criteria:**
- Errors flow to Sentry
- No impact on existing logger
- Environment-specific behavior working

### Phase 2: Academy Auth (Agent 1)

**Day 1: Pages**
- [ ] Create `/sign-in` page
- [ ] Create `/sign-up` page  
- [ ] Integrate OAuth buttons
- [ ] Academy branding (blue theme)

**Day 2: API Routes**
- [ ] Create `/api/auth/session` endpoint
- [ ] Create `/api/users/apps/academy/access` endpoint
- [ ] Test session creation
- [ ] Test access checks

**Day 3: Protection**
- [ ] Create `middleware.ts` for route protection
- [ ] Add role-based helpers
- [ ] Test authentication flow

**Day 4-5: Dashboards**
- [ ] Create student dashboard
- [ ] Create instructor dashboard
- [ ] Test role enforcement
- [ ] Full E2E testing

**Sign-off Criteria:**
- Students can sign up and access dashboard
- Instructors have elevated access
- OAuth working (Google + Apple)
- Sessions persist across page loads

### Phase 3: Agency Auth (Agent 2)

Same as Phase 2 but:
- Agency branding (not Academy blue)
- Different roles: client, manager, admin
- Client dashboard (browse templates)
- Manager dashboard (create templates)

### Phase 4: Refactoring (Agents 1 & 2)

**Hub (Agent 1):**
- [ ] Remove `lib/auth-middleware.ts`
- [ ] Import from `@cenie/auth-server`
- [ ] Migrate OAuth to `@cenie/oauth-handlers`
- [ ] Test all flows
- [ ] No breaking changes

**Editorial (Agent 2):**
- [ ] Remove `lib/auth-helpers.ts`
- [ ] Import from `@cenie/auth-server`
- [ ] Update all API routes
- [ ] Test book management
- [ ] Test contributor management

**Critical:** Comprehensive regression testing!

### Phase 5: Email Integration (Agent 3)

**Per App (Hub, Editorial, Academy, Agency):**
- [ ] Create `apps/[app]/src/email/config.ts` with branding
- [ ] Create `apps/[app]/src/email/sender.ts` instance
- [ ] Create branded verification template
- [ ] Create branded password reset template
- [ ] Create branded welcome template
- [ ] Update `/api/auth/send-verification` to send emails
- [ ] Update `/api/auth/reset-password` to send emails
- [ ] Test email deliverability

**DNS Setup:**
- [ ] Verify hub.cenie.org in Resend
- [ ] Verify editorial.cenie.org
- [ ] Verify academy.cenie.org
- [ ] Verify agency.cenie.org
- [ ] Configure SPF/DKIM/DMARC for each

### Phase 6: Sentry Integration (Agent 1)

**Per App:**
- [ ] Add `instrumentation.ts` file
- [ ] Configure `@sentry/nextjs` in `next.config`
- [ ] Add SENTRY_DSN environment variable
- [ ] Test error capture
- [ ] Upload source maps
- [ ] Configure alerts

### Phase 7: Advanced Features (Agent 2)

- [ ] Implement custom claims sync
- [ ] Implement access control caching
- [ ] Create CLI tool (`scripts/manage-access.ts`)
- [ ] Add session device tracking (optional)
- [ ] Complete all documentation

---

## COMMON PATTERNS

### 1. Creating a New Package

```bash
# Structure
mkdir -p packages/[name]/src
cd packages/[name]

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@cenie/[name]",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOF

# Create index.ts
echo "// Exports go here" > src/index.ts

# Install dependencies
pnpm install

# Test build
pnpm --filter=@cenie/[name] type-check
```

### 2. Using Existing Packages

```typescript
// Error handling
import { AuthenticationError } from '@cenie/errors'
throw new AuthenticationError('Invalid token', {
  metadata: { userId },
})

// Logging
import { createLogger } from '@cenie/logger'
const logger = createLogger({ name: 'my-feature' })
logger.info('Action completed', { userId, action })

// Firebase
import { getFirebaseAuth } from '@cenie/firebase/client'
import { initializeAdminApp } from '@cenie/firebase/server'
```

### 3. Testing Pattern

```typescript
// Test file: src/__tests__/feature.test.ts
import { describe, it, expect } from 'vitest'

describe('MyFeature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true)
  })
})
```

---

## CRITICAL RULES

### ✅ DO

1. **Extract, don't recreate**: Copy code from Editorial/Hub when spec says "extract"
2. **Use existing packages**: Always use @cenie/errors, @cenie/logger, @cenie/firebase
3. **Test immediately**: Test after each file creation
4. **Maintain compatibility**: Editorial and Hub must keep working
5. **Follow TypeScript strict**: No `any` types
6. **Document as you go**: JSDoc comments on all public functions
7. **Ask when unsure**: Better to ask than assume

### ❌ DON'T

1. **Don't create new error classes**: Use @cenie/errors
2. **Don't create new loggers**: Use @cenie/logger
3. **Don't break existing apps**: Test frequently
4. **Don't skip testing**: Every change needs validation
5. **Don't guess at architecture**: Follow the specs exactly
6. **Don't create your own Firebase client**: Use @cenie/firebase
7. **Don't commit without linting**: `pnpm lint` must pass

---

## TESTING COMMANDS

```bash
# Lint a specific package
pnpm --filter=@cenie/auth-server lint

# Type check
pnpm --filter=@cenie/auth-server type-check

# Build
pnpm --filter=@cenie/auth-server build

# Run an app (for testing)
pnpm --filter=@cenie/editorial dev

# Run all apps
pnpm dev

# Test Editorial (regression test)
pnpm --filter=@cenie/editorial build
# Then manually test sign-in, book management, etc.
```

---

## TROUBLESHOOTING

### Package not found
```bash
# Make sure package.json has correct name
# Make sure it's in pnpm-workspace.yaml (should be automatic)
pnpm install
```

### TypeScript errors
```bash
# Check tsconfig.json extends root
# Check all imports are correct
# Run type-check
pnpm --filter=@cenie/[package] type-check
```

### Editorial breaks after extraction
```bash
# Revert your changes
git checkout apps/editorial/src/lib/auth-helpers.ts
# Review what you extracted
# Ensure Editorial imports from new package
```

---

## COORDINATION

### Daily Updates
Post to shared document:
```
Agent [N] - [Date]
✅ Completed: [what you finished]
🔄 In Progress: [what you're working on]
❌ Blocked: [any blockers]
📝 Notes: [anything others should know]
```

### Weekly Demos
Prepare to demonstrate:
- What you built
- How to test it
- Any issues encountered
- Next week's plan

### Code Reviews
Before requesting review:
- [ ] Linting passes (zero warnings)
- [ ] Type checking passes
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Regression tests pass

---

## GETTING HELP

### Technical Issues
1. Check the detailed phase document
2. Look at reference implementations (Editorial, Hub)
3. Search codebase for similar patterns
4. Ask specific question with context

### Architectural Questions
1. Reference MASTER_IMPLEMENTATION_GUIDE.md
2. Check evaluation documents
3. Propose solution with rationale
4. Request approval before implementing

### Scope Clarifications
1. Review phase requirements
2. Check success criteria
3. Document what's unclear
4. Request clarification

---

## SUCCESS INDICATORS

You're on track if:
- ✅ Linting always passes
- ✅ No TypeScript errors
- ✅ Editorial still works (if doing extraction)
- ✅ Tests pass
- ✅ Code follows existing patterns
- ✅ Documentation is clear
- ✅ Daily updates posted

You need help if:
- ❌ Breaking Editorial or Hub
- ❌ TypeScript errors you can't resolve
- ❌ Architecture seems wrong
- ❌ Falling behind schedule
- ❌ Unclear requirements

---

## FINAL CHECKLIST (Before Marking Phase Complete)

- [ ] All deliverables created
- [ ] All tests passing
- [ ] Linting clean (zero warnings)
- [ ] TypeScript strict mode passing
- [ ] Documentation complete
- [ ] Regression tests passing (for refactoring phases)
- [ ] Code reviewed
- [ ] Demo prepared
- [ ] Next phase dependencies met

---

**You've got this! Follow the specs, test frequently, and ask when unsure. Good luck!** 🚀

