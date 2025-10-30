# @cenie/auth-access - Access Control Package Specification

**Version**: 2.0.0  
**Package Name**: `@cenie/auth-access`  
**Dependencies**: `@cenie/auth-core`

---

## Purpose

Provides flexible, multi-backend access control system supporting RBAC (Role-Based), PBAC (Permission-Based), and ABAC (Attribute-Based) access control patterns with intelligent caching.

**Key Characteristics**:

- ✅ Multiple access control models
- ✅ Pluggable backends (Firestore, Supabase, API, memory)
- ✅ Intelligent caching with invalidation
- ✅ Real-time access change detection
- ✅ Audit trail support
- ✅ Type-safe policy definitions

---

## Core Interfaces

### Access Control Interface

```typescript
import type { User } from '@cenie/auth-core'

/**
 * Base access control interface
 */
export interface IAccessControl {
  /**
   * Check if user has role
   */
  hasRole(userId: string, roles: string | string[], context?: AccessContext): Promise<boolean>

  /**
   * Check if user has permission
   */
  hasPermission(
    userId: string,
    permissions: string | string[],
    context?: AccessContext
  ): Promise<boolean>

  /**
   * Check if user can perform action on resource
   */
  canAccess(
    userId: string,
    action: string,
    resource: string,
    context?: AccessContext
  ): Promise<AccessDecision>

  /**
   * Get user's roles
   */
  getUserRoles(userId: string, context?: AccessContext): Promise<string[]>

  /**
   * Get user's permissions
   */
  getUserPermissions(userId: string, context?: AccessContext): Promise<string[]>

  /**
   * Grant role to user
   */
  grantRole(
    userId: string,
    role: string,
    context?: AccessContext,
    grantedBy?: string
  ): Promise<void>

  /**
   * Revoke role from user
   */
  revokeRole(
    userId: string,
    role: string,
    context?: AccessContext,
    revokedBy?: string
  ): Promise<void>

  /**
   * Invalidate cache for user
   */
  invalidateCache(userId: string): Promise<void>
}

/**
 * Access context (app, tenant, etc.)
 */
export interface AccessContext {
  /** App name (for multi-app systems) */
  appName?: string

  /** Tenant ID (for multi-tenant systems) */
  tenantId?: string

  /** Resource ID being accessed */
  resourceId?: string

  /** Additional context */
  metadata?: Record<string, unknown>
}

/**
 * Access decision result
 */
export interface AccessDecision {
  /** Whether access is allowed */
  allowed: boolean

  /** Reason for decision */
  reason?: string

  /** Matched policy/rule */
  matchedPolicy?: string

  /** Required roles/permissions */
  requires?: {
    roles?: string[]
    permissions?: string[]
  }
}
```

---

## Role-Based Access Control (RBAC)

### Role Definition

```typescript
/**
 * Role definition
 */
export interface Role {
  /** Role identifier */
  id: string

  /** Role name */
  name: string

  /** Role description */
  description?: string

  /** Permissions included in role */
  permissions: string[]

  /** Parent roles (role hierarchy) */
  inherits?: string[]

  /** Metadata */
  metadata?: Record<string, unknown>
}

/**
 * User role assignment
 */
export interface UserRole {
  /** User ID */
  userId: string

  /** Role ID */
  roleId: string

  /** Context (app, tenant, etc.) */
  context?: AccessContext

  /** Whether role is active */
  isActive: boolean

  /** When granted */
  grantedAt: string

  /** Who granted it */
  grantedBy?: string

  /** Expiration (optional) */
  expiresAt?: string
}
```

### RBAC Implementation

