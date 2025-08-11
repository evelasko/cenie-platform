import './globals.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CENIE Agency - Automation Services & Software Solutions',
  description: 'Digital transformation partner specializing in automation solutions, custom software development, and AI-powered systems.',
  keywords: 'automation, software development, AI solutions, APIs, digital transformation, custom apps, CENIE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}