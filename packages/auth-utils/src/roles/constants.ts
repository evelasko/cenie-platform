/**
 * Role definitions for all CENIE apps
 */
export const APP_ROLES = {
  hub: ['user', 'admin'] as const,
  editorial: ['viewer', 'editor', 'admin'] as const,
  academy: ['student', 'instructor', 'admin'] as const,
  agency: ['client', 'manager', 'admin'] as const,
} as const

/**
 * Role hierarchy - numeric levels for comparison
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY = {
  // Hub
  user: 1,

  // Editorial
  viewer: 1,
  editor: 2,

  // Academy
  student: 1,
  instructor: 2,

  // Agency
  client: 1,
  manager: 2,

  // Universal (all apps)
  admin: 3,
} as const

export type RoleLevel = (typeof ROLE_HIERARCHY)[keyof typeof ROLE_HIERARCHY]

