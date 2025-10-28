import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'

interface BookCardItemProps {
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
}

/**
 * This components is a single column card with the image in its original aspect ratio,
 * followed by a row of text with the title in TYPOGRAPHY.h5 black 80% opacity and another
 * row of text with the subtitle in TYPOGRAPHY.bodySmall black 50% opacity.
 *
 * @returns
 */
export default function BookCardItem({ title, subtitle, imageSrc, imageAlt }: BookCardItemProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Image in original aspect ratio */}
      <div className="relative w-full aspect-2/3">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Title */}
      <div className="flex">
        <h3 className={clsx(TYPOGRAPHY.h5, 'text-black/80')}>{title}</h3>
      </div>

      {/* Subtitle */}
      <div className="flex">
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-black/50')}>{subtitle}</p>
      </div>
    </div>
  )
}
