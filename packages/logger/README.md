# @cenie/logger

Centralized logging package for CENIE Platform with structured logging, request correlation, and automatic PII redaction.

## Features

- 🎯 **Structured JSON Logging**: Consistent log format across all apps
- 🔗 **Request Correlation**: Automatic requestId tracking
- 🔒 **PII Redaction**: Automatic sanitization of sensitive data
- 🎨 **Pretty Console**: Colorized output in development
- ⚡ **Zero-Config Defaults**: Works out of the box
- 📊 **Multiple Transports**: Console (more coming)
- 🏷️ **Contextual Logging**: Child loggers with inherited context

## Installation

Already included in the monorepo as `@cenie/logger`.

## Quick Start

### Next.js API Routes

```typescript
import { createLogger } from '@cenie/logger'
import { withLogging } from '@cenie/logger/next'

const logger = createLogger({ name: 'api:users' })

export const GET = withLogging(async (request) => {
  logger.info('Fetching users')

  try {
    const users = await getUsers()
    logger.debug('Users fetched', { count: users.length })
    return NextResponse.json({ users })
  } catch (error) {
    logger.error('Failed to fetch users', error)
    throw error
  }
})
```

### Express Services

```typescript
import { createLogger } from '@cenie/logger'
import { requestLogger, errorLogger } from '@cenie/logger/express'

const logger = createLogger({ name: 'auth-api' })

app.use(requestLogger(logger))

app.get('/users', (req, res) => {
  req.log.info('Fetching users')
  // ... handle request
})

// After all routes
app.use(errorLogger())
```

## Log Levels

- `TRACE` (0): Very detailed debugging
- `DEBUG` (10): Debugging information
- `INFO` (20): General information (default)
- `WARN` (30): Warning messages
- `ERROR` (40): Error messages
- `FATAL` (50): Fatal errors

## Configuration

### Basic Configuration

```typescript
import { createLogger, LogLevel } from '@cenie/logger'

const logger = createLogger({
  name: 'my-app',
  level: LogLevel.INFO, // or 'info'
  environment: 'production',
})
```

### Using Presets

```typescript
import { createLogger, developmentPreset, productionPreset } from '@cenie/logger'

// Development: DEBUG level, pretty print
const logger = createLogger(
  developmentPreset('my-app', { version: '1.0.0' })
)

// Production: INFO level, JSON output
const logger = createLogger(
  productionPreset('my-app', { version: '1.0.0' })
)
```

### Custom Configuration

```typescript
import { createLogger, ConsoleTransport } from '@cenie/logger'

const logger = createLogger({
  name: 'my-app',
  level: 'debug',
  context: { version: '1.0.0' },
  transports: [new ConsoleTransport({ prettyPrint: true })],
  redact: ['customSecret', 'internalId'],
  prettyPrint: true,
})
```

## Usage Examples

### Basic Logging

```typescript
logger.info('User logged in', { userId: '123' })
logger.debug('Cache hit', { key: 'user:123' })
logger.warn('Rate limit approaching', { remaining: 10 })
logger.error('Database error', error, { query: 'SELECT ...' })
```

### Child Loggers

```typescript
const requestLogger = logger.child({ requestId: 'req_123' })

requestLogger.info('Processing request')
// Includes: { requestId: 'req_123' } automatically
```

### Request Context

```typescript
import { setUserContext } from '@cenie/logger/next'

// After authentication
const user = await authenticate(request)
setUserContext(user.id, user.sessionId)

// All subsequent logs include userId and sessionId
logger.info('Action performed')
```

## PII Redaction

Automatically redacts sensitive fields:

```typescript
logger.info('User data', {
  email: 'user@example.com',
  password: 'secret123', // Automatically redacted
  token: 'abc123',       // Automatically redacted
})

// Output:
// {
//   email: 'user@example.com',
//   password: '[REDACTED]',
//   token: '[REDACTED]'
// }
```

Default redacted fields:
- password, token, apiKey, secret, authorization
- cookie, creditCard, ssn, privateKey
- accessToken, refreshToken, idToken

Add custom fields:

```typescript
const logger = createLogger({
  name: 'app',
  redact: ['customSecret', 'internalId'],
})
```

## Environment-Specific Behavior

### Development
- Log level: DEBUG
- Pretty printed console output
- Colorized logs
- Full stack traces

### Production
- Log level: INFO
- JSON formatted output
- Suitable for log aggregation
- PII redaction enforced

### Testing
- Log level: WARN
- Minimal output
- Silent by default

## Best Practices

### What to Log

✅ **DO:**
- User actions (login, order created)
- API requests/responses
- Errors with context
- Performance metrics

❌ **DON'T:**
- Sensitive data (passwords, tokens)
- Excessive debug logs in production
- Request/response bodies by default

### Log Message Format

```typescript
// Good: Structured data
logger.info('User subscription created', {
  userId: '123',
  plan: 'premium',
  amount: 99.99,
})

// Bad: String interpolation
logger.info(`User 123 subscribed to premium for $99.99`)
```

### Error Logging

```typescript
// Good: Include error and context
try {
  await processPayment(order)
} catch (error) {
  logger.error('Payment processing failed', error, {
    orderId: order.id,
    amount: order.total,
  })
  throw error
}

// Bad: Lose error information
catch (error) {
  logger.error('Payment failed')
}
```

## API Reference

### createLogger(config)

Creates a new logger instance.

**Parameters:**
- `config.name` (string): Logger name (e.g., 'hub', 'api:users')
- `config.level` (LogLevel | string): Minimum log level (default: INFO)
- `config.environment` (string): Environment ('development' | 'production' | 'test')
- `config.context` (object): Default context included in all logs
- `config.transports` (Transport[]): Output destinations
- `config.redact` (string[]): Additional fields to redact
- `config.prettyPrint` (boolean): Pretty print output

### Logger Methods

- `logger.trace(message, metadata?)`: TRACE level
- `logger.debug(message, metadata?)`: DEBUG level
- `logger.info(message, metadata?)`: INFO level
- `logger.warn(message, metadata?)`: WARN level
- `logger.error(message, error?, metadata?)`: ERROR level
- `logger.fatal(message, error?, metadata?)`: FATAL level
- `logger.child(context)`: Create child logger with additional context

### Middleware

- `withLogging(handler)`: Next.js route wrapper
- `requestLogger(logger)`: Express request logging
- `errorLogger()`: Express error logging
- `setUserContext(userId, sessionId?)`: Add user to context
- `addContext(key, value)`: Add custom context

## Integration with Error Handling

This package is designed to work seamlessly with `@cenie/errors`:

```typescript
import { createLogger } from '@cenie/logger'
import { NotFoundError } from '@cenie/errors'

const logger = createLogger({ name: 'api' })

// Errors are automatically logged when thrown
throw new NotFoundError('User not found', { userId: '123' })
// Logger receives: ERROR level with full error details
```

## Performance

- Log formatting: < 1ms per entry
- Console output: < 5ms per entry
- Async writes: Non-blocking
- Memory: Minimal overhead

## Troubleshooting

### Logs not appearing

Check log level:
```typescript
logger.debug('This message') // Only shows if level <= DEBUG
```

### Context not included

Ensure middleware is used:
```typescript
export const GET = withLogging(async (request) => {
  // Context available here
})
```

### PII showing in logs

Add fields to redact list:
```typescript
const logger = createLogger({
  name: 'app',
  redact: ['customSensitiveField'],
})
```

## License

Private - CENIE Platform
