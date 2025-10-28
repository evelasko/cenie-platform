import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import ShareIcon from '../graphics/ShareIcon'
import { Clock } from 'lucide-react'

export interface ArticleMetadataRowProps {
  author: string
  date: string
  timeToRead: number
}

/**
 * This component is a single column with the metadata displayed in a row.
 * Please refer to the HTML code in the comment at the bottom of this file for the exact layout.
 * The svg icon is the component ShareIcon from the graphics folder.
 *
 * @param author - The author of the article
 * @param date - The date of the article
 * @param timeToRead - The time to read the article
 * @returns
 */
export default function ArticleMetadataRow({ author, date, timeToRead }: ArticleMetadataRowProps) {
  return (
    <div className="mt-6 flex justify-between border-t border-border pb-6 pt-7 md:mt-8">
      <div>
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-primary')}>
          <span className="sr-only">Author -</span>
          {author}
        </p>
        <div className="flex gap-3">
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-secondary')}>
            <span className="sr-only">Date -</span>
            {date}
          </p>
          <p className={clsx(TYPOGRAPHY.bodySmall, 'flex items-center gap-1 text-secondary')}>
            <span className="sr-only">Time to read -</span>
            <Clock className="inline w-5 h-5 align-sub" aria-hidden="true" />
            {timeToRead} min
          </p>
        </div>
      </div>
      <div className="ml-4">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow hover:text-secondary transition-colors"
          title="Share"
          aria-label="Share"
        >
          <ShareIcon size={25} />
        </button>
      </div>
    </div>
  )
}

/*
<div class="flex-flow mt-24 flex justify-between border-t border-t-light pb-24 pt-28 md:!mt-32" data-component="editorial:post-metadata">
    <div>
        <p class="ui-02 text-primary">
            <span class="sr-only">Author -</span>
            {author}
        </p>
        <div class="flex-flow flex">
            <p class="ui-02 text-secondary">
                <span class="sr-only">Date -</span>
                {date}
            </p>
                            <p class="ui-02 ml-12 text-secondary">
                    <span class="sr-only">Time to read -</span>
                    <svg width="20" height="20" fill="none" class="inline align-sub" viewBox="0 0 20 20" aria-hidden="true">
    <use xlink:href="#clock-20"></use>
</svg>
                    {timeToRead} min
                </p>
                    </div>
    </div>
    <div class="ml-gutter">
        <button class="flex items-center gap-10 effect-color effect-focus disabled:cursor-not-allowed px-16 py-12 bg-inverse shadow-01 hover:text-secondary disabled:bg-lighter disabled:text-soft f-ui-02 w-48 h-48 justify-center rounded-full !p-12 pr-12" data-behavior="triggerShare" title="Share" aria-label="Share">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.4239 3.25C12.2079 3.25 12.0132 3.34131 11.8763 3.48744L7.26675 8.0941C6.97376 8.3869 6.97361 8.86177 7.26641 9.15476C7.55921 9.44775 8.03408 9.4479 8.32707 9.1551L11.6739 5.81043L11.6739 16C11.6739 16.4142 12.0096 16.75 12.4239 16.75C12.8381 16.75 13.1739 16.4142 13.1739 16L13.1739 5.81455L16.5168 9.15511C16.8098 9.4479 17.2846 9.44774 17.5774 9.15474C17.8702 8.86175 17.87 8.38687 17.5771 8.09408L13.0021 3.52236C12.8646 3.356 12.6566 3.25 12.4239 3.25Z" fill="#323544"/>
<path d="M5.17188 16C5.17188 15.5858 4.83609 15.25 4.42188 15.25C4.00766 15.25 3.67188 15.5858 3.67188 16V18.5C3.67188 19.7426 4.67923 20.75 5.92188 20.75H18.9227C20.1654 20.75 21.1727 19.7426 21.1727 18.5V16C21.1727 15.5858 20.837 15.25 20.4227 15.25C20.0085 15.25 19.6727 15.5858 19.6727 16V18.5C19.6727 18.9142 19.337 19.25 18.9227 19.25H5.92188C5.50766 19.25 5.17188 18.9142 5.17188 18.5V16Z" fill="#323544"/>
</svg>
        </button>
    </div>
</div>
*/
