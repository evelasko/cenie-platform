import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@cenie/errors/next'
import { withLogging } from '@cenie/logger/next'
import {
  RateLimitError,
  ConflictError,
  DatabaseError,
  InternalError,
  ValidationError,
} from '@cenie/errors'
import { createNextServerClient } from '@cenie/supabase/server'
import { withCors } from '../../../lib/cors'
import { rateLimit, getRateLimitHeaders } from '../../../lib/rate-limiter'
import { authenticateRequest, requireAdmin } from '../../../lib/auth'
import { logger } from '../../../lib/logger'

/**
 * Validation Schema for Waitlist Subscription
 */
const waitlistSubscribeSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  source: z
    .enum(['hub', 'editorial', 'academy', 'agency', 'evelas', 'other'])
    .optional()
    .default('hub'),
  metadata: z.record(z.string(), z.any()).optional(),
})

/**
 * Helper function to get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP address from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = forwardedFor?.split(',')[0].trim() || realIp || cfConnectingIp || 'unknown'

  return `waitlist:${ip}`
}

/**
 * POST /api/waitlist
 * Subscribe to the CENIE platform waitlist
 *
 * Public endpoint - no authentication required
 * Rate limited: 50 requests per hour per IP
 * CORS enabled for cross-domain access
 *
 * Request body:
 * {
 *   "full_name": "John Doe",
 *   "email": "john@example.com",
 *   "source": "hub" | "editorial" | "academy" | "agency" | "evelas" | "other"
 * }
 *
 * Response:
 * 201 Created - Successfully subscribed
 * 409 Conflict - Email already subscribed
 * 429 Too Many Requests - Rate limit exceeded
 */
export const POST = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    return withCors(request, async () => {
      const origin = request.headers.get('origin')

      logger.info('[Waitlist] POST request', { origin })

      // Rate limiting: 50 requests per hour per IP (relaxed for external apps)
      const identifier = getClientIdentifier(request)
      const rateLimitResult = rateLimit({
        identifier,
        limit: 50,
        windowSeconds: 3600, // 1 hour
      })

      logger.debug('[Waitlist] Rate limit check', {
        identifier,
        remaining: rateLimitResult.remaining,
        success: rateLimitResult.success,
      })

      // If rate limit exceeded, throw error
      if (!rateLimitResult.success) {
        throw new RateLimitError('Too many subscription attempts', {
          userMessage: 'Please try again later',
          metadata: {
            identifier,
            resetInSeconds: rateLimitResult.resetInSeconds,
          },
        })
      }

      // Parse and validate request body
      let body
      try {
        body = await request.json()
        logger.debug('[Waitlist] Request body parsed', {
          full_name: body.full_name,
          email: body.email?.substring(0, 3) + '***',
          source: body.source,
        })
      } catch (parseError) {
        throw new ValidationError('Invalid JSON body', {
          cause: parseError,
          userMessage: 'Request body must be valid JSON',
        })
      }

      const validatedData = waitlistSubscribeSchema.parse(body)
      logger.debug('[Waitlist] Validation passed')

      // Connect to Supabase
      logger.debug('[Waitlist] Connecting to Supabase')
      const supabase = createNextServerClient()

      // Test connection
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new InternalError('Database connection not configured', {
          userMessage: 'Service temporarily unavailable',
          metadata: {
            missingEnvVars: [
              !process.env.NEXT_PUBLIC_SUPABASE_URL && 'NEXT_PUBLIC_SUPABASE_URL',
              !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            ].filter(Boolean),
          },
        })
      }

      logger.debug('[Waitlist] Supabase client created')

      // Check if email already exists
      logger.debug('[Waitlist] Checking if email exists')
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('waitlist_subscribers')
        .select('id, email, full_name, subscribed_at, is_active')
        .eq('email', validatedData.email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected if email doesn't exist)
        throw new DatabaseError('Failed to check subscription status', {
          cause: checkError,
          metadata: {
            code: checkError.code,
            details: checkError.details,
            hint: checkError.hint,
          },
        })
      }

      logger.debug('[Waitlist] Email check complete', {
        exists: !!existingSubscriber,
      })

      // If email already exists, throw conflict error
      if (existingSubscriber) {
        throw new ConflictError('Email already subscribed', {
          userMessage: 'This email is already on the waitlist',
          metadata: {
            email: validatedData.email,
            subscribedAt: (existingSubscriber as any).subscribed_at,
          },
        })
      }

      // Insert new subscriber
      logger.debug('[Waitlist] Inserting new subscriber')
      const { data: newSubscriber, error: insertError } = await supabase
        .from('waitlist_subscribers')
        .insert({
          full_name: validatedData.full_name,
          email: validatedData.email,
          source: validatedData.source,
          metadata: validatedData.metadata || {},
          is_active: true,
        } as any)
        .select()
        .single()

      if (insertError) {
        // Handle unique constraint violation (race condition)
        if (insertError.code === '23505') {
          throw new ConflictError('Email already subscribed', {
            userMessage: 'This email is already on the waitlist',
            metadata: {
              email: validatedData.email,
              code: insertError.code,
            },
          })
        }

        throw new DatabaseError('Failed to subscribe to waitlist', {
          cause: insertError,
          metadata: {
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint,
          },
        })
      }

      logger.info('[Waitlist] New subscriber added', {
        email: (newSubscriber as any).email,
        source: origin,
      })

      // Success response
      const subscriber = newSubscriber as any
      const response = NextResponse.json(
        {
          success: true,
          message: 'Successfully subscribed to waitlist',
          subscriber: {
            id: subscriber.id,
            full_name: subscriber.full_name,
            email: subscriber.email,
            source: subscriber.source,
            subscribed_at: subscriber.subscribed_at,
          },
        },
        {
          status: 201,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      )

      return response
    })
  })
)

