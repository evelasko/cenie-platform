import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale

  // Debug logging
  console.log('=== REQUEST CONFIG DEBUG ===')
  // console.log('requestLocale (raw):', requestLocale)
  console.log('requested (awaited):', requested)
  console.log('routing.locales:', routing.locales)
  console.log('routing.defaultLocale:', routing.defaultLocale)
  console.log('hasLocale result:', hasLocale(routing.locales, requested))

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  console.log('final locale:', locale)
  console.log('=== END REQUEST CONFIG DEBUG ===')

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    timeZone: 'Europe/Madrid',
  }
})
