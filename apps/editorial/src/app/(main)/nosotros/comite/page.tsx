import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comité Editorial',
  description:
    'Conoce al comité editorial de CENIE Editorial. Expertos en artes escénicas, teatro y danza que garantizan los más altos estándares académicos.',
  alternates: {
    canonical: '/nosotros/comite',
  },
}

export default function ComitePage() {
  return (
    <div>
      <h1>Comite</h1>
    </div>
  )
}
