import { withRole } from '@cenie/auth-server/middleware'

import type { AgencyRole } from '@cenie/auth-utils/roles'

/**
 * Require client role or higher for Agency routes
 */
export const requireClient = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('agency', 'client', handler)

/**
 * Require manager role or higher for Agency routes
 */
export const requireManager = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('agency', 'manager', handler)

/**
 * Require admin role for Agency routes
 */
export const requireAgencyAdmin = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('agency', 'admin', handler)

export type { AgencyRole }

