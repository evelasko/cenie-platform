'use client'

import { useAuth } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@cenie/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cenie/ui'
import { 
  Calendar, 
  Mail, 
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  ArrowRight,
  Lightbulb,
  Settings,
  Zap,
  Quote
} from 'lucide-react'

export default function AgencyComingSoon() {
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
        {/* Tech background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-56 h-56 bg-accent/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-in-up">
              <h1 className="type-display-1 mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                The Future of Production is Almost Here.
              </h1>
              <h2 className="type-heading-1 mb-8 text-foreground">
                CENIE Automation Agency
              </h2>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up delay-200">
              <Calendar className="h-5 w-5 text-primary animate-bounce" />
              <p className="type-heading-4 text-primary font-bold">Launching September 2025</p>
            </div>
            
            <div className="animate-fade-in-up delay-400">
              <p className="type-lead mb-8 text-muted-foreground max-w-4xl mx-auto">
                The <strong>CENIE Automation Agency</strong> is a new advisory service dedicated to solving the unique operational challenges 
                of the performing arts. We are a team of expert practitioners with a deep understanding of both the intricacies of production 
                and the power of artificial intelligence.
              </p>
              <p className="type-body-large mb-12 text-foreground font-medium">
                Our mission is to free arts professionals from administrative burdens so they can focus on what truly matters: <strong>the art.</strong>
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
                    Join our exclusive mailing list for early access, case studies, and insights into the future of arts management
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
                        Sign Up
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">What We Do: Bespoke Automation for the Arts</h2>
            <p className="type-lead text-muted-foreground max-w-4xl mx-auto">
              Tired of wrestling with complex schedules, tight budgets, and repetitive paperwork? 
              We build custom solutions to streamline your most critical workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Intelligent Scheduling & Logistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  We design systems that optimize rehearsal schedules, manage resources, and resolve conflicts instantly, 
                  saving you dozens of hours per production.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Dynamic Budgeting & Scenario Planning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Our interactive models allow you to explore "what-if" scenarios in minutes, 
                  helping you de-risk financial decisions and prevent overruns.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Effortless Administrative Automation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  We automate the generation of reports, stakeholder updates, and other essential communications, 
                  empowering your team to focus on higher-value work.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-muted/20 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Quote className="h-12 w-12 text-primary mx-auto mb-6" />
            <blockquote className="type-quote text-foreground mb-8">
              "Our service allows arts professionals to <strong>offload their most tedious operational burdens</strong> so they can focus on their creative work."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">A New Kind of Partnership</h2>
            <p className="type-lead text-muted-foreground max-w-4xl mx-auto">
              We are more than just technologists; we are collaborators with a passion for the arts. 
              Our founder's unique expertise in both theatrical processes and AI development ensures every solution is:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Technically Robust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Built on cutting-edge, reliable technology that scales with your needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Artistically Sensitive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Designed with a deep respect for the creative process and artistic workflow.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Pragmatically Grounded</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Focused on solving real-world production needs with practical solutions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="type-heading-1 mb-8">The Curtain Rises in September 2025</h2>
            <p className="type-lead mb-12 text-muted-foreground">
              Join our exclusive mailing list for early access, case studies, and insights into the future of arts management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="type-button" onClick={() => {
                const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                emailInput?.focus()
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Sign Up for Updates
              </Button>
              <Button variant="outline" size="lg" className="type-button">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="type-caption text-muted-foreground italic">
              We respect your privacy and will only send relevant information about the CENIE Automation Agency.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <p className="type-caption text-muted-foreground">© 2024 CENIE Automation Agency. All Rights Reserved.</p>
            <p className="type-caption text-muted-foreground italic">
              A core division of the <strong>Centre for Research and Innovation in Performing Arts (CENIE)</strong>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}