import type { Metadata } from 'next'
import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'

export const metadata: Metadata = {
  title: 'Para Autores',
  description:
    'Publica con CENIE Editorial. Proceso de envío de manuscritos, revisión por pares y publicación académica en artes escénicas con tecnología IA.',
}

export default function AutoresPage() {
  return (
    <PageContainer>
      <PageHero
        title="Publica en la vanguardia de la edición académica"
        subtitle="Únete a la revolución editorial nativa en IA sin renunciar a los más altos estándares académicos."
      />

      <Prose>
        <p>
          CENIE Editorial ofrece a los académicos de las artes escénicas la oportunidad de publicar
          con la primera editorial académica del mundo potenciada por IA. Tu trabajo llegará a
          audiencias globales a través de nuestra plataforma bilingüe, beneficiándose de tecnologías
          de descubrimiento de vanguardia que las editoriales tradicionales no pueden igualar.
        </p>

        <h2>¿Por qué elegir CENIE Editorial?</h2>
        <h3>Amplifica tu impacto con la publicación interactiva</h3>
        <p>
          Tu investigación merece ser experimentada, no solo leída. Nuestra plataforma nativa en IA
          transforma tu texto en una experiencia interactiva, permitiendo a los lectores explorar,
          cuestionar y conectar con tu trabajo de maneras sin precedentes.
        </p>

        <p>
          <strong>Cómo nuestra plataforma aumenta el impacto de tu trabajo:</strong>
        </p>
        <ul>
          <li>
            <strong>Búsqueda Conversacional:</strong> Los lectores pueden hacer preguntas directas y
            obtener respuestas basadas en tu trabajo, poniendo tus argumentos en primer plano.
          </li>
          <li>
            <strong>Descubrimiento Guiado:</strong> Nuestra IA conecta tus ideas con el debate
            académico global, mostrando tu trabajo en contextos nuevos e inesperados.
          </li>
          <li>
            <strong>IA Verificable:</strong> Construimos confianza al permitir que los lectores
            verifiquen al instante cada idea generada por la IA, enlazándola directamente a tu texto
            original.
          </li>
        </ul>

        <h3>Estándares Académicos Rigurosos en los que Puedes Confiar</h3>
        <p>
          La innovación no significa comprometer la calidad. Nuestro{' '}
          <strong>proceso de revisión por pares doble ciego</strong> y nuestro comité editorial de
          expertos mantienen el rigor académico que necesitas para la titularidad, la promoción y el
          reconocimiento académico.
        </p>

        <h3>Alcance Global Bilingüe</h3>
        <p>
          Expande tu impacto académico más allá de las barreras del idioma. Nuestro{' '}
          <strong>Programa de Traducción al Español</strong> puede hacer que tu trabajo sea
          accesible para toda la comunidad académica de habla hispana.
        </p>

        <h2>La Ventaja de CENIE Editorial</h2>
        <h3>Protocolo de Modelo de Contexto: Prepara tu trabajo para la IA</h3>
        <p>
          La publicación académica tradicional deja tu trabajo invisible para las herramientas de
          investigación con IA. Nuestro <strong>Protocolo de Modelo de Contexto</strong> estructura
          tu investigación para que tanto los investigadores humanos como los sistemas de IA puedan
          comprenderla, citarla y desarrollarla adecuadamente.
        </p>

        <h3>Soporte para la Integración Multimedia</h3>
        <p>
          La investigación en artes escénicas no debería limitarse al texto. Apoyamos contenido
          multimedia enriquecido que da vida a tu investigación.
        </p>

        <p>
          <strong>Formatos de publicación mejorados:</strong>
        </p>
        <ul>
          <li>
            <strong>Vídeos incrustados</strong>, demostraciones y ejemplos
          </li>
          <li>
            <strong>Grabaciones de audio</strong> de entrevistas y performances
          </li>
          <li>
            <strong>Diagramas interactivos</strong> y visualizaciones de procesos
          </li>
          <li>
            <strong>Conjuntos de datos basados en la práctica</strong> con documentación adecuada
          </li>
        </ul>

        <h2>Nuestro Proceso de Publicación</h2>

        <h3>1. Propuesta Inicial</h3>
        <p>
          <strong>Plazo: Respuesta inmediata</strong>
        </p>
        <ul>
          <li>Envía tu propuesta a través de nuestro sistema en línea.</li>
          <li>Recibe confirmación y una revisión editorial inicial.</li>
          <li>Obtén orientación sobre la preparación del Protocolo de Modelo de Contexto.</li>
        </ul>

        <h3>2. Proceso de Revisión por Pares</h3>
        <p>
          <strong>Plazo: 8-12 semanas</strong>
        </p>
        <ul>
          <li>Revisión por pares doble ciego por expertos en la materia.</li>
          <li>Feedback transparente y orientación para la revisión.</li>
          <li>Apoyo editorial durante todo el proceso.</li>
        </ul>

        <h3>3. Producción y Optimización</h3>
        <p>
          <strong>Plazo: 6-8 semanas</strong>
        </p>
        <ul>
          <li>Implementación del Protocolo de Modelo de Contexto.</li>
          <li>Integración y pruebas de contenido multimedia.</li>
          <li>Coordinación de la traducción, si aplica.</li>
        </ul>

        <h3>4. Publicación y Promoción</h3>
        <p>
          <strong>Plazo: 2-4 semanas</strong>
        </p>
        <ul>
          <li>Asignación de DOI y registro de metadatos.</li>
          <li>Distribución en bibliotecas e integración en sistemas de descubrimiento.</li>
          <li>Campaña promocional con el apoyo del autor.</li>
        </ul>
      </Prose>

      <Section spacing="large" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/recursos/autores">Enviar Propuesta Ahora</CTAButton>
        <CTAButton href="/nosotros/contacto" variant="secondary">
          Agendar una Consulta
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
