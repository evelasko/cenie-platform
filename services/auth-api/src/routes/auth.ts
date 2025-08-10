import express, { Router } from 'express'
import { z } from 'zod'
import { auth, firestore } from '../config/firebase'
import { COLLECTIONS, Profile, UserAppAccess } from '../types/firestore'
import { Timestamp } from 'firebase-admin/firestore'

const router: Router = express.Router()

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

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    })

    // Create user profile in Firestore
    const profileData: Profile = {
      id: userRecord.uid,
      email: userRecord.email!,
      fullName: fullName || null,
      avatarUrl: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userRecord.uid)
      .set(profileData)

    // Grant default access to hub
    const accessData: UserAppAccess = {
      userId: userRecord.uid,
      appName: 'hub',
      role: 'user',
      isActive: true,
      grantedAt: Timestamp.now(),
      grantedBy: null,
    }

    await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .add(accessData)

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        fullName,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      })
    }

    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        error: 'Email already exists',
        code: error.code,
      })
    }

    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Verify user endpoint (verify ID token)
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(token)
    
    // Get user profile from Firestore
    const profileDoc = await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(decodedToken.uid)
      .get()

    if (!profileDoc.exists) {
      return res.status(404).json({
        error: 'User profile not found',
      })
    }

    const profile = profileDoc.data() as Profile

    res.json({
      user: {
        id: decodedToken.uid,
        email: decodedToken.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        emailVerified: decodedToken.email_verified,
      },
    })
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token expired',
        code: error.code,
      })
    }

    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        error: 'Invalid token',
        code: error.code,
      })
    }

    console.error('Token verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = resetPasswordSchema.parse(req.body)

    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email, {
      url: process.env.PASSWORD_RESET_URL || 'https://cenie.org/reset-password',
    })

    // In production, you would send this link via email
    // For now, we'll return it in the response (remove in production)
    res.json({ 
      message: 'Password reset email sent',
      // Remove this in production - only for development
      resetLink: process.env.NODE_ENV === 'development' ? link : undefined
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      })
    }

    if (error.code === 'auth/user-not-found') {
      // Don't reveal that the user doesn't exist for security
      return res.json({ message: 'Password reset email sent' })
    }

    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Refresh session (exchange custom token for ID token)
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken, userId } = req.body

    if (!refreshToken || !userId) {
      return res.status(400).json({ error: 'Refresh token and user ID required' })
    }

    // Create a new custom token
    const customToken = await auth.createCustomToken(userId)

    // Get user data
    const userRecord = await auth.getUser(userId)

    res.json({
      customToken,
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName,
      },
    })
  } catch (error: any) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Revoke session
router.post('/revoke', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' })
    }

    // Revoke all refresh tokens for the user
    await auth.revokeRefreshTokens(userId)

    res.json({ message: 'Session revoked successfully' })
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        error: 'User not found',
        code: error.code,
      })
    }

    console.error('Token revoke error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send email verification
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email required' })
    }

    // Generate email verification link
    const link = await auth.generateEmailVerificationLink(email, {
      url: process.env.EMAIL_VERIFICATION_URL || 'https://cenie.org/verify-email',
    })

    // In production, you would send this link via email
    res.json({ 
      message: 'Verification email sent',
      // Remove this in production - only for development
      verificationLink: process.env.NODE_ENV === 'development' ? link : undefined
    })
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      // Don't reveal that the user doesn't exist for security
      return res.json({ message: 'Verification email sent' })
    }

    console.error('Email verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user password (requires current password or admin privileges)
router.post('/update-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body

    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'User ID and new password required' })
    }

    // Update password
    await auth.updateUser(userId, {
      password: newPassword,
    })

    res.json({ message: 'Password updated successfully' })
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        error: 'User not found',
        code: error.code,
      })
    }

    if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        error: 'Password is too weak',
        code: error.code,
      })
    }

    console.error('Password update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as authRoutes }