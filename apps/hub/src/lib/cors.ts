/**
 * CORS (Cross-Origin Resource Sharing) Utilities
 * Handles CORS for public API routes that need to be accessed from external domains
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * Allowed origins for CORS requests
 * In production, this includes all CENIE subdomains and authorized external sites
 */
const ALLOWED_ORIGINS = [
  // Production domains
  'https://cenie.org',
  'https://www.cenie.org',
  'https://editorial.cenie.org',
  'https://academy.cenie.org',
  'https://agency.cenie.org',
  'https://evelas.co',
  'https://www.evelas.co',

  // Development domains
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
  'http://127.0.0.1:3004',

  // Vercel preview deployments
  ...(process.env.VERCEL_ENV === 'preview'
    ? [`https://${process.env.VERCEL_URL}`]
    : []),
]

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  // TEMPORARY: Allow null origin for server-side requests
  // This happens when fetch is made from Next.js server components or API routes
  if (!origin) {
    console.log('[CORS] Warning: null origin detected - likely server-side request')
    return true // Temporarily allow
  }

  // Allow all localhost in development
  if (process.env.NODE_ENV === 'development') {
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return true
    }
  }

  // Allow any evelas.co subdomain
  if (origin.endsWith('.evelas.co') || origin === 'https://evelas.co') {
    return true
  }

  return ALLOWED_ORIGINS.includes(origin)
}

/**
 * Get CORS headers for a given origin
 */
export function getCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  if (isOriginAllowed(origin)) {
    // For null origin (server-side requests), use wildcard temporarily
    if (!origin) {
      headers['Access-Control-Allow-Origin'] = '*'
    } else {
      headers['Access-Control-Allow-Origin'] = origin
      headers['Access-Control-Allow-Credentials'] = 'true'
    }
  }

  return headers
}

/**
 * Handle CORS preflight (OPTIONS) request
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value as string)
  })

  return response
}

/**
 * Wrapper function to handle CORS for API routes
 * Usage:
 * export async function POST(request: NextRequest) {
 *   return withCors(request, async () => {
 *     // Your API logic here
 *     return NextResponse.json({ success: true })
 *   })
 * }
 */
export async function withCors(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const origin = request.headers.get('origin')
  
  // Log CORS check
  console.log('[CORS] Request:', {
    method: request.method,
    origin,
    allowed: isOriginAllowed(origin),
  })
  
  // Handle preflight request
  if (request.method === 'OPTIONS') {
    console.log('[CORS] Preflight request from:', origin)
    return handleCorsPreflightRequest(request)
  }

  // Execute the handler
  try {
    const response = await handler()
    
    // Add CORS headers to response
    const finalResponse = addCorsHeaders(response, request)
    
    console.log('[CORS] Response:', {
      status: finalResponse.status,
      hasCorsHeaders: finalResponse.headers.has('Access-Control-Allow-Origin'),
    })
    
    return finalResponse
  } catch (error) {
    console.error('[CORS] Handler error:', error)
    throw error
  }
}

