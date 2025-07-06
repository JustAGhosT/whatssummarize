"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, User, Settings, Share2, Bell, Shield, Menu, X, MessageSquare } from "lucide-react"
import { UserDropdown } from "../../common/user-dropdown"
import styles from "./navigation.module.css"

const navigationItems = [
  { href: "/", label: "Dashboard", icon: BarChart3, color: "blue" },
  { href: "/groups", label: "Groups", icon: Users, color: "purple" },
  { href: "/personal", label: "Personal", icon: User, color: "pink" },
  { href: "/customize", label: "Customize", icon: Settings, color: "green" },
  { href: "/distribution", label: "Distribution", icon: Share2, color: "orange" },
  { href: "/notifications", label: "Notifications", icon: Bell, color: "yellow" },
  { href: "/admin", label: "Admin", icon: Shield, color: "red" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <MessageSquare size={24} />
              <div className={styles.logoGlow}></div>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>WhatsApp</span>
              <span className={styles.logoSubtitle}>Summarizer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navItems}>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ""} ${styles[`color-${item.color}`]}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {isActive && <div className={styles.activeIndicator}></div>}
                </Link>
              )
            })}
          </div>

          {/* User Actions */}
          <div className={styles.userActions}>
            <UserDropdown />
            <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileMenuLogo}>
                <MessageSquare size={20} />
                <span>WhatsApp Summarizer</span>
              </div>
              <button onClick={toggleMobileMenu} className={styles.mobileMenuClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.mobileMenuItems}>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileNavItem} ${isActive ? styles.active : ""} ${styles[`color-${item.color}`]}`}
                    onClick={toggleMobileMenu}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {isActive && <div className={styles.mobileActiveIndicator}></div>}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
