import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAdminFirestore } from '../../../../lib/firebase-admin'
import { COLLECTIONS, UserAppAccess } from '../../../../lib/types'
import { authenticateRequest, requireAdmin } from '../../../../lib/auth-middleware'
import { createErrorResponse, createSuccessResponse, handleApiError, parseRequestBody, serializeAccess } from '../../../../lib/api-utils'

const updateAccessSchema = z.object({
  role: z.enum(['viewer', 'user', 'editor', 'admin']).optional(),
  isActive: z.boolean().optional(),
})

// Update user access (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ accessId: string }> }
) {
  try {
    const authResult = await authenticateRequest(request)
    
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult
    
    // Check admin privileges
    const adminCheck = await requireAdmin(userId)
    if (!adminCheck.success) {
      return createErrorResponse(adminCheck.error!, adminCheck.status!)
    }

    const { accessId } = await params
    const body = await parseRequestBody(request)
    const updates = updateAccessSchema.parse(body)

    const firestore = getAdminFirestore()

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
      return createErrorResponse('Access record not found', 404)
    }

    const access = { ...updatedDoc.data() as UserAppAccess, id: accessId }
    return createSuccessResponse({ 
      message: 'Access updated successfully', 
      access: serializeAccess(access) 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Validation error', 400)
    }

    return handleApiError(error)
  }
}

// Revoke user access (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ accessId: string }> }
) {
  try {
    const authResult = await authenticateRequest(request)
    
    if ('error' in authResult) {
      return createErrorResponse(authResult.error, authResult.status)
    }

    const { userId } = authResult
    
    // Check admin privileges
    const adminCheck = await requireAdmin(userId)
    if (!adminCheck.success) {
      return createErrorResponse(adminCheck.error!, adminCheck.status!)
    }

    const { accessId } = await params
    const firestore = getAdminFirestore()

    await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .update({ isActive: false })

    const updatedDoc = await firestore
      .collection(COLLECTIONS.USER_APP_ACCESS)
      .doc(accessId)
      .get()

    if (!updatedDoc.exists) {
      return createErrorResponse('Access record not found', 404)
    }

    const access = { ...updatedDoc.data() as UserAppAccess, id: accessId }
    return createSuccessResponse({ 
      message: 'Access revoked successfully', 
      access: serializeAccess(access) 
    })
  } catch (error) {
    return handleApiError(error)
  }
}