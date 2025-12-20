import { withRole } from '@cenie/auth-server/middleware'

import type { AcademyRole } from '@cenie/auth-utils/roles'

/**
 * Require student role or higher for API routes
 * Use in API routes that any authenticated student can access
 *
 * @example
 * ```typescript
 * export const GET = requireStudent(async (request, { user }) => {
 *   // user.role is 'student', 'instructor', or 'admin'
 *   return NextResponse.json({ courses: [] })
 * })
 * ```
 */
export const requireStudent = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('academy', 'student', handler)

/**
 * Require instructor role or higher for API routes
 * Use in API routes for course management, student management
 *
 * @example
 * ```typescript
 * export const POST = requireInstructor(async (request, { user }) => {
 *   // user.role is 'instructor' or 'admin'
 *   return NextResponse.json({ course: await createCourse(data) })
 * })
 * ```
 */
export const requireInstructor = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('academy', 'instructor', handler)

/**
 * Require admin role for API routes
 * Use in API routes for user management, system configuration
 *
 * @example
 * ```typescript
 * export const DELETE = requireAcademyAdmin(async (request, { user }) => {
 *   // user.role is 'admin'
 *   return NextResponse.json({ success: true })
 * })
 * ```
 */
export const requireAcademyAdmin = <TParams = unknown>(
  handler: Parameters<typeof withRole<TParams>>[2]
) => withRole('academy', 'admin', handler)

export type { AcademyRole }

