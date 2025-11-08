import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'
import { logger } from '../lib/logger'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale

  // Debug logging
  logger.debug('[i18n] Request config', {
    requested,
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
    hasLocale: hasLocale(routing.locales, requested),
  })

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  logger.debug('[i18n] Final locale', { locale })

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    timeZone: 'Europe/Madrid',
  }
})
