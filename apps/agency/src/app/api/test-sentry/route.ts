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
  logger.error('Test Sentry error from Agency', {
    testData: 'This is a test error',
    timestamp: new Date().toISOString(),
    app: 'agency',
    testType: 'logger-error',
  })
  
  // Test 2: Exception capture
  try {
    throw new Error('Test exception for Sentry - Agency')
  } catch (error) {
    logger.error('Test exception caught', error as Error, {
      testType: 'exception',
      app: 'agency',
    })
  }
  
  return NextResponse.json({ 
    success: true,
    message: 'Test errors sent to Sentry. Check your Sentry dashboard.',
    app: 'agency',
    timestamp: new Date().toISOString(),
  })
}

