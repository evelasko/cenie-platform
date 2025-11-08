# TASK 1B-2: Create Email Templates Infrastructure

**Phase**: 1B - Email Package  
**Duration**: 1 day  
**Dependencies**: TASK_1B1 (Email Core complete)  
**Next Task**: Phase 5 (Email Integration in apps)

---

## OBJECTIVE

Add base layout components and example templates to the `@cenie/email` package that apps will use as foundation for their branded emails. This provides the template structure while apps customize the branding.

**What You're Building**: React Email base components that handle responsive email layout, font loading, and common patterns.

**Why This Matters**: Email HTML is complex (compatibility with 30+ email clients). Base layouts handle this complexity once, apps just fill in content and branding.

---

## ARCHITECTURE CONTEXT

### React Email Approach

**React Email** lets you write emails as React components:
- JSX syntax (familiar to developers)
- Reusable components
- Type-safe props
- Preview in browser during development
- Automatic HTML email generation

**Base Layout Philosophy**:
- Handles email client quirks (Outlook, Gmail, Apple Mail)
- Loads custom fonts (Adobe Fonts, Google Fonts)
- Responsive design (mobile-friendly)
- Consistent structure across all templates

**Apps customize**:
- Colors (primary, background, text)
- Fonts (heading, body)
- Content (text, images, CTAs)
- Brand elements (logo, social links)

### Email Client Compatibility

**Challenges**:
- Outlook uses Word rendering engine (limited CSS)
- Gmail clips emails > 102KB
- Dark mode handling varies
- Font loading is inconsistent
- Modern CSS not supported everywhere

**Solution**: React Email components handle these quirks automatically.

---

## REFERENCE DOCUMENTS

**Primary Reference**:
- `/docs/evaluations/EMAIL-IMPLEMENTATION.md`
  - Lines 318-354: Base Layout implementation
  - Lines 356-441: Template examples (Hub vs Editorial branding differences)

**React Email Documentation**:
- Official docs: https://react.email/docs/introduction
- Components reference: https://react.email/docs/components/html

---

## WHAT TO BUILD

### Add to Package Structure

```
packages/email/src/
├── core/ (exists from TASK_1B1)
├── providers/ (exists from TASK_1B1)
├── templates/
│   ├── layouts/
│   │   ├── base.tsx
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── index.ts
│   ├── components/
│   │   ├── button.tsx
│   │   ├── section.tsx
│   │   ├── divider.tsx
│   │   └── index.ts
│   ├── examples/
│   │   ├── verification.tsx
│   │   ├── password-reset.tsx
│   │   └── welcome.tsx
│   ├── renderer.ts (exists from TASK_1B1)
│   └── index.ts
```

---

## DETAILED REQUIREMENTS

### Layouts (`src/templates/layouts/`)

**File: `base.tsx`**

**Purpose**: Main email wrapper that all templates use

**Implementation** (from EMAIL-IMPLEMENTATION.md lines 318-354):

