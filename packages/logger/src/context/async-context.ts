import { AsyncLocalStorage } from 'async_hooks'

/**
 * Context storage for request-scoped data
 */
class LogContextStore {
  private storage = new AsyncLocalStorage<Map<string, any>>()

  /**
   * Run a function with the given context
   */
  run<T>(context: Record<string, any>, callback: () => T): T {
    const store = new Map(Object.entries(context))
    return this.storage.run(store, callback)
  }

  /**
   * Get a specific context value
   */
  get(key: string): any {
    return this.storage.getStore()?.get(key)
  }

  /**
   * Set a context value in the current store
   */
  set(key: string, value: any): void {
    const store = this.storage.getStore()
    if (store) {
      store.set(key, value)
    }
  }

  /**
   * Get all context values
   */
  getAll(): Record<string, any> {
    const store = this.storage.getStore()
    if (!store) return {}

    return Object.fromEntries(store.entries())
  }

  /**
   * Clear all context
   */
  clear(): void {
    const store = this.storage.getStore()
    if (store) {
      store.clear()
    }
  }

  /**
   * Check if we're in an active context
   */
  hasContext(): boolean {
    return this.storage.getStore() !== undefined
  }
}

/**
 * Global log context store
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
