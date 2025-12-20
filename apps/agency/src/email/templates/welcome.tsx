import { Heading, Text } from '@react-email/components'
import type { EmailTemplate } from '@cenie/email'
import { EmailButton } from '@cenie/email/templates/components/button'
import { BaseLayout } from '@cenie/email/templates/layouts/base'
import { EmailFooter } from '@cenie/email/templates/layouts/footer'

export interface WelcomeEmailData {
  userName: string
  dashboardUrl: string
}

export const AgencyWelcomeEmail: EmailTemplate<WelcomeEmailData> = {
  name: 'agency-welcome',
  subject: 'Welcome to CENIE AGENCY',
  component: ({ userName, dashboardUrl, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview="Welcome to CENIE AGENCY">
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '28px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Welcome to CENIE AGENCY
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, fontSize: '16px', marginBottom: '16px' }}>
        Hello {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, lineHeight: '1.6', marginBottom: '24px' }}>
        We're excited to have you join CENIE AGENCY! Your account is now active and ready to use.
        Explore our automation services, browse our software catalog, and discover solutions to
        streamline your business operations.
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
          from: { name: 'CENIE AGENCY', email: 'noreply@agency.cenie.org' },
          footer: {
            organizationName: 'CENIE AGENCY',
            unsubscribeUrl: 'https://agency.cenie.org/unsubscribe',
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

