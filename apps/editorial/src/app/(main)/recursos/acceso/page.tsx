import type { Metadata } from 'next'
import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'

export const metadata: Metadata = {
  title: 'Acceso y Herramientas',
  description:
    'Herramientas interactivas de investigación potenciadas por IA. Búsqueda conversacional, descubrimiento guiado y gestión de citas para artes escénicas.',
  alternates: {
    canonical: '/recursos/acceso',
  },
}

export default function AccesoPage() {
  return (
    <PageContainer>
      <PageHero
        title="Tu Compañero de Investigación Interactivo"
        subtitle="Herramientas potenciadas por IA que transforman cómo descubres, comprendes e interactúas con la investigación en artes escénicas."
      />

      <Prose>
        <p>
          CENIE Editorial va más allá del texto estático. Ofrecemos un entorno de investigación
          dinámico con herramientas interactivas que hacen tu investigación más rápida, profunda y
          reveladora que nunca.
        </p>

        <h2>Investiga de Forma Más Inteligente</h2>

        <h3>1. Búsqueda Conversacional: Pregunta, no Caces Términos</h3>
        <p>
          Olvídate de adivinar palabras clave. Formula preguntas de investigación complejas en
          lenguaje natural y obtén respuestas directas y sintetizadas de todo nuestro catálogo. Es
          como tener un asistente de investigación personal que ya lo ha leído todo.
        </p>

        <p>
          <strong>Cómo acelera esto tu trabajo:</strong>
        </p>
        <ul>
          <li>
            <strong>Ve directo al grano:</strong> Pregunta "¿Cuáles son las metodologías clave para
            la práctica como investigación?" y obtén una respuesta directa.
          </li>
          <li>
            <strong>Ahorra horas de lectura superficial:</strong> Nuestra IA localiza los pasajes
            exactos que necesitas, liberándote para que te concentres en el análisis.
          </li>
          <li>
            <strong>Encuentra lo que no sabías que buscabas:</strong> Descubre conexiones y fuentes
            que habrías pasado por alto con la búsqueda tradicional.
          </li>
        </ul>

        <h3>2. Descubrimiento Guiado: Deja que la Curiosidad te Guíe</h3>
        <p>
          Nuestra plataforma no solo espera tus preguntas, sino que te ayuda a formular otras
          nuevas. A medida que lees, nuestro motor de Descubrimiento Guiado sugiere conceptos
          relacionados, preguntas críticas y trabajos relevantes de otros campos.
        </p>

        <h3>3. IA Verificable: Investiga con Confianza</h3>
        <p>
          La confianza es esencial. Cada respuesta de nuestra IA es 100% verificable. Con un solo
          clic, puedes saltar al pasaje original para ver el contexto por ti mismo, garantizando una
          integridad académica total.
        </p>

        <h2>Opciones de Acceso para Cada Necesidad</h2>

        <h3>Membresía Individual</h3>
        <p>
          <strong>
            Ideal para académicos independientes, estudiantes de posgrado y profesionales.
          </strong>
        </p>

        <p>
          <strong>Qué incluye:</strong>
        </p>
        <ul>
          <li>
            <strong>Acceso completo al catálogo</strong> de todas las publicaciones de CENIE
            Editorial.
          </li>
          <li>
            <strong>Herramientas de búsqueda y descubrimiento</strong> potenciadas por IA.
          </li>
          <li>
            <strong>Exportación de citas</strong> a Zotero, Mendeley y EndNote.
          </li>
          <li>
            <strong>Recomendaciones de lectura</strong> basadas en tus intereses.
          </li>
          <li>
            <strong>Herramientas de anotación y marcadores</strong> para la gestión personal de tu
            investigación.
          </li>
        </ul>

        <p>
          <strong>Beneficios de la membresía:</strong>
        </p>
        <ul>
          <li>
            <strong>Cuota anual asequible</strong> diseñada para investigadores individuales.
          </li>
          <li>
            <strong>Descuentos para estudiantes</strong> con una identificación académica válida.
          </li>
          <li>
            <strong>Acceso flexible</strong> desde cualquier lugar con conexión a internet.
          </li>
          <li>
            <strong>Experiencia de lectura optimizada</strong> para dispositivos móviles.
          </li>
        </ul>

        <h3>Programas de Acceso para Estudiantes</h3>
        <p>
          <strong>Tarifas especiales y recursos para estudiantes de grado y posgrado.</strong>
        </p>

        <p>
          <strong>Ventajas para estudiantes:</strong>
        </p>
        <ul>
          <li>
            <strong>Listas de lecturas de cursos</strong> con selecciones curadas por profesores.
          </li>
          <li>
            <strong>Guías de estudio</strong> y materiales complementarios.
          </li>
          <li>
            <strong>Formación en citación</strong> con gestores de referencias integrados.
          </li>
          <li>
            <strong>Herramientas de colaboración entre pares</strong> para proyectos de grupo.
          </li>
        </ul>

        <h3>Acceso Institucional</h3>
        <p>
          <strong>Acceso completo en todo el campus a través de alianzas con bibliotecas.</strong>
        </p>

        <p>
          <strong>Para usuarios afiliados:</strong>
        </p>
        <ul>
          <li>
            <strong>Acceso SSO sin interrupciones</strong> a través del login de la universidad.
          </li>
          <li>
            <strong>Contenido multimedia completo</strong>, incluyendo vídeo y audio.
          </li>
          <li>
            <strong>Analíticas avanzadas</strong> para el seguimiento de la investigación.
          </li>
          <li>
            <strong>Soporte prioritario</strong> para la asistencia en la investigación.
          </li>
        </ul>

        <h2>Herramientas que Transforman tu Flujo de Trabajo</h2>

        <h3>Gestión Inteligente de Citas</h3>
        <p>
          No vuelvas a perder el rastro de tus fuentes. Nuestras herramientas de citación integradas
          se acoplan perfectamente a tu flujo de trabajo.
        </p>

        <p>
          <strong>Funciones de citación:</strong>
        </p>
        <ul>
          <li>
            <strong>Exportación en un clic</strong> a los principales gestores de referencias.
          </li>
          <li>
            <strong>Formato automático</strong> para múltiples estilos de citación.
          </li>
          <li>
            <strong>Verificación de citas</strong> con integración de DOI.
          </li>
          <li>
            <strong>Generación de bibliografías</strong> con comprobación de precisión.
          </li>
        </ul>

        <h3>Soporte de Investigación Multimedia</h3>
        <p>
          La investigación en artes escénicas requiere más que texto. Accede a contenido multimedia
          integrado con capacidad de búsqueda completa.
        </p>
      </Prose>

      <Section spacing="lg" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/recursos/acceso">Iniciar Membresía Individual</CTAButton>
        <CTAButton href="/catalogo" variant="secondary">
          Comenzar a Explorar
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
