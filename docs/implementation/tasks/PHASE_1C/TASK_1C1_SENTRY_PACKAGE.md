# TASK 1C-1: Create @cenie/sentry Package with Logger Transport

**Phase**: 1C - Sentry Package  
**Duration**: 2 days  
**Dependencies**: None (runs parallel to Phase 1A and 1B)  
**Next Task**: Phase 6 (Sentry Integration in all apps)

---

## OBJECTIVE

Create a Sentry monitoring integration that works through the existing `@cenie/logger` package via transport pattern. This means errors logged anywhere in the codebase automatically flow to Sentry without sprinkling Sentry calls throughout code.

**What You're Building**: Sentry transport layer that plugs into existing infrastructure.

**Why This Matters**: With 4 apps in production, you need centralized error monitoring. Your existing logger and error infrastructure is excellent - Sentry adds observability without requiring code changes.

---

## ARCHITECTURE CONTEXT

### Why Transport Pattern?

**Current logging** (everywhere in codebase):
```typescript
import { createLogger } from '@cenie/logger'
const logger = createLogger({ name: 'my-feature' })

logger.error('Something failed', { userId, action })
logger.warn('Potential issue', { data })
logger.info('Action completed', { result })
```

**With Sentry Transport** (zero code changes):
```typescript
// Same code, but errors now also go to Sentry
logger.error('Something failed', { userId, action })
// → Logs to console
// → Sends to Sentry as error
// → Includes all metadata
// → Full stack trace
```

**Benefit**: Sentry integration is **additive**, not invasive.

### What Gets Sent to Sentry

**From Logger Levels**:
- `logger.error()` → Sentry Error (full capture)
- `logger.fatal()` → Sentry Error with critical severity
- `logger.warn()` → Sentry Warning
- `logger.info()` → Sentry Breadcrumb (context for errors)
- `logger.debug()` → Sentry Breadcrumb (dev mode only)

**From Error Objects**:
- AppError instances (from @cenie/errors)
- Automatically enriched with severity, metadata, error codes
- Preserves error cause chains

### Multi-App Strategy

**One Sentry Project Per App** (recommended for your architecture):
- `cenie-hub` project
- `cenie-editorial` project  
- `cenie-academy` project
- `cenie-agency` project

**Benefits**:
- Clean separation
- App teams own their observability
- Distinct error budgets
- Easier permissions

---

## REFERENCE DOCUMENTS

**Primary Reference**:
- `/docs/evaluations/SENTRY-INTEGRATION.md` (240 lines)
- Read entire document for integration strategy

**Key Sections**:
- Lines 11-46: Why Sentry makes sense
- Lines 48-123: Integration strategy (transport pattern)
- Lines 125-223: Practical concerns (DSN, PII, cost, release tracking)
- Lines 225-238: Bottom line and recommendations

**Sentry Next.js Documentation**:
- https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Focus on App Router integration

---

## WHAT TO BUILD

### Package Structure

```
packages/sentry/
├── src/
│   ├── transport/
│   │   ├── sentry-transport.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── enrichment/
│   │   ├── error-enrichment.ts
│   │   ├── context-builder.ts
│   │   └── index.ts
│   ├── config/
│   │   ├── sentry-config.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## DETAILED REQUIREMENTS

### Transport Module (`src/transport/`)

**File: `types.ts`**

```typescript
import type { Scope } from '@sentry/types'

export interface SentryTransportOptions {
  dsn: string
  environment?: string
  release?: string
  sampleRate?: number
  enabled?: boolean
}

