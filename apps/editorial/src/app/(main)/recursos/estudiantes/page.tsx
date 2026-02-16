import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Para Estudiantes',
  description:
    'Recursos para estudiantes de artes escénicas. Acceso académico, guías de estudio, herramientas de citación y tarifas especiales en CENIE Editorial.',
  alternates: {
    canonical: '/recursos/estudiantes',
  },
}

export default function EstudiantesPage() {
  return (
    <div>
      <h1>Estudiantes</h1>
    </div>
  )
}
