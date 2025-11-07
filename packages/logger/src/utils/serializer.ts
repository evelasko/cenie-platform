import safeStringify from 'fast-safe-stringify'

/**
 * Maximum depth for nested objects
 */
const MAX_DEPTH = 10

/**
 * Maximum string length for truncation
 */
const MAX_STRING_LENGTH = 10000

/**
 * Safely serialize any value to a JSON-serializable format
 */
export function serialize(value: any, depth = 0): any {
  // Prevent infinite recursion
  if (depth > MAX_DEPTH) {
    return '[Max Depth Reached]'
  }

  // Handle null and undefined
  if (value === null) return null
  if (value === undefined) return undefined

  // Handle primitives
  if (typeof value === 'string') {
    return value.length > MAX_STRING_LENGTH
      ? value.substring(0, MAX_STRING_LENGTH) + '...[truncated]'
      : value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  // Handle Date
  if (value instanceof Date) {
    return value.toISOString()
  }

  // Handle Error
  if (value instanceof Error) {
    return serializeError(value)
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map((item) => serialize(item, depth + 1))
  }

  // Handle Buffer
  if (Buffer.isBuffer(value)) {
    return `[Buffer ${value.length} bytes]`
  }

  // Handle Functions
  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`
  }

  // Handle Objects
  if (typeof value === 'object') {
    const serialized: Record<string, any> = {}

    for (const [key, val] of Object.entries(value)) {
      try {
        serialized[key] = serialize(val, depth + 1)
      } catch {
        serialized[key] = '[Serialization Error]'
      }
    }

    return serialized
  }

  // Fallback
  return String(value)
}

/**
 * Serialize an error object with stack trace
 */
export function serializeError(error: any): any {
  if (!(error instanceof Error)) {
    return { message: String(error) }
  }

  const serialized: any = {
    name: error.name,
    message: error.message,
  }

  // Include stack trace if available
  if (error.stack) {
    serialized.stack = error.stack
  }

  // Include error code if available
  if ('code' in error) {
    serialized.code = error.code
  }

  // Include status code if available
  if ('statusCode' in error) {
    serialized.statusCode = error.statusCode
  }

  // Include cause if available (Error.cause)
  if ('cause' in error && error.cause) {
    serialized.cause = serializeError(error.cause)
  }

  // Include any other custom properties
  for (const key of Object.keys(error)) {
    if (!['name', 'message', 'stack'].includes(key)) {
      try {
        serialized[key] = serialize((error as any)[key])
      } catch {
        // Skip properties that can't be serialized
      }
    }
  }

  return serialized
}

/**
 * Safe JSON stringify with circular reference handling
 */
export function safeJsonStringify(value: any, indent?: number): string {
  try {
    return safeStringify(value, undefined, indent)
  } catch {
    return '[Serialization Failed]'
  }
}
