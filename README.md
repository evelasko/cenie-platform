# CENIE Platform Monorepo

A Turborepo-based monorepo containing the core institutional services for CENIE (Centro de Estudios en Nuevas Inteligencias y Economías).

## 🏗 Architecture Overview

This monorepo contains four main applications that share authentication, billing, and design system:

- **Hub** (`cenie.org`) - Main institutional website and brand anchor
- **Editorial** (`editorial.cenie.org`) - Academic publishing platform
- **Academy** (`academy.cenie.org`) - Education and course platform
- **Learn** (`learn.cenie.org`) - Learning Management System (LMS)

## 📁 Project Structure

```
cenie-platform/
├── apps/                    # Next.js applications
│   ├── hub/                # Main website (cenie.org)
│   ├── editorial/          # Publishing platform
│   ├── academy/            # Education platform
│   └── learn/              # LMS platform
│
├── packages/               # Shared internal packages
│   ├── ui/                # Component library (Shadcn/ui + Radix)
│   ├── design-system/     # Design tokens and theming
│   ├── config/            # Shared configurations
│   ├── supabase/         # Database client and auth
│   ├── analytics/        # Analytics integration
│   └── utils/            # Common utilities
│
├── services/              # Backend API services
│   ├── auth-api/         # Authentication service
│   ├── content-api/      # Content management
│   └── billing-api/      # Stripe integration
│
└── infrastructure/        # Deployment and IaC
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm 9+
- Git

### Installation

1. Clone the repository (if not already done):
```bash
git clone <repository-url>
cd CENIE/cenie-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key to `.env.local`
   - Run database migrations (when available)

5. Set up Cloudinary (optional):
   - Create a Cloudinary account at https://cloudinary.com
   - Copy your cloud name and API keys to `.env.local`

### Development

Run all applications in development mode:
```bash
pnpm dev
```

Run a specific application:
```bash
pnpm dev --filter=@cenie/hub
pnpm dev --filter=@cenie/editorial
pnpm dev --filter=@cenie/academy
pnpm dev --filter=@cenie/learn
```

Applications will be available at:
- Hub: http://localhost:3000
- Editorial: http://localhost:3001
- Academy: http://localhost:3002
- Learn: http://localhost:3003

### Building

Build all applications:
```bash
pnpm build
```

Build a specific application:
```bash
pnpm build --filter=@cenie/hub
```

### Testing

Run tests across the monorepo:
```bash
pnpm test
```

Run linting:
```bash
pnpm lint
```

Format code:
```bash
pnpm format
```

## 🎨 Design System

The platform uses a token-based design system with runtime theming:

- **Base tokens**: Immutable CENIE brand elements
- **Theme variants**: App-specific customizations
  - Hub: Default CENIE branding
  - Editorial: Warm browns, serif typography
  - Academy: Blues, modern sans-serif
  - Learn: Inherits Academy with adjustments

### Using the Design System

```typescript
import { hubTheme, generateCSSVariables } from '@cenie/design-system'

// In your app's root layout
const cssVars = generateCSSVariables(hubTheme)
```

## 🧩 Component Library

Components are built with:
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- CVA for variant management
- Full TypeScript support

### Using Components

```typescript
import { Button } from '@cenie/ui'

export function MyComponent() {
  return (
    <Button variant="primary" size="lg">
      Click me
    </Button>
  )
}
```

## 🔐 Authentication

Single Sign-On (SSO) across all applications using Supabase:

- One user account works across all services
- Cross-subdomain session management
- Row Level Security for data isolation
- Progressive access to new services

## 💳 Billing

Centralized Stripe integration for all subscription management:

- Unified billing across services
- Usage tracking
- Subscription tiers
- Payment method management

## 📦 Package Management

This monorepo uses pnpm workspaces for efficient dependency management:

### Adding Dependencies

To a specific app or package:
```bash
pnpm add <package> --filter=@cenie/hub
```

To the root:
```bash
pnpm add -w <package>
```

As a dev dependency:
```bash
pnpm add -D <package> --filter=@cenie/ui
```

## 🚢 Deployment

The platform is designed for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure as a monorepo project
3. Set up environment variables for each app
4. Deploy with automatic preview environments

### Environment Variables

Required variables for production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## 📊 Monitoring

- Build metrics tracked via Turbo
- Performance monitoring with Vercel Analytics
- Error tracking with Sentry (optional)
- Custom analytics integration

## 🛠 Troubleshooting

### Common Issues

**Build cache issues:**
```bash
pnpm clean
pnpm install
```

**Port conflicts:**
Check that ports 3000-3003 are available or modify port numbers in each app's package.json

**TypeScript errors:**
```bash
pnpm type-check
```

**Dependency conflicts:**
```bash
pnpm install --force
```

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

### Commit Convention

We use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring

## 📄 License

Copyright © 2024 CENIE. All rights reserved.

## 🤝 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

Built with ❤️ by the CENIE team