```typescript
/**
 * Role-based access control implementation
 */
export class RBACAccessControl implements IAccessControl {
  constructor(
    private backend: IAccessBackend,
    private cache?: IAccessCache
  ) {}

  async hasRole(
    userId: string,
    roles: string | string[],
    context?: AccessContext
  ): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId, context)
    const requiredRoles = Array.isArray(roles) ? roles : [roles]

    // Check if user has any of the required roles
    return requiredRoles.some((role) => userRoles.includes(role))
  }

  async getUserRoles(userId: string, context?: AccessContext): Promise<string[]> {
    // Check cache first
    const cacheKey = this.getCacheKey('roles', userId, context)
    const cached = await this.cache?.get<string[]>(cacheKey)

    if (cached) {
      return cached
    }

    // Fetch from backend
    const roles = await this.backend.getUserRoles(userId, context)

    // Expand inherited roles
    const expandedRoles = await this.expandRoleHierarchy(roles)

    // Cache result
    await this.cache?.set(cacheKey, expandedRoles)

    return expandedRoles
  }

  async grantRole(
    userId: string,
    role: string,
    context?: AccessContext,
    grantedBy?: string
  ): Promise<void> {
    await this.backend.grantRole(userId, role, context, grantedBy)

    // Invalidate cache
    await this.invalidateCache(userId)
  }

  async revokeRole(
    userId: string,
    role: string,
    context?: AccessContext,
    revokedBy?: string
  ): Promise<void> {
    await this.backend.revokeRole(userId, role, context, revokedBy)

    // Invalidate cache
    await this.invalidateCache(userId)
  }

  async invalidateCache(userId: string): Promise<void> {
    if (!this.cache) return

    const patterns = [`roles:${userId}:*`, `permissions:${userId}:*`, `access:${userId}:*`]

    for (const pattern of patterns) {
      await this.cache.invalidate(pattern)
    }
  }

  private async expandRoleHierarchy(roles: string[]): Promise<string[]> {
    const expanded = new Set(roles)

    for (const roleId of roles) {
      const role = await this.backend.getRole(roleId)
      if (role?.inherits) {
        const inherited = await this.expandRoleHierarchy(role.inherits)
        inherited.forEach((r) => expanded.add(r))
      }
    }

    return Array.from(expanded)
  }

  private getCacheKey(type: string, userId: string, context?: AccessContext): string {
    const parts = [type, userId]

    if (context?.appName) parts.push(context.appName)
    if (context?.tenantId) parts.push(context.tenantId)

    return parts.join(':')
  }

  // ... other IAccessControl methods
}
```

---

## Permission-Based Access Control (PBAC)

### Permission Definition

```typescript
/**
 * Permission definition
 */
export interface Permission {
  /** Permission identifier */
  id: string

  /** Permission name */
  name: string

  /** Permission description */
  description?: string

  /** Resource this permission applies to */
  resource?: string

  /** Action this permission allows */
  action?: string

  /** Metadata */
  metadata?: Record<string, unknown>
}

/**
 * User permission assignment
 */
export interface UserPermission {
  /** User ID */
  userId: string

  /** Permission ID */
  permissionId: string

  /** Context */
  context?: AccessContext

  /** Whether permission is active */
  isActive: boolean

  /** When granted */
  grantedAt: string

  /** Who granted it */
  grantedBy?: string
}
```

---

## Attribute-Based Access Control (ABAC)

### Policy Definition

```typescript
/**
 * ABAC policy
 */
export interface ABACPolicy {
  /** Policy identifier */
  id: string

  /** Policy name */
  name: string

  /** Policy description */
  description?: string

  /** Effect (allow or deny) */
  effect: 'allow' | 'deny'

  /** Target resource */
  resource: string

  /** Actions this policy applies to */
  actions: string[]

  /** Conditions that must be met */
  conditions: PolicyCondition[]

  /** Priority (higher = evaluated first) */
  priority?: number
}

/**
 * Policy condition
 */
export interface PolicyCondition {
  /** Attribute to check */
  attribute: string

  /** Operator */
  operator: PolicyOperator

  /** Value to compare against */
  value: unknown

  /** Attribute source (user, resource, context) */
  source: 'user' | 'resource' | 'context'
}

export type PolicyOperator =
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'notIn'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'matches' // regex
```

### ABAC Implementation

