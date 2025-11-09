# PHASE 7: Advanced Features & Polish (Complete Guide)

**Phase**: 7 - Advanced Features  
**Agent**: Agent 2  
**Duration**: 5 days  
**Dependencies**: Phases 2, 3, 4B complete  
**Deliverables**: Production-ready features, tooling, documentation

---

## OBJECTIVE

Add advanced authentication features that improve performance, developer experience, and operational efficiency. This is the polish phase that makes the system production-ready.

**What You're Building**: Custom claims, access caching, CLI tools, comprehensive documentation.

**Why This Matters**: These optimizations reduce database queries by 80%, make access management easy, and provide offline capability.

---

## TASK 7-1: CUSTOM CLAIMS IMPLEMENTATION (Day 1)

### What Are Custom Claims?

**Firebase Custom Claims** = Data stored in ID token

- Included in every Firebase ID token
- Available offline (no database query)
- Useful for quick access checks
- Limit: 1KB total

**Use Case**: Quick "does user have access to this app?" check without Firestore query.

### Implementation

**Already built in Phase 1A**: `@cenie/auth-utils/tokens/sync-claims.ts`

**Now**: Integrate into access grant flow.

#### Update Access Grant Flow

**File**: Update @cenie/auth-utils if needed, or create in apps/hub

