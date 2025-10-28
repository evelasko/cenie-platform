import { clsx } from 'clsx'
import Link from 'next/link'
import { TYPOGRAPHY } from '@/lib/typography'
import ArrowIcon from '../graphics/ArrowIcon'

export interface InLineMenuCardProps {
  title: string
  description: string
  links: MenuCardLinks[]
}

type MenuCardLinks = {
  label: string
  href: string
  target: string
}

/**
 * This component is a single column card with rgb(240, 242, 245) background and padding 12px
 * holding the following rows:
 * - The title in TYPOGRAPHY.h1 black 80% opacity
 * - The subtitle in TYPOGRAPHY.bodyBase black 80% opacity
 * - The links in TYPOGRAPHY.h3 black 80% opacity with an icon of an arrow pointing to the right
 *
 * @param title
 * @param description
 * @param links
 * @returns
 */
export default function InLineMenuCard({ title, description, links }: InLineMenuCardProps) {
  return (
    <div className="flex flex-col gap-4 p-10" style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
      {/* Title */}
      <h1 className={clsx(TYPOGRAPHY.h1, 'text-black/80')}>{title}</h1>

      {/* Description */}
      <p className={clsx(TYPOGRAPHY.bodyBase, 'text-black/80')}>{description}</p>

      {/* Links */}
      <div className="flex flex-col gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            target={link.target}
            className={clsx(
              TYPOGRAPHY.h3,
              'text-black/80 flex items-center gap-2 hover:opacity-70 transition-opacity'
            )}
          >
            <span>{link.label}</span>
            <ArrowIcon size={20} color="black" />
          </Link>
        ))}
      </div>
    </div>
  )
}
