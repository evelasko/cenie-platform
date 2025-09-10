import { type Timestamp } from 'firebase-admin/firestore'

export type LocaleString = 'en' | 'es'

export const stringToLocaleString = (string: string): LocaleString => {
  if (string !== 'en' && string !== 'es') {
    throw new Error('Invalid locale string')
  }
  return string as LocaleString
}

export type LocalizedLabel = {
  [key in LocaleString]: string
}

export type LocalizedHref = {
  [key in LocaleString]: string
}

export interface NavigationItem {
  label: LocalizedLabel
  href: string
  icon?: React.ReactNode
  items?: NavigationItem[]
}

// Enhanced structure interfaces for single source of truth
export interface StructureItem {
  // Route information
  key: string // Used as the English href and pathnames key
  href: LocalizedHref // Localized paths
  label: LocalizedLabel // Localized labels

  // Navigation metadata
  icon?: React.ReactNode
  showInMainNav?: boolean
  showInFooter?: boolean
  showInSitemap?: boolean

  // Hierarchy
  children?: StructureItem[]
}

export interface SiteStructure {
  routes: StructureItem[]
  external: StructureItem[] // For external links like academia.cenie.org
  utility: StructureItem[] // For legal pages, search, account, etc.
}

export interface Profile {
  id: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserAppAccess {
  id?: string
  userId: string
  appName: 'hub' | 'editorial' | 'academy' | 'learn'
  role: 'viewer' | 'user' | 'editor' | 'admin'
  isActive: boolean
  grantedAt: Timestamp
  grantedBy?: string | null
}

export interface Subscription {
  id?: string
  userId: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart?: Timestamp
  currentPeriodEnd?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Collection names
export const COLLECTIONS = {
  PROFILES: 'profiles',
  USER_APP_ACCESS: 'user_app_access',
  SUBSCRIPTIONS: 'subscriptions',
} as const

// Helper type for converting Firestore timestamps to ISO strings in API responses
export type SerializedProfile = Omit<Profile, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type SerializedUserAppAccess = Omit<UserAppAccess, 'grantedAt'> & {
  grantedAt: string
}

export type SerializedSubscription = Omit<
  Subscription,
  'createdAt' | 'updatedAt' | 'currentPeriodStart' | 'currentPeriodEnd'
> & {
  createdAt: string
  updatedAt: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
}
