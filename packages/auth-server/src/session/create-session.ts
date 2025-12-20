import { AuthenticationError } from '@cenie/errors'
import { initializeAdminApp } from '@cenie/firebase/server'
import { createLogger } from '@cenie/logger'

import type { AppName } from '../types'

import type { SessionOptions } from './types'

const logger = createLogger({ name: 'auth-server:session:create' })

/**
 * Create a Firebase session cookie from an ID token
 * 
 * @param idToken - Firebase ID token from client authentication
 * @param appName - The app creating the session (hub, editorial, academy, agency)
 * @param options - Optional session configuration
 * @returns The session cookie string
 * @throws AuthenticationError if session creation fails
 */
export async function createSession(
  idToken: string,
  appName: AppName,
  options?: SessionOptions
): Promise<string> {
  // Validate input
  if (!idToken || idToken.trim().length === 0) {
    throw new AuthenticationError('ID token is required', {
      metadata: { appName },
    })
  }

  // Validate app name
  const validApps: AppName[] = ['hub', 'editorial', 'academy', 'agency']
  if (!validApps.includes(appName)) {
    throw new AuthenticationError(`Invalid app name: ${appName}`, {
      metadata: { appName, validApps },
    })
  }

  // Calculate expiration (default 14 days, max 14 days per Firebase limit)
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000
  const maxExpiresIn = fourteenDaysMs // Firebase max is 2 weeks
  let expiresIn = options?.expiresIn ?? fourteenDaysMs

  // Enforce Firebase limit
  if (expiresIn > maxExpiresIn) {
    logger.warn('Session expiration exceeds Firebase limit, capping at 14 days', {
      requested: expiresIn,
      capped: maxExpiresIn,
      appName,
    })
    expiresIn = maxExpiresIn
  }

  try {
    // Get Firebase Admin instance
    const adminApp = initializeAdminApp()
    const auth = adminApp.auth()

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })

    logger.info('Session created successfully', {
      appName,
      expiresIn,
      expiresInDays: expiresIn / (24 * 60 * 60 * 1000),
    })

    return sessionCookie
  } catch (error) {
    logger.error('Session creation failed', {
      error,
      appName,
      expiresIn,
    })

    throw new AuthenticationError('Failed to create session cookie', {
      metadata: { appName, expiresIn },
      cause: error instanceof Error ? error : undefined,
    })
  }
}

