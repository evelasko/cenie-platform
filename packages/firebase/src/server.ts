import * as admin from 'firebase-admin'
import { cookies } from 'next/headers'

// Initialize Firebase Admin SDK for server-side operations
let adminApp: admin.app.App | undefined

export function initializeAdminApp() {
  if (!adminApp) {
    const existingApps = admin.apps
    if (existingApps.length > 0 && existingApps[0]) {
      adminApp = existingApps[0]
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    }
  }
  return adminApp
}

export async function verifyIdTokenServer(idToken: string): Promise<admin.auth.DecodedIdToken | null> {
  const app = initializeAdminApp()
  if (!app) {
    throw new Error('Firebase Admin app not initialized')
  }
  const auth = app.auth()
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    return null
  }
}

export async function createSessionCookie(idToken: string, expiresIn = 60 * 60 * 24 * 14 * 1000) {
  const app = initializeAdminApp()
  if (!app) {
    throw new Error('Firebase Admin app not initialized')
  }
  const auth = app.auth()
  
  try {
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    return sessionCookie
  } catch (error) {
    console.error('Error creating session cookie:', error)
    return null
  }
}

export async function verifySessionCookie(sessionCookie: string): Promise<admin.auth.DecodedIdToken | null> {
  const app = initializeAdminApp()
  if (!app) {
    throw new Error('Firebase Admin app not initialized')
  }
  const auth = app.auth()
  
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
    return decodedClaims
  } catch (error) {
    console.error('Error verifying session cookie:', error)
    return null
  }
}

export async function getServerSession(): Promise<admin.auth.DecodedIdToken | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return null
  }
  
  return await verifySessionCookie(sessionCookie.value)
}

export async function createServerSession(idToken: string) {
  const sessionCookie = await createSessionCookie(idToken)
  
  if (!sessionCookie) {
    return false
  }
  
  const cookieStore = await cookies()
  cookieStore.set('session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14, // 14 days
    path: '/',
  })
  
  return true
}

export async function clearServerSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}