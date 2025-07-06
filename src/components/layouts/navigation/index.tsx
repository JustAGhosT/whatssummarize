"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Moon,
  Sun,
  User,
  Settings,
  ChevronDown,
  Menu,
  X,
  Home,
  Users,
  UserCircle,
  MoreHorizontal,
  Shuffle,
  Share2,
  BellRing,
  Palette,
  LogOut,
  UserCog,
} from "lucide-react"
import { useTheme } from "../../../contexts/theme-context"
import { useAuth } from "../../../contexts/auth-context"
import { SearchBar } from "../../common/search-bar"
import { NotificationBell } from "../../common/notification-bell"
import styles from "./navigation.module.css"

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const moreDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "k":
            e.preventDefault()
            setSearchOpen(true)
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
          case "c":
            e.preventDefault()
            window.location.href = "/cross-platform-groups"
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const coreNavItems = [
    { href: "/", label: "Dashboard", icon: Home, shortcut: "⌘D" },
    { href: "/groups", label: "Groups", icon: Users, shortcut: "⌘G" },
    { href: "/personal", label: "Personal", icon: UserCircle, shortcut: "⌘P" },
  ]

  const moreNavItems = [
    { href: "/cross-platform-groups", label: "Cross-Platform", icon: Shuffle, shortcut: "⌘C" },
    { href: "/distribution", label: "Distribution", icon: Share2 },
    { href: "/notifications", label: "Notifications", icon: BellRing },
    { href: "/customize", label: "Customize", icon: Palette },
  ]

  const mobileSettingsItems = [
    { href: "/distribution", label: "Distribution", icon: Share2 },
    { href: "/notifications", label: "Notifications", icon: BellRing },
    { href: "/customize", label: "Customize", icon: Palette },
  ]

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.container}>
          {/* Left Section - Core Features */}
          <div className={styles.leftSection}>
            <div className={styles.coreLabel}>CORE FEATURES</div>

            <div className={styles.navItems}>
              {coreNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    <span className={styles.shortcut}>{item.shortcut}</span>
                  </Link>
                )
              })}

              {/* More Dropdown */}
              <div className={styles.dropdown} ref={moreDropdownRef}>
                <button
                  className={`${styles.navItem} ${styles.moreButton}`}
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                >
                  <MoreHorizontal size={16} />
                  <span>More</span>
                  <ChevronDown size={14} className={`${styles.chevron} ${moreDropdownOpen ? styles.open : ""}`} />
                </button>

                {moreDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {moreNavItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`${styles.dropdownItem} ${isActive ? styles.active : ""}`}
                          onClick={() => setMoreDropdownOpen(false)}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                          {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - User Controls */}
          <div className={styles.rightSection}>
            {/* Search */}
            <button className={styles.iconButton} onClick={() => setSearchOpen(true)} title="Search (⌘K)">
              <Search size={18} />
            </button>

            {/* Notifications */}
            <NotificationBell />

            {/* Theme Toggle */}
            <button
              className={styles.iconButton}
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Settings Hub */}
            <div className={`${styles.dropdown} ${styles.mobileOnly}`}>
              <button className={styles.iconButton}>
                <Settings size={18} />
              </button>
              <div className={styles.dropdownMenu}>
                {mobileSettingsItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* User Profile */}
            <div className={styles.dropdown} ref={userDropdownRef}>
              <button className={styles.userButton} onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                <div className={styles.userAvatar}>
                  <User size={16} />
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user?.name || "John Doe"}</span>
                  <span className={styles.userRole}>User</span>
                </div>
                <ChevronDown size={14} className={`${styles.chevron} ${userDropdownOpen ? styles.open : ""}`} />
              </button>

              {userDropdownOpen && (
                <div className={`${styles.dropdownMenu} ${styles.userDropdownMenu}`}>
                  <div className={styles.userDropdownHeader}>
                    <div className={styles.userAvatarLarge}>
                      <User size={20} />
                    </div>
                    <div className={styles.userDetails}>
                      <div className={styles.userNameLarge}>{user?.name || "John Doe"}</div>
                      <div className={styles.userEmail}>{user?.email || "john@example.com"}</div>
                      <div className={styles.userStatus}>
                        <div className={styles.statusDot}></div>
                        Offline
                      </div>
                    </div>
                  </div>

                  <div className={styles.dropdownSection}>
                    <div className={styles.sectionLabel}>PROFILE</div>
                    <Link href="/profile" className={styles.dropdownItem}>
                      <UserCircle size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link href="/settings" className={styles.dropdownItem}>
                      <UserCog size={16} />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div className={styles.dropdownSection}>
                    <div className={styles.sectionLabel}>CONFIGURATION</div>
                    <Link href="/customize" className={styles.dropdownItem}>
                      <Palette size={16} />
                      <span>Customize</span>
                      <span className={styles.itemDescription}>App Settings</span>
                    </Link>
                    <Link href="/distribution" className={styles.dropdownItem}>
                      <Share2 size={16} />
                      <span>Distribution</span>
                      <span className={styles.itemDescription}>Share & Export</span>
                    </Link>
                    <Link href="/notifications" className={styles.dropdownItem}>
                      <BellRing size={16} />
                      <span>Notifications</span>
                      <span className={styles.itemDescription}>Alert Settings</span>
                    </Link>
                  </div>

                  <div className={styles.dropdownDivider}></div>

                  <button className={styles.dropdownItem} onClick={logout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={`${styles.iconButton} ${styles.mobileMenuToggle}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              <div className={styles.mobileSection}>
                <div className={styles.mobileSectionTitle}>Core Features</div>
                {coreNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.mobileMenuItem} ${isActive ? styles.active : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              <div className={styles.mobileSection}>
                <div className={styles.mobileSectionTitle}>More Features</div>
                {moreNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.mobileMenuItem} ${isActive ? styles.active : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
    </>
  )
}
