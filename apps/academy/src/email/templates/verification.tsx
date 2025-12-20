import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

export interface VerificationEmailData {
  userName: string
  verificationUrl: string
}

export const AcademyVerificationEmail: EmailTemplate<VerificationEmailData> = {
  name: 'academy-verification',
  subject: 'Verify your CENIE Academy account',
  component: ({ userName, verificationUrl, branding, typography, baseUrl }) => (
    <BaseLayout
      branding={branding}
      typography={typography}
      preview="Verify your email to access CENIE Academy"
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
        Welcome to CENIE Academy!
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '16px', marginBottom: '16px' }}>
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6', marginBottom: '24px' }}>
        Thank you for joining CENIE Academy, your platform for professional development and
        educational excellence. We're excited to help you advance your skills and knowledge.
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '24px' }}>
        Please verify your email address to complete your account setup and start your learning
        journey.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={verificationUrl} primaryColor={branding.primaryColor}>
          Verify Email Address
        </EmailButton>
      </div>

      <Text style={{ fontSize: '14px', color: '#666666', marginTop: '32px' }}>
        If you didn't create this account, you can safely ignore this email.
      </Text>

      <EmailFooter
        config={{
          branding,
          typography,
          baseUrl,
          from: { name: 'CENIE Academy', email: 'noreply@academy.cenie.org' },
          footer: {
            organizationName: 'CENIE Academy',
            unsubscribeUrl: 'https://academy.cenie.org/unsubscribe',
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

