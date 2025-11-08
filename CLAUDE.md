# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running Applications

```bash
# Run all apps concurrently (Hub:3000, Editorial:3001, Academy:3002, Agency:3003)
pnpm dev

# Run specific application
pnpm dev --filter=@cenie/hub
pnpm dev --filter=@cenie/editorial
pnpm dev --filter=@cenie/academy
pnpm dev --filter=@cenie/agency
```

**Debug Ports:** Each app runs with Node inspector enabled on specific ports:
- Hub: `--inspect=9230` on port 3000
- Editorial: `--inspect=9231` on port 3001
- Agency: `--inspect=9232` on port 3003
- Academy: `--inspect=9233` on port 3002

### Building

```bash
# Build all applications and packages
pnpm build

# Build specific app/package
pnpm build --filter=@cenie/hub
pnpm build --filter=@cenie/editorial
pnpm build --filter=@cenie/academy
pnpm build --filter=@cenie/agency

# App-specific build shortcuts
pnpm build:hub
pnpm build:editorial
pnpm build:academy
pnpm build:agency
```

### Code Quality

```bash
# Run linting across entire monorepo
pnpm lint

# Type checking
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check

# Run tests (packages only: logger, errors)
pnpm test

# Package-specific tests
pnpm test:packages     # Test logger and errors packages
pnpm test:logger       # Test logger package only
pnpm test:errors       # Test errors package only

# Test variations
pnpm test:watch        # Watch mode
pnpm test:ui           # Vitest UI
pnpm test:coverage     # With coverage reports

# Clean build artifacts
pnpm clean
```

### Content Management

Content synchronization using Unison for app-specific content directories:

```bash
# One-time sync
pnpm sync:once                # Default sync
pnpm sync:once:hub            # Hub content
pnpm sync:once:editorial      # Editorial content
pnpm sync:once:academy        # Academy content
pnpm sync:once:agency         # Agency content
pnpm sync:once:all            # All apps in parallel

# Watch mode (continuous sync)
pnpm sync:watch               # Default watch
pnpm sync:watch:hub
pnpm sync:watch:editorial
pnpm sync:watch:academy
pnpm sync:watch:agency
pnpm sync:watch:all
```

### Dependency Management

```bash
# Add dependency to specific workspace
pnpm add <package> --filter=@cenie/<workspace-name>

# Add dev dependency
pnpm add -D <package> --filter=@cenie/<workspace-name>

# Add to root
pnpm add -w <package>
```

## Architecture Overview

### Monorepo Structure

This is a Turborepo-based monorepo using pnpm workspaces. The codebase is organized into:

