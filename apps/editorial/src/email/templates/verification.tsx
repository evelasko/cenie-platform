import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

export interface VerificationEmailData {
  userName: string
  verificationUrl: string
}

export const EditorialVerificationEmail: EmailTemplate<VerificationEmailData> = {
  name: 'editorial-verification',
  subject: 'Verify your CENIE Editorial account',
  component: ({ userName, verificationUrl, branding, typography, baseUrl }) => (
    <BaseLayout
      branding={branding}
      typography={typography}
      preview="Verify your email to access CENIE Editorial"
    >
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '28px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Welcome to CENIE Editorial
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '16px', marginBottom: '16px' }}>
        Dear {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6', marginBottom: '24px' }}>
        Thank you for joining CENIE Editorial, your platform for academic publishing and scholarly
        research. We are pleased to have you as part of our community.
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '24px' }}>
        Please verify your email address to complete your account setup and gain access to our
        publishing platform.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={verificationUrl} primaryColor={branding.primaryColor}>
          Verify Email Address
        </EmailButton>
      </div>

      <Text style={{ fontSize: '14px', color: '#666666', marginTop: '32px' }}>
        If you did not create this account, you may safely disregard this email.
      </Text>

      <EmailFooter
        config={{
          branding,
          typography,
          baseUrl,
          from: { name: 'CENIE Editorial', email: 'noreply@editorial.cenie.org' },
          footer: {
            organizationName: 'CENIE Editorial',
            unsubscribeUrl: 'https://editorial.cenie.org/unsubscribe',
            socialLinks: {
              twitter: 'https://twitter.com/cenie',
              linkedin: 'https://linkedin.com/company/cenie',
            },
          },
        }}
      />
    </BaseLayout>
  ),
}

