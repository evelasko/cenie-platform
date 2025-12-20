import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

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
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '28px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Welcome to CENIE Hub!
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '16px', marginBottom: '16px' }}>
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6', marginBottom: '24px' }}>
        Thank you for joining CENIE Hub, your gateway to cutting-edge research, innovation, and
        institutional collaboration.
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '24px' }}>
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

      <EmailFooter
        config={{
          branding,
          typography,
          baseUrl,
          from: { name: 'CENIE Hub', email: 'noreply@hub.cenie.org' },
          footer: {
            organizationName: 'Centro de Estudios en Nuevas Inteligencias y Economías',
            unsubscribeUrl: 'https://hub.cenie.org/unsubscribe',
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

