/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

/**
 * Error codes for classification
 */
export type ErrorCode = string

/**
 * Error metadata
 */
export interface ErrorMetadata {
  [key: string]: any
}

/**
 * Serialized error for API responses
 */
export interface SerializedError {
  code: ErrorCode
  message: string
  statusCode: number
  requestId?: string
  details?: string
  timestamp?: string
  stack?: string
  cause?: SerializedError
}

/**
 * Error options for AppError constructor
 */
export interface ErrorOptions {
  cause?: Error | unknown
  metadata?: ErrorMetadata
  statusCode?: number
  userMessage?: string
  details?: string
  retryable?: boolean
}
