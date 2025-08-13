'use client'

import { createContext, useContext, type ReactNode } from 'react'

import { type AuthUser } from '../types'

import { useAuth } from './hooks'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, error } = useAuth()

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}