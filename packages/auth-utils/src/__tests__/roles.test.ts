import { describe, expect, it } from 'vitest'

import { getRoleLevel, hasRole } from '../roles/hierarchy'

describe('Role Hierarchy', () => {
  it('should correctly compare role levels', () => {
    // Admin can access editor routes
    expect(hasRole('admin', 'editor')).toBe(true)

    // Editor can access editor routes
    expect(hasRole('editor', 'editor')).toBe(true)

    // Viewer cannot access editor routes
    expect(hasRole('viewer', 'editor')).toBe(false)

    // Instructor can access student routes
    expect(hasRole('instructor', 'student')).toBe(true)

    // Student cannot access instructor routes
    expect(hasRole('student', 'instructor')).toBe(false)

    // Admin can access any role
    expect(hasRole('admin', 'user')).toBe(true)
    expect(hasRole('admin', 'manager')).toBe(true)
  })

  it('should return correct role levels', () => {
    expect(getRoleLevel('viewer')).toBe(1)
    expect(getRoleLevel('editor')).toBe(2)
    expect(getRoleLevel('admin')).toBe(3)
    expect(getRoleLevel('student')).toBe(1)
    expect(getRoleLevel('instructor')).toBe(2)
    expect(getRoleLevel('invalid')).toBe(0)
  })

  it('should handle unknown roles gracefully', () => {
    expect(hasRole('unknown', 'editor')).toBe(false)
    expect(hasRole('editor', 'unknown')).toBe(true) // Any role >= 0
  })
})

