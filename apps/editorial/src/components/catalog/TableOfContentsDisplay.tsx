import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import type { TableOfContents } from '@/types/books'

interface TableOfContentsDisplayProps {
  toc: TableOfContents
}

export function TableOfContentsDisplay({ toc }: TableOfContentsDisplayProps) {
  if (!toc || !toc.chapters || toc.chapters.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className={clsx(TYPOGRAPHY.h3, 'text-black mb-6')}>Tabla de Contenidos</h2>

      <ol className="space-y-4">
        {toc.chapters.map((chapter, index) => (
          <li key={index} className="space-y-2">
            {/* Chapter */}
            <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
              <div className="flex-1">
                <span className={clsx(TYPOGRAPHY.bodyBase, 'font-medium text-black')}>
                  {chapter.number && `Capítulo ${chapter.number}: `}
                  {chapter.title}
                </span>
              </div>
              {chapter.page ? (
                chapter.page !== 0 ? (
                  <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 ml-4')}>
                    {chapter.page > 0 && chapter.page}
                  </span>
                ) : (
                  <span>_</span>
                )
              ) : (
                <div />
              )}
            </div>

            {/* Sections (if exists) */}
            {chapter.sections && chapter.sections.length > 0 && (
              <ol className="ml-6 space-y-1">
                {chapter.sections.map((section, sectionIndex) => (
                  <li key={sectionIndex} className="flex justify-between items-baseline">
                    <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/80')}>
                      {section.title}
                    </span>
                    {section.page && (
                      <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 ml-4')}>
                        {section.page > 0 ? section.page : ''}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
