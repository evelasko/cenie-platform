import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { footerNavigation, legalNavigation, navigation } from '@/lib/navigation'

export const metadata: Metadata = {
  title: { template: '%s | CENIE Editorial', default: 'CENIE Editorial' },
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar navigationItems={navigation} />
      {children}
      <Footer navigationSections={footerNavigation} legalLinks={legalNavigation} />
    </>
  )
}
