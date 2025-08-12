'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@cenie/ui'
import { useAuthContext } from '@cenie/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, BookOpen, Briefcase, Users, Sparkles, CheckCircle, Clock, Mail } from 'lucide-react'

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
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="outline" className="mb-4">
            Coming Q1 2024
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CENIE
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Centro de Excelencia en Innovación Empresarial
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground/80 italic">
            Center for Excellence in Business Innovation
          </p>
          
          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-lg text-foreground/90 leading-relaxed">
              We're building the world's most comprehensive AI innovation ecosystem. 
              CENIE will be your gateway to transformative technology, education, and strategic insights.
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              The CENIE Ecosystem
            </h2>
            <p className="text-muted-foreground text-lg">Four Integrated Services, One Powerful Platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  CENIE Academy
                </CardTitle>
                <CardDescription>Advanced AI & Innovation Education</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cutting-edge courses and certifications in AI, machine learning, and digital transformation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  CENIE Agency
                </CardTitle>
                <CardDescription>Strategic AI Consulting</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expert guidance for implementing AI solutions and driving innovation in your organization.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  CENIE Editorial
                </CardTitle>
                <CardDescription>Research & Publications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cutting-edge research, case studies, and thought leadership in AI and innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  CENIE Connect
                </CardTitle>
                <CardDescription>Global Innovation Community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Network with innovators, researchers, and industry leaders worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-3">
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mission" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">
                    Accelerating global innovation through AI-powered education, strategic consulting, 
                    and thought leadership in digital transformation.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">AI Strategy & Implementation</p>
                        <p className="text-sm text-muted-foreground">End-to-end AI transformation solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Digital Transformation Programs</p>
                        <p className="text-sm text-muted-foreground">Comprehensive modernization strategies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Professional Development</p>
                        <p className="text-sm text-muted-foreground">Career advancement through AI education</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Global Innovation Network</p>
                        <p className="text-sm text-muted-foreground">Connect with industry leaders worldwide</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Coming Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p>Integrated learning and consulting platform</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p>AI-powered innovation tools and frameworks</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p>Global community of innovators and experts</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p>Comprehensive resource library and knowledge base</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p>Strategic partnership network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Pre-Launch Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Priority Access</p>
                      <p className="text-sm text-muted-foreground">Be first to experience our platform</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Founding Member Status</p>
                      <p className="text-sm text-muted-foreground">Special recognition and exclusive benefits</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Exclusive Content</p>
                      <p className="text-sm text-muted-foreground">Early access to research and resources</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Direct Contact</p>
                      <p className="text-sm text-muted-foreground">Connect with our founding team</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services Network</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Development Phase</Badge>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">CENIE Academy</CardTitle>
                <CardDescription>Advanced AI & Innovation Education</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="https://academy.cenie.org" className="text-primary hover:underline flex items-center gap-1">
                  Visit academy.cenie.org
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Team Assembly</Badge>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">CENIE Agency</CardTitle>
                <CardDescription>Strategic AI Consulting Services</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="https://agency.cenie.org" className="text-primary hover:underline flex items-center gap-1">
                  Visit agency.cenie.org
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Content Development</Badge>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">CENIE Editorial</CardTitle>
                <CardDescription>Research & Publications Platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="https://editorial.cenie.org" className="text-primary hover:underline flex items-center gap-1">
                  Visit editorial.cenie.org
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Join Our Launch</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Get exclusive early access to the complete CENIE ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Join Early Access
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                  Explore Services
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  General Inquiries
                </p>
                <p className="text-sm text-primary-foreground/80">hello@cenie.org</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Partnership Opportunities</p>
                <p className="text-sm text-primary-foreground/80">partnerships@cenie.org</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Media & Press</p>
                <p className="text-sm text-primary-foreground/80">press@cenie.org</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <p className="text-sm">
              <span className="font-semibold">Expected Launch:</span> Q1 2024 | 
              <span className="font-semibold ml-2">Status:</span> Platform integration and final testing
            </p>
          </div>
          
          <p className="text-lg font-medium text-muted-foreground italic">
            Transforming Innovation Through AI
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2024 CENIE. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}