import { NextRequest } from 'next/server'
import { getAdminAuth, getAdminFirestore } from './firebase-admin'
import { COLLECTIONS, UserAppAccess } from './types'

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  user?: any
}

export async function authenticateRequest(request: NextRequest): Promise<{ userId: string; user: any } | { error: string; status: number }> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return { error: 'Access token required', status: 401 }
    }

    // Verify Firebase ID token
    const auth = getAdminAuth()
    const decodedToken = await auth.verifyIdToken(token)

    return {
      userId: decodedToken.uid,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        customClaims: decodedToken,
      }
    }
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return { error: 'Token expired', status: 401 }
    }

    if (error.code === 'auth/invalid-id-token') {
      return { error: 'Invalid token', status: 401 }
    }

    console.error('Authentication error:', error)
    return { error: 'Authentication failed', status: 401 }
  }
}

export async function requireAdmin(userId: string): Promise<{ success: boolean; error?: string; status?: number }> {
  try {
    if (!userId) {
      return { success: false, error: 'Authentication required', status: 401 }
    }

    // Check if user has admin role in any app
    const firestore = getAdminFirestore()
    const adminAccessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('role', '==', 'admin')
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (adminAccessSnapshot.empty) {
      return { success: false, error: 'Admin access required', status: 403 }
    }

    return { success: true }
  } catch (error) {
    console.error('Admin check error:', error)
    return { success: false, error: 'Authorization failed', status: 500 }
  }
}

export async function requireAppAccess(userId: string, appName: string): Promise<{ success: boolean; access?: UserAppAccess; error?: string; status?: number }> {
  try {
    if (!userId) {
      return { success: false, error: 'Authentication required', status: 401 }
    }

    const firestore = getAdminFirestore()
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      return { 
        success: false, 
        error: `Access denied to ${appName}`, 
        status: 403 
      }
    }

    const access = accessSnapshot.docs[0].data() as UserAppAccess
    return { success: true, access: { ...access, id: accessSnapshot.docs[0].id } }
  } catch (error) {
    console.error('App access error:', error)
    return { success: false, error: 'Authorization failed', status: 500 }
  }
}

export async function requireRole(userId: string, appName: string, requiredRole: string): Promise<{ success: boolean; access?: UserAppAccess; error?: string; status?: number }> {
  const roleHierarchy = ['viewer', 'user', 'editor', 'admin']
  const requiredRoleLevel = roleHierarchy.indexOf(requiredRole)

  try {
    if (!userId) {
      return { success: false, error: 'Authentication required', status: 401 }
    }

    const firestore = getAdminFirestore()
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      return { 
        success: false, 
        error: `Access denied to ${appName}`, 
        status: 403 
      }
    }

    const access = accessSnapshot.docs[0].data() as UserAppAccess
    const userRoleLevel = roleHierarchy.indexOf(access.role)

    if (userRoleLevel < requiredRoleLevel) {
      return {
        success: false,
        error: `Insufficient permissions. Required: ${requiredRole}, Current: ${access.role}`,
        status: 403
      }
    }

    return { success: true, access: { ...access, id: accessSnapshot.docs[0].id } }
  } catch (error) {
    console.error('Role check error:', error)
    return { success: false, error: 'Authorization failed', status: 500 }
  }
}