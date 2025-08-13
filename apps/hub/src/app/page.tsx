import { Metadata } from 'next'
import HubComingSoon from './coming-soon'

export const metadata: Metadata = {
  title: 'CENIE | The Future of Performing Arts | Launching September 2025',
  description: 'CENIE is a comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms. Join us in shaping the future of performance.',
  keywords: 'performing arts, technology, AI in arts, virtual reality, artistic innovation, artist education, production management software, academic publishing, Spanish-speaking artists',
  openGraph: {
    title: 'CENIE | The Future of Performing Arts | Launching September 2025',
    description: 'CENIE is a comprehensive ecosystem empowering performing artists and organizations with AI-powered tools, specialized education, and collaborative platforms. Join us in shaping the future of performance.',
    url: 'https://cenie.org',
    siteName: 'CENIE',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://cenie.org'
  }
}


export default function HubHomePage() {
  return <HubComingSoon />
}