import express, { Router } from 'express'
import { z } from 'zod'
import { firestore } from '../config/firebase'
import { COLLECTIONS, UserAppAccess, Profile, SerializedUserAppAccess } from '../types/firestore'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { Timestamp } from 'firebase-admin/firestore'

const router: Router = express.Router()

const grantAccessSchema = z.object({
  userId: z.string(),
  appName: z.enum(['hub', 'editorial', 'academy', 'learn']),
  role: z.enum(['viewer', 'user', 'editor', 'admin']).default('user'),
})

const updateAccessSchema = z.object({
  role: z.enum(['viewer', 'user', 'editor', 'admin']).optional(),
  isActive: z.boolean().optional(),
})

// Helper function to serialize access
const serializeAccess = (access: UserAppAccess): SerializedUserAppAccess => ({
  ...access,
  grantedAt: access.grantedAt.toDate().toISOString(),
})

// Grant app access to user (admin only)
router.post('/grant', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminUserId = (req as any).userId
    const { userId, appName, role } = grantAccessSchema.parse(req.body)

    // Check if access already exists
    const existingAccessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('userId', '==', userId)
      .where('appName', '==', appName)
      .limit(1)
      .get()

    if (!existingAccessSnapshot.empty) {
      // Update existing access
      const docId = existingAccessSnapshot.docs[0].id
      
      await firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .doc(docId)
        .update({
          role,
          isActive: true,
          grantedBy: adminUserId,
          grantedAt: Timestamp.now(),
        })

      const updatedDoc = await firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .doc(docId)
        .get()

      const access = { ...updatedDoc.data() as UserAppAccess, id: docId }
      return res.json({ message: 'Access updated successfully', access: serializeAccess(access) })
    }

    // Create new access
    const accessData: UserAppAccess = {
      userId,
      appName,
      role,
      isActive: true,
      grantedBy: adminUserId,
      grantedAt: Timestamp.now(),
    }

    const docRef = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .add(accessData)

    const access = { ...accessData, id: docRef.id }
    res.status(201).json({ message: 'Access granted successfully', access: serializeAccess(access) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
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

    const updateData: any = {}
    if (updates.role !== undefined) updateData.role = updates.role
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive

    await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .update(updateData)

    const updatedDoc = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .get()

    if (!updatedDoc.exists) {
      return res.status(404).json({ error: 'Access record not found' })
    }

    const access = { ...updatedDoc.data() as UserAppAccess, id: accessId }
    res.json({ message: 'Access updated successfully', access: serializeAccess(access) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
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

    await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .update({ isActive: false })

    const updatedDoc = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .get()

    if (!updatedDoc.exists) {
      return res.status(404).json({ error: 'Access record not found' })
    }

    const access = { ...updatedDoc.data() as UserAppAccess, id: accessId }
    res.json({ message: 'Access revoked successfully', access: serializeAccess(access) })
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

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum - 1) * limitNum

    // Get access records with pagination
    const accessSnapshot = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .where('appName', '==', appName)
      .orderBy('grantedAt', 'desc')
      .limit(limitNum)
      .offset(offset)
      .get()

    // Get user profiles for each access record
    const users = await Promise.all(
      accessSnapshot.docs.map(async (doc) => {
        const accessData = doc.data() as UserAppAccess
        const profileDoc = await firestore
          .collection(COLLECTIONS.PROFILES)
          .doc(accessData.userId)
          .get()

        const profile = profileDoc.exists ? profileDoc.data() as Profile : null

        return {
          ...serializeAccess({ ...accessData, id: doc.id }),
          profile: profile ? {
            id: profile.id,
            email: profile.email,
            fullName: profile.fullName,
            avatarUrl: profile.avatarUrl,
          } : null,
        }
      })
    )

    res.json({ users, page: pageNum, limit: limitNum })
  } catch (error) {
    console.error('List users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Bulk grant access (admin only)
router.post('/bulk-grant', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminUserId = (req as any).userId
    const { userIds, appName, role = 'user' } = req.body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds must be a non-empty array' })
    }

    if (!['hub', 'editorial', 'academy', 'learn'].includes(appName)) {
      return res.status(400).json({ error: 'Invalid app name' })
    }

    if (!['viewer', 'user', 'editor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const batch = firestore.batch()
    const accessRecords: SerializedUserAppAccess[] = []

    for (const userId of userIds) {
      // Check if access already exists
      const existingAccessSnapshot = await firestore
        .collection(COLLECTIONS.USER_APP_ACCESS)
        .where('userId', '==', userId)
        .where('appName', '==', appName)
        .limit(1)
        .get()

      const accessData: UserAppAccess = {
        userId,
        appName,
        role,
        isActive: true,
        grantedBy: adminUserId,
        grantedAt: Timestamp.now(),
      }

      if (!existingAccessSnapshot.empty) {
        // Update existing access
        const docRef = existingAccessSnapshot.docs[0].ref
        batch.update(docRef, {
          userId: accessData.userId,
          appName: accessData.appName,
          role: accessData.role,
          isActive: accessData.isActive,
          grantedBy: accessData.grantedBy,
          grantedAt: accessData.grantedAt,
        })
        accessRecords.push(serializeAccess({ ...accessData, id: docRef.id }))
      } else {
        // Create new access
        const docRef = firestore.collection(COLLECTIONS.USER_APP_ACCESS).doc()
        batch.set(docRef, accessData)
        accessRecords.push(serializeAccess({ ...accessData, id: docRef.id }))
      }
    }

    await batch.commit()

    res.json({
      message: `Access granted to ${userIds.length} users`,
      access: accessRecords,
    })
  } catch (error) {
    console.error('Bulk grant access error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as accessRoutes }