import express from 'express'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@cenie/supabase'

const router = express.Router()

// Initialize Supabase admin client
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

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
})

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = signUpSchema.parse(req.body)

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      return res.status(400).json({
        error: authError.message,
        code: authError.status,
      })
    }

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
    }

    // Grant default access to hub
    const { error: accessError } = await supabaseAdmin
      .from('user_app_access')
      .insert({
        user_id: authData.user.id,
        app_name: 'hub',
        role: 'user',
        is_active: true,
        granted_at: new Date().toISOString(),
      })

    if (accessError) {
      console.error('Error granting access:', accessError)
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
    }

    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Verify user endpoint
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params

    const { data, error } = await supabaseAdmin.auth.admin.getUserByAccessToken(token)

    if (error) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: error.status,
      })
    }

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
        email_confirmed: data.user.email_confirmed_at !== null,
      },
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = resetPasswordSchema.parse(req.body)

    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (error) {
      return res.status(400).json({
        error: error.message,
        code: error.status,
      })
    }

    res.json({ message: 'Password reset email sent' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
    }

    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Refresh session
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' })
    }

    const { data, error } = await supabaseAdmin.auth.admin.refreshSession(refresh_token)

    if (error) {
      return res.status(401).json({
        error: error.message,
        code: error.status,
      })
    }

    res.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Revoke session
router.post('/revoke', async (req, res) => {
  try {
    const { access_token } = req.body

    if (!access_token) {
      return res.status(400).json({ error: 'Access token required' })
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByAccessToken(access_token)

    if (userError) {
      return res.status(401).json({
        error: 'Invalid token',
        code: userError.status,
      })
    }

    const { error: revokeError } = await supabaseAdmin.auth.admin.signOut(userData.user.id)

    if (revokeError) {
      return res.status(400).json({
        error: revokeError.message,
        code: revokeError.status,
      })
    }

    res.json({ message: 'Session revoked successfully' })
  } catch (error) {
    console.error('Token revoke error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as authRoutes }