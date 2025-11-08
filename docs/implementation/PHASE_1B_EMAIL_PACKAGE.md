# PHASE 1B: FOUNDATION - EMAIL PACKAGE

**Agent Assignment**: Agent 2  
**Duration**: 3 days  
**Dependencies**: None (runs parallel to Phase 1A)  
**Deliverables**: 1 new shared package (`@cenie/email`)

---

## OVERVIEW

Create a shared email infrastructure package that provides email sending operations while allowing each app to maintain its own branded templates. This follows the same philosophy as `@cenie/logger` and `@cenie/errors` - shared operations, app-specific usage.

**Architecture Philosophy**: "Shared Engine, Branded Templates"

- `@cenie/email` = Email sending operations (provider abstraction, rendering, queueing)
- Each app (`apps/*/src/email/`) = Branded templates and configuration

**Reference Document**: `/Users/henry/Workbench/CENIE/platform/docs/evaluations/EMAIL-IMPLEMENTATION.md`

---

## PACKAGE: @cenie/email

### Purpose

Provider-agnostic email sending infrastructure with template rendering support.

### Location

`packages/email/`

### Directory Structure

```
packages/email/
├── src/
│   ├── core/
│   │   ├── sender.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── providers/
│   │   ├── resend.ts
│   │   ├── sendgrid.ts (optional backup)
│   │   ├── provider.interface.ts
│   │   └── index.ts
│   ├── templates/
│   │   ├── renderer.ts
│   │   ├── layouts/
│   │   │   ├── base.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## DETAILED REQUIREMENTS

### 1. Core Module (`src/core/`)

**File: `types.ts`**

```typescript
import type { ReactElement } from 'react'

export interface EmailBrandConfig {
  // Sender Identity
  from: {
    name: string
    email: string
  }
  replyTo?: {
    name: string
    email: string
  }

  // Visual Branding
  branding: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    logoUrl: string
  }

  // Typography
  typography: {
    headingFont: string
    bodyFont: string
    headingWeight: number
    bodyWeight: number
  }

  // Footer
  footer?: {
    organizationName: string
    address?: string
    unsubscribeUrl?: string
    socialLinks?: {
      twitter?: string
      linkedin?: string
      facebook?: string
    }
  }

  // Base URL for links
  baseUrl: string
}

export interface EmailTemplate<T = unknown> {
  name: string
  subject: string | ((data: T) => string)
  component: (
    props: T & {
      branding: EmailBrandConfig['branding']
      typography: EmailBrandConfig['typography']
      baseUrl: string
    }
  ) => ReactElement
}

export interface SendEmailOptions<T = unknown> {
  to: string | string[]
  template: EmailTemplate<T>
  data: T
  subject?: string // Override template subject
  from?: { name: string; email: string } // Override config from
  replyTo?: { name: string; email: string } // Override config replyTo
  priority?: 'normal' | 'high'
  cc?: string | string[]
  bcc?: string | string[]
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface BulkEmailResult {
  total: number
  succeeded: number
  failed: number
  results: Array<{ status: 'fulfilled' | 'rejected'; value?: EmailResult; reason?: any }>
}
```

**File: `sender.ts`**

Requirements:

- Class: `EmailSender`
- Constructor: `new EmailSender(config: EmailBrandConfig, providerType?: 'resend' | 'sendgrid')`
- Initialize provider based on providerType (default 'resend')
- Store config and logger

Methods:

1. **`send<T>(options: SendEmailOptions<T>): Promise<EmailResult>`**
   - Render template using template renderer
   - Prepare email data with branding injected
   - Call provider.send() with rendered HTML
   - Log success/failure using `@cenie/logger`
   - Throw `EmailSendError` from `@cenie/errors` on failure
   - Include metadata: to, subject, template name

2. **`sendBulk<T>(emails: SendEmailOptions<T>[]): Promise<BulkEmailResult>`**
   - Process emails in batches (batch size: 10)
   - Use `Promise.allSettled()` for error isolation
   - Return aggregated results
   - Log batch progress
   - Rate limiting: 50ms delay between batches

3. **`notify<T>(options: SendEmailOptions<T>): Promise<EmailResult>`**
   - Same as send() but with priority: 'high'
   - For time-sensitive emails (verification, password reset)
   - Higher provider priority queue

4. **Private `renderTemplate<T>(template: EmailTemplate<T>, data: T): Promise<string>`**
   - Use React Email renderer
   - Inject branding, typography, baseUrl into template props
   - Return HTML string
   - Catch rendering errors and throw EmailRenderError

Implementation Details:

```typescript
import { createLogger } from '@cenie/logger'
import { EmailSendError, EmailRenderError } from '@cenie/errors'

export class EmailSender {
  private provider: EmailProvider
  private logger: ILogger
  private config: EmailBrandConfig

