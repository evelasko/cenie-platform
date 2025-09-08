import { type Pathnames } from 'next-intl/routing'

export const pathnames: Pathnames<['en', 'es']> = {
  // Root
  '/': '/',

  // Main Navigation
  '/learn': {
    en: '/learn',
    es: '/aprende',
  },
  '/innovate': {
    en: '/innovate',
    es: '/innova',
  },
  '/optimize': {
    en: '/optimize',
    es: '/optimiza',
  },
  '/insights': {
    en: '/insights',
    es: '/profundiza',
  },
  '/about': {
    en: '/about',
    es: '/acerca',
  },
  '/connect': {
    en: '/connect',
    es: '/conecta',
  },

  // Learn Section
  '/learn/courses': {
    en: '/learn/courses',
    es: '/aprende/cursos',
  },
  '/learn/courses/[course-name]': {
    en: '/learn/courses/[course-name]',
    es: '/aprende/cursos/[course-name]',
  },
  '/learn/training-methodologies': {
    en: '/learn/training-methodologies',
    es: '/aprende/metodologias-formacion',
  },
  '/learn/resources': {
    en: '/learn/resources',
    es: '/aprende/recursos',
  },
  '/learn/assessment': {
    en: '/learn/assessment',
    es: '/aprende/evaluacion',
  },

  // Innovate Section
  '/innovate/performance-analysis': {
    en: '/innovate/performance-analysis',
    es: '/innova/analisis-rendimiento',
  },
  '/innovate/creative-labs': {
    en: '/innovate/creative-labs',
    es: '/innova/laboratorios-creativos',
  },
  '/innovate/technology-integration': {
    en: '/innovate/technology-integration',
    es: '/innova/integracion-tecnologica',
  },

  // Optimize Section
  '/optimize/production-collaboration': {
    en: '/optimize/production-collaboration',
    es: '/optimiza/colaboracion-produccion',
  },
  '/optimize/talent-discovery': {
    en: '/optimize/talent-discovery',
    es: '/optimiza/descubrimiento-talento',
  },
  '/optimize/workflow-consulting': {
    en: '/optimize/workflow-consulting',
    es: '/optimiza/consultoria-flujo-trabajo',
  },
  '/optimize/demo': {
    en: '/optimize/demo',
    es: '/optimiza/demo',
  },
  '/optimize/automation-assessment': {
    en: '/optimize/automation-assessment',
    es: '/optimiza/evaluacion-automatizacion',
  },

  // Insights Section
  '/insights/publications': {
    en: '/insights/publications',
    es: '/profundiza/publicaciones',
  },
  '/insights/ai-content-models': {
    en: '/insights/ai-content-models',
    es: '/profundiza/modelos-contenido-ia',
  },
  '/insights/methodology-library': {
    en: '/insights/methodology-library',
    es: '/profundiza/biblioteca-metodologias',
  },
  '/insights/industry-trends': {
    en: '/insights/industry-trends',
    es: '/profundiza/tendencias-industria',
  },

  // About Section
  '/about/mission-vision': {
    en: '/about/mission-vision',
    es: '/acerca/mision-vision',
  },
  '/about/approach': {
    en: '/about/approach',
    es: '/acerca/enfoque',
  },
  '/about/team': {
    en: '/about/team',
    es: '/acerca/equipo',
  },
  '/about/news': {
    en: '/about/news',
    es: '/acerca/noticias',
  },

  // Connect Section
  '/connect/community': {
    en: '/connect/community',
    es: '/conecta/comunidad',
  },
  '/connect/partnerships': {
    en: '/connect/partnerships',
    es: '/conecta/alianzas',
  },
  '/connect/events': {
    en: '/connect/events',
    es: '/conecta/eventos',
  },
  '/connect/contact': {
    en: '/connect/contact',
    es: '/conecta/contacto',
  },

  // Utility Pages
  '/search': {
    en: '/search',
    es: '/buscar',
  },
  '/account': {
    en: '/account',
    es: '/cuenta',
  },
  '/privacy-policy': {
    en: '/privacy-policy',
    es: '/politica-privacidad',
  },
  '/terms-of-service': {
    en: '/terms-of-service',
    es: '/terminos-servicio',
  },
}
