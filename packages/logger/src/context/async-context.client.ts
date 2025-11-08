/**
 * Client-side context storage (browser-safe)
 * This is a simplified version that doesn't use async_hooks
 */

/**
 * Context storage for client-side (browser) environments
 * Note: This provides a simplified API without async context support
 */
class LogContextStore {
  // In-memory storage for client-side context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private contextMap = new Map<string, any>()

  /**
   * Run a function with the given context
   * Note: Client-side version just executes the callback with stored context
   */
  run<T>(context: Record<string, unknown>, callback: () => T): T {
    // Store context temporarily
    const previousContext = new Map(this.contextMap)

    // Set new context
    Object.entries(context).forEach(([key, value]) => {
      this.contextMap.set(key, value)
    })

    try {
      return callback()
    } finally {
      // Restore previous context
      this.contextMap = previousContext
    }
  }

  /**
   * Get a specific context value
   */
  get<T>(key: string): T | undefined {
    return this.contextMap.get(key) as T | undefined
  }

  /**
   * Set a context value
   */
  set<T>(key: string, value: T): void {
    this.contextMap.set(key, value)
  }

  /**
   * Get all context values
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll(): Record<string, any> {
    return Object.fromEntries(this.contextMap.entries())
  }

  /**
   * Clear all context
   */
  clear(): void {
    this.contextMap.clear()
  }

  /**
   * Check if we have any context
   */
  hasContext(): boolean {
    return this.contextMap.size > 0
  }
}

/**
 * Global log context store (client-side)
 */
export const logContext = new LogContextStore()

/**
 * Common context keys
 */
export const ContextKeys = {
  REQUEST_ID: 'requestId',
  USER_ID: 'userId',
  SESSION_ID: 'sessionId',
  IP_ADDRESS: 'ipAddress',
  USER_AGENT: 'userAgent',
  PATH: 'path',
  METHOD: 'method',
} as const
