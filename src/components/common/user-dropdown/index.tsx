"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "../../../contexts/auth-context"
import styles from "./user-dropdown.module.css"

export function UserDropdown() {
  const { state, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!state.user) return null

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="true">
        <Image
          src={state.user.avatar || "/placeholder.svg"}
          alt={state.user.name}
          width={32}
          height={32}
          className={styles.avatar}
        />
        <span className={styles.name}>{state.user.name}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{state.user.name}</div>
            <div className={styles.userEmail}>{state.user.email}</div>
          </div>

          <div className={styles.divider} />

          <button className={styles.menuItem} onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 14C3 11.7909 5.23858 10 8 10C10.7614 10 13 11.7909 13 14"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Profile Settings
          </button>

          <button className={styles.menuItem} onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1V3M8 13V15M3.5 3.5L4.91 4.91M11.09 11.09L12.5 12.5M1 8H3M13 8H15M3.5 12.5L4.91 11.09M11.09 4.91L12.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Preferences
          </button>

          <button className={styles.menuItem} onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 4V8L11 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Billing
          </button>

          <div className={styles.divider} />

          <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 15H3C2.44772 15 2 14.5523 2 14V2C2 1.44772 2.44772 1 3 1H6M11 11L14 8M14 8L11 5M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}
