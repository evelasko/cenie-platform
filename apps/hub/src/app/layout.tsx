import './globals.css'
import { Providers } from './providers'
import NavBar from '../components/navigation/NavBar'

const navigationItems = [
  { label: 'learn', href: '/aprende' },
  { label: 'innovate', href: '/innovate' },
  { label: 'optimize', href: '/optimize' },
  { label: 'insights', href: '/insights' },
  { label: 'about', href: '/about' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <NavBar items={navigationItems} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
