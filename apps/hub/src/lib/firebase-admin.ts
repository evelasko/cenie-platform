import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK for server-side operations
let adminApp: admin.app.App | null = null

export function initializeFirebaseAdmin() {
  if (!adminApp) {
    const existingApps = admin.apps
    if (existingApps.length > 0) {
      adminApp = existingApps[0]
    } else {
      // Validate required environment variables
      const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

      if (missingVars.length > 0) {
        throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`)
      }

      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID!,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      })
    }
  }
  return adminApp
}

export function getFirebaseAdmin() {
  return initializeFirebaseAdmin()
}

export function getAdminAuth(): admin.auth.Auth {
  const app = getFirebaseAdmin()
  if (!app) {
    throw new Error('Firebase Admin app not initialized')
  }
  return app.auth()
}

export function getAdminFirestore(): admin.firestore.Firestore {
  const app = getFirebaseAdmin()
  if (!app) {
    throw new Error('Firebase Admin app not initialized')
  }
  return app.firestore()
}