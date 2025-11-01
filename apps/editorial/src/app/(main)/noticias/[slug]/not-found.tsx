import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="type-display-1 mb-4">Noticia no encontrada</h1>
        <p className="type-body-large text-muted-foreground mb-8">
          Lo sentimos, no pudimos encontrar la noticia que buscas. Puede que haya sido movida o
          eliminada.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/noticias"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors type-button"
          >
            Ver todas las noticias
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors type-button"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
