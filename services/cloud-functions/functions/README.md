# CENIE Cloud Functions

Firebase Cloud Functions for the CENIE Platform - Translation Investigation LLM Agent

## Prerequisites

- Node.js 20+
- pnpm
- Firebase CLI: `npm install -g firebase-tools`

## Installation

```bash
# Install dependencies
pnpm install

# Login to Firebase (if not already logged in)
firebase login

# Select the Firebase project
firebase use --add
```

## Development

```bash
# Build TypeScript
pnpm build

# Build and watch for changes
pnpm build:watch

# Run functions in emulator
pnpm serve

# Type check
pnpm type-check

# Lint code
pnpm lint
```

## Environment Variables

For local development, create a `.env.local` file in this directory:

```bash
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

For production, use Firebase Secret Manager:

```bash
# Set secrets
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set ANTHROPIC_API_KEY

# View secrets
firebase functions:secrets:access OPENAI_API_KEY
```

## Available Functions

### `health`
Health check endpoint for monitoring.

**Endpoint:** `https://<region>-<project>.cloudfunctions.net/health`

### `translationInvestigation`
HTTP endpoint for translation investigation requests.

**Endpoint:** `https://<region>-<project>.cloudfunctions.net/translationInvestigation`

**Method:** POST

**Body:**
```json
{
  "query": "Translation query to investigate"
}
```

### `onTranslationTaskCreated`
Firestore trigger that processes translation tasks when created in the `translation-tasks` collection.

## Testing Locally

```bash
# Start emulators
pnpm serve

# In another terminal, test the health endpoint
curl http://localhost:5001/<project-id>/europe-southwest1/health

# Test translation investigation
curl -X POST http://localhost:5001/<project-id>/europe-southwest1/translationInvestigation \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}'
```

## Deployment

```bash
# Deploy all functions
pnpm deploy

# Or from the parent directory
cd ..
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:translationInvestigation
```

## Project Structure

```
functions/
├── src/
│   ├── config/
│   │   ├── firebase.ts     # Firebase Admin initialization
│   │   └── env.ts          # Environment variables & secrets
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   └── index.ts            # Main function exports
├── lib/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Workspace Integration

This package uses the following workspace dependencies:
- `@cenie/logger` - Unified logging across the platform
- `@cenie/errors` - Standard error handling

These are automatically linked via pnpm workspace.

## Troubleshooting

### `workspace:*` dependencies not found

Make sure you're running `pnpm install` from the **root** of the monorepo or from this directory after the workspace is set up.

### Emulator not starting

Ensure Firebase CLI is updated:
```bash
npm install -g firebase-tools@latest
```

### Type errors with workspace packages

Build the workspace packages first:
```bash
# From monorepo root
pnpm --filter @cenie/logger build
pnpm --filter @cenie/errors build
```

## Additional Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Functions v2 API](https://firebase.google.com/docs/functions/beta-v2-migration)
- [Secret Manager](https://firebase.google.com/docs/functions/config-env#secret-manager)

