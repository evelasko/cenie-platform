import { ImageResponse } from 'next/og'

// Standard OG image dimensions
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export const alt = 'CENIE Editorial - Publicaciones académicas y científicas'

/**
 * Default OG image for homepage and static pages.
 * Shows CENIE Editorial branding and tagline.
 */
export default async function DefaultOgImage() {
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Decorative accent line */}
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            padding: 80,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 400,
              color: '#2d3a5e',
              letterSpacing: '-0.02em',
            }}
          >
            CENIE
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#c4762d',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Editorial
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: '#6b7280',
              marginTop: 16,
              textAlign: 'center',
              maxWidth: 600,
            }}
          >
            Publicaciones académicas y científicas
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
