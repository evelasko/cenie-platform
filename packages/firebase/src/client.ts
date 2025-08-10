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
    console.error('Missing Firebase configuration. Please set the following environment variables:', missingFields.map(f => `NEXT_PUBLIC_FIREBASE_${f.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '')}`).join(', '))
    throw new Error(`Missing required Firebase config: ${missingFields.join(', ')}. Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.`)
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