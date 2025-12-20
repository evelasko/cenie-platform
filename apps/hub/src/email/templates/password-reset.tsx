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

export const HubPasswordResetEmail: EmailTemplate<PasswordResetEmailData> = {
  name: 'hub-password-reset',
  subject: 'Reset your CENIE Hub password',
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
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6', marginBottom: '24px' }}>
        We received a request to reset your password for your CENIE Hub account. Click the button
        below to choose a new password.
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

