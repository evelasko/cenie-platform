import type { AuthCredential, User } from 'firebase/auth'

export interface OAuthResult {
  user: User
  credential: AuthCredential | null
  isNewUser: boolean
  additionalUserInfo?: {
    profile?: Record<string, unknown>
    providerId: string
    username?: string
  }
}

export interface OAuthError extends Error {
  code: string
  credential?: AuthCredential
  email?: string
}

