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
      const requiredEnvVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY',
      ]
      const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required Firebase environment variables: ${missingVars.join(', ')}\n\nPlease add these to your apps/hub/.env.local file:\n- FIREBASE_PROJECT_ID\n- FIREBASE_CLIENT_EMAIL\n- FIREBASE_PRIVATE_KEY`
        )
      }

      // Parse private key - handle both escaped and unescaped formats
      let privateKey = process.env.FIREBASE_PRIVATE_KEY!
      // If private key contains literal \n, replace with actual newlines
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n')
      }

      // Ensure proper PEM format
      if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        throw new Error(`Invalid Firebase private key format. 

Current private key starts with: "${privateKey.substring(0, 50)}..."

Expected format:
"-----BEGIN PRIVATE KEY-----
MIIEvQ...
-----END PRIVATE KEY-----"

Please check your FIREBASE_PRIVATE_KEY in apps/hub/.env.local`)
      }

      try {
        adminApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            privateKey: privateKey,
          }),
          projectId: process.env.FIREBASE_PROJECT_ID!,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        })
      } catch (error: unknown) {
        if (error instanceof Error && error.message?.includes('PEM formatted message')) {
          throw new Error(`Failed to parse Firebase private key. 

Common solutions:
1. Ensure private key is properly formatted in quotes
2. Check that newlines are correctly escaped as \\n
3. Verify the private key is from the correct Firebase service account

Original error: ${error.message}`)
        }
        throw error
      }
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
