# Firebase Cloud Functions - CENIE Translation Investigation Agent

Complete Firebase Cloud Functions setup for the CENIE platform with workspace dependency bundling.

## Quick Start

```bash
# Navigate to functions directory
cd services/cloud-functions/functions

# Build
pnpm build

# Test locally
pnpm serve

# Deploy
pnpm deploy
```

## Features

✅ **TypeScript with esbuild bundling**  
✅ **Workspace packages integrated** (@cenie/logger, @cenie/errors)  
✅ **Firebase Functions v2 API**  
✅ **Automatic bundling for deployment**  
✅ **Source maps for debugging**  
✅ **Fast builds (~20-35ms)**  
✅ **Optimized bundle size (~49KB)**  
✅ **Production-ready configuration**  

## Project Structure

```
services/cloud-functions/
├── firebase.json              # Firebase configuration
├── .firebaserc                # Project settings
├── firestore.rules            # Firestore security rules
├── storage.rules              # Storage security rules
├── functions/
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.ts   # Firebase Admin setup
│   │   │   └── env.ts        # Environment & secrets
│   │   ├── types/
│   │   │   └── index.ts      # Type definitions
│   │   └── index.ts          # Main functions export
│   ├── lib/                  # Compiled output (generated)
│   │   ├── index.js          # Bundled functions
│   │   └── index.js.map      # Source maps
│   ├── build.mjs             # esbuild configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── Documentation/
    ├── SETUP_COMPLETE.md           # Setup guide
    ├── DEPLOYMENT.md               # Deployment instructions
    ├── BUNDLER_CONFIG.md           # Bundler details
    └── BUNDLER_SETUP_COMPLETE.md   # Bundler summary
```

## Available Functions

### `health`
Health check endpoint for monitoring

**Endpoint:** `https://europe-southwest1-<project>.cloudfunctions.net/health`  
**Method:** GET  
**Response:**
```json
{
  "status": "ok",
  "service": "cenie-cloud-functions",
  "environment": "production",
  "timestamp": "2024-11-08T01:50:00.000Z"
}
```

### `translationInvestigation`
Translation investigation endpoint (LLM agent)

**Endpoint:** `https://europe-southwest1-<project>.cloudfunctions.net/translationInvestigation`  
**Method:** POST  
**Body:**
```json
{
  "query": "Translation query to investigate"
}
```

**Configuration:**
- Timeout: 540s (9 minutes)
- Memory: 2GiB
- Region: europe-southwest1
- Secrets: OPENAI_API_KEY

### `onTranslationTaskCreated`
Firestore trigger for async processing

**Trigger:** Document created in `translation-tasks/{taskId}`  
**Region:** europe-southwest1  
**Secrets:** OPENAI_API_KEY  

## Development

### Prerequisites

- Node.js 20+ (Node 22 works locally)
- pnpm 9+
- Firebase CLI: `npm install -g firebase-tools`

### Installation

```bash
# From monorepo root
pnpm install

# Functions are part of workspace
cd services/cloud-functions/functions
```

### Commands

```bash
# Build (bundles with esbuild)
pnpm build

# Build and watch
pnpm build:watch

# Type check
pnpm type-check

# Lint
pnpm lint

# Run emulator
pnpm serve

# Deploy
pnpm deploy

# View logs
pnpm logs
```

### Environment Setup

**Local Development:**
Create `functions/.env.local`:
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

## Bundler Configuration

This project uses **esbuild** to bundle workspace dependencies for deployment.

### Why Bundling?

Firebase doesn't support pnpm workspace dependencies. The bundler:
- Includes `@cenie/logger` and `@cenie/errors` in the bundle
- Excludes Firebase packages (provided by runtime)
- Creates a single optimized bundle
- Ensures clean deployment

### What Gets Bundled

✅ **Bundled into `lib/index.js`:**
- Your function code
- @cenie/logger (workspace)
- @cenie/errors (workspace)
- dotenv
- zod

❌ **External (not bundled):**
- firebase-admin
- firebase-functions

### Build Process

