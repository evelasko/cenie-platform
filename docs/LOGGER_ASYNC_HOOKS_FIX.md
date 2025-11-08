# Logger Package: async_hooks Resolution Fix

## Problem

The `@cenie/logger` package was causing build failures in the hub app with the error:

```
Module not found: Can't resolve 'async_hooks'
```

This occurred because the logger package used Node.js's `async_hooks` module (specifically `AsyncLocalStorage`) for request-scoped logging context. The `async_hooks` module is server-side only and doesn't exist in browser environments. When Next.js tried to bundle the logger for client components, it failed.

## Root Cause

1. The logger package had a single implementation that imported `async_hooks`
2. Next.js bundles code for both server and client (browser) environments
3. Client-side code cannot use Node.js-specific modules like `async_hooks`
4. The package wasn't properly separating server and client implementations

## Solution

Implemented conditional exports and separate client/server implementations:

### 1. Created Separate Context Implementations

**Server Context** (`async-context.server.ts`)

- Uses Node.js `AsyncLocalStorage` from `async_hooks`
- Provides full async context tracking for server-side requests
- Maintains request-scoped data across async operations

**Client Context** (`async-context.client.ts`)

- Uses a simple in-memory Map for context storage
- Browser-safe implementation without Node.js dependencies
- Provides the same API interface for consistency

### 2. Created Separate Logger Implementations

**Server Logger** (`logger.ts`)

- Imports server context implementation
- Full-featured logging with async context support

**Client Logger** (`logger.client.ts`)

- Imports client context implementation
- Browser-safe logging without async_hooks

### 3. Updated Package Exports

Modified `packages/logger/package.json` to use conditional exports:

```json
{
  "exports": {
    ".": {
      "react-server": "./src/index.server.ts",
      "edge-light": "./src/index.client.ts",
      "browser": "./src/index.client.ts",
      "worker": "./src/index.client.ts",
      "types": "./src/index.ts",
      "default": "./src/index.server.ts"
    },
    "./client": "./src/index.client.ts",
    "./server": "./src/index.server.ts",
    "./context": {
      "react-server": "./src/context/async-context.server.ts",
      "edge-light": "./src/context/async-context.client.ts",
      "browser": "./src/context/async-context.client.ts",
      "default": "./src/context/async-context.server.ts"
    }
  }
}
```

### 4. Updated Hub App Imports

**Server-side logger** (`apps/hub/src/lib/logger.ts`)

```typescript
import { createLogger, developmentPreset, productionPreset } from '@cenie/logger/server'
```

**Client-side logger** (`apps/hub/src/lib/logger-client.ts`)

```typescript
import { createLogger, developmentPreset, productionPreset } from '@cenie/logger/client'
```

### 5. Updated Next.js Configuration

Added webpack configuration to ensure proper resolution of conditional exports:

```javascript
webpack: (config, { isServer }) => {
  config.resolve.conditionNames = isServer
    ? ['node', 'import', 'require', 'default']
    : ['browser', 'module', 'import', 'require', 'default']

  return config
}
```

## Files Created/Modified

### New Files

- `packages/logger/src/context/async-context.client.ts` - Browser-safe context
- `packages/logger/src/context/async-context.server.ts` - Server context with async_hooks
- `packages/logger/src/core/logger.client.ts` - Client-safe logger
- `packages/logger/src/index.client.ts` - Client entry point
- `packages/logger/src/index.server.ts` - Server entry point

### Modified Files

- `packages/logger/package.json` - Added conditional exports
- `packages/logger/src/context/async-context.ts` - Now re-exports from server version
- `packages/logger/src/core/logger.ts` - Updated to import from server context
- `packages/logger/src/middleware/next.ts` - Updated to use server context
- `packages/logger/src/middleware/express.ts` - Updated to use server context
- `apps/hub/src/lib/logger.ts` - Updated to import from server entry
- `apps/hub/src/lib/logger-client.ts` - Updated to import from client entry
- `apps/hub/next.config.mjs` - Added webpack configuration

## Benefits

1. **Environment-Appropriate Implementations**: Each environment gets the optimal implementation
2. **No Runtime Errors**: Browser code no longer tries to load Node.js modules
3. **Type Safety**: TypeScript types work correctly in both environments
4. **API Compatibility**: Same API surface in both client and server implementations
5. **Automatic Resolution**: Next.js automatically loads the correct version based on context

## Usage

### Server-side (API routes, Server Components)

```typescript
import { logger } from '@/lib/logger'

// In API routes or server components
logger.info('Processing request', { userId: '123' })
```

### Client-side (Client Components)

```typescript
import { logger } from '@/lib/logger-client'

// In client components
logger.debug('Button clicked', { buttonId: 'submit' })
```

### With Context (Server-side only with full async tracking)

```typescript
import { withLogging } from '@cenie/logger/next'

export const POST = withLogging(async (request) => {
  // Logger calls will include request context automatically
  logger.info('Processing POST request')
  return NextResponse.json({ success: true })
})
```

## Testing

The fix was verified by running:

```bash
pnpm build
```

The build now completes successfully without any `async_hooks` errors.

## Migration Guide

If you have existing code using the logger:

1. **Server-side code**: Change imports to use `/server`:

   ```typescript
   // Before
   import { createLogger } from '@cenie/logger'

   // After
   import { createLogger } from '@cenie/logger/server'
   ```

2. **Client-side code**: Change imports to use `/client`:

   ```typescript
   // Before
   import { createLogger } from '@cenie/logger'

   // After
   import { createLogger } from '@cenie/logger/client'
   ```

3. **Or use auto-resolution**: Import from the main entry and let Next.js resolve:

   ```typescript
   // This will automatically use the right version based on context
   import { createLogger } from '@cenie/logger'
   ```

## Notes

- The client implementation uses a simple Map for context storage, which means context is not preserved across async operations in the browser (this is a limitation of browser environments)
- Server-side code maintains full async context tracking using AsyncLocalStorage
- Both implementations provide the same API for consistency
- The errors package also benefits from this fix as it imports the logger

## Related Packages

This fix also resolves issues in the `@cenie/errors` package, which imports the logger for error handling in both client and server contexts.
