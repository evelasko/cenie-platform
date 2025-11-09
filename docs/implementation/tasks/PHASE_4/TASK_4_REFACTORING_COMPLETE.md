# PHASE 4: Hub & Editorial Refactoring (Complete Guide)

**Phase**: 4 - Refactoring  
**Duration**: 6 days (3 days per app, can run in parallel)  
**Dependencies**: Phases 1A, 2, and 3 complete  
**Agents**: Agent 1 (Hub) + Agent 2 (Editorial) working in parallel

---

## OBJECTIVE

Refactor Hub and Editorial apps to use the shared auth packages created in Phase 1A. This eliminates duplicated auth code and standardizes patterns across all apps.

**What You're Building**: Same functionality, cleaner code using shared packages.

**Why This Matters**: Completes the auth consolidation. After this, all 4 apps use the same auth infrastructure - maintainability improved, consistency achieved.

---

## CRITICAL PRINCIPLE

**This is REFACTORING, not reimplementation**:

- ✅ Zero functionality changes
- ✅ Zero user-facing changes
- ✅ Same features, same behavior
- ❌ Don't add new features
- ❌ Don't change UX
- ❌ Don't modify business logic

**Goal**: Replace local auth code with shared package imports. That's it.

---

## PHASE 4A: HUB REFACTORING (Agent 1, 3 days)

### Current Hub Auth Implementation

**Files to Refactor**:

```
apps/hub/src/
├── lib/
│   ├── auth-middleware.ts (DELETE - replace with @cenie/auth-server)
│   └── firebase-admin.ts (KEEP - Hub-specific)
├── hooks/
│   └── use-oauth.ts (DELETE - replace with @cenie/oauth-handlers)
├── components/auth/
│   └── oauth-error-handler.tsx (DELETE - replace with @cenie/oauth-handlers)
└── app/api/auth/ (UPDATE - use shared middleware)
```

### Refactoring Steps

**Day 1: Middleware Migration**

1. **Audit current usage**:

   ```bash
   cd apps/hub
   grep -r "from '@/lib/auth-middleware'" src/app/api/
   ```

   Find all API routes using `authenticateRequest()`, `requireAdmin()`, etc.

2. **Replace imports**:

   ```typescript
   // Old
   import { authenticateRequest } from '@/lib/auth-middleware'

   // New
   import { withAuth } from '@cenie/auth-server/middleware'
   ```

3. **Update API routes** (example):

   ```typescript
   // Old pattern
   export const GET = async (request: NextRequest) => {
     const { userId } = await authenticateRequest(request)
     // ... logic
   }

   // New pattern
   export const GET = withAuth(async (request, { user }) => {
     const userId = user.uid
     // ... logic (same logic)
   })
   ```

4. **Test each route** after migration

5. **Delete** `lib/auth-middleware.ts` when all routes migrated

**Day 2: OAuth Migration**

1. **Update OAuth pages**:

   ```typescript
   // In sign-in/sign-up pages
   // Old
   import { useOAuth } from '@/hooks/use-oauth'
   import { OAuthErrorHandler } from '@/components/auth/oauth-error-handler'

   // New
   import { useOAuth } from '@cenie/oauth-handlers/hooks'
   import { OAuthErrorHandler } from '@cenie/oauth-handlers/components'
   ```

2. **Test OAuth flows**:
   - Google OAuth
   - Apple OAuth
   - Account linking

3. **Delete local files**:
   - `hooks/use-oauth.ts`
   - `components/auth/oauth-error-handler.tsx`

**Day 3: Testing & Cleanup**

1. **Comprehensive testing**:
   - All auth flows (email, Google, Apple)
   - Admin routes protected
   - Waitlist management working
   - User profile management working

2. **Cleanup**:
   - Remove commented-out code
   - Update imports in remaining files
   - Check for any missed references

3. **Documentation**:
   - Update Hub README if needed
   - Document any Hub-specific patterns

### Hub Success Criteria

- [ ] All API routes migrated to @cenie/auth-server middleware
- [ ] OAuth migrated to @cenie/oauth-handlers
- [ ] All auth flows working (no regressions)
- [ ] Waitlist working
- [ ] User management working
- [ ] Admin access control working
- [ ] Local auth code deleted
- [ ] TypeScript strict mode passing
- [ ] Linting clean

---

## PHASE 4B: EDITORIAL REFACTORING (Agent 2, 3 days)

### Current Editorial Auth Implementation

**Files to Refactor**:

```
apps/editorial/src/
├── lib/
│   ├── auth-helpers.ts (DELETE - replace with @cenie/auth-server)
│   └── hub-auth.ts (REVIEW - may keep for Hub API calls)
└── app/api/ (UPDATE - use shared middleware)
```

### Refactoring Steps

**Day 1: Auth Helpers Migration**

1. **Audit usage**:

   ```bash
   cd apps/editorial
   grep -r "from '@/lib/auth-helpers'" src/app/
   ```

