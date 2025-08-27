'use client'

import { useAuthContext } from '@cenie/firebase/auth'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@cenie/ui'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Globe,
  Lightbulb,
  Mail,
  Rocket,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HubComingSoon() {
  const { user, loading } = useAuthContext()
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="animate-fade-in-up">
              <h1 className="type-display-1 mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Llega el futuro del rendimiento.
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up delay-200">
              <Calendar className="h-5 w-5 text-primary animate-bounce" />
              <p className="type-heading-4 text-primary font-bold">
                Lanzamiento en septiembre de 2025
              </p>
            </div>
            <div className="animate-fade-in-up delay-400">
              <p className="type-lead mb-12 text-muted-foreground max-w-3xl mx-auto">
                El CENIE es el lugar donde la esencia atemporal de la actuación en directo abraza el
                potencial transformador de la innovación tecnológica. Estamos construyendo un
                ecosistema integral para dotar a artistas, académicos y organizaciones de los
                conocimientos, las herramientas y los marcos necesarios para prosperar en una nueva
                era de expresión creativa.
              </p>
            </div>

            {/* Email Subscription */}
            <div className="animate-fade-in-up delay-600">
              <Card className="mx-auto max-w-md mb-8 border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-background/80">
                <CardHeader className="pb-4">
                  <CardTitle className="type-heading-5 flex items-center gap-2 justify-center">
                    <Mail className="h-5 w-5" />
                    Sea el primero en saberlo
                  </CardTitle>
                  <CardDescription className="type-body-small">
                    Únase a nuestra lista de correo para recibir actualizaciones exclusivas e
                    invitaciones a lanzamientos
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

      <Separator className="opacity-30" />

      {/* Challenges Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Transformar los retos en oportunidades</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              Las artes escénicas se encuentran en un momento crucial. La disrupción tecnológica, la
              incertidumbre económica y las lagunas educativas presentan retos significativos. El
              CENIE los aborda de frente, aportando soluciones integradas para:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Aprovechar la tecnología</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Domine la IA, la RA/VR y las plataformas digitales para amplificar su visión
                  creativa.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Lograr la sostenibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Acceda a nuevos modelos de ingresos y habilidades empresariales para una carrera
                  resistente.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Innovar y colaborar</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Conéctese con una red mundial para mejorar la eficacia de la producción y
                  compartir conocimientos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="type-heading-5">Colmar las lagunas lingüísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="type-body-small">
                  Ofrece metodologías y recursos de vanguardia tanto en inglés como en español.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* Ecosystem Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Un ecosistema para una nueva era del arte</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              El CENIE es más que un único producto: es un ecosistema integrado diseñado para el
              creador moderno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Publicaciones académicas',
                desc: 'Una editorial que da prioridad a lo digital, con herramientas mejoradas por IA y traducciones al español.',
                icon: BookOpen,
              },
              {
                title: 'Agencia de automatización',
                desc: 'Soluciones AI/ML personalizadas para agilizar la producción y la administración.',
                icon: Rocket,
              },
              {
                title: 'Academia especializada',
                desc: 'Cursos esenciales en tecnología, finanzas y negocios para artistas.',
                icon: Users,
              },
              {
                title: 'Centro creativo',
                desc: 'Laboratorios de innovación y residencias para coreógrafos y artistas dramáticos.',
                icon: Lightbulb,
              },
              {
                title: 'Intercambio de formación',
                desc: 'Una plataforma de colaboración para compartir metodologías de rendimiento.',
                icon: Globe,
              },
              {
                title: 'Suite de software',
                desc: 'Potentes herramientas para el análisis de vídeo (Stoomp), la gestión de la producción (qAderno) y el descubrimiento de talentos (Platea).',
                icon: Zap,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="type-heading-6">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="type-body-small">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* Target Audience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="type-heading-1 mb-6">Para cada creador e innovador</h2>
            <p className="type-lead text-muted-foreground max-w-3xl mx-auto">
              El CENIE está construido para toda la comunidad de las artes escénicas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Artistas intérpretes o ejecutantes',
                desc: 'buscando la sostenibilidad de la carrera y la fluidez tecnológica.',
              },
              {
                title: 'Investigadores y académicos',
                desc: 'que necesitan potentes plataformas de publicación y colaboración.',
              },
              {
                title: 'Profesionales del sector',
                desc: 'buscando la eficacia operativa y herramientas innovadoras.',
              },
              {
                title: 'Comunidad hispanohablante',
                desc: 'en busca de contenidos y recursos especializados.',
              },
            ].map((audience, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="type-heading-6 text-primary">{audience.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="type-body-small">{audience.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-30" />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="type-heading-1 mb-6">Únase a nuestro viaje</h2>
          <p className="type-lead mb-12 text-muted-foreground max-w-2xl mx-auto">
            El futuro es colaborativo. Conéctese con nosotros y forme parte del movimiento que da
            forma a la próxima generación de artes escénicas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="type-button">
              <Mail className="mr-2 h-4 w-4" />
              Manténgase informado
            </Button>
            <Button variant="outline" size="lg" className="type-button">
              Más información
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Social Media Placeholder */}
          <div className="flex justify-center gap-6 text-muted-foreground">
            <span className="type-body-small">Síganos en:</span>
            <span className="type-body-small hover:text-primary cursor-pointer">LinkedIn</span>
            <span className="type-body-small hover:text-primary cursor-pointer">Twitter/X</span>
            <span className="type-body-small hover:text-primary cursor-pointer">Instagram</span>
            <span className="type-body-small hover:text-primary cursor-pointer">YouTube</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="type-caption text-muted-foreground">
            © 2024 CENIE. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
