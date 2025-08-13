import { type Metadata } from 'next'
import ComingSoon from './coming-soon'

export const metadata: Metadata = {
  title: 'CENIE Academy | Empowering Artists | Launching September 2025',
  description: 'The CENIE Academy is coming in September 2025! A specialized school for performing artists to master technology, finance, and business. Sign up for exclusive updates.',
  keywords: 'CENIE Academy, performing arts training, artist professional development, arts and technology, financial literacy for artists, theatre management courses, digital arts education, arts entrepreneurship',
  authors: [{ name: 'CENIE Academy' }],
  creator: 'CENIE Academy',
  publisher: 'CENIE Academy',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://academy.cenie.org',
  },
}

export default function AcademyHomePage() {
  return <ComingSoon />
}