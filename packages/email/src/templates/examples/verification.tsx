import { Heading, Text } from '@react-email/components'

import type { EmailTemplate } from '../../core/types'
import { EmailButton } from '../components/button'
import { BaseLayout } from '../layouts/base'
import { EmailFooter } from '../layouts/footer'

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
