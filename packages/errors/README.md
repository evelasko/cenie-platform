# @cenie/errors

Centralized error handling package for CENIE Platform with typed error classes, automatic classification, and seamless integration with `@cenie/logger`.

## Features

- 🎯 **Typed Error Classes**: Comprehensive error hierarchy
- 🔄 **Automatic Classification**: Convert any error to appropriate type
- 📝 **Automatic Logging**: Errors log themselves with proper context
- 🔗 **Request Correlation**: Automatic requestId tracking
- 🛡️ **Safe User Messages**: Separate internal vs user-facing messages
- ⚡ **Framework Integration**: Next.js, Express, and React support
- 🔁 **Retry Logic**: Built-in retryable flag
- 📊 **Severity Levels**: low, medium, high, critical

## Installation

Already included in the monorepo as `@cenie/errors`.

## Quick Start

### Next.js API Routes

```typescript
import { withErrorHandling, NotFoundError } from '@cenie/errors'

export const GET = withErrorHandling(async (request, { params }) => {
  const user = await getUser(params.id)

  if (!user) {
    throw new NotFoundError('User not found', {
      metadata: { userId: params.id }
    })
  }

  return NextResponse.json({ user })
})
```

### Express Services

```typescript
import { errorHandler, asyncHandler, NotFoundError } from '@cenie/errors'

// Wrap async route handlers
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  res.json({ user })
}))

// Add error handler after all routes
app.use(errorHandler())
```

### React Components

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

## Error Classes

### HTTP Errors

| Class | Status | Use Case |
|-------|--------|----------|
| `ValidationError` | 400 | Invalid input data |
| `AuthenticationError` | 401 | Failed authentication |
| `AuthorizationError` | 403 | Permission denied |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate/conflict |
| `RateLimitError` | 429 | Rate limiting |
| `InternalError` | 500 | Unexpected errors |
| `ServiceUnavailableError` | 503 | Temporary outage |

### Integration Errors

| Class | Status | Use Case |
|-------|--------|----------|
| `DatabaseError` | 502 | Database failures |
| `PaymentError` | 502 | Payment processing |
| `StorageError` | 502 | Cloud storage |
| `APIError` | 502 | External API failures |
| `TimeoutError` | 504 | Operation timeouts |

## Usage Examples

### Basic Error Throwing

```typescript
import { NotFoundError, ValidationError } from '@cenie/errors'

// Simple error
throw new NotFoundError('User not found')

// With metadata
throw new NotFoundError('User not found', {
  metadata: { userId: '123' }
})

// With custom user message
throw new ValidationError('Invalid email format', {
  userMessage: 'Please provide a valid email address',
  metadata: { field: 'email', value: 'invalid' }
})

// With cause (error chaining)
try {
  await database.query(sql)
} catch (error) {
  throw new DatabaseError('Failed to fetch users', { cause: error })
}
```

### Error Classification

Automatically converts any error to appropriate type:

```typescript
import { classifyError } from '@cenie/errors'

try {
  await someOperation()
} catch (error) {
  const appError = classifyError(error)
  // appError is now a typed AppError

  console.log(appError.code)        // e.g., 'NOT_FOUND'
  console.log(appError.statusCode)  // e.g., 404
  console.log(appError.severity)    // e.g., 'low'
}
```

Handles:
- **Zod errors** → `ValidationError`
- **Firebase auth errors** → `AuthenticationError`
- **Postgres unique violations** → `ConflictError`
- **Supabase RLS errors** → `AuthorizationError`
- **Generic errors** → `InternalError`

### Custom Error Options

```typescript
throw new DatabaseError('Connection failed', {
  cause: originalError,           // Chain errors
  metadata: { host: 'db.example.com' },  // Additional context
  userMessage: 'Database is temporarily unavailable',  // User-safe message
  details: 'Connection pool exhausted',  // Internal details
  retryable: true,               // Can retry this operation
  statusCode: 503,               // Override default status
})
```

### Error Properties

```typescript
const error = new NotFoundError('User not found', {
  metadata: { userId: '123' }
})

error.code            // 'NOT_FOUND'
error.statusCode      // 404
error.severity        // 'low'
error.message         // 'User not found' (internal)
error.userMessage     // 'The requested resource was not found' (user-safe)
error.details         // Optional details
error.metadata        // { userId: '123' }
error.retryable       // false
error.requestId       // Auto-captured from log context
error.timestamp       // Date error was created

// Methods
error.isRetryable()   // Check if retryable
error.getUserMessage()  // Get user-safe message
error.toJSON()        // Serialize for API response
error.log(logger)     // Log with appropriate level
```

## Integration with Logger

Errors automatically log themselves:

