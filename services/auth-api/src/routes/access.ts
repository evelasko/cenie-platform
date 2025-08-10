import express from 'express'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@cenie/supabase'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

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

const grantAccessSchema = z.object({
  user_id: z.string().uuid(),
  app_name: z.enum(['hub', 'editorial', 'academy', 'learn']),
  role: z.enum(['viewer', 'user', 'editor', 'admin']).default('user'),
})

const updateAccessSchema = z.object({
  role: z.enum(['viewer', 'user', 'editor', 'admin']).optional(),
  is_active: z.boolean().optional(),
})

// Grant app access to user (admin only)
router.post('/grant', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminUserId = (req as any).userId
    const { user_id, app_name, role } = grantAccessSchema.parse(req.body)

    // Check if access already exists
    const { data: existingAccess } = await supabaseAdmin
      .from('user_app_access')
      .select('*')
      .eq('user_id', user_id)
      .eq('app_name', app_name)
      .single()

    if (existingAccess) {
      // Update existing access
      const { data: access, error } = await supabaseAdmin
        .from('user_app_access')
        .update({
          role,
          is_active: true,
          granted_by: adminUserId,
          granted_at: new Date().toISOString(),
        })
        .eq('user_id', user_id)
        .eq('app_name', app_name)
        .select()
        .single()

      if (error) {
        return res.status(400).json({
          error: 'Failed to update access',
          details: error.message,
        })
      }

      return res.json({ message: 'Access updated successfully', access })
    }

    // Create new access
    const { data: access, error } = await supabaseAdmin
      .from('user_app_access')
      .insert({
        user_id,
        app_name,
        role,
        is_active: true,
        granted_by: adminUserId,
        granted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return res.status(400).json({
        error: 'Failed to grant access',
        details: error.message,
      })
    }

    res.status(201).json({ message: 'Access granted successfully', access })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
    }

    console.error('Grant access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user access (admin only)
router.put('/:accessId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { accessId } = req.params
    const updates = updateAccessSchema.parse(req.body)

    const { data: access, error } = await supabaseAdmin
      .from('user_app_access')
      .update(updates)
      .eq('id', accessId)
      .select()
      .single()

    if (error) {
      return res.status(400).json({
        error: 'Failed to update access',
        details: error.message,
      })
    }

    res.json({ message: 'Access updated successfully', access })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
    }

    console.error('Update access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Revoke user access (admin only)
router.delete('/:accessId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { accessId } = req.params

    const { data: access, error } = await supabaseAdmin
      .from('user_app_access')
      .update({ is_active: false })
      .eq('id', accessId)
      .select()
      .single()

    if (error) {
      return res.status(400).json({
        error: 'Failed to revoke access',
        details: error.message,
      })
    }

    res.json({ message: 'Access revoked successfully', access })
  } catch (error) {
    console.error('Revoke access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// List all users with app access (admin only)
router.get('/users/:appName', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { appName } = req.params
    const { page = 1, limit = 20 } = req.query

    const offset = (Number(page) - 1) * Number(limit)

    const { data: users, error } = await supabaseAdmin
      .from('user_app_access')
      .select(`
        *,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('app_name', appName)
      .order('granted_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1)

    if (error) {
      return res.status(400).json({
        error: 'Failed to fetch users',
        details: error.message,
      })
    }

    res.json({ users, page: Number(page), limit: Number(limit) })
  } catch (error) {
    console.error('List users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Bulk grant access (admin only)
router.post('/bulk-grant', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminUserId = (req as any).userId
    const { user_ids, app_name, role = 'user' } = req.body

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({ error: 'user_ids must be a non-empty array' })
    }

    const accessRecords = user_ids.map(user_id => ({
      user_id,
      app_name,
      role,
      is_active: true,
      granted_by: adminUserId,
      granted_at: new Date().toISOString(),
    }))

    const { data: access, error } = await supabaseAdmin
      .from('user_app_access')
      .upsert(accessRecords, {
        onConflict: 'user_id,app_name',
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      return res.status(400).json({
        error: 'Failed to bulk grant access',
        details: error.message,
      })
    }

    res.json({
      message: `Access granted to ${user_ids.length} users`,
      access,
    })
  } catch (error) {
    console.error('Bulk grant access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as accessRoutes }