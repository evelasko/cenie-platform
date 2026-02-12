/**
 * @deprecated This module is deprecated. Use the shared packages instead:
 *
 * - For client-side auth API calls: `@cenie/auth-client` (authClient)
 * - For server-side session/middleware: `@cenie/auth-server`
 * - For app access checks (server): `@cenie/auth-server/helpers` (checkAppAccess)
 * - For OAuth sign-in: `@cenie/oauth-handlers/hooks` (useOAuth)
 *
 * This file is kept temporarily for backward compatibility with sign-up page.
 * TODO: Migrate sign-up page to shared packages and remove this file.
 */

// Use local API in development (Editorial app), Hub API in production
const HUB_API_URL =
  process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_HUB_API_URL : '/api' // Use Editorial app's local API endpoints

import { logger } from './logger-client'

export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UserAppAccess {
  id: string
  userId: string
  appName: string
  role: 'viewer' | 'user' | 'editor' | 'admin'
  isActive: boolean
  grantedAt: any
  grantedBy: string
}

class HubAuthAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${HUB_API_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async signUp(userData: SignUpData): Promise<ApiResponse> {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async verifyUser(token: string): Promise<ApiResponse> {
    return this.makeRequest(`/auth/verify/${token}`, {
      method: 'POST',
    })
  }

  async sendVerificationEmail(idToken: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/send-verification', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
  }

  async refreshToken(idToken: string): Promise<ApiResponse<{ customToken: string }>> {
    return this.makeRequest('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
  }

  async resetPassword(email: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async updatePassword(idToken: string, newPassword: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/update-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ newPassword }),
    })
  }

  async getUserProfile(idToken: string): Promise<ApiResponse> {
    return this.makeRequest('/users/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
  }

  async updateUserProfile(idToken: string, profileData: any): Promise<ApiResponse> {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(profileData),
    })
  }

  async getUserAppAccess(idToken: string, appName: string): Promise<ApiResponse<UserAppAccess[]>> {
    return this.makeRequest(`/users/apps/${appName}/access`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
  }

  async checkAppAccess(idToken: string, appName: string): Promise<boolean> {
    const response = await this.getUserAppAccess(idToken, appName)

    // The API returns { success: true, data: [...] }
    // But makeRequest wraps it again as { success: true, data: { success: true, data: [...] } }
    // So we need to access response.data.data for the actual array
    const accessData = response.data
    const hasAccess = !!(
      response.success &&
      accessData &&
      Array.isArray(accessData) &&
      accessData.length > 0
    )

    logger.debug('[HubAuth] Access check result', {
      hasAccess,
      responseSuccess: response.success,
      accessDataLength: Array.isArray(accessData) ? accessData.length : 0,
    })

    return hasAccess
  }
}

export const hubAuth = new HubAuthAPI()