```typescript
import {
  Html,
  Head,
  Body,
  Container,
} from '@react-email/components'
import type { EmailBrandConfig } from '../../core/types'

interface BaseLayoutProps {
  branding: EmailBrandConfig['branding']
  typography: EmailBrandConfig['typography']
  footer?: React.ReactNode
  preview?: string
  children: React.ReactNode
}

export const BaseLayout = ({
  branding,
  typography,
  footer,
  preview,
  children,
}: BaseLayoutProps) => {
  return (
    <Html>
      <Head>
        {/* Preview text (shown in inbox) */}
        {preview && (
          <meta name="description" content={preview} />
        )}
        
        {/* Custom fonts */}
        <link rel="stylesheet" href="https://use.typekit.net/rnn4nzl.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Email styles */}
        <style>{`
          body {
            font-family: ${typography.bodyFont}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: ${branding.backgroundColor};
            color: ${branding.textColor};
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: ${typography.headingFont}, serif;
            font-weight: ${typography.headingWeight};
            margin: 0 0 16px 0;
            color: ${branding.textColor};
          }
          
          p {
            font-family: ${typography.bodyFont}, sans-serif;
            font-weight: ${typography.bodyWeight};
            line-height: 1.6;
            margin: 0 0 16px 0;
          }
          
          a {
            color: ${branding.primaryColor};
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          /* Email client resets */
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
          
          img {
            max-width: 100%;
            height: auto;
            border: 0;
            display: block;
          }
          
          /* Outlook-specific fixes */
          .outlook-fix {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
        `}</style>
      </Head>
      <Body style={{ backgroundColor: branding.backgroundColor, margin: 0, padding: 0 }}>
        {/* Main container - 600px max width for email compatibility */}
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px 20px',
          }}
        >
          {children}
          
          {footer && (
            <div style={{ marginTop: '40px', borderTop: `1px solid #e5e5e5`, paddingTop: '24px' }}>
              {footer}
            </div>
          )}
        </Container>
      </Body>
    </Html>
  )
}
```

**File: `footer.tsx`**

**Purpose**: Standard email footer with unsubscribe, social links, address

```typescript
import { Text, Link, Row, Column } from '@react-email/components'
import type { EmailBrandConfig } from '../../core/types'

interface EmailFooterProps {
  config: EmailBrandConfig
  unsubscribeUrl?: string
}

export const EmailFooter = ({ config, unsubscribeUrl }: EmailFooterProps) => {
  const footer = config.footer
  
  if (!footer) return null

  return (
    <div style={{ textAlign: 'center', color: '#666666', fontSize: '12px' }}>
      {/* Organization name */}
      <Text style={{ margin: '0 0 8px 0' }}>
        {footer.organizationName}
      </Text>

      {/* Address */}
      {footer.address && (
        <Text style={{ margin: '0 0 16px 0' }}>
          {footer.address}
        </Text>
      )}

      {/* Social links */}
      {footer.socialLinks && (
        <Row style={{ marginBottom: '16px' }}>
          <Column align="center">
            {footer.socialLinks.twitter && (
              <Link href={footer.socialLinks.twitter} style={{ margin: '0 8px' }}>
                Twitter
              </Link>
            )}
            {footer.socialLinks.linkedin && (
              <Link href={footer.socialLinks.linkedin} style={{ margin: '0 8px' }}>
                LinkedIn
              </Link>
            )}
            {footer.socialLinks.facebook && (
              <Link href={footer.socialLinks.facebook} style={{ margin: '0 8px' }}>
                Facebook
              </Link>
            )}
            {footer.socialLinks.instagram && (
              <Link href={footer.socialLinks.instagram} style={{ margin: '0 8px' }}>
                Instagram
              </Link>
            )}
          </Column>
        </Row>
      )}

      {/* Unsubscribe */}
      {(unsubscribeUrl || footer.unsubscribeUrl) && (
        <Text style={{ margin: '16px 0 0 0' }}>
          <Link
            href={unsubscribeUrl || footer.unsubscribeUrl}
            style={{ color: '#666666', textDecoration: 'underline' }}
          >
            Unsubscribe from these emails
          </Link>
        </Text>
      )}
    </div>
  )
}
```

**File: `header.tsx`**

```typescript
import { Img, Row, Column } from '@react-email/components'
import type { EmailBrandConfig } from '../../core/types'

interface EmailHeaderProps {
  logoUrl: string
  appName: string
}

export const EmailHeader = ({ logoUrl, appName }: EmailHeaderProps) => {
  return (
    <Row style={{ marginBottom: '32px' }}>
      <Column align="center">
        {logoUrl && (
          <Img
            src={logoUrl}
            alt={`${appName} Logo`}
            width="120"
            height="auto"
            style={{ margin: '0 auto' }}
          />
        )}
      </Column>
    </Row>
  )
}
```

**File: `index.ts`**

```typescript
export * from './base'
export * from './footer'
export * from './header'
```

### Reusable Components (`src/templates/components/`)

**File: `button.tsx`**

```typescript
import { Button as ReactEmailButton } from '@react-email/components'

