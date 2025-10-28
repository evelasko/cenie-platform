import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'

export interface ArticleImageRowProps {
  imageSrc: string
  imageAlt: string
  imageCaption?: string | undefined
}

/**
 * This component is a single column with the image displayed in full width and original aspect ratio,
 * followed by the image caption if set. The caption is displayed in TYPOGRAPHY.bodySmall (with a custom font size of 14px) in black 80% opacity.
 *
 * @param imageSrc - The source of the image
 * @param imageAlt - The alt text of the image
 * @param imageCaption - The caption of the image
 * @returns
 */
export default function ArticleImageRow({
  imageSrc,
  imageAlt,
  imageCaption,
}: ArticleImageRowProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Image */}
      <div className="relative w-full aspect-video">
        <Image src={imageSrc} alt={imageAlt} fill className="object-contain" sizes="100vw" />
      </div>

      {/* Caption (if provided) */}
      {imageCaption && (
        <p className={clsx(TYPOGRAPHY.bodySmall, 'text-black/80')} style={{ fontSize: '14px' }}>
          {imageCaption}
        </p>
      )}
    </div>
  )
}
