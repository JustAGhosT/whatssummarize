"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../../../contexts/theme-context"
import styles from "./theme-toggle.module.css"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className={styles.toggle} aria-label="Toggle theme">
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>🌙</span>
        </div>
      </button>
    )
  }

  return (
    <button className={styles.toggle} onClick={toggleTheme} aria-label="Toggle theme">
      <div className={`${styles.iconWrapper} ${theme === "dark" ? styles.dark : styles.light}`}>
        <span className={`${styles.icon} ${styles.sun}`}>☀️</span>
        <span className={`${styles.icon} ${styles.moon}`}>🌙</span>
      </div>
    </button>
  )
}
