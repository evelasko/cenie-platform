# TASK 1B-1: Create @cenie/email Core & Resend Provider

**Phase**: 1B - Email Package  
**Duration**: 2 days  
**Dependencies**: None (runs parallel to Phase 1A)  
**Next Task**: TASK_1B2 (Email Templates)

---

## OBJECTIVE

Create a shared email sending infrastructure that all apps will use for transactional emails (verification, password reset, notifications). This package handles email delivery while apps provide their own branded templates.

**What You're Building**: Email operations layer with Resend integration.

**Why This Matters**: All 4 apps need to send emails with their own branding (Hub orange, Editorial serif, Academy blue, Agency bold). Shared operations, branded content.

---

## ARCHITECTURE CONTEXT

### Email Architecture Philosophy

**Shared Operations** (@cenie/email):

- Email sending (single, bulk, priority)
- Provider abstraction (Resend primary, SendGrid backup)
- Template rendering (React Email)
- Error handling and logging
- Rate limiting and batching

**Per-App Branding** (apps/\*/src/email/):

- Brand colors, fonts, logos
- Email templates (verification, reset, welcome, app-specific)
- Sender identity (<noreply@hub.cenie.org> vs <noreply@editorial.cenie.org>)

**Why Separate?**:

- Fixing email sending bug → all apps benefit
- Changing Editorial's email design → only Editorial affected
- Same philosophy as @cenie/logger and @cenie/errors

### Resend Integration

**Why Resend**:

- Modern API (simple, fast)
- Great DX (testing, logs)
- React Email support
- Competitive pricing
- Already have API key

**Single Account, Multiple Domains**:

- All 4 apps share one Resend account ($20/month for 50K emails)
- Each app has verified domain (hub.cenie.org, editorial.cenie.org, etc.)
- Proper sender reputation per domain

---

## REFERENCE DOCUMENTS

**Primary Reference**:

- `/docs/evaluations/EMAIL-IMPLEMENTATION.md` (832 lines)
- Read the entire document - it contains the complete architecture rationale

**Key Sections**:

- Lines 21-84: Architecture explanation ("Shared Engine, Branded Templates")
- Lines 108-305: Email Branding Configuration examples
- Lines 307-428: Sender Implementation details
- Lines 430-497: Sender Identity Management
- Lines 499-656: Integration patterns

**No extraction needed**: This is new code (not extracted from existing apps).

---

## WHAT TO BUILD

### Package Structure

```
packages/email/
├── src/
│   ├── core/
│   │   ├── sender.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── providers/
│   │   ├── resend.ts
│   │   ├── provider.interface.ts
│   │   └── index.ts
│   ├── templates/
│   │   ├── renderer.ts
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## DETAILED REQUIREMENTS

### Core Module (`src/core/`)

**File: `types.ts`**

Complete type definitions from `/docs/evaluations/EMAIL-IMPLEMENTATION.md`:

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
      instagram?: string
    }
  }

  // Base URL for email links
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
  results: Array<{
    status: 'fulfilled' | 'rejected'
    value?: EmailResult
    reason?: any
  }>
}
```

**File: `sender.ts`**

**Class**: `EmailSender`

**Complete Implementation** (from EMAIL-IMPLEMENTATION.md lines 198-304):

```typescript
import { createLogger } from '@cenie/logger'
import { EmailSendError, EmailRenderError } from '@cenie/errors'
import type { EmailProvider } from '../providers/provider.interface'
import type {
  EmailBrandConfig,
  EmailTemplate,
  SendEmailOptions,
  EmailResult,
  BulkEmailResult,
} from './types'

export class EmailSender {
  private provider: EmailProvider
  private logger: ReturnType<typeof createLogger>
  private config: EmailBrandConfig

  constructor(config: EmailBrandConfig, providerType: 'resend' | 'sendgrid' = 'resend') {
    this.config = config
    this.logger = createLogger({ name: 'email-sender', app: config.from.email })

    // Provider selection - lazy load to avoid importing both
    if (providerType === 'resend') {
      const { ResendProvider } = require('../providers/resend')
      this.provider = new ResendProvider(config)
    } else {
      const { SendGridProvider } = require('../providers/sendgrid')
      this.provider = new SendGridProvider(config)
    }
  }

  /**
   * Send a single email
   */
  async send<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
    try {
      // Determine subject
      const subject =
        options.subject ||
        (typeof options.template.subject === 'function'
          ? options.template.subject(options.data)
          : options.template.subject)

      // Render template
      this.logger.debug('Rendering email template', { template: options.template.name })
      const html = await this.renderTemplate(options.template, options.data)

      // Send via provider
      this.logger.debug('Sending email', {
        to: options.to,
        subject,
        provider: this.provider.constructor.name,
      })

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

  /**
   * Send bulk emails (for newsletters, notifications, etc.)
   */
  async sendBulk<T>(emails: SendEmailOptions<T>[]): Promise<BulkEmailResult> {
    this.logger.info('Starting bulk email send', { count: emails.length })

    // Process in batches
    const batchSize = 10
    const batches: SendEmailOptions<T>[][] = []

    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize))
    }

    const allResults: Array<PromiseSettledResult<EmailResult>> = []

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      this.logger.debug(`Processing batch ${i + 1}/${batches.length}`, {
        batchSize: batch.length,
      })

      const batchResults = await Promise.allSettled(batch.map((email) => this.send(email)))
      allResults.push(...batchResults)

      // Rate limiting between batches
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    const succeeded = allResults.filter((r) => r.status === 'fulfilled').length
    const failed = allResults.filter((r) => r.status === 'rejected').length

    this.logger.info('Bulk email send completed', {
      total: emails.length,
      succeeded,
      failed,
      batchCount: batches.length,
    })

    return {
      total: emails.length,
      succeeded,
      failed,
      results: allResults as any,
    }
  }

  /**
   * Send high-priority notification email
   */
  async notify<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
    return this.send({ ...options, priority: 'high' })
  }

  /**
   * Render email template with brand configuration
   */
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
      this.logger.error('Template rendering failed', {
        error,
        template: template.name,
      })

      throw new EmailRenderError('Failed to render email template', {
        cause: error,
        metadata: { template: template.name },
      })
    }
  }
}
```

