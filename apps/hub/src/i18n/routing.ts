import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // Temporarily changed from 'as-needed' for debugging
})
