"use client"

import { useState } from "react"
import { useAuth } from "../../../contexts/auth-context"
import styles from "./user-dropdown.module.css"

export function UserDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className={styles.dropdown}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.trigger}>
        <img src={user.avatar || "/placeholder-user.jpg"} alt={user.name} className={styles.avatar} />
        <span className={styles.name}>{user.name}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
          <div className={styles.divider} />
          <button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
