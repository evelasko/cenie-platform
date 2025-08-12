import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { FirebaseConfig } from './types'

let app: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined
let storage: FirebaseStorage | undefined

export function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  // Validate required config
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ]

  const missingFields = requiredFields.filter(field => !config[field])
  
  if (missingFields.length > 0) {
    // Map field names to their corresponding environment variable names
    const envVarNames = missingFields.map(field => {
      switch (field) {
        case 'apiKey': return 'NEXT_PUBLIC_FIREBASE_API_KEY'
        case 'authDomain': return 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
        case 'projectId': return 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
        case 'storageBucket': return 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
        case 'messagingSenderId': return 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
        case 'appId': return 'NEXT_PUBLIC_FIREBASE_APP_ID'
        case 'measurementId': return 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
        default: return `NEXT_PUBLIC_FIREBASE_${(field as string).toUpperCase()}`
      }
    })
    
    console.error('Missing Firebase configuration. Please set the following environment variables:')
    console.error(`Missing: ${envVarNames.join(', ')}`)
    console.error('Shared variables (root .env): API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID')
    console.error('App-specific variables (.env.local): APP_ID, MEASUREMENT_ID, APP_NAME')
    console.error('Current environment variables:')
    console.error(`- API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓' : '✗'}`)
    console.error(`- AUTH_DOMAIN: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓' : '✗'}`)
    console.error(`- PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓' : '✗'}`)
    console.error(`- STORAGE_BUCKET: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓' : '✗'}`)
    console.error(`- MESSAGING_SENDER_ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓' : '✗'}`)
    console.error(`- APP_ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓' : '✗'}`)
    console.error(`- APP_NAME: ${process.env.NEXT_PUBLIC_APP_NAME ? '✓' : '✗'}`)
    
    throw new Error(`Missing required Firebase config: ${missingFields.join(', ')}. Please check your environment variables.`)
  }

  return config
}

export function initializeFirebase(): FirebaseApp {
  if (!app) {
    const existingApps = getApps()
    if (existingApps.length > 0) {
      app = existingApps[0]
    } else {
      const config = getFirebaseConfig()
      app = initializeApp(config)
    }
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = initializeFirebase()
    auth = getAuth(firebaseApp)
  }
  return auth
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    const firebaseApp = initializeFirebase()
    firestore = getFirestore(firebaseApp)
  }
  return firestore
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    const firebaseApp = initializeFirebase()
    storage = getStorage(firebaseApp)
  }
  return storage
}

// Export convenience functions
export const createFirebaseClient = () => {
  const app = initializeFirebase()
  return {
    app,
    auth: getFirebaseAuth(),
    firestore: getFirebaseFirestore(),
    storage: getFirebaseStorage(),
  }
}