import Image from 'next/image'
import Link from 'next/link'
import type { Frontmatter } from '@/lib/mdx'

interface ContentCardProps {
  slug: string
  frontmatter: Frontmatter
  readingTime: string
  type: 'article' | 'news'
}

export function ContentCard({ slug, frontmatter, readingTime, type }: ContentCardProps) {
  const basePath = type === 'article' ? '/articulos' : '/noticias'
  const formattedDate = new Date(frontmatter.publishedDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="group relative flex flex-col border border-border rounded-lg overflow-hidden bg-background hover:shadow-lg transition-all duration-300">
      {/* Cover Image */}
      {frontmatter.coverImage && (
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.coverImageAlt || frontmatter.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {frontmatter.featured && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Destacado
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category */}
        {frontmatter.category && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {frontmatter.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="type-heading-4 mb-3 group-hover:text-primary transition-colors">
          <Link href={`${basePath}/${slug}`} className="after:absolute after:inset-0">
            {frontmatter.title}
          </Link>
        </h2>

        {/* Description */}
        {frontmatter.description && (
          <p className="type-body-base text-muted-foreground mb-4 line-clamp-3">
            {frontmatter.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground type-body-small">
            {'author' in frontmatter && frontmatter.author && (
              <span className="font-medium text-foreground">{frontmatter.author}</span>
            )}
            <time dateTime={frontmatter.publishedDate}>{formattedDate}</time>
            <span>{readingTime} de lectura</span>
          </div>

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
