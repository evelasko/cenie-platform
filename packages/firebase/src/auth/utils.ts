import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from 'firebase/auth'
import { getFirebaseAuth } from '../client'

export async function signIn(email: string, password: string) {
  const auth = getFirebaseAuth()
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function signUp(email: string, password: string, displayName?: string) {
  const auth = getFirebaseAuth()
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  if (displayName) {
    await updateProfile(userCredential.user, { displayName })
  }
  
  return userCredential.user
}

export async function signOut() {
  const auth = getFirebaseAuth()
  await firebaseSignOut(auth)
}

export async function resetPassword(email: string) {
  const auth = getFirebaseAuth()
  await sendPasswordResetEmail(auth, email)
}

export async function verifyEmail() {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  await sendEmailVerification(user)
}

export async function updateUserProfile(updates: { displayName?: string; photoURL?: string }) {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    throw new Error('No authenticated user')
  }
  
  await updateProfile(user, updates)
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user || !user.email) {
    throw new Error('No authenticated user')
  }
  
  // Reauthenticate user first
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  
  // Update password
  await updatePassword(user, newPassword)
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  
  if (!user) {
    return null
  }
  
  return await user.getIdToken(forceRefresh)
}

export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth()
  return auth.currentUser
}