import './globals.css'
import { Providers } from './providers'
import NavBar from '../components/navigation/NavBar'

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
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
