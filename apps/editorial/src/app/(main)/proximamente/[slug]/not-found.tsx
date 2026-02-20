import Link from 'next/link'
import { PageContainer, PageHero, Section } from '@/components/content'
import { TYPOGRAPHY } from '@/lib/typography'
import { clsx } from 'clsx'

export default function NotFound() {
  return (
    <PageContainer>
      <PageHero
        title="Publicación no encontrada"
        subtitle="La publicación próxima que buscas no existe o ya está disponible en el catálogo."
      />
      <Section spacing="lg">
        <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 text-center">
          <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-black/70 mb-8 max-w-xl')}>
            Es posible que esta publicación ya haya sido publicada o que la URL no sea correcta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/proximamente"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
              )}
            >
              Ver próximas publicaciones
            </Link>
            <Link
              href="/catalogo"
              className={clsx(
                TYPOGRAPHY.bodyBase,
                'px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              )}
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}
