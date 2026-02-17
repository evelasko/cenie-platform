import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CENIE Editorial',
    short_name: 'CENIE Editorial',
    description:
      'Publicaciones académicas y científicas de CENIE. Catálogo de libros, artículos y recursos editoriales.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#003f5a',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
