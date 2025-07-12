"use client"

import * as React from 'react';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorBoundary } from "./error-boundary"

declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}

const ThemeIcon = ({ isDark }: { isDark: boolean }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isDark ? 'sun' : 'moon'}
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 45 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="h-5 w-5"
      >
        {isDark ? (
          <Sun className="h-full w-full" aria-hidden="true" />
        ) : (
          <Moon className="h-full w-full" aria-hidden="true" />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

const LoadingIcon = () => (
  <motion.div 
    className="h-5 w-5 rounded-full bg-muted"
    animate={{ 
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity,
      ease: 'easeInOut' 
    }}
  />
)

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { theme, setTheme, systemTheme } = useTheme()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  
  // Determine the current theme, considering system preference
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'
  
  // Track animation state to prevent rapid toggles
  const [isAnimating, setIsAnimating] = React.useState(false)
  const animationTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  // Ensure we only render UI once mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  
  const toggleTheme = () => {
    if (isAnimating) return
    
    const newTheme = isDark ? 'light' : 'dark'
    setIsAnimating(true)
    setTheme(newTheme)
    
    // Prevent rapid toggles during animation
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-lg"
        aria-label="Toggle theme"
        disabled
      >
        <LoadingIcon />
      </Button>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <button
          onClick={() => window.location.reload()}
          className="p-2 text-red-500"
        >
          Error loading theme toggle. Click to reload.
        </button>
      }
    >
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className={`relative h-9 w-9 rounded-lg transition-colors ${
          isHovered ? 'bg-accent/10' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleTheme}
        disabled={isAnimating}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <ThemeIcon isDark={isDark} />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </ErrorBoundary>
  )
}
