"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../../contexts/auth-context"
import { useRouter } from "next/navigation"
import styles from "./user-dropdown.module.css"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleNavigation = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    router.push("/")
  }

  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  if (!user) return null

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.avatar ? (
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className={styles.avatarImage} />
            ) : (
              <span className={styles.avatarInitial}>{user.name.charAt(0).toUpperCase()}</span>
            )}
            <div className={`${styles.statusIndicator} ${user.isOnline ? styles.online : styles.offline}`} />
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>
              {user.role === "admin" && "👑 Admin"}
              {user.role === "super_admin" && "⭐ Super Admin"}
              {user.role === "moderator" && "🛡️ Moderator"}
              {user.role === "user" && "👤 User"}
            </div>
          </div>
          <div className={`${styles.chevron} ${isOpen ? styles.open : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <div className={styles.headerAvatar}>
              {user.avatar ? (
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className={styles.headerAvatarImage} />
              ) : (
                <span className={styles.headerAvatarInitial}>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className={styles.headerInfo}>
              <div className={styles.headerName}>{user.name}</div>
              <div className={styles.headerEmail}>{user.email}</div>
              <div className={styles.headerStatus}>
                <span className={`${styles.statusDot} ${user.isOnline ? styles.online : styles.offline}`} />
                {user.isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          {/* Profile Section */}
          <div className={styles.dropdownSection}>
            <div className={styles.sectionLabel}>Profile</div>
            <button className={styles.dropdownItem} onClick={() => handleNavigation("/profile")} role="menuitem">
              <span className={styles.itemIcon}>👤</span>
              <span className={styles.itemText}>My Profile</span>
            </button>

            <button className={styles.dropdownItem} onClick={() => handleNavigation("/settings")} role="menuitem">
              <span className={styles.itemIcon}>⚙️</span>
              <span className={styles.itemText}>Account Settings</span>
            </button>
          </div>

          <div className={styles.dropdownDivider} />

          {/* Configuration Section */}
          <div className={styles.dropdownSection}>
            <div className={styles.sectionLabel}>Configuration</div>
            <button className={styles.dropdownItem} onClick={() => handleNavigation("/customize")} role="menuitem">
              <span className={styles.itemIcon}>🎨</span>
              <span className={styles.itemText}>Customize</span>
              <span className={styles.itemDescription}>App Settings</span>
            </button>

            <button className={styles.dropdownItem} onClick={() => handleNavigation("/distribution")} role="menuitem">
              <span className={styles.itemIcon}>📤</span>
              <span className={styles.itemText}>Distribution</span>
              <span className={styles.itemDescription}>Share & Export</span>
            </button>

            <button className={styles.dropdownItem} onClick={() => handleNavigation("/notifications")} role="menuitem">
              <span className={styles.itemIcon}>🔔</span>
              <span className={styles.itemText}>Notifications</span>
              <span className={styles.itemDescription}>Alert Settings</span>
            </button>
          </div>

          {isAdmin && (
            <>
              <div className={styles.dropdownDivider} />
              <div className={styles.dropdownSection}>
                <div className={styles.sectionLabel}>Administration</div>
                <button className={styles.dropdownItem} onClick={() => handleNavigation("/admin")} role="menuitem">
                  <span className={styles.itemIcon}>🛠️</span>
                  <span className={styles.itemText}>Admin Panel</span>
                  <span className={styles.itemBadge}>Admin</span>
                </button>
              </div>
            </>
          )}

          <div className={styles.dropdownDivider} />

          <div className={styles.dropdownSection}>
            <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout} role="menuitem">
              <span className={styles.itemIcon}>🚪</span>
              <span className={styles.itemText}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
