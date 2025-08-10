import { Button } from '@cenie/ui'

export default function HubHomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            CENIE Platform
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
          <Button size="lg" className="text-lg px-8">
            Get Notified
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Learn More
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-12">
          <p>© 2024 CENIE. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}