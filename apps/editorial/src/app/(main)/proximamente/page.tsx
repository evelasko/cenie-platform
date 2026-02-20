import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageContainer, PageHero, Section } from '@/components/content'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import ProximamenteContent from './proximamente-content'

export const metadata: Metadata = {
  title: 'Próximamente',
  description:
    'Descubre las próximas publicaciones de CENIE Editorial. Traducciones y obras originales en preparación sobre teatro, danza y artes escénicas.',
  alternates: {
    canonical: '/proximamente',
  },
}

export default function ProximamentePage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <PageHero
            title="Próximamente"
            subtitle="Publicaciones en preparación. Descubre las traducciones y obras originales que pronto estarán disponibles."
          />
          <Section spacing="lg">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>Cargando...</p>
            </div>
          </Section>
        </PageContainer>
      }
    >
      <ProximamenteContent />
    </Suspense>
  )
}
