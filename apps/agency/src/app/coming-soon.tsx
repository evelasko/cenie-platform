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
          <p className="mt-4 type-body-base text-muted-foreground">Cargando...</p>
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
                El futuro de la producción está casi aquí.
              </h1>
              <h2 className="type-heading-1 mb-8 text-foreground">
                Agencia de Automatización del CENIE
              </h2>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up delay-200">
              <Calendar className="h-5 w-5 text-primary animate-bounce" />
              <p className="type-heading-4 text-primary font-bold">Lanzamiento en septiembre de 2025</p>
            </div>
            
            <div className="animate-fade-in-up delay-400">
              <p className="type-lead mb-8 text-muted-foreground max-w-4xl mx-auto">
                La <strong>Agencia de Automatización del CENIE</strong> es un nuevo servicio de asesoramiento dedicado a resolver los desafíos operativos únicos 
                de las artes escénicas. Somos un equipo de profesionales expertos con un profundo conocimiento tanto de los entresijos de la producción 
                como del poder de la inteligencia artificial.
              </p>
              <p className="type-body-large mb-12 text-foreground font-medium">
                Nuestra misión es liberar a los profesionales del arte de las cargas administrativas para que puedan centrarse en lo que realmente importa: <strong>el arte.</strong>
              </p>
            </div>

            {/* Email Subscription */}
            <div className="animate-fade-in-up delay-600">
              <Card className="mx-auto max-w-lg mb-8 border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-background/90">
                <CardHeader className="pb-4">
                  <CardTitle className="type-heading-5 flex items-center gap-2 justify-center">
                    <Mail className="h-5 w-5" />
                    Sea el primero en saberlo
                  </CardTitle>
                  <CardDescription className="type-body-small">
                    Únase a nuestra exclusiva lista de correo para obtener acceso anticipado, estudios de casos y perspectivas sobre el futuro de la gestión de las artes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subscribed ? (
                    <div className="flex items-center gap-2 justify-center text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="type-body-base font-medium">¡Gracias por suscribirse!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Introduzca su dirección de correo electrónico"
                        className="flex-1 px-3 py-2 rounded-md border border-input bg-background type-body-base"
                        required
                      />
                      <Button type="submit" className="type-button">
                        Inscríbase
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
            <h2 className="type-heading-1 mb-6">Lo que hacemos: Automatización a medida para las artes</h2>
            <p className="type-lead text-muted-foreground max-w-4xl mx-auto">
              ¿Está cansado de luchar con calendarios complejos, presupuestos ajustados y papeleo repetitivo? 
              Creamos soluciones a medida para agilizar sus flujos de trabajo más críticos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Programación y logística inteligentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Diseñamos sistemas que optimizan los calendarios de ensayos, gestionan los recursos y resuelven los conflictos al instante, 
                  ahorrándole decenas de horas por producción.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Presupuestación dinámica y planificación de escenarios</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Nuestros modelos interactivos le permiten explorar escenarios hipotéticos en cuestión de minutos, 
                  ayudándole a reducir el riesgo de sus decisiones financieras y a evitar sobrecostes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Automatización administrativa sin esfuerzo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Automatizamos la generación de informes, las actualizaciones de las partes interesadas y otras comunicaciones esenciales, 
                  lo que permite a su equipo centrarse en un trabajo de mayor valor.
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
              &quot;Nuestro servicio permite a los profesionales del arte <strong>descargar sus cargas operativas más tediosas</strong> para que puedan centrarse en su trabajo creativo.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Un nuevo tipo de asociación</h2>
            <p className="type-lead text-muted-foreground max-w-4xl mx-auto">
              Somos más que simples tecnólogos; somos colaboradores apasionados por las artes. 
              La experiencia única de nuestro fundador tanto en procesos teatrales como en desarrollo de IA garantiza que cada solución sea:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Técnicamente robusto</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Construido sobre tecnología punta y fiable que se adapta a sus necesidades.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Sensibilidad artística</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Diseñado con un profundo respeto por el proceso creativo y el flujo de trabajo artístico.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Pragmáticamente fundamentado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Centrado en resolver las necesidades de producción del mundo real con soluciones prácticas.
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
            <h2 className="type-heading-1 mb-8">El telón se levanta en septiembre de 2025</h2>
            <p className="type-lead mb-12 text-muted-foreground">
              Únase a nuestra exclusiva lista de correo para obtener acceso anticipado, casos prácticos y perspectivas sobre el futuro de la gestión de las artes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="type-button" onClick={() => {
                const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                emailInput?.focus()
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Inscríbase para recibir actualizaciones
              </Button>
              <Button variant="outline" size="lg" className="type-button">
                Más información
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="type-caption text-muted-foreground italic">
              Respetamos su privacidad y sólo le enviaremos información relevante sobre la Agencia de Automatización del CENIE.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <p className="type-caption text-muted-foreground">© 2024 Agencia de Automatización del CENIE. Todos los derechos reservados.</p>
            <p className="type-caption text-muted-foreground italic">
              Una división central del <strong>Centro de Investigación e Innovación en Artes Escénicas (CENIE)</strong>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}