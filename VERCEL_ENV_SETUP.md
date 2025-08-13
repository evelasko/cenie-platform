# Vercel Environment Variables Setup Guide

This guide explains how to configure environment variables for the CENIE platform deployment on Vercel.

## Overview

The CENIE platform uses a two-tier environment variable system:

- **Shared variables** (in root `.env`) - Used across all applications
- **App-specific variables** (in each app's `.env.local`) - Unique to each application

## Vercel Project Setup

### 1. Create Vercel Projects

Create 4 separate Vercel projects:

```bash
# Hub (Main platform)
vercel --name cenie-hub --scope your-team

# Editorial (Academic publishing)
vercel --name cenie-editorial --scope your-team

# Academy (Educational platform)
vercel --name cenie-academy --scope your-team

# Agency (Automation services)
vercel --name cenie-agency --scope your-team
```

### 2. Environment Variables Configuration

#### Shared Variables (Add to ALL 4 projects)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wixrlohlkcvrvptfduyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHJsb2hsa2N2cnZwdGZkdXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MjEwNzYsImV4cCI6MjA3MDM5NzA3Nn0.BVrc3JIVwbBlY896BRkgkd3nSYiW5JMS2Sa7tm8GYsA
SUPABASE_SECRET_KEY=sb_secret_l8dAMkvlMbAn8OYIf7IAyQ_XHSRJ-Yk
SUPABASE_PROJECT_ID=wixrlohlkcvrvptfduyc

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=misfitcoders
CLOUDINARY_API_KEY=961264386323792
CLOUDINARY_API_SECRET=uqfGToVIlmteDXXiIIEad6FPXaQ

# Stripe Configuration (if applicable)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Build Configuration
NODE_ENV=production
```

#### App-Specific Variables

##### Hub App (`cenie-hub` project)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_hub_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cenie-hub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cenie-hub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cenie-hub.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_hub_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_hub_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_hub_measurement_id

# Firebase Admin
FIREBASE_PROJECT_ID=cenie-hub
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@cenie-hub.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_hub_private_key\n-----END PRIVATE KEY-----"

# App Configuration
NEXT_PUBLIC_APP_NAME=hub
NEXT_PUBLIC_APP_URL=https://cenie.org
```

##### Editorial App (`cenie-editorial` project)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_editorial_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cenie-editorial.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cenie-editorial
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cenie-editorial.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_editorial_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_editorial_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_editorial_measurement_id

# Firebase Admin
FIREBASE_PROJECT_ID=cenie-editorial
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@cenie-editorial.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_editorial_private_key\n-----END PRIVATE KEY-----"

# App Configuration
NEXT_PUBLIC_APP_NAME=editorial
NEXT_PUBLIC_APP_URL=https://editorial.cenie.org
```

##### Academy App (`cenie-academy` project)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_academy_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cenie-academy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cenie-academy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cenie-academy.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_academy_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_academy_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_academy_measurement_id

# Firebase Admin
FIREBASE_PROJECT_ID=cenie-academy
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@cenie-academy.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_academy_private_key\n-----END PRIVATE KEY-----"

# App Configuration
NEXT_PUBLIC_APP_NAME=academy
NEXT_PUBLIC_APP_URL=https://academy.cenie.org
```

##### Agency App (`cenie-agency` project)

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_agency_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cenie-agency.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cenie-agency
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cenie-agency.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_agency_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_agency_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_agency_measurement_id

# Firebase Admin
FIREBASE_PROJECT_ID=cenie-agency
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@cenie-agency.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_agency_private_key\n-----END PRIVATE KEY-----"

# App Configuration
NEXT_PUBLIC_APP_NAME=agency
NEXT_PUBLIC_APP_URL=https://agency.cenie.org
```

## GitHub Secrets Configuration

Add these secrets to your GitHub repository for CI/CD:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id

# Turbo Configuration (optional, for build caching)
TURBO_TOKEN=your_turbo_token
TURBO_TEAM=your_turbo_team
```

### How to Get Vercel Secrets

1. **VERCEL_TOKEN**:
   - Go to Vercel Dashboard > Settings > Tokens
   - Create a new token with appropriate scopes

2. **VERCEL_ORG_ID**:
   - Go to Vercel Dashboard > Settings > General
   - Copy the "Team ID" or "User ID"

## Domain Configuration

### Production Domains

- `cenie.org` → Hub app
- `editorial.cenie.org` → Editorial app
- `academy.cenie.org` → Academy app
- `agency.cenie.org` → Agency app

### Preview Domains

- `hub-preview.cenie.org` → Hub app (preview)
- `editorial-preview.cenie.org` → Editorial app (preview)
- `academy-preview.cenie.org` → Academy app (preview)
- `agency-preview.cenie.org` → Agency app (preview)

## Deployment Commands

### Using Vercel CLI

```bash
# Deploy Hub app
cd apps/hub && vercel --prod

# Deploy Editorial app
cd apps/editorial && vercel --prod

# Deploy Academy app
cd apps/academy && vercel --prod

# Deploy Agency app
cd apps/agency && vercel --prod
```

### Using GitHub Actions

The CI/CD pipeline automatically deploys when:

- Changes are detected in app directories
- Changes are made to shared packages
- Changes are made to services

## Environment-Specific Configuration

### Development

- Uses local `.env` and `.env.local` files
- Runs on localhost with different ports
- Firebase emulators can be used

### Preview

- Triggered by pull requests
- Uses preview environment variables
- Deploys to preview domains

### Production

- Triggered by pushes to main branch
- Uses production environment variables
- Deploys to production domains

## Security Considerations

1. **Never commit sensitive keys** to the repository
2. **Use Vercel's environment variable encryption**
3. **Rotate keys regularly**
4. **Use different Firebase projects** for each environment
5. **Enable domain restrictions** where possible

## Troubleshooting

### Build Failures

1. Check environment variables are set correctly
2. Verify Firebase service account keys format
3. Ensure all dependencies are installed
4. Check Turbo build cache

### Deployment Issues

1. Verify Vercel project configuration
2. Check domain DNS settings
3. Validate environment variable values
4. Review deployment logs in Vercel dashboard

### Environment Variable Issues

1. Ensure variables are set in correct environment (development/preview/production)
2. Check for typos in variable names
3. Verify JSON formatting for complex values
4. Ensure all required variables are present
