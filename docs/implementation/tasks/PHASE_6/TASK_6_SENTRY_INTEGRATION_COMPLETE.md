# PHASE 6: Sentry Integration Across All Apps (Complete Guide)

**Phase**: 6 - Sentry Integration  
**Agent**: Agent 1  
**Duration**: 3 days  
**Dependencies**: Phase 1C complete (@cenie/sentry package ready)  
**Deliverables**: All 4 apps monitoring errors with Sentry

---

## OBJECTIVE

Integrate the `@cenie/sentry` package (from Phase 1C) into all 4 apps to enable production error monitoring, performance tracking, and alerting.

**What You're Building**: Comprehensive observability across the entire platform.

**Why This Matters**: Production debugging requires centralized error tracking. With 4 apps in production, you need to see errors, track releases, and get alerted to issues immediately.

---

## ARCHITECTURE CONTEXT

### Sentry Integration via Logger Transport

**How It Works** (from Phase 1C):

```typescript
// In app initialization
import { createLogger } from '@cenie/logger'
import { SentryTransport } from '@cenie/sentry'

const logger = createLogger({
  name: 'my-app',
  transports: [
    new ConsoleTransport(),
    new SentryTransport({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
      environment: process.env.NODE_ENV,
    }),
  ],
})

// Now all errors automatically go to Sentry
logger.error('Something failed', { metadata })
```

**Zero code changes needed** - errors already logged via @cenie/logger flow to Sentry automatically.

### Multi-App Sentry Setup

**Four Separate Sentry Projects** (recommended):

- `cenie-hub` - Hub errors and performance
- `cenie-editorial` - Editorial errors
- `cenie-academy` - Academy errors
- `cenie-agency` - Agency errors

**Benefits**:

- Clean separation
- Different alert rules per app
- App teams own their observability
- Easier to correlate app-specific issues

---

## SENTRY PROJECT SETUP (Prerequisites)

### Create Sentry Organization & Projects

1. **Sign up/login**: <https://sentry.io>
2. **Create organization**: "CENIE"
3. **Create 4 projects**:
   - Project 1: `cenie-hub` (Next.js platform)
   - Project 2: `cenie-editorial` (Next.js platform)
   - Project 3: `cenie-academy` (Next.js platform)
   - Project 4: `cenie-agency` (Next.js platform)

4. **Get DSNs**: Copy DSN for each project

5. **Create auth token**:
   - Settings → Auth Tokens
   - Create token with `project:releases` scope
   - Save for source maps upload

---

## PER-APP INTEGRATION

### Common Pattern (All 4 Apps)

**Step 1: Add Environment Variables**