- **apps/** - Next.js 16 applications with React 19, each serving a distinct subdomain
- **packages/** - Shared internal packages used across applications
- **services/** - Backend services (Firebase Cloud Functions)

**Monorepo Statistics:**
- 4 Next.js Applications (ports 3000-3003)
- 6 Shared Packages (UI, Firebase, Auth Client, Supabase, Logger, Errors)
- 1 Cloud Functions Service
- ~35 Environment Variables managed by Turbo
- pnpm 10.19.0 with Node.js 20+

### Application Architecture

All applications are **Next.js 16** apps with **React 19** using:

- App Router with React Server Components
- Tailwind CSS v4 with PostCSS
- TypeScript 5.9+ with strict mode
- Firebase-first authentication with Supabase as fallback

#### Hub Application (`@cenie/hub`)
**Port:** 3000 | **Inspector:** 9230

The main platform website and authentication provider with:
- Multi-language support via `next-intl`
- MDX support for content pages
- Analytics integration (Vercel Analytics & Speed Insights)
- Internationalization (i18n) with message translations
- Translation sync via i18nexus

#### Editorial Application (`@cenie/editorial`)
**Port:** 3001 | **Inspector:** 9231

Academic publishing platform featuring:
- MDX support for academic content
- Google Books API integration
- String similarity search for content matching
- Cloudinary SDK for image management
- Enhanced remote image patterns (Cloudinary, Google Books)

#### Academy Application (`@cenie/academy`)
**Port:** 3002 | **Inspector:** 9233

Educational content delivery platform with:
- Learning management features
- Course and curriculum support
- Educational content organization

#### Agency Application (`@cenie/agency`)
**Port:** 3003 | **Inspector:** 9232

Automation services and software catalog featuring:
- Software showcase and catalog
- Automation service offerings
- Tech-focused presentation

### Shared Packages

All packages use the workspace protocol (`"workspace:*"`) for internal dependencies and support conditional exports for client/server environments.

#### @cenie/ui
**Component library** built on:
- Radix UI primitives for accessibility (13+ components)
- Tailwind CSS with tailwind-merge for styling
- class-variance-authority (CVA) for variant management
- Lucide React icons
- Exports components, hooks, and utilities

**Key Components:**
- Button, Badge, Card, Separator, Tabs
- Accessible primitives: Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Label, Popover, Radio Group, Select, Slider, Switch, Toast, Tooltip

**Exports:**
```typescript
import { Button } from '@cenie/ui'
import { useToast } from '@cenie/ui/hooks'
import { cn } from '@cenie/ui/lib'
```

#### @cenie/firebase
**Firebase integration package** providing:
- Firebase Client SDK (v12.4.0) for browser
- Firebase Admin SDK (v13.5.0) for server
- Authentication hooks and context
- Analytics integration
- OAuth support (Google, Apple)

**Conditional Exports:**
```typescript
import { initializeApp } from '@cenie/firebase/client'
import { getAuth, useAuth } from '@cenie/firebase/auth'
import { initializeAdmin } from '@cenie/firebase/server'
import { firebaseMiddleware } from '@cenie/firebase/middleware'
import { logAnalyticsEvent } from '@cenie/firebase/analytics'
```

#### @cenie/auth-client
**Lightweight authentication client** for:
- Cross-app authentication communication
- Simplified auth API wrapper
- Depends on @cenie/firebase

**Usage:**
```typescript
import { authClient } from '@cenie/auth-client'
```

#### @cenie/supabase
**Legacy Supabase integration** (deprecated in favor of Firebase):
- Supabase SSR support for server-side rendering
- Auth middleware for Next.js
- Database client and type definitions
- Migration files

**Exports:**
```typescript
import { createClient } from '@cenie/supabase/client'
import { createServerClient } from '@cenie/supabase/server'
import { supabaseMiddleware } from '@cenie/supabase/middleware'
```

**Note:** Primarily maintained for backward compatibility. New features use Firebase.

#### @cenie/logger
**Centralized logging package** with:
- Structured JSON logging with pretty console output
- Request correlation via requestId tracking
- PII redaction (passwords, tokens, API keys, etc.)
- Environment-specific behavior (dev vs production)
- Child loggers with context inheritance
- Multiple transports (console, file, custom)
- Async context for request tracking
- Framework integrations via middleware

**Conditional Exports:**
```typescript
// Auto-detects environment (React Server Component vs client)
import logger from '@cenie/logger'

// Explicit imports
import logger from '@cenie/logger/server'  // Server-side only
import logger from '@cenie/logger/client'  // Client-side only

// Middleware
import { nextLogger } from '@cenie/logger/next'
import { expressLogger } from '@cenie/logger/express'

// Context management
import { requestContext } from '@cenie/logger/context'

// Utilities
import { sanitizeData } from '@cenie/logger/utils'
```

**Features:**
- Log levels: debug, info, warn, error, fatal
- Automatic PII sanitization
- Colorized console output (development)
- Request correlation across async operations
- Child loggers: `logger.child({ service: 'auth' })`

**Testing:** Full test coverage with Vitest (8 test files)

#### @cenie/errors
**Centralized error handling package** with:
- Typed error class hierarchy
- Automatic error classification (Zod, Firebase, Postgres, etc.)
- Framework-specific error handlers
- Automatic logging integration via @cenie/logger
- Request correlation support
- Safe user messages vs internal messages
- Retry logic support
- Severity levels (low, medium, high, critical)

**Error Classes:**

**HTTP Errors:**
- ValidationError (400) - Input validation failures
- AuthenticationError (401) - Authentication required
- AuthorizationError (403) - Insufficient permissions
- NotFoundError (404) - Resource not found
- ConflictError (409) - Resource conflicts
- RateLimitError (429) - Rate limit exceeded
- InternalError (500) - Internal server errors
- ServiceUnavailableError (503) - Service unavailable

**Integration Errors:**
- DatabaseError (502) - Database operation failures
- PaymentError (502) - Payment processing errors
- StorageError (502) - File storage errors
- APIError (502) - External API failures
- TimeoutError (504) - Operation timeouts

**Framework Handlers:**
```typescript
// Next.js App Router error handling
import { errorHandler } from '@cenie/errors/next'

// Express error middleware
import { expressErrorHandler } from '@cenie/errors/express'

// React error boundaries
import { ErrorBoundary } from '@cenie/errors/react'
```

**Usage:**
```typescript
import { ValidationError, NotFoundError, classifyError } from '@cenie/errors'

throw new ValidationError('Invalid email format', {
  field: 'email',
  severity: 'medium'
})

// Automatic classification
try {
  await someOperation()
} catch (error) {
  const classified = classifyError(error) // Auto-detects error type
  throw classified
}
```

**Testing:** Full test coverage with Vitest (4 test files)

### Backend Services

#### Cloud Functions Service (`@cenie/cloud-functions`)
**Location:** `services/cloud-functions/`

Firebase Cloud Functions for serverless operations:
- **Runtime:** Node.js 22
- **Framework:** Firebase Functions v6.1.2
- **Build System:** ESBuild (custom build.mjs)
- **Dependencies:**
  - firebase-admin v13.6.0
  - firebase-functions v6.1.2
  - @cenie/logger (logging integration)
  - @cenie/errors (error handling)
  - Zod for validation

**Firebase Configuration:**
- `.firebaserc` - Project configuration
- `firebase.json` - Functions, Firestore, Storage config
- `firestore.indexes.json` - Database indexes
- `firestore.rules` - Database security rules
- `storage.rules` - Cloud Storage access rules

**Scripts:**
```bash
cd services/cloud-functions/functions

pnpm build           # ESBuild compilation to lib/
pnpm build:watch     # Watch mode
pnpm serve           # Local emulators
pnpm shell           # Functions shell
pnpm deploy          # Deploy to Firebase
pnpm logs            # View function logs
```

**Function Development:**
- Custom ESBuild bundler for fast builds
- Watch mode for rapid iteration
- Firebase emulators for local testing
- Integrated logging and error handling

### Build Pipeline

Turbo orchestrates the build with intelligent task execution:

**Task Dependencies:**
```
dev         → depends on ^build (all package builds)
build       → depends on ^build (dependency graph)
lint        → depends on ^build
type-check  → depends on ^build
test        → depends on ^build
```

**Build Order Example:**
1. `packages/logger` (no deps) → builds first
2. `packages/errors` (depends on logger) → builds second
3. `packages/ui`, `packages/firebase` (independent) → build in parallel
4. `apps/*` (depend on packages) → build after packages ready

**Caching:**
- Build outputs cached in `.turbo/`
- Cache invalidation on file changes
- Environment variable changes trigger rebuilds
- Remote caching support (Vercel, custom)

**Environment Handling:**
- Global dependencies: `**/.env.*local`
- 35+ environment variables tracked
- App-specific .env.local isolation
- Automatic cache invalidation on env changes

### Authentication Flow

**Primary:** Firebase Authentication
**Fallback:** Supabase (legacy support)

Firebase-first authentication across all subdomains:

1. User authenticates via Firebase on any app
2. Session token stored and validated
3. Cross-subdomain cookie sharing for SSO
4. Firebase Admin SDK validates tokens server-side
5. Supabase fallback for legacy data/users

**Supported Methods:**
- Email/Password
- Google OAuth
- Apple OAuth
- Custom token authentication

## Key Conventions

### Import Paths

Use workspace protocol for internal packages in `package.json`:
```json
{
  "dependencies": {
    "@cenie/ui": "workspace:*",
    "@cenie/firebase": "workspace:*",
    "@cenie/logger": "workspace:*",
    "@cenie/errors": "workspace:*"
  }
}
```

Import examples:
```typescript
// Components
import { Button } from '@cenie/ui'

