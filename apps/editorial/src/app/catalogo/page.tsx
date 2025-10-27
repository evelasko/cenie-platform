import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'

export default function CatalogoPage() {
  return (
    <PageContainer>
      <PageHero
        title="Descubre investigación en artes escénicas con una búsqueda potenciada por IA"
        subtitle="Experimenta el futuro del descubrimiento académico con búsqueda semántica, filtros bilingües y recomendaciones inteligentes."
      />

      <Prose>
        <p>
          Transforma tu forma de encontrar y explorar la investigación en artes escénicas. Nuestro
          Protocolo de Modelo de Contexto permite una búsqueda potenciada por IA que comprende el
          contexto, descubre conexiones y te muestra exactamente lo que necesitas para tu
          investigación.
        </p>

        <hr />

        <h2>Herramientas de Descubrimiento Avanzadas</h2>

        <h3>Búsqueda Semántica por IA</h3>
        <p>
          <strong>Busca como piensas, no como una máquina.</strong> Nuestra búsqueda semántica
          comprende las preguntas de investigación en lenguaje natural y encuentra contenido
          relevante basándose en el significado, no solo en la coincidencia de palabras clave.
        </p>

        <p>
          <strong>Intenta buscar:</strong>
        </p>
        <ul>
          <li>
            "Métodos para la enseñanza de la creación colectiva (devising) a estudiantes de grado"
          </li>
          <li>"Participación del público en experiencias teatrales inmersivas"</li>
          <li>"Documentación digital de prácticas escénicas"</li>
        </ul>

        <h3>Filtros Inteligentes</h3>
        <p>
          Refina tus descubrimientos con filtros avanzados diseñados para la investigación en artes
          escénicas:
        </p>

        <p>
          <strong>Por idioma:</strong>
        </p>
        <ul>
          <li>Publicaciones en inglés</li>
          <li>Traducciones al español</li>
          <li>Recursos bilingües</li>
        </ul>

        <p>
          <strong>Por enfoque de la investigación:</strong>
        </p>
        <ul>
          <li>Marcos teóricos</li>
          <li>Investigación basada en la práctica</li>
          <li>Análisis histórico</li>
          <li>Estudios transculturales</li>
        </ul>

        <hr />

        <h2>Explorar por Categoría</h2>

        <h3>Estudios Teatrales</h3>
        <p>
          Explora enfoques contemporáneos e históricos de la representación teatral, la dramaturgia
          y la creación teatral.
        </p>
        <p>
          <strong>Temas Destacados:</strong>
        </p>
        <ul>
          <li>Dramaturgia Contemporánea</li>
          <li>Teatro de Sitio Específico</li>
          <li>Prácticas Teatrales Comunitarias</li>
          <li>Teatro y Justicia Social</li>
        </ul>

        <h3>Danza y Movimiento</h3>
        <p>
          Descubre investigación académica sobre técnicas de danza, coreografía, análisis del
          movimiento y prácticas somáticas.
        </p>
        <p>
          <strong>Temas Destacados:</strong>
        </p>
        <ul>
          <li>Métodos de Danza Contemporánea</li>
          <li>Tradiciones Culturales de Danza</li>
          <li>Análisis del Movimiento</li>
          <li>Danza y Tecnología</li>
        </ul>

        <h3>Performance como Investigación</h3>
        <p>
          Accede a metodologías de vanguardia donde la práctica creativa genera conocimiento
          académico.
        </p>

        <h3>Teatro Aplicado</h3>
        <p>
          Encuentra recursos sobre teatro en la educación, la participación comunitaria y la
          intervención social.
        </p>

        <hr />

        <h2>Comienza tu Viaje de Descubrimiento</h2>
        <p className="text-gray-600 italic text-sm">
          El nivel de acceso depende de tu suscripción.{' '}
          <a href="/recursos/instituciones">Conoce más sobre el acceso institucional</a> o las{' '}
          <a href="/recursos/acceso">opciones de membresía individual</a>.
        </p>
      </Prose>

      <Section spacing="large" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/catalogo">Iniciar Búsqueda</CTAButton>
        <CTAButton href="/destacados" variant="secondary">
          Explorar Publicaciones Recientes
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
