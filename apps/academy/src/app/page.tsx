import { type Metadata } from 'next'
import ComingSoon from './coming-soon'

export const metadata: Metadata = {
  title: 'Academia CENIE | Capacitando a Artistas | Lanzamiento en septiembre de 2025',
  description: '¡La Academia CENIE llega en septiembre de 2025! Una escuela especializada para artistas escénicos para dominar la tecnología, las finanzas y los negocios. Inscríbase para recibir actualizaciones exclusivas.',
  keywords: 'Academia CENIE, formación en artes escénicas, desarrollo profesional de artistas, artes y tecnología, educación financiera para artistas, cursos de gestión teatral, educación en artes digitales, emprendimiento artístico',
  authors: [{ name: 'Academia CENIE' }],
  creator: 'Academia CENIE',
  publisher: 'Academia CENIE',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://academy.cenie.org',
  },
}

export default function AcademyHomePage() {
  return <ComingSoon />
}