```typescript
/**
 * Attribute-based access control
 */
export class ABACAccessControl {
  constructor(
    private policyStore: IPolicyStore,
    private attributeResolver: IAttributeResolver
  ) {}

  async evaluate(
    userId: string,
    action: string,
    resource: string,
    context?: AccessContext
  ): Promise<AccessDecision> {
    // Get applicable policies
    const policies = await this.policyStore.getPolicies({
      resource,
      action,
    })

    // Sort by priority
    policies.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

    // Get user attributes
    const userAttrs = await this.attributeResolver.getUserAttributes(userId)

    // Get resource attributes
    const resourceAttrs = await this.attributeResolver.getResourceAttributes(resource, context)

    // Evaluate policies
    for (const policy of policies) {
      const matches = await this.evaluatePolicy(policy, userAttrs, resourceAttrs, context)

      if (matches) {
        return {
          allowed: policy.effect === 'allow',
          reason: `Matched policy: ${policy.name}`,
          matchedPolicy: policy.id,
        }
      }
    }

    // No policy matched, default deny
    return {
      allowed: false,
      reason: 'No matching policy found',
    }
  }

  private async evaluatePolicy(
    policy: ABACPolicy,
    userAttrs: Record<string, unknown>,
    resourceAttrs: Record<string, unknown>,
    context?: AccessContext
  ): Promise<boolean> {
    for (const condition of policy.conditions) {
      const attrs =
        condition.source === 'user'
          ? userAttrs
          : condition.source === 'resource'
            ? resourceAttrs
            : (context?.metadata ?? {})

      const attributeValue = attrs[condition.attribute]

      if (!this.evaluateCondition(condition, attributeValue)) {
        return false
      }
    }

    return true
  }

  private evaluateCondition(condition: PolicyCondition, value: unknown): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value

      case 'notEquals':
        return value !== condition.value

      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value)

      case 'greaterThan':
        return Number(value) > Number(condition.value)

      case 'contains':
        return String(value).includes(String(condition.value))

      // ... other operators

      default:
        return false
    }
  }
}

/**
 * Attribute resolver interface
 */
export interface IAttributeResolver {
  getUserAttributes(userId: string): Promise<Record<string, unknown>>
  getResourceAttributes(resource: string, context?: AccessContext): Promise<Record<string, unknown>>
}
```

---

## Access Backends

### Backend Interface

```typescript
/**
 * Access control backend interface
 */
export interface IAccessBackend {
  /**
   * Get user's roles
   */
  getUserRoles(userId: string, context?: AccessContext): Promise<string[]>

  /**
   * Get role definition
   */
  getRole(roleId: string): Promise<Role | null>

  /**
   * Grant role to user
   */
  grantRole(
    userId: string,
    role: string,
    context?: AccessContext,
    grantedBy?: string
  ): Promise<void>

  /**
   * Revoke role from user
   */
  revokeRole(
    userId: string,
    role: string,
    context?: AccessContext,
    revokedBy?: string
  ): Promise<void>

  // ... other methods
}
```

### Firestore Backend

```typescript
/**
 * Firestore access control backend
 */
export class FirestoreAccessBackend implements IAccessBackend {
  constructor(private firestore: Firestore) {}

  async getUserRoles(userId: string, context?: AccessContext): Promise<string[]> {
    let query = this.firestore
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('isActive', '==', true)

    if (context?.appName) {
      query = query.where('appName', '==', context.appName)
    }

    const snapshot = await query.get()

    return snapshot.docs.map((doc) => doc.data().role)
  }

  async grantRole(
    userId: string,
    role: string,
    context?: AccessContext,
    grantedBy?: string
  ): Promise<void> {
    await this.firestore.collection('user_app_access').add({
      userId,
      role,
      appName: context?.appName,
      tenantId: context?.tenantId,
      isActive: true,
      grantedAt: Timestamp.now(),
      grantedBy: grantedBy ?? null,
    })
  }

  // ... other methods
}
```

### Supabase Backend

```typescript
/**
 * Supabase access control backend
 */
export class SupabaseAccessBackend implements IAccessBackend {
  constructor(private supabase: SupabaseClient) {}

  async getUserRoles(userId: string, context?: AccessContext): Promise<string[]> {
    let query = this.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (context?.appName) {
      query = query.eq('app_name', context.appName)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map((row) => row.role)
  }

  // ... other methods
}
```

### API Backend

