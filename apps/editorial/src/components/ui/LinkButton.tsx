import clsx from 'clsx'
import Link from 'next/link'
import LinkArrow from '../icons/LinkArrow'
import LinkExternalArrow from '../icons/LinkExternalArrow'

interface LinkButtonProps {
  href: string
  label: string
  target?: '_self' | '_blank'
}

export default function LinkButton({ href, label, target = '_self' }: LinkButtonProps) {
  const isExternal = target === '_blank'
  return (
    <Link
      href={href}
      target={target}
      className={clsx(
        'type-button-link',
        'inline-flex items-center justify-center gap-2 px-8 py-3 mb-8 group'
      )}
    >
      <span className="relative">
        <span className={clsx('transition-colors duration-200', 'group-hover:text-gray-700')}>
          {label}
        </span>
        <span
          className={clsx(
            'absolute left-0 -bottom-0.5 w-full h-px bg-black',
            'origin-left scale-x-0 group-hover:scale-x-100',
            'transition-transform duration-300 opacity-0 group-hover:opacity-100'
          )}
          aria-hidden="true"
        />
      </span>
      <span aria-hidden="true" className="mt-1">
        {isExternal ? (
          <LinkExternalArrow size={24} color="black" />
        ) : (
          <LinkArrow size={24} color="black" />
        )}
      </span>
    </Link>
  )
}
