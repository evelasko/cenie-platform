import BaseCard from '@/components/items/BaseCard'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

export default function BaseCardDemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={clsx(TYPOGRAPHY.display1, 'text-foreground')}>BaseCard Component Demo</h1>
          <p className={clsx(TYPOGRAPHY.lead, 'text-muted-foreground')}>
            Showcasing all variants of the BaseCard component
          </p>
        </div>

        {/* Full Coverage with Primary Background */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Full Coverage - Primary Background Tint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BaseCard
              label="Literary Fiction"
              title="The Art of Narrative"
              imageSrc="/images/articles/article-1.webp"
              imageAlt="Article 1"
              imageVariant="full"
              backgroundTint="primary"
            />
            <BaseCard
              label="Historical Studies"
              title="Echoes of the Past"
              imageSrc="/images/articles/article-2.webp"
              imageAlt="Article 2"
              imageVariant="full"
              backgroundTint="primary"
            />
            <BaseCard
              label="Philosophy"
              title="Questions of Existence"
              imageSrc="/images/articles/article-3.webp"
              imageAlt="Article 3"
              imageVariant="full"
              backgroundTint="primary"
            />
          </div>
        </section>

        {/* Full Coverage with Secondary Background */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Full Coverage - Secondary Background Tint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BaseCard
              label="Contemporary Art"
              title="Visual Perspectives"
              imageSrc="/images/articles/article-4.webp"
              imageAlt="Article 4"
              imageVariant="full"
              backgroundTint="secondary"
            />
            <BaseCard
              label="Cultural Studies"
              title="Society in Transition"
              imageSrc="/images/articles/article-5.webp"
              imageAlt="Article 5"
              imageVariant="full"
              backgroundTint="secondary"
            />
            <BaseCard
              label="Science"
              title="The Nature of Discovery"
              imageSrc="/images/articles/article-1.webp"
              imageAlt="Article 1"
              imageVariant="full"
              backgroundTint="secondary"
            />
          </div>
        </section>

        {/* Inset with Primary Background */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Inset (50% Smaller) - Primary Background Tint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BaseCard
              label="New Release"
              title="Modern Classics Revisited"
              imageSrc="/images/covers/cover-1.jpg"
              imageAlt="Book Cover 1"
              imageVariant="inset"
              backgroundTint="primary"
            />
            <BaseCard
              label="Bestseller"
              title="Stories That Define Us"
              imageSrc="/images/covers/cover-2.jpg"
              imageAlt="Book Cover 2"
              imageVariant="inset"
              backgroundTint="primary"
            />
            <BaseCard
              label="Award Winner"
              title="The Scholar's Journey"
              imageSrc="/images/covers/cover-3.jpg"
              imageAlt="Book Cover 3"
              imageVariant="inset"
              backgroundTint="primary"
            />
            <BaseCard
              label="Featured"
              title="Wisdom and Insight"
              imageSrc="/images/covers/cover-4.jpg"
              imageAlt="Book Cover 4"
              imageVariant="inset"
              backgroundTint="primary"
            />
          </div>
        </section>

        {/* Inset with Secondary Background */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Inset (50% Smaller) - Secondary Background Tint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BaseCard
              label="Critically Acclaimed"
              title="Voices of Change"
              imageSrc="/images/covers/cover-5.jpg"
              imageAlt="Book Cover 5"
              imageVariant="inset"
              backgroundTint="secondary"
            />
            <BaseCard
              label="Editor's Choice"
              title="Perspectives on Power"
              imageSrc="/images/covers/cover-6.jpg"
              imageAlt="Book Cover 6"
              imageVariant="inset"
              backgroundTint="secondary"
            />
            <BaseCard
              label="Staff Pick"
              title="Tales of Transformation"
              imageSrc="/images/covers/cover-7.jpg"
              imageAlt="Book Cover 7"
              imageVariant="inset"
              backgroundTint="secondary"
            />
            <BaseCard
              label="Recommended"
              title="Heritage and Hope"
              imageSrc="/images/covers/cover-1.jpg"
              imageAlt="Book Cover 1"
              imageVariant="inset"
              backgroundTint="secondary"
            />
          </div>
        </section>

        {/* Mixed Variants */}
        <section className="space-y-6">
          <h2 className={clsx(TYPOGRAPHY.h2, 'text-foreground border-b border-border pb-2')}>
            Mixed Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BaseCard
              label="Article Series"
              title="The Written Word"
              imageSrc="/images/articles/article-2.webp"
              imageAlt="Article 2"
              imageVariant="full"
              backgroundTint="primary"
            />
            <BaseCard
              label="Book Collection"
              title="Essential Reading"
              imageSrc="/images/covers/cover-2.jpg"
              imageAlt="Book Cover 2"
              imageVariant="inset"
              backgroundTint="secondary"
            />
            <BaseCard
              label="Featured Content"
              title="Ideas Worth Sharing"
              imageSrc="/images/articles/article-3.webp"
              imageAlt="Article 3"
              imageVariant="full"
              backgroundTint="secondary"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