// Firebase
import { useAuth } from '@cenie/firebase/auth'
import { initializeAdmin } from '@cenie/firebase/server'

// Logging
import logger from '@cenie/logger'

// Errors
import { ValidationError } from '@cenie/errors'
```

### File Organization

**Next.js Apps:**
- Components: `src/app/` (App Router pages)
- API routes: `src/app/api/`
- Shared components: `src/components/`
- Content: `src/contents/` (Hub, Editorial)
- Utilities: `src/lib/`
- Hooks: `src/hooks/`
- Constants: `src/constants/`
- i18n messages: `src/messages/` (Hub)

**Packages:**
- Source: `src/`
- Tests: `src/__tests__/`
- Types: `src/types.ts`
- Conditional exports for client/server splits

**Cloud Functions:**
- Functions: `services/cloud-functions/functions/src/`
- Build output: `services/cloud-functions/functions/lib/`

### Environment Variables

#### Configuration Structure

- **Root `.env`**: Shared variables (Firebase, Supabase, Cloudinary, Stripe, APIs)
- **App-specific `.env.local`**: App-specific Firebase configurations
- **Service `.env`**: Service-specific configurations

#### Setting up Firebase for Apps

Each app has its own Firebase project configuration:

1. **Copy template files**:
   ```bash
   # For each app, copy the example file to .env.local
   cp apps/hub/.env.local.example apps/hub/.env.local
   cp apps/editorial/.env.local.example apps/editorial/.env.local
   cp apps/academy/.env.local.example apps/academy/.env.local
   cp apps/agency/.env.local.example apps/agency/.env.local
   ```

2. **Configure Firebase variables** in each app's `.env.local`:
   ```bash
   # Client-side Firebase config (exposed to browser)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-app-specific-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # Server-side Firebase Admin SDK
   FIREBASE_PROJECT_ID=your-app-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-app.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----"
   ```

#### Required Shared Variables (Root `.env`)

**Firebase (Shared):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

**Supabase (Legacy):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`

