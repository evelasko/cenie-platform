import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'

interface BaseCardProps {
  /** Text label styled with TYPOGRAPHY.h5 */
  label: string
  /** Title text styled with TYPOGRAPHY.display2 */
  title: string
  /** Image source URL */
  imageSrc: string
  /** Image alt text for accessibility */
  imageAlt: string
  /**
   * Image variant:
   * - 'full': Image covers the entire block
   * - 'inset': Image covers a centered inner block that is 50% smaller
   */
  imageVariant?: 'full' | 'inset'
  /**
   * Background tint color:
   * - 'primary': Tinted with primary color (~10% opacity)
   * - 'secondary': Tinted with secondary color (~10% opacity)
   */
  backgroundTint?: 'primary' | 'secondary'
}

export default function BaseCard({
  label,
  title,
  imageSrc,
  imageAlt,
  imageVariant = 'full',
  backgroundTint = 'primary',
}: BaseCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Image Block with 3/4 aspect ratio */}
      <div
        className={clsx(
          'relative w-full overflow-hidden',
          'aspect-3/4',
          // Background tint
          backgroundTint === 'primary' && 'bg-primary/10',
          backgroundTint === 'secondary' && 'bg-secondary/10'
        )}
      >
        {imageVariant === 'full' ? (
          // Full coverage variant
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // Inset variant - 50% smaller, centered
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-1/2 h-1/2 aspect-3/4">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="flex justify-center text-center">
        <span className={clsx(TYPOGRAPHY.h5, 'text-black/50')}>{label}</span>
      </div>

      {/* Title */}
      <div className="flex justify-center text-center">
        <h2 className={clsx(TYPOGRAPHY.display2, 'text-black')}>{title}</h2>
      </div>
    </div>
  )
}
