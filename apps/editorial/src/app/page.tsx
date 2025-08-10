import { Button } from '@cenie/ui'

export default function EditorialHomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            CENIE Editorial
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Academic Publishing Platform
          </p>
        </div>

        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            📚 Platform Under Construction
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to CENIE Editorial, our comprehensive academic publishing platform. 
            We're building a scholarly communication hub that bridges languages and 
            cultures through cutting-edge AI translation technology.
          </p>
          <p className="text-base text-muted-foreground">
            Our platform will provide seamless publishing workflows for authors, 
            comprehensive catalogs for readers, and powerful tools for librarians, 
            all enhanced with intelligent translation services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">For Authors</h3>
            <p className="text-sm text-muted-foreground">
              Streamlined submission process with AI-powered translation and formatting assistance.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">For Readers</h3>
            <p className="text-sm text-muted-foreground">
              Multilingual catalog with intelligent search and personalized recommendations.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">For Librarians</h3>
            <p className="text-sm text-muted-foreground">
              Advanced collection management tools with metadata enrichment and analytics.
            </p>
          </div>
        </div>

        <div className="bg-accent/30 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span>AI-powered translation services</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span>Multilingual catalog browsing</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span>Advanced search and discovery</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span>Collaborative editing tools</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="text-lg px-8">
            Join Waitlist
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Learn More
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-12">
          <p>© 2024 CENIE Editorial. Part of the CENIE Platform.</p>
        </div>
      </div>
    </div>
  )
}