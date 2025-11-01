import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { Globe } from 'lucide-react'

interface TranslationInfoProps {
  originalTitle: string
  originalLanguage?: string
  originalPublisher?: string
  originalPublicationYear?: number
  translationYear?: number
  translator?: string
}

export function TranslationInfo({
  originalTitle,
  originalLanguage,
  originalPublisher,
  originalPublicationYear,
  translationYear,
  translator,
}: TranslationInfoProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-none p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className={clsx(TYPOGRAPHY.h4, 'text-black')}>Sobre la Obra Original</h3>
      </div>

      <div className="space-y-2">
        {/* Original Title */}
        <div>
          <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 font-medium')}>
            Título original:
          </span>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black')}>{originalTitle}</p>
        </div>

        {/* Original Language */}
        {originalLanguage && (
          <div>
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 font-medium')}>
              Idioma original:
            </span>
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black')}>
              {originalLanguage === 'en' ? 'Inglés' : originalLanguage.toUpperCase()}
            </p>
          </div>
        )}

        {/* Original Publisher & Year */}
        {(originalPublisher || originalPublicationYear) && (
          <div>
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 font-medium')}>
              Publicación original:
            </span>
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black')}>
              {originalPublisher && originalPublisher}
              {originalPublisher && originalPublicationYear && ', '}
              {originalPublicationYear}
            </p>
          </div>
        )}

        {/* Translator */}
        {translator && (
          <div>
            <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 font-medium')}>
              Traducción:
            </span>
            <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black')}>
              {translator}
              {translationYear && ` (${translationYear})`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

