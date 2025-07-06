"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../../../contexts/auth-context"
import { ThemeToggle } from "../../common/theme-toggle"
import { UserDropdown } from "../../common/user-dropdown"
import { LoginModal } from "../../auth/login-modal"
import { SignupModal } from "../../auth/signup-modal"
import { SearchBar } from "../../common/search-bar"
import { NotificationBell } from "../../common/notification-bell"
import { Breadcrumb } from "../../common/breadcrumb"
import styles from "./navigation.module.css"

const coreNavigationItems = [
  { href: "/", label: "Dashboard", icon: "🏠", description: "Overview & Analytics", shortcut: "D" },
  { href: "/groups", label: "Groups", icon: "👥", description: "Group Management", shortcut: "G" },
  { href: "/personal", label: "Personal", icon: "👤", description: "Personal Summaries", shortcut: "P" },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "k":
            e.preventDefault()
            setIsSearchOpen(true)
            break
          case "d":
            e.preventDefault()
            window.location.href = "/"
            break
          case "g":
            e.preventDefault()
            window.location.href = "/groups"
            break
          case "p":
            e.preventDefault()
            window.location.href = "/personal"
            break
        }
      }

      if (e.key === "Escape") {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  const isActivePath = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>WhatsApp</span>
              <span className={styles.logoSubtitle}>Summarizer</span>
            </div>
          </Link>

          {/* Core Features Navigation */}
          <div className={styles.coreNav}>
            <div className={styles.navGroupLabel}>CORE FEATURES</div>
            <div className={styles.navItems}>
              {coreNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActivePath(item.href) ? styles.active : ""}`}
                  title={`${item.description} (Ctrl+${item.shortcut})`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navText}>{item.label}</span>
                  {isActivePath(item.href) && <div className={styles.activeIndicator} />}
                  <span className={styles.shortcut}>⌘{item.shortcut}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <SearchBar
              isOpen={isSearchOpen}
              onToggle={() => setIsSearchOpen(!isSearchOpen)}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>

          {/* Right Side Actions */}
          <div className={styles.actions}>
            {user && <NotificationBell />}
            <ThemeToggle />

            {user ? (
              <UserDropdown />
            ) : (
              <div className={styles.authButtons}>
                <button className={styles.loginButton} onClick={() => setIsLoginOpen(true)}>
                  Sign In
                </button>
                <button className={styles.signupButton} onClick={() => setIsSignupOpen(true)}>
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={styles.mobileNav} role="dialog" aria-modal="true">
            <div className={styles.mobileNavOverlay} onClick={closeMenu} />
            <div className={styles.mobileNavContent}>
              <div className={styles.mobileNavHeader}>
                <div className={styles.mobileNavLogo}>
                  <div className={styles.logoIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className={styles.logoText}>WhatsApp Summarizer</span>
                </div>
                <button className={styles.mobileNavClose} onClick={closeMenu} aria-label="Close menu">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className={styles.mobileNavBody}>
                <div className={styles.mobileSearchContainer}>
                  <SearchBar isOpen={true} onToggle={() => {}} onClose={closeMenu} isMobile={true} />
                </div>

                <div className={styles.mobileNavGroup}>
                  <div className={styles.mobileGroupTitle}>Core Features</div>
                  <div className={styles.mobileGroupItems}>
                    {coreNavigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.mobileNavLink} ${isActivePath(item.href) ? styles.active : ""}`}
                        onClick={closeMenu}
                      >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <div className={styles.mobileNavLinkContent}>
                          <span className={styles.navText}>{item.label}</span>
                          <span className={styles.navDescription}>{item.description}</span>
                        </div>
                        {isActivePath(item.href) && <div className={styles.mobileActiveIndicator} />}
                      </Link>
                    ))}
                  </div>
                </div>

                {!user && (
                  <div className={styles.mobileAuthSection}>
                    <button
                      className={styles.mobileLoginButton}
                      onClick={() => {
                        setIsLoginOpen(true)
                        closeMenu()
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className={styles.mobileSignupButton}
                      onClick={() => {
                        setIsSignupOpen(true)
                        closeMenu()
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false)
          setIsSignupOpen(true)
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </>
  )
}
