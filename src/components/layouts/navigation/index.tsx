"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../../../contexts/auth-context"
import { LoginModal } from "../../auth/login-modal"
import { SignupModal } from "../../auth/signup-modal"
import { UserDropdown } from "../../common/user-dropdown"
import styles from "./navigation.module.css"

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/customize", label: "Customize", icon: "⚙️" },
  { href: "/groups", label: "Groups", icon: "👥" },
  { href: "/distribution", label: "Distribution", icon: "📤" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/admin", label: "Admin", icon: "🛠️" },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>💬</span>
              <span className={styles.logoText}>WhatsApp Summarizer</span>
            </Link>
          </div>

          <div className={styles.menu}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.menuItem} ${pathname === item.href ? styles.active : ""}`}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <div className={styles.authButtons}>
                <button onClick={() => setShowLoginModal(true)} className={styles.loginBtn}>
                  Login
                </button>
                <button onClick={() => setShowSignupModal(true)} className={styles.signupBtn}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false)
          setShowSignupModal(true)
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}
