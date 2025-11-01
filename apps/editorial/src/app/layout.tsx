import './globals.css'
import ReactLenis from 'lenis/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-serif antialiased">
        <Providers>
          <ReactLenis root>{children}</ReactLenis> <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
