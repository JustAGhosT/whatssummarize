"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./navigation.module.css"
import { useState } from "react"
import { useAuth } from "../../../contexts/auth-context"
import { LoginModal } from "../../auth/login-modal"
import { SignupModal } from "../../auth/signup-modal"
import { UserDropdown } from "../../common/user-dropdown"

const navigationItems = [
  { href: "/", label: "Dashboard" },
  { href: "/groups", label: "Groups" },
  { href: "/customize", label: "Customize" },
  { href: "/distribution", label: "Distribution" },
  { href: "/notifications", label: "Notifications" },
  { href: "/admin", label: "Admin" },
]

export function Navigation() {
  const pathname = usePathname()
  const { state } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const handleSwitchToLogin = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            WhatsSummarize
          </Link>

          <div className={styles.navItems}>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className={styles.authButtons}>
            {state.user ? (
              <UserDropdown />
            ) : (
              <>
                <button className="btn-primary" onClick={() => setShowLoginModal(true)}>
                  Log In
                </button>
                <button className="btn-secondary" onClick={() => setShowSignupModal(true)}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}
