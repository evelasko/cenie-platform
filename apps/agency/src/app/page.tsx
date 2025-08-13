import { type Metadata } from 'next'
import AgencyComingSoon from './coming-soon'

export const metadata: Metadata = {
  title: 'CENIE Automation Agency | AI for the Performing Arts - Coming Soon',
  description: 'Launching September 2025. The CENIE Automation Agency offers bespoke AI and automation consulting to solve operational challenges for the performing arts industry. Sign up for exclusive updates.',
  keywords: 'performing arts technology, theatre automation, AI for arts, machine learning for theatre, production scheduling software, arts administration tools, CENIE',
  authors: [{ name: 'CENIE Automation Agency' }],
  creator: 'CENIE Automation Agency',
  publisher: 'CENIE Automation Agency',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://agency.cenie.org',
  },
}

export default function AgencyHomePage() {
  return <AgencyComingSoon />
}