**File: `index.ts`**

```typescript
export * from './sender'
export * from './types'
```

### Providers Module (`src/providers/`)

**File: `provider.interface.ts`**

```typescript
import type { EmailResult } from '../core/types'

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

export interface EmailProvider {
  send(options: ProviderSendOptions): Promise<EmailResult>
}
```

**File: `resend.ts`**

```typescript
import { Resend } from 'resend'
import { createLogger } from '@cenie/logger'
import { EmailConfigError } from '@cenie/errors'
import type { EmailProvider, ProviderSendOptions } from './provider.interface'
import type { EmailResult } from '../core/types'

export class ResendProvider implements EmailProvider {
  private resend: Resend
  private testMode: boolean
  private logger: ReturnType<typeof createLogger>

  constructor() {
    this.logger = createLogger({ name: 'resend-provider' })

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new EmailConfigError('RESEND_API_KEY environment variable is required')
    }

    this.resend = new Resend(apiKey)
    this.testMode = process.env.NODE_ENV === 'development'

    if (this.testMode) {
      this.logger.info('Resend initialized in TEST MODE - emails will not be sent to real inboxes')
    }
  }

  async send(options: ProviderSendOptions): Promise<EmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${options.from.name} <${options.from.email}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo
          ? `${options.replyTo.name} <${options.replyTo.email}>`
          : undefined,
        cc: options.cc,
        bcc: options.bcc,
        tags: [
          { name: 'priority', value: options.priority || 'normal' },
          { name: 'environment', value: process.env.NODE_ENV || 'development' },
        ],
      })

      if (error) {
        this.logger.error('Resend API error', { error, subject: options.subject })
        return {
          success: false,
          error: error.message || 'Unknown Resend error',
        }
      }

      return {
        success: true,
        messageId: data?.id,
      }
    } catch (error) {
      this.logger.error('Resend provider error', { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
```

**File: `index.ts`**

```typescript
export * from './provider.interface'
export * from './resend'
```

### Templates Module (`src/templates/`)

**File: `renderer.ts`**

```typescript
import { render } from '@react-email/components'
import type { ReactElement } from 'react'
import { createLogger } from '@cenie/logger'

const logger = createLogger({ name: 'email-renderer' })

/**
 * Render React Email component to HTML string
 */
export async function renderEmailTemplate(element: ReactElement): Promise<string> {
  try {
    const html = await render(element, {
      pretty: process.env.NODE_ENV === 'development',
    })

    logger.debug('Email template rendered', {
      length: html.length,
      mode: process.env.NODE_ENV,
    })

    return html
  } catch (error) {
    logger.error('Email template rendering failed', { error })
    throw new Error(`Failed to render email template: ${error}`)
  }
}
```

**File: `index.ts`**

```typescript
export * from './renderer'
```

### Root Files

**File: `src/types.ts`**

```typescript
// Re-export core types for convenience
export type {
  EmailBrandConfig,
  EmailTemplate,
  SendEmailOptions,
  EmailResult,
  BulkEmailResult,
} from './core/types'

export type { EmailProvider, ProviderSendOptions } from './providers/provider.interface'
```

**File: `src/index.ts`**

```typescript
export * from './core'
export * from './providers'
export * from './templates'
export * from './types'
```

### Package Configuration

**File: `package.json`**

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
    "clean": "rm -rf .turbo node_modules dist"
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

