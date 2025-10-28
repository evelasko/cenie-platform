import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

export interface ArticleQuoteRowProps {
  quote: string
  caption?: string | undefined
}

/**
 * This component is a single column with the quote displayed in a bordered blockquote,
 * followed by the caption if set.
 * Please refer to the HTML code in the comment at the bottom of this file for the exact layout.
 * The quote is displayed as TYPOGRAPHY.display2 in black.
 * The caption is displayed in TYPOGRAPHY.caption (with a custom font size of 12px) in black 80% opacity.
 */
export default function ArticleQuoteRow({ quote, caption }: ArticleQuoteRowProps) {
  return (
    <figure className="border-l-4 border-l-secondary pl-8 md:pl-12 lg:pl-16">
      <blockquote>
        <p className={clsx(TYPOGRAPHY.display2, 'text-black')}>{quote}</p>
      </blockquote>
      {caption && (
        <div
          className={clsx(TYPOGRAPHY.caption, 'mt-2 text-black/80')}
          style={{ fontSize: '12px' }}
        >
          {caption}
        </div>
      )}
    </figure>
  )
}

/*
<figure class="border-l-4 border-l-secondary pl-32 md:pl-48 lg:pl-64">
    <blockquote>
        <p class="f-heading-03">"The laureates' work shows that economic growth cannot be taken for granted. We must uphold the mechanisms that  [underlie] creative destruction, so that we do not fall back into stagnation."</p>
    </blockquote>
    <div class="f-caption mt-8">—John Hassler, Chair of the Committee for the prize in economic sciences</div>
</figure>
*/
