import { defineRouting } from 'next-intl/routing'
import { pathnames } from './pathnames'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames,
})
