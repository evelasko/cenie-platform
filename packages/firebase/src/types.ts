export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  phoneNumber: string | null
  providerId: string
  createdAt?: string
  lastLoginAt?: string
}

export interface AuthError {
  code: string
  message: string
  email?: string
  credential?: any
}

export interface SessionData {
  user: AuthUser | null
  isLoading: boolean
  error: AuthError | null
}

// Analytics Types
export interface AnalyticsEventParams {
  [key: string]: string | number | boolean
}

export interface CustomEventParams extends AnalyticsEventParams {
  app_name: string
  [key: string]: string | number | boolean
}

export interface AnalyticsConfig {
  appName: string
  enableDebug?: boolean
  measurementId?: string
}

export type AnalyticsSeverity = 'low' | 'medium' | 'high'

export interface AnalyticsError {
  message: string
  context: string
  severity: AnalyticsSeverity
  stack?: string
}