```typescript
/**
 * API-based access control backend
 */
export class APIAccessBackend implements IAccessBackend {
  constructor(
    private apiUrl: string,
    private getAuthToken: () => Promise<string>
  ) {}

  async getUserRoles(userId: string, context?: AccessContext): Promise<string[]> {
    const token = await this.getAuthToken()
    const params = new URLSearchParams({
      userId,
      ...(context?.appName && { appName: context.appName }),
    })

    const response = await fetch(`${this.apiUrl}/access/roles?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch roles')
    }

    const data = await response.json()
    return data.roles
  }

  // ... other methods
}
```

---

## Caching Layer

### Cache Interface

```typescript
/**
 * Access control cache interface
 */
export interface IAccessCache {
  /**
   * Get cached value
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set cached value
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>

  /**
   * Invalidate cache entry
   */
  invalidate(pattern: string): Promise<void>

  /**
   * Clear all cache
   */
  clear(): Promise<void>
}
```

### Memory Cache Implementation

```typescript
/**
 * In-memory access cache with TTL
 */
export class MemoryAccessCache implements IAccessCache {
  private cache = new Map<string, CacheEntry>()
  private defaultTTL: number

  constructor(options: { ttl?: number } = {}) {
    this.defaultTTL = options.ttl ?? 5 * 60 * 1000 // 5 minutes

    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)

    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl ?? this.defaultTTL),
    })
  }

  async invalidate(pattern: string): Promise<void> {
    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

interface CacheEntry {
  value: unknown
  expiresAt: number
}
```

---

## Access Manager

### Unified Access Manager

```typescript
/**
 * High-level access manager
 */
export class AccessManager {
  private accessControl: IAccessControl

  constructor(config: AccessManagerConfig) {
    // Initialize backend
    const backend = this.createBackend(config.backend)

    // Initialize cache if enabled
    const cache = config.cache?.enabled
      ? new MemoryAccessCache({ ttl: config.cache.ttl })
      : undefined

    // Initialize access control
    this.accessControl = new RBACAccessControl(backend, cache)
  }

  /**
   * Check access for user
   */
  async check(
    userId: string,
    requirement: AccessRequirement,
    context?: AccessContext
  ): Promise<boolean> {
    // Check roles
    if (requirement.roles) {
      const hasRole = await this.accessControl.hasRole(userId, requirement.roles, context)

      if (!hasRole) return false
    }

    // Check permissions
    if (requirement.permissions) {
      const hasPermission = await this.accessControl.hasPermission(
        userId,
        requirement.permissions,
        context
      )

      if (!hasPermission) return false
    }

    // Check resource access
    if (requirement.resource && requirement.action) {
      const decision = await this.accessControl.canAccess(
        userId,
        requirement.action,
        requirement.resource,
        context
      )

      if (!decision.allowed) return false
    }

    return true
  }

  private createBackend(config: BackendConfig): IAccessBackend {
    switch (config.type) {
      case 'firestore':
        return new FirestoreAccessBackend(config.firestore)

      case 'supabase':
        return new SupabaseAccessBackend(config.supabase)

      case 'api':
        return new APIAccessBackend(config.apiUrl, config.getAuthToken)

      default:
        throw new Error(`Unknown backend type: ${config.type}`)
    }
  }
}

export interface AccessManagerConfig {
  backend: BackendConfig
  cache?: {
    enabled: boolean
    ttl?: number
  }
}

export type BackendConfig =
  | { type: 'firestore'; firestore: Firestore }
  | { type: 'supabase'; supabase: SupabaseClient }
  | { type: 'api'; apiUrl: string; getAuthToken: () => Promise<string> }

export interface AccessRequirement {
  roles?: string[]
  permissions?: string[]
  resource?: string
  action?: string
}
```

---

## Package Exports

```typescript
// Core interfaces
export type { IAccessControl, IAccessBackend, IAccessCache } from './interfaces'

// RBAC
export { RBACAccessControl } from './rbac'
export type { Role, UserRole } from './rbac'

// PBAC
export type { Permission, UserPermission } from './pbac'

// ABAC
export { ABACAccessControl } from './abac'
export type { ABACPolicy, PolicyCondition } from './abac'

// Backends
export { FirestoreAccessBackend, SupabaseAccessBackend, APIAccessBackend } from './backends'

// Caching
export { MemoryAccessCache } from './cache'

// Access Manager
export { AccessManager } from './manager'
export type { AccessManagerConfig, AccessRequirement } from './manager'
```

---

**Next: Implementation Summary Document**
