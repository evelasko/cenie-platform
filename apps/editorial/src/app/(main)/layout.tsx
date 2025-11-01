import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { footerNavigation, legalNavigation, navigation } from '@/lib/navigation'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar navigationItems={navigation} />
      {children}
      <Footer navigationSections={footerNavigation} legalLinks={legalNavigation} />
    </>
  )
}
