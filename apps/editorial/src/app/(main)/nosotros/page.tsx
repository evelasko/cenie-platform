import type { Metadata } from 'next'
import { PageContainer, PageHero, Prose, Section, CTAButton } from '@/components/content'
import { TYPOGRAPHY } from '@/lib/typography'

export const metadata: Metadata = {
  title: 'Acerca de Nosotros',
  description:
    'Conoce la misión y visión de CENIE Editorial: publicación académica potenciada por IA para la investigación en artes escénicas a nivel global.',
}

export default function NosotrosPage() {
  return (
    <PageContainer>
      <PageHero
        title="Acerca de CENIE Editorial"
        subtitle="Forjando el futuro de la investigación en artes escénicas con publicaciones académicas potenciadas por IA"
      />

      <Prose className={TYPOGRAPHY.bodyLarge}>
        <p>
          CENIE Editorial es la división editorial del Centro de Investigación e Innovación en Artes
          Escénicas (CENIE), fundada para revolucionar cómo se crea, descubre y comparte la
          investigación en artes escénicas entre las comunidades académicas de todo el mundo.
        </p>

        <h2>Nuestra misión</h2>
        <h3>Transformando la publicación académica para la era digital</h3>
        <p>
          Creemos que la investigación en artes escénicas merece tecnologías de publicación tan
          innovadoras y dinámicas como el propio campo. Nuestra misión es combinar el rigor
          académico tradicional con las capacidades de la inteligencia artificial de vanguardia,
          creando un nuevo paradigma para la comunicación académica.
        </p>

        <p>
          <strong>Nuestro compromiso:</strong>
        </p>
        <ul>
          <li>
            <strong>Mantener los más altos estándares académicos</strong> mediante una rigurosa
            revisión por pares
          </li>
          <li>
            <strong>Derribar las barreras del idioma</strong> con publicaciones bilingües integrales
          </li>
          <li>
            <strong>Potenciar el descubrimiento de contenido</strong> con una estructuración nativa
            para IA
          </li>
          <li>
            <strong>Apoyar la investigación académica global</strong> con prácticas editoriales
            accesibles e inclusivas
          </li>
        </ul>

        <h3>Solucionando las carencias de la publicación académica actual</h3>
        <p>
          Las editoriales académicas tradicionales no se han adaptado para atender las necesidades
          específicas de los investigadores de las artes escénicas ni las oportunidades que ofrece
          la tecnología moderna.
        </p>

        <h2>Nuestra Innovación</h2>
        <h3>La Ventaja del Protocolo de Modelo de Contexto</h3>
        <p>
          El revolucionario <strong>Protocolo de Modelo de Contexto (CMP)</strong> de CENIE
          Editorial representa el primer enfoque sistemático para que el contenido académico sea
          verdaderamente legible por máquinas, preservando al mismo tiempo el rigor académico.
        </p>

        <p>
          <strong>Lo que hace único a nuestro enfoque:</strong>
        </p>
        <ul>
          <li>
            <strong>Estructuración semántica</strong> que permite la comprensión por IA sin
            simplificar el contenido
          </li>
          <li>
            <strong>Mapeo de relaciones</strong> que devela conexiones entre conceptos, métodos y
            citas
          </li>
          <li>
            <strong>Preservación interlingüística</strong> que mantiene el significado a lo largo de
            la traducción
          </li>
          <li>
            <strong>Integración multimedia</strong> que trata la documentación de la performance
            como investigación académica de primer nivel
          </li>
        </ul>

        <h2>Nuestros Estándares</h2>
        <h3>Excelencia Académica</h3>
        <p>
          La innovación nunca compromete la calidad. CENIE Editorial mantiene los más altos
          estándares de publicación académica:
        </p>

        <p>
          <strong>Excelencia en la revisión por pares:</strong>
        </p>
        <ul>
          <li>
            Procesos de <strong>revisión doble ciego</strong> con plazos transparentes
          </li>
          <li>
            <strong>Consejo editorial de expertos</strong> que abarca todas las áreas de los
            estudios de artes escénicas
          </li>
          <li>
            <strong>Políticas sobre conflictos de interés</strong> y prácticas de publicación éticas
          </li>
          <li>
            Opciones de <strong>revisión por pares abierta</strong> para autores que optan por la
            transparencia
          </li>
        </ul>

        <h3>Responsabilidad Global</h3>
        <p>
          Reconocemos nuestra responsabilidad de servir no solo al mundo académico angloparlante,
          sino también a la comunidad global de académicos y profesionales de las artes escénicas.
        </p>

        <h2>Mirando hacia el Futuro</h2>
        <h3>Nuestra Visión para la Publicación Académica</h3>
        <p>Imaginamos un futuro en el que:</p>
        <ul>
          <li>
            <strong>El idioma no sea un obstáculo</strong> para acceder a la investigación esencial
          </li>
          <li>
            <strong>La IA potencie el descubrimiento</strong> sin comprometer la perspectiva humana
          </li>
          <li>
            <strong>La integración multimedia</strong> sea fluida y significativa
          </li>
          <li>
            <strong>La colaboración global</strong> se vea facilitada por la tecnología accesible
          </li>
          <li>
            <strong>El rigor académico</strong> se vea reforzado por la innovación en lugar de verse
            amenazado
          </li>
        </ul>
      </Prose>

      <Section spacing="large" className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton href="/recursos/autores">Publica con Nosotros</CTAButton>
        <CTAButton href="/nosotros/comite" variant="secondary">
          Conoce Nuestro Consejo Editorial
        </CTAButton>
      </Section>
    </PageContainer>
  )
}