```typescript
import { createLogger } from '@cenie/logger'
import { DatabaseError } from '@cenie/errors'

const logger = createLogger({ name: 'api' })

const error = new DatabaseError('Connection failed')
error.log(logger)  // Automatically logs at ERROR level with context
```

Log levels by severity:
- **low** → debug
- **medium** → info
- **high** → warn
- **critical** → error

## Framework Handlers

### Next.js

```typescript
import { withErrorHandling, createErrorResponse } from '@cenie/errors/next'

// Automatic error handling
export const POST = withErrorHandling(async (request) => {
  // Any thrown error is automatically caught and formatted
  const data = await processRequest(request)
  return NextResponse.json({ data })
})

// Manual error response
export async function GET(request: NextRequest) {
  try {
    const data = await getData()
    return NextResponse.json({ data })
  } catch (error) {
    return createErrorResponse(error)
  }
}
```

### Express

```typescript
import { errorHandler, asyncHandler } from '@cenie/errors/express'

// Wrap async handlers
app.get('/data', asyncHandler(async (req, res) => {
  const data = await getData()
  res.json({ data })
}))

// Global error handler (add last)
app.use(errorHandler())
```

### React

```typescript
import { ErrorBoundary, useErrorHandler } from '@cenie/errors/react'

// Component wrapper
function App() {
  return (
    <ErrorBoundary
      fallback={CustomErrorComponent}
      onError={(error, info) => console.log('Error:', error)}
    >
      <MyApp />
    </ErrorBoundary>
  )
}

// Hook for error handling
function MyComponent() {
  const handleError = useErrorHandler()

  async function loadData() {
    try {
      await fetchData()
    } catch (error) {
      handleError(error)  // Triggers error boundary
    }
  }
}
```

## Error Response Format

### Production

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found",
    "statusCode": 404,
    "requestId": "req_abc123"
  }
}
```

### Development

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found",
    "statusCode": 404,
    "requestId": "req_abc123",
    "details": "User with ID '123' does not exist",
    "timestamp": "2025-01-06T10:30:00.000Z",
    "stack": "Error: User not found\n  at getUserById..."
  }
}
```

## Best Practices

### Do's ✅

```typescript
// Provide context
throw new NotFoundError('User not found', {
  metadata: { userId: id }
})

// Chain errors
catch (error) {
  throw new DatabaseError('Query failed', { cause: error })
}

// Use specific error types
throw new ValidationError('Invalid email')  // Not generic Error

// Custom user messages
throw new InternalError('Service initialization failed', {
  userMessage: 'Service is temporarily unavailable'
})
```

### Don'ts ❌

```typescript
// Generic errors
throw new Error('Something went wrong')  // Use AppError subclasses

// Losing context
catch (error) {
  throw new InternalError('Failed')  // Lost original error
}

// Sensitive data in user messages
throw new ValidationError(dbConnectionString)  // Don't expose internals

// Missing metadata
throw new NotFoundError('Not found')  // Add context!
```

## Extending Error Classes

Create custom errors for your domain:

```typescript
import { AppError } from '@cenie/errors'

export class BookNotAvailableError extends AppError {
  constructor(bookId: string, options = {}) {
    super(
      'BOOK_NOT_AVAILABLE',
      `Book ${bookId} is not available`,
      400,
      'medium',
      {
        userMessage: 'This book is currently unavailable',
        metadata: { bookId },
        ...options,
      }
    )
  }
}
```

## Migration from Old Patterns

### Before

```typescript
export async function GET(request: NextRequest) {
  try {
    const data = await getData()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get data' },
      { status: 500 }
    )
  }
}
```

### After

```typescript
import { withErrorHandling, DatabaseError } from '@cenie/errors'

export const GET = withErrorHandling(async (request) => {
  const data = await getData()
  return NextResponse.json({ data })
})
// Errors are automatically logged and formatted
```

## TypeScript Support

Full TypeScript support with type guards:

```typescript
import { AppError, NotFoundError } from '@cenie/errors'

try {
  await operation()
} catch (error) {
  if (error instanceof AppError) {
    console.log(error.code)  // Type-safe
  }

  if (error instanceof NotFoundError) {
    // Handle specific error type
  }
}
```

## Performance

- Error creation: < 0.1ms
- Classification: < 1ms
- Logging: < 2ms
- Minimal memory overhead

## Troubleshooting

### Errors not being logged

Ensure logger middleware is used:
```typescript
export const GET = withErrorHandling(async (request) => {
  // Errors are automatically logged here
})
```

### Stack traces missing

Check NODE_ENV:
```typescript
// Stack traces only in development
process.env.NODE_ENV === 'development'
```

### Custom error not classified

Add to classifier:
```typescript
// packages/errors/src/utils/error-classifier.ts
if (error instanceof MyCustomError) {
  return new AppropriateError(...)
}
```

## License

Private - CENIE Platform
