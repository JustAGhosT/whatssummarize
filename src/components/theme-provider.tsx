"use client"

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="whatsapp-summarizer-theme"
    >
      <ThemeWatcher />
      {children}
    </NextThemesProvider>
  )
}

// This component ensures the theme class is properly applied to the document element
function ThemeWatcher() {
  const { theme, systemTheme } = useNextTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes
    root.classList.remove('light', 'dark')
    
    // Add the current theme class
    if (currentTheme) {
      root.classList.add(currentTheme)
      root.style.colorScheme = currentTheme
    }
    
    // Set data-theme attribute for CSS variables
    root.setAttribute('data-theme', currentTheme || 'light')
  }, [currentTheme])

  return null
}
