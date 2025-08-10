import { getIdToken } from '@cenie/firebase/auth'

export interface AuthApiClient {
  baseUrl: string
  getAuthHeaders(): Promise<Record<string, string>>
}

export class CenieAuthClient implements AuthApiClient {
  baseUrl: string

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getIdToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `Request failed: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async signup(email: string, password: string, fullName?: string) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    })
  }

  async verifyToken(token: string) {
    return this.request(`/api/auth/verify/${token}`)
  }

  async resetPassword(email: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async refreshToken(refreshToken: string, userId: string) {
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, userId }),
    })
  }

  async revokeSession(userId: string) {
    return this.request('/api/auth/revoke', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async sendEmailVerification(email: string) {
    return this.request('/api/auth/send-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async updatePassword(userId: string, newPassword: string) {
    return this.request('/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ userId, newPassword }),
    })
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/api/users/profile')
  }

  async updateUserProfile(updates: { fullName?: string; avatarUrl?: string }) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async getUserApps() {
    return this.request('/api/users/apps')
  }

  async checkAppAccess(appName: string) {
    return this.request(`/api/users/apps/${appName}/access`)
  }

  async getUserSubscriptions() {
    return this.request('/api/users/subscriptions')
  }

  async deleteAccount() {
    return this.request('/api/users/account', {
      method: 'DELETE',
    })
  }

  // Access control endpoints (admin only)
  async grantAccess(userId: string, appName: string, role: string) {
    return this.request('/api/access/grant', {
      method: 'POST',
      body: JSON.stringify({ userId, appName, role }),
    })
  }

  async updateAccess(accessId: string, updates: { role?: string; isActive?: boolean }) {
    return this.request(`/api/access/${accessId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async revokeAccess(accessId: string) {
    return this.request(`/api/access/${accessId}`, {
      method: 'DELETE',
    })
  }

  async getUsersByApp(appName: string, page = 1, limit = 20) {
    return this.request(`/api/access/users/${appName}?page=${page}&limit=${limit}`)
  }

  async bulkGrantAccess(userIds: string[], appName: string, role: string) {
    return this.request('/api/access/bulk-grant', {
      method: 'POST',
      body: JSON.stringify({ userIds, appName, role }),
    })
  }
}

// Default instance
export const authClient = new CenieAuthClient()

// Hook for getting the auth client with custom base URL
export function useAuthClient(baseUrl?: string) {
  return baseUrl ? new CenieAuthClient(baseUrl) : authClient
}