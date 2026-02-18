'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@cenie/firebase/auth'
import Button from '@/components/ui/Button'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth } from '@cenie/firebase/client'
import { useRouter } from 'next/navigation'
import { LogoEditorial } from '@cenie/ui'
import { cn } from '@cenie/ui/lib'
import { TYPOGRAPHY } from '@/lib/typography'
import Link from 'next/link'
import type { NavigationItem } from '@/lib/navigation'
import { logger } from '@/lib/logger-client'
import clsx from 'clsx'

interface NavbarProps {
  navigationItems: NavigationItem[]
  showAuth?: boolean
  logoColor?: string
}

export default function Navbar({
  navigationItems,
  showAuth = true,
  logoColor = 'var(--color-primary)',
}: NavbarProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [overlayMounted, setOverlayMounted] = useState(false)

  // Open overlay: mount then animate in (double rAF ensures initial opacity-0 is painted before transition)
  useEffect(() => {
    if (mobileMenuOpen) {
      setOverlayMounted(true)
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setOverlayVisible(true))
      })
      return () => cancelAnimationFrame(id)
    }
    return undefined
  }, [mobileMenuOpen])

  // Close overlay with fade-out, then unmount
  function closeMenu() {
    setOverlayVisible(false)
    setTimeout(() => {
      setOverlayMounted(false)
      setMobileMenuOpen(false)
    }, 300)
  }

  // Escape key and body scroll lock
  useEffect(() => {
    if (!overlayMounted) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleEscape)

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [overlayMounted, mobileMenuOpen])

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
      router.push('/sign-in')
    } catch (error) {
      logger.error('Sign out error', { error })
    }
  }

  if (loading) {
    return (
      <header className="h-16 lg:h-24 bg-white/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
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
      <header
        className={clsx(
          overlayVisible ? 'bg-white' : 'bg-white/80',
          'sticky top-0 z-50 h-16 lg:h-24 backdrop-blur-md border-b border-border/40'
        )}
      >
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 hover:opacity-80 transition-opacity flex items-center"
            >
              <LogoEditorial color={logoColor} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-12">
              <ul className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <li key={item.href} className={item.items ? 'relative group' : ''}>
                    {item.items ? (
                      <>
                        <button
                          className={`${TYPOGRAPHY.bodyLarge} inline-flex items-center text-gray-900 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-colors`}
                        >
                          {item.label}
                          <svg
                            className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180 duration-200"
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
                        <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                          <div className="w-64 bg-white shadow-lg border border-gray-200 py-4 rounded-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                            <ul className="space-y-1">
                              {item.items.map((subItem) => (
                                <li key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    className={`${TYPOGRAPHY.bodyBase} block px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors`}
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`${TYPOGRAPHY.bodyLarge} inline-block text-gray-900 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-900 pb-1 transition-colors`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
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
              {showAuth && user && (
                <Button onClick={handleSignOut} variant="outlined" size="sm">
                  Cerrar Sesión
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-900"
              onClick={() => (mobileMenuOpen ? closeMenu() : setMobileMenuOpen(true))}
              aria-label="Menú"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0.1em"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0.1em"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Fullscreen Overlay (outside header to avoid backdrop-filter containing block) */}
      {overlayMounted && (
        <div
          className={cn(
            'fixed inset-0 top-16 lg:top-24 z-100 lg:hidden',
            'bg-white',
            'transition-opacity duration-500 ease-in-out',
            overlayVisible ? 'opacity-100' : 'opacity-0'
          )}
          onClick={closeMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          aria-hidden={!overlayVisible}
        >
          <nav className="container mx-auto px-8 py-8" onClick={(e) => e.stopPropagation()}>
            <ul className="space-y-4">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  {item.items ? (
                    <>
                      <div className="type-menu-large py-2 text-gray-900">{item.label}</div>
                      {/* <ul className="ml-4 space-y-2 mt-2">
                        {item.items.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={`${TYPOGRAPHY.bodySmall} block py-1 text-gray-700 hover:text-gray-900`}
                              onClick={closeMenu}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul> */}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="type-menu-large block py-2 text-gray-900"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              {showAuth && user && (
                <li className="mt-12 pt-12 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      handleSignOut()
                      closeMenu()
                    }}
                    variant="outlined"
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
    </>
  )
}
