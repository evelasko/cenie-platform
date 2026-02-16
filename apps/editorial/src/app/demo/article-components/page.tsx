import dynamic from 'next/dynamic'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

const ArticleHero = dynamic(() => import('@/components/sections/ArticleHero'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

const ArticleImageRow = dynamic(() => import('@/components/sections/ArticleImageRow'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

const ArticleMetadataRow = dynamic(() => import('@/components/sections/ArticleMetadataRow'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

const ArticleQuoteRow = dynamic(() => import('@/components/sections/ArticleQuoteRow'), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>,
})

export default function ArticleComponentsDemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>Article Components Demo</h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Showcasing ArticleHero, ArticleImageRow, ArticleMetadataRow, and ArticleQuoteRow
          </p>
        </div>

        {/* ArticleHero Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            ArticleHero Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Two-column layout (responsive) with image and title/label text.
          </p>
          <div className="bg-muted/30 p-4">
            <ArticleHero
              imageSrc="/images/articles/article-1.webp"
              imageAlt="Featured article"
              title="The Power of Creative Destruction in Modern Economics"
              label="Economics & Philosophy"
            />
          </div>
        </section>

        {/* ArticleMetadataRow Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            ArticleMetadataRow Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Article metadata with author, date, time to read, and share button.
          </p>
          <div className="max-w-3xl">
            <ArticleMetadataRow author="Dr. Sarah Johnson" date="January 15, 2024" timeToRead={8} />
            <ArticleMetadataRow
              author="Prof. Michael Chen"
              date="February 3, 2024"
              timeToRead={12}
            />
            <ArticleMetadataRow
              author="Dr. Elizabeth Martinez"
              date="March 20, 2024"
              timeToRead={5}
            />
          </div>
        </section>

        {/* ArticleImageRow Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            ArticleImageRow Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Full-width image with optional caption.
          </p>
          <div className="space-y-8">
            <div className="max-w-4xl">
              <ArticleImageRow
                imageSrc="/images/articles/article-2.webp"
                imageAlt="Research illustration"
                imageCaption="Figure 1: A visual representation of the economic theory discussed in the article, showing the relationship between innovation and market disruption."
              />
            </div>
            <div className="max-w-4xl">
              <ArticleImageRow
                imageSrc="/images/articles/article-3.webp"
                imageAlt="Analysis chart"
                imageCaption="Figure 2: Comparative analysis of different economic models."
              />
            </div>
            <div className="max-w-4xl">
              <ArticleImageRow
                imageSrc="/images/articles/article-4.webp"
                imageAlt="Without caption"
              />
            </div>
          </div>
        </section>

        {/* ArticleQuoteRow Section */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            ArticleQuoteRow Component
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            Blockquote with optional caption/attribution.
          </p>
          <div className="max-w-3xl space-y-8">
            <ArticleQuoteRow
              quote="The laureates' work shows that economic growth cannot be taken for granted. We must uphold the mechanisms that underlie creative destruction, so that we do not fall back into stagnation."
              caption="—John Hassler, Chair of the Committee for the prize in economic sciences"
            />
            <ArticleQuoteRow
              quote="Innovation distinguishes between a leader and a follower. The most important thing is to have a vision and to know what you want to achieve."
              caption="—Steve Jobs, Apple Inc."
            />
            <ArticleQuoteRow quote="The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." />
          </div>
        </section>

        {/* Combined Article Example */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Complete Article Example
          </h2>
          <p className={clsx(TYPOGRAPHY.bodyBase, 'text-muted-foreground')}>
            All article components working together in a realistic layout.
          </p>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <ArticleHero
              imageSrc="/images/articles/article-5.webp"
              imageAlt="Innovation in modern society"
              title="Rethinking Innovation: The Role of Creative Destruction in 21st Century Economics"
              label="Economic Theory"
            />
            <div className="max-w-4xl mx-auto px-6 space-y-8 py-8">
              <ArticleMetadataRow
                author="Dr. Robert Williams"
                date="April 10, 2024"
                timeToRead={15}
              />

              <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-black/80')}>
                The concept of creative destruction, first articulated by economist Joseph
                Schumpeter, has never been more relevant than in today's rapidly evolving economic
                landscape. As we witness unprecedented technological advancement and market
                disruption, understanding this fundamental economic principle becomes crucial for
                both policymakers and business leaders.
              </p>

              <ArticleImageRow
                imageSrc="/images/articles/article-1.webp"
                imageAlt="Economic transformation"
                imageCaption="The cyclical nature of economic innovation and market transformation."
              />

              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                Creative destruction describes the process by which new innovations replace outdated
                technologies and business models. This natural economic evolution drives progress
                but also creates significant challenges for established industries and workers whose
                skills may become obsolete.
              </p>

              <ArticleQuoteRow
                quote="The fundamental impulse that sets and keeps the capitalist engine in motion comes from the new consumers' goods, the new methods of production or transportation, the new markets, the new forms of industrial organization that capitalist enterprise creates."
                caption="—Joseph Schumpeter, Capitalism, Socialism and Democracy (1942)"
              />

              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                Today's digital economy exemplifies this principle in action. Traditional retail has
                been transformed by e-commerce, conventional media disrupted by streaming services,
                and transportation revolutionized by ride-sharing platforms. Each wave of innovation
                creates new opportunities while simultaneously challenging existing market
                participants.
              </p>

              <ArticleImageRow
                imageSrc="/images/articles/article-2.webp"
                imageAlt="Digital transformation"
                imageCaption="How technology continues to reshape traditional industries."
              />

              <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>
                Understanding and embracing creative destruction is essential for sustainable
                economic growth in the modern era. While the process can be disruptive, it
                ultimately leads to higher productivity, better products and services, and improved
                living standards for society as a whole.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
