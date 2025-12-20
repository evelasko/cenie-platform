import { Heading, Text } from '@react-email/components'

import type { EmailTemplate } from '../../core/types'
import { EmailButton } from '../components/button'
import { BaseLayout } from '../layouts/base'
import { EmailFooter } from '../layouts/footer'

export interface WelcomeEmailData {
  userName: string
  dashboardUrl: string
  appName: string
}

/**
 * Example welcome email template
 * Apps should copy and customize this for their branding
 */
export const WelcomeEmailExample: EmailTemplate<WelcomeEmailData> = {
  name: 'welcome-example',
  subject: (data) => `Welcome to ${data.appName}!`,
  component: ({ userName, dashboardUrl, appName, branding, typography, baseUrl }) => (
    <BaseLayout branding={branding} typography={typography} preview={`Welcome to ${appName}`}>
      <Heading
        style={{
          color: branding.primaryColor,
          fontFamily: typography.headingFont,
          fontSize: '24px',
          fontWeight: typography.headingWeight,
          marginBottom: '24px',
        }}
      >
        Welcome to {appName}!
      </Heading>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '16px' }}>
        Hi {userName},
      </Text>

      <Text style={{ fontFamily: typography.bodyFont, marginBottom: '24px' }}>
        We're excited to have you on board. Your account is now active and ready to use.
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
          from: { name: '', email: '' },
          footer: {
            organizationName: 'CENIE Platform',
          },
        }}
      />
    </BaseLayout>
  ),
}
