import express from 'express'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@cenie/supabase'
import { authenticateToken } from '../middleware/auth'

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

const updateProfileSchema = z.object({
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId
    const updates = updateProfileSchema.parse(req.body)

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return res.status(400).json({
        error: 'Failed to update profile',
        details: error.message,
      })
    }

    res.json({ profile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
    }

    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user app access
router.get('/apps', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId

    const { data: access, error } = await supabaseAdmin
      .from('user_app_access')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('granted_at', { ascending: false })

    if (error) {
      return res.status(400).json({
        error: 'Failed to fetch app access',
        details: error.message,
      })
    }

    res.json({ access })
  } catch (error) {
    console.error('Get app access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Check specific app access
router.get('/apps/:appName/access', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId
    const { appName } = req.params

    const { data: access, error } = await supabaseAdmin
      .from('user_app_access')
      .select('*')
      .eq('user_id', userId)
      .eq('app_name', appName)
      .eq('is_active', true)
      .single()

    if (error) {
      return res.json({
        hasAccess: false,
        role: null,
      })
    }

    res.json({
      hasAccess: true,
      role: access.role,
      grantedAt: access.granted_at,
    })
  } catch (error) {
    console.error('Check app access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user subscriptions
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId

    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({
        error: 'Failed to fetch subscriptions',
        details: error.message,
      })
    }

    res.json({ subscriptions })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId

    // Delete user data in order (foreign keys first)
    await supabaseAdmin.from('subscriptions').delete().eq('user_id', userId)
    await supabaseAdmin.from('user_app_access').delete().eq('user_id', userId)
    await supabaseAdmin.from('profiles').delete().eq('id', userId)
    
    // Delete auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      return res.status(400).json({
        error: 'Failed to delete account',
        details: deleteError.message,
      })
    }

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as userRoutes }