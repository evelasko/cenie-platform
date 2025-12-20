import type { Timestamp } from 'firebase-admin/firestore'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

export interface AccessData {
  hasAccess: boolean
  role: string | null
  isActive: boolean
}

export interface UserAppAccess {
  userId: string
  appName: AppName
  role: string
  isActive: boolean
  grantedAt: Timestamp
  grantedBy: string | null
}

