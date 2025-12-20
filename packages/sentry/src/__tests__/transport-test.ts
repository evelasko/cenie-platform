import { SentryTransport } from '../transport/sentry-transport'
import { createLogger, ConsoleTransport } from '@cenie/logger'
import { AuthenticationError } from '@cenie/errors'

/**
 * Test script for Sentry transport integration
 * 
 * Run with:
 * SENTRY_DSN_TEST="your_test_dsn" tsx packages/sentry/src/__tests__/transport-test.ts
 */
async function test() {
  const testDsn = process.env.SENTRY_DSN_TEST || 'https://public@sentry.io/test'
  
  console.log('🧪 Starting Sentry transport tests...')
  console.log(`📡 Using DSN: ${testDsn.substring(0, 30)}...`)

  // Create logger with Sentry transport
  const logger = createLogger({
    name: 'test-logger',
    transports: [
      new ConsoleTransport(), // Always log to console
      new SentryTransport({
        dsn: testDsn,
        environment: 'test',
        enabled: true,
        sampleRate: 1.0, // 100% for testing
      }),
    ],
  })

  console.log('\n✅ Logger created with Sentry transport')

  // Test 1: Error logging
  console.log('\n📝 Test 1: Error logging')
  logger.error('Test error message', {
    userId: 'test-123',
    action: 'test-action',
  })

  // Test 2: Error with Error object
  console.log('\n📝 Test 2: Error with Error object')
  logger.error('Test with error object', {
    error: new Error('Test error'),
  })

  // Test 3: Error with AppError
  console.log('\n📝 Test 3: Error with AppError')
  logger.error('Test with AppError', {
    error: new AuthenticationError('Token expired', {
      metadata: { tokenType: 'id-token' },
    }),
  })

  // Test 4: Warning
  console.log('\n📝 Test 4: Warning')
  logger.warn('Test warning message', {
    component: 'test-component',
  })

  // Test 5: Breadcrumbs (info)
  console.log('\n📝 Test 5: Info breadcrumb')
  logger.info('User action', { action: 'click-button' })

  // Test 6: Debug breadcrumb
  console.log('\n📝 Test 6: Debug breadcrumb')
  logger.debug('Debug info', { value: 123 })

  // Test 7: PII Sanitization
  console.log('\n📝 Test 7: PII Sanitization')
  logger.error('Auth failed', {
    email: 'user@example.com', // Should be kept
    password: 'secret123', // Should be redacted
    token: 'abc123', // Should be redacted
    userId: 'user-123', // Should be kept
  })

  // Give Sentry time to send
  console.log('\n⏳ Waiting for Sentry to send events...')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Flush to ensure all events are sent
  console.log('\n🔄 Flushing transports...')
  // Note: Logger doesn't expose flush, but transports will flush on process exit

  console.log('\n✅ Test complete - check Sentry dashboard')
  console.log('\nExpected in Sentry:')
  console.log('  - 4 errors (error, error with Error, error with AppError, error with PII)')
  console.log('  - 1 warning')
  console.log('  - AppError should have error_code and error_severity tags')
  console.log('  - Password and token should be [REDACTED]')
}

test().catch((error) => {
  console.error('❌ Test failed:', error)
  process.exit(1)
})

