import { withRole } from '@cenie/auth-server/middleware'

import type { EditorialRole } from '@cenie/auth-utils/roles'

/**
 * Require viewer role or higher for Editorial routes
 */
export const requireViewer = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('editorial', 'viewer', handler)

/**
 * Require editor role or higher for Editorial routes
 */
export const requireEditor = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('editorial', 'editor', handler)

/**
 * Require admin role for Editorial routes
 */
export const requireEditorialAdmin = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('editorial', 'admin', handler)

export type { EditorialRole }

