import { TYPOGRAPHY } from '@/lib/typography'

interface PageHeroProps {
  title: string
  subtitle?: string
  category?: string
}

export function PageHero({ title, subtitle, category }: PageHeroProps) {
  return (
    <header className="text-center mb-24">
      {category && (
        <div className={`${TYPOGRAPHY.caption} text-gray-500 uppercase tracking-wide mb-4`}>
          {category}
        </div>
      )}
      <h1 className={`${TYPOGRAPHY.display1} text-gray-900 mb-6`}>{title}</h1>
      {subtitle && (
        <p className={`${TYPOGRAPHY.lead} text-gray-700 max-w-3xl mx-auto`}>{subtitle}</p>
      )}
    </header>
  )
}
