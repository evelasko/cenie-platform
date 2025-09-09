'use client'

import { usePathname, useRouter } from '../../i18n/navigation'
import { useLocale } from 'next-intl'

export default function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const switchLocalePath = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale })
      router.refresh()
    }
  }
  const switchToLocale = locale === 'es' ? 'en' : 'es'
  const switchToMessage = locale === 'es' ? 'English' : 'Español'

  return (
    <div>
      <button className="text-body-large" onClick={() => switchLocalePath(switchToLocale)}>
        {switchToMessage}
      </button>
    </div>
  )
}