```
src/index.ts
    ↓ (imports)
@cenie/logger
@cenie/errors
    ↓ (esbuild)
lib/index.js (49KB bundled)
    ↓ (deployment)
Firebase Cloud Functions ✓
```

### Production Dependencies

Only 2 packages installed in cloud:
```json
{
  "dependencies": {
    "firebase-admin": "^13.5.0",
    "firebase-functions": "^6.1.2"
  }
}
```

Everything else is bundled!

## Deployment

### First Time Setup

```bash
# 1. Login to Firebase
firebase login

# 2. Select project
cd services/cloud-functions
firebase use --add

# 3. Set secrets
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set ANTHROPIC_API_KEY

# 4. Deploy
cd functions
pnpm deploy
```

### Regular Deployment

```bash
cd services/cloud-functions/functions
pnpm deploy
```

### What Gets Deployed

Firebase uploads:
- `lib/index.js` (bundled code with workspace packages)
- `lib/index.js.map` (source maps)
- `package.json` (production deps only)

Firebase ignores:
- `src/` directory
- `*.ts` files
- `build.mjs`
- Configuration files

## Testing

### Local Emulator

```bash
# Start emulator
pnpm serve

# In another terminal, test functions
curl http://localhost:5001/<project>/europe-southwest1/health

curl -X POST http://localhost:5001/<project>/europe-southwest1/translationInvestigation \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}'
```

### Deployed Functions

```bash
# Health check
curl https://europe-southwest1-<project>.cloudfunctions.net/health

# Translation investigation
curl -X POST https://europe-southwest1-<project>.cloudfunctions.net/translationInvestigation \
  -H "Content-Type: application/json" \
  -d '{"query": "your query"}'
```

## Workspace Integration

### Using Workspace Packages

The functions can import from workspace packages:

```typescript
import { createLogger } from '@cenie/logger';
import { AppError, ErrorCode } from '@cenie/errors';

const logger = createLogger({
  name: 'cloud-functions',
  level: 'info',
  environment: 'production',
});

logger.info('Function started');
```

### Updating Workspace Packages

When you modify `@cenie/logger` or `@cenie/errors`:

1. Make changes in `packages/logger/src` or `packages/errors/src`
2. Rebuild functions: `pnpm build`
3. Changes automatically bundled
4. Deploy: `pnpm deploy`

No version bumping or publishing needed!

## Troubleshooting

### Build Issues

```bash
# Clean rebuild
pnpm clean
pnpm install
pnpm build
```

### Workspace Packages Not Found

```bash
# From monorepo root
pnpm install

# Verify workspace
cat pnpm-workspace.yaml
```

### Deployment Fails

```bash
# Check project
firebase projects:list
firebase use <project>

# Verify bundle
pnpm build
ls -la lib/
grep "createLogger" lib/index.js
```

### Runtime Errors

```bash
# View logs
firebase functions:log

# Specific function
firebase functions:log --only translationInvestigation
```

## Documentation

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Complete setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[BUNDLER_CONFIG.md](./BUNDLER_CONFIG.md)** - Bundler configuration
- **[BUNDLER_SETUP_COMPLETE.md](./BUNDLER_SETUP_COMPLETE.md)** - Bundler summary
- **[functions/README.md](./functions/README.md)** - Function-specific docs

## Next Steps

1. **Implement LLM Agent Logic**
   - Add OpenAI/Anthropic clients
   - Create translation investigation logic
   - Add proper validation with Zod

2. **Add Tests**
   - Use `firebase-functions-test`
   - Test bundled functions
   - Mock Firebase services

3. **Configure Firestore**
   - Update `firestore.rules`
   - Add indexes in `firestore.indexes.json`
   - Test with emulator

4. **Monitor Production**
   - Set up Cloud Monitoring
   - Configure alerts
   - Review logs regularly

## Status

✅ **Setup Complete**  
✅ **Bundler Configured**  
✅ **Build Tested**  
✅ **Ready for Deployment**  

Your Firebase Cloud Functions are fully configured and ready to implement the translation investigation LLM agent!

