import './globals.css'
import { Geist } from 'next/font/google'
import { Providers } from './providers'
import ReactLenis from 'lenis/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.className}>
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
