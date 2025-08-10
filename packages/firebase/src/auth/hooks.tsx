'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { getFirebaseAuth } from '../client'
import { AuthUser } from '../types'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const auth = getFirebaseAuth()
      
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser: User | null) => {
          if (firebaseUser) {
            const authUser: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              phoneNumber: firebaseUser.phoneNumber,
              providerId: firebaseUser.providerId,
              createdAt: firebaseUser.metadata.creationTime,
              lastLoginAt: firebaseUser.metadata.lastSignInTime,
            }
            setUser(authUser)
          } else {
            setUser(null)
          }
          setLoading(false)
        },
        (error) => {
          console.error('Auth state change error:', error)
          setError(error)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Failed to initialize auth listener:', err)
      setError(err as Error)
      setLoading(false)
      return () => {} // Return empty cleanup function
    }
  }, [])

  return { user, loading, error }
}

export function useIdToken() {
  const [idToken, setIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setIdToken(null)
      setLoading(false)
      return
    }

    const refreshToken = async () => {
      try {
        const auth = getFirebaseAuth()
        const currentUser = auth.currentUser
        
        if (currentUser) {
          const token = await currentUser.getIdToken()
          setIdToken(token)
        } else {
          setIdToken(null)
        }
        setLoading(false)
      } catch (err) {
        console.error('Failed to get ID token:', err)
        setError(err as Error)
        setLoading(false)
      }
    }

    refreshToken()

    // Refresh token every 50 minutes (tokens expire after 1 hour)
    const interval = setInterval(refreshToken, 50 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user])

  return { idToken, loading, error }
}