/**
 * GET /api/waitlist
 * List waitlist subscribers (admin only)
 *
 * Requires: Firebase authentication + admin role
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - per_page: Items per page (default: 50, max: 100)
 * - search: Search by name or email (optional)
 * - source: Filter by source (optional)
 * - active: Filter by active status (optional, default: true)
 *
 * Response:
 * 200 OK - List of subscribers with pagination
 * 401 Unauthorized - Not authenticated
 * 403 Forbidden - Not an admin
 */
export const GET = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    return withCors(request, async () => {
      // Authenticate request
      const authResult = await authenticateRequest(request)
      const { userId } = authResult

      // Check admin permissions
      await requireAdmin(userId)

      // Parse query parameters
      const searchParams = request.nextUrl.searchParams
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
      const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') || '50')))
      const searchQuery = searchParams.get('search') || null
      const sourceFilter = searchParams.get('source') || null
      const activeFilter = searchParams.get('active')
      const isActive = activeFilter !== null ? activeFilter === 'true' : null

      // Connect to Supabase
      const supabase = createNextServerClient()

      // Calculate pagination
      const offset = (page - 1) * perPage

      // Use the get_waitlist_subscribers function (SECURITY DEFINER - bypasses RLS)
      const { data, error } = await supabase.rpc(
        'get_waitlist_subscribers' as any,
        {
          search_query: searchQuery,
          filter_source: sourceFilter,
          filter_active: isActive,
          limit_count: perPage,
          offset_count: offset,
        } as any
      )

      if (error) {
        throw new DatabaseError('Failed to fetch waitlist subscribers', {
          cause: error,
          metadata: {
            searchQuery,
            sourceFilter,
            isActive,
            page,
            perPage,
          },
        })
      }

      const subscribers = (data || []) as any[]

      // For total count, we need a separate query or count function
      // For now, we'll use a simple approach: if we got fewer results than requested,
      // we're on the last page
      const isLastPage = subscribers.length < perPage
      const estimatedTotal = isLastPage
        ? offset + subscribers.length
        : offset + subscribers.length + 1 // At least one more page

      // Return paginated results
      return NextResponse.json({
        subscribers: subscribers,
        pagination: {
          page,
          per_page: perPage,
          total: estimatedTotal,
          total_pages: Math.ceil(estimatedTotal / perPage),
          is_last_page: isLastPage,
        },
      })
    })
  })
)

/**
 * OPTIONS handler for CORS preflight requests
 */
export const OPTIONS = withErrorHandling(
  withLogging(async (request: NextRequest) => {
    return withCors(request, async () => {
      return new NextResponse(null, { status: 204 })
    })
  })
)
