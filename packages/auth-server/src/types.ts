import type { DecodedIdToken } from 'firebase-admin/auth'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

export interface AuthenticatedUser {
  uid: string
  email: string | null
  role: string
  session: DecodedIdToken
}

export interface AccessData {
  hasAccess: boolean
  role: string | null
  isActive: boolean
}

// More types will be added in later tasks

