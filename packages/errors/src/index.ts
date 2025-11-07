// Error classes
export { AppError } from './errors/base'
export {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  ServiceUnavailableError,
} from './errors/http'
export {
  ExternalServiceError,
  DatabaseError,
  PaymentError,
  StorageError,
  APIError,
  TimeoutError,
} from './errors/integration'

// Types
export type { ErrorCode, ErrorSeverity, ErrorMetadata, ErrorOptions, SerializedError } from './types'

// Utilities
export { classifyError, shouldReportError } from './utils/error-classifier'

// Handlers (also exported via subpaths)
export * from './handlers'
