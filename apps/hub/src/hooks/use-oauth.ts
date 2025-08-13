'use client'

import {
  type AuthCredential,
  getOAuthRedirectResult,
  handleAccountExistsError,
  linkPendingCredential,
  type OAuthError,
  type OAuthSignInResult,
  signInWithApple,
  signInWithGoogle,
} from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface UseOAuthOptions {
  redirectTo?: string
  onSuccess?: (result: OAuthSignInResult) => void
  onError?: (error: string) => void
}

interface AccountLinkingInfo {
  email: string
  existingProviders: string[]
  pendingCredential: unknown
}

export function useOAuth(options: UseOAuthOptions = {}) {
  const { redirectTo = '/dashboard', onSuccess, onError } = options
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accountLinkingInfo, setAccountLinkingInfo] = useState<AccountLinkingInfo | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const handleOAuthSuccess = useCallback(async (result: OAuthSignInResult) => {
    try {
      // Get ID token to authenticate with our API
      const idToken = await result.user.getIdToken()

      // Call our OAuth API endpoint
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          provider: result.additionalUserInfo?.providerId === 'google.com' ? 'google' : 'apple',
          isNewUser: result.isNewUser,
          userData: {
            email: result.user.email,
            fullName: result.user.displayName,
            photoURL: result.user.photoURL,
            providerId: result.additionalUserInfo?.providerId || 'unknown',
          },
        }),
      })

      if (!response.ok) {
        const errorData: Record<string, unknown> = await response.json().catch(() => ({}))
        throw new Error(`Failed to complete OAuth authentication: ${errorData.error || 'Unknown error'}`)
      }

      await response.json()
      const message = result.isNewUser 
        ? 'Account created successfully with OAuth!'
        : 'Signed in successfully!'

      setSuccessMessage(message)
      setError(null)
      setAccountLinkingInfo(null)
      
      onSuccess?.(result)
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)

    } catch (error: unknown) {
      console.error('OAuth success handling error:', error)
      const errorMessage = 'Failed to complete authentication. Please try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [router, redirectTo, onSuccess, onError])
  // Check for OAuth redirect results on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getOAuthRedirectResult()
        if (result) {
          await handleOAuthSuccess(result)
        }
      } catch (error: unknown) {
        console.error('OAuth redirect error:', error)
        const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    }

    handleRedirectResult().catch(console.error)
  }, [onError, handleOAuthSuccess])


  const signInWithProvider = useCallback(async (provider: 'google' | 'apple') => {
    try {
      setOauthLoading(provider)
      setError(null)
      setAccountLinkingInfo(null)
      setSuccessMessage(null)

      // Detect if user is on mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      
      let result: OAuthSignInResult
      if (provider === 'google') {
        result = await signInWithGoogle(isMobile)
      } else {
        result = await signInWithApple(isMobile)
      }

      await handleOAuthSuccess(result)
      
    } catch (error: unknown) {
      console.error(`${provider} OAuth error:`, error)
      
      // Handle account exists with different credential error
      if (error instanceof Object && 'code' in error && error.code === 'auth/account-exists-with-different-credential') {
        try {
          const linkingInfo = await handleAccountExistsError(error as OAuthError)
          setAccountLinkingInfo(linkingInfo)
          const errorMessage = `An account already exists with this email (${linkingInfo.email}). You can sign in with: ${linkingInfo.existingProviders.join(', ')}`
          setError(errorMessage)
          onError?.(errorMessage)
        } catch (linkError: unknown) {
          const errorMessage = 'Account linking failed. Please try signing in with your original method.'
          setError(errorMessage)
          onError?.(errorMessage)
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : `${provider} authentication failed`
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } finally {
      setOauthLoading(null)
    }
  }, [handleOAuthSuccess, onError])

  const linkAccount = useCallback(async (emailPassword?: { email: string; password: string }) => {
    if (!accountLinkingInfo) {
      setError('No account linking information available')
      return false
    }

    try {
      setLoading(true)
      setError(null)

      // If user has email/password provider, they need to sign in first
      if (accountLinkingInfo.existingProviders.includes('password')) {
        if (!emailPassword) {
          setError('Please provide email and password to link accounts')
          return false
        }
        
        // Sign in with email/password first
        const { signIn } = await import('@cenie/firebase/auth')
        await signIn(emailPassword.email, emailPassword.password)
        
        // Then link the pending credential
        if (accountLinkingInfo.pendingCredential) {
          await linkPendingCredential(accountLinkingInfo.pendingCredential as AuthCredential)
        }
        
        setSuccessMessage('Accounts linked successfully!')
        setAccountLinkingInfo(null)
        
        setTimeout(() => {
          router.push(redirectTo)
        }, 1000)
        
        return true
      } else {
        setError('Please sign in with one of your existing providers first, then link the new account.')
        return false
      }
    } catch (error: unknown) {
      const errorMessage = 'Account linking failed: ' + (error instanceof Error ? error.message : 'Please try again')
      setError(errorMessage)
      onError?.(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [accountLinkingInfo, router, redirectTo, onError])

  const clearError = useCallback(() => {
    setError(null)
    setAccountLinkingInfo(null)
  }, [])

  const clearSuccess = useCallback(() => {
    setSuccessMessage(null)
  }, [])

  return {
    // State
    loading,
    oauthLoading,
    error,
    accountLinkingInfo,
    successMessage,
    
    // Actions
    signInWithProvider,
    linkAccount,
    clearError,
    clearSuccess,
    
    // Computed
    isLoading: loading || oauthLoading !== null,
  }
}