import { createServerClient } from '../server'
import type { Database } from '../types/database'

export async function getUser() {
  const supabase = createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return { user: null, error }
  }

  return { user, error: null }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { profile, error }
}

export async function getUserAppAccess(userId: string) {
  const supabase = createServerClient()
  const { data: access, error } = await supabase
    .from('user_app_access')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)

  return { access: access || [], error }
}

export async function hasAppAccess(userId: string, appName: string): Promise<boolean> {
  const { access, error } = await getUserAppAccess(userId)
  
  if (error) return false
  
  return access.some(item => item.app_name === appName)
}

export async function getUserRole(userId: string, appName: string): Promise<string | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_app_access')
    .select('role')
    .eq('user_id', userId)
    .eq('app_name', appName)
    .eq('is_active', true)
    .single()

  if (error) return null
  
  return data.role
}

export async function isAdmin(userId: string, appName: string): Promise<boolean> {
  const role = await getUserRole(userId, appName)
  return role === 'admin'
}

export async function requireAuth() {
  const { user, error } = await getUser()
  
  if (error || !user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireAppAccess(appName: string) {
  const user = await requireAuth()
  const hasAccess = await hasAppAccess(user.id, appName)
  
  if (!hasAccess) {
    throw new Error(`Access denied to ${appName}`)
  }
  
  return user
}

export async function requireRole(appName: string, requiredRole: string) {
  const user = await requireAppAccess(appName)
  const userRole = await getUserRole(user.id, appName)
  
  const roleHierarchy = ['viewer', 'user', 'editor', 'admin']
  const userRoleLevel = roleHierarchy.indexOf(userRole || 'viewer')
  const requiredRoleLevel = roleHierarchy.indexOf(requiredRole)
  
  if (userRoleLevel < requiredRoleLevel) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, Current: ${userRole}`)
  }
  
  return user
}