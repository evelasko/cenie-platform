// Client-side exports
export * from './client'
export * from './analytics'

// Auth exports with explicit re-exports to avoid conflicts
export * from './auth/hooks'
export * from './auth/context'
export { 
  // Re-export everything from utils except AuthError to avoid conflict
  signIn,
  signUp,
  signOut,
  resetPassword,
  verifyEmail,
  updateUserProfile,
  updateUserPassword,
  getIdToken,
  getCurrentUser,
  signInWithGoogle,
  signInWithApple,
  getOAuthRedirectResult,
  linkWithOAuthProvider,
  handleAccountExistsError,
  linkPendingCredential,
  type AuthCredential,
  type User,
  // Rename Firebase's AuthError to avoid conflict with our custom AuthError
  type AuthError as FirebaseAuthError,
  type OAuthError,
  type OAuthSignInResult
} from './auth/utils'

// Types exports (includes our custom AuthError interface)
export * from './types'

// Server-side exports (only for use in server components/API routes)
export * from './server'
export * from './middleware'