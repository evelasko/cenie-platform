# Firebase Cloud Functions - Deployment Guide

## Build System

This project uses **esbuild** to bundle Cloud Functions with workspace dependencies (@cenie/logger, @cenie/errors) for deployment.

### Why Bundling?

Firebase Cloud Functions doesn't support pnpm workspace dependencies out of the box. The bundler:

- ✅ Bundles workspace packages (@cenie/logger, @cenie/errors) into the functions
- ✅ Excludes Firebase packages (provided by runtime)
- ✅ Creates a single optimized bundle
- ✅ Ensures deployment works without workspace dependencies

### Build Configuration

**Build Script:** `build.mjs`

- Entry point: `src/index.ts`
- Output: `lib/index.js` (bundled)
- Target: Node.js 20
- Format: CommonJS
- Source maps: Enabled
- Minification: Disabled (for debugging)

**Externals (not bundled):**

- `firebase-admin`
- `firebase-functions`

**Bundled:**

- `@cenie/logger` (workspace package)
- `@cenie/errors` (workspace package)
- `dotenv`
- `zod`
- All other dependencies

### Deployment Workflow

```bash
# 1. Build (bundles everything)
pnpm build

# 2. Deploy to Firebase
pnpm deploy

# Or use Firebase CLI directly
firebase deploy --only functions
```

### What Gets Deployed

Only these files are uploaded to Firebase:

- ✅ `lib/` directory (bundled JavaScript)
- ✅ `package.json` (with production dependencies only)
- ✅ `package-lock.json` or `pnpm-lock.yaml`

**Ignored during deployment:**

- ❌ `src/` (TypeScript source)
- ❌ `*.ts` files
- ❌ `build.mjs`
- ❌ `tsconfig.json`
- ❌ `eslint.config.mjs`
- ❌ `node_modules/` (will be reinstalled in cloud)

### Production Dependencies

After bundling, only Firebase packages are needed as dependencies:

```json
{
  "dependencies": {
    "firebase-admin": "^13.5.0",
    "firebase-functions": "^6.1.2"
  }
}
```

All other code (including workspace packages) is bundled into `lib/index.js`.

### Verification

Check that the bundle is correct:

```bash
# Build
pnpm build

# Check bundle size
ls -lh lib/

# Verify workspace packages are included
grep -i "cenie" lib/index.js

# Test locally with emulator
pnpm serve
```

### Deployment Checklist

Before deploying:

- [ ] **Build succeeds:** `pnpm build`
- [ ] **Type check passes:** `pnpm type-check`
- [ ] **Linting passes:** `pnpm lint`
- [ ] **Secrets configured:** Firebase Secret Manager
- [ ] **Test with emulator:** `pnpm serve`
- [ ] **Firestore rules updated:** `firestore.rules`
- [ ] **Storage rules updated:** `storage.rules`

### Environment Variables

**Local Development:**
Create `.env.local` for emulator:

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

**Production:**
Use Firebase Secret Manager:

```bash
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set ANTHROPIC_API_KEY
```

### Troubleshooting

**Build fails:**

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

**Workspace packages not found:**

- Ensure workspace is set up: `pnpm install` from root
- Check `pnpm-workspace.yaml` includes functions directory
- Verify `@cenie/logger` and `@cenie/errors` build successfully

**Deploy fails:**

```bash
# Check Firebase project
firebase projects:list
firebase use <project-id>

# Verify build output
ls -la lib/

# Check package.json is correct
cat package.json
```

**Runtime errors:**

```bash
# View logs
firebase functions:log

# Or for specific function
firebase functions:log --only translationInvestigation
```

### Development vs Production

**Development (local emulator):**

- Builds bundle with source maps
- Loads `.env.local` for secrets
- Hot reload with `pnpm build:watch`
- Full error stack traces

**Production (Firebase):**

- Optimized bundle deployed
- Secrets from Firebase Secret Manager
- Automatic scaling
- Structured logging

### Performance

**Bundle Size:** ~49KB (before gzip)

- Small and efficient
- Fast cold starts
- Low memory footprint

**Build Time:** ~20ms

- Instant builds
- Watch mode for development
- No slow TypeScript compilation to worry about

### Next Steps

1. Test locally: `pnpm serve`
2. Configure secrets: `firebase functions:secrets:set`
3. Deploy: `pnpm deploy`
4. Monitor: `firebase functions:log`
