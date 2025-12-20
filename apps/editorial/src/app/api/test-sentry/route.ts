import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * GET /api/test-sentry
 * Test route to verify Sentry error capture
 * 
 * This route intentionally throws errors to test Sentry integration:
 * - Logger error capture
 * - Exception capture
 * - Metadata inclusion
 */
export async function GET() {
  // Test 1: Logger error with metadata
  logger.error('Test Sentry error from Editorial', {
    testData: 'This is a test error',
    timestamp: new Date().toISOString(),
    app: 'editorial',
    testType: 'logger-error',
  })
  
  // Test 2: Exception capture
  try {
    throw new Error('Test exception for Sentry - Editorial')
  } catch (error) {
    logger.error('Test exception caught', error as Error, {
      testType: 'exception',
      app: 'editorial',
    })
  }
  
  return NextResponse.json({ 
    success: true,
    message: 'Test errors sent to Sentry. Check your Sentry dashboard.',
    app: 'editorial',
    timestamp: new Date().toISOString(),
  })
}

