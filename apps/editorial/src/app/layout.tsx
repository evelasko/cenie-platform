import './globals.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CENIE Editorial - Academic Publishing Platform',
  description: 'Academic publishing platform with AI-powered translation services for research dissemination and scholarly communication.',
  keywords: 'academic publishing, research, AI translation, scholarly communication, CENIE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-serif antialiased">
        {children}
      </body>
    </html>
  )
}