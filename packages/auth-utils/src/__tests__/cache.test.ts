import { beforeEach, describe, expect, it } from 'vitest'

import { accessCache } from '../access-control/cache'

describe('Access Cache', () => {
  beforeEach(() => {
    accessCache.clearAll()
  })

  it('should cache and retrieve access data', () => {
    const accessData = {
      hasAccess: true,
      role: 'editor',
      isActive: true,
    }

    accessCache.set('user123', 'editorial', accessData)

    const cached = accessCache.get('user123', 'editorial')
    expect(cached).toEqual(accessData)
  })

  it('should return null for non-existent cache', () => {
    const cached = accessCache.get('user999', 'editorial')
    expect(cached).toBeNull()
  })

  it('should return null for expired cache', async () => {
    const accessData = {
      hasAccess: true,
      role: 'editor',
      isActive: true,
    }

    // Set with 100ms TTL
    accessCache.set('user123', 'editorial', accessData, 100)

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 150))

    const cached = accessCache.get('user123', 'editorial')
    expect(cached).toBeNull()
  })

  it('should clear specific cache entry', () => {
    accessCache.set('user123', 'editorial', { hasAccess: true, role: 'editor', isActive: true })

    accessCache.clear('user123', 'editorial')

    expect(accessCache.get('user123', 'editorial')).toBeNull()
  })

  it('should clear all cache entries for a user', () => {
    accessCache.set('user123', 'editorial', { hasAccess: true, role: 'editor', isActive: true })
    accessCache.set('user123', 'hub', { hasAccess: true, role: 'user', isActive: true })
    accessCache.set('user456', 'editorial', { hasAccess: true, role: 'viewer', isActive: true })

    accessCache.clearUser('user123')

    expect(accessCache.get('user123', 'editorial')).toBeNull()
    expect(accessCache.get('user123', 'hub')).toBeNull()
    expect(accessCache.get('user456', 'editorial')).not.toBeNull()
  })

  it('should clear all cache', () => {
    accessCache.set('user123', 'editorial', { hasAccess: true, role: 'editor', isActive: true })
    accessCache.set('user456', 'hub', { hasAccess: true, role: 'user', isActive: true })

    accessCache.clearAll()

    expect(accessCache.get('user123', 'editorial')).toBeNull()
    expect(accessCache.get('user456', 'hub')).toBeNull()
  })
})

