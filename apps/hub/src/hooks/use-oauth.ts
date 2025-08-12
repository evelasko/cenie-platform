'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithGoogle,
  signInWithApple,
  getOAuthRedirectResult,
  handleAccountExistsError,
  linkPendingCredential,
  OAuthSignInResult,
  OAuthError,
} from '@cenie/firebase/auth'

interface UseOAuthOptions {
  redirectTo?: string
  onSuccess?: (result: OAuthSignInResult) => void
  onError?: (error: string) => void
}

interface AccountLinkingInfo {
  email: string
  existingProviders: string[]
  pendingCredential: any
}

export function useOAuth(options: UseOAuthOptions = {}) {
  const { redirectTo = '/dashboard', onSuccess, onError } = options
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accountLinkingInfo, setAccountLinkingInfo] = useState<AccountLinkingInfo | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Check for OAuth redirect results on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getOAuthRedirectResult()
        if (result) {
          await handleOAuthSuccess(result)
        }
      } catch (error: any) {
        console.error('OAuth redirect error:', error)
        const errorMessage = error.message || 'OAuth authentication failed'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    }

    handleRedirectResult()
  }, [onError])

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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to complete OAuth authentication')
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

    } catch (error: any) {
      console.error('OAuth success handling error:', error)
      const errorMessage = 'Failed to complete authentication. Please try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [router, redirectTo, onSuccess, onError])

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
      
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error)
      
      // Handle account exists with different credential error
      if (error.code === 'auth/account-exists-with-different-credential') {
        try {
          const linkingInfo = await handleAccountExistsError(error as OAuthError)
          setAccountLinkingInfo(linkingInfo)
          const errorMessage = `An account already exists with this email (${linkingInfo.email}). You can sign in with: ${linkingInfo.existingProviders.join(', ')}`
          setError(errorMessage)
          onError?.(errorMessage)
        } catch (linkError: any) {
          const errorMessage = 'Account linking failed. Please try signing in with your original method.'
          setError(errorMessage)
          onError?.(errorMessage)
        }
      } else {
        const errorMessage = error.message || `${provider} authentication failed`
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
          await linkPendingCredential(accountLinkingInfo.pendingCredential)
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
    } catch (error: any) {
      const errorMessage = 'Account linking failed: ' + (error.message || 'Please try again')
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