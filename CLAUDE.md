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

# Run specific service
pnpm dev --filter=@cenie/auth-api
```

### Building

```bash
# Build all applications and packages
pnpm build

# Build specific app/package
pnpm build --filter=@cenie/hub
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

# Run tests
pnpm test

# Clean build artifacts
pnpm clean
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

- **apps/** - Next.js 15 applications, each serving a distinct subdomain
- **packages/** - Shared internal packages used across applications
- **services/** - Backend API services (Express-based)

### Application Architecture

All applications are Next.js 15 apps using:

- App Router with React Server Components
- Tailwind CSS v4 with PostCSS
- TypeScript for type safety
- Shared authentication via Supabase SSR

### Shared Packages

**@cenie/ui** - Component library built on:

- Radix UI primitives for accessibility
- Tailwind CSS for styling
- class-variance-authority (CVA) for variant management
- Exports components, hooks, and utilities

**@cenie/design-system** - Token-based theming:

- Base tokens for CENIE brand
- Theme variants per application
- Runtime CSS variable generation
- Each app has customized theme (Hub: default, Editorial: warm/serif, Academy: blue/modern, Agency: tech-focused)

**@cenie/supabase** - Authentication and database:

- Supabase client configuration
- Auth middleware for Next.js
- Server-side utilities
- Shared across all applications for SSO

### Backend Services

Services are Express applications with:

- TypeScript configuration
- Zod for validation
- JWT authentication
- Modular route structure in `src/routes/`

### Build Pipeline

Turbo orchestrates the build with:

- Dependency graph resolution (`dependsOn: ["^build"]`)
- Intelligent caching
- Environment variable handling
- Parallel task execution

### Authentication Flow

Single Sign-On across all subdomains:

1. User authenticates on any app
2. Session stored in Supabase
3. Cross-subdomain cookie sharing
4. Row Level Security (RLS) for data isolation

## Key Conventions

### Import Paths

- Use workspace protocol for internal packages: `"@cenie/ui": "workspace:*"`
- Components: `import { Button } from '@cenie/ui'`
- Themes: `import { hubTheme } from '@cenie/design-system'`

### File Organization

- Components in `src/app/` for Next.js apps
- API routes in `src/app/api/`
- Service routes in `src/routes/` for backend services
- Shared types in package exports

### Environment Variables

#### Configuration Structure

- **Root `.env`**: Contains shared variables (Supabase, Cloudinary, Stripe)
- **App-specific `.env.local`**: Contains Firebase configuration for each app

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

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

#### Port Configuration

Each app runs on its designated port:

- Hub: `http://localhost:3000`
- Editorial: `http://localhost:3001`
- Academy: `http://localhost:3002`
- Agency: `http://localhost:3003`

#### Turbo Integration

Turbo automatically:

- Watches `.env.local` files for changes (configured in `turbo.json`)
- Includes environment variables in build caching
- Supports app-specific environment variable isolation

### Testing Approach

- Unit tests run via `pnpm test`
- E2E tests via `pnpm test:e2e`
- Coverage reports generated in `coverage/` directory

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured per workspace
- Shared base config extended in each package
