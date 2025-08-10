import './globals.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CENIE Academy - Educational Platform',
  description: 'Educational courses and programs focused on emerging technologies, artificial intelligence, and innovative economics.',
  keywords: 'education, courses, AI, technology, economics, innovation, CENIE',
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