interface EmailButtonProps {
  href: string
  children: React.ReactNode
  primaryColor: string
}

export const EmailButton = ({ href, children, primaryColor }: EmailButtonProps) => {
  return (
    <ReactEmailButton
      href={href}
      style={{
        backgroundColor: primaryColor,
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      {children}
    </ReactEmailButton>
  )
}
```

**File: `section.tsx`**

```typescript
import { Section as ReactEmailSection } from '@react-email/components'

interface EmailSectionProps {
  children: React.ReactNode
  backgroundColor?: string
  padding?: string
}

export const EmailSection = ({
  children,
  backgroundColor,
  padding = '24px',
}: EmailSectionProps) => {
  return (
    <ReactEmailSection
      style={{
        backgroundColor,
        padding,
        borderRadius: '8px',
        marginBottom: '24px',
      }}
    >
      {children}
    </ReactEmailSection>
  )
}
```

**File: `divider.tsx`**

```typescript
import { Hr } from '@react-email/components'

interface EmailDividerProps {
  color?: string
}

export const EmailDivider = ({ color = '#e5e5e5' }: EmailDividerProps) => {
  return (
    <Hr
      style={{
        border: 'none',
        borderTop: `1px solid ${color}`,
        margin: '24px 0',
      }}
    />
  )
}
```

**File: `index.ts`**

```typescript
export * from './button'
export * from './section'
export * from './divider'
```

### Example Templates (`src/templates/examples/`)

**File: `verification.tsx`**

**Purpose**: Example email verification template (apps will customize this)

```typescript
import { Heading, Text } from '@react-email/components'
import { BaseLayout } from '../layouts/base'
import { EmailButton } from '../components/button'
import { EmailFooter } from '../layouts/footer'
import type { EmailTemplate, EmailBrandConfig } from '../../core/types'

export interface VerificationEmailData {
  userName: string
  verificationUrl: string
}

/**
 * Example verification email template
 * Apps should copy and customize this for their branding
 */
export const VerificationEmailExample: EmailTemplate<VerificationEmailData> = {
  name: 'verification-example',
  subject: 'Verify your email address',
  component: ({ userName, verificationUrl, branding, typography, baseUrl }) => (
    <BaseLayout
      branding={branding}
      typography={typography}
      preview="Please verify your email address to complete your account setup"
    >
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '24px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Welcome!
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '16px' }}>
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '24px' }}>
        Thank you for signing up. Please verify your email address to complete your account setup
        and get started.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={verificationUrl} primaryColor={branding.primaryColor}>
          Verify Email Address
        </EmailButton>
      </div>

      <Text
        style={{
          fontFamily: typography.bodyFont,
          fontSize: '14px',
          color: '#666666',
          marginTop: '32px',
        }}
      >
        If you didn't create this account, you can safely ignore this email.
      </Text>

      <EmailFooter
        config={{
          branding,
          typography,
          baseUrl,
          from: { name: '', email: '' }, // Will be provided by sender
          footer: {
            organizationName: 'CENIE Platform',
          },
        }}
      />
    </BaseLayout>
  ),
}
```

**File: `password-reset.tsx`**

```typescript
import { Heading, Text } from '@react-email/components'
import { BaseLayout } from '../layouts/base'
import { EmailButton } from '../components/button'
import type { EmailTemplate } from '../../core/types'

export interface PasswordResetEmailData {
  userName: string
  resetUrl: string
  expiresIn: string
}

