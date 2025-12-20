import { APP_ROLES, ROLE_HIERARCHY } from './constants'

/**
 * Check if user has sufficient role level
 *
 * @param userRole - The role the user has
 * @param requiredRole - The minimum role required
 * @returns true if user's role level >= required role level
 *
 * @example
 * ```typescript
 * hasRole('admin', 'editor') // true (3 >= 2)
 * hasRole('editor', 'editor') // true (2 >= 2)
 * hasRole('viewer', 'editor') // false (1 < 2)
 * ```
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0

  return userLevel >= requiredLevel
}

/**
 * Get numeric level for a role
 *
 * @param role - Role name
 * @returns Numeric level (0 if role not found)
 *
 * @example
 * ```typescript
 * getRoleLevel('viewer') // 1
 * getRoleLevel('editor') // 2
 * getRoleLevel('admin') // 3
 * getRoleLevel('invalid') // 0
 * ```
 */
export function getRoleLevel(role: string): number {
  return ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] || 0
}

/**
 * Check if role is valid for an app
 *
 * @param appName - App to check
 * @param role - Role to validate
 * @returns true if role exists for this app
 *
 * @example
 * ```typescript
 * isValidRoleForApp('editorial', 'editor') // true
 * isValidRoleForApp('editorial', 'instructor') // false
 * isValidRoleForApp('editorial', 'admin') // true (admin is universal)
 * ```
 */
export function isValidRoleForApp(
  appName: 'hub' | 'editorial' | 'academy' | 'agency',
  role: string
): boolean {
  return APP_ROLES[appName].includes(role as never) || role === 'admin'
}

