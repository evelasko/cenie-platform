import { ReactNode } from 'react'
import Image from 'next/image'
import { Prose } from './Prose'
import { SiteContainer } from '@/components/layout/SiteContainer'
import { GridLayout } from '@/components/layout/GridLayout'
import type { Frontmatter } from '@/lib/mdx'

interface ContentLayoutProps {
  frontmatter: Frontmatter
  readingTime: string
  children: ReactNode
  type?: 'article' | 'news'
}

export function ContentLayout({
  frontmatter,
  readingTime,
  children,
}: ContentLayoutProps) {
  const formattedDate = new Date(frontmatter.publishedDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <SiteContainer className="py-16">
          <GridLayout>
            <div className="content-narrow">
              {/* Category badge */}
              {frontmatter.category && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary">
                    {frontmatter.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="type-display-1 mb-6">{frontmatter.title}</h1>

              {/* Description */}
              {frontmatter.description && (
                <p className="type-lead text-muted-foreground mb-6">{frontmatter.description}</p>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground type-body-small">
                {'author' in frontmatter && frontmatter.author && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{frontmatter.author}</span>
                  </div>
                )}
                <time dateTime={frontmatter.publishedDate}>{formattedDate}</time>
                <span>{readingTime} de lectura</span>
              </div>

              {/* Tags */}
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-muted text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </GridLayout>
        </SiteContainer>
      </header>

      {/* Cover Image */}
      {frontmatter.coverImage && (
        <div className="w-full bg-muted">
          <SiteContainer>
            <GridLayout>
              <div className="content-standard">
                <div className="relative w-full min-h-[200px] max-h-[600px] aspect-video">
                  <Image
                    src={frontmatter.coverImage}
                    alt={frontmatter.coverImageAlt || frontmatter.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              </div>
            </GridLayout>
          </SiteContainer>
        </div>
      )}

      {/* Content */}
      <SiteContainer as="main" className="py-12">
        <GridLayout>
          <div className="content-prose">
            <Prose>{children}</Prose>
          </div>
        </GridLayout>
      </SiteContainer>

      {/* Footer metadata */}
      <footer className="border-t border-border bg-muted/30">
        <SiteContainer className="py-8">
          <GridLayout>
            <div className="content-narrow">
              <div className="text-sm text-muted-foreground type-body-small">
                {'updatedDate' in frontmatter && frontmatter.updatedDate && (
                  <p>
                    Última actualización:{' '}
                    {new Date(frontmatter.updatedDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </GridLayout>
        </SiteContainer>
      </footer>
    </div>
  )
}
