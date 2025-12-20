import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

export interface PasswordResetEmailData {
  userName: string
  resetUrl: string
  expiresIn: string
}

export const EditorialPasswordResetEmail: EmailTemplate<PasswordResetEmailData> = {
  name: 'editorial-password-reset',
  subject: 'Reset your CENIE Editorial password',
  component: ({ userName, resetUrl, expiresIn, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview="Reset your password">
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '28px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Password Reset Request
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '16px', marginBottom: '16px' }}>
        Dear {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6', marginBottom: '24px' }}>
        We received a request to reset your password for your CENIE Editorial account. Please click
        the button below to choose a new password.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={resetUrl} primaryColor={branding.primaryColor}>
          Reset Password
        </EmailButton>
      </div>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '14px', color: '#666666' }}>
        This link will expire in {expiresIn}. If you did not request a password reset, you may
        safely disregard this email.
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

