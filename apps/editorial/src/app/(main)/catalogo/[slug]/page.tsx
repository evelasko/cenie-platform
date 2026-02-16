import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createStaticClient } from '@cenie/supabase/static'
import { getBookCoverUrl } from '@/lib/twicpics'
import { logger } from '@/lib/logger'
import { PageContainer, Section, Prose } from '@/components/content'
import BooksGrid from '@/components/sections/BooksGrid'
import { VolumeHero } from '@/components/catalog/VolumeHero'
import { MarkdownContent } from '@/components/catalog/MarkdownContent'
import { TableOfContentsDisplay } from '@/components/catalog/TableOfContentsDisplay'
import { TranslationInfo } from '@/components/catalog/TranslationInfo'
import BookPraiseItem from '@/components/items/BookPraiseItem'
import BookForeword from '@/components/sections/BookForeword'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { generateBookJsonLd } from '@/lib/structured-data'
import type { CatalogVolume } from '@/types/books'
import type { bookData } from '@/components/sections/BooksGrid'

export async function generateStaticParams() {
  const supabase = createStaticClient()

  const { data: volumes, error } = await supabase
    .from('catalog_volumes')
    .select('slug')
    .eq('publication_status', 'published')
    .not('slug', 'is', null)

  if (error) {
    logger.error('Failed to generate static params for catalog', { error })
    return []
  }

  return (volumes as { slug: string }[]).map((v) => ({ slug: v.slug }))
}

interface VolumeContributor {
  contributor_id: string
  full_name: string
  role: string
  bio_es?: string
  photo_url?: string
}

function enrichCoverUrl(volume: Record<string, unknown>): Record<string, unknown> {
  if (!volume.cover_url && volume.cover_twicpics_path) {
    return {
      ...volume,
      cover_url: getBookCoverUrl(volume.cover_twicpics_path as string, 'medium'),
    }
  }
  return volume
}

