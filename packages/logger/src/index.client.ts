// Core exports (client-safe)
export { Logger, createLogger } from './core/logger.client'
export { LogLevel } from './core/types'
export type {
  ILogger,
  LoggerConfig,
  LogEntry,
  LogContext,
  LogLevelName,
  Environment,
  Transport,
  ErrorInfo,
} from './core/types'

// Levels
export { parseLogLevel, getLogLevelName, shouldLog } from './core/levels'

// Transports
export { ConsoleTransport } from './transports/console'
export type { ConsoleTransportConfig } from './transports/console'

// Presets
export { developmentPreset, productionPreset, testingPreset } from './presets'

// Context (client-side version)
export { logContext, ContextKeys } from './context/async-context.client'

// Utils
export { sanitize, DEFAULT_REDACT_FIELDS, maskEmail, maskCreditCard } from './utils/sanitizer'
export { serialize, serializeError, safeJsonStringify } from './utils/serializer'
