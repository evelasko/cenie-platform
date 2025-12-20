# @cenie/email

Email sending infrastructure for CENIE platform. Provides a unified interface for sending transactional emails with brand-specific templates across all CENIE applications.

## Features

- **Provider Abstraction**: Currently supports Resend, designed for future SendGrid support
- **Bulk Operations**: Batch processing with rate limiting
- **Template Rendering**: React Email component rendering
- **Brand Configuration**: Per-app branding (colors, fonts, logos)
- **Error Handling**: Integrated with @cenie/errors
- **Logging**: Comprehensive logging via @cenie/logger
- **Type-Safe**: Full TypeScript support with strict mode

## Architecture

This package follows the "Shared Engine, Branded Templates" philosophy:

- **@cenie/email** (this package): Email operations (sending, batching, providers)
- **apps/\*/src/email/**: App-specific branding and templates

All apps share the same email infrastructure but maintain their own visual identity.

## Installation

```bash
pnpm add @cenie/email --filter=<your-app>
```

## Environment Variables

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Required for Resend provider
NODE_ENV=development             # Controls test mode
```

**📖 Complete Setup Guide:** See [RESEND-SETUP.md](./RESEND-SETUP.md) for detailed instructions on:

- Creating a Resend account and generating API keys
- Verifying custom domains for production
- DNS configuration (SPF, DKIM, MX records)
- Per-app domain setup (hub.cenie.org, editorial.cenie.org, etc.)
- Production deployment and environment variables
- Testing, monitoring, and troubleshooting

## Basic Usage

### 1. Configure Brand Identity

```typescript
import { EmailBrandConfig } from '@cenie/email'

const brandConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Hub',
    email: 'noreply@hub.cenie.org',
  },
  replyTo: {
    name: 'CENIE Support',
    email: 'support@cenie.org',
  },
  branding: {
    primaryColor: '#f76808', // Orange for Hub
    backgroundColor: '#f5f5f5',
    textColor: '#0a0a0a',
    fontFamily: 'sans-serif',
    logoUrl: 'https://hub.cenie.org/logo.png',
  },
  typography: {
    headingFont: 'sans-serif',
    bodyFont: 'sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },
  footer: {
    organizationName: 'CENIE',
    address: '123 Street, City, Country',
    unsubscribeUrl: 'https://hub.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },
  baseUrl: 'https://hub.cenie.org',
}
```

### 2. Create Email Template

```typescript
import { EmailTemplate } from '@cenie/email'
import { Html, Body, Container, Heading, Text, Button } from '@react-email/components'

interface WelcomeEmailData {
  userName: string
  verificationUrl: string
}

export const WelcomeEmail: EmailTemplate<WelcomeEmailData> = {
  name: 'welcome-email',
  subject: (data) => `Welcome to CENIE, ${data.userName}!`,
  component: ({ userName, verificationUrl, branding, typography, baseUrl }) => (
    <Html>
      <Body style={{ backgroundColor: branding.backgroundColor, fontFamily: branding.fontFamily }}>
        <Container>
          <Heading style={{ color: branding.primaryColor, fontWeight: typography.headingWeight }}>
            Welcome, {userName}!
          </Heading>
          <Text style={{ color: branding.textColor }}>
            Thanks for joining CENIE. Please verify your email to get started.
          </Text>
          <Button
            href={verificationUrl}
            style={{ backgroundColor: branding.primaryColor, color: 'white' }}
          >
            Verify Email
          </Button>
        </Container>
      </Body>
    </Html>
  ),
}
```

### 3. Send Email

```typescript
import { EmailSender } from '@cenie/email'
import { WelcomeEmail } from './templates/welcome'

// Initialize sender with brand config
const emailSender = new EmailSender(brandConfig, 'resend')

// Send single email
const result = await emailSender.send({
  to: 'user@example.com',
  template: WelcomeEmail,
  data: {
    userName: 'John Doe',
    verificationUrl: 'https://hub.cenie.org/verify?token=xyz',
  },
})

if (result.success) {
  console.log('Email sent!', result.messageId)
} else {
  console.error('Email failed:', result.error)
}
```

## Advanced Usage

### Bulk Email Sending

```typescript
const emails = users.map((user) => ({
  to: user.email,
  template: NewsletterEmail,
  data: { userName: user.name },
}))

const bulkResult = await emailSender.sendBulk(emails)

console.log(`Sent ${bulkResult.succeeded}/${bulkResult.total} emails`)
console.log(`Failed: ${bulkResult.failed}`)
```

Bulk sending automatically:

- Batches emails (10 per batch)
- Adds rate limiting between batches (50ms)
- Returns detailed results for each email

### High-Priority Notifications

```typescript
// Send with high priority
await emailSender.notify({
  to: 'admin@example.com',
  template: AlertEmail,
  data: { alertMessage: 'System issue detected' },
})
```

### Override Configuration

```typescript
await emailSender.send({
  to: 'user@example.com',
  template: WelcomeEmail,
  data: { userName: 'John' },

  // Override defaults
  subject: 'Custom subject line',
  from: { name: 'Custom Sender', email: 'custom@cenie.org' },
  priority: 'high',
  cc: 'admin@cenie.org',
  bcc: ['log@cenie.org', 'archive@cenie.org'],
})
```

## Email Templates with React Email

This package uses [React Email](https://react.email/) for template rendering. Available components:

```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Link,
  Img,
  Hr,
  Preview,
} from '@react-email/components'
```

### Template Best Practices

1. **Always use inline styles** (email clients don't support CSS files)
2. **Use branding props** for colors/fonts (don't hardcode)
3. **Include fallback text** for images
4. **Test in multiple email clients** (Gmail, Outlook, Apple Mail)
5. **Keep HTML simple** (email clients have limited CSS support)

### Example Template Structure

```typescript
export const PasswordResetEmail: EmailTemplate<{ resetUrl: string }> = {
  name: 'password-reset',
  subject: 'Reset your CENIE password',
  component: ({ resetUrl, branding, typography, baseUrl }) => (
    <Html>
      <Head />
      <Preview>Reset your password - CENIE</Preview>
      <Body style={{ backgroundColor: branding.backgroundColor }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          {/* Logo */}
          <Img
            src={branding.logoUrl}
            alt="CENIE"
            width="120"
            height="40"
            style={{ marginBottom: '20px' }}
          />

          {/* Content */}
          <Heading
            style={{
              color: branding.primaryColor,
              fontSize: '24px',
              fontWeight: typography.headingWeight,
            }}
          >
            Reset Your Password
          </Heading>

          <Text style={{ color: branding.textColor, fontSize: '16px' }}>
            Click the button below to reset your password. This link expires in 1 hour.
          </Text>

          {/* CTA Button */}
          <Button
            href={resetUrl}
            style={{
              backgroundColor: branding.primaryColor,
              color: 'white',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Reset Password
          </Button>

          {/* Footer */}
          <Hr style={{ margin: '20px 0', borderColor: '#e5e5e5' }} />
          <Text style={{ color: '#666', fontSize: '12px' }}>
            If you didn't request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  ),
}
```

## Error Handling

The package uses @cenie/errors for consistent error handling:

```typescript
import { EmailSendError, EmailRenderError, EmailConfigError } from '@cenie/errors'

try {
  await emailSender.send({ ... })
} catch (error) {
  if (error instanceof EmailSendError) {
    // Provider failed (network, API error)
    console.error('Send failed:', error.message)
  } else if (error instanceof EmailRenderError) {
    // Template rendering failed
    console.error('Render failed:', error.message)
  } else if (error instanceof EmailConfigError) {
    // Missing API key or invalid config
    console.error('Config error:', error.message)
  }
}
```

All errors include:

- **User-friendly message** for display
- **Internal message** for logging
- **Metadata** (template name, recipient, etc.)
- **Severity level** for alerting

## Testing

### Development Mode

In development (`NODE_ENV=development`), the package:

- Uses Resend test mode
- Logs detailed debug information
- Pretty-prints rendered HTML

### Resend Test Addresses

Use these for testing without sending real emails:

```typescript
// Always delivers successfully
await emailSender.send({
  to: 'delivered@resend.dev',
  template: TestEmail,
  data: { ... },
})

// Simulates bounce
await emailSender.send({
  to: 'bounced@resend.dev',
  template: TestEmail,
  data: { ... },
})

// Simulates spam complaint
await emailSender.send({
  to: 'complained@resend.dev',
  template: TestEmail,
  data: { ... },
})
```

### Manual Testing Script

A comprehensive test script is included at [src/**tests**/send-test.tsx](./src/__tests__/send-test.tsx).

Run all tests:

```bash
# From monorepo root
RESEND_API_KEY=your_key pnpm tsx packages/email/src/__tests__/send-test.tsx
```

The test suite includes:

1. ✅ Single email send
2. ✅ Bulk email send (25 emails with batching)
3. ✅ High-priority notification
4. ✅ Configuration overrides (subject, CC, priority)
5. ✅ Bounce simulation

All tests use Resend sandbox addresses (`delivered@resend.dev`, `bounced@resend.dev`) so no real emails are sent.

## API Reference

### `EmailSender`

Constructor:

```typescript
new EmailSender(config: EmailBrandConfig, provider?: 'resend' | 'sendgrid')
```

Methods:

- `send<T>(options: SendEmailOptions<T>): Promise<EmailResult>`
- `sendBulk<T>(emails: SendEmailOptions<T>[]): Promise<BulkEmailResult>`
- `notify<T>(options: SendEmailOptions<T>): Promise<EmailResult>` (high priority)

### Types

See [src/core/types.ts](./src/core/types.ts) for complete type definitions:

- `EmailBrandConfig` - Brand configuration
- `EmailTemplate<T>` - Template definition
- `SendEmailOptions<T>` - Send options
- `EmailResult` - Send result
- `BulkEmailResult` - Bulk send result
- `EmailProvider` - Provider interface
- `ProviderSendOptions` - Provider options

## Email Templates

This package provides a comprehensive set of layout components and example templates that serve as blueprints for app-specific emails.

### Template Architecture

**Base Layouts** - Handle email client compatibility and responsive design:

- `BaseLayout` - Main email wrapper with font loading and global styles
- `EmailHeader` - Logo and branding header
- `EmailFooter` - Footer with social links, address, and unsubscribe

**Reusable Components** - Common email elements:

- `EmailButton` - Call-to-action button
- `EmailSection` - Content section with optional background
- `EmailDivider` - Horizontal divider line

**Example Templates** - Copy and customize for your app:

- `VerificationEmailExample` - Email verification template
- `PasswordResetEmailExample` - Password reset template
- `WelcomeEmailExample` - Welcome/onboarding template

### Using Template Components

```typescript
import { BaseLayout, EmailButton, EmailFooter } from '@cenie/email/templates'
import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'

export const MyCustomEmail: EmailTemplate<{ name: string; url: string }> = {
  name: 'my-custom-email',
  subject: 'Custom Email Subject',
  component: ({ name, url, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview="Preview text">
      <Heading style={{ color: branding.primaryColor }}>
        Hello, {name}!
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont }}>
        This is a custom email template using the base layout components.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={url} primaryColor={branding.primaryColor}>
          Click Here
        </EmailButton>
      </div>

      <EmailFooter
        config={{
          branding,
          typography,
          baseUrl,
          from: { name: '', email: '' },
          footer: { organizationName: 'Your Organization' },
        }}
      />
    </BaseLayout>
  ),
}
```

### Example Templates

Three complete example templates are provided in `src/templates/examples/`:

**1. Verification Email**

```typescript
import { VerificationEmailExample } from '@cenie/email/templates'

