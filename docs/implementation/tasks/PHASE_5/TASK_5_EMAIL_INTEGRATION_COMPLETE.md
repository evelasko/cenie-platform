# PHASE 5: Email Integration Across All Apps (Complete Guide)

**Phase**: 5 - Email Integration  
**Agent**: Agent 3  
**Duration**: 5 days  
**Dependencies**: Phase 1B complete (@cenie/email package ready)  
**Deliverables**: All 4 apps sending branded transactional emails

---

## OBJECTIVE

Integrate the `@cenie/email` package (from Phase 1B) into all 4 apps with app-specific branding and templates. Implement email verification and password reset flows.

**What You're Building**: Complete email infrastructure for authentication flows and app-specific communications.

**Why This Matters**: Users need email verification, password resets, and notifications. Each app needs its own branded email identity while sharing the sending infrastructure.

---

## ARCHITECTURE CONTEXT

### Email Integration Pattern

**Per-App Structure**:

```
apps/[app]/src/email/
├── config.ts        # Brand configuration
├── sender.ts        # App-specific EmailSender instance
└── templates/
    ├── verification.tsx    # Branded verification email
    ├── password-reset.tsx  # Branded password reset
    ├── welcome.tsx         # Branded welcome email
    └── [app-specific].tsx  # Additional templates as needed
```

**How It Works**:

1. App defines branding in `config.ts` (colors, fonts, logo)
2. App creates templates using branding
3. App creates `EmailSender` instance with config
4. API routes use sender to send emails

**Reference**: `/docs/evaluations/EMAIL-IMPLEMENTATION.md` (full architecture)

---

## APP-BY-APP IMPLEMENTATION

### TASK 5-1: Hub Email Configuration (Day 1)

#### Hub Branding

**File**: `apps/hub/src/email/config.ts`

```typescript
import type { EmailBrandConfig } from '@cenie/email'

export const hubEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Hub',
    email: process.env.EMAIL_FROM || 'noreply@hub.cenie.org',
  },
  replyTo: {
    name: 'CENIE Support',
    email: process.env.EMAIL_REPLY_TO || 'support@cenie.org',
  },

  branding: {
    primaryColor: '#f76808', // Hub orange
    backgroundColor: '#ffffff',
    textColor: '#0a0a0a',
    fontFamily: 'Gotham, -apple-system, sans-serif',
    logoUrl: 'https://cdn.cenie.org/hub/logo.png', // Update with real URL
  },

  typography: {
    headingFont: 'Gotham, sans-serif',
    bodyFont: 'Gotham, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'Centro de Estudios en Nuevas Inteligencias y Economías',
    unsubscribeUrl: 'https://hub.cenie.org/unsubscribe',
    socialLinks: {
      twitter: 'https://twitter.com/cenie',
      linkedin: 'https://linkedin.com/company/cenie',
    },
  },

  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://hub.cenie.org',
}
```

**File**: `apps/hub/src/email/sender.ts`

```typescript
import { EmailSender } from '@cenie/email'
import { hubEmailConfig } from './config'

export const hubEmailSender = new EmailSender(hubEmailConfig, 'resend')
```

#### Hub Templates

**File**: `apps/hub/src/email/templates/verification.tsx`

```typescript
import { Heading, Text } from '@react-email/components'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailButton } from '@cenie/email/templates/components/button'
import type { EmailTemplate } from '@cenie/email'

export interface VerificationEmailData {
  userName: string
  verificationUrl: string
}

export const HubVerificationEmail: EmailTemplate<VerificationEmailData> = {
  name: 'hub-verification',
  subject: 'Verify your CENIE Hub account',
  component: ({ userName, verificationUrl, branding, typography, baseUrl }) => (
    <BaseLayout
      branding={branding}
      typography={typography}
      preview="Verify your email to access CENIE Hub"
    >
      <Heading style={{ color: branding.primaryColor, fontSize: '28px' }}>
        Welcome to CENIE Hub!
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '16px' }}>
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6' }}>
        Thank you for joining CENIE Hub, your gateway to cutting-edge research, innovation, and
        institutional collaboration.
      </Text>

      <Text style={{ fontFamily: typography.bodyFont }}>
        Please verify your email address to complete your account setup and get full access to our
        platform.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={verificationUrl} primaryColor={branding.primaryColor}>
          Verify Email Address
        </EmailButton>
      </div>

      <Text style={{ fontSize: '14px', color: '#666666', marginTop: '32px' }}>
        If you didn't create this account, you can safely ignore this email.
      </Text>
    </BaseLayout>
  ),
}
```

