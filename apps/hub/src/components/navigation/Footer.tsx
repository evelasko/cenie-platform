import { FeatherFacebook } from '@subframe/core'
import { FeatherInstagram } from '@subframe/core'
import { FeatherLinkedin } from '@subframe/core'
import { FeatherYoutube } from '@subframe/core'
import clsx from 'clsx'
import Image from 'next/image'
import { footerNavigationItems } from '../../constants/navigation'
import Link from 'next/link'

export default function Footer({ className }: { className?: string }) {
  return (
    <div className={clsx('flex w-full flex-col items-start gap-4 content-wrapper', className)}>
      <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {footerNavigationItems.map((item) => (
          <div className="flex flex-col items-center md:items-start gap-2" key={item.label}>
            <span className="text-caption-small !font-bold uppercase text-default-font">
              {item.label}
            </span>
            <div className="flex flex-col items-center md:items-start gap-1">
              {item.items.map((item) => (
                <Link
                  className="text-display-text-small text-subtext-color"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-12 py-8" />
      <div className="flex w-full flex-col-reverse md:flex-row gap-4 md:gap-20">
        <div id="social-and-email" className="flex flex-col-2 md:flex-col justify-between">
          <div className="flex flex-row gap-4">
            <FeatherInstagram className="text-body-large md:!text-display-text-large" />
            <FeatherFacebook className="text-body-large md:!text-display-text-large" />
            <FeatherLinkedin className="text-body-large md:!text-display-text-large" />
            <FeatherYoutube className="text-body-large md:!text-display-text-large" />
          </div>
          <Link
            className="text-[clamp(0.4rem,2.4vw_+_0.5rem,2.55rem)] font-bold tracking-tighter"
            href="mailto:hola@cenie.org"
          >
            hola@cenie.org
          </Link>
        </div>
        <div id="footer-logo" className="relative grow aspect-[311/51]">
          <Image
            className="opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] filter-[brightness(1.5)]"
            src="/media/brand/logo-black-fill.svg"
            alt="CENIE Logo"
            fill
          />
        </div>
      </div>
      <div className="flex w-full flex-col justify-between items-start gap-0 md:gap-4">
        <span className="whitespace-nowrap text-body-small font-body-small text-default-font">
          {'+34 (609) 971 307'}
        </span>
        <span className="whitespace-pre-wrap text-body-small font-body-small text-secondary">
          {'8826 Dickens Ave'}
          <br className="hidden md:block" />
          {' Surfside, Florida FL. USA'}
        </span>
        <span className="whitespace-pre-wrap text-body-small font-body-small text-secondary">
          {'C/ Eduardo Rivas 14,'}
          <br className="hidden md:block" />
          {' Madrid, 28019. Spain'}
        </span>
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-12 py-4" />
    </div>
  )
}