export const PasswordResetEmailExample: EmailTemplate<PasswordResetEmailData> = {
  name: 'password-reset-example',
  subject: 'Reset your password',
  component: ({ userName, resetUrl, expiresIn, branding, typography }) => (
    <BaseLayout branding={branding} typography={typography} preview="Reset your password">
      <Heading style={{ color: branding.primaryColor }}>Password Reset Request</Heading>

      <Text style={{ fontFamily: typography.bodyFont }}>Hi {userName},</Text>

      <Text style={{ fontFamily: typography.bodyFont }}>
        We received a request to reset your password. Click the button below to choose a new
        password.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={resetUrl} primaryColor={branding.primaryColor}>
          Reset Password
        </EmailButton>
      </div>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '14px', color: '#666666' }}>
        This link will expire in {expiresIn}. If you didn't request a password reset, you can
        safely ignore this email.
      </Text>
    </BaseLayout>
  ),
}
```

**File: `welcome.tsx`**

```typescript
import { Heading, Text } from '@react-email/components'
import { BaseLayout } from '../layouts/base'
import { EmailButton } from '../components/button'
import type { EmailTemplate } from '../../core/types'

export interface WelcomeEmailData {
  userName: string
  dashboardUrl: string
  appName: string
}

export const WelcomeEmailExample: EmailTemplate<WelcomeEmailData> = {
  name: 'welcome-example',
  subject: (data) => `Welcome to ${data.appName}!`,
  component: ({ userName, dashboardUrl, appName, branding, typography }) => (
    <BaseLayout branding={branding} typography={typography} preview={`Welcome to ${appName}`}>
      <Heading style={{ color: branding.primaryColor }}>Welcome to {appName}!</Heading>

      <Text style={{ fontFamily: typography.bodyFont }}>Hi {userName},</Text>

      <Text style={{ fontFamily: typography.bodyFont }}>
        We're excited to have you on board. Your account is now active and ready to use.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={dashboardUrl} primaryColor={branding.primaryColor}>
          Go to Dashboard
        </EmailButton>
      </div>

      <Text style={{ fontFamily: typography.bodyFont }}>
        If you have any questions, feel free to reach out to our support team.
      </Text>
    </BaseLayout>
  ),
}
```

### Update Package Exports

**File: `src/templates/index.ts`**

```typescript
export * from './layouts'
export * from './components'
export * from './examples'
export * from './renderer'
```

**File: `src/index.ts`** (update)

```typescript
export * from './core'
export * from './providers'
export * from './templates'
export * from './types'
```

---

## REACT EMAIL SETUP

### Install Dependencies

Already specified in TASK_1B1 `package.json`:
```json
{
  "dependencies": {
    "react-email": "^2.0.0",
    "@react-email/components": "^0.0.15"
  }
}
```

Run: `pnpm install` in packages/email/

### Preview Server (Development Tool)

**Purpose**: Preview email templates in browser during development

**Add to `package.json` scripts**:
```json
{
  "scripts": {
    "email:dev": "email dev --port 3010",
    "email:export": "email export"
  }
}
```

**Create**: `packages/email/emails/` directory for preview:

```
packages/email/emails/
├── verification-example.tsx
├── password-reset-example.tsx
└── welcome-example.tsx
```

Copy example templates here for preview (same content as in src/templates/examples/).

**Run preview server**:
```bash
cd packages/email
pnpm email:dev
```

Opens http://localhost:3010 with all templates previewed.

---

## TESTING REQUIREMENTS

### Test 1: Template Rendering

Create test script: `packages/email/src/__tests__/render-test.ts`

```typescript
import { VerificationEmailExample } from '../templates/examples/verification'
import { renderEmailTemplate } from '../templates/renderer'

async function testRender() {
  const mockBranding = {
    primaryColor: '#f76808',
    backgroundColor: '#ffffff',
    textColor: '#0a0a0a',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://example.com/logo.png',
  }

  const mockTypography = {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  }

  const element = VerificationEmailExample.component({
    userName: 'Test User',
    verificationUrl: 'https://example.com/verify/token123',
    branding: mockBranding,
    typography: mockTypography,
    baseUrl: 'https://example.com',
  })

  const html = await renderEmailTemplate(element)

  console.log('✅ Template rendered successfully')
  console.log('HTML length:', html.length, 'bytes')
  console.log('Contains primary color:', html.includes('#f76808'))
  console.log('Contains user name:', html.includes('Test User'))
  
  // Save to file for manual inspection
  const fs = require('fs')
  fs.writeFileSync('/tmp/test-email.html', html)
  console.log('Saved to /tmp/test-email.html')
}