export interface SentryContext {
  userId?: string
  email?: string
  appName?: string
  requestId?: string
  [key: string]: any
}
```

**File: `sentry-transport.ts`**

**Purpose**: Transport implementation for @cenie/logger that sends logs to Sentry

**Implementation Requirements**:

1. **Import Dependencies**:
   ```typescript
   import * as Sentry from '@sentry/nextjs'
   import type { LogEntry, ITransport } from '@cenie/logger'
   import type { AppError } from '@cenie/errors'
   import type { SentryTransportOptions } from './types'
   ```

2. **Class Structure**:
   ```typescript
   export class SentryTransport implements ITransport {
     private options: SentryTransportOptions
     private initialized: boolean = false

     constructor(options: SentryTransportOptions) {
       this.options = {
         enabled: true,
         sampleRate: 0.1, // 10% performance traces
         ...options,
       }

       // Only initialize if enabled and DSN provided
       if (this.options.enabled && this.options.dsn) {
         this.initialize()
       }
     }

     private initialize(): void {
       if (this.initialized) return

       Sentry.init({
         dsn: this.options.dsn,
         environment: this.options.environment || process.env.NODE_ENV,
         release: this.options.release || process.env.VERCEL_GIT_COMMIT_SHA,
         tracesSampleRate: this.options.sampleRate,
         
         // Don't capture console.log as breadcrumbs (we handle this explicitly)
         integrations: [
           Sentry.replayIntegration({
             maskAllText: true,
             blockAllMedia: true,
           }),
         ],
         
         // Before sending, sanitize PII
         beforeSend: (event, hint) => {
           return this.sanitizeEvent(event, hint)
         },
       })

       this.initialized = true
     }

     async log(entry: LogEntry): Promise<void> {
       if (!this.initialized || !this.options.enabled) {
         return
       }

       const { level, message, metadata, error, context } = entry

       // Set Sentry context
       if (context || metadata) {
         Sentry.setContext('custom', {
           ...context,
           ...metadata,
         })
       }

       // Handle based on log level
       switch (level) {
         case 'error':
         case 'fatal':
           this.captureError(message, error, metadata, level === 'fatal')
           break

         case 'warn':
           Sentry.captureMessage(message, {
             level: 'warning',
             extra: metadata,
           })
           break

         case 'info':
         case 'debug':
           // Add as breadcrumb for context
           Sentry.addBreadcrumb({
             message,
             level: level === 'info' ? 'info' : 'debug',
             data: metadata,
             timestamp: Date.now() / 1000,
           })
           break
       }
     }

     private captureError(
       message: string,
       error: Error | AppError | undefined,
       metadata: any,
       isFatal: boolean
     ): void {
       if (error) {
         // Enrich error with metadata
         Sentry.withScope((scope) => {
           // Set severity
           scope.setLevel(isFatal ? 'fatal' : 'error')

           // Add metadata as extra context
           if (metadata) {
             Object.entries(metadata).forEach(([key, value]) => {
               scope.setExtra(key, value)
             })
           }

           // Handle AppError specifically
           if (this.isAppError(error)) {
             scope.setTag('error_code', error.code)
             scope.setTag('error_severity', error.severity)
             
             if (error.metadata) {
               Object.entries(error.metadata).forEach(([key, value]) => {
                 scope.setExtra(`error_${key}`, value)
               })
             }
           }

           Sentry.captureException(error)
         })
       } else {
         // No error object, just message
         Sentry.captureMessage(message, {
           level: isFatal ? 'fatal' : 'error',
           extra: metadata,
         })
       }
     }

     private isAppError(error: any): error is AppError {
       return error && typeof error.code === 'string' && typeof error.severity === 'string'
     }

     private sanitizeEvent(event: Sentry.Event, hint: Sentry.EventHint): Sentry.Event | null {
       // Remove PII from breadcrumbs and context
       // Use existing sanitizer from @cenie/logger if available
       
       // Redact sensitive fields
       const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization']
       
       // Sanitize breadcrumbs
       if (event.breadcrumbs) {
         event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
           if (breadcrumb.data) {
             Object.keys(breadcrumb.data).forEach((key) => {
               if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
                 breadcrumb.data![key] = '[REDACTED]'
               }
             })
           }
           return breadcrumb
         })
       }

       // Sanitize context
       if (event.extra) {
         Object.keys(event.extra).forEach((key) => {
           if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
             event.extra![key] = '[REDACTED]'
           }
         })
       }

       return event
     }
   }
   ```

3. **Flush Method** (for graceful shutdown):
   ```typescript
   async flush(): Promise<boolean> {
     if (!this.initialized) return true
     return await Sentry.close(2000) // 2 second timeout
   }
   ```

**File: `index.ts`**

```typescript
export * from './sentry-transport'
export * from './types'
```

### Config Module (`src/config/`)

**File: `sentry-config.ts`**

**Purpose**: Helper to create Sentry config for each app

```typescript
import type { SentryTransportOptions } from '../transport/types'

export interface CreateSentryConfigOptions {
  appName: 'hub' | 'editorial' | 'academy' | 'agency'
  dsn: string
  environment?: string
  sampleRate?: number
}

