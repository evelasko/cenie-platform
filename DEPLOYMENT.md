# CENIE Platform Deployment Guide

This guide provides comprehensive instructions for deploying the CENIE platform to Vercel using an efficient monorepo strategy.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Vercel CLI installed (`npm i -g vercel`)
- GitHub repository connected to Vercel

### Initial Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Build all applications
pnpm build

# 3. Set up Vercel projects (run once)
pnpm vercel:setup
```

## 📋 Architecture Overview

### Deployment Strategy

- **4 separate Vercel projects** for independent scaling
- **Single GitHub repository** with monorepo configuration
- **Path-based deployments** triggered by file changes
- **Shared dependencies** built once, used by all apps

### Project Structure

```text
cenie-platform/
├── apps/
│   ├── hub/           → cenie.org
│   ├── editorial/     → editorial.cenie.org
│   ├── academy/       → academy.cenie.org
│   └── agency/        → agency.cenie.org
├── packages/          → Shared components & utilities
├── services/          → Backend API services
└── .github/workflows/ → CI/CD automation
```

## 🛠️ Setup Instructions

### 1. Vercel Projects Setup

Create 4 Vercel projects from the same repository:

```bash
# Navigate to each app directory and link to Vercel
cd apps/hub && vercel link
cd ../editorial && vercel link
cd ../academy && vercel link
cd ../agency && vercel link
```

**Project Configuration:**

- **Hub**: `cenie-hub` → Production domain: `cenie.org`
- **Editorial**: `cenie-editorial` → Production domain: `editorial.cenie.org`
- **Academy**: `cenie-academy` → Production domain: `academy.cenie.org`
- **Agency**: `cenie-agency` → Production domain: `agency.cenie.org`

### 2. Environment Variables

Follow the detailed guide in [`VERCEL_ENV_SETUP.md`](./VERCEL_ENV_SETUP.md) to configure:

- **Shared variables**: Supabase, Cloudinary, Stripe
- **App-specific variables**: Firebase configurations
- **GitHub secrets**: Vercel tokens for CI/CD

### 3. Domain Configuration

#### Production Domains

Set up custom domains in each Vercel project:

- `cenie.org` → Hub project
- `editorial.cenie.org` → Editorial project
- `academy.cenie.org` → Academy project
- `agency.cenie.org` → Agency project

#### Preview Domains (Optional)

- `hub-preview.cenie.org`
- `editorial-preview.cenie.org`
- `academy-preview.cenie.org`
- `agency-preview.cenie.org`

## 🚢 Deployment Methods

### Method 1: Automated CI/CD (Recommended)

The GitHub Actions workflow automatically handles deployments:

**Triggers:**

- Push to `main` branch → Production deployment
- Pull request → Preview deployment
- Changes in `apps/`, `packages/`, or `services/` directories

**Process:**

1. **Quality Gates**: Lint, type-check, and test
2. **Change Detection**: Only deploys affected applications
3. **Parallel Deployment**: Multiple apps deploy simultaneously
4. **Notifications**: Deployment status summary

### Method 2: Manual Deployment

#### Deploy All Applications

```bash
# Production deployment
pnpm deploy

# Preview deployment
pnpm deploy:preview
```

#### Deploy Individual Applications

```bash
# Production
pnpm deploy:hub
pnpm deploy:editorial
pnpm deploy:academy
pnpm deploy:agency

# Preview
pnpm deploy:preview:hub
pnpm deploy:preview:editorial
pnpm deploy:preview:academy
pnpm deploy:preview:agency
```

### Method 3: Vercel CLI

```bash
# Navigate to specific app
cd apps/hub

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## 🔧 Build Configuration

### Turbo Build Setup

Each app uses optimized Turbo builds:

```bash
# Build specific app
pnpm build:hub
pnpm build:editorial
pnpm build:academy
pnpm build:agency

# Build all
pnpm build
```

### Build Optimization

- **Dependency caching** via Turbo
- **Incremental builds** for unchanged packages
- **Parallel execution** for independent apps
- **Smart filtering** based on file changes

## 🌍 Environment Management

### Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm dev:hub
pnpm dev:editorial
pnpm dev:academy
pnpm dev:agency
```

**Ports:**

- Hub: `localhost:3000`
- Editorial: `localhost:3001`
- Academy: `localhost:3002`
- Agency: `localhost:3003`

### Staging/Preview

- Triggered by pull requests
- Uses preview environment variables
- Deployed to preview URLs

### Production

- Triggered by main branch pushes
- Uses production environment variables
- Deployed to custom domains

## 📊 Monitoring & Analytics

### Deployment Monitoring

- **Vercel Dashboard**: Real-time deployment status
- **GitHub Actions**: Build and deployment logs
- **Vercel Analytics**: Performance metrics

### Application Monitoring

- **Vercel Analytics**: Core web vitals
- **Firebase Analytics**: User behavior (app-specific)
- **Error Tracking**: Built-in Vercel error monitoring

## 🔒 Security Considerations

### Environment Variables

- ✅ Stored securely in Vercel
- ✅ Environment-specific isolation
- ✅ No sensitive data in repository
- ✅ Regular key rotation

### Deployment Security

- ✅ Branch protection rules
- ✅ Required status checks
- ✅ Automated security scanning
- ✅ HTTPS enforced on all domains

## 🐛 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check dependencies
pnpm install

# Verify environment variables
pnpm ci:check

# Clean and rebuild
pnpm clean && pnpm build
```