**Similar files for**:

- `password-reset.tsx`
- `welcome.tsx`

**Copy pattern from**: `@cenie/email/src/templates/examples/` and customize branding.

#### Update Auth Routes to Send Emails

**File**: `apps/hub/src/app/api/auth/send-verification/route.ts`

```typescript
// Add email sending
import { hubEmailSender } from '@/email/sender'
import { HubVerificationEmail } from '@/email/templates/verification'

export const POST = withErrorHandling(
  withLogging(async (request) => {
    const { email } = await request.json()

    // Generate Firebase verification link
    const auth = getAdminAuth()
    const verificationUrl = await auth.generateEmailVerificationLink(email)

    // Get user
    const user = await auth.getUserByEmail(email)

    // Send branded email
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
)
```

**Similar updates for**:

- `/api/auth/reset-password` - Send password reset email
- `/api/auth/signup` - Send welcome email

---

### TASK 5-2: Editorial Email Configuration (Day 2)

#### Editorial Branding (Different from Hub)

**File**: `apps/editorial/src/email/config.ts`

```typescript
export const editorialEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Editorial',
    email: process.env.EMAIL_FROM || 'noreply@editorial.cenie.org',
  },

  branding: {
    primaryColor: 'oklch(0.4732 0.1247 46.2007)', // Warm earth tone
    backgroundColor: '#ffffff',
    textColor: 'oklch(0.2686 0 0)',
    fontFamily: 'Barlow, serif',
    logoUrl: 'https://cdn.cenie.org/editorial/logo.png',
  },

  typography: {
    headingFont: 'Anziano, serif', // Editorial uses serif!
    bodyFont: 'Barlow, sans-serif',
    headingWeight: 400,
    bodyWeight: 400,
  },

  footer: {
    organizationName: 'CENIE Editorial',
    baseUrl: 'https://editorial.cenie.org',
  },

  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://editorial.cenie.org',
}
```

**Key differences from Hub**:

- Serif typography (Anziano headings)
- Warm earth tone colors (not orange)
- Different tone: "Dear" instead of "Hi" (more formal)

#### Editorial-Specific Templates

**Additional templates Editorial needs**:

- `article-published.tsx` - Notify authors when article published
- `catalog-update.tsx` - Notify subscribers of new books
- `contributor-invited.tsx` - Invite contributors to join

**Pattern**: Same as Hub but with Editorial branding and content.

---

### TASK 5-3: Academy Email Configuration (Day 3)

#### Academy Branding

```typescript
export const academyEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE Academy',
    email: 'noreply@academy.cenie.org',
  },

  branding: {
    primaryColor: '#2563eb', // Academy blue
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    fontFamily: 'Geist, sans-serif',
    logoUrl: 'https://cdn.cenie.org/academy/logo.png',
  },

  typography: {
    headingFont: 'Geist, sans-serif',
    bodyFont: 'Geist, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  baseUrl: 'https://academy.cenie.org',
}
```

#### Academy-Specific Templates

- `verification.tsx` - Student account verification
- `password-reset.tsx` - Password reset
- `welcome.tsx` - Welcome new students
- `enrollment-confirmation.tsx` - Course enrollment confirmation
- `course-reminder.tsx` - Upcoming course reminders

---

### TASK 5-4: Agency Email Configuration (Day 4)

#### Agency Branding

