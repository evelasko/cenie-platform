# @cenie/sentry

Sentry monitoring integration for CENIE platform. Provides a transport layer for `@cenie/logger` that automatically sends errors and logs to Sentry.

## Features

- 🔌 **Logger Transport**: Integrates seamlessly with `@cenie/logger`
- 🎯 **Automatic Error Capture**: Errors logged via logger automatically flow to Sentry
- 📊 **Breadcrumb Tracking**: Info/debug logs become Sentry breadcrumbs
- 🔒 **PII Sanitization**: Automatically redacts sensitive data
- 🏷️ **AppError Enrichment**: Preserves error codes, severity, and metadata
- ⚙️ **Zero Code Changes**: Works with existing logging infrastructure

## Installation

Already included in the monorepo as `@cenie/sentry`.

## Quick Start

### Basic Usage

```typescript
import { createLogger } from '@cenie/logger'
import { SentryTransport } from '@cenie/sentry'
import { ConsoleTransport } from '@cenie/logger/transports'

const logger = createLogger({
  name: 'my-app',
  transports: [
    new ConsoleTransport(), // Always log to console
    new SentryTransport({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
      environment: process.env.NODE_ENV,
    }),
  ],
})

// Now all logger.error() calls also go to Sentry
logger.error('Something failed', { userId: '123', action: 'checkout' })
```

### Using Config Helper

```typescript
import { createLogger } from '@cenie/logger'
import { SentryTransport, createSentryConfig } from '@cenie/sentry'

const logger = createLogger({
  name: 'hub',
  transports: [
    new SentryTransport(
      createSentryConfig({
        appName: 'hub',
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
        environment: process.env.NODE_ENV,
      })
    ),
  ],
})
```

## How It Works

### Log Level Mapping

- `logger.error()` / `logger.fatal()` → Sentry Error (full capture with stack trace)
- `logger.warn()` → Sentry Warning
- `logger.info()` → Sentry Breadcrumb (context for errors)
- `logger.debug()` → Sentry Breadcrumb (dev mode only)
- `logger.trace()` → Sentry Breadcrumb

### AppError Integration

When logging `AppError` instances from `@cenie/errors`, the transport automatically:

- Sets error code as Sentry tag (`error_code`)
- Sets severity as Sentry tag (`error_severity`)
- Includes error metadata as extra context
- Preserves error cause chains

```typescript
import { DatabaseError } from '@cenie/errors'

const error = new DatabaseError('Query failed', {
  metadata: {
    table: 'users',
    query: 'SELECT * FROM users',
  },
})

logger.error('Database operation failed', error)
// → Sentry receives:
//   - Error code tag: DATABASE_ERROR
//   - Severity tag: medium
//   - Extra context: table, query
//   - Full stack trace
```

## Configuration

### SentryTransportOptions

```typescript
interface SentryTransportOptions {
  dsn: string // Sentry DSN (required)
  environment?: string // Environment name (default: NODE_ENV)
  release?: string // Release version (default: VERCEL_GIT_COMMIT_SHA)
  sampleRate?: number // Performance trace sample rate (default: 0.1)
  enabled?: boolean // Enable/disable transport (default: true)
}
```

### Environment Variables

Each app should have:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://public@o123.ingest.sentry.io/456
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-hub  # Different per app
SENTRY_AUTH_TOKEN=sntrys_xxx  # For source maps upload
```

## PII Sanitization

The transport automatically redacts sensitive fields from:

- Breadcrumbs
- Extra context
- Tags

Sensitive fields include: `password`, `token`, `apiKey`, `secret`, `authorization`, `apikey`

## Best Practices

### 1. Disable in Development

```typescript
new SentryTransport({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
  enabled: process.env.NODE_ENV === 'production',
})
```

### 2. Use Appropriate Sample Rates

```typescript
// Production: 10% performance traces, 100% errors
sampleRate: 0.1

// Staging: 100% for testing
sampleRate: 1.0
```

### 3. Always Flush on Shutdown

```typescript
// In Next.js API routes or serverless functions
await logger.flush() // Calls Sentry.close() on all transports
```

### 4. Combine with Console Transport

Always keep console logging for local development:

```typescript
transports: [
  new ConsoleTransport(),
  new SentryTransport({ ... }),
]
```

## Integration with Existing Code

**Zero code changes needed!** The transport works with your existing logging:

```typescript
// Before: Only console logging
logger.error('Payment failed', error, { orderId: '123' })

// After adding SentryTransport: Same code, now also goes to Sentry
logger.error('Payment failed', error, { orderId: '123' })
```

## Testing

See `src/__tests__/transport-test.ts` for example test script.

Run tests:

```bash
SENTRY_DSN_TEST="your_test_dsn" tsx packages/sentry/src/__tests__/transport-test.ts
```

## Architecture

This package integrates with:

- `@cenie/logger`: Provides Transport interface
- `@cenie/errors`: Enriches AppError instances
- `@sentry/nextjs`: Sentry SDK for Next.js

## Next Steps

After this package is created, Phase 6 will:

1. Add SentryTransport to all 4 apps (hub, editorial, academy, agency)
2. Configure Next.js instrumentation files
3. Set up source maps upload
4. Configure alerts and dashboards

## Setup Guide

**📖 [Complete Sentry Setup Guide](./SENTRY_SETUP_GUIDE.md)** - Step-by-step instructions for configuring Sentry across all apps.

The setup guide covers:

- Creating Sentry account and projects
- Configuring environment variables
- Setting up logger in each app
- Testing the integration
- Troubleshooting common issues
- Best practices

## Reference

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Task Document](../../docs/implementation/tasks/PHASE_1C/TASK_1C1_SENTRY_PACKAGE.md)
- [Sentry Integration Evaluation](../../docs/evaluations/SENTRY-INTEGRATION.md)