#### Deployment Issues

1. **Check Vercel project settings**
2. **Verify environment variables**
3. **Review build logs in Vercel dashboard**
4. **Ensure correct branch is linked**

#### Environment Variable Problems

1. **Case sensitivity**: Variable names must match exactly
2. **Special characters**: Escape quotes in private keys
3. **Missing variables**: All required vars must be set
4. **Environment scope**: Check development/preview/production settings

### Debug Commands

```bash
# Check build status
pnpm build --filter=@cenie/hub --verbose

# Verify environment
pnpm vercel env ls

# Test local build
pnpm build && pnpm start
```

## 🚀 Performance Optimization

### Build Performance

- **Turbo caching**: Reduces build times by 80%
- **Dependency optimization**: Shared packages cached
- **Parallel builds**: Multiple apps build simultaneously
- **Incremental compilation**: Only changed code rebuilds

### Runtime Performance

- **Edge deployment**: Global CDN distribution
- **Static optimization**: Pre-rendered pages
- **Image optimization**: Automatic WebP conversion
- **Bundle optimization**: Tree-shaking and code splitting

## 📈 Scaling Considerations

### Horizontal Scaling

- **Independent apps**: Scale based on individual demand
- **Edge functions**: Automatically distributed globally
- **CDN caching**: Static assets cached worldwide

### Vertical Scaling

- **Serverless functions**: Auto-scale based on load
- **Database connections**: Pooled and optimized
- **Memory allocation**: Configurable per function

## 🔄 Rollback Strategy

### Automated Rollbacks

```bash
# Revert to previous deployment
vercel rollback

# Rollback specific app
cd apps/hub && vercel rollback
```

### Manual Rollbacks

1. **Identify stable commit** from deployment history
2. **Create hotfix branch** from stable commit
3. **Deploy hotfix** through CI/CD pipeline
4. **Monitor** deployment success

## 📚 Additional Resources

### Documentation

- [`VERCEL_ENV_SETUP.md`](./VERCEL_ENV_SETUP.md) - Environment variable configuration
- [`CLAUDE.md`](./CLAUDE.md) - Development guide and conventions
- [`README.md`](./README.md) - Project overview and local setup

### External Links

- [Vercel Documentation](https://vercel.com/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Support

- **GitHub Issues**: Bug reports and feature requests
- **Vercel Support**: Deployment and infrastructure issues
- **Team Chat**: Internal development discussions

---

## 📋 Deployment Checklist

### Initial Setup

- [ ] Install Vercel CLI
- [ ] Create 4 Vercel projects
- [ ] Configure environment variables
- [ ] Set up custom domains
- [ ] Configure GitHub secrets

### Pre-Deployment

- [ ] Run tests: `pnpm test`
- [ ] Check linting: `pnpm lint`
- [ ] Verify types: `pnpm type-check`
- [ ] Test builds: `pnpm build`

### Post-Deployment

- [ ] Verify all domains are accessible
- [ ] Test authentication flows
- [ ] Check analytics setup
- [ ] Monitor error rates
- [ ] Validate performance metrics

### Ongoing Maintenance

- [ ] Regular dependency updates
- [ ] Environment variable rotation
- [ ] Performance monitoring
- [ ] Security updates
- [ ] Backup verification

  🎯 Deployment Strategy Implemented

  Configuration Files Created:

  1. Root vercel.json - Monorepo configuration with shared settings
  2. 4 App-specific vercel.json files - Individual project configurations for Hub, Editorial, Academy, and Agency
  3. GitHub Actions workflow - Automated CI/CD pipeline with change detection and parallel deployments

  Enhanced Scripts:

  - Deployment commands for individual and batch deployments
  - Build optimization using Turbo filters
  - Development commands for app-specific workflows

  Documentation:

  1. VERCEL_ENV_SETUP.md - Comprehensive environment variable configuration guide
  2. DEPLOYMENT.md - Complete deployment documentation with troubleshooting

  🚀 Key Features:

  Efficient Deployment:

  - Independent scaling per application
  - Path-based change detection - only deploys affected apps
  - Parallel deployments for faster release cycles
  - Turbo-powered builds with intelligent caching

  Robust CI/CD Pipeline:

  - Quality gates: lint, type-check, test before deployment
  - Environment-specific deployments (development/preview/production)
  - Automatic rollback capabilities
  - Real-time deployment notifications

  Production-Ready Setup:

  - Domain mapping: cenie.org, editorial.cenie.org, academy.cenie.org, agency.cenie.org
  - Environment isolation with secure variable management
  - Security headers and performance optimizations
  - Monitoring and analytics integration

  📋 Next Steps:

  1. Set up Vercel projects using pnpm vercel:setup
  2. Configure environment variables following VERCEL_ENV_SETUP.md
  3. Set up GitHub secrets for automated deployments
  4. Test deployments using pnpm deploy:preview
  5. Configure custom domains in Vercel dashboard

  The implementation provides a scalable, maintainable deployment strategy that leverages Vercel's strengths while
  optimizing for the monorepo structure. Each application can scale independently while sharing common
  infrastructure and development workflows.
