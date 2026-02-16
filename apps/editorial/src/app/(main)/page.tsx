import { type Metadata } from 'next'
import EditorialComingSoon from './coming-soon'

export const metadata: Metadata = {
  title:
    'CENIE Editorial | Edición académica mejorada con IA para las artes escénicas | Próximamente',
  description:
    'Lanzamiento en septiembre de 2025. CENIE Editorial es una imprenta académica digital para estudios de teatro y performance, que ofrece publicaciones nativas, traducciones al español y una rigurosa revisión por pares para acelerar la investigación y la enseñanza.',
  keywords:
    'edición académica, artes escénicas, estudios teatrales, estudios de danza, estudios de interpretación, IA en la investigación, edición académica, traducción al español, humanidades digitales, revisión por pares, acceso abierto, GAR, grandes modelos lingüísticos',
  authors: [{ name: 'CENIE Editorial' }],
  creator: 'CENIE Editorial',
  publisher: 'CENIE Editorial',
  robots: 'index, follow',
  openGraph: {
    title:
      'CENIE Editorial | Edición académica mejorada con IA para las artes escénicas | Próximamente',
    description:
      'Lanzamiento en septiembre de 2025. CENIE Editorial es una imprenta académica digital para estudios de teatro y performance, que ofrece publicaciones nativas, traducciones al español y una rigurosa revisión por pares.',
    url: 'https://editorial.cenie.org',
    siteName: 'CENIE Editorial',
    type: 'website',
    locale: 'es_ES',
  },
  alternates: {
    canonical: '/',
  },
}

export default function EditorialHomePage() {
  return <EditorialComingSoon />
}