In each app's `.env.local`:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://[public-key]@o[org-id].ingest.sentry.io/[project-id]
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-[app] # hub, editorial, academy, or agency
SENTRY_AUTH_TOKEN=sntrys_xxx
```

**Step 2: Create Instrumentation File**

`apps/[app]/src/instrumentation.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,

      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA,

      // Integrations
      integrations: [Sentry.httpIntegration()],

      // Before sending, sanitize PII
      beforeSend(event, hint) {
        // Remove sensitive data
        if (event.request?.headers) {
          delete event.request.headers.authorization
          delete event.request.headers.cookie
        }
        return event
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime initialization (if needed)
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
    })
  }
}
```

**Step 3: Configure Next.js**

Update `apps/[app]/next.config.mjs`:

```typescript
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig = {
  // ... existing config
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token for source maps upload
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress Sentry config logs
  silent: true,

  // Upload source maps on build
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
```

**Step 4: Add Sentry Dependencies**

```bash
pnpm add @sentry/nextjs --filter=@cenie/[app]
```

**Step 5: Update Logger Configuration**

If app has custom logger setup, add Sentry transport:

```typescript
import { SentryTransport } from '@cenie/sentry'

const logger = createLogger({
  name: 'app-name',
  transports: [
    new ConsoleTransport(),
    ...(process.env.NEXT_PUBLIC_SENTRY_DSN
      ? [
          new SentryTransport({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            environment: process.env.NODE_ENV,
          }),
        ]
      : []),
  ],
})
```

---

## APP-SPECIFIC IMPLEMENTATIONS

### Hub (Day 1)

**Changes**:

- Add instrumentation.ts
- Update next.config.mjs
- Add environment variables
- Test error capture

**Verify**:

- Errors from waitlist appear in Sentry
- User management errors captured
- OAuth errors captured
- Request context included

### Editorial (Day 1)

**Changes**:

- Same as Hub
- Add instrumentation.ts
- Update next.config.mjs

**Verify**:

- Book management errors captured
- Translation API errors captured
- Catalog publishing errors captured
- Contributor management errors captured

### Academy (Day 2)

**Changes**:

- Same pattern
- Test with student/instructor actions

**Verify**:

- Course enrollment errors (when implemented) captured
- Auth errors captured
- Dashboard errors captured

### Agency (Day 2)

**Changes**:

- Same pattern
- Test with client/manager actions

**Verify**:

- Template errors captured
- Project errors captured
- Auth errors captured

---

## SOURCE MAPS CONFIGURATION (Day 3)

### Automatic Upload on Build

**Vercel deployment** (automatic):

- Set SENTRY_AUTH_TOKEN in Vercel
- Source maps upload during build
- Releases tagged with git SHA

**Manual upload** (if needed):

```bash
pnpm build --filter=@cenie/hub
sentry-cli releases files cenie-hub upload-sourcemaps .next/
```

### Verify Source Maps Working

1. Trigger an error in production/staging
2. Check Sentry dashboard
3. Click on error
4. Stack trace should show:
   - **Real file names** (not minified)
   - **Real line numbers**
   - **Source code context**

If seeing minified code: source maps not working.

---

## ALERT CONFIGURATION (Day 3)

### Alert Rules

**Critical Errors** (immediate Slack/email):

- New error fingerprints (never seen before)
- Error rate > 10/minute
- Fatal severity errors
- Authentication failures spike

**Warning Alerts** (daily digest):

- Error rate increase >20%
- New issue types
- Performance degradation

**No Alerts**:

- Known validation errors
- User-triggered errors (404s, bad input)
- Expected third-party API failures

### Slack Integration (Optional)

1. Sentry → Settings → Integrations → Slack
2. Connect workspace
3. Configure alert rules
4. Test with sample error

---

## TESTING REQUIREMENTS

### Test 1: Error Capture

**In each app**, trigger test errors:

```typescript
// Create test route: apps/[app]/src/app/api/test-sentry/route.ts
import { NextResponse } from 'next/server'
import { createLogger } from '@cenie/logger'

export async function GET() {
  const logger = createLogger({ name: 'test' })

  // Test error
  logger.error('Test Sentry error', {
    testData: 'This is a test',
    timestamp: new Date().toISOString(),
  })

  // Test exception
  throw new Error('Test exception for Sentry')

  return NextResponse.json({ success: true })
}
```

Visit route, check Sentry dashboard.

**Expected**:

- Error appears in Sentry
- Metadata included
- Stack trace readable
- Tagged with app name

### Test 2: Performance Monitoring

**Check Sentry dashboard**:

- Transactions → Should see API routes
- Performance → Should see metrics
- Traces → Should see request traces

**10% sample rate means**: Only 1 in 10 requests traced (cost control).

### Test 3: Release Tracking

**After deployment**:

- Sentry should show new release (git SHA)
- Errors tagged with release
- Can compare error rates between releases

### Test 4: Context Enrichment

Trigger error with context:

```typescript
logger.error('User action failed', {
  userId: 'test-123',
  action: 'purchase',
  amount: 100,
})
```

**Expected in Sentry**:

- Error message: "User action failed"
- Extra context: userId, action, amount
- Request ID (if available)
- User info (if authenticated)

---

## SUCCESS CRITERIA

- [ ] Sentry configured in all 4 apps
- [ ] Errors appearing in Sentry dashboards
- [ ] Source maps working (readable stack traces)
- [ ] Performance data collecting
- [ ] Alert rules configured
- [ ] Slack integration working (optional)
- [ ] No PII leaking to Sentry
- [ ] Sample rates appropriate (10% traces, 100% errors)
- [ ] Release tracking working
- [ ] Team has access to Sentry projects

---

## MONITORING DASHBOARD

### What to Monitor Post-Launch

**Error Metrics**:

- Error rate (errors per hour)
- Unique error fingerprints
- Affected users
- Error distribution by route

**Performance Metrics**:

- API route response times
- Database query times
- External API latency
- Page load times

**User Impact**:

- How many users affected by each error
- Which features are most error-prone
- Geographic distribution of errors

---

## HANDOFF

When Phase 6 complete:

- [ ] All apps monitored with Sentry
- [ ] Errors automatically captured
- [ ] Alerts configured
- [ ] Team trained on Sentry dashboard

**Next**: Phase 7 (Advanced Features - caching, custom claims, CLI tools)

---

**Estimated Time**: 3 days

**Note**: Most work is configuration, not coding. Focus on proper alert setup and team training on Sentry dashboard usage.
