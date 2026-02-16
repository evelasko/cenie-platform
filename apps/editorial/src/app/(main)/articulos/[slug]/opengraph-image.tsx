import { ImageResponse } from 'next/og'
import { getContentBySlug } from '@/lib/mdx'
import type { ArticleFrontmatter } from '@/lib/mdx'

// Standard OG image dimensions
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export const alt = 'CENIE Editorial - Artículo'

/**
 * Dynamic OG image for article pages.
 * Shows title, author, category, and CENIE Editorial branding.
 */
export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getContentBySlug<ArticleFrontmatter>('articles', slug)

  if (!article) {
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
            Artículo no encontrado
          </div>
        </div>
      ),
      { ...size }
    )
  }

  const { title, author, category } = article.frontmatter

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Decorative accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#c4762d',
          }}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 56,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {category && (
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#c4762d',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </div>
            )}
            <div
              style={{
                fontSize: 48,
                fontWeight: 400,
                color: '#1a1a1a',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                display: 'flex',
                maxHeight: 144,
                overflow: 'hidden',
              }}
            >
              {title}
            </div>
            {author && (
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 300,
                  color: '#6b7280',
                }}
              >
                {author}
              </div>
            )}
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
