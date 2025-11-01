/**
 * Waitlist API Client
 * 
 * Helper functions for interacting with the waitlist API
 * Can be used in client-side components or server-side code
 */

export interface WaitlistSubscriber {
  id: string
  full_name: string
  email: string
  source: string | null
  subscribed_at: string
  is_active: boolean
  metadata: Record<string, any>
}

export interface WaitlistSubscribeInput {
  full_name: string
  email: string
  source?: 'hub' | 'editorial' | 'academy' | 'agency' | 'evelas' | 'other'
  metadata?: Record<string, any>
}

export interface WaitlistSubscribeResponse {
  success: boolean
  message: string
  subscriber?: {
    id: string
    full_name: string
    email: string
    source: string
    subscribed_at: string
  }
  error?: string
  details?: Array<{ field: string; message: string }>
  resetInSeconds?: number
}

export interface WaitlistListResponse {
  subscribers: WaitlistSubscriber[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export class WaitlistAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'WaitlistAPIError'
  }
}

/**
 * Subscribe to the waitlist (client-side)
 * 
 * @example
 * try {
 *   const result = await subscribeToWaitlist({
 *     full_name: 'John Doe',
 *     email: 'john@example.com',
 *     source: 'hub'
 *   })
 *   console.log('Success:', result.message)
 * } catch (error) {
 *   if (error instanceof WaitlistAPIError) {
 *     console.error('Error:', error.message, error.details)
 *   }
 * }
 */
export async function subscribeToWaitlist(
  input: WaitlistSubscribeInput
): Promise<WaitlistSubscribeResponse> {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: input.full_name,
        email: input.email,
        source: input.source || 'hub',
        metadata: input.metadata || {},
      }),
    })

    const data: WaitlistSubscribeResponse = await response.json()

    if (!response.ok) {
      throw new WaitlistAPIError(
        data.message || data.error || 'Subscription failed',
        response.status,
        data.details
      )
    }

    return data
  } catch (error) {
    if (error instanceof WaitlistAPIError) {
      throw error
    }

    if (error instanceof Error) {
      throw new WaitlistAPIError(error.message)
    }

    throw new WaitlistAPIError('An unexpected error occurred')
  }
}

/**
 * Subscribe from external domain (cross-origin)
 * 
 * @example
 * const result = await subscribeToWaitlistExternal({
 *   full_name: 'Jane Doe',
 *   email: 'jane@example.com',
 *   source: 'evelas'
 * }, 'https://cenie.org')
 */
export async function subscribeToWaitlistExternal(
  input: WaitlistSubscribeInput,
  apiBaseUrl: string = 'https://cenie.org'
): Promise<WaitlistSubscribeResponse> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: input.full_name,
        email: input.email,
        source: input.source || 'other',
        metadata: input.metadata || {},
      }),
    })

    const data: WaitlistSubscribeResponse = await response.json()

    if (!response.ok) {
      throw new WaitlistAPIError(
        data.message || data.error || 'Subscription failed',
        response.status,
        data.details
      )
    }

    return data
  } catch (error) {
    if (error instanceof WaitlistAPIError) {
      throw error
    }

    if (error instanceof Error) {
      throw new WaitlistAPIError(error.message)
    }

    throw new WaitlistAPIError('An unexpected error occurred')
  }
}

/**
 * List waitlist subscribers (admin only - requires authentication)
 * 
 * @example
 * const token = await user.getIdToken()
 * const result = await listWaitlistSubscribers(token, {
 *   page: 1,
 *   per_page: 50,
 *   search: 'john',
 *   source: 'hub'
 * })
 */
export async function listWaitlistSubscribers(
  authToken: string,
  options?: {
    page?: number
    per_page?: number
    search?: string
    source?: string
    active?: boolean
  }
): Promise<WaitlistListResponse> {
  try {
    const params = new URLSearchParams()
    
    if (options?.page) params.set('page', options.page.toString())
    if (options?.per_page) params.set('per_page', options.per_page.toString())
    if (options?.search) params.set('search', options.search)
    if (options?.source) params.set('source', options.source)
    if (options?.active !== undefined) params.set('active', options.active.toString())

    const url = `/api/waitlist${params.toString() ? `?${params}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new WaitlistAPIError(
        data.message || data.error || 'Failed to fetch subscribers',
        response.status
      )
    }

    return data
  } catch (error) {
    if (error instanceof WaitlistAPIError) {
      throw error
    }

    if (error instanceof Error) {
      throw new WaitlistAPIError(error.message)
    }

    throw new WaitlistAPIError('An unexpected error occurred')
  }
}

/**
 * Validate email format (client-side validation)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validate full name (client-side validation)
 */
export function isValidFullName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof WaitlistAPIError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

