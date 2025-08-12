import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@cenie/ui'
import Link from 'next/link'
import { BookOpen, Globe, Search, FileText, Users, Library, BarChart3, Languages, PenTool, CheckCircle, Mail, Twitter, Linkedin } from 'lucide-react'

export default function EditorialHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/10 to-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="outline" className="mb-4">
            Launching Q2 2024
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent-foreground to-accent-foreground/60 bg-clip-text text-transparent">
            CENIE Editorial
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Advancing Knowledge Through AI Research & Innovation Publishing
          </p>
          
          <div className="max-w-3xl mx-auto mt-8">
            <p className="text-lg text-foreground/90 leading-relaxed">
              We're creating the definitive platform for AI research and innovation scholarship. 
              CENIE Editorial will connect researchers, practitioners, and thought leaders worldwide.
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <BookOpen className="h-8 w-8 text-accent-foreground" />
              Our Publishing Vision
            </h2>
            <p className="text-muted-foreground text-lg">Comprehensive Academic Platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6 text-accent-foreground" />
                  Comprehensive Content Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>AI Research Papers & Studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Innovation Case Studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Industry Analysis & Reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Technical Documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Thought Leadership Articles</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="h-6 w-6 text-accent-foreground" />
                  Global Academic Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Peer-reviewed publications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Multilingual content (English & Spanish)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>International researcher collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Open access scholarly resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground mt-1.5" />
                    <span>Cross-cultural knowledge exchange</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
          
          <Tabs defaultValue="readers" className="w-full">
            <TabsList className="grid w-full md:w-[600px] mx-auto grid-cols-3">
              <TabsTrigger value="readers">For Readers</TabsTrigger>
              <TabsTrigger value="authors">For Authors</TabsTrigger>
              <TabsTrigger value="librarians">For Librarians</TabsTrigger>
            </TabsList>
            
            <TabsContent value="readers" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Advanced Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Powerful discovery tools with AI-enhanced search capabilities
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Languages className="h-5 w-5" />
                      Multilingual Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content available in multiple languages with AI translation
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Personalized Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Custom reading lists and personalized recommendations
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="authors" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Streamlined Publishing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Simplified submission and peer review process
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Impact Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Track citations, downloads, and research impact metrics
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Collaboration Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Connect with co-authors and research communities
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="librarians" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Library className="h-5 w-5" />
                      Collection Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive tools for institutional access management
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Detailed reports on content usage and engagement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Bulk Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Efficient bulk content and metadata management
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Content Categories</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🤖 Artificial Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Machine learning applications</p>
                <p>• Neural network research</p>
                <p>• AI ethics and governance</p>
                <p>• Industry implementation studies</p>
              </CardContent>
            </Card>

            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 Innovation Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Digital transformation strategies</p>
                <p>• Innovation methodology research</p>
                <p>• Technology adoption studies</p>
                <p>• Organizational change analysis</p>
              </CardContent>
            </Card>

            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Business Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• AI in enterprise environments</p>
                <p>• ROI and performance metrics</p>
                <p>• Case studies and best practices</p>
                <p>• Market analysis and trends</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-accent text-accent-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Join Our Academic Community</CardTitle>
            <CardDescription className="text-accent-foreground/80">
              Be among the first to access our comprehensive research platform
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Button size="lg" variant="secondary" className="w-full">
                Join as Reader
              </Button>
              <Button size="lg" variant="secondary" className="w-full">
                Apply as Author
              </Button>
              <Button size="lg" variant="secondary" className="w-full">
                Librarian Access
              </Button>
            </div>
            
            <div className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Pre-Launch Benefits</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <span>Early Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <span>Founding Author Status</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <span>Beta Testing</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <span>Exclusive Content</span>
                </div>
              </div>
            </div>

            <Separator className="bg-accent-foreground/20" />

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <p className="font-semibold">Submissions</p>
                <p className="text-sm text-accent-foreground/80">submissions@editorial.cenie.org</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Partnerships</p>
                <p className="text-sm text-accent-foreground/80">partnerships@editorial.cenie.org</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Support</p>
                <p className="text-sm text-accent-foreground/80">support@editorial.cenie.org</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Launch Target:</span> Q2 2024 | 
            <span className="font-semibold ml-2">Status:</span> Platform development and content curation
          </p>
          
          <p className="text-lg font-medium text-muted-foreground italic">
            Bridging Research and Innovation
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2024 CENIE Editorial. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}