export function createSentryConfig(
  options: CreateSentryConfigOptions
): SentryTransportOptions {
  return {
    dsn: options.dsn,
    environment: options.environment || process.env.NODE_ENV || 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    sampleRate: options.sampleRate || (options.environment === 'production' ? 0.1 : 1.0),
    enabled: options.environment !== 'development', // Disable in dev by default
  }
}
```

**File: `index.ts`**

```typescript
export * from './sentry-config'
```

### Package Configuration

**File: `package.json`**

```json
{
  "name": "@cenie/sentry",
  "version": "0.0.1",
  "private": true,
  "description": "Sentry monitoring integration for CENIE platform",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./transport": "./src/transport/index.ts",
    "./config": "./src/config/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .turbo node_modules dist"
  },
  "dependencies": {
    "@cenie/logger": "workspace:*",
    "@cenie/errors": "workspace:*",
    "@sentry/nextjs": "^8.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

**File: `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## TESTING REQUIREMENTS

### Test 1: Transport Integration

Create test script: `packages/sentry/src/__tests__/transport-test.ts`

```typescript
import { SentryTransport } from '../transport/sentry-transport'
import { createLogger } from '@cenie/logger'
import { AuthenticationError } from '@cenie/errors'

async function test() {
  // Create logger with Sentry transport
  const logger = createLogger({
    name: 'test-logger',
    transports: [
      new SentryTransport({
        dsn: process.env.SENTRY_DSN_TEST || 'https://public@sentry.io/test',
        environment: 'test',
        enabled: true,
      }),
    ],
  })

  // Test error logging
  logger.error('Test error message', {
    userId: 'test-123',
    action: 'test-action',
  })

  // Test with Error object
  logger.error('Test with error object', {
    error: new Error('Test error'),
  })

  // Test with AppError
  logger.error('Test with AppError', {
    error: new AuthenticationError('Token expired', {
      metadata: { tokenType: 'id-token' },
    }),
  })

  // Test warning
  logger.warn('Test warning message', {
    component: 'test-component',
  })

  // Test breadcrumbs
  logger.info('User action', { action: 'click-button' })
  logger.debug('Debug info', { value: 123 })

  // Give Sentry time to send
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log('✅ Test complete - check Sentry dashboard')
}

test().catch(console.error)
```

**Run**:
```bash
SENTRY_DSN_TEST="your_test_dsn" tsx packages/sentry/src/__tests__/transport-test.ts
```

**Expected**:
- Check Sentry dashboard
- Should see 3 errors (error, error with Error, error with AppError)
- Should see 1 warning
- Error details should include metadata
- AppError should have error_code and error_severity tags

### Test 2: PII Sanitization

```typescript
// Test that sensitive data is redacted
logger.error('Auth failed', {
  email: 'user@example.com', // Should be kept
  password: 'secret123', // Should be redacted
  token: 'abc123', // Should be redacted
  userId: 'user-123', // Should be kept
})
```

Check Sentry dashboard - password and token should be `[REDACTED]`.

### Test 3: AppError Enrichment

```typescript
import { DatabaseError } from '@cenie/errors'

const error = new DatabaseError('Query failed', {
  metadata: {
    table: 'users',
    query: 'SELECT * FROM users',
  },
})

logger.error('Database operation failed', { error })
```

**Expected in Sentry**:
- Error code tag: `DATABASE_ERROR`
- Severity tag: `medium` (or whatever DatabaseError sets)
- Extra context: table, query
- Stack trace preserved

---

## SUCCESS CRITERIA

- [ ] Package builds without errors
- [ ] TypeScript strict mode passing
- [ ] Linting clean
- [ ] SentryTransport implements ITransport interface from @cenie/logger
- [ ] Errors flow to Sentry dashboard
- [ ] Breadcrumbs captured correctly
- [ ] AppError metadata preserved
- [ ] PII sanitization working
- [ ] Sample rate configuration working
- [ ] Environment filtering working (dev mode disabled)
- [ ] README comprehensive

---

## SENTRY PROJECT SETUP

### 1. Create Sentry Account

1. Sign up at https://sentry.io (free tier sufficient for now)
2. Create organization: "CENIE"

### 2. Create Projects

Create 4 projects:
- **cenie-hub** (Next.js platform)
- **cenie-editorial** (Next.js platform)
- **cenie-academy** (Next.js platform)
- **cenie-agency** (Next.js platform)

Get DSN for each project.

### 3. Environment Variables (For Phase 6)

Each app will need:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://public@o123.ingest.sentry.io/456
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-hub  # Different per app
SENTRY_AUTH_TOKEN=sntrys_xxx  # For source maps upload
```

**For TASK_1C1 testing**: Use test project DSN.

---

## COMMON PITFALLS

1. **Don't send in development**: Default to enabled: false for NODE_ENV=development

2. **Don't over-sample**: Start with 10% traces (0.1), 100% errors

3. **Don't forget to flush**: On server shutdown, call `Sentry.close()`

4. **Don't log full stack everywhere**: Sentry captures this automatically

5. **Don't send PII**: Always sanitize passwords, tokens, credit cards

---

## INTEGRATION WITH @cenie/logger

After this package exists, apps can use it like this:

```typescript
// In app's logger configuration
import { createLogger } from '@cenie/logger'
import { SentryTransport } from '@cenie/sentry'

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
logger.error('Something failed', { context })
```

**Zero code changes needed in the app** - just configuration!

---

## PERFORMANCE CONSIDERATIONS

**Sentry Transport Overhead**:
- Error capture: ~5-10ms (async, non-blocking)
- Breadcrumb: ~1-2ms (buffered)
- Network: Batched and sent async

**Not a concern** - Sentry is designed for high-throughput apps.

**Rate Limiting**:
- Sentry has built-in rate limiting
- Transport respects sample rates
- No additional throttling needed

---

## HANDOFF

When complete:
- [ ] Package functional
- [ ] Transport integrates with @cenie/logger
- [ ] Tested with sample errors
- [ ] PII sanitization working
- [ ] Sentry projects created
- [ ] Documentation complete

**Next Phase**: Phase 6 will add this transport to all 4 apps with their specific DSNs.

---

**Estimated Time**: 8-12 hours (2 days)

**Critical**: This integrates with existing infrastructure (@cenie/logger, @cenie/errors). Don't create new error handling - extend what exists.

