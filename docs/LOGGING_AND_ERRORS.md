# Centralized Logging and Error Handling

This document provides an overview of the centralized logging and error handling packages implemented for the CENIE platform.

## Packages

### @cenie/logger

Centralized logging package with structured logging, request correlation, and automatic PII redaction.

**Location**: `packages/logger/`

**Key Features**:
- Structured JSON logging
- Request correlation tracking (requestId, userId, sessionId)
- Automatic PII redaction
- Pretty console output in development
- Multiple log levels (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
- Next.js and Express middleware
- AsyncLocalStorage for context propagation

**See**: [packages/logger/README.md](../packages/logger/README.md)

### @cenie/errors

Centralized error handling package with typed error classes and automatic classification.

**Location**: `packages/errors/`

**Key Features**:
- Comprehensive error class hierarchy
- Automatic error classification (Zod, Firebase, Postgres, etc.)
- Automatic logging integration
- Request correlation
- Separate user-facing vs internal messages
- Next.js, Express, and React error handlers
- Retry logic support

**See**: [packages/errors/README.md](../packages/errors/README.md)

## Quick Start

### Basic Usage (Next.js API Route)

```typescript
import { createLogger } from '@cenie/logger'
import { withErrorHandling, NotFoundError } from '@cenie/errors'

const logger = createLogger({ name: 'api:users' })

export const GET = withErrorHandling(async (request, { params }) => {
  logger.info('Fetching user', { userId: params.id })

  const user = await getUser(params.id)

  if (!user) {
    throw new NotFoundError('User not found', {
      metadata: { userId: params.id }
    })
  }

  logger.debug('User found', { user })
  return NextResponse.json({ user })
})
```

### Express Service

```typescript
import { createLogger } from '@cenie/logger'
import { requestLogger, errorLogger } from '@cenie/logger/express'
import { asyncHandler, NotFoundError } from '@cenie/errors'

const logger = createLogger({ name: 'auth-api' })

app.use(requestLogger(logger))

app.get('/users/:id', asyncHandler(async (req, res) => {
  req.log.info('Fetching user')

  const user = await getUser(req.params.id)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  res.json({ user })
}))

app.use(errorLogger())
```

### React Component

```typescript
import { ErrorBoundary } from '@cenie/errors/react'

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

## Architecture

### Integration

```
@cenie/errors
    ↓ depends on
@cenie/logger
    ↓ provides
Structured logging + Context management
```

Both packages share:
- **AsyncLocalStorage**: Single context store for requestId, userId, etc.
- **PII Sanitizer**: Shared redaction logic
- **Error Serialization**: Common error formatting

### Context Flow

```
Request → Middleware → AsyncLocalStorage → Logger/Errors → Response
                  ↓
             Automatic context:
             - requestId
             - userId
             - sessionId
             - path, method
             - IP, userAgent
```

## Error Handling Flow

1. **Error Thrown**: Any error thrown in application code
2. **Classification**: `classifyError()` converts to appropriate `AppError` type
3. **Logging**: Error automatically logs itself with context
4. **Response**: Formatted JSON response with appropriate status code

### Error Types

| Error | Status | Use Case |
|-------|--------|----------|
| `ValidationError` | 400 | Invalid input |
| `AuthenticationError` | 401 | Auth failed |
| `AuthorizationError` | 403 | Permission denied |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate/conflict |
| `RateLimitError` | 429 | Rate limiting |
| `DatabaseError` | 502 | Database failures |
| `InternalError` | 500 | Unexpected errors |

## Logging Levels

| Level | Value | Use Case | Severity |
|-------|-------|----------|----------|
| TRACE | 0 | Very detailed debugging | - |
| DEBUG | 10 | Development debugging | low |
| INFO | 20 | General information | medium |
| WARN | 30 | Warnings | medium |
| ERROR | 40 | Errors | high |
| FATAL | 50 | Critical failures | critical |

### Environment Defaults

- **Development**: DEBUG level, pretty console output
- **Production**: INFO level, JSON output
- **Testing**: WARN level, silent

## Context Management

### Automatic Context

All logs and errors automatically include:
- `requestId`: Unique request identifier
- `userId`: Authenticated user ID (after auth)
- `sessionId`: Session identifier
- `path`: Request path
- `method`: HTTP method
- `ipAddress`: Client IP
- `userAgent`: User agent string

### Adding Custom Context

```typescript
// Next.js
import { setUserContext, addContext } from '@cenie/logger/next'

const user = await authenticate(request)
setUserContext(user.id, user.sessionId)
addContext('organizationId', user.organizationId)

// Express
import { setUserContext, addContext } from '@cenie/logger/express'

app.use((req, res, next) => {
  if (req.user) {
    setUserContext(req.user.id)
  }
  next()
})
```

## PII Redaction

Automatically redacts sensitive fields:
- password, token, apiKey, secret, authorization
- cookie, creditCard, ssn, privateKey
- accessToken, refreshToken, idToken

```typescript
logger.info('User data', {
  email: 'user@example.com',
  password: 'secret123', // → '[REDACTED]'
  token: 'abc123',       // → '[REDACTED]'
})
```

Add custom redacted fields:

```typescript
const logger = createLogger({
  name: 'app',
  redact: ['internalId', 'customSecret'],
})
```

## Migration from Console Logging

### Before

```typescript
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Fetching data')
    const data = await getData()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
```

### After

```typescript
import { createLogger } from '@cenie/logger'
import { withErrorHandling, DatabaseError } from '@cenie/errors'

const logger = createLogger({ name: 'api:data' })

export const GET = withErrorHandling(async (request) => {
  logger.info('Fetching data')

  const data = await getData()

  logger.debug('Data fetched', { count: data.length })
  return NextResponse.json({ data })
})
```

## Best Practices

### Logging

✅ **DO**:
- Use appropriate log levels
- Include structured metadata
- Log business events (user actions)
- Log errors with context

❌ **DON'T**:
- Log sensitive data (passwords, tokens)
- Use string interpolation (use metadata)
- Log excessive debug info in production

### Error Handling

✅ **DO**:
- Use specific error types
- Provide context in metadata
- Chain errors with `cause`
- Separate user messages from internal details

❌ **DON'T**:
- Throw generic `Error` objects
- Lose original error context
- Expose internal details to users

## Performance

- **Logger creation**: < 0.1ms
- **Log entry**: < 2ms
- **Error classification**: < 1ms
- **Memory overhead**: Minimal (~1KB per logger instance)

## Next Steps

1. **Sentry Integration** (Phase 3): Add `@cenie/sentry` package for error tracking
2. **Performance Monitoring**: Instrument slow operations
3. **Log Aggregation**: Send logs to external service (Datadog, CloudWatch)
4. **Alerts**: Set up alerts for ERROR/FATAL logs
5. **Dashboards**: Create observability dashboards

## Support

For issues or questions:
- See package READMEs for detailed API documentation
- Check examples in `/docs/examples/`
- Contact platform team

## Related Documentation

- [Logger Package README](../packages/logger/README.md)
- [Errors Package README](../packages/errors/README.md)
- [CLAUDE.md](../CLAUDE.md) - Development commands and conventions
