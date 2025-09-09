import Link from 'next/link'
import { legalNavigationItems } from '../../constants/navigation'
import { type LocaleString } from '../../lib/types'

export default function BottomEdge({ locale }: { locale: LocaleString }) {
  return (
    <div className="flex w-full flex-col items-start bg-black px-6 py-6">
      <div className="flex h-px w-full flex-none flex-col items-center bg-transparent px-6 py-6" />
      <div className="flex w-full flex-col md:flex-row items-start gap-0 md:justify-between">
        <span className="text-button-small font-body text-neutral-500">
          © 2025 CENIE® All Rights Reserved
        </span>
        <div className="flex justify-between md:justify-start gap-0 px-0 md:px-12">
          {legalNavigationItems.map((item, index) => (
            <div key={item.label[locale]}>
              <Link
                className="text-button-small text-white hover:text-primary"
                href={item.href}
                key={item.label[locale]}
              >
                {item.label[locale]}
              </Link>
              {index < legalNavigationItems.length - 1 && (
                <span className="text-white px-1 md:px-4 relative top-[2px]">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-none flex-col items-center gap-2 bg-transparent px-6 py-[50px]" />
    </div>
  )
}
