import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@cenie/supabase'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const { data: userData, error } = await supabaseAdmin.auth.admin.getUserByAccessToken(token)

    if (error) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        code: error.status 
      })
    }

    // Attach user ID to request for downstream middleware/routes
    ;(req as any).userId = userData.user.id
    ;(req as any).user = userData.user

    next()
  } catch (error) {
    console.error('Authentication middleware error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Check if user has admin role in any app
    const { data: adminAccess, error } = await supabaseAdmin
      .from('user_app_access')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .limit(1)

    if (error || !adminAccess || adminAccess.length === 0) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin check middleware error:', error)
    res.status(500).json({ error: 'Authorization failed' })
  }
}

export async function requireAppAccess(appName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { data: access, error } = await supabaseAdmin
        .from('user_app_access')
        .select('*')
        .eq('user_id', userId)
        .eq('app_name', appName)
        .eq('is_active', true)
        .single()

      if (error || !access) {
        return res.status(403).json({ 
          error: `Access denied to ${appName}`,
          code: 'APP_ACCESS_DENIED'
        })
      }

      ;(req as any).userAppAccess = access

      next()
    } catch (error) {
      console.error('App access middleware error:', error)
      res.status(500).json({ error: 'Authorization failed' })
    }
  }
}

export async function requireRole(appName: string, requiredRole: string) {
  const roleHierarchy = ['viewer', 'user', 'editor', 'admin']
  const requiredRoleLevel = roleHierarchy.indexOf(requiredRole)

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const { data: access, error } = await supabaseAdmin
        .from('user_app_access')
        .select('*')
        .eq('user_id', userId)
        .eq('app_name', appName)
        .eq('is_active', true)
        .single()

      if (error || !access) {
        return res.status(403).json({ 
          error: `Access denied to ${appName}`,
          code: 'APP_ACCESS_DENIED'
        })
      }

      const userRoleLevel = roleHierarchy.indexOf(access.role)

      if (userRoleLevel < requiredRoleLevel) {
        return res.status(403).json({
          error: `Insufficient permissions. Required: ${requiredRole}, Current: ${access.role}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        })
      }

      ;(req as any).userAppAccess = access

      next()
    } catch (error) {
      console.error('Role check middleware error:', error)
      res.status(500).json({ error: 'Authorization failed' })
    }
  }
}