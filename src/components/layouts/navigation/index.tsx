"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./navigation.module.css"

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/groups", label: "Groups", icon: "👥" },
  { href: "/personal", label: "Personal", icon: "👤" },
  { href: "/customize", label: "Customize", icon: "⚙️" },
  { href: "/distribution", label: "Distribution", icon: "📤" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/admin", label: "Admin", icon: "🛠️" },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>💬</div>
            <span className={styles.logoText}>WhatsApp Summarizer</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}>
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Mobile menu button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ""}`}>
        <ul className={styles.mobileNavList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.mobileNavLink} ${pathname === item.href ? styles.mobileActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