testRender().catch(console.error)
```

Run:
```bash
tsx packages/email/src/__tests__/render-test.ts
```

**Expected**:
- Template renders without errors
- HTML contains branding elements
- HTML contains user name
- Can open /tmp/test-email.html in browser

### Test 2: Email Preview Server

```bash
cd packages/email
pnpm email:dev
```

**Expected**:
- Server starts on port 3010
- Can navigate to http://localhost:3010
- All 3 example templates visible
- Can switch between light/dark mode preview
- Templates render correctly

### Test 3: Send Example Email

```typescript
import { EmailSender } from '../core/sender'
import { VerificationEmailExample } from '../templates/examples/verification'

const sender = new EmailSender({
  from: { name: 'CENIE Test', email: 'onboarding@resend.dev' },
  branding: { /* ... */ },
  typography: { /* ... */ },
  baseUrl: 'http://localhost:3000',
})

const result = await sender.send({
  to: 'delivered@resend.dev',
  template: VerificationEmailExample,
  data: {
    userName: 'Test User',
    verificationUrl: 'https://example.com/verify/test',
  },
})

console.log('Send result:', result)
```

**Expected**:
- Email sends successfully
- Appears in Resend dashboard
- Template renders with branding

---

## SUCCESS CRITERIA

- [ ] Base layout component created
- [ ] Footer and header components created
- [ ] Reusable components (button, section, divider) created
- [ ] 3 example templates created (verification, password-reset, welcome)
- [ ] Templates render correctly (test script passes)
- [ ] Preview server works (can view templates at localhost:3010)
- [ ] Can send example email via Resend
- [ ] All TypeScript strict mode passing
- [ ] Linting clean (zero warnings)
- [ ] README updated with template documentation

---

## COMMON PITFALLS

1. **Don't use modern CSS**: Email clients don't support flexbox, grid, etc. Use tables.

2. **Don't forget mobile**: Test templates at 320px width (mobile email clients)

3. **Don't inline styles everywhere**: BaseLayout handles global styles, components can use inline

4. **Don't skip preview server**: Visual verification is critical for emails

5. **Don't use external images without CDN**: All images should be HTTPS URLs, preferably CDN

---

## FONT LOADING NOTES

**Adobe Fonts (Typekit)**:
- Already included in base layout: `use.typekit.net/rnn4nzl.css`
- Loads custom fonts for CENIE branding
- Fallback to system fonts in unsupported clients

**Google Fonts**:
- Inter font family as universal fallback
- Works in most email clients
- Good readability

**Font Stack Strategy**:
```typescript
headingFont: 'Gotham, Inter, -apple-system, sans-serif'
bodyFont: 'Gotham, Inter, -apple-system, sans-serif'
```

Gotham → Inter → System font (graceful degradation)

---

## EMAIL CLIENT TESTING (Manual - After Phase 5)

After emails are integrated in apps, test in:
- Gmail (web, iOS, Android)
- Outlook (web, desktop, mobile)
- Apple Mail (macOS, iOS)
- Yahoo Mail
- ProtonMail

**Tools**:
- Litmus (email client testing service)
- Email on Acid
- Or manual testing with real email accounts

**For now**: Trust React Email's compatibility layer.

---

## HANDOFF

When complete:
- [ ] Package has comprehensive template infrastructure
- [ ] Example templates serve as blueprints for apps
- [ ] Preview server functional for development
- [ ] Can render and send emails end-to-end

**Next Phase**: Phase 5 will integrate this package into all 4 apps with their specific branding.

**Apps will**:
1. Copy example templates to their `src/email/templates/` directory
2. Customize branding (colors, fonts, logos)
3. Add app-specific templates as needed

---

**Estimated Time**: 6-8 hours (1 focused work day)

**Note**: This task is mostly new code creation (not extraction). Follow React Email patterns and EMAIL-IMPLEMENTATION.md architecture.

