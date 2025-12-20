import type { DecodedIdToken } from 'firebase-admin/auth'

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

