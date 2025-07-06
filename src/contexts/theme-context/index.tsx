"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Theme, ThemeContextType } from "./types"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("whatsapp-summarizer-theme") as Theme
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || systemTheme

    setThemeState(initialTheme)
    document.documentElement.setAttribute("data-theme", initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("whatsapp-summarizer-theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {mounted ? children : <div className="loading-placeholder">{children}</div>}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
