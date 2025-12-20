import type { AuthError } from 'firebase/auth'

import type { OAuthError } from './types'

/**
 * Enhanced error handling for OAuth operations
 *
 * Converts Firebase error codes to user-friendly messages
 *
 * @param error - Firebase AuthError
 * @param provider - Provider name for context in error messages
 * @returns Enhanced OAuthError with user-friendly message
 */
export function handleOAuthError(error: AuthError, provider: string): OAuthError {
  const oauthError = error as OAuthError

  // Add more context to common OAuth errors
  switch (error.code) {
    case 'auth/popup-blocked':
      oauthError.message = `${provider} sign-in popup was blocked. Please allow popups and try again.`
      break
    case 'auth/popup-closed-by-user':
      oauthError.message = `${provider} sign-in was cancelled. Please try again.`
      break
    case 'auth/cancelled-popup-request':
      oauthError.message = `Another ${provider} sign-in popup is already open.`
      break
    case 'auth/account-exists-with-different-credential':
      oauthError.message = `An account already exists with the same email address but different sign-in credentials.`
      break
    case 'auth/credential-already-in-use':
      oauthError.message = `This ${provider} account is already linked to another user.`
      break
    case 'auth/operation-not-allowed':
      oauthError.message = `${provider} sign-in is not enabled. Please contact support.`
      break
    case 'auth/network-request-failed':
      oauthError.message = `Network error during ${provider} sign-in. Please check your connection and try again.`
      break
    case 'auth/too-many-requests':
      oauthError.message = `Too many ${provider} sign-in attempts. Please try again later.`
      break
    case 'auth/user-disabled':
      oauthError.message = `Your account has been disabled. Please contact support.`
      break
    default:
      oauthError.message = `${provider} sign-in failed: ${error.message}`
  }

  return oauthError
}

