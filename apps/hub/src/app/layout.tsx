import { routing } from '../i18n/routing'
import './globals.css'
import { Providers } from './providers'
import { getLocale, setRequestLocale } from 'next-intl/server'
import ReactLenis from 'lenis/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  setRequestLocale(locale)
  return (
    <html lang={locale}>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <ReactLenis root>{children}</ReactLenis>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
