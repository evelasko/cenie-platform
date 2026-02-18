import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createStaticClient } from '@cenie/supabase/static'
import { getBookCoverUrl } from '@/lib/twicpics'
import { PageContainer, PageHero, Section } from '@/components/content'
import { HeroFeaturedBook } from '@/components/sections/HeroFeaturedBook'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import CatalogoContent from './catalogo-content'
import type { CatalogVolume } from '@/types/books'

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Explora nuestra colección de publicaciones sobre artes escénicas. Traducciones y obras originales de investigación académica en teatro, danza y performance.',
  alternates: {
    canonical: '/catalogo',
  },
}

async function fetchHeroVolume(): Promise<CatalogVolume | null> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('catalog_volumes')
      .select('*')
      .eq('hero', true)
      .eq('publication_status', 'published')
      .single()

    if (error || !data) return null

    const volume = data as CatalogVolume
    // Enrich cover_url from TwicPics path if missing
    if (!volume.cover_url && volume.cover_twicpics_path) {
      volume.cover_url = getBookCoverUrl(volume.cover_twicpics_path, 'large')
    }
    return volume
  } catch {
    return null
  }
}

export default async function CatalogoPage() {
  const hero = await fetchHeroVolume()

  return (
    <>
      {hero && (
        <HeroFeaturedBook
          title={hero.title}
          authors={hero.authors_display ?? ''}
          coverUrl={hero.cover_url ?? null}
          catalogLink={`/catalogo/${hero.slug}`}
        />
      )}

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
    </>
  )
}
