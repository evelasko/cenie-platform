import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

export interface WelcomeEmailData {
  userName: string
  dashboardUrl: string
}

export const EditorialWelcomeEmail: EmailTemplate<WelcomeEmailData> = {
  name: 'editorial-welcome',
  subject: 'Welcome to CENIE Editorial',
  component: ({ userName, dashboardUrl, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview="Welcome to CENIE Editorial">
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
        We are delighted to welcome you to CENIE Editorial. Your account is now active and ready
        to use. You can access our academic publishing platform, submit articles, and explore our
        catalog of scholarly works.
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <EmailButton href={dashboardUrl} primaryColor={branding.primaryColor}>
          Go to Dashboard
        </EmailButton>
      </div>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '16px' }}>
        If you have any questions, please do not hesitate to contact our support team.
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

