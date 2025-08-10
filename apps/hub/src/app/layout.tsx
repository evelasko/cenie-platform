import './globals.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CENIE - Centro de Estudios en Nuevas Inteligencias y Economías',
  description: 'Institutional hub for CENIE platform - connecting innovation, education, and research in emerging economies and artificial intelligence.',
  keywords: 'CENIE, artificial intelligence, economics, research, education, innovation',
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