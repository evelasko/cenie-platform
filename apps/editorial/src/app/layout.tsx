import './globals.css'
import ReactLenis from 'lenis/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Providers } from './providers'
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from '@/lib/structured-data'

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
          <ReactLenis root>{children}</ReactLenis> <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