**File: `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## ADDING ERROR TYPES TO @cenie/errors

**Before implementing the email package**, add these error types to `packages/errors/src/`:

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

Export them from `packages/errors/src/index.ts`.

---

## RESEND SETUP REQUIREMENTS

### 1. Resend Account Configuration

**Access Resend Dashboard**: <https://resend.com/>

1. **API Key**: Should already exist (RESEND_API_KEY in env)
2. **Verify domains** (will be done in Phase 5, but plan now):
   - hub.cenie.org
   - editorial.cenie.org
   - academy.cenie.org
   - agency.cenie.org

### 2. Environment Variables

Each app will need (in Phase 5):

```bash
RESEND_API_KEY=re_xxxxx  # Shared across all apps
EMAIL_FROM=noreply@[app].cenie.org
EMAIL_FROM_NAME=CENIE [App]
EMAIL_REPLY_TO=support@cenie.org
```

For now (testing Phase 1B), use default Resend sandbox domain.

---

## TESTING REQUIREMENTS

### Test 1: Package Builds

```bash
cd packages/email
pnpm install
pnpm type-check
pnpm lint
```

**Expected**: Zero errors, zero warnings.

### Test 2: Send Test Email (Sandbox)

Create test script: `packages/email/src/__tests__/send-test.ts`

```typescript
import { EmailSender } from '../core/sender'
import type { EmailTemplate } from '../core/types'

// Simple test template
const TestEmail: EmailTemplate<{ name: string }> = {
  name: 'test-email',
  subject: 'Test Email from CENIE',
  component: ({ name, branding }) => {
    const { Html, Body, Container, Heading, Text } = require('@react-email/components')

    return (
      <Html>
        <Body style={{ backgroundColor: branding.backgroundColor }}>
          <Container>
            <Heading style={{ color: branding.primaryColor }}>
              Hello, {name}!
            </Heading>
            <Text>This is a test email from the CENIE email package.</Text>
          </Container>
        </Body>
      </Html>
    )
  },
}

// Test sender
const sender = new EmailSender({
  from: { name: 'CENIE Test', email: 'onboarding@resend.dev' }, // Sandbox
  branding: {
    primaryColor: '#f76808',
    backgroundColor: '#f5f5f5',
    textColor: '#0a0a0a',
    fontFamily: 'sans-serif',
    logoUrl: '',
  },
  typography: {
    headingFont: 'sans-serif',
    bodyFont: 'sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },
  baseUrl: 'http://localhost:3000',
})

// Send test
async function test() {
  const result = await sender.send({
    to: 'delivered@resend.dev', // Resend test email
    template: TestEmail,
    data: { name: 'Developer' },
  })

  console.log('Result:', result)
}

test().catch(console.error)
```

Run:

```bash
RESEND_API_KEY=your_key tsx packages/email/src/__tests__/send-test.ts
```

**Expected**:

- Console log shows success
- Check Resend dashboard - email should appear in logs
- Email sent to <delivered@resend.dev> (Resend's test inbox)

### Test 3: Bulk Sending

```typescript
// Test bulk with 25 emails
const emails = Array.from({ length: 25 }, (_, i) => ({
  to: `test-${i}@resend.dev`,
  template: TestEmail,
  data: { name: `User ${i}` },
}))

const result = await sender.sendBulk(emails)
console.log('Bulk result:', result)
```

**Expected**:

- All 25 emails sent successfully
- Batched in groups of 10
- Check Resend dashboard for all 25 emails

### Test 4: Template Rendering

```typescript
// Test rendering without sending
import { renderEmailTemplate } from '../templates/renderer'

const element = TestEmail.component({
  name: 'Test User',
  branding: config.branding,
  typography: config.typography,
  baseUrl: config.baseUrl,
})

const html = await renderEmailTemplate(element)
console.log(html) // Should see HTML output
```

---

## SUCCESS CRITERIA

- [ ] Package builds without errors
- [ ] TypeScript strict mode passing
- [ ] Linting clean (zero warnings)
- [ ] Can send email via Resend sandbox
- [ ] Bulk sending works (batching, rate limiting)
- [ ] Template rendering works
- [ ] Error handling comprehensive (uses @cenie/errors)
- [ ] Logging integrated (uses @cenie/logger)
- [ ] README.md comprehensive with examples
- [ ] Error types added to @cenie/errors package

---

## COMMON PITFALLS

1. **Don't send to real emails in tests**: Use Resend's test addresses (<delivered@resend.dev>)

2. **Don't forget test mode check**: Development should use Resend test mode

3. **Don't hardcode branding**: All branding comes from config parameter

4. **Don't skip error handling**: Email sending can fail for many reasons (network, invalid email, rate limits)

5. **Don't log full email HTML**: It's huge - just log template name and recipient

---

## RESEND TEST ADDRESSES

Resend provides test email addresses for development:

- `delivered@resend.dev` - Always delivers successfully
- `bounced@resend.dev` - Simulates bounce
- `complained@resend.dev` - Simulates spam complaint

Use these for testing!

---

## HANDOFF

When complete:

- [ ] Package functional and tested
- [ ] Can send emails via Resend
- [ ] Bulk sending tested
- [ ] Template rendering tested
- [ ] Documentation complete

**Next**: TASK_1B2 will add base templates and React Email infrastructure.

---

**Estimated Time**: 8-12 hours (2 days)

**Critical**: This is the foundation for all email operations. Take time to test thoroughly with Resend sandbox before moving to branded templates.
