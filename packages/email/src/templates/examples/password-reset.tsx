import { Heading, Text } from '@react-email/components'

import type { EmailTemplate } from '../../core/types'
import { EmailButton } from '../components/button'
import { BaseLayout } from '../layouts/base'
import { EmailFooter } from '../layouts/footer'

export interface PasswordResetEmailData {
  userName: string
  resetUrl: string
  expiresIn: string
}

/**
 * Example password reset email template
 * Apps should copy and customize this for their branding
 */
export const PasswordResetEmailExample: EmailTemplate<PasswordResetEmailData> = {
  name: 'password-reset-example',
  subject: 'Reset your password',
  component: ({ userName, resetUrl, expiresIn, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview="Reset your password">
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '24px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Password Reset Request
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '16px' }}>
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '24px' }}>
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

      <EmailFooter
        config={{
          branding,
          typography,
          baseUrl,
          from: { name: '', email: '' },
          footer: {
            organizationName: 'CENIE Platform',
          },
        }}
      />
    </BaseLayout>
  ),
}