```typescript
export const agencyEmailConfig: EmailBrandConfig = {
  from: {
    name: 'CENIE AGENCY',
    email: 'noreply@agency.cenie.org',
  },

  branding: {
    primaryColor: '#0f172a', // Slate-900
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://cdn.cenie.org/agency/logo.png',
  },

  typography: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  baseUrl: 'https://agency.cenie.org',
}
```

#### Agency-Specific Templates

- `verification.tsx` - Professional tone
- `password-reset.tsx` - Professional tone
- `project-inquiry.tsx` - New project inquiries
- `template-ready.tsx` - Template completion notifications

---

### TASK 5-5: Email Verification & Password Reset (Day 5)

#### Implement Complete Email Flows

**Email Verification Flow**:

1. **User signs up**
2. **Send verification email** automatically:

   ```typescript
   // In signup handler
   await appEmailSender.send({
     to: user.email,
     template: VerificationEmail,
     data: {
       userName: user.displayName,
       verificationUrl: await generateVerificationLink(user.email),
     },
   })
   ```

3. **User clicks link in email**
4. **Verify endpoint** marks email as verified
5. **Redirect to dashboard**

**Password Reset Flow**:

1. **User clicks "Forgot Password"**
2. **Enters email, submits**
3. **API generates reset link**:

   ```typescript
   const resetUrl = await auth.generatePasswordResetLink(email)
   ```

4. **Send reset email**:

   ```typescript
   await appEmailSender.send({
     to: email,
     template: PasswordResetEmail,
     data: {
       userName: user.displayName,
       resetUrl,
       expiresIn: '1 hour',
     },
   })
   ```

