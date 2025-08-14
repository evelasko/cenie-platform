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
  Laptop,
  DollarSign,
  Users,
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react'

export default function AcademyComingSoon() {
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
        {/* Educational background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-56 h-56 bg-accent/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-in-up">
              <h1 className="type-display-1 mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                La próxima etapa de tu carrera comienza aquí
              </h1>
              <h2 className="type-heading-2 mb-8 text-foreground">
                Academia CENIE: Donde el arte se encuentra con la oportunidad
              </h2>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up delay-200">
              <Calendar className="h-5 w-5 text-primary animate-bounce" />
              <p className="type-heading-4 text-primary font-bold">Lanzamiento en septiembre de 2025</p>
            </div>
            
            <div className="animate-fade-in-up delay-400">
              <p className="type-lead mb-12 text-muted-foreground max-w-4xl mx-auto">
                En el mundo digital actual, el talento artístico es sólo el principio. La Academia CENIE es una nueva institución innovadora 
                para el artista escénico moderno, diseñada para armarle con las habilidades esenciales en tecnología, finanzas y gestión empresarial 
                necesarias para construir una carrera próspera y sostenible.
              </p>
              <p className="type-body-large mb-12 text-foreground font-medium">
                Creemos que los artistas no sólo deben sobrevivir, sino florecer.
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
                    Inscríbase para recibir actualizaciones exclusivas, información sobre la inscripción anticipada y un primer vistazo a nuestros cursos innovadores
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
                        Suscribirse
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Academy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">¿Por qué la Academia CENIE? Transforme su oficio y su carrera</h2>
            <p className="type-lead text-muted-foreground max-w-4xl mx-auto">
              Nuestro plan de estudios es práctico, basado en proyectos y diseñado específicamente para los estilos de aprendizaje de los profesionales creativos. Le capacitamos para:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Laptop className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Domine la tecnología para su arte</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Desde herramientas creativas impulsadas por IA y marketing digital hasta desarrollo web y análisis de datos, 
                  aprenda a aprovechar la tecnología para amplificar su voz creativa y su alcance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Lograr la autosuficiencia financiera</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Adquiera conocimientos prácticos y reales sobre finanzas personales, financiación de las artes, elaboración de presupuestos para proyectos 
                  y redacción de subvenciones. Tome las riendas de su futuro financiero.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-10 w-10 text-primary" />
                  <CardTitle className="type-heading-4">Liderar con confianza</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-base text-muted-foreground">
                  Desarrolle las habilidades empresariales y de gestión necesarias para producir, comercializar y dirigir sus propias empresas artísticas. 
                  Convierta su visión creativa en una realidad de éxito.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Curriculum Preview Section */}
      <section className="py-20 bg-gradient-to-r from-muted/20 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Un vistazo a nuestro plan de estudios</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Laptop className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Tecnología de la información para artistas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Desbloquear la creatividad digital y los conocimientos de marketing para el artista moderno.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Educación financiera para artistas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Construir la estabilidad financiera y financiar su trabajo creativo de forma sostenible.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Producción y gestión teatral</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  El negocio detrás del telón: de la producción al desarrollo de audiencias.
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
            <h2 className="type-heading-1 mb-8">El futuro de la educación en artes escénicas está en camino</h2>
            <p className="type-lead mb-12 text-muted-foreground">
              Inscríbase para recibir actualizaciones exclusivas, información sobre la inscripción anticipada y un primer vistazo a nuestros innovadores cursos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="type-button" onClick={() => {
                const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
                emailInput?.focus()
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Obtener notificaciones de lanzamiento
              </Button>
              <Button variant="outline" size="lg" className="type-button">
                Más información
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Social Media Placeholder */}
            <div className="flex justify-center gap-6 text-muted-foreground">
              <span className="type-body-small">Siga nuestro viaje:</span>
              <span className="type-body-small hover:text-primary cursor-pointer">Twitter</span>
              <span className="type-body-small hover:text-primary cursor-pointer">Instagram</span>
              <span className="type-body-small hover:text-primary cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="type-caption text-muted-foreground">© 2024 Academia CENIE. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}