'use client'

import { useState } from 'react'
import { LogoEditorial } from '@cenie/ui'
import { TYPOGRAPHY } from '@/lib/typography'
import Link from 'next/link'
import type { NavigationItem } from '@/lib/navigation'
import { defaultSocialLinks, type SocialLink } from '@/lib/social'

interface FooterProps {
  navigationSections: NavigationItem[]
  legalLinks: NavigationItem[]
  socialLinks?: SocialLink[]
  showNewsletter?: boolean
  copyrightText?: string
  logoColor?: string
}

export default function Footer({
  navigationSections,
  legalLinks,
  socialLinks = defaultSocialLinks,
  showNewsletter = true,
  copyrightText = `© ${new Date().getFullYear()} CENIE Editorial. Todos los derechos reservados.`,
  logoColor,
}: FooterProps) {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${showNewsletter ? '4' : '3'} gap-12 pb-12 border-b border-gray-200`}
        >
          {/* Newsletter Section */}
          {showNewsletter && (
            <div className="lg:col-span-1">
              <h3 className={`${TYPOGRAPHY.h5} text-gray-900 mb-4`}>Mantente Informado</h3>
              <p className={`${TYPOGRAPHY.bodySmall} text-gray-600 mb-6`}>
                Recibe las últimas novedades y ofertas de CENIE Editorial
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                    className={`${TYPOGRAPHY.bodyBase} w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                  />
                </div>
                <button
                  type="submit"
                  className={`${TYPOGRAPHY.button} w-full bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors`}
                >
                  Suscribirse
                </button>
              </form>
            </div>
          )}

          {/* Dynamic Navigation Sections */}
          {navigationSections.map((section) => (
            <div key={section.href}>
              <h4 className={`${TYPOGRAPHY.h6} text-gray-900 mb-4`}>{section.label}</h4>
              {section.items && (
                <ul className="space-y-3">
                  {section.items.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`${TYPOGRAPHY.bodySmall} text-gray-600 hover:text-gray-900 transition-colors`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <LogoEditorial color={logoColor ?? 'var(--color-gray-500)'} />
            <p className={`${TYPOGRAPHY.caption} text-gray-500`}>{copyrightText}</p>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={social.title}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}

          {/* Legal Links */}
          {legalLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${TYPOGRAPHY.caption} text-gray-500 hover:text-gray-900 transition-colors`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
