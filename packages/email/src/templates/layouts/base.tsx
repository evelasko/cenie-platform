import { Body, Container, Head, Html, Preview } from '@react-email/components'
import type { ReactNode } from 'react'

import type { EmailBrandConfig } from '../../core/types'

interface BaseLayoutProps {
  branding: EmailBrandConfig['branding']
  typography: EmailBrandConfig['typography']
  footer?: ReactNode
  preview?: string
  children: ReactNode
}

export const BaseLayout = ({
  branding,
  typography,
  footer,
  preview,
  children,
}: BaseLayoutProps) => {
  return (
    <Html>
      <Head>
        {/* Preview text (shown in inbox) */}
        {preview && <Preview>{preview}</Preview>}

        {/* Custom fonts */}
        <link rel="stylesheet" href="https://use.typekit.net/rnn4nzl.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Email styles */}
        <style>{`
          body {
            font-family: ${typography.bodyFont}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: ${branding.backgroundColor};
            color: ${branding.textColor};
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: ${typography.headingFont}, serif;
            font-weight: ${typography.headingWeight};
            margin: 0 0 16px 0;
            color: ${branding.textColor};
          }

          p {
            font-family: ${typography.bodyFont}, sans-serif;
            font-weight: ${typography.bodyWeight};
            line-height: 1.6;
            margin: 0 0 16px 0;
          }

          a {
            color: ${branding.primaryColor};
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          /* Email client resets */
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          img {
            max-width: 100%;
            height: auto;
            border: 0;
            display: block;
          }

          /* Outlook-specific fixes */
          .outlook-fix {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
        `}</style>
      </Head>
      <Body style={{ backgroundColor: branding.backgroundColor, margin: 0, padding: 0 }}>
        {/* Main container - 600px max width for email compatibility */}
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px 20px',
          }}
        >
          {children}

          {footer && (
            <div style={{ marginTop: '40px', borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
              {footer}
            </div>
          )}
        </Container>
      </Body>
    </Html>
  )
}
