'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { type LocaleString, type NavigationItem } from '../../lib/types'
import BurgerButton from '../buttons/BurgerButton'
import clsx from 'clsx'
import LocaleSwitcher from './LocaleSwitcher'
import { kDefaultNavbarHeight } from '../../constants/styles'

interface NavBarProps {
  locale: LocaleString
  items: NavigationItem[]
}

// Animation variants for the drawer container
const drawerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.6, 1],
      },
      opacity: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
        delay: 0.1,
      },
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: [0.4, 0.0, 1, 1],
        delay: 0.1,
      },
      opacity: {
        duration: 0.2,
        ease: [0.4, 0.0, 1, 1],
      },
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

// Animation variants for individual menu items
const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
}

// Animation variants for the footer
const footerVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
}

// Animation variants for desktop nav items fade
const desktopNavVariants = {
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
}

export default function NavBar({ locale, items }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Fixed Navbar - Always 64px height */}
      <motion.nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 backdrop-blur-md',
          kDefaultNavbarHeight
          // isMenuOpen ? "bg-background" : "bg-background/75"
        )}
        animate={{
          backgroundColor: isMenuOpen
            ? 'var(--color-nav-background)'
            : 'color-mix(in srgb, var(--color-nav-background) 70%, transparent)',
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={clsx('flex items-center justify-between', kDefaultNavbarHeight)}>
            {/* Logo */}
            <div className="shrink-0 pr-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="/media/brand/logo-black.svg"
                  alt="CENIE Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto dark:invert"
                />
              </Link>
            </div>

            {/* Desktop Navigation Items - Hidden on mobile, fade on drawer open */}
            <motion.div
              className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1"
              variants={desktopNavVariants}
              animate={isMenuOpen ? 'hidden' : 'visible'}
              transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <div className="flex items-center justify-evenly w-full max-w-2xl">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={clsx(
                      'text-button-small whitespace-nowrap transition-colors duration-300 ease-in-out',
                      'text-(--color-nav-text) hover:text-(--color-nav-hover)'
                    )}
                  >
                    <span className="font-semibold">{item.label[locale].toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Hamburger Menu Button - Always visible */}
            <div className="flex items-center pl-8">
              <BurgerButton isOpen={isMenuOpen} onClick={toggleMenu} width={90} height={32} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Drawer Container - Positioned below navbar */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            key="drawer"
            className="fixed top-16 left-0 right-0 z-40 bg-(--color-nav-background) overflow-hidden"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              {/* Navigation Items */}
              <div className="py-8">
                <motion.div className="space-y-8">
                  {items.map((item, index) => (
                    <motion.div key={index} variants={menuItemVariants}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={clsx(
                          'block text-display-text-extra-large whitespace-nowrap transition-colors duration-300 ease-in-out',
                          'text-(--color-nav-text) hover:text-(--color-nav-hover)'
                        )}
                      >
                        {item.label[locale]}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                className="pt-12 pb-8"
                variants={footerVariants}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                  delay: 0.1,
                }}
              >
                {/* Single Row Footer */}
                <div className="flex justify-between items-center text-caption-small text-muted-foreground">
                  <a
                    href="mailto:contact@cenie.org"
                    className={clsx(
                      'transition-colors duration-300 ease-in-out',
                      'hover:text-(--color-nav-hover)'
                    )}
                  >
                    contact@cenie.org
                  </a>

                  {/* <div className="flex items-center space-x-8">
                    <Link
                      href="/privacy-policy"
                      onClick={closeMenu}
                      className={clsx(
                        'text-body-small transition-colors duration-300 ease-in-out',
                        'text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-hover)]'
                      )}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms-of-service"
                      onClick={closeMenu}
                      className={clsx(
                        'text-body-small transition-colors duration-300 ease-in-out',
                        'text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-hover)]'
                      )}
                    >
                      Terms of Service
                    </Link>
                  </div> */}

                  <LocaleSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
