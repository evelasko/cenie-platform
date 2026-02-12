export type NavigationItem = {
  label: string
  href: string
  icon?: React.ReactNode
  items?: NavigationItem[]
}

export const navigation: NavigationItem[] = [
  {
    label: 'Catálogo',
    href: '/catalogo',
    items: [
      { label: 'Publicaciones', href: '/catalogo' },
      { label: 'Próximamente', href: '/proximamente' },
    ],
  },
  {
    label: 'Tecnología',
    href: '/tecnologia',
  },
  {
    label: 'Recursos',
    href: '/recursos',
    items: [
      { label: 'Publicar con Nosotros', href: '/recursos/autores' },
      { label: 'Para Instituciones', href: '/recursos/instituciones' },
      { label: 'Acceso Individual', href: '/recursos/acceso' },
    ],
  },
  {
    label: 'Nosotros',
    href: '/nosotros',
    items: [
      { label: 'Sobre CENIE Editorial', href: '/nosotros' },
      { label: 'Traducciones al Español', href: '/nosotros/traducciones' },
      { label: 'Noticias', href: '/noticias' },
      { label: 'Contacto y Soporte', href: '/nosotros/contacto' },
    ],
  },
]

export const footerNavigation: NavigationItem[] = [
  {
    label: 'Producto',
    href: '/producto',
    items: [
      { label: 'Explorar Catálogo', href: '/catalogo' },
      { label: 'Próximamente', href: '/proximamente' },
      { label: 'Nuestra Tecnología IA', href: '/tecnologia' },
      { label: 'Traducciones al Español', href: '/nosotros/traducciones' },
      { label: 'Publicaciones Destacadas', href: '/destacados' },
    ],
  },
  {
    label: 'Para...',
    href: '/para',
    items: [
      { label: 'Autores', href: '/recursos/autores' },
      { label: 'Instituciones y Bibliotecas', href: '/recursos/instituciones' },
      { label: 'Investigadores y Lectores', href: '/recursos/acceso' },
      { label: 'Estudiantes', href: '/recursos/estudiantes' },
    ],
  },
  {
    label: 'CENIE Editorial',
    href: '/nosotros',
    items: [
      { label: 'Sobre Nosotros', href: '/nosotros' },
      { label: 'Comité Editorial', href: '/nosotros/comite' },
      { label: 'Contacto y Soporte', href: '/nosotros/contacto' },
      { label: 'Únete a la Comunidad', href: '/nosotros/comunidad' },
    ],
  },
]

export const legalNavigation: NavigationItem[] = [
  {
    label: 'Política de Privacidad',
    href: '/privacidad',
  },
  {
    label: 'Términos de Servicio',
    href: '/terminos',
  },
]