async function getVolumeData(slug: string) {
  const supabase = createStaticClient()

  const { data: volume, error: volumeError } = await supabase
    .from('catalog_volumes')
    .select('*')
    .eq('slug', slug)
    .eq('publication_status', 'published')
    .single()

  if (volumeError) {
    if (volumeError.code === 'PGRST116') {
      return null
    }
    logger.error('Database error fetching volume', { error: volumeError, slug })
    return null
  }

  const { data: contributors, error: contributorsError } = await supabase.rpc(
    'get_volume_contributors' as any,
    { volume_uuid: (volume as any).id } as any
  )

  if (contributorsError) {
    logger.error('Contributors fetch error', { error: contributorsError, slug })
  }

  let relatedVolumes: any[] = []
  if ((volume as any).categories && (volume as any).categories.length > 0) {
    const { data: related } = await supabase
      .from('catalog_volumes')
      .select(
        'id, title, subtitle, slug, authors_display, cover_url, cover_twicpics_path, cover_fallback_url, publication_year, categories'
      )
      .eq('publication_status', 'published')
      .overlaps('categories', (volume as any).categories)
      .neq('id', (volume as any).id)
      .limit(5)

    relatedVolumes = (related || []).map(enrichCoverUrl)
  }

  return {
    volume: enrichCoverUrl(volume as Record<string, unknown>) as unknown as CatalogVolume,
    contributors: (contributors || []) as VolumeContributor[],
    related: relatedVolumes as CatalogVolume[],
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getVolumeData(slug)

  if (!data) {
    return { title: 'Volumen no encontrado | CENIE Editorial' }
  }

  const { volume } = data
  const pageTitle = `${volume.title} | CENIE Editorial`
  const pageDescription = volume.seo_description || volume.description?.substring(0, 160)

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: volume.seo_keywords?.length ? volume.seo_keywords : undefined,
    alternates: {
      canonical: `/catalogo/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: 'book' as const,
      // Dynamic OG image from opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      // Dynamic OG image from opengraph-image.tsx
    },
    other: {
      ...(volume.isbn_13 ? { 'book:isbn': volume.isbn_13 } : {}),
      ...(volume.authors_display ? { 'book:author': volume.authors_display } : {}),
      ...(volume.publication_year
        ? { 'book:release_date': volume.publication_year.toString() }
        : {}),
    },
  }
}

export default async function VolumePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getVolumeData(slug)

  if (!data) {
    notFound()
  }

  const { volume, contributors, related } = data

  const authors = contributors.filter((c) => c.role === 'author')
  const translators = contributors.filter((c) => c.role === 'translator')

  const relatedBooks: bookData[] = related.map((v) => ({
    title: v.title,
    author: v.authors_display || 'CENIE Editorial',
    coverSrc: v.cover_url || v.cover_fallback_url || '/images/placeholder-cover.jpg',
    link: `/catalogo/${v.slug}`,
  }))

  const bookJsonLd = generateBookJsonLd(volume)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookJsonLd).replace(/</g, '\u003c'),
        }}
      />
      {/* Hero Section */}
      <VolumeHero
        title={volume.title}
        subtitle={volume.subtitle || undefined}
        authors={volume.authors_display || 'CENIE Editorial'}
        translator={volume.translator_display || undefined}
        coverUrl={volume.cover_url || volume.cover_fallback_url || '/images/placeholder-cover.jpg'}
        publicationYear={volume.publication_year || undefined}
        isbn={volume.isbn_13 || volume.isbn_10 || undefined}
        pageCount={volume.page_count || undefined}
        publisher={volume.publisher_name}
        accessLink="/recursos/acceso"
      />

      <PageContainer>
        {/* Description */}
        {volume.description && (
          <Section spacing="large">
            <Prose>
              <MarkdownContent content={volume.description} />
            </Prose>
          </Section>
        )}

        {/* Table of Contents */}
        {volume.table_of_contents && (
          <Section spacing="large">
            <TableOfContentsDisplay toc={volume.table_of_contents} />
          </Section>
        )}

        {/* Excerpt */}
        {volume.excerpt && (
          <Section spacing="large">
            <BookForeword quote="Fragmento" foreword={volume.excerpt} />
          </Section>
        )}

        {/* Translation Info (only for translated books) */}
        {volume.volume_type === 'translated' && volume.original_title && (
          <Section spacing="large">
            <TranslationInfo
              originalTitle={volume.original_title}
              originalLanguage={volume.original_language || undefined}
              originalPublisher={volume.original_publisher || undefined}
              originalPublicationYear={volume.original_publication_year || undefined}
              translationYear={volume.translation_year || undefined}
              translator={volume.translator_display || undefined}
            />
          </Section>
        )}

        {/* Reviews/Praise */}
        {volume.reviews_quotes && volume.reviews_quotes.length > 0 && (
          <Section spacing="large">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Elogios y Reseñas</h2>
            <div className="space-y-4">
              {volume.reviews_quotes.map((quote, index) => (
                <BookPraiseItem key={index} text={quote.text} author={quote.source} />
              ))}
            </div>
          </Section>
        )}

        {/* Contributors Bios */}
        {authors.length > 0 && authors.some((a) => a.bio_es) && (
          <Section spacing="large">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Sobre los Autores</h2>
            <div className="space-y-6">
              {authors
                .filter((a) => a.bio_es)
                .map((author) => (
                  <div key={author.contributor_id}>
                    <h3 className={clsx(TYPOGRAPHY.h4, 'text-black mb-2')}>{author.full_name}</h3>
                    <MarkdownContent
                      content={author.bio_es ?? ''}
                      className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80 [&_p]:my-2')}
                    />
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* Translator Bios */}
        {translators.length > 0 && translators.some((t) => t.bio_es) && (
          <Section spacing="large">
            <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Sobre los Traductores</h2>
            <div className="space-y-6">
              {translators
                .filter((t) => t.bio_es)
                .map((translator) => (
                  <div key={translator.contributor_id}>
                    <h3 className={clsx(TYPOGRAPHY.h4, 'text-black mb-2')}>
                      {translator.full_name}
                    </h3>
                    <MarkdownContent
                      content={translator.bio_es ?? ''}
                      className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80 [&_p]:my-2')}
                    />
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* Related Volumes */}
        {relatedBooks.length > 0 && (
          <Section spacing="large">
            <BooksGrid title="Publicaciones Relacionadas" books={relatedBooks} overflow={true} />
          </Section>
        )}
      </PageContainer>
    </>
  )
}
