import { type Metadata } from 'next'
import EditorialComingSoon from './coming-soon'

export const metadata: Metadata = {
  title: 'CENIE Editorial | AI-Enhanced Academic Publishing for the Performing Arts | Coming Soon',
  description: 'Launching September 2025. CENIE Editorial is a digital-first academic press for theatre and performance studies, offering AI-native publications, Spanish translations, and rigorous peer review to accelerate research and teaching.',
  keywords: 'academic publishing, performing arts, theatre studies, dance studies, performance studies, AI in research, scholarly publishing, Spanish translation, digital humanities, peer review, open access, RAG, large language models',
  authors: [{ name: 'CENIE Editorial' }],
  creator: 'CENIE Editorial',
  publisher: 'CENIE Editorial',
  robots: 'index, follow',
  openGraph: {
    title: 'CENIE Editorial | AI-Enhanced Academic Publishing for the Performing Arts | Coming Soon',
    description: 'Launching September 2025. CENIE Editorial is a digital-first academic press for theatre and performance studies, offering AI-native publications, Spanish translations, and rigorous peer review.',
    url: 'https://editorial.cenie.org',
    siteName: 'CENIE Editorial',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://editorial.cenie.org',
  },
 }

export default function EditorialHomePage() {
  return <EditorialComingSoon />
}
