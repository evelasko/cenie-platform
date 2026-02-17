import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createNextServerClient } from '@cenie/supabase/server'
import { getBookCoverUrl } from '@/lib/twicpics'
import { getCoverPlaceholder } from '@/lib/cover-placeholder'
import { logger } from '@/lib/logger'
import { PageContainer, Section, Prose } from '@/components/content'
import BooksGrid from '@/components/sections/BooksGrid'
import { VolumeHero } from '@/components/catalog/VolumeHero'
import { TableOfContentsDisplay } from '@/components/catalog/TableOfContentsDisplay'
import { TranslationInfo } from '@/components/catalog/TranslationInfo'
import BookPraiseItem from '@/components/items/BookPraiseItem'
import BookForeword from '@/components/sections/BookForeword'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { CatalogVolume } from '@/types/books'
import type { bookData } from '@/components/sections/BooksGrid'

interface VolumeContributor {
  contributor_id: string
  full_name: string
  role: string
  bio_es?: string
  photo_url?: string
}

async function getProximamenteVolumeData(slug: string) {
  const supabase = createNextServerClient()

  // Try SEO slug first (new format: e.g., "el-titulo-en-espanol")
  const { data: seoBook } = await supabase
    .from('books')
    .select('*')
    .eq('translation_slug', slug)
    .eq('selected_for_translation', true)
    .eq('promoted_to_catalog', false)
    .maybeSingle()

  // Fall back to legacy "book-{uuid}" format
  let bookData = seoBook
  if (!bookData && slug.startsWith('book-')) {
    const bookId = slug.replace(/^book-/, '')
    const { data: legacyBook } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .eq('selected_for_translation', true)
      .eq('promoted_to_catalog', false)
      .maybeSingle()

    bookData = legacyBook
  }

  if (bookData) {
    const b = bookData as Record<string, unknown>
    const displayTitle =
      (b.spanish_title as string) || (b.translated_title as string) || (b.title as string)
    const authors = (b.spanish_authors as string[]) || (b.authors as string[])
    const authorsDisplay = authors?.length ? authors.join(', ') : 'CENIE Editorial'
    const coverPath = b.temp_cover_twicpics_path as string | null
    const coverUrl = coverPath ? getBookCoverUrl(coverPath, 'medium') : null

    const volume = {
      id: b.id,
      title: displayTitle,
      subtitle: (b.spanish_subtitle as string) || (b.subtitle as string) || null,
      authors_display: authorsDisplay,
      description: (b.publication_description_es as string) || null,
      cover_url: coverUrl,
      cover_fallback_url: null,
      slug: (b.translation_slug as string) || `book-${b.id}`,
      publication_status: 'draft',
      volume_type: 'translated',
      original_title: b.title as string,
      original_language: (b.language as string) || 'en',
      original_publisher: null,
      original_publication_year: b.published_date
        ? parseInt(String(b.published_date).slice(0, 4))
        : null,
      table_of_contents: b.publication_table_of_contents as object | null,
      excerpt: b.publication_excerpt_es as string | null,
    } as unknown as CatalogVolume

    return { volume, contributors: [] as VolumeContributor[], related: [] as CatalogVolume[] }
  }

  // Catalog volume (draft)
  const { data: volume, error: volumeError } = await supabase
    .from('catalog_volumes')
    .select('*')
    .eq('slug', slug)
    .eq('publication_status', 'draft')
    .single()

  if (volumeError) {
    if (volumeError.code === 'PGRST116') {
      return null
    }
    logger.error('Database error fetching proximamente volume', { error: volumeError, slug })
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
        'id, title, subtitle, slug, authors_display, cover_url, cover_fallback_url, publication_year, categories'
      )
      .eq('publication_status', 'draft')
      .overlaps('categories', (volume as any).categories)
      .neq('id', (volume as any).id)
      .limit(5)

    relatedVolumes = related || []
  }

  return {
    volume: volume as unknown as CatalogVolume,
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
  const data = await getProximamenteVolumeData(slug)

  if (!data) {
    return { title: 'Volumen no encontrado' }
  }

  const { volume } = data
  const pageTitle = `${volume.title} | Próximamente`
  const pageDescription =
    volume.seo_description || volume.description?.substring(0, 160) || `Próximamente: ${volume.title}`
  const coverImage = volume.cover_url || volume.cover_fallback_url

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: volume.seo_keywords?.length ? volume.seo_keywords : undefined,
    alternates: {
      canonical: `/proximamente/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: 'book' as const,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: coverImage ? [coverImage] : undefined,
    },
    other: {
      ...(volume.isbn_13 ? { 'book:isbn': volume.isbn_13 } : {}),
      ...(volume.publication_year ? { 'book:release_date': volume.publication_year.toString() } : {}),
      ...(volume.authors_display ? { 'book:author': volume.authors_display } : {}),
    },
  }
}

export default async function ProximamenteVolumePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getProximamenteVolumeData(slug)

  if (!data) {
    notFound()
  }

  const { volume, contributors, related } = data

  const authors = contributors.filter((c) => c.role === 'author')
  const translators = contributors.filter((c) => c.role === 'translator')

  const relatedBooks: bookData[] = related.map((v) => ({
    title: v.title,
    author: v.authors_display || 'CENIE Editorial',
    coverSrc: v.cover_url || v.cover_fallback_url || getCoverPlaceholder(),
    link: `/proximamente/${v.slug}`,
  }))

  return (
    <>
      {/* Hero - no access link for upcoming books */}
      <VolumeHero
        title={volume.title}
        subtitle={volume.subtitle || undefined}
        authors={volume.authors_display || 'CENIE Editorial'}
        translator={volume.translator_display || undefined}
        coverUrl={volume.cover_url || volume.cover_fallback_url || getCoverPlaceholder()}
        publicationYear={volume.publication_year || undefined}
        isbn={volume.isbn_13 || volume.isbn_10 || undefined}
        pageCount={volume.page_count || undefined}
        publisher={volume.publisher_name}
      />

      {/* Próximamente badge */}
      <PageContainer>
        <Section spacing="normal">
          <div
            className={clsx(
              TYPOGRAPHY.h4,
              'inline-block px-4 py-2 bg-primary/10 text-primary rounded-full'
            )}
          >
            Próximamente disponible
          </div>
        </Section>
      </PageContainer>

      <PageContainer>
        {/* Description */}
        {volume.description && (
          <Section spacing="large">
            <Prose>
              <div dangerouslySetInnerHTML={{ __html: volume.description }} />
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

        {/* Translation Info */}
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
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>{author.bio_es}</p>
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
                    <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                      {translator.bio_es}
                    </p>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {/* Related Upcoming Volumes */}
        {relatedBooks.length > 0 && (
          <Section spacing="large">
            <BooksGrid title="Otras Próximas Publicaciones" books={relatedBooks} overflow={true} />
          </Section>
        )}
      </PageContainer>
    </>
  )
}
