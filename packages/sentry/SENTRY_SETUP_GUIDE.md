# Sentry Setup and Configuration Guide

Complete guide for setting up Sentry monitoring with the `@cenie/sentry` package across all CENIE platform apps.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Sentry Account](#step-1-create-sentry-account)
3. [Step 2: Create Projects](#step-2-create-projects)
4. [Step 3: Get DSNs](#step-3-get-dsns)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Install Dependencies](#step-5-install-dependencies)
7. [Step 6: Configure Logger in Each App](#step-6-configure-logger-in-each-app)
8. [Step 7: Test the Integration](#step-7-test-the-integration)
9. [Step 8: Configure Source Maps (Optional)](#step-8-configure-source-maps-optional)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## Prerequisites

- Sentry account (free tier is sufficient)
- Access to Vercel dashboard (for environment variables)
- Node.js and pnpm installed
- All 4 apps in the monorepo (hub, editorial, academy, agency)

---

## Step 1: Create Sentry Account

1. Go to [https://sentry.io/signup/](https://sentry.io/signup/)
2. Sign up with your email or GitHub account
3. Choose **"Developer"** plan (free tier)
4. Create an organization named **"CENIE"** (or your preferred name)

**Note**: The free tier includes:

- 5,000 errors/month
- 10,000 performance units/month
- Unlimited projects
- 30-day data retention

---

## Step 2: Create Projects

Create one Sentry project per app for clean separation:

### 2.1 Create Hub Project

1. In Sentry dashboard, click **"Create Project"**
2. Select **"Next.js"** as the platform
3. Project name: `cenie-hub`
4. Click **"Create Project"**

### 2.2 Create Editorial Project

1. Click **"Create Project"** again
2. Select **"Next.js"** platform
3. Project name: `cenie-editorial`
4. Click **"Create Project"**

### 2.3 Create Academy Project

1. Click **"Create Project"**
2. Select **"Next.js"** platform
3. Project name: `cenie-academy`
4. Click **"Create Project"**

### 2.4 Create Agency Project

1. Click **"Create Project"**
2. Select **"Next.js"** platform
3. Project name: `cenie-agency`
4. Click **"Create Project"**

**Result**: You should now have 4 projects:

- `cenie-hub`
- `cenie-editorial`
- `cenie-academy`
- `cenie-agency`

---

## Step 3: Get DSNs

For each project, you need the DSN (Data Source Name):

1. Open each project in Sentry
2. Go to **Settings** → **Projects** → **[Project Name]** → **Client Keys (DSN)**
3. Copy the **DSN** (looks like: `https://abc123@o123456.ingest.sentry.io/789012`)

**Save these DSNs** - you'll need them for environment variables.

**Example DSNs** (yours will be different):

```
Hub:       https://abc123@o123456.ingest.sentry.io/789012
Editorial: https://def456@o123456.ingest.sentry.io/789013
Academy:   https://ghi789@o123456.ingest.sentry.io/789014
Agency:    https://jkl012@o123456.ingest.sentry.io/789015
```

---

## Step 4: Configure Environment Variables

### 4.1 Vercel Environment Variables

For each app, add these environment variables in Vercel:

#### Hub App (`apps/hub`)

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/789012
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-hub
SENTRY_AUTH_TOKEN=sntrys_xxx  # Optional: for source maps upload
```

#### Editorial App (`apps/editorial`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://def456@o123456.ingest.sentry.io/789013
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-editorial
SENTRY_AUTH_TOKEN=sntrys_xxx
```

#### Academy App (`apps/academy`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://ghi789@o123456.ingest.sentry.io/789014
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-academy
SENTRY_AUTH_TOKEN=sntrys_xxx
```

#### Agency App (`apps/agency`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://jkl012@o123456.ingest.sentry.io/789015
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-agency
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### 4.2 Getting SENTRY_AUTH_TOKEN (Optional)

Only needed if you want source maps upload:

1. Go to Sentry → **Settings** → **Auth Tokens**
2. Click **"Create New Token"**
3. Name: `CENIE Platform Source Maps`
4. Scopes: Select `project:releases` and `org:read`
5. Click **"Create Token"**
6. Copy the token (starts with `sntrys_`)

**Note**: This token is optional. You can skip it if you don't need source maps.

### 4.3 Local Development (.env.local)

For local testing, create `.env.local` in each app:

```bash
# apps/hub/.env.local
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/789012
NODE_ENV=development
```

**Note**: Sentry transport is disabled in development by default. To enable locally, see [Testing Locally](#testing-locally).

---

## Step 5: Install Dependencies

The `@cenie/sentry` package is already in the monorepo. Ensure dependencies are installed:

```bash
# From project root
pnpm install
```

This will install:

- `@sentry/nextjs` (peer dependency)
- `@cenie/logger` (workspace dependency)
- `@cenie/errors` (workspace dependency)

---

## Step 6: Configure Logger in Each App

### 6.1 Hub App Configuration

Create or update `apps/hub/src/lib/logger.ts`:

```typescript
import { createLogger, ConsoleTransport } from '@cenie/logger'
import { SentryTransport, createSentryConfig } from '@cenie/sentry'

export const logger = createLogger({
  name: 'hub',
  transports: [
    // Always log to console
    new ConsoleTransport(),

    // Send to Sentry (disabled in development)
    new SentryTransport(
      createSentryConfig({
        appName: 'hub',
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
        environment: process.env.NODE_ENV,
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      })
    ),
  ],
})
```

### 6.2 Editorial App Configuration

Create or update `apps/editorial/src/lib/logger.ts`:

```typescript
import { createLogger, ConsoleTransport } from '@cenie/logger'
import { SentryTransport, createSentryConfig } from '@cenie/sentry'

export const logger = createLogger({
  name: 'editorial',
  transports: [
    new ConsoleTransport(),
    new SentryTransport(
      createSentryConfig({
        appName: 'editorial',
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
        environment: process.env.NODE_ENV,
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      })
    ),
  ],
})
```

### 6.3 Academy App Configuration

Create or update `apps/academy/src/lib/logger.ts`:

```typescript
import { createLogger, ConsoleTransport } from '@cenie/logger'
import { SentryTransport, createSentryConfig } from '@cenie/sentry'

export const logger = createLogger({
  name: 'academy',
  transports: [
    new ConsoleTransport(),
    new SentryTransport(
      createSentryConfig({
        appName: 'academy',
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
        environment: process.env.NODE_ENV,
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      })
    ),
  ],
})
```

### 6.4 Agency App Configuration

Create or update `apps/agency/src/lib/logger.ts`:

```typescript
import { createLogger, ConsoleTransport } from '@cenie/logger'
import { SentryTransport, createSentryConfig } from '@cenie/sentry'

export const logger = createLogger({
  name: 'agency',
  transports: [
    new ConsoleTransport(),
    new SentryTransport(
      createSentryConfig({
        appName: 'agency',
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
        environment: process.env.NODE_ENV,
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      })
    ),
  ],
})
```

### 6.5 Using the Logger

Now you can use the logger anywhere in your app:

```typescript
import { logger } from '@/lib/logger'

// Errors automatically go to Sentry
logger.error('Payment failed', error, { orderId: '123' })

// Warnings go to Sentry
logger.warn('Rate limit approaching', { userId: '456' })

// Info logs become breadcrumbs
logger.info('User logged in', { userId: '456' })
```

---

## Step 7: Test the Integration

### 7.1 Test Script

Use the provided test script:

```bash
# Set test DSN
export SENTRY_DSN_TEST="https://your-test-dsn@sentry.io/project-id"

# Run test
tsx packages/sentry/src/__tests__/transport-test.ts
```

### 7.2 Manual Testing

Create a test API route in one of your apps:

**`apps/hub/src/app/api/test-sentry/route.ts`**:

```typescript
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test error logging
    logger.error('Test error from Hub', {
      test: true,
      timestamp: new Date().toISOString(),
    })

    // Test warning
    logger.warn('Test warning', { component: 'test-route' })

    // Test info breadcrumb
    logger.info('Test info', { action: 'test' })

    return NextResponse.json({
      success: true,
      message: 'Check Sentry dashboard for test events',
    })
  } catch (error) {
    logger.error('Test route failed', error)
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}
```

Visit: `http://localhost:3000/api/test-sentry`

Check your Sentry dashboard - you should see:

- 1 error event
- 1 warning event
- 1 breadcrumb (info)

### 7.3 Testing with AppError

Test that AppError metadata is preserved:

```typescript
import { logger } from '@/lib/logger'
import { DatabaseError } from '@cenie/errors'

const error = new DatabaseError('Query failed', {
  metadata: {
    table: 'users',
    query: 'SELECT * FROM users',
  },
})

logger.error('Database operation failed', error)
```

In Sentry, you should see:

- Error code tag: `DATABASE_ERROR`
- Severity tag: `medium`
- Extra context: `table`, `query`

### 7.4 Testing PII Sanitization

```typescript
logger.error('Auth failed', {
  email: 'user@example.com', // Should be kept
  password: 'secret123', // Should be [REDACTED]
  token: 'abc123', // Should be [REDACTED]
  userId: 'user-123', // Should be kept
})
```

Check Sentry - `password` and `token` should show as `[REDACTED]`.

---

## Step 8: Configure Source Maps (Optional)

Source maps enable readable stack traces in Sentry.

### 8.1 Install Sentry CLI

```bash
pnpm add -D @sentry/cli
```

### 8.2 Update next.config.mjs

For each app, update `next.config.mjs`:

```javascript
import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
}

export default withSentryConfig(nextConfig, {
  // Sentry Webpack Plugin Options
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,

  // Automatically annotate releases
  automaticVercelTraces: true,
})
```

### 8.3 Build and Deploy

Source maps are uploaded automatically during build:

```bash
pnpm build
```

Check Sentry → **Releases** to see uploaded source maps.

---

## Troubleshooting

### Issue: No events appearing in Sentry

**Checklist**:

1. ✅ DSN is correct in environment variables
2. ✅ `NODE_ENV` is not `development` (or transport is explicitly enabled)
3. ✅ Logger is configured with SentryTransport
4. ✅ Events are being logged (check console)
5. ✅ Network requests are not blocked

**Debug**:

```typescript
// Add this to see if transport is initialized
const transport = new SentryTransport({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN! })
console.log('Sentry enabled:', transport['options'].enabled)
```

### Issue: Events appear but stack traces are minified

**Solution**: Configure source maps (see Step 8)

### Issue: Too many events / hitting quota

**Solution**: Adjust sample rate:

```typescript
sampleRate: 0.05 // 5% instead of 10%
```

### Issue: PII is not being redacted

**Check**:

1. Sensitive fields match the redaction list
2. Field names are case-insensitive (e.g., `password`, `Password`, `PASSWORD`)

**Add custom fields**:

```typescript
// In sentry-transport.ts, add to sensitiveFields array
const sensitiveFields = [
  'password',
  'token',
  'apiKey',
  'secret',
  'authorization',
  'apikey',
  'creditCard', // Add your custom fields
]
```

### Issue: AppError metadata not appearing

**Check**:

1. Error is an instance of AppError
2. Error is passed as second parameter to `logger.error()`
3. Error has `code` and `severity` properties

**Example**:

```typescript
// ✅ Correct
logger.error('Failed', appError)

// ❌ Wrong - error is serialized, metadata lost
logger.error('Failed', { error: appError })
```

---

## Best Practices

### 1. Environment-Specific Configuration

```typescript
const sentryConfig = createSentryConfig({
  appName: 'hub',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
  environment: process.env.NODE_ENV,
  sampleRate:
    process.env.NODE_ENV === 'production'
      ? 0.1 // 10% in production
      : process.env.NODE_ENV === 'staging'
        ? 1.0 // 100% in staging
        : 0.0, // 0% in development
})
```

### 2. Don't Log Sensitive Data

Even with PII sanitization, avoid logging:

- Passwords
- Credit card numbers
- API keys
- Personal information (unless necessary)

### 3. Use Appropriate Log Levels

```typescript
logger.error() // Actual errors that need attention
logger.warn() // Potential issues
logger.info() // Important events (becomes breadcrumbs)
logger.debug() // Detailed debugging (becomes breadcrumbs)
```

### 4. Add Context to Errors

```typescript
logger.error('Payment failed', error, {
  userId: user.id,
  orderId: order.id,
  amount: order.amount,
  paymentMethod: order.paymentMethod,
})
```

### 5. Set User Context

The transport automatically sets user context from `logContext`. Ensure you're setting it:

```typescript
import { logContext } from '@cenie/logger'

logContext.set('userId', user.id)
logContext.set('email', user.email)
```

### 6. Monitor Error Rates

Set up alerts in Sentry:

- **New error types**: Alert when new error fingerprints appear
- **Error rate spikes**: Alert when errors exceed 5x normal rate
- **Critical errors**: Immediate alert for fatal severity

### 7. Release Tracking

Sentry automatically tracks releases using `VERCEL_GIT_COMMIT_SHA`. To see which deployment introduced errors:

1. Go to Sentry → **Releases**
2. Click on a release
3. See errors introduced in that release

### 8. Performance Monitoring

The transport includes performance monitoring (traces). To see performance data:

1. Go to Sentry → **Performance**
2. View transactions and spans
3. Identify slow operations

---

## Testing Locally

To test Sentry in development:

```typescript
// Override default behavior
new SentryTransport({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
  environment: 'development',
  enabled: true, // Explicitly enable
  sampleRate: 1.0,
})
```

Or use a test DSN:

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://test-dsn@sentry.io/test-project
```

---

## Next Steps

After setup is complete:

1. ✅ Monitor Sentry dashboard for errors
2. ✅ Set up alerts for critical errors
3. ✅ Review error trends weekly
4. ✅ Configure source maps for production
5. ✅ Set up performance monitoring dashboards
6. ✅ Document error handling patterns for your team

---

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
- [@cenie/sentry Package README](./README.md)
- [Task Documentation](../../docs/implementation/tasks/PHASE_1C/TASK_1C1_SENTRY_PACKAGE.md)

---

**Need Help?** Check the troubleshooting section or review the Sentry dashboard for error details.
