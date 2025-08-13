'use client'

import { useAuth } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@cenie/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cenie/ui'

import { 
  Calendar, 
  Mail, 
  CheckCircle
} from 'lucide-react'

export default function EditorialComingSoon() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // TODO: Integrate with actual email subscription service
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 type-body-base text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
        {/* Scholarly background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-56 h-56 bg-accent/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-in-up">
              <p className="type-overline text-primary mb-4">The Future of Performing Arts Scholarship is Coming</p>
              <h1 className="type-display-1 mb-4 text-foreground">
                CENIE Editorial
              </h1>
              <h2 className="type-heading-2 mb-8 text-muted-foreground">
                AI-Enhanced Academic Publishing for the Performing Arts
              </h2>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up delay-200">
              <Calendar className="h-5 w-5 text-primary animate-bounce" />
              <p className="type-heading-4 text-primary font-bold">Launching September 2025</p>
            </div>
            
            <div className="animate-fade-in-up delay-400">
              <p className="type-lead mb-12 text-muted-foreground max-w-4xl mx-auto">
                A new digital-first academic press is coming. We're pairing rigorous peer review with AI-native technology 
                to make research in theatre, dance, and performance studies more discoverable, accessible, and powerful.
              </p>
            </div>

            {/* Email Subscription */}
            <div className="animate-fade-in-up delay-600">
              <Card className="mx-auto max-w-lg mb-8 border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-background/90">
                <CardHeader className="pb-4">
                  <CardTitle className="type-heading-5 flex items-center gap-2 justify-center">
                    <Mail className="h-5 w-5" />
                    Be the First to Know
                  </CardTitle>
                  <CardDescription className="type-body-small">
                    Sign up for launch updates, exclusive previews, and an invitation to our pilot program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subscribed ? (
                    <div className="flex items-center gap-2 justify-center text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="type-body-base font-medium">Thank you for subscribing!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-3 py-2 rounded-md border border-input bg-background type-body-base"
                        required
                      />
                      <Button type="submit" className="type-button">
                        Notify Me
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">A New Era for Research and Teaching</h2>
            <div className="max-w-4xl mx-auto">
              <p className="type-lead text-muted-foreground mb-8">
                CENIE Editorial is the publishing arm of the Centre for Research and Innovation in Performing Arts (CENIE). 
                We are built to address critical gaps in academic publishing. We deliver high-quality monographs, anthologies, 
                and translational scholarship optimized for the way modern research happens.
              </p>
              <p className="type-body-large text-muted-foreground">
                Our mission is to accelerate the dissemination of knowledge by making content uniquely structured for AI-powered discovery, 
                while expanding access for the Spanish-speaking scholarly community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="py-20 bg-gradient-to-r from-muted/20 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Our Solution: Scholarship, Reimagined</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              CENIE Editorial provides a credible, modern alternative to traditional publishers, 
              optimized for discovery, pedagogy, and long-term preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="type-heading-6">AI-Native Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Find exactly what you need in seconds with our Context Model Protocol.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="type-heading-6">Spanish-Language Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Curated translations filling major knowledge gaps in performance studies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="type-heading-6">Rigorous Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Double-blind peer review with full library readiness and DOIs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="type-heading-6">Secure RAG Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Institution-grade APIs for your own AI workflows.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="type-heading-1 mb-6">The Countdown has Begun</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Calendar className="h-6 w-6 text-primary" />
              <p className="type-heading-3 text-primary font-bold">Launching September 2025</p>
            </div>
            <p className="type-lead mb-12 text-muted-foreground">
              Don't miss the launch of a platform that will redefine academic publishing in the performing arts.
            </p>
            
            <Button size="lg" className="type-button" onClick={() => {
              const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
              emailInput?.focus()
            }}>
              <Mail className="mr-2 h-4 w-4" />
              Keep Me Updated
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="type-caption text-muted-foreground">© 2024 CENIE Editorial. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}