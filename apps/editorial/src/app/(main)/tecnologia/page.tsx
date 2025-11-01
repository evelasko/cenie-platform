import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'

export default function TecnologiaPage() {
  return (
    <PageContainer>
      <PageHero
        title="El futuro de la investigación es interactivo"
        subtitle="CENIE Editorial presenta la primera plataforma de publicación académica nativa en IA, transformando el texto estático en una experiencia de investigación dinámica e interactiva."
      />

      <Prose>
        <p>
          Nuestras tecnologías patentadas, fundamentadas en rigurosos estándares académicos,
          capacitan a los investigadores para descubrir, comprender y construir sobre la
          investigación en artes escénicas de formas nunca antes imaginadas.
        </p>

        <h2>Funciones de Investigación Interactiva</h2>

        <h3>1. Búsqueda Conversacional: Tu Asistente de Investigación</h3>
        <p>
          Ve más allá de las palabras clave y plantea preguntas de investigación complejas con tus
          propias palabras. Nuestra búsqueda basada en IA actúa como un asistente de investigación
          incansable, revisando todo nuestro catálogo para encontrar la información precisa que
          necesitas.
        </p>

        <p>
          <strong>Cómo la Búsqueda Conversacional transforma tu flujo de trabajo:</strong>
        </p>
        <ul>
          <li>
            <strong>Pregunta, no busques:</strong> En lugar de adivinar palabras clave, haz
            preguntas como: "¿Cuáles son los principales argumentos en contra del teatro
            posdramático?"
          </li>
          <li>
            <strong>Obtén respuestas directas:</strong> Recibe respuestas sintetizadas, de un
            párrafo, que abordan directamente tu consulta.
          </li>
          <li>
            <strong>Ahorra horas de lectura superficial:</strong> Dedica tu tiempo a analizar, no a
            buscar. Nuestra IA realiza la lectura inicial por ti, dirigiéndote a las secciones más
            relevantes al instante.
          </li>
        </ul>

        <h3>2. Descubrimiento Guiado: Descubre Nuevas Conexiones</h3>
        <p>
          Nuestra plataforma no solo responde a tus preguntas, sino que te ayuda a formular
          preguntas aún mejores. A medida que lees, nuestro motor de Descubrimiento Guiado sugiere
          proactivamente preguntas relevantes, conceptos relacionados y nuevas vías de investigación
          que quizás no habías considerado.
        </p>

        <h3>3. IA Verificable: Confía en Todas las Fuentes</h3>
        <p>
          En el ámbito académico, la confianza es innegociable. Cada respuesta e información
          proporcionada por nuestra IA incluye un enlace directo y verificable al pasaje original.
          Puedes hacer clic al instante para ver el contexto original, lo que garantiza una
          integridad académica completa.
        </p>

        <h2>El Motor: Protocolo de Modelo de Contexto (CMP)</h2>
        <h3>La Base de Nuestra Tecnología de IA</h3>
        <p>
          Estas funciones revolucionarias se basan en nuestro{' '}
          <strong>Protocolo de Modelo de Contexto (CMP)</strong> patentado. El texto académico
          tradicional no está estructurado y es opaco para la IA. El CMP soluciona este problema
          integrando una capa profunda de metadatos semánticos en cada publicación, haciendo el
          contenido comprensible para las máquinas sin sacrificar su legibilidad para los humanos.
        </p>

        <p>
          <strong>Cómo el CMP hace que nuestra IA sea más inteligente:</strong>
        </p>
        <ul>
          <li>
            <strong>Etiquetado semántico:</strong> No solo indexamos palabras; también etiquetamos
            conceptos, metodologías, argumentos y entidades.
          </li>
          <li>
            <strong>Mapeo de relaciones:</strong> El CMP traza las relaciones entre ideas, citas y
            evidencia en todo nuestro catálogo.
          </li>
          <li>
            <strong>Preservación del Contexto:</strong> Nuestra IA comprende el contexto de su
            consulta, lo que genera resultados más relevantes y con mayor precisión.
          </li>
        </ul>

        <h2>Para Instituciones: Kits de Herramientas RAG y API Seguras</h2>
        <h3>Lleve la IA Verificable a su Campus</h3>
        <p>
          Implemente el contenido confiable de CENIE Editorial en su propio entorno de investigación
          seguro utilizando nuestros kits de herramientas de{' '}
          <strong>Generación Aumentada por Recuperación (RAG)</strong>. Nuestros paquetes
          institucionales le permiten crear herramientas de IA personalizadas y verificables para su
          profesorado y estudiantes.
        </p>

        <p>
          <strong>Beneficios para Instituciones:</strong>
        </p>
        <ul>
          <li>
            <strong>Máxima Seguridad y Privacidad:</strong> Implemente localmente o en su propia VPC
            para un control total de los datos.
          </li>
          <li>
            <strong>Integración Personalizada:</strong> Utilice nuestras robustas API para integrar
            nuestro contenido y funciones de IA en su biblioteca y sistemas de descubrimiento
            existentes.
          </li>
          <li>
            <strong>LLM de Dominio Específico:</strong> Acceda a nuestros Modelos de Lenguaje
            Grandes especializados, entrenados exclusivamente con investigaciones de artes escénicas
            para obtener una experiencia inigualable en el dominio.
          </li>
        </ul>

        <h2>Arquitectura Tecnológica</h2>
        <h3>Escalable, Segura y Compatible con Estándares</h3>
        <p>
          Nuestra infraestructura tecnológica cumple con los requisitos empresariales y, a la vez
          que potencia flujos de trabajo de investigación innovadores.
        </p>

        <p>
          <strong>Especificaciones de la Infraestructura:</strong>
        </p>
        <ul>
          <li>
            <strong>Arquitectura nativa de la nube</strong> con implementación multirregional
          </li>
          <li>
            <strong>Diseño de microservicios</strong> para una funcionalidad modular
          </li>
          <li>
            <strong>Cifrado en tránsito</strong> y en reposo (AES-256)
          </li>
          <li>
            <strong>SLA de 99.9% de tiempo de actividad</strong> para sistemas en producción
          </li>
        </ul>
      </Prose>

      <Section spacing="large" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/catalogo">Comienza a Investigar</CTAButton>
        <CTAButton href="/nosotros/contacto" variant="secondary">
          Programa una Consulta Técnica
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
