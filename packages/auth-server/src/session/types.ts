export interface SessionOptions {
  expiresIn?: number // milliseconds, default 14 days
}

export interface CreateSessionResult {
  success: boolean
  sessionCookie?: string
  error?: string
}