// Use in your app
await emailSender.send({
  to: user.email,
  template: VerificationEmailExample,
  data: {
    userName: user.name,
    verificationUrl: `${baseUrl}/verify?token=${token}`,
  },
})
```

**2. Password Reset Email**

```typescript
import { PasswordResetEmailExample } from '@cenie/email/templates'

await emailSender.send({
  to: user.email,
  template: PasswordResetEmailExample,
  data: {
    userName: user.name,
    resetUrl: `${baseUrl}/reset-password?token=${token}`,
    expiresIn: '1 hour',
  },
})
```

**3. Welcome Email**

```typescript
import { WelcomeEmailExample } from '@cenie/email/templates'

await emailSender.send({
  to: user.email,
  template: WelcomeEmailExample,
  data: {
    userName: user.name,
    dashboardUrl: `${baseUrl}/dashboard`,
    appName: 'Your App',
  },
})
```

### Template Development Workflow

**1. Preview Templates Locally**

Start the React Email dev server to preview templates in your browser:

```bash
cd packages/email
pnpm email:dev
```

This starts a preview server at <http://localhost:3010> where you can:

- View all templates in light/dark mode
- Test responsive layouts
- Inspect generated HTML
- Copy HTML for email client testing

**2. Test Template Rendering**

Run the render test script to verify templates compile correctly:

```bash
# From monorepo root
pnpm tsx packages/email/src/__tests__/render-test.tsx
```

This will:

- Render all example templates
- Save HTML files to `/tmp/` for inspection
- Verify branding is applied correctly
- Check that all data is rendered

**3. Customize for Your App**

Copy example templates to your app and customize:

```bash
# In your app directory
mkdir -p src/email/templates
cp ../../packages/email/src/templates/examples/verification.tsx \
   src/email/templates/verification.tsx
