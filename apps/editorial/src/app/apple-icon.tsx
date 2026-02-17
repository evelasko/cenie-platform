import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple touch icon for CENIE Editorial. Used when bookmarking on iOS.
 * Renders the full Editorial logo (180x180) with brand colors.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#003f5a',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ff3637"
            d="M151.51 127.51h-.01c-10.3-2.49-17.94-11.77-17.94-22.83V88.09c0-24.06-19.49-43.56-43.55-43.56s-43.56 19.5-43.56 43.56v16.5c0 11.02-7.51 20.27-17.76 22.8-.06.02-.13.03-.19.05V88.09c0-2.12.11-4.21.32-6.28 3.14-31.02 29.34-55.23 61.19-55.23s58.1 24.26 61.2 55.33c.2 2.03.31 4.09.31 6.18v39.42ZM28.5 135.44h122.99v17.98H28.5z"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
