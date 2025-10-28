import './globals.css'
import { Geist, Sora, IBM_Plex_Mono } from 'next/font/google'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import ReactLenis from 'lenis/react'

const geist = Geist({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-geist',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.className} ${sora.className} ${ibmPlexMono.className}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <ReactLenis root>{children}</ReactLenis>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