```

Then update branding, content, and styling to match your app.

### Email Client Compatibility

The base layout components handle compatibility with 30+ email clients:

**What's Handled:**

- ✅ Outlook (Word rendering engine quirks)
- ✅ Gmail (HTML size limits, CSS restrictions)
- ✅ Apple Mail (dark mode support)
- ✅ Mobile email clients (responsive design)
- ✅ Font loading with fallbacks
- ✅ Image optimization
- ✅ Dark mode support

**Best Practices:**

1. Always use inline styles (CSS classes not supported)
2. Use table-based layouts (flexbox/grid not supported)
3. Keep emails under 102KB (Gmail clipping threshold)
4. Use web-safe fonts with fallbacks
5. Test in multiple clients before production

### Template Customization Guide

**Changing Colors:**

```typescript
const brandConfig = {
  branding: {
    primaryColor: '#your-color', // CTA buttons, headings
    backgroundColor: '#ffffff', // Email background
    textColor: '#0a0a0a', // Body text
    // ...
  },
}
```

**Changing Fonts:**

```typescript
const brandConfig = {
  typography: {
    headingFont: 'Your Font, serif',
    bodyFont: 'Your Font, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },
}
```

**Adding Custom Sections:**

```typescript
import { EmailSection } from '@cenie/email/templates'

<EmailSection backgroundColor="#f5f5f5" padding="24px">
  <Text>Your custom content here</Text>
</EmailSection>
```

## Per-App Branding Examples

### Hub (Orange, Modern)

```typescript
primaryColor: '#f76808'
fontFamily: 'system-ui, sans-serif'
```

### Editorial (Serif, Academic)

```typescript
primaryColor: '#2c3e50'
fontFamily: 'Georgia, serif'
headingFont: 'Merriweather, serif'
```

### Academy (Blue, Friendly)

```typescript
primaryColor: '#3b82f6'
fontFamily: 'Inter, sans-serif'
```

### Agency (Bold, Tech)

```typescript
primaryColor: '#10b981'
fontFamily: 'JetBrains Mono, monospace'
```

## Roadmap

- [ ] SendGrid provider implementation
- [ ] Email preview/testing UI
- [ ] A/B testing support
- [ ] Template versioning
- [ ] Analytics integration (open/click tracking)
- [ ] Automatic retry with exponential backoff
- [ ] Queue system for large-scale sending

## License

Private - CENIE Platform
