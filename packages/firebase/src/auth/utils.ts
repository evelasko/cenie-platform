import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  AuthCredential,
  UserCredential,
  AuthError,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { getFirebaseAuth } from '../client'

export async function signIn(email: string, password: string) {
  const auth = getFirebaseAuth()
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function signUp(email: string, password: string, displayName?: string) {
  const auth = getFirebaseAuth()
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  if (displayName) {
    await updateProfile(userCredential.user, { displayName })
  }
  
  return userCredential.user
}

export async function signOut() {
  const auth = getFirebaseAuth()
  await firebaseSignOut(auth)
}

export async function resetPassword(email: string) {
  const auth = getFirebaseAuth()
  await sendPasswordResetEmail(auth, email)
}

export async function verifyEmail() {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  await sendEmailVerification(user)
}

export async function updateUserProfile(updates: { displayName?: string; photoURL?: string }) {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  await updateProfile(user, updates)
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user || !user.email) {
    throw new Error('No authenticated user')
  }
  
  // Reauthenticate user first
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  
  // Update password
  await updatePassword(user, newPassword)
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    return null
  }
  
  return await user.getIdToken(forceRefresh)
}

export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth()
  return auth.currentUser
}

// OAuth Sign-in Functions

export interface OAuthSignInResult {
  user: User
  credential: AuthCredential | null
  isNewUser: boolean
  additionalUserInfo?: {
    profile?: Record<string, any>
    providerId: string
    username?: string
  }
}

export interface OAuthError extends AuthError {
  credential?: AuthCredential
  email?: string
}

/**
 * Sign in with Google using popup
 */
export async function signInWithGoogle(useRedirect = false): Promise<OAuthSignInResult> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  
  // Add required scopes
  provider.addScope('profile')
  provider.addScope('email')
  
  // Add custom parameters for better UX
  provider.setCustomParameters({
    prompt: 'select_account'
  })

  try {
    let result: UserCredential
    
    if (useRedirect) {
      // Use redirect for mobile or when popup is blocked
      await signInWithRedirect(auth, provider)
      // The result will be available after redirect via getRedirectResult
      throw new Error('Redirect initiated - check redirect result on app initialization')
    } else {
      // Use popup for desktop
      result = await signInWithPopup(auth, provider)
    }

    const credential = GoogleAuthProvider.credentialFromResult(result)
    
    return {
      user: result.user,
      credential,
      isNewUser: (result as any).additionalUserInfo?.isNewUser ?? false,
      additionalUserInfo: (result as any).additionalUserInfo || undefined
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, 'Google')
  }
}

/**
 * Sign in with Apple using popup or redirect
 */
export async function signInWithApple(useRedirect = false): Promise<OAuthSignInResult> {
  const auth = getFirebaseAuth()
  const provider = new OAuthProvider('apple.com')
  
  // Add required scopes for Apple
  provider.addScope('email')
  provider.addScope('name')
  
  // Add custom parameters for Apple Sign-In
  provider.setCustomParameters({
    locale: 'en'
  })

  try {
    let result: UserCredential
    
    if (useRedirect) {
      // Use redirect for mobile or when popup is blocked
      await signInWithRedirect(auth, provider)
      // The result will be available after redirect via getRedirectResult
      throw new Error('Redirect initiated - check redirect result on app initialization')
    } else {
      // Use popup for desktop
      result = await signInWithPopup(auth, provider)
    }

    const credential = OAuthProvider.credentialFromResult(result)
    
    return {
      user: result.user,
      credential,
      isNewUser: (result as any).additionalUserInfo?.isNewUser ?? false,
      additionalUserInfo: (result as any).additionalUserInfo || undefined
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, 'Apple')
  }
}

/**
 * Get redirect result after OAuth redirect flow
 */
export async function getOAuthRedirectResult(): Promise<OAuthSignInResult | null> {
  const auth = getFirebaseAuth()
  
  try {
    const result = await getRedirectResult(auth)
    
    if (!result) {
      return null
    }

    // Determine the provider and get appropriate credential
    let credential: AuthCredential | null = null
    const providerId = result.providerId

    if (providerId === 'google.com') {
      credential = GoogleAuthProvider.credentialFromResult(result)
    } else if (providerId === 'apple.com') {
      credential = OAuthProvider.credentialFromResult(result)
    }
    
    return {
      user: result.user,
      credential,
      isNewUser: (result as any).additionalUserInfo?.isNewUser ?? false,
      additionalUserInfo: (result as any).additionalUserInfo || undefined
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, 'OAuth Redirect')
  }
}

/**
 * Link existing account with OAuth provider
 */
export async function linkWithOAuthProvider(
  provider: 'google' | 'apple',
  useRedirect = false
): Promise<OAuthSignInResult> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('No authenticated user to link with')
  }

  let oauthProvider: GoogleAuthProvider | OAuthProvider

  if (provider === 'google') {
    oauthProvider = new GoogleAuthProvider()
    oauthProvider.addScope('profile')
    oauthProvider.addScope('email')
  } else {
    oauthProvider = new OAuthProvider('apple.com')
    oauthProvider.addScope('email')
    oauthProvider.addScope('name')
  }

  try {
    let result: UserCredential
    
    if (useRedirect) {
      const { linkWithRedirect } = await import('firebase/auth')
      await linkWithRedirect(user, oauthProvider)
      throw new Error('Redirect initiated - check redirect result on app initialization')
    } else {
      const { linkWithPopup } = await import('firebase/auth')
      result = await linkWithPopup(user, oauthProvider)
    }

    const credential = provider === 'google' 
      ? GoogleAuthProvider.credentialFromResult(result)
      : OAuthProvider.credentialFromResult(result)
    
    return {
      user: result.user,
      credential,
      isNewUser: false, // Linking existing account
      additionalUserInfo: (result as any).additionalUserInfo || undefined
    }
  } catch (error) {
    throw handleOAuthError(error as AuthError, provider === 'google' ? 'Google' : 'Apple')
  }
}

/**
 * Handle account-exists-with-different-credential error
 */
export async function handleAccountExistsError(
  error: OAuthError
): Promise<{ 
  email: string
  existingProviders: string[]
  pendingCredential: AuthCredential | null 
}> {
  if (error.code !== 'auth/account-exists-with-different-credential') {
    throw error
  }

  const email = error.email
  if (!email) {
    throw new Error('No email found in error')
  }

  const auth = getFirebaseAuth()
  const existingProviders = await fetchSignInMethodsForEmail(auth, email)
  
  return {
    email,
    existingProviders,
    pendingCredential: error.credential || null
  }
}

/**
 * Link pending credential after signing in with existing provider
 */
export async function linkPendingCredential(pendingCredential: AuthCredential): Promise<User> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    throw new Error('No authenticated user to link credential with')
  }

  const result = await linkWithCredential(user, pendingCredential)
  return result.user
}

/**
 * Enhanced error handling for OAuth operations
 */
function handleOAuthError(error: AuthError, provider: string): OAuthError {
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