When granting access (in Hub's admin panel or CLI):

```typescript
import { grantAccess } from '@cenie/auth-utils/access-control'
import { syncCustomClaims } from '@cenie/auth-utils/tokens'

// Grant access
await grantAccess({
  userId: 'user-123',
  appName: 'academy',
  role: 'student',
  grantedBy: adminUserId,
})

// Custom claims updated automatically by grantAccess()
// User's next ID token will include:
// {
//   apps: ['hub', 'academy'],
//   roles: { hub: 'user', academy: 'student' }
// }
```

#### Use Custom Claims for Quick Checks

**File**: `packages/auth-utils/src/access-control/quick-check.ts` (NEW)

```typescript
import type { DecodedIdToken } from 'firebase-admin/auth'
import type { AppName } from '../types'

/**
 * Quick access check using custom claims (offline, no Firestore query)
 * Use this for initial checks, then verify with Firestore for detailed role info
 */
export function hasAccessFromClaims(decoded: DecodedIdToken, appName: AppName): boolean {
  const apps = decoded.apps as AppName[] | undefined
  return apps ? apps.includes(appName) : false
}

/**
 * Get role from custom claims (may be stale if recently updated)
 */
export function getRoleFromClaims(decoded: DecodedIdToken, appName: AppName): string | null {
  const roles = decoded.roles as Record<string, string> | undefined
  return roles ? roles[appName] || null : null
}
```

#### Testing

1. Grant Academy access to a user
2. Get user's ID token (have them sign in)
3. Decode token (use jwt.io or Firebase SDK)
4. Verify custom claims:

   ```json
   {
     "apps": ["hub", "academy"],
     "roles": {
       "hub": "user",
       "academy": "student"
     }
   }
   ```

**Success**: Custom claims reflect access changes within 1 hour (token refresh).

---

## TASK 7-2: ACCESS CONTROL CACHING (Day 2)

### Cache Implementation

**Already built in Phase 1A**: `@cenie/auth-utils/access-control/cache.ts`

**Now**: Ensure it's working and monitor cache performance.

### Cache Monitoring

**Add logging to cache operations**:

```typescript
// In cache.ts
get(userId: string, appName: string): AccessData | null {
  const cached = // ... get from map

  if (cached && not expired) {
    logger.debug('Cache HIT', { userId, appName })
    return cached.data
  }

  logger.debug('Cache MISS', { userId, appName })
  return null
}
```

### Cache Performance Metrics

**Track**:

- Cache hit rate (should be >80% in production)
- Average lookup time (should be <1ms)
- Cache size (number of entries)
- Eviction rate

**Add to monitoring**:

```typescript
// Expose cache stats endpoint
export async function GET() {
  return NextResponse.json({
    size: accessCache.size(),
    hitRate: accessCache.hitRate(),
  })
}
```

### Cache Invalidation Strategy

**When to clear cache**:

- User granted access → clear that user/app
- User revoked access → clear that user/app
- User role changed → clear that user/app
- User deleted → clear all for user

**Automatic**: Already handled in `grantAccess()` and `revokeAccess()` from Phase 1A.

### Testing

1. **Cold start**: Check access (cache miss, Firestore query)
2. **Warm cache**: Check again (cache hit, no query)
3. **Verify logs**: See "Cache HIT" in logs
4. **Monitor Firestore**: Queries reduced significantly

**Expected**: After warmup, 80%+ of access checks are cache hits.

---

## TASK 7-3: ACCESS MANAGEMENT CLI (Day 3)

### CLI Tool for Access Management

**File**: `scripts/manage-access.ts`

**Purpose**: Easy access granting without Firebase Console

```typescript
#!/usr/bin/env tsx

import { program } from 'commander'
import { initializeAdminApp } from '@cenie/firebase/server'
import { grantAccess, revokeAccess } from '@cenie/auth-utils/access-control'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load env vars
config({ path: resolve(__dirname, '../.env') })

program.name('manage-access').description('CENIE Platform Access Management CLI').version('1.0.0')

// Grant access command
program
  .command('grant')
  .description('Grant user access to an app')
  .argument('<email>', 'User email')
  .argument('<app>', 'App name (hub|editorial|academy|agency)')
  .argument('<role>', 'Role to grant')
  .option('--by <adminEmail>', 'Admin email granting access')
  .action(async (email, app, role, options) => {
    try {
      const adminApp = initializeAdminApp()
      const firestore = adminApp.firestore()
      const auth = adminApp.auth()

      // Find user by email
      const userRecord = await auth.getUserByEmail(email)

      // Get admin user ID if provided
      let grantedBy = null
      if (options.by) {
        const adminRecord = await auth.getUserByEmail(options.by)
        grantedBy = adminRecord.uid
      }

      // Grant access
      await grantAccess({
        userId: userRecord.uid,
        appName: app as any,
        role,
        grantedBy,
      })

      console.log(`✅ Granted ${role} access to ${email} for ${app}`)
      console.log(`User ID: ${userRecord.uid}`)
    } catch (error) {
      console.error('❌ Failed to grant access:', error)
      process.exit(1)
    }
  })

// Revoke access command
program
  .command('revoke')
  .description('Revoke user access to an app')
  .argument('<email>', 'User email')
  .argument('<app>', 'App name')
  .action(async (email, app) => {
    try {
      const adminApp = initializeAdminApp()
      const auth = adminApp.auth()

      const userRecord = await auth.getUserByEmail(email)

      await revokeAccess(userRecord.uid, app as any)

      console.log(`✅ Revoked access for ${email} from ${app}`)
    } catch (error) {
      console.error('❌ Failed to revoke access:', error)
      process.exit(1)
    }
  })

// List access command
program
  .command('list')
  .description('List all users with access to an app')
  .argument('<app>', 'App name')
  .option('--role <role>', 'Filter by role')
  .action(async (app, options) => {
    try {
      const adminApp = initializeAdminApp()
      const firestore = adminApp.firestore()

      let query = firestore
        .collection('user_app_access')
        .where('appName', '==', app)
        .where('isActive', '==', true)

      if (options.role) {
        query = query.where('role', '==', options.role)
      }

      const snapshot = await query.get()

      console.log(`\n📋 Users with ${app} access:\n`)

      for (const doc of snapshot.docs) {
        const data = doc.data()
        console.log(`- ${data.userId} (${data.role})`)
      }

      console.log(`\nTotal: ${snapshot.size} users`)
    } catch (error) {
      console.error('❌ Failed to list access:', error)
      process.exit(1)
    }
  })

// Sync claims command
program
  .command('sync-claims')
  .description('Sync custom claims for a user')
  .argument('<email>', 'User email')
  .action(async (email) => {
    try {
      const { syncCustomClaims } = await import('@cenie/auth-utils/tokens')
      const adminApp = initializeAdminApp()
      const auth = adminApp.auth()

      const userRecord = await auth.getUserByEmail(email)
      await syncCustomClaims(userRecord.uid)

      console.log(`✅ Custom claims synced for ${email}`)
    } catch (error) {
      console.error('❌ Failed to sync claims:', error)
      process.exit(1)
    }
  })

program.parse()
```

### Add to package.json

```json
{
  "scripts": {
    "access": "tsx scripts/manage-access.ts"
  }
}
```

### Usage Examples

```bash
# Grant student access to Academy
pnpm access grant student@example.com academy student

# Grant editor access to Editorial
pnpm access grant editor@example.com editorial editor --by admin@cenie.org

# List all Academy users
pnpm access list academy

# List Academy instructors only
pnpm access list academy --role instructor

# Revoke access
pnpm access revoke user@example.com editorial

# Sync custom claims after manual Firestore edit
pnpm access sync-claims user@example.com
```

### Testing

Test all commands:

- [ ] Grant access to test user
- [ ] List users for each app
- [ ] Revoke access
- [ ] Sync claims
- [ ] Verify Firestore records created/updated correctly

---

## TASK 7-4: SESSION DEVICE TRACKING (Day 4, Optional)

### Purpose

Track active sessions per user for:

- "Active Sessions" page in user settings
- "Sign out all devices" functionality
- Security monitoring

### Implementation

**File**: `packages/auth-utils/src/sessions/device-tracking.ts` (NEW)

```typescript
import { Timestamp } from 'firebase-admin/firestore'
import { initializeAdminApp } from '@cenie/firebase/server'
import { v4 as uuidv4 } from 'uuid'

export interface SessionDevice {
  sessionId: string
  userId: string
  deviceInfo: {
    userAgent: string
    ip: string
    browser?: string
    os?: string
  }
  createdAt: Timestamp
  lastActiveAt: Timestamp
  expiresAt: Timestamp
}

export async function trackSession(
  userId: string,
  deviceInfo: { userAgent: string; ip: string }
): Promise<string> {
  const adminApp = initializeAdminApp()
  const firestore = adminApp.firestore()

  const sessionId = uuidv4()
  const now = Timestamp.now()
  const expiresAt = new Timestamp(now.seconds + 14 * 24 * 60 * 60, 0) // 14 days

  await firestore.collection('user_sessions').add({
    sessionId,
    userId,
    deviceInfo,
    createdAt: now,
    lastActiveAt: now,
    expiresAt,
  })

  return sessionId
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  const adminApp = initializeAdminApp()
  const firestore = adminApp.firestore()

  await firestore
    .collection('user_sessions')
    .where('sessionId', '==', sessionId)
    .limit(1)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        snapshot.docs[0].ref.update({
          lastActiveAt: Timestamp.now(),
        })
      }
    })
}

export async function revokeAllSessions(userId: string): Promise<void> {
  const adminApp = initializeAdminApp()
  const firestore = adminApp.firestore()

  const sessions = await firestore.collection('user_sessions').where('userId', '==', userId).get()

  const batch = firestore.batch()
  sessions.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
}
```

**Note**: This is optional - adds complexity but provides security features.

---

## TASK 7-5: FINAL DOCUMENTATION (Day 5)

### Complete Documentation Package

#### 1. Authentication Guide (`docs/AUTH_GUIDE.md`)

**Contents**:

- Architecture overview (how auth works across apps)
- Adding auth to new app (step-by-step)
- Role management (how to grant/revoke)
- OAuth setup (per-app Firebase configuration)
- Session management (how sessions work)
- Troubleshooting (common issues and solutions)

**Target audience**: Developers joining the team

#### 2. Access Control Guide (`docs/ACCESS_CONTROL_GUIDE.md`)

**Contents**:

- Role hierarchy (all app roles explained)
- Granting access (using CLI and Firebase Console)
- Custom claims (how they work, limitations)
- Caching strategy (performance optimization)
- Firestore structure (database schema)

**Target audience**: Ops team, admins

#### 3. API Reference (`docs/API_REFERENCE.md`)

**Contents**:

- All exported functions from shared packages
- Type definitions
- Usage examples
- Error handling patterns

**Target audience**: Developers using the packages

#### 4. Deployment Guide (`docs/DEPLOYMENT_GUIDE.md`)

**Contents**:

- Environment variables required per app
- DNS configuration for email
- Sentry project setup
- Firebase configuration
- Vercel deployment settings
- Rollback procedures

**Target audience**: DevOps, deployment engineers

#### 5. Troubleshooting Guide (`docs/TROUBLESHOOTING.md`)

**Contents**:

**Common Issues**:

- "Invalid session" errors → Check cookie settings, expiration
- "No access to app" → Check Firestore user_app_access
- OAuth popup blocked → Browser settings
- Emails not sending → Check DNS, Resend verification
- Sentry not capturing → Check DSN, environment

**Debug Checklist**:

- [ ] Check Firebase Auth user exists
- [ ] Check Firestore profile exists
- [ ] Check user_app_access record
- [ ] Check session cookie in browser
- [ ] Check environment variables
- [ ] Check Sentry dashboard
- [ ] Check server logs

**Target audience**: Support team, developers

---

## DELIVERABLES CHECKLIST

### Features

- [ ] Custom claims implemented and syncing
- [ ] Access caching working (>80% hit rate)
- [ ] CLI tool functional (grant, revoke, list, sync-claims)
- [ ] Session device tracking (optional)

### Documentation

- [ ] AUTH_GUIDE.md complete
- [ ] ACCESS_CONTROL_GUIDE.md complete
- [ ] API_REFERENCE.md complete
- [ ] DEPLOYMENT_GUIDE.md complete
- [ ] TROUBLESHOOTING.md complete

### Quality

- [ ] All packages have README.md
- [ ] All functions have JSDoc comments
- [ ] Type definitions complete
- [ ] Examples provided

---

## SUCCESS CRITERIA FOR PHASE 7

- [ ] Custom claims reducing Firestore queries
- [ ] Cache hit rate >80% in production
- [ ] CLI tool used successfully by team
- [ ] Documentation comprehensive and accurate
- [ ] No outstanding bugs or issues
- [ ] System production-ready

---

## DEPLOYMENT PREPARATION

### Pre-Production Checklist

**Infrastructure**:

- [ ] Firebase configured for all apps
- [ ] Firestore security rules updated
- [ ] Resend domains verified (4 domains)
- [ ] Sentry projects configured (4 projects)
- [ ] Environment variables set in Vercel

**Testing**:

- [ ] All auth flows tested per app
- [ ] Email flows tested (verification, reset)
- [ ] Role enforcement tested
- [ ] Sessions tested (creation, persistence, expiration)
- [ ] OAuth tested (Google, Apple, account linking)
- [ ] Error monitoring working (Sentry)

**Documentation**:

- [ ] README.md updated per app
- [ ] DEPLOYMENT_GUIDE.md complete
- [ ] Runbooks created
- [ ] Team trained

**Monitoring**:

- [ ] Sentry alerts configured
- [ ] Performance baselines established
- [ ] Error budgets defined
- [ ] On-call rotation (if applicable)

---

## PRODUCTION ROLLOUT STRATEGY

### Staged Deployment

**Stage 1: New Apps (Low Risk)**

- Deploy Academy to production
- Deploy Agency to production
- Monitor for 48 hours
- Fix any issues

**Stage 2: Editorial (Medium Risk)**

- Deploy to staging first
- Full regression testing
- Deploy to production (low-traffic window)
- Gradual rollout: 10% → 50% → 100%
- Monitor Editorial workflows closely

**Stage 3: Hub (High Risk)**

- Deploy to staging
- Comprehensive testing
- Deploy to production (maintenance window)
- Monitor authentication metrics
- Watch for access grant/revoke issues

### Monitoring During Rollout

**Watch these metrics**:

- Authentication success rate (should stay >95%)
- Session creation rate
- Error rate (should not spike)
- Email delivery rate
- Sentry error counts

**Alert thresholds**:

- Auth success rate drops below 90% → investigate immediately
- Error rate >2x normal → investigate
- Email delivery <95% → check DNS/Resend

---

## SUCCESS METRICS

### Technical Metrics

- **Code Reduction**: 85%+ auth code removed from apps
- **Performance**: Session creation <500ms, access check <100ms
- **Cache Hit Rate**: >80%
- **Email Delivery**: >98%
- **Error Rate**: <0.1% of requests

### Operational Metrics

- **Time to Grant Access**: <2 minutes (using CLI)
- **Time to Debug Auth Issue**: <30 minutes (with Sentry)
- **Time to Add New App**: <4 hours (using shared packages)

### User Experience Metrics

- **Session Persistence**: No unexpected logouts
- **OAuth Success Rate**: >95%
- **Email Verification Time**: <5 minutes (delivery + click)

---

## HANDOFF TO PRODUCTION

### What Gets Deployed

**Shared Packages** (5):

- @cenie/auth-server
- @cenie/auth-utils
- @cenie/oauth-handlers
- @cenie/email
- @cenie/sentry

**Apps** (4):

- Hub (refactored)
- Editorial (refactored)
- Academy (new)
- Agency (new)

**Infrastructure**:

- Sentry monitoring (4 projects)
- Email sending (4 domains)
- Custom claims (enabled)
- Access caching (enabled)

### Post-Deployment Monitoring

**First 24 Hours**:

- Watch Sentry for error spikes
- Monitor authentication metrics
- Check email delivery rates
- Verify session creation working

**First Week**:

- Collect user feedback
- Monitor performance metrics
- Fine-tune cache TTLs
- Adjust Sentry sample rates if needed

**First Month**:

- Analyze error patterns
- Optimize based on usage
- Update documentation based on issues
- Plan next iterations

---

## FINAL SUCCESS CRITERIA

**All phases complete when**:

✅ Authentication:

- [ ] All 4 apps have functional auth
- [ ] OAuth working (Google + Apple)
- [ ] Sessions persisting correctly
- [ ] Role-based access working

✅ Infrastructure:

- [ ] Email sending working (verification, reset, welcome)
- [ ] Sentry monitoring all apps
- [ ] Custom claims enabled
- [ ] Caching optimized

✅ Code Quality:

- [ ] 85%+ code reduction achieved
- [ ] Zero TypeScript errors
- [ ] Zero linting warnings
- [ ] Comprehensive test coverage

✅ Documentation:

- [ ] All guides complete
- [ ] API docs complete
- [ ] Troubleshooting docs complete
- [ ] Team trained

✅ Production Ready:

- [ ] All apps deployed successfully
- [ ] Monitoring working
- [ ] No critical issues
- [ ] User feedback positive

---

## HANDOFF

**When Phase 7 complete**:

🎉 **PROJECT COMPLETE** 🎉

All objectives achieved:

- Auth consolidated across 4 apps
- Email infrastructure operational
- Sentry monitoring active
- Advanced features implemented
- Documentation comprehensive
- Production-ready

**Maintenance mode**: System is live, monitor and iterate based on usage.

---

**Estimated Time**: 5 days

**This is the final phase** - comprehensive testing and documentation ensure long-term success.
