import { type NavigationItem } from '../lib/types'

export const mainNavigationItems: NavigationItem[] = [
  { label: { en: 'learn', es: 'aprende' }, href: '/learn' },
  { label: { en: 'innovate', es: 'innova' }, href: '/innovate' },
  { label: { en: 'optimize', es: 'optimiza' }, href: '/optimize' },
  { label: { en: 'insights', es: 'profundiza' }, href: '/insights' },
  { label: { en: 'about', es: 'acerca' }, href: '/about' },
  { label: { en: 'connect', es: 'conecta' }, href: '/connect' },
]

export const footerNavigationItems: NavigationItem[] = [
  {
    label: { en: 'learn', es: 'aprende' },
    href: '/learn',
    items: [
      { label: { en: 'courses', es: 'cursos' }, href: '/learn/courses' },
      {
        label: { en: 'training methodologies', es: 'metodologías de formación' },
        href: '/learn/training-methodologies',
      },
      { label: { en: 'resources', es: 'recursos' }, href: '/learn/resources' },
      { label: { en: 'evaluation', es: 'evaluación' }, href: '/learn/assessment' },
    ],
  },
  {
    label: { en: 'innovate', es: 'innova' },
    href: '/innovate',
    items: [
      {
        label: { en: 'performance analysis', es: 'análisis de rendimiento' },
        href: '/innovate/performance-analysis',
      },
      {
        label: { en: 'creative labs', es: 'laboratorios creativos' },
        href: '/innovate/creative-labs',
      },
      {
        label: { en: 'technology integration', es: 'integración tecnológica' },
        href: '/innovate/technology-integration',
      },
    ],
  },
  {
    label: { en: 'optimize', es: 'optimiza' },
    href: '/optimize',
    items: [
      {
        label: { en: 'production collaboration', es: 'colaboración en producción' },
        href: '/optimize/production-collaboration',
      },
      {
        label: { en: 'talent discovery', es: 'descubrimiento de talento' },
        href: '/optimize/talent-discovery',
      },
      {
        label: { en: 'workflow consulting', es: 'consultoría de flujo de trabajo' },
        href: '/optimize/workflow-consulting',
      },
      { label: { en: 'demo', es: 'demo' }, href: '/optimize/demo' },
      {
        label: { en: 'automation assessment', es: 'evaluación de automatización' },
        href: '/optimize/automation-assessment',
      },
    ],
  },
  {
    label: { en: 'insights', es: 'profundiza' },
    href: '/insights',
    items: [
      { label: { en: 'publications', es: 'publicaciones' }, href: '/insights/publications' },
      {
        label: { en: 'ai content models', es: 'modelos de contenido IA' },
        href: '/insights/ai-content-models',
      },
      {
        label: { en: 'methodology library', es: 'biblioteca de metodologías' },
        href: '/insights/methodology-library',
      },
      {
        label: { en: 'industry trends', es: 'tendencias de la industria' },
        href: '/insights/industry-trends',
      },
    ],
  },
  {
    label: { en: 'about', es: 'acerca' },
    href: '/about',
    items: [
      { label: { en: 'mission and vision', es: 'misión y visión' }, href: '/about/mission-vision' },
      { label: { en: 'our approach', es: 'nuestro enfoque' }, href: '/about/approach' },
      { label: { en: 'team', es: 'equipo' }, href: '/about/team' },
      { label: { en: 'news', es: 'noticias' }, href: '/about/news' },
    ],
  },
  {
    label: { en: 'connect', es: 'conecta' },
    href: '/connect',
    items: [
      { label: { en: 'community', es: 'comunidad' }, href: '/connect/community' },
      { label: { en: 'partnerships', es: 'alianzas' }, href: '/connect/partnerships' },
      { label: { en: 'events', es: 'eventos' }, href: '/connect/events' },
      { label: { en: 'contact', es: 'contacto' }, href: '/connect/contact' },
    ],
  },
  {
    label: { en: 'cenie', es: 'cenie' },
    href: '/',
    items: [
      { label: { en: 'academia', es: 'academia' }, href: 'https://academia.cenie.org' },
      { label: { en: 'agency', es: 'agencia' }, href: 'https://agencia.cenie.org' },
      { label: { en: 'editorial', es: 'editorial' }, href: 'https://editorial.cenie.org' },
    ],
  },
]

export const legalNavigationItems: NavigationItem[] = [
  { label: { en: 'privacy policy', es: 'política de privacidad' }, href: '/privacy-policy' },
  { label: { en: 'terms of service', es: 'términos de servicio' }, href: '/terms-of-service' },
  { label: { en: 'site map', es: 'mapa del sitio' }, href: '/search' },
]
