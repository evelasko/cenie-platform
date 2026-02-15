import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageContainer, PageHero, Section } from '@/components/content'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import CatalogoContent from './catalogo-content'

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Explora nuestra colección de publicaciones sobre artes escénicas. Traducciones y obras originales de investigación académica en teatro, danza y performance.',
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <PageHero
            title="Catálogo CENIE Editorial"
            subtitle="Descubre nuestra colección de publicaciones y traducciones sobre artes escénicas"
          />
          <Section spacing="large">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/60')}>Cargando catálogo...</p>
            </div>
          </Section>
        </PageContainer>
      }
    >
      <CatalogoContent />
    </Suspense>
  )
}
