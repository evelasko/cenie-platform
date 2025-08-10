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