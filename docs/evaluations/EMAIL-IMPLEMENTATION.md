# Email Infrastructure Assessment

## Current State Overview

What You Have:

Resend API key configured but not implemented
Firebase Auth generating verification/reset links (not sending them)
Supabase waitlist capturing emails (no confirmation emails)
Email operations scaffolded in API routes
No email templates, no email service integration, no branding

What You Need:

4 distinct email brands (Hub, Editorial, Academy, Agency)
Different sender identities per app
Same operations (send, bulk send, notify, verify, reset)
Transactional emails working with Firebase Auth flow

## The Architecture Dilemma

This is nearly identical to your design system question, except with email instead of CSS. You have:

- Shared operations (sending, templating, error handling)
- Divergent branding (colors, logos, typography, tone)
- Common patterns (verification, reset, welcome, notification)
- Distinct identities (`noreply@hub.cenie.org` vs `noreply@editorial.cenie.org`)

Recommended Architecture: "Shared Engine, Branded Templates"

Create @cenie/email Package (Shared Operations Layer)

This package handles all email operations but is brand-agnostic:

Structure:

```
packages/email/
├── src/
│ ├── core/
│ │ ├── sender.ts # Email sending abstraction
│ │ ├── types.ts # Email interfaces
│ │ ├── queue.ts # Bulk sending logic
│ │ └── analytics.ts # Open/click tracking
│ ├── providers/
│ │ ├── resend.ts # Resend implementation
│ │ └── sendgrid.ts # SendGrid fallback
│ ├── templates/
│ │ ├── renderer.ts # Template rendering engine
│ │ └── layouts/
│ │ └── base.tsx # React Email base layout
│ └── index.ts
├── package.json
└── README.md
```

Why This Works:
Operations are universal: Sending an email is the same whether it's Hub or Agency
Error handling reuses @cenie/errors: Already have AppError hierarchy
Logging reuses @cenie/logger: Already have structured logging
Provider abstraction: Switch Resend → SendGrid without touching apps
App-Specific Template Configs (Branding Layer)
Each app defines its email brand in its own directory:
Structure:

```
apps/hub/src/email/
├── config.ts # Hub email branding config
├── templates/
│ ├── verification.tsx # Hub-branded verification
│ ├── password-reset.tsx # Hub-branded reset
│ ├── welcome.tsx # Hub-branded welcome
│ └── notification.tsx # Hub-branded notification
└── sender.ts # Hub email client instance

apps/editorial/src/email/
├── config.ts # Editorial email branding
├── templates/
│ ├── verification.tsx # Editorial-branded (serif, warm)
│ ├── article-published.tsx # Editorial-specific
│ └── subscriber-welcome.tsx # Editorial-specific
└── sender.ts

apps/academy/src/email/
├── config.ts # Academy email branding
├── templates/
│ ├── verification.tsx # Academy-branded (blue, modern)
│ ├── enrollment-confirmation.tsx # Academy-specific
│ └── course-reminder.tsx # Academy-specific
└── sender.ts

apps/agency/src/email/
├── config.ts # Agency email branding
├── templates/
│ ├── verification.tsx # Agency-branded (bold, uppercase)
│ ├── project-inquiry.tsx # Agency-specific
│ └── portfolio-update.tsx # Agency-specific
└── sender.ts
```

Why This Works:
Branding stays isolated: Designer can iterate on Editorial's serif emails without touching Hub
App-specific templates: Academy needs "course reminder", Agency needs "project inquiry"
Consistent patterns: All apps have verification/reset, but branded differently
Colocation: Email config lives with the app that uses it

## Detailed Implementation Strategy

### 1. Email Branding Configuration

Each app defines its brand identity:

```typescript
// apps/hub/src/email/config.ts
import type { EmailBrandConfig } from '@cenie/email'

export const hubEmailConfig: EmailBrandConfig = {
  // Sender Identity
  from: {
    name: 'CENIE Hub',
    email: 'noreply@hub.cenie.org',
  },
  replyTo: {
    name: 'CENIE Support',
    email: 'support@cenie.org',
  },

  // Visual Branding (matches Hub's globals.css)
  branding: {
    primaryColor: 'rgb(247, 104, 8)', // Hub orange
    backgroundColor: 'rgb(245, 245, 245)', // Hub neutral-800
    textColor: 'rgb(10, 10, 10)', // Hub neutral-0
    fontFamily: 'Gotham, -apple-system, sans-serif',
    logoUrl: 'https://cdn.cenie.org/hub/logo.png',
  },

  // Typography (matches Hub's design)
  typography: {
    headingFont: 'Gotham, sans-serif',
    bodyFont: 'Gotham, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  // Email Footer
  footer: {
    organizationName: 'Centro de Estudios de Neurociencias',
    address: 'Your Organization Address',
    unsubscribeUrl: 'https://hub.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },

  // Links
  baseUrl: 'https://hub.cenie.org',
}
```

