# Resend Setup & Configuration Guide

Complete guide to setting up Resend for the @cenie/email package across all CENIE platform applications.

## Table of Contents

1. [Overview](#overview)
2. [Development Setup (Sandbox)](#development-setup-sandbox)
3. [Production Setup (Custom Domains)](#production-setup-custom-domains)
4. [DNS Configuration](#dns-configuration)
5. [API Key Management](#api-key-management)
6. [Environment Configuration](#environment-configuration)
7. [Domain Verification](#domain-verification)
8. [Testing & Validation](#testing--validation)
9. [Troubleshooting](#troubleshooting)

---

## Overview

**What is Resend?**

- Modern email API built for developers
- Simple integration with React Email
- Excellent deliverability and analytics
- Developer-friendly pricing

**Why Resend for CENIE?**

- Single account, multiple domains (hub.cenie.org, editorial.cenie.org, etc.)
- $20/month for 50,000 emails across all apps
- React Email native support
- Great dashboard for monitoring

**Architecture:**

```
Single Resend Account
├── hub.cenie.org (verified domain)
├── editorial.cenie.org (verified domain)
├── academy.cenie.org (verified domain)
└── agency.cenie.org (verified domain)
```

---

## Development Setup (Sandbox)

For development and testing, Resend provides a sandbox mode that doesn't require domain verification.

### Step 1: Create Resend Account

1. Go to <https://resend.com/signup>
2. Sign up with your email
3. Verify your email address
4. You'll be redirected to the dashboard

### Step 2: Generate API Key

1. Navigate to **API Keys** in the left sidebar
2. Click **Create API Key**
3. Configure the key:
   - **Name**: `CENIE Development` (or any descriptive name)
   - **Permission**: `Full access` (for development)
   - **Domain**: Select `onboarding@resend.dev` (sandbox)
4. Click **Add**
5. **IMPORTANT**: Copy the API key immediately (shown only once!)

Example API key format:

```
re_123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij
```

### Step 3: Add to Environment Variables

**Root `.env` file:**

```bash
# Resend API Key (shared across all apps in development)
RESEND_API_KEY=re_your_api_key_here
NODE_ENV=development
```

### Step 4: Test Sandbox Email

Use Resend's test email addresses:

- `delivered@resend.dev` - Always delivers successfully
- `bounced@resend.dev` - Simulates bounce
- `complained@resend.dev` - Simulates spam complaint

Run the test script:

```bash
RESEND_API_KEY=your_key pnpm tsx packages/email/src/__tests__/send-test.tsx
```

**Expected Output:**

```
✅ Email sent successfully! Message ID: abc123...
```

**Verify in Dashboard:**

1. Go to <https://resend.com/emails>
2. You should see your test email in the logs
3. Click to view details (HTML preview, delivery status, etc.)

---

## Production Setup (Custom Domains)

For production, you'll need to verify custom domains for each app.

### CENIE Domain Structure

**Recommended Setup:**

| App       | Domain              | Sender Email                  | Purpose             |
| --------- | ------------------- | ----------------------------- | ------------------- |
| Hub       | hub.cenie.org       | <noreply@hub.cenie.org>       | Main platform       |
| Editorial | editorial.cenie.org | <noreply@editorial.cenie.org> | Academic publishing |
| Academy   | academy.cenie.org   | <noreply@academy.cenie.org>   | Educational content |
| Agency    | agency.cenie.org    | <noreply@agency.cenie.org>    | Automation services |

**Alternative (Subdomain Approach):**

| App | Domain    | Sender Email                  | Purpose       |
| --- | --------- | ----------------------------- | ------------- |
| All | cenie.org | <noreply@hub.cenie.org>       | Shared domain |
| All | cenie.org | <noreply@editorial.cenie.org> | Shared domain |
| All | cenie.org | <noreply@academy.cenie.org>   | Shared domain |
| All | cenie.org | <noreply@agency.cenie.org>    | Shared domain |

_Note: The subdomain approach uses a single verified domain (cenie.org) with different sender addresses._

### Add Domain to Resend

1. Go to <https://resend.com/domains>
2. Click **Add Domain**
3. Enter your domain (e.g., `hub.cenie.org` or `cenie.org`)
4. Click **Add**
5. Resend will generate DNS records

---

## DNS Configuration

After adding a domain, Resend provides DNS records you must add to your DNS provider.

### Required DNS Records

**1. SPF Record (TXT)**

- **Purpose**: Authorizes Resend to send emails from your domain
- **Host/Name**: `send._domainkey` (or custom subdomain)
- **Type**: TXT
- **Value**: `v=spf1 include:amazonses.com ~all`
- **TTL**: 3600

**2. DKIM Record (TXT)**

- **Purpose**: Email authentication signature
- **Host/Name**: Provided by Resend (e.g., `resend._domainkey`)
- **Type**: TXT
- **Value**: Long key provided by Resend
- **TTL**: 3600

**3. MX Record**

- **Purpose**: Bounce handling
- **Host/Name**: `send` (or custom subdomain)
- **Type**: MX
- **Priority**: 10
- **Value**: `feedback-smtp.us-east-1.amazonses.com`
- **TTL**: 3600

### Example: Cloudflare DNS Setup

**For domain: `hub.cenie.org`**

1. Log in to Cloudflare
2. Select your domain (`cenie.org`)
3. Go to **DNS** → **Records**
4. Add records from Resend:

```
Type: TXT
Name: send._domainkey.hub
Content: v=spf1 include:amazonses.com ~all
TTL: Auto
Proxy: DNS only (no proxy)
```

```
Type: TXT
Name: resend._domainkey.hub
Content: [long DKIM key from Resend]
TTL: Auto
Proxy: DNS only (no proxy)
```

```
Type: MX
Name: send.hub
Mail server: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Auto
```

### Example: Namecheap DNS Setup

1. Log in to Namecheap
2. Go to **Domain List** → Select your domain
3. Click **Advanced DNS**
4. Add new records:

```
Type: TXT Record
Host: send._domainkey.hub
Value: v=spf1 include:amazonses.com ~all
TTL: Automatic
```

```
Type: TXT Record
Host: resend._domainkey.hub
Value: [DKIM key from Resend]
TTL: Automatic
```

```
Type: MX Record
Host: send.hub
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Automatic
```

### Example: Vercel DNS Setup

1. Go to Vercel dashboard
2. Select your project
3. Navigate to **Settings** → **Domains**
4. Click on your domain → **DNS Records**
5. Add the records provided by Resend

### DNS Propagation

**Timeline:**

- DNS changes can take 5 minutes to 48 hours to propagate
- Typically complete within 1-2 hours
- Check status at <https://dnschecker.org>

---

## Domain Verification

### Verify Domain in Resend

1. After adding DNS records, wait 5-10 minutes
2. Go to <https://resend.com/domains>
3. Click on your domain
4. Click **Verify Records**
5. Resend will check your DNS configuration

**Status Indicators:**

- ✅ **Verified** - Domain ready to send emails
- ⏳ **Pending** - DNS records not propagated yet
- ❌ **Failed** - DNS records incorrect or missing

### Troubleshooting Verification

**If verification fails:**

1. **Check DNS records are correct:**

   ```bash
   # Check TXT records
   dig TXT send._domainkey.hub.cenie.org
   dig TXT resend._domainkey.hub.cenie.org

   # Check MX record
   dig MX send.hub.cenie.org
   ```

2. **Common issues:**
   - DNS not propagated yet (wait longer)
   - Typo in record values
   - Wrong subdomain/host name
   - Cloudflare proxy enabled (should be DNS only)
   - Multiple conflicting records

3. **Resend verification tool:**
   - Go to domain details in Resend
   - Click "View DNS Records"
   - Check which records are valid/invalid

---

## API Key Management

### Creating Production API Keys

**Best Practice: One API key per app**

1. Go to <https://resend.com/api-keys>
2. Click **Create API Key**

**For Hub:**

- Name: `CENIE Hub Production`
- Permission: `Full access`
- Domain: `hub.cenie.org`

**For Editorial:**

- Name: `CENIE Editorial Production`
- Permission: `Full access`
- Domain: `editorial.cenie.org`

**For Academy:**

- Name: `CENIE Academy Production`
- Permission: `Full access`
- Domain: `academy.cenie.org`

**For Agency:**

- Name: `CENIE Agency Production`
- Permission: `Full access`
- Domain: `agency.cenie.org`

### API Key Permissions

**Full Access:**

- Send emails
- Manage domains
- Access analytics
- Use for production

**Sending Access:**

- Only send emails
- Cannot manage domains
- Use for restricted environments

### API Key Security

**DO:**

- ✅ Store in environment variables
- ✅ Never commit to git
- ✅ Rotate keys periodically
- ✅ Use different keys per environment
- ✅ Restrict permissions when possible

**DON'T:**

- ❌ Hardcode in source code
- ❌ Share keys publicly
- ❌ Use production keys in development
- ❌ Commit to version control

---

## Environment Configuration

### Development Environment

**Root `.env` (not committed):**

```bash
# Resend API Key (sandbox for development)
RESEND_API_KEY=re_dev_key_here
NODE_ENV=development
```

**App `.env.local` (example for Hub):**

```bash
# Hub-specific email configuration
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=CENIE Hub Dev
EMAIL_REPLY_TO=dev@localhost
```

### Production Environment

**Per-App Configuration (Vercel, Railway, etc.):**

**Hub Production:**

```bash
RESEND_API_KEY=re_hub_production_key
EMAIL_FROM=noreply@hub.cenie.org
EMAIL_FROM_NAME=CENIE Hub
EMAIL_REPLY_TO=support@cenie.org
NODE_ENV=production
```

**Editorial Production:**

```bash
RESEND_API_KEY=re_editorial_production_key
EMAIL_FROM=noreply@editorial.cenie.org
EMAIL_FROM_NAME=CENIE Editorial
EMAIL_REPLY_TO=support@cenie.org
NODE_ENV=production
```

**Academy Production:**

```bash
RESEND_API_KEY=re_academy_production_key
EMAIL_FROM=noreply@academy.cenie.org
EMAIL_FROM_NAME=CENIE Academy
EMAIL_REPLY_TO=support@cenie.org
NODE_ENV=production
```

**Agency Production:**

```bash
RESEND_API_KEY=re_agency_production_key
EMAIL_FROM=noreply@agency.cenie.org
EMAIL_FROM_NAME=CENIE Agency
EMAIL_REPLY_TO=support@cenie.org
NODE_ENV=production
```

---

## Testing & Validation

### 1. Test Email Sending

**From package:**

```bash
cd packages/email
RESEND_API_KEY=your_key pnpm tsx src/__tests__/send-test.tsx
```

**From app:**

```typescript
import { EmailSender } from '@cenie/email'
import { VerificationEmailExample } from '@cenie/email/templates'

const sender = new EmailSender({
  from: { name: 'CENIE Hub', email: 'noreply@hub.cenie.org' },
  branding: {
    /* your branding */
  },
  typography: {
    /* your typography */
  },
  baseUrl: 'https://hub.cenie.org',
})

const result = await sender.send({
  to: 'test@example.com',
  template: VerificationEmailExample,
  data: {
    userName: 'Test User',
    verificationUrl: 'https://hub.cenie.org/verify?token=test',
  },
})

console.log(result)
```

### 2. Check Delivery Status

1. Go to <https://resend.com/emails>
2. Find your sent email
3. Check status:
   - ✅ **Delivered** - Successfully delivered
   - ⏳ **Queued** - Being processed
   - ❌ **Bounced** - Delivery failed
   - ⚠️ **Complained** - Marked as spam

### 3. Email Client Testing

**Test in multiple clients:**

- Gmail (web, mobile)
- Outlook (web, desktop)
- Apple Mail (macOS, iOS)
- Yahoo Mail
- ProtonMail

**Tools:**

- [Litmus](https://litmus.com) - Comprehensive testing
- [Email on Acid](https://www.emailonacid.com) - Multi-client testing
- [Mail Tester](https://www.mail-tester.com) - Spam score checking

### 4. Spam Score Testing

Send test email to: `test-xxxxx@srv1.mail-tester.com`

You'll get:

- Spam score (aim for 10/10)
- SPF/DKIM/DMARC validation
- Content analysis
- Blacklist checks

---

## Troubleshooting

### Issue: "RESEND_API_KEY environment variable is required"

**Solution:**

```bash
# Check if env var is set
echo $RESEND_API_KEY

# Set it if missing
export RESEND_API_KEY=your_key_here

# Or run with inline env var
RESEND_API_KEY=your_key pnpm tsx script.tsx
```

### Issue: "Domain not verified"

**Solutions:**

1. Wait for DNS propagation (up to 48 hours)
2. Verify DNS records are correct:

   ```bash
   dig TXT send._domainkey.your-domain.com
   ```

3. Check Resend dashboard for specific errors
4. Ensure no conflicting DNS records
5. Disable Cloudflare proxy for email records

### Issue: Emails going to spam

**Solutions:**

1. **Verify SPF/DKIM/DMARC:**
   - Check at <https://mxtoolbox.com>
   - Ensure all records are valid

2. **Warm up domain:**
   - Start with low volume (10-20 emails/day)
   - Gradually increase over 2-4 weeks
   - Monitor bounce rates

3. **Improve content:**
   - Avoid spam trigger words
   - Include unsubscribe link
   - Use proper From/Reply-To addresses
   - Test with Mail Tester

4. **Monitor sender reputation:**
   - Check at <https://senderscore.org>
   - Aim for score > 80

### Issue: High bounce rate

**Solutions:**

1. **Validate email addresses:**
   - Use email verification API
   - Implement double opt-in

2. **Clean email list:**
   - Remove hard bounces
   - Monitor soft bounces
   - Update stale addresses

3. **Check DNS records:**
   - Ensure MX record is correct
   - Verify bounce handling

### Issue: Rate limiting

**Solution:**
The @cenie/email package handles rate limiting automatically:

- Batches emails in groups of 10
- 50ms delay between batches
- Use `sendBulk()` for large volumes

**Resend limits:**

- Free tier: 100 emails/day
- Paid tier: Based on plan

---

## Additional Resources

### Official Documentation

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [React Email Documentation](https://react.email/docs)

### Resend Dashboard Links

- [Dashboard Home](https://resend.com/home)
- [API Keys](https://resend.com/api-keys)
- [Domains](https://resend.com/domains)
- [Emails Log](https://resend.com/emails)
- [Analytics](https://resend.com/analytics)

### DNS Tools

- [DNS Checker](https://dnschecker.org) - Check DNS propagation
- [MX Toolbox](https://mxtoolbox.com) - Email DNS diagnostics
- [Mail Tester](https://www.mail-tester.com) - Spam score testing

### Email Testing Tools

- [Litmus](https://litmus.com) - Multi-client testing
- [Email on Acid](https://www.emailonacid.com) - Email testing
- [Temp Mail](https://temp-mail.org) - Temporary email addresses

---

## Quick Start Checklist

### Development (Sandbox)

- [ ] Create Resend account
- [ ] Generate sandbox API key
- [ ] Add `RESEND_API_KEY` to `.env`
- [ ] Run test script
- [ ] Verify email in dashboard

### Production (Per Domain)

- [ ] Add domain to Resend
- [ ] Copy DNS records
- [ ] Add DNS records to provider
- [ ] Wait for DNS propagation
- [ ] Verify domain in Resend
- [ ] Generate production API key
- [ ] Add API key to production env
- [ ] Test email sending
- [ ] Monitor deliverability

---

## Support

**Need Help?**

- Resend Support: <https://resend.com/support>
- Resend Discord: <https://resend.com/discord>
- Documentation: <https://resend.com/docs>

**CENIE Email Package Issues:**

- Check README: `packages/email/README.md`
- Review test scripts: `packages/email/src/__tests__/`
- Open GitHub issue

---

**Last Updated:** 2025-01-09
**Resend API Version:** v1
**Package Version:** @cenie/email v0.0.1
