/**
 * Simple In-Memory Rate Limiter
 * 
 * This is a basic rate limiter suitable for small to medium traffic.
 * For high-traffic production use, consider using:
 * - Vercel KV (Redis)
 * - Upstash Redis
 * - Edge Config
 * 
 * Note: This implementation uses in-memory storage, which means:
 * - Rate limits reset on server restart
 * - Not shared across serverless function instances
 * - Suitable for protecting against basic abuse
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

/**
 * In-memory store for rate limit tracking
 * Key format: "{identifier}:{window}"
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Clean up expired entries periodically to prevent memory leaks
 * Runs every 10 minutes
 */
const CLEANUP_INTERVAL = 10 * 60 * 1000 // 10 minutes

let cleanupTimer: NodeJS.Timeout | null = null

function startCleanup() {
  if (cleanupTimer) return

  cleanupTimer = setInterval(() => {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => rateLimitStore.delete(key))

    // Log cleanup stats in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RateLimiter] Cleaned up ${keysToDelete.length} expired entries`)
    }
  }, CLEANUP_INTERVAL)
}

// Start cleanup on module load
if (typeof window === 'undefined') {
  // Only run in server-side environment
  startCleanup()
}

export interface RateLimitConfig {
  /**
   * Unique identifier for the rate limit (e.g., IP address, user ID, API key)
   */
  identifier: string

  /**
   * Maximum number of requests allowed within the window
   * @default 10
   */
  limit?: number

  /**
   * Time window in seconds
   * @default 3600 (1 hour)
   */
  windowSeconds?: number
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean

  /**
   * Current number of requests in the window
   */
  count: number

  /**
   * Maximum allowed requests
   */
  limit: number

  /**
   * Remaining requests in the window
   */
  remaining: number

  /**
   * Timestamp when the rate limit resets (Unix timestamp in ms)
   */
  resetAt: number

  /**
   * Seconds until reset
   */
  resetInSeconds: number
}

/**
 * Check and update rate limit for an identifier
 */
export function rateLimit(config: RateLimitConfig): RateLimitResult {
  const {
    identifier,
    limit = 10,
    windowSeconds = 3600, // 1 hour default
  } = config

  const now = Date.now()
  const windowMs = windowSeconds * 1000

  // Create a unique key for this identifier and window
  const windowKey = Math.floor(now / windowMs)
  const key = `${identifier}:${windowKey}`

  // Get or create entry
  let entry = rateLimitStore.get(key)

  if (!entry) {
    // Create new entry
    entry = {
      count: 0,
      resetAt: now + windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment count
  entry.count++

  const remaining = Math.max(0, limit - entry.count)
  const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000)

  return {
    success: entry.count <= limit,
    count: entry.count,
    limit,
    remaining,
    resetAt: entry.resetAt,
    resetInSeconds,
  }
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(config: RateLimitConfig): RateLimitResult {
  const {
    identifier,
    limit = 10,
    windowSeconds = 3600,
  } = config

  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const windowKey = Math.floor(now / windowMs)
  const key = `${identifier}:${windowKey}`

  const entry = rateLimitStore.get(key)

  if (!entry) {
    return {
      success: true,
      count: 0,
      limit,
      remaining: limit,
      resetAt: now + windowMs,
      resetInSeconds: windowSeconds,
    }
  }

  const remaining = Math.max(0, limit - entry.count)
  const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000)

  return {
    success: entry.count < limit,
    count: entry.count,
    limit,
    remaining,
    resetAt: entry.resetAt,
    resetInSeconds,
  }
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual overrides
 */
export function resetRateLimit(identifier: string): void {
  const keysToDelete: string[] = []

  for (const key of rateLimitStore.keys()) {
    if (key.startsWith(`${identifier}:`)) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach((key) => rateLimitStore.delete(key))
}

/**
 * Get rate limit headers for HTTP response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toString(),
    'Retry-After': result.resetInSeconds.toString(),
  }
}