5. **User clicks link**
6. **Reset password page** (create if doesn't exist)
7. **Update password** in Firebase

#### Create Missing Pages

If not exist, create:

- `/forgot-password` - Password reset request page
- `/reset-password` - New password entry page (from email link)

---

## DNS CONFIGURATION (Required)

### Verify Domains in Resend

For each subdomain:

1. Log in to Resend dashboard
2. Add domain: `hub.cenie.org`
3. Copy DNS records
4. Add to DNS provider:
   - TXT record for verification
   - TXT record for SPF
   - CNAME for DKIM
   - TXT for DMARC

5. Verify in Resend (click "Verify")
6. Repeat for editorial, academy, agency

**Without DNS verification**: Emails won't send to real addresses (only Resend test addresses).

### Environment Variables

**Each app needs** (in `.env.local`):

```bash
RESEND_API_KEY=re_xxxxx  # Same for all apps
EMAIL_FROM=noreply@[app].cenie.org
EMAIL_FROM_NAME=CENIE [App]
EMAIL_REPLY_TO=support@cenie.org
```

---

## TESTING REQUIREMENTS

### Test 1: Email Sending (Per App)

**For each app**:

1. Sign up with new email
2. Check terminal logs for "Email sent"
3. Check Resend dashboard for email
4. Check email inbox (if domain verified)
5. Verify email renders correctly
6. Verify branding matches app

### Test 2: Template Rendering

**Visual verification**:

- Hub emails: Orange buttons, Gotham font
- Editorial emails: Serif headings, earth tones
- Academy emails: Blue buttons, modern sans
- Agency emails: Dark professional theme

### Test 3: Email Verification Flow

**End-to-end test**:

1. Sign up with new email
2. Receive verification email
3. Click link in email
4. Should verify email in Firebase
5. Should redirect to dashboard
6. User's `emailVerified` should be true

### Test 4: Password Reset Flow

1. Click "Forgot Password"
2. Enter email
3. Receive reset email
4. Click link
5. Enter new password
6. Submit
7. Should update password
8. Should be able to sign in with new password

### Test 5: Deliverability

**Check**:

- Emails arrive in inbox (not spam)
- Links work correctly
- Images load (if any)
- Buttons clickable
- Responsive on mobile

**Tools**:

- Mail-tester.com (spam score)
- Email clients: Gmail, Outlook, Apple Mail

---

## SUCCESS CRITERIA

### Per-App Email Setup

- [ ] Hub email config and templates
- [ ] Editorial email config and templates
- [ ] Academy email config and templates
- [ ] Agency email config and templates

### Email Features Working

- [ ] Email verification flow complete
- [ ] Password reset flow complete
- [ ] Welcome emails sending
- [ ] Branded templates rendering correctly

### Infrastructure

- [ ] 4 domains verified in Resend
- [ ] DNS records configured (SPF/DKIM/DMARC)
- [ ] Environment variables set
- [ ] Test emails delivered successfully

### Quality

- [ ] All templates mobile-responsive
- [ ] Deliverability good (inbox, not spam)
- [ ] Links working correctly
- [ ] Branding accurate per app
- [ ] TypeScript and linting clean

---

## RESEND DNS CONFIGURATION

### Per-Domain Setup Checklist

**For hub.cenie.org**:

- [ ] Domain added to Resend
- [ ] Verification TXT record added
- [ ] SPF TXT record added
- [ ] DKIM CNAME added
- [ ] DMARC TXT record added
- [ ] Domain verified in Resend
- [ ] Test email sent successfully

**Repeat for**:

- [ ] editorial.cenie.org
- [ ] academy.cenie.org
- [ ] agency.cenie.org

**DNS Propagation**: May take 24-48 hours. Use `dig` or `nslookup` to verify.

---

## COMMON PITFALLS

1. **Don't skip DNS verification**: Emails won't send without it

2. **Don't use unverified domains in production**: Start with Resend sandbox, then add domains

3. **Don't forget mobile testing**: 40% of emails opened on mobile

4. **Don't send real emails in development**: Use Resend test mode

5. **Don't forget unsubscribe links**: Required for compliance (GDPR, CAN-SPAM)

---

## APP-SPECIFIC TEMPLATES

### Hub Needs

- ✅ verification.tsx
- ✅ password-reset.tsx
- ✅ welcome.tsx
- waitlist-confirmation.tsx (for waitlist feature)

### Editorial Needs

- ✅ verification.tsx
- ✅ password-reset.tsx
- ✅ welcome.tsx
- article-published.tsx (notify authors)
- catalog-update.tsx (notify subscribers)

### Academy Needs

- ✅ verification.tsx
- ✅ password-reset.tsx
- ✅ welcome.tsx
- enrollment-confirmation.tsx (course enrollment)
- course-reminder.tsx (upcoming courses)

### Agency Needs

- ✅ verification.tsx
- ✅ password-reset.tsx
- ✅ welcome.tsx
- project-inquiry.tsx (new client inquiries)
- template-ready.tsx (automation complete)

---

## INTEGRATION POINTS

### In Signup Flow

```typescript
// After creating user
await appEmailSender.send({
  to: user.email,
  template: WelcomeEmail,
  data: {
    userName: user.displayName,
    dashboardUrl: `${baseUrl}/dashboard`,
    appName: 'Hub', // or Editorial, Academy, Agency
  },
})
```

### In Auth Routes

**Update these routes**:

- `/api/auth/signup` - Send welcome email
- `/api/auth/send-verification` - Send verification email
- `/api/auth/reset-password` - Send reset email

**Pattern**:

```typescript
// Old (just generate link)
const link = await generateLink()
return NextResponse.json({ link })

// New (send email)
const link = await generateLink()
await appEmailSender.send({
  to: email,
  template: AppropriateTemplate,
  data: { link, userName, etc },
})
return NextResponse.json({ success: true })
```

---

## HANDOFF

When Phase 5 complete:

- [ ] All apps sending branded emails
- [ ] Email verification working
- [ ] Password reset working
- [ ] DNS configured for all domains
- [ ] Deliverability verified

**Next**: Phase 6 (Sentry integration)

---

**Estimated Time**: 5 days (1 day per app + 1 day for flows)

**Critical**: DNS configuration is the blocker - start domain verification early (Day 1) so it's ready by end of week.
