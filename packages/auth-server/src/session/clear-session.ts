import { cookies } from 'next/headers'

/**
 * Clear the session cookie (logout)
 * 
 * This function deletes the 'session' cookie from the browser.
 * It's safe to call even if the cookie doesn't exist.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

