import { type Metadata } from 'next'
import AgencyComingSoon from './coming-soon'

export const metadata: Metadata = {
  title: 'Agencia de Automatización del CENIE | IA para las Artes Escénicas - Próximamente',
  description: 'Lanzamiento en septiembre de 2025. La Agencia de Automatización del CENIE ofrece consultoría personalizada en IA y automatización para resolver desafíos operativos de la industria de las artes escénicas. Inscríbase para recibir actualizaciones exclusivas.',
  keywords: 'tecnología para artes escénicas, automatización teatral, IA para artes, aprendizaje automático para teatro, software de programación de producción, herramientas de administración artística, CENIE',
  authors: [{ name: 'Agencia de Automatización del CENIE' }],
  creator: 'Agencia de Automatización del CENIE',
  publisher: 'Agencia de Automatización del CENIE',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://agency.cenie.org',
  },
}

export default function AgencyHomePage() {
  return <AgencyComingSoon />
}