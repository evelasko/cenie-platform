import * as admin from 'firebase-admin'
import { cookies } from 'next/headers'
import * as path from 'path'

// Initialize Firebase Admin SDK for server-side operations
let adminApp: admin.app.App | undefined

export function initializeAdminApp() {
  if (!adminApp) {
    console.log('🚀 [initializeAdminApp] Initializing Firebase Admin SDK...')
    const existingApps = admin.apps
    if (existingApps.length > 0 && existingApps[0]) {
      console.log('🚀 [initializeAdminApp] Using existing app instance')
      adminApp = existingApps[0]
    } else {
      console.log('🚀 [initializeAdminApp] Creating new app instance...')
      // Try to use service account file first, then fall back to environment variables
      let credential: admin.credential.Credential

      if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        credential = admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      } else if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
      ) {
        credential = admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      } else {
        // Try to load from default paths (workspace root or project root)
        const possiblePaths = [
          path.resolve(process.cwd(), '../../firebase-serviceaccount.json'), // From apps/editorial
          path.resolve(process.cwd(), 'firebase-serviceaccount.json'), // From workspace root
          path.resolve(__dirname, '../../../firebase-serviceaccount.json'), // From package location
        ]

        let foundPath: string | null = null
        for (const testPath of possiblePaths) {
          try {
            const fs = require('fs')
            if (fs.existsSync(testPath)) {
              foundPath = testPath
              break
            }
          } catch (e) {
            // Continue to next path
          }
        }

        if (foundPath) {
          credential = admin.credential.cert(foundPath)
        } else {
          throw new Error(
            'Firebase Admin credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_PATH, ' +
              'or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables, ' +
              'or ensure firebase-serviceaccount.json exists at project root. ' +
              `Searched paths: ${possiblePaths.join(', ')}`
          )
        }
      }

      adminApp = admin.initializeApp({
        credential,
        projectId: process.env.FIREBASE_PROJECT_ID || 'cenie-platform',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
      })
      console.log('✅ [initializeAdminApp] Firebase Admin initialized successfully!')
      console.log('✅ [initializeAdminApp] Project ID:', adminApp.options.projectId)
    }
  } else {
    console.log('🚀 [initializeAdminApp] Admin app already initialized')
  }
  return adminApp
}

export async function verifyIdTokenServer(
  idToken: string
): Promise<admin.auth.DecodedIdToken | null> {
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
  console.log('🔧 [createSessionCookie] Initializing Firebase Admin...')
  const app = initializeAdminApp()
  if (!app) {
    console.error('❌ [createSessionCookie] Firebase Admin app not initialized')
    throw new Error('Firebase Admin app not initialized')
  }
  console.log(
    '🔧 [createSessionCookie] Firebase Admin initialized, project:',
    app.options.projectId
  )

  const auth = app.auth()

  try {
    console.log('🔧 [createSessionCookie] Creating session cookie with Firebase Auth...')
    console.log('🔧 [createSessionCookie] Expires in:', expiresIn, 'ms')
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    console.log('✅ [createSessionCookie] Session cookie created successfully')
    return sessionCookie
  } catch (error) {
    console.error('❌ [createSessionCookie] Error creating session cookie:', error)
    console.error('❌ [createSessionCookie] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : 'No stack',
    })
    return null
  }
}

export async function verifySessionCookie(
  sessionCookie: string
): Promise<admin.auth.DecodedIdToken | null> {
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
  console.log('📝 [createServerSession] Starting session creation...')
  console.log('📝 [createServerSession] ID token length:', idToken?.length)

  const sessionCookie = await createSessionCookie(idToken)
  console.log('📝 [createServerSession] Session cookie created:', {
    exists: !!sessionCookie,
    length: sessionCookie?.length,
  })

  if (!sessionCookie) {
    console.error('❌ [createServerSession] Failed to create session cookie')
    return false
  }

  console.log('📝 [createServerSession] Getting cookie store...')
  const cookieStore = await cookies()
  console.log('📝 [createServerSession] Cookie store obtained, setting session cookie...')

  cookieStore.set('session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14, // 14 days
    path: '/',
  })

  console.log('✅ [createServerSession] Session cookie set successfully!')
  console.log('📝 [createServerSession] Cookie settings:', {
    name: 'session',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
  })

  return true
}

export async function clearServerSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
