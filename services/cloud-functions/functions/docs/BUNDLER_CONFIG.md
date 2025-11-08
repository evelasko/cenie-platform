# Firebase Cloud Functions - Bundler Configuration

## Overview

This project uses **esbuild** to bundle Firebase Cloud Functions with workspace dependencies, ensuring clean deployment without workspace resolution issues.

## Why Bundling is Required

Firebase Cloud Functions deployment has these limitations:

1. **No workspace support**: `workspace:*` dependencies don't resolve in Cloud Functions
2. **Limited install**: Only `package.json` dependencies are installed in the cloud
3. **No monorepo awareness**: Firebase doesn't understand pnpm workspaces

**Our solution**: Bundle workspace packages (@cenie/logger, @cenie/errors) directly into the function code.

## Build Configuration

### esbuild Settings (`build.mjs`)

```javascript
{
  entryPoints: ['src/index.ts'],
  bundle: true,              // Bundle all imports
  platform: 'node',          // Node.js target
  target: 'node20',          // Cloud Functions Node 20
  format: 'cjs',             // CommonJS format
  outdir: 'lib',             // Output directory
  sourcemap: true,           // Enable debugging
  minify: false,             // Keep readable

  // External: Don't bundle (provided by runtime)
  external: [
    'firebase-admin',
    'firebase-functions',
    'firebase-functions/*',
  ],

  // Bundle everything else
  packages: 'bundle',
}
```

### What Gets Bundled

✅ **Bundled into `lib/index.js`:**

- `@cenie/logger` (workspace package)
- `@cenie/errors` (workspace package)
- `dotenv`
- `zod`
- All their dependencies

❌ **Not bundled (external):**

- `firebase-admin` (provided by Cloud Functions runtime)
- `firebase-functions` (provided by Cloud Functions runtime)

### Package.json Structure

**Production Dependencies:**

```json
{
  "dependencies": {
    "firebase-admin": "^13.5.0",
    "firebase-functions": "^6.1.2"
  }
}
```

_Only Firebase packages - everything else is bundled_

**Development Dependencies:**

```json
{
  "devDependencies": {
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*",
    "dotenv": "^17.2.3",
    "esbuild": "^0.24.2",
    "typescript": "^5.9.3",
    "zod": "^4.0.17"
  }
}
```

_Used for development, type-checking, and bundling_

## Deployment Process

### 1. Pre-Deploy

```bash
# Runs automatically before deployment
pnpm lint    # Check code quality
pnpm build   # Bundle with esbuild
```

### 2. Deployment

Firebase uploads only:

- `lib/index.js` (bundled code with workspace packages)
- `lib/index.js.map` (source maps)
- `package.json` (production dependencies only)
- `package-lock.yaml` or `pnpm-lock.yaml`

Firebase ignores (configured in `firebase.json`):

- `src/` directory
- `*.ts` files
- `build.mjs`
- `tsconfig.json`
- `eslint.config.mjs`
- Development files

### 3. Cloud Installation

Firebase runs in the cloud:

```bash
npm install --production
# Installs only: firebase-admin, firebase-functions
```

### 4. Runtime

Functions execute from `lib/index.js`:

- All workspace code is already bundled
- No workspace resolution needed
- Fast cold starts (small bundle)

## Bundle Analysis

**Bundle Size:** ~49KB (before gzip)

- Includes @cenie/logger (~30KB)
- Includes @cenie/errors (~5KB)
- Includes helper utilities
- Excludes Firebase packages (~10MB saved!)

**Build Time:** ~20ms

- Fast incremental builds
- Watch mode for development
- Minimal overhead

## Development Workflow

### Local Development

```bash
# Type checking (uses workspace packages)
pnpm type-check

# Build bundle
pnpm build

# Watch mode (rebuild on changes)
pnpm build:watch

# Emulator (uses bundled code)
pnpm serve
```

### Modifying Workspace Packages

If you modify `@cenie/logger` or `@cenie/errors`:

1. Changes are picked up automatically
2. Rebuild functions: `pnpm build`
3. Bundle includes latest code
4. No version bumping needed

## TypeScript Configuration

### Development (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@cenie/logger": ["../../../packages/logger/src"],
      "@cenie/errors": ["../../../packages/errors/src"]
    }
  }
}
```

_Enables type-checking and IDE support_

### Build Process

1. **Type Check**: TypeScript validates types using paths
2. **Bundle**: esbuild follows imports and bundles everything
3. **Output**: Single `lib/index.js` with all code

## Advantages

### ✅ Clean Deployment

- No workspace complexity in production
- Standard npm package structure
- Works with Firebase's deployment process

### ✅ Fast Builds

- esbuild is extremely fast
- Incremental builds in watch mode
- No slow TypeScript compilation

### ✅ Optimized Bundle

- Only includes used code
- Excludes Firebase packages (saved from bundle)
- Small bundle = fast cold starts

### ✅ Easy Development

- Workspace packages work in dev
- Type checking with paths
- Hot reload with watch mode

### ✅ Reliable Deployment

- No workspace resolution issues
- Consistent builds
- Predictable production behavior

## Troubleshooting

### "Cannot find module '@cenie/logger'"

**During Development:**

- Run `pnpm install` from monorepo root
- Check workspace configuration
- Rebuild logger package

**During Build:**

- Check `build.mjs` configuration
- Verify `packages: 'bundle'` is set
- Check external list doesn't include logger

### Bundle Missing Code

```bash
# Verify bundle contents
grep "createLogger" lib/index.js

# Check bundle size
ls -lh lib/

# Rebuild from scratch
rm -rf lib node_modules
pnpm install
pnpm build
```

### Deployment Fails

```bash
# Check what files are being deployed
firebase deploy --only functions --dry-run

# Verify package.json dependencies
cat package.json | grep -A 5 '"dependencies"'

# Should only show firebase packages
```

### Runtime Errors

```bash
# View logs
firebase functions:log

# Check if workspace code is bundled
grep "@cenie" lib/index.js
```

## Maintenance

### Updating Dependencies

**Firebase Packages:**

```bash
# Update in dependencies (will be installed in cloud)
pnpm add firebase-admin@latest firebase-functions@latest
```

**Bundled Packages:**

```bash
# Update in devDependencies (will be bundled)
pnpm add -D zod@latest dotenv@latest
```

**Workspace Packages:**

- Edit in `packages/logger` or `packages/errors`
- Rebuild: `pnpm build`
- Changes automatically included

### Build Script Updates

Edit `build.mjs` to:

- Add new entry points
- Modify external packages
- Change output format
- Add plugins

## Summary

| Aspect                 | Configuration  |
| ---------------------- | -------------- |
| **Bundler**            | esbuild        |
| **Entry**              | `src/index.ts` |
| **Output**             | `lib/index.js` |
| **Format**             | CommonJS       |
| **Target**             | Node.js 20     |
| **Bundle Size**        | ~49KB          |
| **Build Time**         | ~20ms          |
| **Workspace Packages** | Bundled ✅     |
| **Firebase Packages**  | External ✅    |
| **Production Deps**    | 2 packages     |
| **Deployment**         | Ready ✅       |
