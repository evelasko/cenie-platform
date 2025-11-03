import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createNextServerClient } from '@cenie/supabase/server'
import { withCors } from '../../../lib/cors'
import { rateLimit, getRateLimitHeaders } from '../../../lib/rate-limiter'
import { authenticateRequest, requireAdmin } from '../../../lib/auth-middleware'

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
 * Rate limited: 5 requests per hour per IP
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
export async function POST(request: NextRequest) {
  return withCors(request, async () => {
    const origin = request.headers.get('origin')
    const timestamp = new Date().toISOString()

    console.log(`[Waitlist ${timestamp}] POST request from:`, origin)

    try {
      // Rate limiting: 50 requests per hour per IP (relaxed for external apps)
      const identifier = getClientIdentifier(request)
      const rateLimitResult = rateLimit({
        identifier,
        limit: 50,
        windowSeconds: 3600, // 1 hour
      })

      console.log(`[Waitlist ${timestamp}] Rate limit check:`, {
        identifier,
        remaining: rateLimitResult.remaining,
        success: rateLimitResult.success,
      })

      // If rate limit exceeded, return 429
      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            error: 'Too many subscription attempts',
            message: 'Please try again later',
            resetInSeconds: rateLimitResult.resetInSeconds,
          },
          {
            status: 429,
            headers: getRateLimitHeaders(rateLimitResult),
          }
        )
      }

      // Parse and validate request body
      let body
      try {
        body = await request.json()
        console.log(`[Waitlist ${timestamp}] Request body:`, {
          full_name: body.full_name,
          email: body.email?.substring(0, 3) + '***',
          source: body.source,
        })
      } catch (parseError) {
        console.error(`[Waitlist ${timestamp}] JSON parse error:`, parseError)
        return NextResponse.json(
          {
            error: 'Invalid JSON',
            message: 'Request body must be valid JSON',
            details: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          },
          { status: 400 }
        )
      }

      const validatedData = waitlistSubscribeSchema.parse(body)
      console.log(`[Waitlist ${timestamp}] Validation passed`)

      // Connect to Supabase
      console.log(`[Waitlist ${timestamp}] Connecting to Supabase...`)
      const supabase = createNextServerClient()

      // Test connection
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error(`[Waitlist ${timestamp}] Supabase env vars missing`)
        return NextResponse.json(
          {
            error: 'Configuration error',
            message: 'Database connection not configured',
            details: 'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing',
          },
          { status: 500 }
        )
      }

      console.log(`[Waitlist ${timestamp}] Supabase client created`)

      // Check if email already exists
      console.log(`[Waitlist ${timestamp}] Checking if email exists...`)
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('waitlist_subscribers')
        .select('id, email, full_name, subscribed_at, is_active')
        .eq('email', validatedData.email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected if email doesn't exist)
        console.error(`[Waitlist ${timestamp}] Database check error:`, {
          code: checkError.code,
          message: checkError.message,
          details: checkError.details,
          hint: checkError.hint,
        })
        return NextResponse.json(
          {
            error: 'Database error',
            message: 'Failed to check subscription status',
            details: checkError.message,
            code: checkError.code,
            timestamp,
          },
          { status: 500 }
        )
      }

      console.log(`[Waitlist ${timestamp}] Email check complete:`, {
        exists: !!existingSubscriber,
      })

      // If email already exists, return 409 Conflict
      if (existingSubscriber) {
        return NextResponse.json(
          {
            error: 'Already subscribed',
            message: 'This email is already on the waitlist',
            subscribed_at: (existingSubscriber as any).subscribed_at,
          },
          {
            status: 409,
            headers: getRateLimitHeaders(rateLimitResult),
          }
        )
      }

      // Insert new subscriber
      console.log(`[Waitlist ${timestamp}] Inserting new subscriber...`)
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
        console.error(`[Waitlist ${timestamp}] Database insert error:`, {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        })

        // Handle unique constraint violation (race condition)
        if (insertError.code === '23505') {
          return NextResponse.json(
            {
              error: 'Already subscribed',
              message: 'This email is already on the waitlist',
            },
            {
              status: 409,
              headers: getRateLimitHeaders(rateLimitResult),
            }
          )
        }

        return NextResponse.json(
          {
            error: 'Database error',
            message: 'Failed to subscribe to waitlist',
            details: insertError.message,
            code: insertError.code,
            timestamp,
            // Include more debug info
            ...(insertError.hint && { hint: insertError.hint }),
          },
          { status: 500 }
        )
      }

      console.log(`[Waitlist ${timestamp}] Insert successful`)

      // Success response
      const subscriber = newSubscriber as any
      console.log('[Waitlist] New subscriber added:', subscriber.email, 'from:', origin)
      return NextResponse.json(
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
    } catch (error) {
      console.error(`[Waitlist ${timestamp}] Error caught:`, error)

      // Validation errors
      if (error instanceof z.ZodError) {
        console.error(`[Waitlist ${timestamp}] Validation error:`, error.issues)
        return NextResponse.json(
          {
            error: 'Validation error',
            message: 'Invalid input data',
            details: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        )
      }

      // JSON parse errors
      if (error instanceof SyntaxError) {
        console.error(`[Waitlist ${timestamp}] JSON syntax error:`, error.message)
        return NextResponse.json(
          {
            error: 'Invalid JSON',
            message: 'Request body must be valid JSON',
            details: error.message,
          },
          { status: 400 }
        )
      }

      // Unexpected errors - provide detailed info
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorStack = error instanceof Error ? error.stack : undefined

      console.error(`[Waitlist ${timestamp}] Unexpected error:`, {
        message: errorMessage,
        stack: errorStack,
        error: error,
      })

      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'An unexpected error occurred',
          details: errorMessage,
          timestamp,
          // Include stack trace in development
          ...(process.env.NODE_ENV === 'development' && {
            stack: errorStack,
            errorType: error?.constructor?.name,
          }),
        },
        { status: 500 }
      )
    }
  })
}

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
export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      // Authenticate request
      const authResult = await authenticateRequest(request)

      if ('error' in authResult) {
        return NextResponse.json(
          {
            error: authResult.error,
            message: 'Authentication required',
          },
          { status: authResult.status }
        )
      }

      const { userId } = authResult

      // Check admin permissions
      const adminCheck = await requireAdmin(userId)

      if (!adminCheck.success) {
        return NextResponse.json(
          {
            error: adminCheck.error,
            message: 'Admin access required',
          },
          { status: adminCheck.status || 403 }
        )
      }

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
        console.error('Database query error:', error)
        return NextResponse.json(
          {
            error: 'Database error',
            message: 'Failed to fetch waitlist subscribers',
            details: error.message,
          },
          { status: 500 }
        )
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
    } catch (error) {
      console.error('Get waitlist subscribers error:', error)
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'An unexpected error occurred',
        },
        { status: 500 }
      )
    }
  })
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return withCors(request, async () => {
    return new NextResponse(null, { status: 204 })
  })
}
