'use client'

import { useState } from 'react'
import { Button } from '@cenie/ui'
import { AlertTriangle, LinkIcon, Mail } from 'lucide-react'

interface OAuthErrorHandlerProps {
  error: string | null
  accountLinkingInfo?: {
    email: string
    existingProviders: string[]
    pendingCredential: any
  } | null
  onLinkAccount?: () => void
  onRetry?: () => void
  onContactSupport?: () => void
}

export function OAuthErrorHandler({
  error,
  accountLinkingInfo,
  onLinkAccount,
  onRetry,
  onContactSupport
}: OAuthErrorHandlerProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  if (!error) return null

  const handleRetry = async () => {
    if (!onRetry) return
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const getProviderDisplayName = (providerId: string): string => {
    switch (providerId) {
      case 'password':
        return 'Email/Password'
      case 'google.com':
        return 'Google'
      case 'apple.com':
        return 'Apple'
      case 'facebook.com':
        return 'Facebook'
      case 'twitter.com':
        return 'Twitter'
      case 'github.com':
        return 'GitHub'
      default:
        return providerId
    }
  }

  const isNetworkError = error.includes('network') || error.includes('Network')
  const isPopupError = error.includes('popup') || error.includes('Popup')
  const isAccountExistsError = accountLinkingInfo !== null
  const isTooManyRequestsError = error.includes('Too many') || error.includes('too many')
  const isUserDisabledError = error.includes('disabled') || error.includes('Disabled')

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {isAccountExistsError && 'Account Already Exists'}
            {isNetworkError && 'Connection Problem'}
            {isPopupError && 'Popup Blocked'}
            {isTooManyRequestsError && 'Too Many Attempts'}
            {isUserDisabledError && 'Account Disabled'}
            {!isAccountExistsError && !isNetworkError && !isPopupError && !isTooManyRequestsError && !isUserDisabledError && 'Sign-in Failed'}
          </h3>
          
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
            
            {/* Account Linking Information */}
            {isAccountExistsError && accountLinkingInfo && (
              <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                <p className="font-medium">Email: {accountLinkingInfo.email}</p>
                <p className="mt-1">
                  Existing sign-in methods: {' '}
                  {accountLinkingInfo.existingProviders.map(getProviderDisplayName).join(', ')}
                </p>
                <p className="mt-2 text-xs">
                  To link your accounts, please sign in with one of your existing methods first.
                </p>
              </div>
            )}

            {/* Helpful hints based on error type */}
            {isPopupError && (
              <div className="mt-2 text-xs">
                <p>• Please allow popups in your browser</p>
                <p>• Try signing in again</p>
                <p>• Consider using a different browser</p>
              </div>
            )}

            {isNetworkError && (
              <div className="mt-2 text-xs">
                <p>• Check your internet connection</p>
                <p>• Try again in a moment</p>
                <p>• Disable any VPN or proxy temporarily</p>
              </div>
            )}

            {isTooManyRequestsError && (
              <div className="mt-2 text-xs">
                <p>• Please wait a few minutes before trying again</p>
                <p>• Clear your browser cache if the problem persists</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Retry Button */}
            {(isNetworkError || isPopupError) && onRetry && (
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>
            )}

            {/* Account Linking Button */}
            {isAccountExistsError && onLinkAccount && (
              <Button
                onClick={onLinkAccount}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Link Accounts
              </Button>
            )}

            {/* Contact Support Button */}
            {(isUserDisabledError || (!isNetworkError && !isPopupError && !isAccountExistsError)) && onContactSupport && (
              <Button
                onClick={onContactSupport}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <Mail className="w-4 h-4 mr-1" />
                Contact Support
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Success message component for OAuth flows
interface OAuthSuccessMessageProps {
  message: string
  isNewUser?: boolean
  onContinue?: () => void
}

export function OAuthSuccessMessage({
  message,
  isNewUser,
  onContinue
}: OAuthSuccessMessageProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 text-green-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            {isNewUser ? 'Account Created Successfully!' : 'Signed In Successfully!'}
          </h3>
          <div className="mt-1 text-sm text-green-700">
            <p>{message}</p>
            {isNewUser && (
              <p className="mt-1 text-xs">
                You now have access to all CENIE applications with your single account.
              </p>
            )}
          </div>
          {onContinue && (
            <div className="mt-3">
              <Button
                onClick={onContinue}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continue to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}