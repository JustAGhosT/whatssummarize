"use client"

import { useTheme } from "../../../contexts/theme-context"
import styles from "./theme-toggle.module.css"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <div className={`${styles.toggleInner} ${theme === "dark" ? styles.dark : ""}`}>
        <span className={styles.sun}>☀️</span>
        <span className={styles.moon}>🌙</span>
      </div>
    </button>
  )
}