Editorial's Config Would Look Different:

```typescript
// apps/editorial/src/email/config.ts
export const editorialEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Editorial',
    email: 'noreply@editorial.cenie.org',
  },

  branding: {
    primaryColor: 'oklch(0.4732 0.1247 46.2007)', // Editorial warm earth tone
    backgroundColor: 'oklch(1 0 0)', // Editorial white
    textColor: 'oklch(0.2686 0 0)', // Editorial dark
    fontFamily: 'Barlow, -apple-system, sans-serif', // Editorial sans
    logoUrl: 'https://cdn.cenie.org/editorial/logo.png',
  },

  typography: {
    headingFont: 'Anziano, serif', // Editorial serif!
    bodyFont: 'Barlow, sans-serif',
    headingWeight: 400,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'CENIE Editorial',
    baseUrl: 'https://editorial.cenie.org',
    // ... editorial-specific footer
  },

  baseUrl: 'https://editorial.cenie.org',
}
```

Academy and Agency would follow the same pattern with their distinct brand colors, fonts, and identities.

### 2. Shared Email Operations (@cenie/email)

The core package provides brand-agnostic operations:

```typescript
// packages/email/src/core/sender.ts
import type { EmailBrandConfig, EmailTemplate, SendEmailOptions } from './types'
import { ResendProvider } from '../providers/resend'
import { SendGridProvider } from '../providers/sendgrid'
import { createLogger } from '@cenie/logger'
import { EmailSendError } from '@cenie/errors'

export class EmailSender {
private provider: EmailProvider
private logger: ILogger
private config: EmailBrandConfig

constructor(config: EmailBrandConfig, providerType: 'resend' | 'sendgrid' = 'resend') {
this.config = config
this.logger = createLogger({ name: 'email-sender' })

    // Provider abstraction - easy to switch
    this.provider = providerType === 'resend'
      ? new ResendProvider(config)
      : new SendGridProvider(config)

}

/\*\*

- Send a single email
  \*/
  async send<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
  try {
  // Render template with brand config
  const html = await this.renderTemplate(options.template, options.data)

      // Send via provider
      const result = await this.provider.send({
        to: options.to,
        subject: options.subject,
        html,
        from: options.from || this.config.from,
        replyTo: options.replyTo || this.config.replyTo,
      })

      // Log success
      this.logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        template: options.template.name,
      })

      return result

  } catch (error) {
  // Use existing error handling
  throw new EmailSendError('Failed to send email', {
  cause: error,
  metadata: { to: options.to, template: options.template.name },
  })
  }
  }

/\*\*

- Send bulk emails (e.g., newsletters)
  \*/
  async sendBulk<T>(emails: SendEmailOptions<T>[]): Promise<BulkEmailResult> {
  // Batch processing logic
  const results = await Promise.allSettled(
  emails.map(email => this.send(email))
  )

  return {
  total: emails.length,
  succeeded: results.filter(r => r.status === 'fulfilled').length,
  failed: results.filter(r => r.status === 'rejected').length,
  results,
  }

}

/\*\*

- Send notification (higher priority, immediate)
  \*/
  async notify<T>(options: SendEmailOptions<T>): Promise<EmailResult> {
  // Same as send() but with priority flag
  return this.send({ ...options, priority: 'high' })
  }

/\*\*

- Render template with brand config
  \*/
  private async renderTemplate<T>(template: EmailTemplate<T>, data: T): Promise<string> {
  // Use React Email to render
  return await render(template.component, {
  ...data,
  branding: this.config.branding,
  typography: this.config.typography,
  baseUrl: this.config.baseUrl,
  })
  }
  }
```

Why This Is Efficient:
Single implementation of send/bulk/notify logic
Reuses existing packages: @cenie/logger, @cenie/errors
Provider-agnostic: Switch email services without app changes
Type-safe: Templates are typed with their data requirements
Observable: Logs and errors flow through existing infrastructure

### 3. Template Architecture (React Email)

Use React Email for templates (industry standard, great DX):
`pnpm add react-email @react-email/components -w`
Base Layout (Shared):

