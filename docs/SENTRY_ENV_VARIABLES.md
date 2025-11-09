# Sentry Integration - Environment Variables

This document describes the environment variables needed for Sentry integration across all CENIE platform apps.

## Required Environment Variables

Each app requires the following environment variables for Sentry integration:

### Common Variables (All Apps)

```bash
# Sentry DSN (public key for error reporting)
NEXT_PUBLIC_SENTRY_DSN=https://[public-key]@o[org-id].ingest.sentry.io/[project-id]

# Sentry Organization (for source maps upload)
SENTRY_ORG=cenie

# Sentry Project Name (specific to each app)
SENTRY_PROJECT=cenie-[app-name]  # hub, editorial, academy, or agency

# Sentry Auth Token (for source maps upload during build)
# Create at: https://sentry.io/settings/account/api/auth-tokens/
# Required scope: project:releases
SENTRY_AUTH_TOKEN=sntrys_xxx
```

## App-Specific Configuration

### Hub (`apps/hub`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://[hub-dsn]@o[org-id].ingest.sentry.io/[hub-project-id]
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-hub
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### Editorial (`apps/editorial`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://[editorial-dsn]@o[org-id].ingest.sentry.io/[editorial-project-id]
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-editorial
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### Academy (`apps/academy`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://[academy-dsn]@o[org-id].ingest.sentry.io/[academy-project-id]
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-academy
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### Agency (`apps/agency`)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://[agency-dsn]@o[org-id].ingest.sentry.io/[agency-project-id]
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-agency
SENTRY_AUTH_TOKEN=sntrys_xxx
```

## Setup Instructions

### 1. Create Sentry Account & Projects

1. Sign up/login at https://sentry.io
2. Create organization: "CENIE"
3. Create 4 projects (Next.js platform):
   - `cenie-hub`
   - `cenie-editorial`
   - `cenie-academy`
   - `cenie-agency`

### 2. Get DSNs

For each project:
1. Go to Settings → Client Keys (DSN)
2. Copy the DSN (format: `https://[key]@o[org].ingest.sentry.io/[project]`)
3. Add to `.env.local` for each app

### 3. Create Auth Token

1. Go to Settings → Auth Tokens
2. Create new token with scope: `project:releases`
3. Copy token and add to `.env.local` as `SENTRY_AUTH_TOKEN`

### 4. Configure Environment Variables

#### Local Development (`.env.local`)

Add variables to each app's `.env.local` file (or root `.env` if shared):

```bash
# Root .env or apps/[app]/.env.local
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=cenie
SENTRY_PROJECT=cenie-[app]
SENTRY_AUTH_TOKEN=sntrys_xxx
```

#### Vercel Deployment

Add environment variables in Vercel dashboard for each app:

1. Go to Project Settings → Environment Variables
2. Add each variable for:
   - Production
   - Preview (optional)
   - Development (optional)

**Important**: `NEXT_PUBLIC_SENTRY_DSN` must be available at build time for client-side error capture.

## Optional Configuration

### Disable Sentry in Development

Sentry is automatically disabled in development mode by default (via `SentryTransport`). To enable:

```bash
# In .env.local
NODE_ENV=production  # Not recommended for local dev
```

Or modify logger config to always enable Sentry transport.

### Custom Sample Rates

Performance tracing sample rates are configured in `instrumentation.ts`:
- Production: 10% (0.1)
- Development: 100% (1.0)

To customize, edit `apps/[app]/src/instrumentation.ts`.

## Verification

After setting up environment variables:

1. **Test Error Capture**: Visit `/api/test-sentry` in each app
2. **Check Sentry Dashboard**: Errors should appear within seconds
3. **Verify Source Maps**: Check that stack traces show readable code (not minified)

## Troubleshooting

### Errors Not Appearing in Sentry

- Check `NEXT_PUBLIC_SENTRY_DSN` is set correctly
- Verify DSN format matches: `https://[key]@o[org].ingest.sentry.io/[project]`
- Check browser console for Sentry initialization errors
- Verify network requests to `*.sentry.io` are not blocked

### Source Maps Not Working

- Verify `SENTRY_AUTH_TOKEN` is set in Vercel
- Check build logs for source map upload messages
- Ensure `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry setup
- Verify token has `project:releases` scope

### Double Initialization Warnings

If you see Sentry initialization warnings:
- This is expected - Sentry is initialized in both `instrumentation.ts` and `SentryTransport`
- Sentry handles multiple `init()` calls gracefully
- No action needed

## Security Notes

- `NEXT_PUBLIC_SENTRY_DSN` is public (safe to expose in client code)
- `SENTRY_AUTH_TOKEN` is secret - never commit to git
- Add `SENTRY_AUTH_TOKEN` to `.gitignore`
- Use Vercel environment variables for production secrets

