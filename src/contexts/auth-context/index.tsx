"use client"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { User } from "./types"

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  })

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        name: "John Doe",
        email: email,
        avatar: "/placeholder.svg?height=40&width=40&text=JD",
        createdAt: new Date().toISOString(),
      }

      setState((prev) => ({ ...prev, user: mockUser, isLoading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Invalid email or password",
        isLoading: false,
      }))
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful signup
      const mockUser: User = {
        id: "1",
        name: name,
        email: email,
        avatar: "/placeholder.svg?height=40&width=40&text=" + name.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString(),
      }

      setState((prev) => ({ ...prev, user: mockUser, isLoading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to create account",
        isLoading: false,
      }))
    }
  }

  const logout = () => {
    setState({ user: null, isLoading: false, error: null })
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  return <AuthContext.Provider value={{ state, login, signup, logout, clearError }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