**Cloudinary (Media):**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Stripe (Payments):**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**External APIs:**
- `GOOGLE_API_KEY`
- `GOOGLE_CLOUD_TRANSLATION_API_KEY`
- `TWICPICS_API_KEY`

**App Configuration:**
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_HUB_API_URL`

#### Port Configuration

Each app runs on its designated port:
- Hub: `http://localhost:3000` (Inspector: 9230)
- Editorial: `http://localhost:3001` (Inspector: 9231)
- Academy: `http://localhost:3002` (Inspector: 9233)
- Agency: `http://localhost:3003` (Inspector: 9232)

#### Turbo Integration

Turbo automatically:
- Watches `**/.env.*local` files for changes (configured in `turbo.json`)
- Includes 35+ environment variables in build caching
- Invalidates cache when environment variables change
- Supports app-specific environment variable isolation
- Tracks changes to prevent stale builds

### Testing Approach

**Framework:** Vitest 2.1.8 with v8 coverage

**Test Scope:**
- Unit tests currently implemented in:
  - `packages/logger` (8 test files)
  - `packages/errors` (4 test files)
- Apps use type-checking and linting for validation

**Running Tests:**
```bash
# All package tests
pnpm test

# Specific packages
pnpm test:logger
pnpm test:errors
pnpm test:packages

# With coverage
pnpm test:coverage

# Watch mode
pnpm test:watch

# UI mode
pnpm test:ui
```

**Test Configuration:**
- Root: `vitest.config.ts` (global settings)
- Workspace: `vitest.workspace.ts` (package-specific configs)
- Coverage: v8 provider with html/lcov/json/text reporters
- Coverage output: `coverage/` directory

**Coverage Reports:**
- Generated in `coverage/` directory
- Multiple formats: HTML, LCOV, JSON, text
- Threshold enforcement (configurable)

### TypeScript Configuration

**Base Configuration:** `tsconfig.json` at root

**Settings:**
- **Target:** ES2022
- **Module:** ESNext with bundler resolution
- **Strict Mode:** Enabled (`strict: true`)
- **JSX:** preserve (for React)
- **No Unused Variables/Parameters:** Enforced
- **No Implicit Returns:** Enforced
- **No Fallthrough Cases:** Enforced
- **Declaration Maps:** Enabled for better IDE support
- **Source Maps:** Enabled for debugging

**Monorepo-wide Path Aliases:**
```json
{
  "paths": {
    "@cenie/ui": ["./packages/ui/src"],
    "@cenie/firebase": ["./packages/firebase/src"],
    "@cenie/auth-client": ["./packages/auth-client/src"],
    "@cenie/supabase": ["./packages/supabase/src"],
    "@cenie/logger": ["./packages/logger/src"],
    "@cenie/errors": ["./packages/errors/src"]
  }
}
```

**Per-Workspace Extension:**
- Each app/package extends root `tsconfig.json`
- App-specific paths added as needed
- Consistent compiler options across monorepo

### Code Quality Tools

**ESLint:** v9 with TypeScript support
- Configuration: `eslint.config.mjs`
- TypeScript ESLint plugin with recommended rules
- Import ordering enforcement
- React hooks linting
- JSX accessibility checks
- Prettier integration (conflict resolution)

**Prettier:** v3.6.2
- Configuration: `prettier.config.js`
- No semicolons, single quotes
- Tab width: 2, Print width: 100
- Trailing commas: ES5
- Format checking: `pnpm format:check`
- Auto-formatting: `pnpm format`