  constructor(config: EmailBrandConfig, providerType: 'resend' | 'sendgrid' = 'resend') {
    this.config = config
    this.logger = createLogger({ name: 'email-sender', app: config.from.email })

    // Provider selection
    this.provider =
      providerType === 'resend' ? new ResendProvider(config) : new SendGridProvider(config)
  }

  async send<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
    try {
      // Determine subject
      const subject =
        options.subject ||
        (typeof options.template.subject === 'function'
          ? options.template.subject(options.data)
          : options.template.subject)

      // Render template
      const html = await this.renderTemplate(options.template, options.data)

      // Send via provider
      const result = await this.provider.send({
        to: options.to,
        subject,
        html,
        from: options.from || this.config.from,
        replyTo: options.replyTo || this.config.replyTo,
        priority: options.priority,
        cc: options.cc,
        bcc: options.bcc,
      })

      // Log success
      this.logger.info('Email sent successfully', {
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject,
        template: options.template.name,
        messageId: result.messageId,
      })

      return result
    } catch (error) {
      this.logger.error('Failed to send email', {
        error,
        to: options.to,
        template: options.template.name,
      })

      throw new EmailSendError('Failed to send email', {
        cause: error,
        metadata: {
          to: options.to,
          template: options.template.name,
        },
      })
    }
  }

  async sendBulk<T>(emails: SendEmailOptions<T>[]): Promise<BulkEmailResult> {
    this.logger.info('Starting bulk email send', { count: emails.length })

    // Process in batches
    const batchSize = 10
    const batches: SendEmailOptions<T>[][] = []

    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize))
    }

    const allResults: any[] = []

    for (const batch of batches) {
      const batchResults = await Promise.allSettled(batch.map((email) => this.send(email)))
      allResults.push(...batchResults)

      // Rate limiting
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    const succeeded = allResults.filter((r) => r.status === 'fulfilled').length
    const failed = allResults.filter((r) => r.status === 'rejected').length

    this.logger.info('Bulk email send completed', {
      total: emails.length,
      succeeded,
      failed,
    })

    return {
      total: emails.length,
      succeeded,
      failed,
      results: allResults,
    }
  }

  async notify<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
    return this.send({ ...options, priority: 'high' })
  }

  private async renderTemplate<T>(template: EmailTemplate<T>, data: T): Promise<string> {
    try {
      const { render } = await import('@react-email/components')

      const element = template.component({
        ...data,
        branding: this.config.branding,
        typography: this.config.typography,
        baseUrl: this.config.baseUrl,
      })

      return await render(element)
    } catch (error) {
      throw new EmailRenderError('Failed to render email template', {
        cause: error,
        metadata: { template: template.name },
      })
    }
  }
}
```

### 2. Providers Module (`src/providers/`)

**File: `provider.interface.ts`**

```typescript
export interface EmailProvider {
  send(options: ProviderSendOptions): Promise<EmailResult>
}

export interface ProviderSendOptions {
  to: string | string[]
  subject: string
  html: string
  from: { name: string; email: string }
  replyTo?: { name: string; email: string }
  priority?: 'normal' | 'high'
  cc?: string | string[]
  bcc?: string | string[]
}
```

**File: `resend.ts`**

Requirements:

- Class: `ResendProvider implements EmailProvider`
- Constructor: accepts EmailBrandConfig
- Use Resend SDK for sending
- Environment variable: `RESEND_API_KEY` (from app's .env)

```typescript
import { Resend } from 'resend'
import type { EmailProvider, ProviderSendOptions } from './provider.interface'
import type { EmailResult } from '../core/types'

export class ResendProvider implements EmailProvider {
  private resend: Resend
  private testMode: boolean

  constructor(config: EmailBrandConfig) {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }

