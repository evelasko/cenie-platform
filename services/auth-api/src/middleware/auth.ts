import { Request, Response, NextFunction } from 'express'
import { auth, firestore } from '../config/firebase'
import { COLLECTIONS, UserAppAccess } from '../types/firestore'

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token)

    // Attach user ID and decoded token to request for downstream middleware/routes
    ;(req as any).userId = decodedToken.uid
    ;(req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      customClaims: decodedToken,
    }

    next()
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: error.code 
      })
    }

    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: error.code 
      })
    }

    console.error('Authentication middleware error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Check if user has admin role in any app
    const adminAccessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('role', '==', 'admin')
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (adminAccessSnapshot.empty) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin check middleware error:', error)
    res.status(500).json({ error: 'Authorization failed' })
  }
}

export function requireAppAccess(appName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const accessSnapshot = await firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .where('userId', '==', userId)
        .where('appName', '==', appName)
        .where('isActive', '==', true)
        .limit(1)
        .get()

      if (accessSnapshot.empty) {
        return res.status(403).json({ 
          error: `Access denied to ${appName}`,
          code: 'APP_ACCESS_DENIED'
        })
      }

      const access = accessSnapshot.docs[0].data() as UserAppAccess
      ;(req as any).userAppAccess = { ...access, id: accessSnapshot.docs[0].id }

      next()
    } catch (error) {
      console.error('App access middleware error:', error)
      res.status(500).json({ error: 'Authorization failed' })
    }
  }
}

export function requireRole(appName: string, requiredRole: string) {
  const roleHierarchy = ['viewer', 'user', 'editor', 'admin']
  const requiredRoleLevel = roleHierarchy.indexOf(requiredRole)

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const accessSnapshot = await firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .where('userId', '==', userId)
        .where('appName', '==', appName)
        .where('isActive', '==', true)
        .limit(1)
        .get()

      if (accessSnapshot.empty) {
        return res.status(403).json({ 
          error: `Access denied to ${appName}`,
          code: 'APP_ACCESS_DENIED'
        })
      }

      const access = accessSnapshot.docs[0].data() as UserAppAccess
      const userRoleLevel = roleHierarchy.indexOf(access.role)

      if (userRoleLevel < requiredRoleLevel) {
        return res.status(403).json({
          error: `Insufficient permissions. Required: ${requiredRole}, Current: ${access.role}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        })
      }

      ;(req as any).userAppAccess = { ...access, id: accessSnapshot.docs[0].id }

      next()
    } catch (error) {
      console.error('Role check middleware error:', error)
      res.status(500).json({ error: 'Authorization failed' })
    }
  }
}