```typescript
   // packages/email/src/templates/layouts/base.tsx
   import { Html, Head, Body, Container, Text } from '@react-email/components'
   import type { EmailBrandConfig } from '../../core/types'

interface BaseLayoutProps {
branding: EmailBrandConfig['branding']
typography: EmailBrandConfig['typography']
children: React.ReactNode
}

export const BaseLayout = ({ branding, typography, children }: BaseLayoutProps) => (

  <Html>
    <Head>
      <style>{`
        @import url('https://use.typekit.net/rnn4nzl.css');
        body {
          font-family: ${typography.bodyFont};
          background-color: ${branding.backgroundColor};
          color: ${branding.textColor};
        }
        h1, h2, h3 {
          font-family: ${typography.headingFont};
          font-weight: ${typography.headingWeight};
        }
      `}</style>
    </Head>
    <Body style={{ backgroundColor: branding.backgroundColor }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {children}
      </Container>
    </Body>
  </Html>
)
```

Hub Verification Template:

```typescript
// apps/hub/src/email/templates/verification.tsx
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { Button, Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'

interface VerificationEmailData {
userName: string
verificationUrl: string
}

export const HubVerificationEmail: EmailTemplate<VerificationEmailData> = {
name: 'hub-verification',
subject: 'Verify your CENIE Hub account',
component: ({ userName, verificationUrl, branding, typography }) => (
<BaseLayout branding={branding} typography={typography}>
<Heading style={{
        color: branding.primaryColor,  // Hub orange
        fontFamily: typography.headingFont,  // Gotham
      }}>
Welcome to CENIE Hub!
</Heading>
<Text style={{ fontFamily: typography.bodyFont }}>
Hi {userName},
</Text>
<Text>
Please verify your email address to get started with CENIE Hub.
</Text>
<Button
href={verificationUrl}
style={{
          backgroundColor: branding.primaryColor,  // Hub orange
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
        }} >
Verify Email
</Button>
</BaseLayout>
),
}
```

Editorial Verification Template (Different Branding):

```typescript
// apps/editorial/src/email/templates/verification.tsx
export const EditorialVerificationEmail: EmailTemplate<VerificationEmailData> = {
name: 'editorial-verification',
subject: 'Verify your CENIE Editorial account',
component: ({ userName, verificationUrl, branding, typography }) => (
<BaseLayout branding={branding} typography={typography}>
<Heading style={{
        color: branding.primaryColor,  // Editorial warm earth tone
        fontFamily: typography.headingFont,  // Anziano SERIF
      }}>
Welcome to CENIE Editorial
</Heading>
<Text style={{
        fontFamily: typography.bodyFont,  // Barlow
        lineHeight: '1.5',  // Editorial's relaxed reading style
      }}>
Dear {userName},
</Text>
<Text>
We're delighted to have you join our community of readers and scholars.
</Text>
<Button
href={verificationUrl}
style={{
          backgroundColor: branding.primaryColor,  // Editorial earth tone
          color: '#ffffff',
          padding: '12px 32px',  // More generous padding
          borderRadius: '4px',
        }} >
Confirm Your Email
</Button>
</BaseLayout>
),
}
```

Notice the Differences:

Typography: Hub uses Gotham sans everywhere, Editorial uses Anziano serif for headings
Colors: Hub orange vs Editorial earth tones
Tone: Hub is energetic ("Welcome!"), Editorial is refined ("Dear...")
Spacing: Editorial uses more generous line-height for readability

### 4. Sender Identity Management

Domain Configuration (DNS Setup Required):

```
Hub: noreply@hub.cenie.org
Editorial: noreply@editorial.cenie.org
Academy: noreply@academy.cenie.org
Agency: noreply@agency.cenie.org
```

Resend Configuration:
Add all 4 domains to Resend dashboard
Configure SPF, DKIM, DMARC for each subdomain
Verify ownership
Environment Variables (Per App):

```
# apps/hub/.env.local

RESEND_API_KEY=re_xxxxx # Shared API key
EMAIL_FROM=noreply@hub.cenie.org
EMAIL_FROM_NAME=CENIE Hub
EMAIL_REPLY_TO=support@cenie.org

# apps/editorial/.env.local

RESEND_API_KEY=re_xxxxx # Same API key
EMAIL_FROM=noreply@editorial.cenie.org
EMAIL_FROM_NAME=CENIE Editorial
EMAIL_REPLY_TO=editorial@cenie.org

# apps/academy/.env.local

RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@academy.cenie.org
EMAIL_FROM_NAME=CENIE Academy
EMAIL_REPLY_TO=academy@cenie.org

# apps/agency/.env.local

RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@agency.cenie.org
EMAIL_FROM_NAME=CENIE Agency
EMAIL_REPLY_TO=agency@cenie.org
```

