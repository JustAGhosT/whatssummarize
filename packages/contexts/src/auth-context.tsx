"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would verify the token with your backend
        const token = localStorage.getItem('authToken')
        if (token) {
          // TODO: Verify token with backend
          // For now, we'll just set a mock user
          setUser({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
          })
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/login', { email, password })
      // const { user, token } = response.data
      
      // Mock response
      const user = {
        id: '1',
        name: 'John Doe',
        email: email
      }
      const token = 'mock-jwt-token'
      
      localStorage.setItem('authToken', token)
      setUser(user)
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Login failed. Please check your credentials and try again.')
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/signup', { email, password, name })
      // const { user, token } = response.data
      
      // Mock response
      const user = {
        id: '1',
        name: name,
        email: email
      }
      const token = 'mock-jwt-token'
      
      localStorage.setItem('authToken', token)
      setUser(user)
    } catch (error) {
      console.error('Signup failed:', error)
      throw new Error('Signup failed. Please try again.')
    }
  }

  const logout = async () => {
    try {
      // TODO: Call logout API if needed
      // await api.post('/auth/logout')
      
      localStorage.removeItem('authToken')
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      throw new Error('Logout failed. Please try again.')
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