    this.resend = new Resend(apiKey)
    this.testMode = process.env.NODE_ENV === 'development'
  }

  async send(options: ProviderSendOptions): Promise<EmailResult> {
    try {
      const data = await this.resend.emails.send({
        from: `${options.from.name} <${options.from.email}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo
          ? `${options.replyTo.name} <${options.replyTo.email}>`
          : undefined,
        cc: options.cc,
        bcc: options.bcc,
        tags: [{ name: 'priority', value: options.priority || 'normal' }],
      })

      return {
        success: true,
        messageId: data.id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
```

**File: `sendgrid.ts`** (Optional - for backup provider)

Similar structure to Resend, but using SendGrid SDK.

### 3. Templates Module (`src/templates/`)

**File: `layouts/base.tsx`**

Requirements:

- React component for base email layout
- Accepts branding and typography props
- Handles font loading (Adobe Fonts, Google Fonts)
- Responsive email styles
- Dark mode considerations (use light colors only)

```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Text,
} from '@react-email/components'
import type { EmailBrandConfig } from '../../core/types'

interface BaseLayoutProps {
  branding: EmailBrandConfig['branding']
  typography: EmailBrandConfig['typography']
  children: React.ReactNode
}

export const BaseLayout = ({
  branding,
  typography,
  children,
}: BaseLayoutProps) => (
  <Html>
    <Head>
      <style>{`
        @import url('https://use.typekit.net/rnn4nzl.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

        body {
          font-family: ${typography.bodyFont};
          background-color: ${branding.backgroundColor};
          color: ${branding.textColor};
          margin: 0;
          padding: 0;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: ${typography.headingFont};
          font-weight: ${typography.headingWeight};
          margin: 0;
          padding: 0;
        }

        p {
          font-weight: ${typography.bodyWeight};
          line-height: 1.6;
        }

        a {
          color: ${branding.primaryColor};
          text-decoration: none;
        }

        /* Email client resets */
        table {
          border-collapse: collapse;
        }

        img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </Head>
    <Body style={{ backgroundColor: branding.backgroundColor }}>
      <Container
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        {children}
      </Container>
    </Body>
  </Html>
)
```

**File: `renderer.ts`**

Requirements:

- Wrapper for React Email's render function
- Error handling for render failures
- Support for both production and development rendering

```typescript
import { render } from '@react-email/components'
import type { ReactElement } from 'react'

export async function renderEmailTemplate(element: ReactElement): Promise<string> {
  try {
    const html = await render(element, {
      pretty: process.env.NODE_ENV === 'development',
    })

    return html
  } catch (error) {
    throw new Error(`Failed to render email template: ${error}`)
  }
}
```

---

## PACKAGE CONFIGURATION

**`package.json`:**

```json
{
  "name": "@cenie/email",
  "version": "0.0.1",
  "private": true,
  "description": "Email sending infrastructure for CENIE platform",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./core": "./src/core/index.ts",
    "./providers": "./src/providers/index.ts",
    "./templates": "./src/templates/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .turbo node_modules dist",
    "email:dev": "email dev --port 3001"
  },
  "dependencies": {
    "@cenie/errors": "workspace:*",
    "@cenie/logger": "workspace:*",
    "resend": "^3.0.0",
    "react-email": "^2.0.0",
    "@react-email/components": "^0.0.15"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/node": "^24.0.0",
    "eslint": "^9.38.0",
    "typescript": "^5.9.3"
  }
}
```

**`tsconfig.json`:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

---

## CUSTOM ERROR TYPES

Add to `@cenie/errors` package:

```typescript
export class EmailSendError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super('EMAIL_SEND_FAILED', message, 'medium', options)
  }
}

export class EmailRenderError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super('EMAIL_RENDER_FAILED', message, 'medium', options)
  }
}

export class EmailConfigError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super('EMAIL_CONFIG_INVALID', message, 'high', options)
  }
}
```

---

## RESEND SETUP

### DNS Configuration Required

For each app subdomain, configure DNS records:

**Hub (hub.cenie.org):**

```
Type: TXT
Name: @
Value: [Resend verification code]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@hub.cenie.org

Type: TXT
Name: [Resend SPF key]
Value: [Resend SPF value]

Type: CNAME
Name: [Resend DKIM key]
Value: [Resend DKIM value]
```

Repeat for editorial.cenie.org, academy.cenie.org, agency.cenie.org

### Environment Variables

Each app needs:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Shared across all apps
EMAIL_FROM=noreply@[app].cenie.org
EMAIL_FROM_NAME=CENIE [App]
EMAIL_REPLY_TO=support@cenie.org  # Or app-specific
```

---

## SUCCESS CRITERIA

- [ ] Package builds without errors
- [ ] TypeScript strict mode passes
- [ ] All exports properly configured
- [ ] Resend integration working
- [ ] Template rendering working
- [ ] Error handling comprehensive
- [ ] Logging integrated
- [ ] Documentation complete

---

## TESTING STRATEGY

1. **Local Development**:
   - Use Resend test mode (emails to dashboard only)
   - Preview templates with `pnpm email:dev`
   - Test rendering with different branding configs

2. **Integration Testing**:
   - Send test email with each provider
   - Test bulk sending (small batch)
   - Test error scenarios (invalid API key, network failure)
   - Test template rendering errors

3. **Validation**:
   - Verify DNS configuration
   - Test deliverability (inbox placement)
   - Check SPF/DKIM/DMARC scores
   - Test on multiple email clients (Gmail, Outlook, Apple Mail)

---

## CRITICAL NOTES

1. **Provider Abstraction**: Although Resend is primary, the interface allows switching to SendGrid or other providers without app changes.

2. **Branding Separation**: This package is brand-agnostic. Apps will provide branding via config.

3. **React Email**: Industry standard for React-based email templates. Great DX, wide adoption.

4. **Rate Limiting**: Implemented in bulk send to respect provider limits.

5. **Error Handling**: All errors use @cenie/errors for consistency.

6. **Logging**: All operations logged via @cenie/logger.

7. **Test Mode**: Development environment uses Resend test mode (no real sends).

---

## NEXT PHASE

After Phase 1B completion:

- Phase 5 will integrate this package into all apps
- Each app will create its own branded templates
- Email verification and password reset flows will be implemented
