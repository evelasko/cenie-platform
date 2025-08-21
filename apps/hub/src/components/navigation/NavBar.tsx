'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { type NavigationItem } from "../../lib/types"
import clsx from 'clsx'

interface NavBarProps {
  items: NavigationItem[]
}

// Animation variants
const drawerVariants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
}

const itemVariants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    }
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  }
}

const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  }
}

export default function NavBar({ items }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={clsx("fixed top-0 left-0 right-0 z-50 backdrop-blur-md", {
        "bg-background": !isMenuOpen,
        "bg-background/80": isMenuOpen
      })}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 pr-8">
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

            {/* Desktop Navigation Items - Hidden on mobile */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
              <div className="flex items-center justify-evenly w-full max-w-2xl">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={clsx(
                      "text-button-small whitespace-nowrap transition-colors duration-300 ease-in-out",
                      "text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-hover)]"
                    )}
                  >
                    <span className="font-semibold">{item.label.toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Hamburger Menu Button - Always visible */}
            <div className="flex items-center pl-8">
              <button
                onClick={toggleMenu}
                className={clsx(
                  "relative w-8 h-8 flex flex-col justify-center items-center rounded-sm group",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
                aria-label="Toggle menu"
              >
                <span
                  className={clsx(
                    "absolute block h-0.5 w-6 transition-all duration-300 ease-in-out",
                    "bg-[color:var(--color-nav-text)] group-hover:bg-[color:var(--color-nav-hover)]",
                    {
                      "rotate-45 bg-[color:var(--color-nav-hover)]": isMenuOpen,
                      "-translate-y-1": !isMenuOpen
                    }
                  )}
                  style={{ transformOrigin: 'center' }}
                />
                <span
                  className={clsx(
                    "absolute block h-0.5 w-6 transition-all duration-300 ease-in-out",
                    "bg-[color:var(--color-nav-text)] group-hover:bg-[color:var(--color-nav-hover)]",
                    {
                      "-rotate-45 bg-[color:var(--color-nav-hover)]": isMenuOpen,
                      "translate-y-1": !isMenuOpen
                    }
                  )}
                  style={{ transformOrigin: 'center' }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Drawer - Framer Motion Implementation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop - starts below navbar */}
            <motion.div 
              className="fixed z-40 bg-black/50 backdrop-blur-sm"
              onClick={closeMenu}
              style={{ 
                top: '64px', 
                left: '0', 
                right: '0', 
                bottom: '0' 
              }}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            
                      {/* Drawer Content - Expands downward from navbar */}
          <motion.div 
            className="fixed top-16 left-0 right-0 z-50 bg-background"
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
                      <motion.div
                        key={index}
                        variants={itemVariants}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={clsx(
                            "block text-display-text-extra-large whitespace-nowrap transition-colors duration-300 ease-in-out",
                            "text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-hover)]"
                          )}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                              {/* Footer */}
              <div className="pt-12 pb-8">
                {/* Single Row Footer */}
                <div className="flex justify-between items-center text-caption-small text-muted-foreground">
                  <a 
                    href="mailto:contact@cenie.org"
                    className={clsx(
                      "transition-colors duration-300 ease-in-out",
                      "hover:text-[color:var(--color-nav-hover)]"
                    )}
                  >
                    contact@cenie.org
                  </a>
                  
                  <div className="flex items-center space-x-8">
                    <Link
                      href="/privacy-policy"
                      onClick={closeMenu}
                      className={clsx(
                        "text-body-small transition-colors duration-300 ease-in-out",
                        "text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-hover)]"
                      )}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms-of-service"
                      onClick={closeMenu}
                      className={clsx(
                        "text-body-small transition-colors duration-300 ease-in-out",
                        "text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-hover)]"
                      )}
                    >
                      Terms of Service
                    </Link>
                  </div>
                  
                  <span>
                    © {new Date().getFullYear()} CENIE
                  </span>
                </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}