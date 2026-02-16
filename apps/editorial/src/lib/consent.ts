/**
 * Cookie consent state management.
 *
 * Pure utility functions (no React) for reading, writing and checking the
 * GDPR consent cookie.  All functions are SSR-safe — they return sensible
 * defaults when `document` is unavailable.
 */

/** Bump this when the privacy policy changes to re-prompt users. */
export const CONSENT_VERSION = '1.0'

export const CONSENT_COOKIE_NAME = 'cenie_consent'

/** ~13 months in seconds (GDPR maximum retention). */
const MAX_AGE_SECONDS = 34164000

export type ConsentStatus = 'granted' | 'denied'

interface ConsentCookieValue {
  status: ConsentStatus
  timestamp: number
  version: string
}

/**
 * Read the consent cookie and return the stored status.
 *
 * Returns `null` when:
 * - running on the server (SSR)
 * - the cookie does not exist
 * - the cookie cannot be parsed
 * - the stored version does not match `CONSENT_VERSION`
 */
export function getConsentState(): ConsentStatus | null {
  if (typeof document === 'undefined') return null

  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (!raw) return null

  try {
    const value: ConsentCookieValue = JSON.parse(decodeURIComponent(raw.split('=')[1] ?? ''))

    if (value.version !== CONSENT_VERSION) return null
    if (value.status !== 'granted' && value.status !== 'denied') return null

    return value.status
  } catch {
    return null
  }
}

/**
 * Persist the user's consent choice to a first-party cookie.
 *
 * The cookie is set with:
 * - `path=/` so it is readable across the whole site
 * - `SameSite=Lax` for CSRF protection while allowing top-level navigations
 * - `max-age` of ~13 months (GDPR maximum)
 */
export function setConsentState(status: ConsentStatus): void {
  if (typeof document === 'undefined') return

  const value: ConsentCookieValue = {
    status,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  }

  document.cookie = [
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}`,
    `path=/`,
    `max-age=${MAX_AGE_SECONDS}`,
    `SameSite=Lax`,
  ].join('; ')
}

/**
 * Whether the user has already made a consent choice (regardless of the
 * answer).  Returns `false` on the server and when no valid cookie exists.
 */
export function hasConsentBeenAsked(): boolean {
  return getConsentState() !== null
}
