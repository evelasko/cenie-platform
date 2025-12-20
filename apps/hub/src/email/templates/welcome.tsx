import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

export interface WelcomeEmailData {
  userName: string
  dashboardUrl: string
}

export const HubWelcomeEmail: EmailTemplate<WelcomeEmailData> = {
  name: 'hub-welcome',
  subject: 'Welcome to CENIE Hub!',
  component: ({ userName, dashboardUrl, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview="Welcome to CENIE Hub">
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
        We're excited to have you join CENIE Hub! Your account is now active and ready to use. You
        can access cutting-edge research, connect with institutions, and explore innovative
        solutions.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={dashboardUrl} primaryColor={branding.primaryColor}>
          Go to Dashboard
        </EmailButton>
      </div>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '16px' }}>
        If you have any questions, feel free to reach out to our support team.
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

