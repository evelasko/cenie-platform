import './globals.css'
import { Providers } from './providers'
import NavBar from '../components/navigation/NavBar'
import ReactLenis from 'lenis/react'
import { mainNavigationItems } from '../constants/navigation'
import BottomEdge from '../components/layouts/BottomEdge'
import Footer from '../components/navigation/Footer'
import BottomBlurFrame from '../components/decorations/BottomBlurFrame'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <NavBar items={mainNavigationItems} />
          {/* Main body content */}
          <ReactLenis root>{children}</ReactLenis>
          <Footer />
          <BottomEdge />
          {/* Bottom Blur Frame Component */}
          <BottomBlurFrame />
        </Providers>
      </body>
    </html>
  )
}
