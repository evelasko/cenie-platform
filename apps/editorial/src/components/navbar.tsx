'use client'

import { useState } from 'react'
import { useAuth } from '@cenie/firebase/auth'
import { Button } from '@cenie/ui'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useRouter } from 'next/navigation'
import { LogoEditorial } from '@cenie/ui'
import { TYPOGRAPHY } from '@/lib/typography'
import Link from 'next/link'

export default function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
      router.push('/sign-in')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const recursos = [
    { title: 'Publicar con Nosotros', href: '/recursos/autores' },
    { title: 'Para Instituciones', href: '/recursos/instituciones' },
    { title: 'Acceso Individual', href: '/recursos/acceso' },
  ]

  const nosotros = [
    { title: 'Sobre CENIE Editorial', href: '/nosotros' },
    { title: 'Traducciones al Español', href: '/nosotros/traducciones' },
    { title: 'Noticias', href: '/noticias' },
    { title: 'Contacto y Soporte', href: '/nosotros/contacto' },
  ]

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-300 h-8 w-48 rounded"></div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <LogoEditorial />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-12">
              <ul className="flex items-center space-x-8">
                <li>
                  <Link
                    href="/catalogo"
                    className={`${TYPOGRAPHY.button} text-gray-900 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-colors`}
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tecnologia"
                    className={`${TYPOGRAPHY.button} text-gray-900 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-colors`}
                  >
                    Tecnología
                  </Link>
                </li>
                <li
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown('recursos')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`${TYPOGRAPHY.button} text-gray-900 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-colors flex items-center`}
                  >
                    Recursos
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activeDropdown === 'recursos' && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg border border-gray-200 py-4">
                      <ul className="space-y-3">
                        {recursos.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`${TYPOGRAPHY.bodyBase} block px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50`}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
                <li
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown('nosotros')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`${TYPOGRAPHY.button} text-gray-900 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-colors flex items-center`}
                  >
                    Nosotros
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activeDropdown === 'nosotros' && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg border border-gray-200 py-4">
                      <ul className="space-y-3">
                        {nosotros.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`${TYPOGRAPHY.bodyBase} block px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50`}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                className="text-gray-900 hover:text-gray-600 transition-colors"
                aria-label="Buscar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              {user && (
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-6 py-6">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/catalogo"
                    className={`${TYPOGRAPHY.bodyBase} block py-2 text-gray-900 hover:text-gray-600`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tecnologia"
                    className={`${TYPOGRAPHY.bodyBase} block py-2 text-gray-900 hover:text-gray-600`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tecnología
                  </Link>
                </li>
                <li>
                  <div className={`${TYPOGRAPHY.bodyBase} py-2 text-gray-500 font-semibold`}>
                    Recursos
                  </div>
                  <ul className="ml-4 space-y-2 mt-2">
                    {recursos.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`${TYPOGRAPHY.bodySmall} block py-1 text-gray-700 hover:text-gray-900`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className={`${TYPOGRAPHY.bodyBase} py-2 text-gray-500 font-semibold`}>
                    Nosotros
                  </div>
                  <ul className="ml-4 space-y-2 mt-2">
                    {nosotros.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`${TYPOGRAPHY.bodySmall} block py-1 text-gray-700 hover:text-gray-900`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {user && (
                  <li className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Cerrar Sesión
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
