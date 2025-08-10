import './globals.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CENIE Learn - Learning Management System',
  description: 'Comprehensive LMS for tracking progress, managing educational content, and facilitating interactive learning experiences.',
  keywords: 'LMS, learning management, progress tracking, education, interactive learning, CENIE',
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