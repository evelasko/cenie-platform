import type { Metadata } from 'next'
import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'

export const metadata: Metadata = {
  title: 'Para Instituciones',
  description:
    'Integración bibliotecaria e institucional con CENIE Editorial. Licenciamiento, acceso SSO, analíticas COUNTER y descubrimiento potenciado por IA.',
}

export default function InstitucionesPage() {
  return (
    <PageContainer>
      <PageHero
        title="Integración perfecta para bibliotecas y un descubrimiento de contenido revolucionario"
        subtitle="Publicación académica que cumple con los estándares, con herramientas de descubrimiento potenciadas por IA que transforman la experiencia de investigación de los usuarios."
      />

      <Prose>
        <p>
          CENIE Editorial ofrece a las bibliotecas académicas investigación de vanguardia en artes
          escénicas a través de sistemas familiares y compatibles con los estándares. Nuestra
          plataforma se integra a la perfección con los flujos de trabajo existentes, a la vez que
          ofrece un descubrimiento revolucionario potenciado por IA que demuestra un impacto medible
          en los resultados de investigación y aprendizaje.
        </p>

        <h2>Integración Conforme a los Estándares</h2>
        <h3>Sin alterar los flujos de trabajo existentes</h3>
        <p>
          CENIE Editorial funciona con los sistemas y entornos de descubrimiento de tu biblioteca
          actual mediante protocolos y formatos estándar de la industria.
        </p>

        <p>
          <strong>Integración Técnica:</strong>
        </p>
        <ul>
          <li>
            <strong>Feeds OAI-PMH</strong> para la recopilación y el descubrimiento de metadatos.
          </li>
          <li>
            <strong>Registros listos para MARC</strong> para la integración en catálogos.
          </li>
          <li>
            <strong>Datos estructurados con Dublin Core</strong> y Schema.org.
          </li>
          <li>
            <strong>Integración con Crossref DOI</strong> para enlaces permanentes.
          </li>
        </ul>

        <p>
          <strong>Sistemas de Autenticación:</strong>
        </p>
        <ul>
          <li>
            <strong>Acceso basado en IP</strong> para redes del campus.
          </li>
          <li>
            <strong>Integración con SAML/Shibboleth SSO</strong>.
          </li>
          <li>
            <strong>Compatibilidad con Athens/OpenAthens</strong>.
          </li>
          <li>
            <strong>Soporte para servidor proxy</strong> para acceso fuera del campus.
          </li>
        </ul>

        <h2>Opciones de Licenciamiento Institucional</h2>
        <h3>Modelos flexibles para diversos tipos de instituciones</h3>
        <p>
          Entendemos que cada institución tiene necesidades y limitaciones presupuestarias únicas.
          Nuestras opciones de licenciamiento se adaptan desde pequeñas facultades hasta grandes
          universidades de investigación.
        </p>

        <p>
          <strong>Niveles de Licencia:</strong>
        </p>

        <h4>Acceso Esencial - Instituciones Pequeñas (Menos de 5,000 FTE)</h4>
        <ul>
          <li>Acceso a la colección principal de artes escénicas.</li>
          <li>Informes de uso estándar.</li>
          <li>Soporte básico de integración.</li>
          <li>Licencia anual con costes predecibles.</li>
        </ul>

        <h4>Acceso Integral - Instituciones Medianas (5,000-15,000 FTE)</h4>
        <ul>
          <li>Acceso completo al catálogo, incluyendo contenido multimedia.</li>
          <li>Analíticas de uso avanzadas.</li>
          <li>Soporte de integración prioritario.</li>
          <li>Precios para consorcios disponibles.</li>
        </ul>

        <h4>Investigación Plus - Grandes Universidades (Más de 15,000 FTE)</h4>
        <ul>
          <li>Colección completa más acceso al kit de herramientas RAG.</li>
          <li>Analíticas e informes personalizados.</li>
          <li>Especialista en integración dedicado.</li>
          <li>Acuerdos para múltiples campus y consorcios.</li>
        </ul>

        <h2>Un nuevo estándar en la experiencia de la investigación</h2>
        <h3>Herramientas interactivas que impulsan la participación y el aprendizaje</h3>
        <p>
          CENIE Editorial ofrece más que solo contenido; proporcionamos un entorno de investigación
          interactivo. Nuestras funciones basadas en IA permiten a tus usuarios interactuar más
          profundamente con el material académico, lo que se traduce en mejores resultados de
          aprendizaje y un mayor retorno de la inversión en tu colección.
        </p>

        <p>
          <strong>Funciones clave para tus usuarios:</strong>
        </p>
        <ul>
          <li>
            <strong>Búsqueda Conversacional:</strong> Los usuarios pueden plantear preguntas de
            investigación complejas y recibir respuestas directas y sintetizadas, reduciendo la
            fricción en la investigación y mejorando la experiencia de usuario.
          </li>
          <li>
            <strong>Descubrimiento Guiado:</strong> Nuestra plataforma sugiere proactivamente nuevas
            vías de investigación y conexiones conceptuales, fomentando la exploración y el
            aprendizaje interdisciplinario.
          </li>
          <li>
            <strong>IA Verificable:</strong> Garantizamos la integridad académica. Cada idea
            generada por IA está directamente vinculada al texto original, proporcionando la
            transparencia y fiabilidad que tu institución requiere.
          </li>
        </ul>

        <h2>Analíticas de Uso e Informes</h2>
        <h3>Informes compatibles con COUNTER y analíticas avanzadas</h3>
        <p>
          Nuestras analíticas van más allá de las estadísticas de uso tradicionales para
          proporcionar información útil para el desarrollo de colecciones y la asignación de
          recursos.
        </p>

        <p>
          <strong>Informes Estándar (COUNTER 5.1):</strong>
        </p>
        <ul>
          <li>
            <strong>TR_B1:</strong> Solicitudes de Libros por Mes y Título
          </li>
          <li>
            <strong>PR_P1:</strong> Informe Maestro de la Plataforma
          </li>
          <li>
            <strong>IR_A1:</strong> Solicitudes de Artículos de Revista por Mes y Artículo
          </li>
        </ul>
      </Prose>

      <Section spacing="large" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/recursos/instituciones">Solicita un Acceso de Prueba</CTAButton>
        <CTAButton href="/nosotros/contacto" variant="secondary">
          Agenda una Demo
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
