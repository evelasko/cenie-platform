import type { Metadata } from 'next'
import { PageContainer, PageHero, Prose } from '@/components/content'
import { TYPOGRAPHY } from '@/lib/typography'
import { cn } from '@cenie/ui/lib'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de CENIE Editorial. Información sobre el tratamiento de datos personales, cookies y derechos de los usuarios conforme al RGPD.',
  alternates: {
    canonical: '/privacidad',
  },
}

export default function PrivacidadPage() {
  return (
    <PageContainer>
      <PageHero
        title="Política de Privacidad"
        subtitle="Información sobre el tratamiento de datos personales en CENIE Editorial"
      />

      <Prose className={TYPOGRAPHY.bodyLarge}>
        <p className={cn(TYPOGRAPHY.caption, 'text-muted-foreground')}>
          Última actualización: 17 de febrero de 2026
        </p>

        <h2>1. Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento de los datos personales recogidos a través del sitio web{' '}
          <strong>editorial.cenie.eu</strong> es el Centro de Investigación e Innovación en Artes
          Escénicas (CENIE).
        </p>
        <ul>
          <li>
            <strong>Correo electrónico de contacto:</strong> privacidad@cenie.eu
          </li>
          <li>
            <strong>Sitio web:</strong> editorial.cenie.eu
          </li>
        </ul>

        <h2>2. Datos que recopilamos</h2>
        <p>
          Dependiendo de cómo interactúes con nuestro sitio, podemos recopilar diferentes categorías
          de datos a través de los siguientes proveedores:
        </p>

        <h3>2.1. Vercel Analytics y Speed Insights</h3>
        <ul>
          <li>
            <strong>Datos recopilados:</strong> datos anónimos de visualización de páginas y métricas
            de rendimiento (tiempos de carga, Core Web Vitals).
          </li>
          <li>
            <strong>Cookies:</strong> no utiliza cookies.
          </li>
          <li>
            <strong>Datos personales:</strong> no recopila datos personales identificables (PII).
          </li>
          <li>
            <strong>Consentimiento:</strong> no requiere consentimiento previo al estar diseñado para
            cumplir con el RGPD sin recopilar datos personales.
          </li>
        </ul>

        <h3>2.2. Firebase Analytics (Google)</h3>
        <ul>
          <li>
            <strong>Datos recopilados:</strong> datos de sesión, información del dispositivo
            (navegador, sistema operativo, resolución de pantalla), eventos de interacción (clics,
            navegación, visualización de contenido).
          </li>
          <li>
            <strong>Cookies:</strong> utiliza cookies para identificar sesiones y usuarios
            recurrentes.
          </li>
          <li>
            <strong>Consentimiento:</strong> solo se activa tras el consentimiento explícito del
            usuario a través del banner de cookies.
          </li>
        </ul>

        <h3>2.3. Sentry (monitorización de errores)</h3>
        <ul>
          <li>
            <strong>Datos recopilados:</strong> datos técnicos de errores de la aplicación (trazas de
            pila, URL de la página, tipo de navegador). Toda información personal identificable (PII)
            es eliminada automáticamente antes del envío.
          </li>
          <li>
            <strong>Cookies:</strong> no utiliza cookies de seguimiento.
          </li>
          <li>
            <strong>Consentimiento:</strong> no requiere consentimiento previo al tratarse de un
            interés legítimo (mantenimiento y seguridad del servicio).
          </li>
        </ul>

        <h3>2.4. Supabase (datos de cuenta de usuario)</h3>
        <ul>
          <li>
            <strong>Datos recopilados:</strong> dirección de correo electrónico, nombre y datos de
            perfil proporcionados voluntariamente al registrarse.
          </li>
          <li>
            <strong>Cookies:</strong> utiliza cookies de sesión para mantener la autenticación.
          </li>
          <li>
            <strong>Consentimiento:</strong> el tratamiento se basa en la ejecución del contrato
            (prestación del servicio solicitado por el usuario).
          </li>
        </ul>

        <h3>2.5. Firebase Authentication</h3>
        <ul>
          <li>
            <strong>Datos recopilados:</strong> dirección de correo electrónico, identificador de
            usuario e información de proveedor de autenticación (Google, Apple) cuando se utiliza
            acceso social.
          </li>
          <li>
            <strong>Cookies:</strong> utiliza cookies de sesión para mantener la autenticación.
          </li>
          <li>
            <strong>Consentimiento:</strong> el tratamiento se basa en la ejecución del contrato.
          </li>
        </ul>

        <h2>3. Base legal del tratamiento</h2>
        <p>
          El tratamiento de datos personales se fundamenta en las siguientes bases legales conforme
          al artículo 6 del Reglamento General de Protección de Datos (RGPD):
        </p>
        <ul>
          <li>
            <strong>Consentimiento (art. 6.1.a):</strong> para la activación de Firebase Analytics y
            sus cookies asociadas. El usuario puede otorgar o retirar su consentimiento en cualquier
            momento.
          </li>
          <li>
            <strong>Ejecución de un contrato (art. 6.1.b):</strong> para el tratamiento de datos de
            cuenta de usuario necesarios para la prestación del servicio (registro, autenticación,
            gestión de perfil).
          </li>
          <li>
            <strong>Interés legítimo (art. 6.1.f):</strong> para la monitorización de errores
            mediante Sentry, necesaria para garantizar la seguridad, estabilidad y correcto
            funcionamiento del servicio.
          </li>
        </ul>

        <h2>4. Política de cookies</h2>
        <p>
          Nuestro sitio utiliza cookies con las siguientes finalidades:
        </p>

        <h3>4.1. Cookies técnicas (siempre activas)</h3>
        <ul>
          <li>
            <strong>Cookie de sesión de autenticación:</strong> necesaria para mantener la sesión del
            usuario registrado. Duración: hasta el cierre de sesión o expiración del token.
          </li>
          <li>
            <strong>Cookie de preferencia de consentimiento:</strong> almacena la elección del usuario
            sobre cookies analíticas. Duración: 365 días.
          </li>
        </ul>

        <h3>4.2. Cookies analíticas (requieren consentimiento)</h3>
        <ul>
          <li>
            <strong>Firebase Analytics:</strong> cookies utilizadas para recopilar datos estadísticos
            de uso del sitio. Solo se activan si el usuario acepta mediante el banner de
            consentimiento. Duración: hasta 2 años.
          </li>
        </ul>

        <h2>5. Períodos de conservación</h2>
        <ul>
          <li>
            <strong>Datos de cuenta de usuario:</strong> se conservan mientras la cuenta esté activa.
            Tras la solicitud de eliminación, los datos se eliminan en un plazo máximo de 30 días.
          </li>
          <li>
            <strong>Datos de analítica (Firebase):</strong> se conservan durante un máximo de 14 meses
            conforme a la configuración predeterminada de Google Analytics.
          </li>
          <li>
            <strong>Datos de errores (Sentry):</strong> se conservan durante un máximo de 90 días.
          </li>
          <li>
            <strong>Datos de analítica (Vercel):</strong> se conservan de forma agregada y anónima
            durante el período de suscripción del servicio.
          </li>
        </ul>

        <h2>6. Derechos de los usuarios</h2>
        <p>
          Conforme al RGPD, los usuarios tienen los siguientes derechos respecto a sus datos
          personales:
        </p>
        <ul>
          <li>
            <strong>Derecho de acceso:</strong> solicitar información sobre qué datos personales
            tratamos.
          </li>
          <li>
            <strong>Derecho de rectificación:</strong> solicitar la corrección de datos inexactos o
            incompletos.
          </li>
          <li>
            <strong>Derecho de supresión:</strong> solicitar la eliminación de datos personales cuando
            ya no sean necesarios o se retire el consentimiento.
          </li>
          <li>
            <strong>Derecho a la portabilidad:</strong> recibir los datos personales en un formato
            estructurado, de uso común y lectura mecánica.
          </li>
          <li>
            <strong>Derecho de oposición:</strong> oponerse al tratamiento de datos basado en interés
            legítimo.
          </li>
          <li>
            <strong>Derecho a la limitación del tratamiento:</strong> solicitar la restricción del
            tratamiento en determinadas circunstancias.
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, puedes enviar un correo electrónico a{' '}
          <strong>privacidad@cenie.eu</strong> indicando tu solicitud y adjuntando una copia de tu
          documento de identidad. Responderemos en un plazo máximo de 30 días.
        </p>
        <p>
          Asimismo, tienes derecho a presentar una reclamación ante la Agencia Española de Protección
          de Datos (AEPD) en{' '}
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            className={TYPOGRAPHY.link}
          >
            www.aepd.es
          </a>{' '}
          si consideras que tus derechos no han sido debidamente atendidos.
        </p>

        <h2>7. Retirada del consentimiento</h2>
        <p>
          Puedes retirar tu consentimiento para las cookies analíticas en cualquier momento. Para
          ello, elimina las cookies del sitio en la configuración de tu navegador. Al volver a visitar
          el sitio, el banner de consentimiento aparecerá de nuevo, permitiéndote actualizar tu
          preferencia.
        </p>

        <h2>8. Transferencias internacionales</h2>
        <p>
          Algunos de los proveedores que utilizamos están ubicados fuera del Espacio Económico
          Europeo (EEE):
        </p>
        <ul>
          <li>
            <strong>Google (Firebase Analytics, Firebase Authentication):</strong> transferencias
            amparadas por las Cláusulas Contractuales Tipo de la Comisión Europea y el marco de
            privacidad de datos UE-EE.UU.
          </li>
          <li>
            <strong>Vercel:</strong> transferencias amparadas por las Cláusulas Contractuales Tipo.
          </li>
          <li>
            <strong>Sentry:</strong> transferencias amparadas por las Cláusulas Contractuales Tipo.
          </li>
        </ul>

        <h2>9. Seguridad</h2>
        <p>
          Implementamos medidas técnicas y organizativas adecuadas para proteger los datos personales
          contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Estas
          medidas incluyen el cifrado de datos en tránsito (HTTPS/TLS), la sanitización automática de
          información personal en los registros de errores, y el control de acceso basado en roles
          para los datos del sistema.
        </p>

        <h2>10. Modificaciones de esta política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política de privacidad para reflejar cambios
          en nuestras prácticas o en la legislación aplicable. La fecha de última actualización se
          indica al inicio de este documento. Recomendamos revisar esta página periódicamente.
        </p>

        <h2>11. Contacto</h2>
        <p>
          Si tienes alguna pregunta sobre esta política de privacidad o sobre el tratamiento de tus
          datos personales, puedes contactarnos en:
        </p>
        <ul>
          <li>
            <strong>Correo electrónico:</strong> privacidad@cenie.eu
          </li>
          <li>
            <strong>Sitio web:</strong> editorial.cenie.eu
          </li>
        </ul>
      </Prose>
    </PageContainer>
  )
}
