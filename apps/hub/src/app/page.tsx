'use client'

import { Button } from '@cenie/ui'
import { useAuthContext } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function HubHomePage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            CENIE Platform - {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Centro de Estudios en Nuevas Inteligencias y Economías
          </p>
        </div>

        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            🚧 Platform Under Construction
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to the CENIE institutional hub. We're building a comprehensive platform 
            that connects innovation, education, and research in emerging economies and 
            artificial intelligence.
          </p>
          <p className="text-base text-muted-foreground">
            This unified platform will provide access to our academic publishing, 
            educational programs, and learning management systems, all integrated 
            with single sign-on authentication.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">Editorial Platform</h3>
            <p className="text-sm text-muted-foreground">
              Academic publishing and research dissemination with AI-powered translation services.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">Academy Platform</h3>
            <p className="text-sm text-muted-foreground">
              Educational courses and programs focused on emerging technologies and economics.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">Learning System</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive LMS for tracking progress and managing educational content.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="text-sm text-muted-foreground mt-12">
          <p>© 2024 CENIE. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}