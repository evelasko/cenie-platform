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
  logger.error('Test Sentry error from Academy', {
    testData: 'This is a test error',
    timestamp: new Date().toISOString(),
    app: 'academy',
    testType: 'logger-error',
  })
  
  // Test 2: Exception capture
  try {
    throw new Error('Test exception for Sentry - Academy')
  } catch (error) {
    logger.error('Test exception caught', error as Error, {
      testType: 'exception',
      app: 'academy',
    })
  }
  
  return NextResponse.json({ 
    success: true,
    message: 'Test errors sent to Sentry. Check your Sentry dashboard.',
    app: 'academy',
    timestamp: new Date().toISOString(),
  })
}