2. **Replace Editorial-specific helpers**:

   ```typescript
   // Old
   import { requireRole, requireEditorialAccess } from '@/lib/auth-helpers'

   // New
   import { withRole } from '@cenie/auth-server/middleware'

   // Create Editorial-specific helpers in lib/auth.ts
   export const requireViewer = () => withRole('editorial', 'viewer')
   export const requireEditor = () => withRole('editorial', 'editor')
   export const requireEditorialAdmin = () => withRole('editorial', 'admin')
   ```

3. **Update API routes**:

   ```typescript
   // Old
   export async function POST(request) {
     const authResult = await requireRole('editor')
     if (authResult instanceof NextResponse) return authResult
     const { user } = authResult
     // ... logic
   }

   // New
   import { requireEditor } from '@/lib/auth'
   export const POST = requireEditor()(async (request, { user }) => {
     // ... logic (unchanged)
   })
   ```

**Day 2: API Routes Update**

Editorial has many API routes (books, catalog, contributors):

1. Update each route file to use new middleware
2. Test after each file:
   - Books API: Create, read, update, delete
   - Catalog API: Publish, unpublish, update
   - Contributors API: Create, update, search
   - Translation API: Auto-translate working

3. **Critical**: Test full Editorial workflow:
   - Add book from Google Books
   - Auto-translate metadata
   - Assign contributors
   - Upload cover
   - Publish to catalog
   - View on public catalog

**Day 3: Cleanup & Verification**

1. **Delete** `lib/auth-helpers.ts`
2. **Review** `lib/hub-auth.ts`:
   - If Editorial still calls Hub APIs, keep it
   - If not used, delete it
3. **Comprehensive testing**:
   - All book management workflows
   - All catalog management
   - All contributor management
   - Role enforcement (viewer vs editor vs admin)

### Editorial Success Criteria

- [ ] All API routes migrated to @cenie/auth-server
- [ ] Auth helpers deleted (replaced with shared packages)
- [ ] All Editorial workflows working:
  - [ ] Book discovery and addition
  - [ ] Auto-translation
  - [ ] Contributor management
  - [ ] Catalog publishing
  - [ ] Public catalog display
- [ ] Three roles working (viewer, editor, admin)
- [ ] No regressions in functionality
- [ ] TypeScript and linting clean

---

## PARALLEL EXECUTION

**Agent 1 (Hub)** and **Agent 2 (Editorial)** work simultaneously:

**Coordination**:

- Daily sync on progress
- Share any shared package issues found
- Coordinate if shared packages need fixes

**Independence**:

- No code conflicts (different apps)
- Can proceed at own pace
- Merge independently

---

## TESTING STRATEGY

### Regression Testing Priority

**Hub**:

- [ ] Auth flows (highest priority)
- [ ] Waitlist management
- [ ] Access granting (admin functions)
- [ ] User profile management
- [ ] OAuth (Google, Apple)

**Editorial**:

- [ ] Auth flows
- [ ] Book management (critical workflow)
- [ ] Auto-translation
- [ ] Catalog publishing
- [ ] Public catalog display

### What NOT to Test

Don't test non-auth features extensively:

- Hub: i18n, content pages, analytics
- Editorial: Article management, search, filters

Just verify they still work, focus on auth.

---

## ROLLBACK PLAN

If refactoring introduces issues:

1. **Git branches**: Create feature branch before starting
2. **Keep backups**: Don't delete files until testing complete
3. **Incremental merge**: Merge one app at a time
4. **Monitoring**: Watch for errors in staging

**Rollback command**:

```bash
git revert [commit-hash]
git push
```

---

## COMMON PITFALLS

1. **Don't change business logic**: Only change auth code

2. **Don't skip regression testing**: Editorial especially has complex workflows

3. **Don't delete files prematurely**: Keep backups until all tests pass

4. **Don't forget Hub's admin features**: requireAdmin → withRole('hub', 'admin')

5. **Don't modify Editorial during production hours**: Refactor in staging first

---

## SUCCESS CRITERIA FOR PHASE 4

Both apps complete when:

- [ ] Hub using shared auth packages
- [ ] Editorial using shared auth packages
- [ ] All functionality working (no regressions)
- [ ] Local auth code removed
- [ ] Cleaner, more maintainable code
- [ ] All 4 apps now using same auth infrastructure

---

## DELIVERABLES

**Code Changes**:

- Hub: ~500 lines of auth code deleted, replaced with imports
- Editorial: ~600 lines of auth code deleted, replaced with imports
- Reduction: 1,100 lines → ~50 lines of imports (95% reduction)

**No Functional Changes**:

- Users see no difference
- All features work identically
- Same performance
- Better maintainability

---

## HANDOFF

When Phase 4 complete:

- [ ] All 4 apps using shared auth packages
- [ ] Auth infrastructure fully consolidated
- [ ] Ready for email integration (Phase 5)
- [ ] Ready for Sentry (Phase 6)

**This completes the core auth consolidation** - massive milestone! 🎉

---

**Estimated Time**: 6 days total (3 days per app, parallel execution)

**Critical**: Test exhaustively. These are production apps with real users (especially Editorial). Zero tolerance for breaking changes.