Why This Works:
Single Resend account (simpler billing, analytics)
Multiple verified domains (proper sender reputation per app)
Isolated sender identities (users see "CENIE Editorial" not "CENIE Hub")
Flexible reply-to (support@ vs editorial@ vs academy@)

### 5. Integration with Firebase Auth Flow

Update your existing auth routes to actually send emails:
Current (generates link only):

```typescript
// apps/hub/src/app/api/auth/send-verification/route.ts (current)
const link = await auth.generateEmailVerificationLink(email)
return NextResponse.json({ link }) // Development only!
```

Updated (sends branded email):

```typescript
// apps/hub/src/app/api/auth/send-verification/route.ts (updated)
import { hubEmailSender } from '@/email/sender'
import { HubVerificationEmail } from '@/email/templates/verification'
import { withErrorHandling } from '@cenie/errors/next'

export const POST = withErrorHandling(async (request) => {
  const { email } = await request.json()

  // Generate Firebase verification link (same as before)
  const verificationUrl = await auth.generateEmailVerificationLink(email)

  // Get user data
  const user = await auth.getUserByEmail(email)

  // Send branded Hub email
  await hubEmailSender.send({
    to: email,
    template: HubVerificationEmail,
    data: {
      userName: user.displayName || 'there',
      verificationUrl,
    },
  })

  return NextResponse.json({ success: true })
})
```

Hub Email Client Instance:

```typescript
// apps/hub/src/email/sender.ts
import { EmailSender } from '@cenie/email'
import { hubEmailConfig } from './config'

export const hubEmailSender = new EmailSender(hubEmailConfig, 'resend')
```

Same Pattern in Editorial, Academy, Agency:

```typescript
// apps/editorial/src/email/sender.ts
import { EmailSender } from '@cenie/email'
import { editorialEmailConfig } from './config'

export const editorialEmailSender = new EmailSender(editorialEmailConfig, 'resend')
```

### 6. Handling App-Specific Email Types

Shared Emails (All Apps):

✅ Email verification
✅ Password reset
✅ Welcome email
✅ Account notifications

App-Specific Emails:

Editorial Only:

```typescript
// apps/editorial/src/email/templates/article-published.tsx
export const ArticlePublishedEmail: EmailTemplate<ArticlePublishedData> = {
name: 'article-published',
subject: 'Your article has been published',
component: ({ articleTitle, articleUrl, authorName, branding }) => (
<BaseLayout branding={branding}>
<Heading>Your Article is Live</Heading>
<Text>Dear {authorName},</Text>
<Text>
We're pleased to inform you that "{articleTitle}" has been published.
</Text>
{/_ Editorial-specific content _/}
</BaseLayout>
),
}
```

Academy Only:

```typescript
// apps/academy/src/email/templates/course-reminder.tsx
export const CourseReminderEmail: EmailTemplate<CourseReminderData> = {
name: 'course-reminder',
subject: 'Upcoming Course: {courseName}',
component: ({ courseName, startDate, studentName, branding }) => (
<BaseLayout branding={branding}>
<Heading>Course Starting Soon</Heading>
<Text>Hi {studentName},</Text>
{/_ Academy-specific content _/}
</BaseLayout>
),
}
```

Why This Works:

No forcing shared templates: Editorial doesn't need "course reminder"
Each app owns its templates: Agency can add "project inquiry" without touching Academy
Shared engine: All use same sending logic

### 7. Bulk Email Operations

Newsletter Example (Editorial):

```typescript
// apps/editorial/src/app/api/newsletter/send/route.ts
import { editorialEmailSender } from '@/email/sender'
import { NewsletterEmail } from '@/email/templates/newsletter'

export const POST = withErrorHandling(async (request) => {
  // Get all active subscribers from Supabase
  const subscribers = await getNewsletterSubscribers()

  // Prepare bulk send
  const emails = subscribers.map((subscriber) => ({
    to: subscriber.email,
    template: NewsletterEmail,
    data: {
      subscriberName: subscriber.name,
      articles: latestArticles,
      unsubscribeUrl: `https://editorial.cenie.org/unsubscribe?token=${subscriber.token}`,
    },
  }))

  // Send bulk (handled by @cenie/email)
  const result = await editorialEmailSender.sendBulk(emails)

  return NextResponse.json({
    total: result.total,
    succeeded: result.succeeded,
    failed: result.failed,
  })
})
```

Why This Is Efficient:

Single method: sendBulk() handles batching, rate limiting, retries
Error isolation: One failed email doesn't stop the batch
Progress tracking: Returns success/failure counts
Reuses provider: Resend handles delivery optimization

### 8. Analytics & Tracking

Track Opens/Clicks (Optional):

```typescript
// packages/email/src/core/analytics.ts
export class EmailAnalytics {
  async trackOpen(emailId: string, userId: string): Promise<void> {
    // Store in your analytics DB (Supabase, Firebase, etc.)
  }

