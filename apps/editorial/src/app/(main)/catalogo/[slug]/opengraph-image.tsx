import { ImageResponse } from 'next/og'
import { createStaticClient } from '@cenie/supabase/static'
import { getBookCoverUrl } from '@/lib/twicpics'
import { getCoverPlaceholderUrl } from '@/lib/cover-placeholder'

// Standard OG image dimensions
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export const alt = 'CENIE Editorial - Libro'

async function getVolumeForOg(slug: string) {
  const supabase = createStaticClient()

  const { data: volume, error } = await supabase
    .from('catalog_volumes')
    .select('title, authors_display, cover_url, cover_fallback_url, cover_twicpics_path')
    .eq('slug', slug)
    .eq('publication_status', 'published')
    .single()

  if (error || !volume) {
    return null
  }

  const coverUrl =
    (volume as { cover_url?: string }).cover_url ||
    (volume as { cover_fallback_url?: string }).cover_fallback_url ||
    ((volume as { cover_twicpics_path?: string }).cover_twicpics_path
      ? getBookCoverUrl((volume as { cover_twicpics_path: string }).cover_twicpics_path, 'large')
      : null) ||
    getCoverPlaceholderUrl()

  return {
    title: (volume as { title: string }).title,
    authors: (volume as { authors_display?: string }).authors_display || 'CENIE Editorial',
    coverUrl,
  }
}

/**
 * Dynamic OG image for book/catalog pages.
 * Shows book cover, title, author(s), and CENIE Editorial branding.
 */
export default async function BookOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const volume = await getVolumeForOg(slug)

  if (!volume) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            fontFamily: 'Georgia, serif',
          }}
        >
          <div style={{ fontSize: 48, color: '#1a1a1a' }}>CENIE Editorial</div>
          <div style={{ fontSize: 24, color: '#6b7280', marginTop: 16 }}>
            Volumen no encontrado
          </div>
        </div>
      ),
      { ...size }
    )
  }

  const { title, authors, coverUrl } = volume

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: '#ffffff',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Left: Book cover or placeholder */}
        <div
          style={{
            width: 420,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt=""
            width={280}
            height={420}
            style={{
              objectFit: 'cover',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          />
        </div>

        {/* Right: Title, author, branding */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 400,
                color: '#1a1a1a',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                display: 'flex',
                maxHeight: 126,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 300,
                color: '#6b7280',
              }}
            >
              {authors}
            </div>
          </div>

          {/* Branding footer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div
              style={{
                width: 48,
                height: 4,
                background: '#c4762d',
              }}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: '#2d3a5e',
                letterSpacing: '0.05em',
              }}
            >
              CENIE EDITORIAL
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
