import './globals.css'
import ReactLenis from 'lenis/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Providers } from './providers'
import { CookieConsent } from '@/components/CookieConsent'
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from '@/lib/structured-data'

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://editorial.cenie.org'
  ),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = generateOrganizationJsonLd()
  const webSiteJsonLd = generateWebSiteJsonLd()

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd).replace(/</g, '\u003c'),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-serif antialiased">
        <Providers>
          <ReactLenis root>{children}</ReactLenis>
          {/*
           * Vercel Analytics and Speed Insights are GDPR-compliant by default —
           * they do not use cookies or collect PII. They are intentionally NOT
           * gated behind cookie consent.
           * See: https://vercel.com/docs/analytics/privacy-policy
           */}
          <Analytics />
          <SpeedInsights />
        </Providers>
        <CookieConsent />
      </body>
    </html>
  )
}
