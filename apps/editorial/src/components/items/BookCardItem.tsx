import { clsx } from 'clsx'
import Image from 'next/image'
import { TYPOGRAPHY } from '@/lib/typography'

interface BookCardItemProps {
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
}

export default function BookCardItem({ title, subtitle, imageSrc, imageAlt }: BookCardItemProps) {
  return (
    <div className="relative flex aspect-2/3 items-end">
      {/* Cover Image with hover animation */}
      <div className="relative z-10 w-full transition-transform duration-300 ease-in-out group-hover:-translate-y-16">
        <div className="relative aspect-2/3 shadow-medium">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Metadata revealed on hover */}
      <span className="absolute bottom-0 left-0 right-0 pb-2">
        <strong className={clsx(TYPOGRAPHY.h5, 'line-clamp-2 block text-black/80')}>
          {title}
        </strong>
        <em className={clsx(TYPOGRAPHY.bodySmall, 'mt-1 line-clamp-2 block text-black/50')}>
          {subtitle}
        </em>
      </span>
    </div>
  )
}
