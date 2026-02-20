import type { Metadata } from 'next'
import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'

export const metadata: Metadata = {
  title: 'Programa de Traducciones',
  description:
    'Programa de traducciones al español de investigación en artes escénicas. Obras fundamentales de teatro, danza y performance accesibles para la comunidad hispanohablante.',
  alternates: {
    canonical: '/nosotros/traducciones',
  },
}

export default function TraduccionesPage() {
  return (
    <PageContainer>
      <PageHero
        title="Rompiendo las Barreras del Idioma en la Investigación de las Artes Escénicas"
        subtitle="Acceso académico bilingüe para una comunidad global de investigadores."
      />

      <Prose>
        <p>
          CENIE Editorial cierra brechas críticas en la investigación en artes escénicas en español
          a través de nuestro completo programa de traducción. Por primera vez, obras fundamentales
          en teatro, danza y estudios de performance son accesibles para la comunidad académica
          global de habla hispana.
        </p>

        <h2>Nuestra Misión de Traducción</h2>
        <h3>Construyendo Puentes Culturales a través de la Investigación</h3>
        <p>
          El idioma nunca debería ser una barrera para la excelencia académica. Nuestro{' '}
          <strong>Programa de Traducción al Español</strong> hace accesible la investigación
          esencial en artes escénicas a investigadores, educadores y estudiantes de habla hispana en
          todo el mundo.
        </p>

        <p>
          <strong>Nuestro compromiso incluye:</strong>
        </p>
        <ul>
          <li>
            <strong>Traducciones profesionales</strong> por expertos en la materia.
          </li>
          <li>
            <strong>Adaptación cultural</strong> que preserva el rigor académico.
          </li>
          <li>
            <strong>Revisión por pares</strong> de las traducciones por parte de académicos
            bilingües.
          </li>
          <li>
            <strong>Participación de la comunidad</strong> en la definición de prioridades de
            traducción.
          </li>
        </ul>

        <h3>Llenando Vacíos Críticos de Conocimiento</h3>
        <p>
          Muchas obras fundamentales en los estudios de artes escénicas nunca han sido traducidas al
          español, creando barreras significativas para los académicos de habla hispana y limitando
          el diálogo académico intercultural.
        </p>

        <p>
          <strong>Priorizamos la traducción de:</strong>
        </p>
        <ul>
          <li>
            <strong>Obras teóricas seminales</strong> en estudios de teatro y performance.
          </li>
          <li>
            <strong>Metodologías contemporáneas</strong> en teatro aplicado e inmersivo.
          </li>
          <li>
            <strong>Ejemplos y estudios de caso</strong> de investigación basada en la práctica.
          </li>
          <li>
            <strong>Documentación histórica</strong> de tradiciones escénicas.
          </li>
        </ul>

        <h2>Traducciones al Español Disponibles</h2>
        <h3>Traducciones Publicadas Recientemente</h3>

        <h4>"Metodologías de Teatro Aplicado"</h4>
        <p>
          <em>Applied Theatre Methodologies</em>
        </p>
        <p>Guía esencial sobre prácticas de participación comunitaria y teatro educativo.</p>

        <h4>"Teorías de la Performance Inmersiva"</h4>
        <p>
          <em>Theories of Immersive Performance</em>
        </p>
        <p>Exploración exhaustiva de la participación del público y la narrativa espacial.</p>

        <h4>"Documentación Digital de la Performance"</h4>
        <p>
          <em>Digital Documentation of Performance</em>
        </p>
        <p>
          Guía multimedia sobre la metodología de investigación basada en la práctica con ejemplos
          en vídeo.
        </p>

        <h3>Garantía de Calidad en la Traducción</h3>
        <p>Cada traducción se somete a un riguroso control de calidad:</p>
        <ul>
          <li>
            <strong>Traductores especializados</strong> con experiencia académica en el campo.
          </li>
          <li>
            <strong>Revisión por pares</strong> por académicos bilingües especialistas.
          </li>
          <li>
            <strong>Consultoría cultural</strong> para la accesibilidad intercultural.
          </li>
          <li>
            <strong>Verificación de la precisión técnica</strong> de la terminología especializada.
          </li>
        </ul>

        <h2>Solicita una Traducción</h2>
        <h3>Prioridades Impulsadas por la Comunidad</h3>
        <p>
          Invitamos a la comunidad académica a enviar solicitudes para ayudarnos a priorizar futuros
          proyectos de traducción.
        </p>

        <p>
          <strong>Cómo solicitar una traducción:</strong>
        </p>
        <ol>
          <li>
            <strong>Identifica la obra</strong> que crees que debería ser traducida.
          </li>
          <li>
            <strong>Justifica</strong> su importancia académica.
          </li>
          <li>
            <strong>Describe la comunidad</strong> de usuarios potenciales.
          </li>
          <li>
            <strong>Envía tu solicitud</strong> a través de nuestro formulario en línea.
          </li>
        </ol>

        <h3>Criterios de Selección</h3>
        <p>Los proyectos de traducción se seleccionan en función de:</p>
        <ul>
          <li>
            <strong>Relevancia académica</strong> e impacto de citación.
          </li>
          <li>
            <strong>Necesidad de la comunidad</strong> y número de lectores potenciales.
          </li>
          <li>
            <strong>Importancia cultural</strong> para los académicos de habla hispana.
          </li>
          <li>
            <strong>Valor pedagógico</strong> para los programas académicos.
          </li>
          <li>
            <strong>Disponibilidad de derechos</strong> y cooperación del autor.
          </li>
        </ul>

        <h2>Para Académicos de Habla Hispana</h2>
        <h3>Opciones de Acceso y Suscripción</h3>

        <p>
          <strong>Acceso Individual:</strong>
        </p>
        <ul>
          <li>Membresía anual asequible con acceso completo a la lectura.</li>
          <li>Opciones de compra por capítulo.</li>
          <li>Descuentos para estudiantes disponibles.</li>
          <li>Herramientas de exportación de citas en español.</li>
        </ul>

        <p>
          <strong>Acceso para Instituciones Educativas:</strong>
        </p>
        <ul>
          <li>Licenciamiento para todo el campus para universidades y facultades.</li>
          <li>Analíticas de uso e informes en español.</li>
          <li>Integración con sistemas de descubrimiento en español.</li>
          <li>Soporte técnico en español.</li>
        </ul>

        <h2>Impacto Global a través de la Investigación Bilingüe</h2>
        <h3>Expandiendo el Diálogo Académico</h3>
        <p>
          Nuestras traducciones no solo hacen accesible el contenido, sino que permiten nuevas
          formas de intercambio académico intercultural y de investigación colaborativa.
        </p>

        <p>
          <strong>Beneficios para la comunidad académica global:</strong>
        </p>
        <ul>
          <li>
            <strong>Redes de citación interlingüística</strong> y diálogo académico.
          </li>
          <li>
            <strong>Intercambio cultural</strong> a través de metodologías comparativas.
          </li>
          <li>
            <strong>Oportunidades de investigación colaborativa</strong> entre diferentes idiomas.
          </li>
          <li>
            <strong>Apoyo a la movilidad estudiantil</strong> a través de recursos bilingües.
          </li>
        </ul>
      </Prose>

      <Section spacing="lg" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/catalogo">Explorar Catálogo en Español</CTAButton>
        <CTAButton href="/nosotros/contacto" variant="secondary">
          Solicitar una Traducción
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
