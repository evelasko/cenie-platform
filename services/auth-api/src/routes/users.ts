import express, { Router } from 'express'
import { z } from 'zod'
import { firestore } from '../config/firebase'
import { COLLECTIONS, Profile, UserAppAccess, Subscription, SerializedProfile, SerializedUserAppAccess, SerializedSubscription } from '../types/firestore'
import { authenticateToken } from '../middleware/auth'
import { Timestamp } from 'firebase-admin/firestore'

const router: Router = express.Router()

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})

// Helper function to serialize timestamps
const serializeProfile = (profile: Profile): SerializedProfile => ({
  ...profile,
  createdAt: profile.createdAt.toDate().toISOString(),
  updatedAt: profile.updatedAt.toDate().toISOString(),
})

const serializeAccess = (access: UserAppAccess): SerializedUserAppAccess => ({
  ...access,
  grantedAt: access.grantedAt.toDate().toISOString(),
})

const serializeSubscription = (subscription: Subscription): SerializedSubscription => ({
  ...subscription,
  createdAt: subscription.createdAt.toDate().toISOString(),
  updatedAt: subscription.updatedAt.toDate().toISOString(),
  currentPeriodStart: subscription.currentPeriodStart?.toDate().toISOString(),
  currentPeriodEnd: subscription.currentPeriodEnd?.toDate().toISOString(),
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId

    const profileDoc = await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userId)
      .get()

    if (!profileDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const profile = profileDoc.data() as Profile
    res.json({ profile: serializeProfile(profile) })
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

    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userId)
      .update(updateData)

    // Get updated profile
    const profileDoc = await firestore
      .collection(COLLECTIONS.PROFILES)
      .doc(userId)
      .get()

    const profile = profileDoc.data() as Profile
    res.json({ profile: serializeProfile(profile) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
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

    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('grantedAt', 'desc')
      .get()

    const access = accessSnapshot.docs.map(doc => {
      const data = doc.data() as UserAppAccess
      return serializeAccess({ ...data, id: doc.id })
    })

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

    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (accessSnapshot.empty) {
      return res.json({
        hasAccess: false,
        role: null,
      })
    }

    const access = accessSnapshot.docs[0].data() as UserAppAccess

    res.json({
      hasAccess: true,
      role: access.role,
      grantedAt: access.grantedAt.toDate().toISOString(),
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

    const subscriptionsSnapshot = await firestore
      .collection(COLLECTIONS.SUBSCRIPTIONS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const subscriptions = subscriptionsSnapshot.docs.map(doc => {
      const data = doc.data() as Subscription
      return serializeSubscription({ ...data, id: doc.id })
    })

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

    // Start a batch operation
    const batch = firestore.batch()

    // Delete user subscriptions
    const subscriptionsSnapshot = await firestore
      .collection(COLLECTIONS.SUBSCRIPTIONS)
      .where('userId', '==', userId)
      .get()

    subscriptionsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    // Delete user app access
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .get()

    accessSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    // Delete user profile
    const profileRef = firestore.collection(COLLECTIONS.PROFILES).doc(userId)
    batch.delete(profileRef)

    // Commit the batch
    await batch.commit()

    // Delete auth user (imported from Firebase Admin)
    const { auth } = await import('../config/firebase')
    await auth.deleteUser(userId)

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as userRoutes }