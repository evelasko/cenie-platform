import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'

interface BookListItemProps {
  imageSrc: string
  imageAlt: string
  title: string
  subtitle?: string | undefined
  author: string
  description: string
  button: React.ReactElement
}

/**
 * This component has a two column layout that becomes on in small screens, in the first column there is
 * only the image shown in full (no cropping) in its original aspect ratio; this column is 25% of the available width.
 * The second column has the following rows (aligned to the left in large screens and to the center in small):
 * - The title in TYPOGRAPHY.h3 black
 * - The subtitle (if set) in TYPOGRAPHY.h3 black 50% opacity
 * - The author in TYPOGRAPHY.h5 black 50% opacity
 * - The description in TYPOGRAPHY.bodyLarge black 80% opacity
 * - The button is just placed as the last row with the same alignment as the rows above
 *
 * @param imageSrc - The source of the image
 * @param imageAlt - The alt text of the image
 * @param title - The title of the book
 * @param subtitle - The subtitle of the book
 * @param author - The author of the book
 * @param description - The description of the book
 * @param button - The button text
 * @returns
 */
export default function BookListItem({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  author,
  description,
  button,
}: BookListItemProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Image Column - 25% width on large screens */}
      <div className="w-full md:w-1/4 shrink-0">
        <div className="relative w-full aspect-2/3">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </div>

      {/* Content Column - 75% width on large screens */}
      <div className="flex flex-col gap-4 text-center md:text-left">
        {/* Title */}
        <h3 className={clsx(TYPOGRAPHY.h3, 'text-black')}>{title}</h3>

        {/* Subtitle (if provided) */}
        {subtitle && <p className={clsx(TYPOGRAPHY.h3, 'text-black/50')}>{subtitle}</p>}

        {/* Author */}
        <p className={clsx(TYPOGRAPHY.h5, 'text-black/50')}>{author}</p>

        {/* Description */}
        <p className={clsx(TYPOGRAPHY.bodyLarge, 'text-black/80')}>{description}</p>

        {/* Button */}
        <div className="flex justify-center md:justify-start">{button}</div>
      </div>
    </div>
  )
}
