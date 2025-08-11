import { Button } from '@cenie/ui'

export default function AgencyHomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/10 to-primary/5 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            CENIE Agency
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Automation Services & Software Solutions
          </p>
        </div>

        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />

        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            🚀 Platform Under Construction
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to CENIE Agency, your partner in digital transformation. 
            We specialize in building intelligent automation solutions and custom 
            software that drives innovation and efficiency for your organization.
          </p>
          <p className="text-base text-muted-foreground">
            Our platform will showcase our portfolio of automation tools, APIs, 
            and software solutions developed by CENIE's expert team. From AI-powered 
            workflows to custom integrations, we deliver technology that works.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Automation Tools</h3>
            <p className="text-xs text-muted-foreground">
              Custom workflow automation and process optimization solutions.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Solutions</h3>
            <p className="text-xs text-muted-foreground">
              Intelligent systems powered by machine learning and LLMs.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🔌</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">API Services</h3>
            <p className="text-xs text-muted-foreground">
              RESTful APIs and microservices for seamless integration.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Custom Apps</h3>
            <p className="text-xs text-muted-foreground">
              Tailored web and mobile applications for specific needs.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-accent/20 border border-primary/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Development</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Full-stack applications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Cloud-native solutions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Progressive web apps</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Integration</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>System integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Data pipelines</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Third-party APIs</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Consulting</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Digital strategy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Architecture design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Technology audit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="text-lg px-8">
            Explore Solutions
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Contact Team
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-12">
          <p>© 2024 CENIE Agency. Part of the CENIE Platform.</p>
        </div>
      </div>
    </div>
  )
}