/**
 * Conditional export for async context based on environment
 * - Server-side (Node.js): Uses AsyncLocalStorage from async_hooks
 * - Client-side (Browser): Uses simplified in-memory context
 */

// Re-export from the appropriate implementation
export { logContext, ContextKeys } from './async-context.server'
