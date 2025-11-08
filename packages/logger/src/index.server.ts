// Core exports (server-side)
export { Logger, createLogger } from './core/logger'
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

// Context (server-side version with async_hooks)
export { logContext, ContextKeys } from './context/async-context.server'

// Utils
export { sanitize, DEFAULT_REDACT_FIELDS, maskEmail, maskCreditCard } from './utils/sanitizer'
export { serialize, serializeError, safeJsonStringify } from './utils/serializer'