  async trackClick(emailId: string, linkUrl: string, userId: string): Promise<void> {
    // Track which links users click
  }
}
```

Integrate with Resend:

Resend provides open/click tracking out of the box
Webhook support for delivery status
Analytics dashboard included

## Why This Architecture is Superior

Compared to Alternative Approaches:

❌ Don't: Monolithic Email Service

```
packages/email/
├── templates/
│ ├── hub-verification.tsx
│ ├── editorial-verification.tsx
│ ├── academy-verification.tsx
│ ├── agency-verification.tsx
│ └── ... (40+ templates mixed together)
```

Problems:
All templates in one package
Changes to Editorial templates trigger rebuilds for Hub
No clear ownership
Merge conflicts when multiple teams edit
Bundle bloat (every app imports all templates)

❌ Don't: Separate Email Package Per App

```
packages/hub-email/
packages/editorial-email/
packages/academy-email/
packages/agency-email/
```

Problems:
Duplicated sender logic 4x
Bug fixes need 4 PRs
Provider changes need 4 updates
No shared improvements

✅ Do: Shared Operations, Isolated Branding (Recommended)

```
packages/email/ (shared operations)
apps/hub/src/email/ (Hub branding & templates)
apps/editorial/src/email/ (Editorial branding & templates)
apps/academy/src/email/ (Academy branding & templates)
apps/agency/src/email/ (Agency branding & templates)
```

Benefits:
✅ Single implementation of complex logic (sending, queueing, retries)
✅ Each app owns its brand independently
✅ Shared improvements (better error handling) benefit everyone
✅ No cross-app dependencies
✅ Tree-shaking works (each app bundles only its templates)
✅ Clear ownership (Editorial team owns editorial/src/email/)
✅ Parallel development (no merge conflicts between apps)

## Cost & Performance Considerations

Resend Pricing (as of 2024):
Free: 100 emails/day
Pro: $20/mo for 50,000 emails
Additional emails: $0.50/1,000

Recommendation:
Start with single Resend account ($20/mo)
All 4 apps share the account
Total: 50,000 emails/month across all apps
If one app needs more, upgrade together (economies of scale)

Alternative: App-Specific Accounts
Hub: $20/mo (50k emails)
Editorial: $20/mo (50k newsletters)
Academy: $20/mo (50k course notifications)
Agency: $20/mo (50k project updates)
Total: $80/mo
Verdict: Shared account is 4x cheaper unless you're sending >50k/month.

## Security & Compliance

GDPR Considerations:
Unsubscribe links: Required in all marketing emails
Double opt-in: Recommended for newsletters
Data retention: Store emails only as long as needed
Right to erasure: Implement email deletion endpoint

Implementation:

```
// Unsubscribe URL in every email
footer: {
  unsubscribeUrl: `${baseUrl}/unsubscribe?token=${encryptedUserId}`,
}
```

SPF/DKIM/DMARC:
Configure for all 4 subdomains
Improves deliverability
Prevents spoofing
Resend provides setup guide
Testing Strategy

Local Development:

```typescript
// packages/email/src/core/sender.ts
if (process.env.NODE_ENV === 'development') {
  // Use Resend's test mode
  this.provider = new ResendProvider({
    ...config,
    testMode: true, // Emails go to Resend dashboard, not real inboxes
  })
}
```

Preview Emails (React Email):

```bash
cd packages/email
pnpm run email:dev # Launches preview server at localhost:3001
```

Staging Environment:

```bash
# apps/hub/.env.staging

EMAIL_FROM=noreply+staging@hub.cenie.org # Staging sender
```

## Bottom Line

Your email architecture should mirror your design system philosophy:
Shared operations (@cenie/email for sending, queueing, analytics)
Isolated branding (each app owns its templates and config)
Common patterns (verification, reset, welcome) implemented per app
Distinct identities (different senders, colors, fonts, tone)

Implementation Priority:

Build @cenie/email package (2-3 days)

Integrate Hub first (1-2 days)

Replicate pattern to other apps (1 day each)

Add advanced features as needed (bulk, analytics, etc.)

The beauty: When you fix a bug in the sender logic or add Sentry integration to email errors, all 4 apps benefit. But when Editorial wants to tweak their newsletter template to use a serif font, only Editorial changes.

This is infrastructure sharing, not design sharing—exactly like your approach to @cenie/logger and @cenie/errors.
