'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { TYPOGRAPHY } from '@/lib/typography'

interface BookCardItemProps {
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
}

export default function BookCardItem({ title, subtitle, imageSrc, imageAlt }: BookCardItemProps) {
  const metaRef = useRef<HTMLSpanElement>(null)
  const [metaHeight, setMetaHeight] = useState(0)

  useEffect(() => {
    const el = metaRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (el) setMetaHeight(el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div className="relative aspect-2/3" initial="rest" whileHover="hover">
      {/* Cover — slides up on hover to reveal metadata behind it */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10"
        variants={{
          rest: { y: 0 },
          hover: { y: -(metaHeight + 12) },
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="relative aspect-2/3 shadow-medium">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </motion.div>

      {/* Metadata — stays fixed at the bottom, hidden behind cover until revealed */}
      <span ref={metaRef} className="absolute bottom-0 left-0 right-0 pb-2">
        <strong className={clsx(TYPOGRAPHY.h5, 'line-clamp-2 block text-black/80')}>{title}</strong>
        <em className={clsx(TYPOGRAPHY.bodySmall, 'mt-1 line-clamp-2 block text-black/50')}>
          {subtitle}
        </em>
      </span>
    </motion.div>
  )
}
