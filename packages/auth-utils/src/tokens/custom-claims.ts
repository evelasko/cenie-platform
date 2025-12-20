import { ValidationError } from '@cenie/errors'
import { createLogger } from '@cenie/logger'

const logger = createLogger({ name: 'auth-utils:tokens:custom-claims' })

// Firebase limit: 1000 bytes
const MAX_CLAIMS_SIZE = 1000

/**
 * Update Firebase custom claims for a user
 * Custom claims are included in ID tokens for offline access checks
 *
 * @param userId - Firebase UID
 * @param claims - Custom claims object
 * @param auth - Firebase Auth instance
 *
 * @example
 * ```typescript
 * await updateCustomClaims(
 *   'user123',
 *   { apps: ['editorial'], roles: { editorial: 'editor' } },
 *   auth
 * )
 * ```
 */
export async function updateCustomClaims(
  userId: string,
  claims: Record<string, unknown>,
  auth: { setCustomUserClaims: (uid: string, customClaims: Record<string, unknown>) => Promise<void> }
): Promise<void> {
  // Validate claims size (Firebase limit)
  const claimsJson = JSON.stringify(claims)
  const sizeInBytes = new Blob([claimsJson]).size

  if (sizeInBytes > MAX_CLAIMS_SIZE) {
    logger.error('Custom claims too large', {
      userId,
      size: sizeInBytes,
      limit: MAX_CLAIMS_SIZE,
    })

    throw new ValidationError('Custom claims exceed Firebase limit', {
      metadata: {
        size: sizeInBytes,
        limit: MAX_CLAIMS_SIZE,
      },
    })
  }

  try {
    await auth.setCustomUserClaims(userId, claims)

    logger.info('Custom claims updated', {
      userId,
      claimKeys: Object.keys(claims),
    })
  } catch (error: unknown) {
    logger.error('Failed to update custom claims', { error, userId })
    throw error
  }
}