**Key Linting Rules:**
- No unused variables (except prefixed with `_`)
- Consistent type imports (inline)
- Import order: builtin → external → internal → parent → sibling
- No console.log (warn/error allowed)
- Prefer const over let

### Content Management

**MDX Support:**
- Hub: Content pages with internationalization
- Editorial: Academic publishing content
- Gray-matter for frontmatter parsing
- Reading time estimation

**Internationalization (Hub):**
- next-intl v4.4.0 for i18n
- i18nexus for translation management
- Message files in `src/messages/`
- Translation sync: `pnpm sync-translations`
- Live sync: `pnpm listen-translations`

**Content Synchronization:**
- Unison-based sync for content directories
- App-specific content management
- Watch mode for continuous sync
- Parallel sync for all apps

### Performance & Monitoring

**Analytics (Hub):**
- Vercel Analytics for user insights
- Vercel Speed Insights for performance
- Custom analytics via Firebase

**Build Optimization:**
- Turbo remote caching
- Next.js bundle analyzer (Hub)
- Conditional exports for code splitting
- Package transpilation optimization

**Development Tools:**
- Node inspector on dedicated ports
- Fast refresh with watch modes
- ESBuild for rapid function builds
- Emulators for local Firebase testing

## Common Workflows

### Adding a New Package

1. Create package directory: `packages/<package-name>/`
2. Add `package.json` with workspace protocol for deps
3. Configure exports in `package.json`
4. Add TypeScript config extending root
5. Update root `tsconfig.json` paths if needed
6. Add to `pnpm-workspace.yaml` (if not using glob)
7. Run `pnpm install` to link workspace

### Adding a New Feature

1. Identify which app(s) need the feature
2. Determine if shared logic belongs in a package
3. Create types in appropriate location
4. Implement with logging (`@cenie/logger`)
5. Add error handling (`@cenie/errors`)
6. Run type checking: `pnpm type-check`
7. Run linting: `pnpm lint`
8. Test locally: `pnpm dev --filter=<app>`

### Debugging Applications

1. Start app with inspector: `pnpm dev --filter=<app>`
2. Open Chrome DevTools: `chrome://inspect`
3. Connect to appropriate inspector port
4. Set breakpoints in source maps
5. Monitor logs with `logger` output
6. Check error classifications in console

### Deploying Functions

1. Navigate to functions: `cd services/cloud-functions/functions`
2. Build: `pnpm build`
3. Test locally: `pnpm serve` (emulators)
4. Deploy: `pnpm deploy`
5. Monitor: `pnpm logs`

### Managing Dependencies

```bash
# Add to specific app
pnpm add <package> --filter=@cenie/hub

# Add to shared package
pnpm add <package> --filter=@cenie/ui

# Add dev dependency to root
pnpm add -Dw <package>

# Update all dependencies
pnpm update -r

# List outdated
pnpm outdated -r
```

## Troubleshooting

### Build Failures

1. Clear Turbo cache: `pnpm clean`
2. Remove node_modules: `rm -rf node_modules apps/*/node_modules packages/*/node_modules`
3. Reinstall: `pnpm install`
4. Rebuild: `pnpm build`

### Type Errors

1. Ensure all packages built: `pnpm build --filter=./packages/*`
2. Run type check: `pnpm type-check`
3. Check path aliases in `tsconfig.json`
4. Verify workspace protocol in `package.json`

### Environment Variable Issues

1. Check `.env` exists at root
2. Verify app-specific `.env.local` exists
3. Confirm variable names match turbo.json
4. Restart dev server after env changes
5. Clear Turbo cache if needed

### Import Resolution

1. Verify workspace protocol: `"workspace:*"`
2. Check exports in package `package.json`
3. Ensure package is built: `pnpm build --filter=<package>`
4. Verify path aliases in `tsconfig.json`
5. Restart TypeScript server in IDE

### Firebase Issues

1. Check Firebase config in `.env.local`
2. Verify service account credentials
3. Test with emulators: `pnpm serve` (functions)
4. Check Firebase console for quotas/errors
5. Verify security rules are not blocking requests

## Additional Resources

- **Turborepo:** https://turbo.build/repo/docs
- **pnpm Workspaces:** https://pnpm.io/workspaces
- **Next.js 16:** https://nextjs.org/docs
- **Firebase:** https://firebase.google.com/docs
- **Vitest:** https://vitest.dev
- **Tailwind CSS v4:** https://tailwindcss.com/docs
